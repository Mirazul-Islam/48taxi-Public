import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Input, Select, Textarea, Check, Honeypot, FormStatus, SubmitButton, Field } from './form-kit.jsx';
import AddressInput, { addrText } from './AddressInput.jsx';
import { YHZ, isYhzText } from '../lib/maps.js';
import { tours, airlines, luggageTypes } from '../data/content.js';
import { business } from '../data/site.js';
import { VEHICLES, DEFAULT_VEHICLE, ADDONS, PRICING, WAITING_TERMS, quote } from '../lib/pricing.js';
import { QuoteBreakdown, useRoute } from './Pricing.jsx';
import { money } from '../data/fares.js';
import { Cutout, ItemCounter } from './Visuals.jsx';

const SERVICE = [['airport', 'Airport pickup / drop-off'], ['p2p', 'Point A → Point B'], ['hourly', 'Hourly / charter'], ['tours', 'Tours (Nova Scotia)']];
const SEATS = [['highback', 'Highback booster', ADDONS.seat], ['backless', 'Backless booster', ADDONS.seat], ['infant', 'Infant rear-facing seat', ADDONS.infantSeat]];
// Luggage that costs extra; everything else (personal item, carry-on, check-in, stroller, garment) is free.
const PET_KEYS = ['petDog', 'petCat'];
const OVERSIZE_KEYS = ['oversize', 'golf'];
const luggagePrice = (k) => (PET_KEYS.includes(k) ? ADDONS.pet : OVERSIZE_KEYS.includes(k) ? ADDONS.oversize : 0);
const CLASSES = [...new Set(VEHICLES.map((x) => x.cls))];

function AirportLock({ label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-700/35 bg-brand-700/[0.07] p-3 sm:col-span-2">
      <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-brand-700/40 bg-brand-700/15 text-brand-700">✈</span>
      <span className="min-w-0 text-sm"><b className="text-white">{label}: Halifax Stanfield Airport (YHZ)</b><span className="block truncate text-ink-3">{business.airport.address}</span></span>
    </div>
  );
}

export default function BookingForm() {
  const f = useForm('booking', { serviceType: '', tripType: 'One-way', vehicle: DEFAULT_VEHICLE, passengers: '1', requestType: 'Book now', contactPreference: 'Either', assistBags: '' });
  const v = f.values;
  const [stops, setStops] = useState([]); // address objects
  const [addr, setAddr] = useState({ pickup: null, dropoff: null, retPickup: null, retDropoff: null });
  const setA = (k) => (val) => setAddr((a) => ({ ...a, [k]: val }));
  const [luggage, setLuggage] = useState({});
  const [seats, setSeats] = useState({});
  const [diffReturn, setDiffReturn] = useState(false);

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
    // Values handed over from the homepage booking bar or the fare calculator.
    const read = (k) => {
      const text = q.get(k);
      if (!text) return null;
      const lat = parseFloat(q.get(`${k}_lat`));
      const lng = parseFloat(q.get(`${k}_lng`));
      return Number.isFinite(lat) && Number.isFinite(lng) ? { text, lat, lng, placeId: q.get(`${k}_pid`) || '' } : { text };
    };
    const pickup = read('pickup');
    const dropoff = read('dropoff');
    if (s === 'airport' && !dir) f.put('airportDirection', isYhzText(pickup?.text) ? 'from' : 'to');
    if (pickup && !(s === 'airport' && isYhzText(pickup.text))) setA('pickup')(pickup);
    if (dropoff && !(s === 'airport' && isYhzText(dropoff.text))) {
      if (s === 'hourly') f.put('notes', dropoff.text);
      else setA('dropoff')(dropoff);
    }
    if (q.get('date')) f.put('pickupDate', q.get('date'));
    if (q.get('time')) f.put('pickupTime', q.get('time'));
    if (VEHICLES.some((x) => x.model === q.get('vehicle'))) f.put('vehicle', q.get('vehicle'));
    if (q.get('trip') === 'round') f.put('tripType', 'Round trip');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAirport = v.serviceType === 'airport';
  const isTour = v.serviceType === 'tours';
  const roundTrip = v.tripType === 'Round trip';
  const pickup = isAirport && v.airportDirection === 'from' ? YHZ : addr.pickup;
  const dropoff = isAirport && v.airportDirection === 'to' ? YHZ : addr.dropoff;

  const luggageText = useMemo(() => luggageTypes.filter(([k]) => luggage[k]).map(([k, l]) => `${l} × ${luggage[k]}`).join(', '), [luggage]);
  const seatText = useMemo(() => SEATS.filter(([k]) => seats[k]).map(([k, l]) => `${l} × ${seats[k]}`).join(', '), [seats]);

  // Live price: the driving distance comes from the route lookup, everything else from the pricing guide.
  const byDistance = v.serviceType !== 'hourly' && !isTour;
  const stopList = stops.filter((x) => addrText(x).trim());
  const route = useRoute({ pickup, dropoff, stops: stopList, vehicle: v.vehicle, roundTrip, enabled: byDistance });
  const count = (keys) => keys.reduce((t, k) => t + (luggage[k] || 0), 0);
  const q = quote({
    km: route.status === 'ok' ? route.km : null,
    vehicle: v.vehicle,
    stops: stopList.length,
    roundTrip,
    extrasOnly: !byDistance,
    extras: { meetGreet: isAirport && v.meetGreet, seats, wakeUpCall: v.wakeUpCall, assistBags: v.assistBags, pets: count(PET_KEYS), oversize: count(OVERSIZE_KEYS) },
  });
  const estimateText = `${q.exact ? 'Estimated total' : 'From'} ${money(q.total)} CAD${q.km ? ` (${q.km} km)` : ''}: ${q.lines.map((l) => `${l.label} ${money(l.amount)}`).join('; ')}`;

  const submit = (e) =>
    f.onSubmit(e, {
      pickupAddress: addrText(pickup),
      dropoffAddress: addrText(dropoff),
      stops: stopList.map(addrText),
      luggage: luggageText,
      childSeats: seatText,
      tourPackage: isTour ? (tours.find((t) => t.slug === v.tourPackage)?.name || v.tourPackage) : '',
      airportDirection: isAirport ? (v.airportDirection === 'from' ? 'From YHZ to destination' : 'From pickup to YHZ') : '',
      estimate: estimateText,
      assistBags: { door: `Yes, to the door ($${ADDONS.assistBags})`, heavy: `Yes, stairs or 4+ heavy bags ($${ADDONS.assistBagsHeavy})` }[v.assistBags] || '',
      returnPickupAddress: roundTrip ? addrText(diffReturn ? addr.retPickup : dropoff) : '',
      returnDropoffAddress: roundTrip ? addrText(diffReturn ? addr.retDropoff : pickup) : '',
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
          <AirportLock label="Pickup" />
        ) : (
          <Field label="Pickup address" required className="sm:col-span-2">
            {(id) => <AddressInput id={id} name="pickupAddress" required value={addr.pickup} onChange={setA('pickup')} placeholder="Address, hotel or business" />}
          </Field>
        )}
        {stops.map((s, i) => (
          <div key={i} className="flex items-start gap-2 sm:col-span-2">
            <Field label={`Stop ${i + 1}`} className="flex-1">
              {(id) => <AddressInput id={id} value={s} onChange={(val) => setStops(stops.map((x, j) => (j === i ? val : x)))} placeholder="Stop address" />}
            </Field>
            <button type="button" onClick={() => setStops(stops.filter((_, j) => j !== i))} className="btn-ghost mt-[26px] min-h-[46px]" aria-label={`Remove stop ${i + 1}`}>Remove</button>
          </div>
        ))}
        {stops.length < 4 && (
          <button type="button" onClick={() => setStops([...stops, null])} className="justify-self-start text-sm font-semibold text-brand-700 sm:col-span-2">+ Add a stop <span className="font-normal text-ink-3">({money(PRICING.perStop)} per stop)</span></button>
        )}
        {isAirport && v.airportDirection === 'to' ? (
          <AirportLock label="Drop-off" />
        ) : (
          <Field label="Drop-off address" required={!isTour && v.serviceType !== 'hourly'} className="sm:col-span-2">
            {(id) => <AddressInput id={id} name="dropoffAddress" required={!isTour && v.serviceType !== 'hourly'} value={addr.dropoff} onChange={setA('dropoff')} placeholder="Address, hotel or business" />}
          </Field>
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
                <Field label="Return pickup address" required>
                  {(id) => <AddressInput id={id} name="returnPickupAddress" required value={addr.retPickup} onChange={setA('retPickup')} airport />}
                </Field>
                <Field label="Return drop-off address" required>
                  {(id) => <AddressInput id={id} name="returnDropoffAddress" required value={addr.retDropoff} onChange={setA('retDropoff')} airport />}
                </Field>
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
          <div className="space-y-4" role="radiogroup" aria-labelledby="vehicle-label">
            {CLASSES.map((c) => (
              <div key={c}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">{c}</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {VEHICLES.filter((x) => x.cls === c).map((x) => {
                    const on = v.vehicle === x.model;
                    return (
                      <label key={x.model} className={`group relative cursor-pointer overflow-hidden rounded-xl border text-[15px] transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-700 ${on ? 'border-brand-700 bg-brand-700/[0.08] shadow-[0_10px_40px_-18px_rgba(253,152,0,0.6)]' : 'border-line bg-black/20 hover:border-white/30'}`}>
                        <input type="radio" name="vehicle" value={x.model} checked={on} onChange={f.set('vehicle')} className="sr-only" />
                        <span className="relative block h-24 px-2 pt-3 sm:h-28">
                          <span aria-hidden="true" className={`absolute inset-x-4 bottom-2 h-4 rounded-[50%] blur-md transition-colors ${on ? 'bg-brand-700/40' : 'bg-black/60'}`} />
                          <Cutout name={x.img} alt={`${x.year ? `${x.year} ` : ''}${x.model}`} sizes="(min-width: 640px) 220px, 45vw" className="relative h-full w-full" imgClass={`drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 ${on ? 'scale-[1.04]' : 'group-hover:scale-[1.04]'}`} />
                        </span>
                        <span className="block px-3 pb-3 pt-1">
                          <span className={`block leading-tight ${on ? 'font-semibold text-white' : 'text-ink'}`}>{x.model}</span>
                          <span className="mt-1 block text-xs text-ink-3">{x.year ? `${x.year} · ` : ''}Up to {x.pax} · <span className={x.surcharge ? 'text-brand-700' : ''}>{x.surcharge ? `+${money(x.surcharge)}` : 'no surcharge'}</span></span>
                        </span>
                        {on && <span aria-hidden="true" className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-[11px] font-bold text-onaccent">✓</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="hint -mt-2 sm:col-span-2">Vehicle selection depends on availability.</p>
        <Select f={f} name="passengers" label="Passengers" required options={['1', '2', '3', '4', '5', '6', '7', '8+']} />
        <div className="sm:col-span-2">
          <p className="label">Luggage <span className="font-normal text-ink-3">(standard bags are free)</span></p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {luggageTypes.map(([k, l]) => <ItemCounter key={k} id={k} label={l} note={luggagePrice(k) ? `+${money(luggagePrice(k))} each` : 'Free'} value={luggage[k] || 0} onChange={(n) => setLuggage({ ...luggage, [k]: n })} />)}
          </div>
        </div>
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-3 text-lg font-semibold">4. Extras <span className="text-sm font-normal text-ink-3">(charges may apply)</span></legend>
        {isAirport && <Check f={f} name="meetGreet">Meet & greet ({money(ADDONS.meetGreet)}): your driver parks and waits inside arrivals with a name sign</Check>}
        <div>
          <p className="label">Child / booster seats</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SEATS.map(([k, l, price]) => <ItemCounter key={k} id={k} label={l} note={`${money(price)} each`} value={seats[k] || 0} onChange={(n) => setSeats({ ...seats, [k]: n })} />)}
          </div>
        </div>
        <Check f={f} name="wakeUpCall">Wake-up call ({money(ADDONS.wakeUpCall)})</Check>
        <Select f={f} name="assistBags" label="Assist with bags" placeholder="No thanks" options={[['door', `To the door (${money(ADDONS.assistBags)})`], ['heavy', `Stairs, or 4 or more heavy bags (${money(ADDONS.assistBagsHeavy)})`]]} className="sm:max-w-sm" />
      </fieldset>

      <div className="rounded-xl border border-line bg-band p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-lg font-semibold">Your price</p>
          <p className="text-sm text-ink-3">{byDistance ? `$${PRICING.perKm}/km, $${PRICING.minimumFare} minimum, plus vehicle surcharge` : 'Extras you’ve picked'}</p>
        </div>
        {byDistance && route.status === 'loading' && <p className="mb-2 text-sm text-ink-3">Measuring your route…</p>}
        {byDistance && route.status === 'idle' && <p className="mb-2 text-sm text-ink-3">Choose your addresses from the suggestions and your exact fare appears here.</p>}
        {q.lines.length ? (
          <QuoteBreakdown
            q={q}
            minutes={route.status === 'ok' ? route.minutes : null}
            note={!byDistance ? `${v.serviceType === 'hourly' ? 'Hourly' : 'Tour'} prices are confirmed by our team; these extras are added.` : route.status === 'unavailable' ? 'We couldn’t measure this route automatically, so we’ll confirm the exact fare with you.' : roundTrip && diffReturn ? 'The return leg is priced as the same distance; we’ll adjust if your return addresses differ.' : undefined}
          />
        ) : (
          <p className="text-[15px] text-ink-3">Hourly and tour prices are confirmed by our team. Any extras you add will appear here.</p>
        )}
        <p className="mt-3 text-xs text-ink-3">{WAITING_TERMS} Gratuity not included. See <Link to="/schedule/">all prices</Link>.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea f={f} name="notes" label="Notes (optional)" rows={3} className="sm:col-span-2" />
        <Input f={f} name="coupon" label="Coupon code (optional)" hint="If valid, we’ll apply it when we confirm." />
      </div>

      <Check f={f} name="agreeTerms" required>
        I agree to the <Link to="/refund-policy/">Terms of Service and Refund Policy</Link>, and that waiting time beyond the free waiting period ({PRICING.waiting.freeAirportMin} minutes after landing for airport pickups, {PRICING.waiting.freeOtherMin} minutes for other pickups) is billed at ${PRICING.waiting.perMinute.toFixed(2)} per minute and added to my fare, along with any additional services used during the ride.
      </Check>

      <FormStatus f={f} />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton f={f}>{v.requestType === 'Request a quote' ? 'Request a quote' : 'Send booking request'}</SubmitButton>
        <p className="text-sm text-ink-3">By submitting, you agree we may contact you about this request.</p>
      </div>
    </form>
  );
}
