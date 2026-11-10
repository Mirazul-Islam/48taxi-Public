import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, Reviews, Icon } from '../components/ui.jsx';
import { FareEstimator } from '../components/Forms.jsx';
import { airportFares, airportZones, airportToHRM, longDistanceNS, longDistanceNBPEI, fareNotes, extras, hourly, groupDiscount, perPerson, money } from '../data/fares.js';
import { getaways, vehicles } from '../data/content.js';
import { faqsFor } from '../lib/seo.js';
import { business, telHref } from '../data/site.js';

export function AirportFareTable({ caption }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="table min-w-[560px]">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr><th>Destination</th><th className="text-right">To airport<br /><span className="normal-case">Sedan / SUV</span></th><th className="text-right">From airport<br /><span className="normal-case">Sedan / SUV</span></th></tr>
        </thead>
        <tbody>
          {airportFares.map((a) => (
            <tr key={a.area}>
              <td><span className="font-medium">{a.area}</span>{a.note && <span className="block text-sm text-ink-3">{a.note}</span>}</td>
              <td className="text-right tabular-nums">{money(a.toAirport.SED)}+ / {money(a.toAirport.SUV)}+</td>
              <td className="text-right tabular-nums">{money(a.fromAirport.SED)}+ / {money(a.fromAirport.SUV)}+</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
        Pre-booked, flat-rate airport taxis between Halifax Stanfield and Halifax, Dartmouth, Bedford, Sackville and the rest of Nova Scotia. We track your flight, wait if you’re delayed, and can meet you inside arrivals with a name sign.
      </PageHero>
      <Section title="Halifax airport taxi fares" intro={`${fareNotes.payment} Prices are “from” fares; see notes below the table.`}>
        <AirportFareTable caption="Flat taxi fares to and from Halifax Stanfield Airport by area" />
        <p className="mt-4 text-sm text-ink-3">{fareNotes.general}</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/book-now/?service=airport" className="btn-primary">Book an airport taxi</Link><Link to="/schedule/" className="btn-ghost">Estimate my fare</Link></div>
      </Section>
      <Section title="Why travellers book 48Taxi for YHZ" className="bg-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <Checklist className="text-[17px]" items={[
            'Flat fares agreed before you travel: no meter, no surge',
            'Flight tracking: we adjust for early and late arrivals at no extra charge',
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
      <CtaBand title="Flying soon? Lock in your airport fare." />
    </>
  );
}

/* ---------------- /airport-shuttle-halifax/ (new) ---------------- */
export function AirportShuttle() {
  const path = '/airport-shuttle-halifax/';
  return (
    <>
      <PageHero path={path} eyebrow="Halifax airport shuttle alternatives" title="Halifax airport shuttle, door to door" img="chauffeur-door" imgAlt="Chauffeur opening a car door for a passenger">
        Skip the shuttle stops and bus schedules. Ride door to door to Halifax Stanfield with per-person group fares, a flat-rate private car, or a family SUV with room for everyone’s luggage.
      </PageHero>
      <Section title="Per-person airport fares" intro="Within our standard coverage area; additional fees apply outside it.">
        <div className="grid gap-5 md:grid-cols-3">
          {perPerson.map((p) => (
            <div key={p.label} className="card"><p className="font-semibold text-ink-2">{p.label}</p><p className="mt-2 text-4xl font-extrabold">{money(p.price)}<span className="text-base font-semibold text-ink-3"> / person</span></p><Checklist items={p.points} className="mt-4 text-[15px] text-ink-2" /></div>
          ))}
        </div>
      </Section>
      <Section title="Three ways to get to YHZ" className="bg-band">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Private airport taxi', 'Flat fares from $60 from Halifax, Dartmouth, Bedford and Sackville. Your car, your schedule.', '/halifax-airport-taxi/', 'Airport taxi fares'],
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
      <PageHero path={path} eyebrow="Services & rates" title="Halifax airport taxi rates by area">
        Your trusted taxi partner in Halifax &amp; Dartmouth. Taxi fares to and from Halifax Stanfield Airport, with cash and all credit and debit cards accepted.
      </PageHero>
      <Section title="Taxi fares to & from Halifax airport">
        <AirportFareTable caption="Taxi fares to and from Halifax airport, sedan and SUV" />
        <div className="mt-5 space-y-2 text-[15px] text-ink-2"><p>{fareNotes.general}</p><p>{fareNotes.fuel}</p></div>
      </Section>
      <Section title="Extras, waiting time and hourly rates" className="bg-band">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card"><h3 className="font-semibold">Extra charges</h3><dl className="mt-3 divide-y divide-line">{extras.map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
          <div className="card"><h3 className="font-semibold">Long distance &amp; hourly</h3><dl className="mt-3 divide-y divide-line">{hourly.map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
            <p className="mt-4 text-sm text-ink-3">Prices can change for early morning, rush hour, closed bridge, immediate pickups, weather, extra luggage and extra passengers.</p></div>
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
function PlaceTable({ rows, title }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="table">
        <caption className="bg-band px-3 py-2.5 text-left font-semibold">{title}</caption>
        <thead><tr><th>Destination</th><th className="text-right">Fare from YHZ</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.place}><td>{r.place}</td><td className="text-right tabular-nums">{money(r.fare)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function Prices() {
  const path = '/schedule/';
  const half = Math.ceil(longDistanceNS.length / 2);
  return (
    <>
      <PageHero path={path} eyebrow="Prices" title="Halifax taxi, limo and airport prices">
        How much is a taxi or limo in Halifax? Estimate your fare to or from Halifax Stanfield Airport (YHZ), see flat airport fares by area, long distance fares across Nova Scotia, New Brunswick and PEI, and our hourly limo rates.
      </PageHero>
      <Section title="Fare estimator" intro="Instantly estimate your fare to or from Halifax Stanfield Airport, or for any point-to-point trip.">
        <FareEstimator />
        <p className="mt-4 text-sm text-ink-3">{fareNotes.general} {fareNotes.fuel}</p>
      </Section>
      <Section id="long-distance" title="Long distance fares from Halifax Stanfield" intro={fareNotes.longDistance} className="bg-band">
        <div className="grid gap-5 lg:grid-cols-3">
          <PlaceTable title="Nova Scotia (A–L)" rows={longDistanceNS.slice(0, half)} />
          <PlaceTable title="Nova Scotia (L–Y)" rows={longDistanceNS.slice(half)} />
          <PlaceTable title="New Brunswick & PEI" rows={longDistanceNBPEI} />
        </div>
      </Section>
      <Section id="rates-to-airport" title="Rates to the airport by zone">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="table min-w-[560px]">
            <thead><tr><th>Area</th><th>Details</th><th className="text-right">Rate</th></tr></thead>
            <tbody>{airportZones.map((z, i) => <tr key={i}><td className="font-medium">{z.area}</td><td className="text-ink-2">{z.details}</td><td className="text-right tabular-nums">{money(z.fare)}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section id="airport-to-hrm" title="Halifax airport to HRM" className="bg-band">
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <table className="table">
            <thead><tr><th>Area</th><th className="text-right">Fare</th></tr></thead>
            <tbody>{airportToHRM.map((z) => <tr key={z.area}><td>{z.area}</td><td className="text-right tabular-nums">{z.fare}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section title="Hourly, extras and group discounts">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card"><h3 className="font-semibold">Hourly &amp; per km</h3><dl className="mt-3 divide-y divide-line">{hourly.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
          <div className="card"><h3 className="font-semibold">Extras</h3><dl className="mt-3 divide-y divide-line">{extras.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2"><dt>{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl></div>
          <div className="card"><h3 className="font-semibold">Groups save up to 20%</h3><p className="mt-3 text-ink-2">{groupDiscount.text}</p><ul className="mt-3 flex flex-wrap gap-1.5">{groupDiscount.groups.map((g) => <li key={g} className="chip">{g}</li>)}</ul></div>
        </div>
      </Section>
      <CtaBand title="Ready to book?" text="Send your trip details and we’ll confirm your fare." />
    </>
  );
}

export { Icon };
