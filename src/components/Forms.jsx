import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Input, Select, Textarea, Check, Honeypot, FormStatus, SubmitButton } from './form-kit.jsx';
import { airportFares, money } from '../data/fares.js';
import { business, telHref } from '../data/site.js';
import { requestEstimate } from '../lib/estimate.js';

/* ---------------- Park & Fly ---------------- */
const ADDONS = [
  ['wash', 'Exterior hand wash', 39, 'Wash, rinse and dry. Road salt and winter grime removed before you get back.'],
  ['interior', 'Interior cleaning', 69, 'Vacuum, wipe down of dash, console and door panels, glass cleaned inside.'],
  ['detail', 'Full detail, inside and out', 149, 'Everything above plus mats shampooed, trim dressed and a wax finish.'],
  ['winter', 'Winter ready pickup', 20, 'Snow and ice cleared and the car started to warm up before you arrive.'],
  ['battery', 'Battery check and boost', 25, 'We make sure it starts before you land, not after.'],
  ['fuel', 'Fuel top up on return', 15, 'Service fee only. Fuel is billed at the pump price on your receipt.'],
];
const RIDES = [['both', 'Both ways, to and from YHZ', 2], ['to', 'To the airport only', 1], ['from', 'From the airport only', 1], ['none', 'No ride, I have my own way', 0]];
const VTYPES = ['Car or sedan', 'SUV or crossover', 'Pickup truck', 'Van or minivan', 'Oversized, trailer or RV'];
export { ADDONS as parkFlyAddons };

export function ParkFlyForm() {
  const f = useForm('park-fly', { rides: 'both', vehicleType: 'Car or sedan', passengers: '1', bags: '1' });
  const [addons, setAddons] = useState([]);
  const v = f.values;
  const days = useMemo(() => {
    if (!v.dropoffDate || !v.pickupDate) return 0;
    const d = Math.round((new Date(v.pickupDate) - new Date(v.dropoffDate)) / 86400000) + 1;
    return d > 0 ? d : 0;
  }, [v.dropoffDate, v.pickupDate]);
  const rides = RIDES.find((r) => r[0] === v.rides)?.[2] ?? 2;
  const large = !['Car or sedan', 'SUV or crossover'].includes(v.vehicleType);
  const addonTotal = ADDONS.filter(([k]) => addons.includes(k)).reduce((s, a) => s + a[2], 0);
  const parking = rides ? days * 1 : null;
  const total = (parking ?? 0) + rides * 48 + addonTotal;
  const toggle = (k) => setAddons((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  if (f.status === 'done') return <FormStatus f={f} title="Park & Fly request sent" done="Your spot request is in. Our team will call you shortly to lock in your driver and go over the details. Nothing has been charged." />;

  const estimateText = `${days} day(s) parking ${rides ? money(parking) : 'quoted'} + ${rides} ride(s) ${money(rides * 48)} + add-ons ${money(addonTotal)} = ${money(total)} before tax`;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form name="park-fly" onSubmit={(e) => f.onSubmit(e, { addons: ADDONS.filter(([k]) => addons.includes(k)).map((a) => `${a[1]} ($${a[2]})`), estimate: estimateText, rides: RIDES.find((r) => r[0] === v.rides)?.[1] })} className="space-y-8">
        <Honeypot f={f} />
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-lg font-semibold">1. Your details</legend>
          <Input f={f} name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
          <Input f={f} name="phone" type="tel" label="Mobile number" required autoComplete="tel" />
          <Input f={f} name="email" type="email" label="Email (so we can send you a copy)" autoComplete="email" />
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-lg font-semibold">2. Drop off and pickup</legend>
          <Input f={f} name="dropoffDate" type="date" label="Drop off date" required />
          <Input f={f} name="dropoffTime" type="time" label="Drop off time" />
          <Input f={f} name="pickupDate" type="date" label="Pickup date" required />
          <Input f={f} name="pickupTime" type="time" label="Pickup time" />
          <p className="hint sm:col-span-2">Flight delayed or trip extended? Not a problem. The lot is open 24 hours and we settle the final days when you collect your car.</p>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-lg font-semibold">3. Your flights</legend>
          <Input f={f} name="departingFlight" label="Departing flight number (optional)" />
          <Input f={f} name="returningFlight" label="Returning flight number (optional)" hint="We track it. Land early or late and your driver adjusts." />
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-lg font-semibold">4. Your vehicle</legend>
          <Input f={f} name="plate" label="Licence plate" required />
          <Select f={f} name="vehicleType" label="Vehicle type" options={VTYPES} />
          <Input f={f} name="make" label="Make" />
          <Input f={f} name="model" label="Model" />
          <Input f={f} name="colour" label="Colour (optional)" />
          {large && <p className="rounded-lg bg-brand-50 p-3 text-sm sm:col-span-2">A vehicle this size takes more than one standard spot, so the daily rate will be higher than $1. Send the form and we’ll call with the exact price, or call <a href={telHref}>{business.phone.display}</a>.</p>}
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-3">
          <legend className="mb-3 text-lg font-semibold">5. Airport transfer</legend>
          <Select f={f} name="rides" label="Rides needed" options={RIDES.map((r) => [r[0], r[1]])} placeholder="Choose…" />
          <Select f={f} name="passengers" label="Passengers" options={['1', '2', '3', '4', '5', '6', '7 or more']} />
          <Select f={f} name="bags" label="Bags" options={['0', '1', '2', '3', '4', '5 or more']} />
          {v.rides === 'none' && <p className="rounded-lg bg-brand-50 p-3 text-sm sm:col-span-3">Heads up: the $1 per day rate is tied to travelling with 48 Taxi. Without a transfer, standard parking rates apply. Call us for a quote.</p>}
        </fieldset>
        <fieldset>
          <legend className="mb-3 text-lg font-semibold">6. While you are away <span className="text-sm font-normal text-ink-3">(optional)</span></legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {ADDONS.map(([k, label, price, text]) => (
              <label key={k} className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${addons.includes(k) ? 'border-brand-700 bg-brand-50' : 'border-line'}`}>
                <input type="checkbox" checked={addons.includes(k)} onChange={() => toggle(k)} className="mt-1 h-4 w-4 flex-none accent-brand-700" />
                <span><span className="font-semibold">{label}</span> <span className="text-brand-700">${price}</span><span className="mt-0.5 block text-sm text-ink-3">{text}</span></span>
              </label>
            ))}
          </div>
          <p className="hint mt-2">Add-on prices are for standard sized vehicles. Full detail already includes the wash and interior clean.</p>
        </fieldset>
        <Textarea f={f} name="notes" label="Anything else? (optional)" rows={3} />
        <FormStatus f={f} />
        <SubmitButton f={f}>Send my Park & Fly request</SubmitButton>
        <p className="text-sm text-ink-3">No payment is taken here; we call you to confirm. Flying within a few hours? Call <a href={telHref}>{business.phone.display}</a> instead.</p>
      </form>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card" aria-live="polite">
          <p className="font-semibold">Your estimate</p>
          <dl className="mt-3 space-y-2 text-[15px]">
            <div className="flex justify-between"><dt>Parking {days ? `(${days} day${days > 1 ? 's' : ''})` : '(pick your dates)'}</dt><dd>{rides ? money(parking) : 'Quoted'}</dd></div>
            <div className="flex justify-between"><dt>Airport transfers ({rides} ride{rides === 1 ? '' : 's'})</dt><dd>{money(rides * 48)}</dd></div>
            {addonTotal > 0 && <div className="flex justify-between"><dt>Add-ons</dt><dd>{money(addonTotal)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Estimated total</dt><dd>{money(total)}</dd></div>
          </dl>
          <p className="mt-1 text-xs text-ink-3">Before tax.{large ? ' Larger vehicle selected: parking shown at the standard car rate; we’ll confirm your actual daily rate.' : ''} An estimate, not a quote.</p>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Truck & container parking ---------------- */
export function TruckQuoteForm() {
  const f = useForm('truck-parking-quote');
  if (f.status === 'done') return <FormStatus f={f} title="Quote request sent" done="We received your request and will get back to you with pricing and availability." />;
  return (
    <form name="truck-parking-quote" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="name" label="Full name" required autoComplete="name" />
      <Input f={f} name="company" label="Company name" autoComplete="organization" />
      <Input f={f} name="email" type="email" label="Email address" required autoComplete="email" />
      <Input f={f} name="phone" type="tel" label="Phone number" required autoComplete="tel" />
      <Select f={f} name="lookingFor" label="What are you looking for?" required options={['Truck', 'Semi Truck', 'Storage Unit / Container', 'Dump Truck', 'School Bus', 'Trailer', 'Tow Truck', 'RV / Motorhome', 'Heavy Equipment', 'Other']} />
      {f.values.lookingFor === 'Other' ? <Input f={f} name="otherDetails" label="Please specify" required /> : <Input f={f} name="unitType" label="Vehicle / unit type" />}
      <Input f={f} name="units" type="number" min="1" label="Number of vehicles / units" required />
      <Select f={f} name="duration" label="How long do you need the space?" required options={['Daily', 'Weekly', 'Monthly', 'Long Term', 'Not Sure Yet']} />
      <Input f={f} name="startDate" type="date" label="Preferred start date" />
      <Textarea f={f} name="details" label="Additional details" rows={3} className="sm:col-span-2" />
      <div className="sm:col-span-2"><Check f={f} name="consent" required>I agree that 48 Taxi & Limo may contact me regarding this parking quote request.</Check></div>
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Submit inquiry</SubmitButton></div>
    </form>
  );
}

export function TruckAgreementForm() {
  const f = useForm('truck-parking-agreement', { signedDate: '' });
  if (f.status === 'done') return <FormStatus f={f} title="Agreement submitted" done="Thank you. We received your signed parking service agreement and will contact you to collect the deposit and issue access devices." />;
  return (
    <form name="truck-parking-agreement" onSubmit={(e) => f.onSubmit(e, { signedDate: new Date().toISOString().slice(0, 10) })} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="clientName" label="Client full legal name" required autoComplete="name" />
      <Input f={f} name="company" label="Company (if applicable)" autoComplete="organization" />
      <Input f={f} name="email" type="email" label="Email" required autoComplete="email" hint="We email you a copy for your records." />
      <Input f={f} name="phone" type="tel" label="Phone" required autoComplete="tel" />
      <Input f={f} name="units" type="number" min="1" label="Number of spaces" required />
      <Input f={f} name="startDate" type="date" label="Start date" required />
      <Textarea f={f} name="plates" label="Vehicles: licence plate, make and model of each" required rows={3} className="sm:col-span-2" />
      <Input f={f} name="signature" label="Type your full name as your signature" required className="sm:col-span-2" />
      <div className="sm:col-span-2"><Check f={f} name="agree" required>I have read the Parking Service Agreement above and agree to its terms on behalf of the Client.</Check></div>
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Sign and submit agreement</SubmitButton></div>
    </form>
  );
}

/* ---------------- Lockout / battery ---------------- */
export function LockoutForm() {
  const f = useForm('lockout', { service: 'Lockout (from $85)' });
  if (f.status === 'done') return <FormStatus f={f} title="Request sent" done="We’re on it. A dispatcher will call you right back to confirm location and timing. For the fastest help, call us now." />;
  return (
    <form name="lockout" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Select f={f} name="service" label="Service needed" required options={['Lockout (from $85)', 'Battery boost ($48 in HRM)']} className="sm:col-span-2" />
      <Input f={f} name="firstName" label="First name" required autoComplete="given-name" />
      <Input f={f} name="lastName" label="Last name" required autoComplete="family-name" />
      <Input f={f} name="phone" type="tel" label="Phone" required autoComplete="tel" />
      <Input f={f} name="email" type="email" label="Email" autoComplete="email" />
      <Input f={f} name="vehicleLocation" label="Vehicle location" required className="sm:col-span-2" hint="Street address or nearest intersection." />
      <Input f={f} name="vehicleModel" label="Vehicle make & model" required />
      <Input f={f} name="year" label="Year" inputMode="numeric" />
      <Input f={f} name="colour" label="Colour" />
      <Input f={f} name="plate" label="Plate number" />
      <div className="sm:col-span-2"><Check f={f} name="agree" required>I agree to the service policy below and will show my driver’s licence, ownership and insurance on request.</Check></div>
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2 flex flex-wrap gap-3"><SubmitButton f={f}>Request service</SubmitButton><a href={telHref} className="btn-ghost">Faster: call {business.phone.display}</a></div>
    </form>
  );
}

/* ---------------- Contact & affiliate ---------------- */
export function ContactForm() {
  const f = useForm('contact');
  if (f.status === 'done') return <FormStatus f={f} title="Message sent" done="Thanks for getting in touch. We usually reply within a few hours." />;
  return (
    <form name="contact" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="name" label="Name" required autoComplete="name" />
      <Input f={f} name="email" type="email" label="Email" required autoComplete="email" />
      <Input f={f} name="phone" type="tel" label="Phone" autoComplete="tel" className="sm:col-span-2" />
      <Textarea f={f} name="message" label="Message" required rows={5} className="sm:col-span-2" />
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Send message</SubmitButton></div>
      <p className="text-sm text-ink-3 sm:col-span-2">Want to book a ride? Use the <Link to="/book-now/">booking form</Link> so we get all your trip details.</p>
    </form>
  );
}

export function AffiliateForm() {
  const f = useForm('affiliate');
  if (f.status === 'done') return <FormStatus f={f} title="Application received" done="Thanks for your interest in partnering with 48Taxi & Limo. We’ll review your details and get back to you." />;
  return (
    <form name="affiliate" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="company" label="Name of company" required autoComplete="organization" className="sm:col-span-2" />
      <Input f={f} name="contactPerson" label="Contact person" required autoComplete="name" />
      <Input f={f} name="email" type="email" label="Email address" required autoComplete="email" />
      <Input f={f} name="phone" type="tel" label="Phone number" required autoComplete="tel" />
      <Input f={f} name="tollFree" type="tel" label="Toll free number" />
      <Input f={f} name="fax" type="tel" label="Fax number" />
      <Input f={f} name="website" type="url" label="Website" placeholder="https://" />
      <Input f={f} name="mailingAddress" label="Mailing address" autoComplete="street-address" className="sm:col-span-2" />
      <Input f={f} name="suite" label="Suite number" />
      <Input f={f} name="city" label="City" autoComplete="address-level2" />
      <Input f={f} name="province" label="Province / state" autoComplete="address-level1" />
      <Input f={f} name="postalCode" label="Postal / ZIP code" autoComplete="postal-code" />
      <Input f={f} name="yearsInBusiness" type="number" min="0" label="Years in business" />
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Submit application</SubmitButton></div>
    </form>
  );
}

/* ---------------- Fare estimator (Prices page) ---------------- */
export function FareEstimator() {
  const [mode, setMode] = useState('area');
  const [dir, setDir] = useState('to');
  const [area, setArea] = useState(airportFares[0].area);
  const [veh, setVeh] = useState('SED');
  const [round, setRound] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [res, setRes] = useState(null);
  const a = airportFares.find((x) => x.area === area);
  const flat = a ? (dir === 'to' ? a.toAirport[veh] : a.fromAirport[veh]) + (round ? (dir === 'to' ? a.fromAirport[veh] : a.toAirport[veh]) : 0) : null;

  const go = async (e) => {
    e.preventDefault();
    setRes({ text: 'Calculating…' });
    setRes(await requestEstimate({ pickup: from, dropoff: to, stops: [], vehicle: veh === 'SED' ? 'Sedan' : 'Full Size SUV', roundTrip: round }));
  };
  const tab = (k, l) => (
    <button type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-lg px-4 py-2 text-[15px] font-semibold ${mode === k ? 'bg-brand-700 text-onaccent' : 'text-ink hover:bg-chip'}`}>{l}</button>
  );
  return (
    <div className="card p-5 sm:p-7">
      <div role="tablist" aria-label="Estimator type" className="flex flex-wrap gap-2">{tab('area', '✈ Airport trip')}{tab('address', '🚖 Point to point')}</div>
      {mode === 'area' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block"><span className="label">Direction</span><select className="field" value={dir} onChange={(e) => setDir(e.target.value)}><option value="to">To the airport</option><option value="from">From the airport</option></select></label>
          <label className="block"><span className="label">Area</span><select className="field" value={area} onChange={(e) => setArea(e.target.value)}>{airportFares.map((x) => <option key={x.area}>{x.area}</option>)}</select></label>
          <label className="block"><span className="label">Vehicle</span><select className="field" value={veh} onChange={(e) => setVeh(e.target.value)}><option value="SED">Sedan</option><option value="SUV">SUV</option></select></label>
          <label className="block"><span className="label">Trip</span><select className="field" value={round ? 'r' : 'o'} onChange={(e) => setRound(e.target.value === 'r')}><option value="o">One-way</option><option value="r">Round trip</option></select></label>
          <div className="rounded-xl bg-brand-50 p-4 sm:col-span-2 lg:col-span-4" aria-live="polite">
            <p className="text-sm text-ink-2">Estimated fare{round ? ', round trip' : ', one-way'}</p>
            <p className="text-3xl font-extrabold">From {money(flat)} <span className="text-base font-semibold text-ink-2">CAD</span></p>
            <p className="mt-1 text-sm text-ink-2">{a?.note ? `${a.area}: ${a.note}. ` : ''}Flat rate, plus applicable surcharges. Tips not included.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={go} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Pickup address</span><input className="field" required value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="street-address" /></label>
          <label className="block"><span className="label">Drop-off address</span><input className="field" required value={to} onChange={(e) => setTo(e.target.value)} /></label>
          <label className="block"><span className="label">Vehicle</span><select className="field" value={veh} onChange={(e) => setVeh(e.target.value)}><option value="SED">Sedan</option><option value="SUV">SUV</option></select></label>
          <label className="block"><span className="label">Trip</span><select className="field" value={round ? 'r' : 'o'} onChange={(e) => setRound(e.target.value === 'r')}><option value="o">One-way</option><option value="r">Round trip</option></select></label>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2"><button className="btn-dark" type="submit">Get estimate</button>{res && <p aria-live="polite" className="text-[15px]">{res.amount ? <b className="text-xl">{res.text}</b> : res.text}</p>}</div>
        </form>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <Link to="/book-now/" className="btn-primary">Book this ride</Link>
        <p className="text-sm text-ink-3">All fares include HST. Tips not included. Each added stop is +$5. Tolls and waiting time may be surcharged.</p>
      </div>
    </div>
  );
}
