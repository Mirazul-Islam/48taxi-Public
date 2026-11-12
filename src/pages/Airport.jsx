import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, Reviews, Icon } from '../components/ui.jsx';
import { FareEstimator, PricePromise, VehicleTable, AddonTable, WaitingTable } from '../components/Pricing.jsx';
import { YHZ } from '../lib/maps.js';
import { fareNotes, hourly, groupDiscount } from '../data/fares.js';
import { getaways, vehicles } from '../data/content.js';
import { faqsFor } from '../lib/seo.js';
import { business, telHref } from '../data/site.js';

const pickupSteps = [
  ['yhz-baggage-claim', 'Baggage claim', 'Collect your luggage in the arrivals area.'],
  ['yhz-information-desk', 'Ground Transportation desk', 'Check in with your name at the desk inside arrivals. Staff notify your driver.'],
  ['yhz-pickup-point', 'Meet your driver', 'Your driver brings the vehicle to the designated pre-arranged pickup zone.'],
  ['yhz-curbside-lane', 'Curbside lane', 'Head out to the curbside lane, where your driver loads your bags.'],
];

export function PickupSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pickupSteps.map(([img, t, d], i) => (
        <li key={t} className="overflow-hidden rounded-xl border border-line bg-card">
          <Pic name={img} alt={`Halifax Stanfield airport: ${t.toLowerCase()}`} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" imgClass="aspect-[4/3] h-auto w-full object-cover" />
          <div className="p-4"><p className="text-sm font-bold text-brand-700">Step {i + 1}</p><h3 className="mt-1 font-semibold">{t}</h3><p className="mt-1 text-[15px] text-ink-2">{d}</p></div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- /halifax-airport-taxi/ (new) ---------------- */
export function AirportTaxi() {
  const path = '/halifax-airport-taxi/';
  return (
    <>
      <PageHero path={path} eyebrow="Halifax Stanfield International Airport (YHZ)" title="Halifax airport taxi to and from YHZ" img="airport-traveller" imgAlt="Traveller with a suitcase walking to a waiting car at Halifax Stanfield airport">
        Pre-booked airport taxis between Halifax Stanfield and Halifax, Dartmouth, Bedford, Sackville and the rest of Nova Scotia. We track your flight, wait if you’re delayed, and can meet you inside arrivals with a name sign.
      </PageHero>
      <Section title="Halifax airport taxi fares" intro={`See the full price before you book. ${fareNotes.payment}`}>
        <PricePromise />
        <div className="mt-6"><FareEstimator defaultTo={YHZ} fromPlaceholder="Your address, hotel or cruise terminal" /></div>
        <p className="mt-4 text-sm text-ink-3">{fareNotes.general}</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/book-now/?service=airport" className="btn-primary">Book an airport taxi</Link><Link to="/schedule/" className="btn-ghost">Estimate my fare</Link></div>
      </Section>
      <Section title="Why travellers book 48Taxi for YHZ" className="bg-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <Checklist className="text-[17px]" items={[
            'Your exact price is shown before you book: no meter, no surge',
            'Flight tracking, and 30 minutes of free waiting after your flight lands',
            'Meet & greet with a name sign inside arrivals, on request',
            'Infant seats, highback and backless boosters available',
            'Sedans, SUVs (Suburban, Escalade) and minivans for families and groups',
            'Text confirmation before pickup; drivers arrive early',
            'Open 24/7 for red-eyes and 5 a.m. departures',
          ]} />
          <Pic name="name-sign-yhz" alt="Driver holding a passenger name sign at Halifax Stanfield arrivals" sizes="(min-width: 1024px) 420px, 100vw" imgClass="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover" />
        </div>
      </Section>
      <Section title="How airport pickup works at Halifax Stanfield" intro="After you land, here is how to find your 48Taxi driver.">
        <PickupSteps />
        <p className="mt-5 text-[15px]">Need help at the airport? Call <a href={telHref}>{business.phone.display}</a> or <a href={`tel:${business.phone2.tel}`}>{business.phone2.display}</a>. Keep your phone on after landing so we can coordinate quickly. <Link to="/gti/">Full pickup instructions →</Link></p>
      </Section>
      <Section title="Our airport vehicles" className="bg-band" tight>
        <ul className="flex flex-wrap gap-2">{vehicles.map((v) => <li key={v.model} className="chip text-[13px]">{v.model} · {v.cls}</li>)}</ul>
        <p className="mt-3 text-sm text-ink-3">Vehicle selection depends on availability.</p>
      </Section>
      <Reviews only={['Tom Howard', 'barb c', 'Dania Dabbas']} title="Recent airport rides" />
      <Faq items={faqsFor(path)} />
      <CtaBand title="Flying soon? Book your airport ride." />
    </>
  );
}

/* ---------------- /airport-shuttle-halifax/ (new) ---------------- */
export function AirportShuttle() {
  const path = '/airport-shuttle-halifax/';
  return (
    <>
      <PageHero path={path} eyebrow="Halifax airport shuttle alternatives" title="Halifax airport shuttle, door to door" img="chauffeur-door" imgAlt="Chauffeur opening a car door for a passenger">
        Skip the shuttle stops and bus schedules. Ride door to door to Halifax Stanfield in a private car, or a family SUV or minivan with room for everyone’s luggage.
      </PageHero>
      <Section title="Three ways to get to YHZ">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Private airport taxi', 'Your exact price before you book. Your car, your schedule.', '/halifax-airport-taxi/', 'Airport taxi fares'],
            ['Return trips', 'Book both ways at once: we reverse your addresses and track your return flight too.', '/book-now/?service=airport', 'Book a return trip'],
            ['Group & family rides', 'Suburbans and minivans for 6–7 passengers with luggage. Up to 20% off outside HRM for groups.', '/book-now/?service=airport', 'Book a group ride'],
          ].map(([t, d, to, l]) => (
            <div key={t} className="card flex flex-col"><h3 className="text-lg font-semibold">{t}</h3><p className="mt-2 flex-1 text-ink-2">{d}</p><Link to={to} className="mt-4 font-semibold">{l} →</Link></div>
          ))}
        </div>
      </Section>
      <Faq items={faqsFor(path)} />
      <CtaBand />
    </>
  );
}

/* ---------------- /gti/ (existing) ---------------- */
export function Gti() {
  const path = '/gti/';
  return (
    <>
      <PageHero path={path} eyebrow="Halifax Stanfield International Airport" title="Halifax Stanfield airport pickup instructions" actions={false}>
        Meeting your driver at Halifax Stanfield International Airport: after collecting your luggage, go to the <b>Ground Transportation Desk</b> inside the arrivals area. Check in with your name, and airport staff will notify your driver to bring the vehicle to the designated pre-arranged pickup zone. This keeps wait times short and pickups smooth.
      </PageHero>
      <Section title="Step by step">
        <PickupSteps />
        <div className="mt-8 rounded-xl bg-brand-50 p-5">
          <p className="font-semibold">Can’t find the desk or need help?</p>
          <p className="mt-1">Call us anytime: <a href={telHref} className="font-semibold">{business.phone.display}</a> or <a href={`tel:${business.phone2.tel}`} className="font-semibold">{business.phone2.display}</a>. Tip: keep your phone on after landing so we can coordinate quickly.</p>
        </div>
      </Section>
      <Section title="Booked meet & greet?" className="bg-band" tight>
        <p className="max-w-3xl text-ink-2">With meet &amp; greet, your driver waits for you inside arrivals with a name sign and helps you with your bags to the vehicle. Add it when you <Link to="/book-now/?service=airport">book your airport ride</Link>.</p>
      </Section>
      <CtaBand title="Need a ride from YHZ?" />
    </>
  );
}

/* ---------------- /services-rates/ (existing) ---------------- */
export function ServicesRates() {
  const path = '/services-rates/';
  return (
    <>
      <PageHero path={path} eyebrow="Services & rates" title="Halifax taxi and airport rates">
        Your trusted taxi partner in Halifax &amp; Dartmouth. You see your exact fare before you book, with cash and all credit and debit cards accepted.
      </PageHero>
      <Section title="Our prices">
        <PricePromise />
        <h3 className="mt-12 text-xl font-semibold">Our vehicles and example fares</h3>
        <div className="mt-4"><VehicleTable /></div>
        <p className="mt-5 text-[15px] text-ink-2">{fareNotes.general}</p>
      </Section>
      <Section title="Additional services, waiting time and hourly rates" className="bg-band">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div><h3 className="mb-3 font-semibold">Additional services</h3><AddonTable /></div>
          <div className="space-y-6">
            <div><h3 className="mb-3 font-semibold">Waiting time</h3><WaitingTable /></div>
            <div className="card"><h3 className="font-semibold">Hourly charters</h3><dl className="mt-3 divide-y divide-line">{hourly.map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
          </div>
        </div>
      </Section>
      <Section title="Group discounts">
        <p className="text-ink-2">{groupDiscount.text}</p>
        <ul className="mt-4 flex flex-wrap gap-2">{groupDiscount.groups.map((g) => <li key={g} className="chip">{g}</li>)}</ul>
      </Section>
      <Section title="Popular getaways" className="bg-band">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {getaways.map((g) => (
            <div key={g.name} className="card p-4">
              <Pic name={g.img} alt={g.name} sizes="190px" imgClass="h-auto w-full rounded-lg object-cover" />
              <h3 className="mt-3 font-semibold">{g.to ? <Link to={g.to}>{g.name}</Link> : g.name}</h3>
              <p className="mt-1 text-sm text-ink-2">{g.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Airport pick-up" tight>
        <p className="max-w-3xl text-ink-2">When you arrive at the airport, go to the “Ground Transportation” booth in the arrivals area, to the right of the exit door. They will call your car to meet you by the “Pre-Arranged” sign. Your driver will greet you and escort you to your car. <Link to="/gti/">See pickup instructions with photos →</Link></p>
      </Section>
      <Section title="Travel tips" className="bg-band" tight>
        <div className="grid gap-6 md:grid-cols-2">
          <div><h3 className="font-semibold">Plan ahead</h3><p className="mt-2 text-ink-2">During peak demand, allow a little extra time: poor weather (rain, snow) and rush hour, 7:30–9:00 a.m. and 3:30–5:30 p.m.</p></div>
          <div><h3 className="font-semibold">Halifax airport check-in times</h3><p className="mt-2 text-ink-2">Suggested airport arrival times are set by each airline and vary. Check with your airline for your specific flight before you come to the airport.</p></div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}

/* ---------------- /schedule/ = Prices (existing) ---------------- */
export function Prices() {
  const path = '/schedule/';
  return (
    <>
      <PageHero path={path} eyebrow="Prices" title="Halifax taxi, limo and airport prices">
        How much is a taxi or limo in Halifax? Enter your trip below to see your exact fare before you book, or browse example fares, extras and hourly rates.
      </PageHero>
      <Section title="Fare estimator" intro="Enter both addresses to see your exact fare, extras included.">
        <FareEstimator />
      </Section>
      <Section title="Our prices" className="bg-band">
        <PricePromise />
        <h3 className="mt-12 text-xl font-semibold">Our vehicles and example fares</h3>
        <div className="mt-4"><VehicleTable /></div>
        <p className="mt-5 text-[15px] text-ink-2">{fareNotes.general}</p>
      </Section>
      <Section id="long-distance" title="Long distance across Nova Scotia, NB and PEI" intro={fareNotes.longDistance} tight>
        <p className="max-w-3xl text-ink-2">Use the fare estimator above with your destination, for example Wolfville, Lunenburg, Truro, Antigonish or Sydney, or <Link to="/book-now/">send us your trip</Link> and we’ll confirm the price.</p>
      </Section>
      <Section title="Additional services, waiting time and hourly rates" className="bg-band">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div><h3 className="mb-3 font-semibold">Additional services</h3><AddonTable /></div>
          <div className="space-y-6">
            <div><h3 className="mb-3 font-semibold">Waiting time</h3><WaitingTable /></div>
            <div className="card"><h3 className="font-semibold">Hourly charters</h3><dl className="mt-3 divide-y divide-line">{hourly.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
            <div className="card"><h3 className="font-semibold">Groups save up to 20%</h3><p className="mt-3 text-ink-2">{groupDiscount.text}</p><ul className="mt-3 flex flex-wrap gap-1.5">{groupDiscount.groups.map((g) => <li key={g} className="chip">{g}</li>)}</ul></div>
          </div>
        </div>
      </Section>
      <CtaBand title="Ready to book?" text="Send your trip details and we’ll confirm your ride." />
    </>
  );
}

export { Icon };
