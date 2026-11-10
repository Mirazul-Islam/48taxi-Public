import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRICING, VEHICLES, DEFAULT_VEHICLE, ADDON_LIST, WAITING_LIST, EXAMPLE_TRIPS, tripFare, quote } from '../lib/pricing.js';
import { requestRoute } from '../lib/estimate.js';
import { money } from '../data/fares.js';

/* The fare formula, front and centre. */
export function FareFormula({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-brand-700/40 bg-gradient-to-b from-brand-700/10 to-card p-6 sm:p-8 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">How every fare is calculated</p>
      <p className="display mt-3 text-3xl text-white sm:text-[2.6rem]">The higher of <em>${PRICING.minimumFare}</em> or <em>${PRICING.perKm} × km</em>, plus the vehicle surcharge.</p>
      <p className="mt-4 text-[15px] text-ink-2">${PRICING.minimumFare} minimum on every trip, whatever the distance. Extra stops are ${PRICING.perStop} each. Over {PRICING.longDistanceKm} km, the Chevy Suburban and Cadillac Escalade are $2.50/km to cover fuel; every other vehicle stays at ${PRICING.perKm}/km.</p>
    </div>
  );
}

/* Vehicle surcharges with worked examples (matches the pricing guide). */
export function VehicleTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="table min-w-[720px]">
        <caption className="sr-only">Vehicle surcharges and example fares</caption>
        <thead>
          <tr><th>Class</th><th>Vehicle</th><th>Passengers</th><th className="text-right">Surcharge</th>{EXAMPLE_TRIPS.map((t) => <th key={t.km} className="text-right">{t.km} km trip</th>)}</tr>
        </thead>
        <tbody>
          {VEHICLES.map((v) => (
            <tr key={v.model}>
              <td className="text-ink-2">{v.cls}</td>
              <td className="font-medium text-white">{v.model}</td>
              <td>Up to {v.pax}</td>
              <td className="text-right tabular-nums">{v.surcharge ? `+${money(v.surcharge)}` : '$0'}</td>
              {EXAMPLE_TRIPS.map((t) => <td key={t.km} className="text-right tabular-nums">{money(tripFare(t.km, v.model))}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-3">Passenger counts are typical seating. Vehicle selection depends on availability. {EXAMPLE_TRIPS[1].km} km is about Halifax Stanfield (YHZ) to downtown Halifax.</p>
    </div>
  );
}

export function AddonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="table">
        <caption className="sr-only">Additional services</caption>
        <thead><tr><th>Service</th><th className="text-right">Price</th></tr></thead>
        <tbody>
          {ADDON_LIST.map(([k, v, note]) => (
            <tr key={k}><td><span className="text-white">{k}</span>{note && <span className="block text-sm text-ink-3">{note}</span>}</td><td className="whitespace-nowrap text-right font-semibold tabular-nums">{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WaitingTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="table">
        <caption className="sr-only">Waiting time</caption>
        <thead><tr><th>Pickup</th><th>Free waiting</th><th className="text-right">After that</th></tr></thead>
        <tbody>{WAITING_LIST.map(([a, b, c]) => <tr key={a}><td className="text-white">{a}</td><td className="text-ink-2">{b}</td><td className="text-right tabular-nums">{c}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

/* Line-by-line price breakdown for a quote() result. */
export function QuoteBreakdown({ q, minutes, note }) {
  return (
    <div aria-live="polite">
      <dl className="divide-y divide-white/[0.07] text-[15px]">
        {q.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-4 py-2"><dt className="text-ink-2">{l.label}</dt><dd className="tabular-nums text-white">{money(l.amount)}</dd></div>
        ))}
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-white/15 pt-3">
        <p className="font-semibold text-white">{q.exact ? 'Estimated total' : 'From'}</p>
        <p className="display text-4xl text-white">{money(q.total)} <span className="font-sans text-sm text-ink-3">CAD</span></p>
      </div>
      <p className="mt-2 text-sm text-ink-3">
        {q.exact ? `Based on a ${q.km} km route${minutes ? ` (about ${minutes} min)` : ''}.` : 'Enter the trip distance, or both addresses, to see your exact fare.'}
        {note ? ` ${note}` : ''}
      </p>
    </div>
  );
}

/** Look up the driving distance when the addresses settle. */
export function useRoute({ pickup, dropoff, stops = [], vehicle, roundTrip, enabled = true }) {
  const [route, setRoute] = useState({ status: 'idle', km: null, minutes: null });
  const key = JSON.stringify([pickup, dropoff, stops]);
  useEffect(() => {
    if (!enabled || !pickup || pickup.length < 4 || !dropoff || dropoff.length < 4) { setRoute({ status: 'idle', km: null, minutes: null }); return undefined; }
    let live = true;
    setRoute((r) => ({ ...r, status: 'loading' }));
    const t = setTimeout(async () => {
      const r = await requestRoute({ pickup, dropoff, stops, vehicle, roundTrip });
      if (live) setRoute(r ? { status: 'ok', ...r } : { status: 'unavailable', km: null, minutes: null });
    }, 700);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return route;
}

export function VehicleSelect({ value, onChange, className = 'field', name, id }) {
  const classes = [...new Set(VEHICLES.map((v) => v.cls))];
  return (
    <select id={id} name={name} className={className} value={value} onChange={onChange}>
      {classes.map((c) => (
        <optgroup key={c} label={c}>
          {VEHICLES.filter((v) => v.cls === c).map((v) => <option key={v.model} value={v.model}>{v.model} · up to {v.pax}{v.surcharge ? ` · +$${v.surcharge}` : ''}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

/* ---------------- Fare estimator (Prices page) ---------------- */
export function FareEstimator({ defaultFrom = '', defaultTo = '' }) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE);
  const [round, setRound] = useState(false);
  const [stops, setStops] = useState(0);
  const [kmInput, setKmInput] = useState('');
  const route = useRoute({ pickup: from, dropoff: to, vehicle, roundTrip: round });
  useEffect(() => { if (route.status === 'ok') setKmInput(String(route.km)); }, [route.status, route.km]);
  const km = parseFloat(kmInput);
  const q = quote({ km: km > 0 ? km : null, vehicle, stops, roundTrip: round });
  const routeMsg = { loading: 'Finding the route…', unavailable: 'We couldn’t measure that route automatically. Type the distance in km, or call us for an exact quote.' }[route.status];

  return (
    <div className="card grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="label">Pickup address</span><input className="field" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Address, or Halifax Stanfield (YHZ)" autoComplete="street-address" /></label>
        <label className="block sm:col-span-2"><span className="label">Drop-off address</span><input className="field" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" /></label>
        <label className="block"><span className="label">Distance (km)</span><input className="field" type="number" inputMode="decimal" min="0" step="0.1" value={kmInput} onChange={(e) => setKmInput(e.target.value)} placeholder="Filled in from the route" /><span className="hint">{(route.status === 'loading' || !(km > 0)) && routeMsg ? routeMsg : 'Worked out from the addresses, or type it in.'}</span></label>
        <label className="block"><span className="label">Vehicle</span><VehicleSelect value={vehicle} onChange={(e) => setVehicle(e.target.value)} /></label>
        <label className="block"><span className="label">Trip</span><select className="field" value={round ? 'r' : 'o'} onChange={(e) => setRound(e.target.value === 'r')}><option value="o">One-way</option><option value="r">Round trip</option></select></label>
        <label className="block"><span className="label">Extra stops</span><select className="field" value={stops} onChange={(e) => setStops(+e.target.value)}>{[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <div className="rounded-xl bg-black/25 p-5">
        <QuoteBreakdown q={q} minutes={route.status === 'ok' ? route.minutes : null} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/book-now/" className="btn-primary">Book this ride</Link>
        </div>
        <p className="mt-4 text-xs text-ink-3">Add child seats, meet &amp; greet and other extras when you book. Waiting time beyond the free period is $0.75/min. Gratuity not included.</p>
      </div>
    </div>
  );
}
