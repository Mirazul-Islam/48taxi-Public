import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, Prose, CallButton, Reviews } from '../components/ui.jsx';
import { ParkFlyForm, TruckQuoteForm, TruckAgreementForm, LockoutForm, parkFlyAddons } from '../components/Forms.jsx';
import { faqsFor } from '../lib/seo.js';
import { vehicles, hotels } from '../data/content.js';
import { hourly, groupDiscount, fareNotes } from '../data/fares.js';
import legal from '../data/legal.json';
import { business, telHref } from '../data/site.js';

/* ---------------- /parkfly/ ---------------- */
export function ParkFly() {
  const path = '/parkfly/';
  const stat = (big, small) => (
    <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-line"><p className="text-2xl font-extrabold">{big}</p><p className="text-sm text-ink-3">{small}</p></div>
  );
  return (
    <>
      <PageHero path={path} eyebrow="Park & Fly · Sackville, Nova Scotia" title="Park & Fly near Halifax airport for $1 a day" img="sackville-yard-winter" imgAlt="The gated Park & Fly yard at 344 Sackville Drive in winter" actions={false}>
        <p>Leave your car for a dollar a day and we drive you to the terminal. Park in our private, gated, camera-monitored yard at <b>344 Sackville Drive, Sackville</b>, then ride to Halifax Stanfield (YHZ) with 48 Taxi &amp; Limo for a flat <b>$48 plus tax</b>. No contract, no paperwork, no reservation minimum.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="#reserve" className="btn-primary">Reserve your spot</a><CallButton /></div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{stat('$1 / day', 'Standard car, with a 48 Taxi ride')}{stat('$48 + tax', 'Flat ride to YHZ, each way')}{stat('20 min', 'From our gate to the terminal')}{stat('24 hours', 'Get back to your car any time')}</div>
      </PageHero>
      <Section title="Private lot. Gated. Cameras on 24/7." intro="Cars, trucks, SUVs and vans. Fully gravelled, fenced perimeter, controlled gate access and security camera coverage while you are away.">
        <div className="rounded-xl bg-brand-50 p-5 text-[15px]">
          <p className="font-semibold">How the $1 rate works</p>
          <p className="mt-1 text-ink-2">The $1 per day rate applies when you travel to the airport with 48 Taxi &amp; Limo after you park. The ride to Halifax Stanfield is a flat $48 plus tax, and the price may vary depending on the vehicle you need, for example a larger van for extra passengers or luggage. $1 per day is the rate for a standard car or SUV in a single spot; pickup trucks, vans, trailers and oversized vehicles take up more room, so they are priced above the standard daily rate.</p>
        </div>
      </Section>
      <Section title="Four steps, start to finish" intro="No account to create and no contract to sign. Drive in on the day you fly." className="bg-band">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Reserve or just drive in', 'Send the form below so we have your flight and plate on file, or call the gate on the day.'],
            ['Park and lock up', 'Leave your vehicle inside the fenced, gated lot. Cameras run around the clock while you are away.'],
            ['Ride to YHZ', 'Your 48 Taxi driver takes you straight to departures for a flat $48 plus tax.'],
            ['Come back to a clean car', 'Land at 2 AM and we bring you back. Add a wash or detail and it is ready when you get here.'],
          ].map(([t, d], i) => (
            <li key={t} className="card"><p className="text-3xl font-extrabold text-brand-700">{i + 1}</p><h3 className="mt-2 font-semibold">{t}</h3><p className="mt-1 text-[15px] text-ink-2">{d}</p></li>
          ))}
        </ol>
      </Section>
      <Section id="reserve" title="Reserve your Park & Fly spot" intro="Two minutes to fill in. Your total updates as you go. This sends a request, not a charge, and we call you back to confirm.">
        <ParkFlyForm />
      </Section>
      <Section title="About 20 minutes from our gate to the terminal" className="bg-band">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-ink-2">Sackville Drive sits right on the run to Highway 102 and Exit 6, the airport exit. That is a short, predictable trip even in winter weather.</p>
            <Checklist className="mt-4" items={['Roughly 25 km, about 20 min by road', 'Straight run to Highway 102 and the Exit 6 airport turnoff', 'Door to terminal: no shuttle stops and no waiting for a bus', 'Easy from Bedford, Lower Sackville, Beaver Bank, Windsor Junction and Halifax']} />
            <p className="mt-3 text-sm text-ink-3">Travel time varies with traffic and weather. Allow extra time in snow.</p>
          </div>
          <Pic name="sackville-yard-sign" alt="Entrance sign at the 344 Sackville Drive yard" sizes="(min-width: 1024px) 420px, 100vw" imgClass="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover" />
        </div>
      </Section>
      <Section title="What a trip actually costs" intro="Parking is $1 per day for a standard car. The ride is $48 plus tax each way. Add them together and that is your trip.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="table"><caption className="bg-band px-3 py-2.5 text-left font-semibold">Your total, by trip length (standard car, 2 rides)</caption>
              <thead><tr><th>Trip length</th><th className="text-right">Parking</th><th className="text-right">Total with 2 rides</th></tr></thead>
              <tbody>{[[7, 7, 103], [14, 14, 110], [21, 21, 117], [30, 30, 126]].map(([d, p, t]) => <tr key={d}><td>{d} days</td><td className="text-right">${p}</td><td className="text-right font-semibold">${t}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="table"><caption className="bg-band px-3 py-2.5 text-left font-semibold">Compared to parking at the airport (parking only)</caption>
              <thead><tr><th>Trip length</th><th className="text-right">YHZ Parkade</th><th className="text-right">Our parking</th></tr></thead>
              <tbody>{[[7, '$180', '$7'], [14, '$360', '$14'], [21, '$540', '$21'], [30, '$750+', '$30']].map(([d, a, o]) => <tr key={d}><td>{d} days</td><td className="text-right">{a}</td><td className="text-right font-semibold">{o}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-3">Totals assume a standard car and two rides at $48 each, before tax. Airport comparison based on Halifax Stanfield’s published parkade rate of $30 per day with a $180 weekly maximum, as listed in 2026. Airport rates are set by the Halifax International Airport Authority and can change; check halifaxstanfield.ca for current pricing.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card"><h3 className="font-semibold">Airport transfer</h3><p className="text-sm text-ink-3">Flat rate, no meter and no surge pricing.</p><dl className="mt-3 divide-y divide-line">{[['Our lot to YHZ, one way', '$48 + tax'], ['YHZ back to our lot, one way', '$48 + tax'], ['Larger vehicle or extra luggage', 'Quoted on request'], ['Late night and early morning pickups', 'Same flat rate']].map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
          <div className="card"><h3 className="font-semibold">Add-on services</h3><p className="text-sm text-ink-3">Booked when you reserve. Done while you are away.</p><dl className="mt-3 divide-y divide-line">{parkFlyAddons.map(([k, l, p]) => <div key={k} className="flex justify-between gap-3 py-2"><dt>{l}</dt><dd className="font-semibold">${p}</dd></div>)}</dl></div>
        </div>
      </Section>
      <Faq items={faqsFor(path)} title="Questions before you park" />
      <CtaBand title="Park for a dollar. Fly on time. Come back to your own car." text={`Send the form or call ${business.phone.display} and we’ll have a driver ready at the gate.`} />
    </>
  );
}

/* ---------------- /truck-container-parking/ ---------------- */
const PriceTable = ({ title, unit, rows }) => (
  <div className="overflow-hidden rounded-xl border border-line bg-card">
    <table className="table"><caption className="bg-band px-3 py-2.5 text-left font-semibold">{title}</caption>
      <thead><tr><th>Quantity</th><th className="text-right">Price {unit}</th></tr></thead>
      <tbody>{rows.map(([q, p]) => <tr key={q}><td>{q}</td><td className="text-right font-semibold">{p}</td></tr>)}</tbody>
    </table>
  </div>
);

export function TruckParking() {
  const path = '/truck-container-parking/';
  return (
    <>
      <PageHero path={path} eyebrow="Secure outdoor parking & storage" title="Secure truck & container parking in Sackville, NS" img="sackville-yard-trucks" imgAlt="Semi trucks and trailers parked in the secure Sackville yard" actions={false}>
        <p>48 Taxi &amp; Limo Service manages a secure outdoor yard at <b>344 Sackville Drive, Sackville, Nova Scotia</b>, designed for trucks, trailers, tow trucks, school buses, dump trucks, containers and commercial equipment. A fully gravelled lot, fenced perimeter and private access make it a dependable solution for business parking and storage.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="#quote" className="btn-primary">Request a quote</a><CallButton /></div>
      </PageHero>
      <Section tight>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[['1.9 acres', 'Large gravel outdoor yard'], ['24/7', 'Security camera monitoring'], ['Fenced', 'Controlled private access'], ['Flexible', 'Short and long-term options']].map(([a, b]) => <div key={a} className="card"><p className="text-2xl font-extrabold">{a}</p><p className="text-sm text-ink-3">{b}</p></div>)}
        </div>
      </Section>
      <Section title="Why businesses choose our yard" intro="A practical, secure and well-located outdoor yard for transportation, logistics, towing, construction and commercial operations across the Halifax Regional Municipality." className="bg-band">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[['Secure property', 'Fully fenced outdoor lot with controlled access for commercial vehicle parking and storage use.'], ['24/7 monitoring', 'Continuous camera monitoring for parked vehicles, containers and equipment.'], ['Built for large units', 'Suitable for trucks, trailers, school buses, tow trucks, dump trucks, containers and commercial equipment.'], ['Prime Sackville location', 'Quick access to Halifax, Bedford, Highway 102 and Halifax Stanfield International Airport.']].map(([t, d]) => <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-1.5 text-[15px] text-ink-2">{d}</p></div>)}
        </div>
        <h3 className="mt-10 text-lg font-semibold">What you can park or store</h3>
        <Checklist className="mt-3" items={['Semi trucks and trailers', 'Shipping containers and storage containers', 'Tow trucks, dump trucks, school buses and fleet vehicles', 'Commercial equipment and outdoor storage units']} />
      </Section>
      <Section title="Fleet & storage pricing" intro="Clear monthly pricing charged per spot. Each truck, container and vehicle takes one spot and is billed at the flat per-spot rate below.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <PriceTable title="Truck parking (monthly)" unit="per truck" rows={[['1 – 3 trucks', '$350'], ['4 – 6 trucks', '$320'], ['7 – 9 trucks', '$270'], ['10 – 19 trucks', '$250'], ['20+ trucks', '$230']]} />
          <PriceTable title="Container storage (monthly)" unit="per container" rows={[['1 – 3 containers', '$350'], ['4 – 6 containers', '$320'], ['7 – 9 containers', '$290'], ['10+ containers', '$260']]} />
          <PriceTable title="Vehicle parking (monthly)" unit="per vehicle" rows={[['1 – 5 vehicles', '$150'], ['6 – 9 vehicles', '$130'], ['10 vehicles', '$120'], ['15 vehicles', '$110'], ['20+ vehicles', '$100']]} />
          <PriceTable title="Additional rates" unit="" rows={[['Weekend rate', '$150'], ['Bulk rental (40–70 cars)', '$750 / 3 days'], ['Remote gate opener (one-time)', '$45 each'], ['Remote deposit (refundable)', '$70 each']]} />
        </div>
      </Section>
      <Section id="quote" title="Request a quote" intro="Tell us what you need to park or store, how many units, and for how long. We’ll get back to you with pricing and availability." className="bg-band">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6"><TruckQuoteForm /></div>
          <div className="space-y-3 text-[15px]"><p className="font-semibold">Contact</p><p>344 Sackville Drive, Sackville, Nova Scotia</p><p>Phone: <a href={telHref}>{business.phone.display}</a></p><p>Email: <a href={`mailto:${business.email}`}>{business.email}</a></p><Pic name="sackville-yard-winter" alt="The Sackville yard in winter" sizes="400px" imgClass="mt-4 h-auto w-full rounded-xl object-cover" /></div>
        </div>
      </Section>
      <Section id="agreement" title="View & sign the parking service agreement" intro="Please review the full agreement below, then complete the signature section. A copy is emailed to you after submission.">
        <details className="rounded-xl border border-line">
          <summary className="cursor-pointer p-5 font-semibold">Read the Parking Service Agreement</summary>
          <div className="border-t border-line p-5"><h3 className="text-lg font-bold">“Parking Service Agreement”</h3><Prose blocks={legal.truckAgreement} /></div>
        </details>
        <div className="card mt-6 p-6"><TruckAgreementForm /></div>
      </Section>
    </>
  );
}

/* ---------------- /slim-jim/ ---------------- */
export function SlimJim() {
  const path = '/slim-jim/';
  return (
    <>
      <PageHero path={path} eyebrow="48Taxi road services" title="Car lockout & battery boost in Halifax and Dartmouth" img="car-lockout" imgAlt="Keys locked inside a car" actions={false}>
        <p>Locked out of your car? Keys left inside, misplaced, or locks that simply fail can leave you stuck on the wrong side of the door. Prying a window open can cause costly damage. Our fully insured vehicle unlocking specialists provide fast, reliable service at affordable rates, starting from <b>$85</b>.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href={telHref} className="btn-primary">Call now: {business.phone.display}</a><a href="#request" className="btn-ghost">Request online</a></div>
      </PageHero>
      <Section title="Services and prices">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card"><h3 className="text-lg font-semibold">Lockout service · from $85</h3><p className="mt-2 text-ink-2">If your keys are locked in the vehicle, we send service to gain entry. If your keys are lost or broken, we cannot gain entry into your vehicle. $85 cash anywhere in HRM, or $85 + tax by card. Price may vary with vehicle type, size and model, time of day, weekends and holidays, and outside HRM.</p></div>
          <div className="card"><h3 className="text-lg font-semibold">Battery boost · $48 in HRM</h3><p className="mt-2 text-ink-2">Our mobile battery service comes to you to test and boost your battery and get you on your way. The driver is paid up front before the battery boost.</p></div>
        </div>
      </Section>
      <Section id="request" title="Request lockout or battery service" className="bg-band">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6"><LockoutForm /></div>
          <div className="text-[15px] text-ink-2">
            <h3 className="font-semibold text-ink">Service policy</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>You must remain at or near the vehicle to receive service (we will accommodate you in extenuating circumstances).</li>
              <li>48taxi Road Services is not liable for any damages or scratches that may occur as a result of unlocking.</li>
              <li>By calling and requesting our service, you agree we are not responsible for any damage to your vehicle.</li>
              <li>Our drivers may ask to see your driver’s licence, ownership and insurance.</li>
              <li>Price may vary depending on location.</li>
            </ul>
          </div>
        </div>
      </Section>
      <CtaBand title="Stuck right now?" text="Calling is the fastest way to get help, day or night." />
    </>
  );
}

/* ---------------- /halifax-limo-service/ (new) ---------------- */
export function Limo() {
  const path = '/halifax-limo-service/';
  return (
    <>
      <PageHero path={path} eyebrow="Chauffeured limousine service" title="Halifax limo service" img="chauffeur-door" imgAlt="Chauffeur opening the rear door of a black car">
        Luxury, reliability and professionalism. Book a chauffeured Cadillac Escalade, Chevy Suburban or Lincoln for airport transfers, weddings, proms, corporate travel or an hourly charter anywhere in Nova Scotia.
      </PageHero>
      <Section title="Limo rates">
        <div className="grid gap-5 md:grid-cols-3">
          {hourly.map(([k, v]) => <div key={k} className="card"><p className="text-sm text-ink-3">{k}</p><p className="mt-1 text-3xl font-extrabold">{v}</p></div>)}
        </div>
        <p className="mt-4 text-sm text-ink-3">{fareNotes.general}</p>
      </Section>
      <Section title="Our fleet" className="bg-band">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {['Sedan', 'Mid Size SUV', 'Full Size SUV', 'Mini Van'].map((c) => (
            <div key={c} className="card"><h3 className="font-semibold">{c}</h3><ul className="mt-2 text-[15px] text-ink-2">{vehicles.filter((v) => v.cls === c).map((v) => <li key={v.model}>{v.model}</li>)}</ul></div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-3">Vehicle selection depends on availability.</p>
      </Section>
      <Section title="Popular limo bookings">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Checklist className="text-[17px]" items={['Airport limo with meet & greet at Halifax Stanfield', 'Weddings: bride, groom and wedding-party transfers', 'Proms and graduations', 'Corporate roadshows, conferences and executive travel', 'Private jet and FBO pickups', 'Golf trips to Cabot, Fox Harb’r and The Links at Brunello', 'Wine tours and night-out charters by the hour']} />
          <Pic name="chauffeur-driving" alt="Chauffeur driving a luxury vehicle" sizes="(min-width: 1024px) 420px, 100vw" imgClass="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover" />
        </div>
      </Section>
      <Section title="Group savings" className="bg-band" tight>
        <p className="text-ink-2">{groupDiscount.text}</p>
        <ul className="mt-3 flex flex-wrap gap-2">{groupDiscount.groups.map((g) => <li key={g} className="chip">{g}</li>)}</ul>
      </Section>
      <Faq items={faqsFor(path)} />
      <CtaBand title="Book your limo" text="Tell us the date, the plan and how many passengers. We’ll match the right vehicle." />
    </>
  );
}

/* ---------------- /corporate-hotel-transportation/ (new) ---------------- */
export function Corporate() {
  const path = '/corporate-hotel-transportation/';
  return (
    <>
      <PageHero path={path} eyebrow="For hotels, airlines, agencies & businesses" title="Corporate & hotel transportation in Halifax" img="passenger-call" imgAlt="Business traveller on a phone call in the back seat">
        Dependable rides for your guests, crews and staff. Set up a billed account for airport transfers, concierge bookings, executive cars and event shuttles across Halifax and Nova Scotia.
      </PageHero>
      <Section title="What we handle for business accounts">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[['Hotel guest transfers', 'Concierge and front desk bookings to and from YHZ, the cruise terminal and events.'], ['Airline & crew rides', 'Crew transfers and disrupted-passenger rides with flight tracking.'], ['Executive cars', 'Sedans and SUVs for executives, visiting clients and roadshows.'], ['Events & conferences', 'Multiple vehicles coordinated for conferences, galas and weddings.'], ['Billed reservations', 'Prepaid and billed bookings with receipts for every trip.'], ['Courier service', 'Same-day document and parcel delivery across HRM.']].map(([t, d]) => <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-1.5 text-[15px] text-ink-2">{d}</p></div>)}
        </div>
        <p className="mt-4 text-sm text-ink-3">A minimum gratuity surcharge of 15% applies to all prepaid and billed reservations.</p>
      </Section>
      <Section title="Hotels we serve" className="bg-band">
        <ul className="flex flex-wrap gap-2">{hotels.map((h) => <li key={h} className="chip text-[13px]">{h}</li>)}</ul>
      </Section>
      <Section title="Open an account" tight>
        <p className="max-w-3xl text-ink-2">Call <a href={telHref}>{business.phone.display}</a>, email <a href={`mailto:${business.email}`}>{business.email}</a>, or <Link to="/contact/">send us a message</Link>. Transportation companies and travel agencies can also <Link to="/affiliate/">apply as an affiliate</Link>.</p>
      </Section>
      <Reviews only={['Dania Dabbas', 'Mikhail Graves-Smith', 'Jass Narwal']} title="What riders say" />
      <CtaBand />
    </>
  );
}
