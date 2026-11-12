import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VEHICLES, DEFAULT_VEHICLE, ADDON_LIST, WAITING_LIST, EXAMPLE_TRIPS, tripFare, quote } from '../lib/pricing.js';
import { requestRoute } from '../lib/estimate.js';
import { mapsFailed, isYhzText } from '../lib/maps.js';
import AddressInput, { isPicked, addrText } from './AddressInput.jsx';
import { money } from '../data/fares.js';

/* Short promise shown above the calculator (no formula: customers just see their price). */
export function PricePromise({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-brand-700/40 bg-gradient-to-b from-brand-700/10 to-card p-6 sm:p-8 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">Upfront pricing</p>
      <p className="display mt-3 text-3xl text-white sm:text-[2.6rem]">Your exact price, <em>before you book.</em></p>
      <p className="mt-4 text-[15px] text-ink-2">Enter your pickup and drop-off and you’ll see the full fare for the vehicle you choose, extras included. No meter, no surge.</p>
    </div>
  );
}

/* The fleet with one real-world example price per vehicle. */
const EXAMPLE = EXAMPLE_TRIPS[1]; // Halifax Stanfield (YHZ) ↔ downtown Halifax
export function VehicleTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="table min-w-[560px]">
        <caption className="sr-only">Vehicles and an example fare</caption>
        <thead>
          <tr><th>Class</th><th>Vehicle</th><th>Passengers</th><th className="text-right">YHZ ↔ downtown Halifax</th></tr>
        </thead>
        <tbody>
          {VEHICLES.map((v) => (
            <tr key={v.model}>
              <td className="text-ink-2">{v.cls}</td>
              <td className="font-medium text-white">{v.model}</td>
              <td>Up to {v.pax}</td>
              <td className="text-right tabular-nums">{money(tripFare(EXAMPLE.km, v.model))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-3">Example one-way fares. Passenger counts are typical seating; vehicle selection depends on availability. Use the fare calculator for your exact trip.</p>
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

/** Customer-facing lines: the ride as one price (no per-km maths), then stops and extras. */
export function displayLines(q, vehicle, roundTrip) {
  const ride = q.lines.filter((l) => l.kind === 'distance' || l.kind === 'vehicle').reduce((t, l) => t + l.amount, 0);
  const rest = q.lines.filter((l) => l.kind !== 'distance' && l.kind !== 'vehicle');
  if (!ride) return rest;
  const label = `${q.exact ? 'Your ride' : 'Ride, from'}${vehicle ? ` · ${vehicle}` : ''}${roundTrip ? ' · round trip' : ''}`;
  return [{ label, amount: Math.round(ride * 100) / 100 }, ...rest];
}

/* Price breakdown for a quote() result. */
export function QuoteBreakdown({ q, minutes, note, vehicle, roundTrip }) {
  return (
    <div aria-live="polite">
      <dl className="divide-y divide-white/[0.07] text-[15px]">
        {displayLines(q, vehicle, roundTrip).map((l) => (
          <div key={l.label} className="flex justify-between gap-4 py-2"><dt className="text-ink-2">{l.label}</dt><dd className="tabular-nums text-white">{money(l.amount)}</dd></div>
        ))}
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-white/15 pt-3">
        <p className="font-semibold text-white">{q.exact ? 'Estimated total' : 'From'}</p>
        <p className="display text-4xl text-white">{money(q.total)} <span className="font-sans text-sm text-ink-3">CAD</span></p>
      </div>
      <p className="mt-2 text-sm text-ink-3">
        {q.exact ? `For your ${q.km} km route${minutes ? ` (about ${minutes} min drive)` : ''}.` : 'Enter both addresses to see your exact fare.'}
        {note ? ` ${note}` : ''}
      </p>
    </div>
  );
}

/** An address is ready to route once it's picked from Google (or, if Google is unavailable, typed out). */
const routable = (a) => isPicked(a) || (mapsFailed() && addrText(a).trim().length > 5);
const pointKey = (a) => (isPicked(a) ? `${a.lat.toFixed(5)},${a.lng.toFixed(5)}` : addrText(a));

/** Look up the driving distance once both addresses (and any stops) are ready. */
export function useRoute({ pickup, dropoff, stops = [], vehicle, roundTrip, enabled = true }) {
  const [route, setRoute] = useState({ status: 'idle', km: null, minutes: null });
  const ready = enabled && routable(pickup) && routable(dropoff) && stops.every(routable);
  const key = ready ? [pickup, ...stops, dropoff].map(pointKey).join('|') : '';
  useEffect(() => {
    if (!key) { setRoute({ status: 'idle', km: null, minutes: null }); return undefined; }
    let live = true;
    setRoute((r) => ({ ...r, status: 'loading' }));
    const t = setTimeout(async () => {
      const r = await requestRoute({ pickup, dropoff, stops, vehicle, roundTrip });
      if (live) setRoute(r ? { status: 'ok', ...r } : { status: 'unavailable', km: null, minutes: null });
    }, 250);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return route;
}

/** Link into the booking form with the trip already filled in (addresses keep their map position). */
export function bookingLink({ pickup, dropoff, vehicle, roundTrip }) {
  const q = new URLSearchParams();
  const put = (k, a) => {
    if (!addrText(a)) return;
    q.set(k, addrText(a));
    if (isPicked(a)) { q.set(`${k}_lat`, String(a.lat)); q.set(`${k}_lng`, String(a.lng)); if (a.placeId) q.set(`${k}_pid`, a.placeId); }
  };
  const fromYhz = isYhzText(addrText(pickup));
  const toYhz = isYhzText(addrText(dropoff));
  q.set('service', fromYhz || toYhz ? 'airport' : 'p2p');
  if (fromYhz) q.set('direction', 'from');
  else if (toYhz) q.set('direction', 'to');
  put('pickup', pickup);
  put('dropoff', dropoff);
  if (vehicle) q.set('vehicle', vehicle);
  if (roundTrip) q.set('trip', 'round');
  return `/book-now/?${q.toString()}`;
}

export function VehicleSelect({ value, onChange, className = 'field', name, id }) {
  const classes = [...new Set(VEHICLES.map((v) => v.cls))];
  return (
    <select id={id} name={name} className={className} value={value} onChange={onChange}>
      {classes.map((c) => (
        <optgroup key={c} label={c}>
          {VEHICLES.filter((v) => v.cls === c).map((v) => <option key={v.model} value={v.model}>{v.model} · up to {v.pax}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

/* ---------------- Fare estimator (Prices, airport and area pages) ---------------- */
export function FareEstimator({ defaultFrom = null, defaultTo = null, fromPlaceholder = 'Address, hotel, or ✈ YHZ' }) {
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
  const routeMsg = {
    loading: 'Measuring the driving distance…',
    unavailable: 'We couldn’t measure that route automatically. Type the distance in km, or call us for an exact quote.',
  }[route.status];

  return (
    <div className="card grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label" htmlFor="fe-from">Pickup</label><AddressInput id="fe-from" value={from} onChange={setFrom} placeholder={fromPlaceholder} airport /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="fe-to">Drop-off</label><AddressInput id="fe-to" value={to} onChange={setTo} placeholder="Destination, or ✈ YHZ" airport /></div>
        <label className="block"><span className="label">Distance (km)</span><input className="field" type="number" inputMode="decimal" min="0" step="0.1" value={kmInput} onChange={(e) => setKmInput(e.target.value)} placeholder="Filled in automatically" /><span className="hint">{routeMsg || (km > 0 ? 'Measured from your addresses. You can also type it in.' : 'Pick both addresses, or type the distance.')}</span></label>
        <label className="block"><span className="label">Vehicle</span><VehicleSelect value={vehicle} onChange={(e) => setVehicle(e.target.value)} /></label>
        <label className="block"><span className="label">Trip</span><select className="field" value={round ? 'r' : 'o'} onChange={(e) => setRound(e.target.value === 'r')}><option value="o">One-way</option><option value="r">Round trip</option></select></label>
        <label className="block"><span className="label">Extra stops</span><select className="field" value={stops} onChange={(e) => setStops(+e.target.value)}>{[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <div className="rounded-xl bg-black/25 p-5">
        <QuoteBreakdown q={q} vehicle={vehicle} roundTrip={round} minutes={route.status === 'ok' ? route.minutes : null} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={bookingLink({ pickup: from, dropoff: to, vehicle, roundTrip: round })} className="btn-primary">Book this ride</Link>
        </div>
        <p className="mt-4 text-xs text-ink-3">Add child seats, meet &amp; greet and other extras when you book. Waiting time beyond the free period is $0.75/min. Gratuity not included.</p>
      </div>
    </div>
  );
}
