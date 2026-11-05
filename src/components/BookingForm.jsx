import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Input, Select, Textarea, Check, Honeypot, FormStatus, SubmitButton, Field } from './form-kit.jsx';
import { tours, airlines, luggageTypes, vehicles } from '../data/content.js';
import { business } from '../data/site.js';
import { requestEstimate } from '../lib/estimate.js';

const YHZ = `Halifax Stanfield International Airport (YHZ), ${business.airport.address}`;
const SERVICE = [['airport', 'Airport pickup / drop-off'], ['p2p', 'Point A → Point B'], ['hourly', 'Hourly / charter'], ['tours', 'Tours (Nova Scotia)']];
const VEHICLES = ['Sedan', 'Mid Size SUV', 'Full Size SUV', 'Mini Van'];
const SEATS = [['highback', 'Highback booster'], ['backless', 'Backless booster'], ['infant', 'Infant car seat']];

function Counter({ label, value = 0, onChange, max = 5 }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" className="h-8 w-8 rounded-md border border-line text-lg leading-none disabled:opacity-40" onClick={() => onChange(Math.max(0, value - 1))} disabled={!value} aria-label={`Fewer: ${label}`}>−</button>
        <span className="w-5 text-center tabular-nums" aria-live="polite">{value}</span>
        <button type="button" className="h-8 w-8 rounded-md border border-line text-lg leading-none disabled:opacity-40" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More: ${label}`}>+</button>
      </div>
    </div>
  );
}

export default function BookingForm() {
  const f = useForm('booking', { serviceType: '', tripType: 'One-way', vehicle: 'Sedan', passengers: '1', requestType: 'Book now', contactPreference: 'Either' });
  const v = f.values;
  const [stops, setStops] = useState([]);
  const [luggage, setLuggage] = useState({});
  const [seats, setSeats] = useState({});
  const [diffReturn, setDiffReturn] = useState(false);
  const [est, setEst] = useState(null); // {status, text}

  // Pre-fill from links like /book-now/?service=tours&package=peggys-cove-coastal-stops (kept from the old site).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('service');
    const map = { tours: 'tours', airport: 'airport', hourly: 'hourly', p2p: 'p2p' };
    if (map[s]) f.put('serviceType', map[s]);
    const pkg = q.get('package');
    if (pkg && tours.some((t) => t.slug === pkg)) f.put('tourPackage', pkg);
    const dir = q.get('direction');
    if (dir === 'from' || dir === 'to') f.put('airportDirection', dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAirport = v.serviceType === 'airport';
  const isTour = v.serviceType === 'tours';
  const roundTrip = v.tripType === 'Round trip';
  const pickup = isAirport && v.airportDirection === 'from' ? YHZ : v.pickupAddress;
  const dropoff = isAirport && v.airportDirection === 'to' ? YHZ : v.dropoffAddress;

  const luggageText = useMemo(() => luggageTypes.filter(([k]) => luggage[k]).map(([k, l]) => `${l} × ${luggage[k]}`).join(', '), [luggage]);
  const seatText = useMemo(() => SEATS.filter(([k]) => seats[k]).map(([k, l]) => `${l} × ${seats[k]}`).join(', '), [seats]);

  const getEstimate = async () => {
    if (!pickup || !dropoff) { setEst({ status: 'need', text: 'Enter a pickup and drop-off address first.' }); return; }
    setEst({ status: 'loading', text: 'Calculating…' });
    const r = await requestEstimate({ pickup, dropoff, stops: stops.filter(Boolean), vehicle: v.vehicle, roundTrip });
    setEst(r);
  };

  const submit = (e) =>
    f.onSubmit(e, {
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      stops: stops.filter(Boolean),
      luggage: luggageText,
      childSeats: seatText,
      tourPackage: isTour ? (tours.find((t) => t.slug === v.tourPackage)?.name || v.tourPackage) : '',
      airportDirection: isAirport ? (v.airportDirection === 'from' ? 'From YHZ to destination' : 'From pickup to YHZ') : '',
      estimate: est?.amount ? est.text : '',
      returnPickupAddress: roundTrip ? (diffReturn ? v.returnPickupAddress : dropoff) : '',
      returnDropoffAddress: roundTrip ? (diffReturn ? v.returnDropoffAddress : pickup) : '',
    });

  if (f.status === 'done') return <FormStatus f={f} title="Booking request received" done="Thanks! We’ll confirm your ride by your preferred contact method shortly. Nothing has been charged." />;

  return (
    <form name="booking" onSubmit={submit} className="space-y-8">
      <Honeypot f={f} />
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold">1. Your details</legend>
        <Input f={f} name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
        <Input f={f} name="email" type="email" label="Email" required autoComplete="email" />
        <Input f={f} name="phone" type="tel" label="Phone" required autoComplete="tel" />
        <Select f={f} name="contactPreference" label="How should we confirm?" required options={['Email', 'Phone', 'Text', 'Either']} />
        <Select f={f} name="requestType" label="Request type" required options={['Book now', 'Request a quote']} />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold">2. Your trip</legend>
        <Select f={f} name="serviceType" label="Service" required options={SERVICE} hint={isAirport ? 'We’ll ask for your flight details below.' : undefined} />
        {isAirport && (
          <Select f={f} name="airportDirection" label="Direction" required options={[['from', 'From Halifax Stanfield (YHZ) → destination'], ['to', 'Pickup address → Halifax Stanfield (YHZ)']]} />
        )}
        {isTour && (
          <Select f={f} name="tourPackage" label="Tour package" required options={[...tours.map((t) => [t.slug, t.name]), ['custom', 'Custom tour (tell us what you want)']]} />
        )}
        {isTour && v.tourPackage === 'custom' && <Textarea f={f} name="customTour" label="Custom tour details" required rows={3} className="sm:col-span-2" />}
        <Select f={f} name="tripType" label="Trip type" required options={['One-way', 'Round trip']} />
        <Input f={f} name="pickupDate" type="date" label="Pickup date" required />
        <Input f={f} name="pickupTime" type="time" label="Pickup time" required />

        {isAirport && v.airportDirection === 'from' ? (
          <div className="sm:col-span-2 rounded-lg bg-band p-3 text-sm"><b>Pickup:</b> {YHZ}</div>
        ) : (
          <Input f={f} name="pickupAddress" label="Pickup address" required autoComplete="street-address" className="sm:col-span-2" />
        )}
        {stops.map((s, i) => (
          <div key={i} className="flex items-end gap-2 sm:col-span-2">
            <Field label={`Stop ${i + 1}`} className="flex-1">
              {(id) => <input id={id} className="field" value={s} onChange={(e) => setStops(stops.map((x, j) => (j === i ? e.target.value : x)))} />}
            </Field>
            <button type="button" onClick={() => setStops(stops.filter((_, j) => j !== i))} className="btn-ghost min-h-[46px]" aria-label={`Remove stop ${i + 1}`}>Remove</button>
          </div>
        ))}
        {stops.length < 4 && (
          <button type="button" onClick={() => setStops([...stops, ''])} className="justify-self-start text-sm font-semibold text-brand-700 sm:col-span-2">+ Add a stop <span className="font-normal text-ink-3">($5 per stop)</span></button>
        )}
        {isAirport && v.airportDirection === 'to' ? (
          <div className="sm:col-span-2 rounded-lg bg-band p-3 text-sm"><b>Drop-off:</b> {YHZ}</div>
        ) : (
          <Input f={f} name="dropoffAddress" label="Drop-off address" required={!isTour && v.serviceType !== 'hourly'} className="sm:col-span-2" />
        )}

        {isAirport && (
          <>
            <Select f={f} name="airline" label="Airline" options={airlines} />
            {v.airline === 'Other' ? <Input f={f} name="otherAirline" label="Other airline" /> : <Input f={f} name="flightNumber" label="Flight number" inputMode="numeric" hint="Numbers only. We track your flight." />}
            {v.airline === 'Other' && <Input f={f} name="flightNumber" label="Flight number" inputMode="numeric" />}
          </>
        )}

        {roundTrip && (
          <>
            <Input f={f} name="returnDate" type="date" label="Return date" required />
            <Input f={f} name="returnTime" type="time" label="Return time" required />
            <label className="flex items-center gap-3 text-[15px] sm:col-span-2">
              <input type="checkbox" checked={diffReturn} onChange={(e) => setDiffReturn(e.target.checked)} className="h-4 w-4 accent-brand-700" />
              Return pickup & drop-off are different (otherwise we reverse your addresses)
            </label>
            {diffReturn && (
              <>
                <Input f={f} name="returnPickupAddress" label="Return pickup address" required />
                <Input f={f} name="returnDropoffAddress" label="Return drop-off address" required />
              </>
            )}
            {isAirport && (
              <>
                <Select f={f} name="returnAirline" label="Return airline (if different)" options={airlines} />
                <Input f={f} name="returnFlightNumber" label="Return flight number (if different)" inputMode="numeric" />
              </>
            )}
          </>
        )}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold">3. Vehicle & passengers</legend>
        <div className="sm:col-span-2">
          <p className="label" id="vehicle-label">Preferred vehicle</p>
          {(
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-labelledby="vehicle-label">
              {VEHICLES.map((x) => (
                <label key={x} className={`cursor-pointer rounded-lg border p-3 text-center text-[15px] ${v.vehicle === x ? 'border-brand-700 bg-brand-50 font-semibold' : 'border-line'}`}>
                  <input type="radio" name="vehicle" value={x} checked={v.vehicle === x} onChange={f.set('vehicle')} className="sr-only" />
                  {x}
                  <span className="mt-1 block text-xs font-normal text-ink-3">{vehicles.filter((m) => m.cls === x).map((m) => m.model).join(', ')}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <p className="hint -mt-2 sm:col-span-2">Vehicle selection depends on availability.</p>
        <Select f={f} name="passengers" label="Passengers" required options={['1', '2', '3', '4', '5', '6', '7', '8+']} />
        {isAirport && (
          <div className="sm:col-span-2">
            <p className="label">Luggage</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {luggageTypes.map(([k, l]) => <Counter key={k} label={l} value={luggage[k] || 0} onChange={(n) => setLuggage({ ...luggage, [k]: n })} />)}
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-3 text-lg font-semibold">4. Extras <span className="text-sm font-normal text-ink-3">(charges may apply, from $10)</span></legend>
        {isAirport && <Check f={f} name="meetGreet">Meet & greet: your driver waits inside arrivals with a name sign</Check>}
        <div>
          <p className="label">Child / booster seats</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {SEATS.map(([k, l]) => <Counter key={k} label={l} value={seats[k] || 0} onChange={(n) => setSeats({ ...seats, [k]: n })} />)}
          </div>
        </div>
        <Check f={f} name="wakeUpCall">Wake-up call ($5)</Check>
        <Check f={f} name="assistBags">Assist with bags</Check>
      </fieldset>

      <div className="rounded-xl border border-line bg-band p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Estimated fare</p>
            <p className="text-sm text-ink-3">Based on driving distance. Not a final invoice.</p>
          </div>
          <button type="button" onClick={getEstimate} className="btn-dark">Get estimate</button>
        </div>
        {est && <p className="mt-3 text-[15px]" aria-live="polite">{est.amount ? <b className="text-xl">{est.text}</b> : est.text}</p>}
        <p className="mt-3 text-xs text-ink-3">Price may vary if an SUV or van is selected, and with traffic, time of day, waiting time, extra services, luggage and vehicle availability. Each added stop is +$5. See <Link to="/schedule/">all prices</Link>.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea f={f} name="notes" label="Notes (optional)" rows={3} className="sm:col-span-2" />
        <Input f={f} name="coupon" label="Coupon code (optional)" hint="If valid, we’ll apply it when we confirm." />
      </div>

      <Check f={f} name="agreeTerms" required>
        I agree to the <Link to="/refund-policy/">Terms of Service and Refund Policy</Link>.
      </Check>

      <FormStatus f={f} />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton f={f}>{v.requestType === 'Request a quote' ? 'Request a quote' : 'Send booking request'}</SubmitButton>
        <p className="text-sm text-ink-3">By submitting, you agree we may contact you about this request.</p>
      </div>
    </form>
  );
}
