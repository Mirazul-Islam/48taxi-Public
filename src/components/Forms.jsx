import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Input, Select, Textarea, Check, Honeypot, FormStatus, SubmitButton } from './form-kit.jsx';
import { airportFares, money } from '../data/fares.js';
import { business, telHref } from '../data/site.js';
import { requestEstimate } from '../lib/estimate.js';

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
