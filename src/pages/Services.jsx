import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, CallButton, Reviews } from '../components/ui.jsx';
import { faqsFor } from '../lib/seo.js';
import { vehicles, hotels } from '../data/content.js';
import { hourly, groupDiscount, fareNotes } from '../data/fares.js';
import { business, telHref } from '../data/site.js';

/* ---------------- /halifax-limo-service/ (new) ---------------- */
export function Limo() {
  const path = '/halifax-limo-service/';
  return (
    <>
      <PageHero path={path} eyebrow="Chauffeured limousine service" title="Halifax limo service" img="chauffeur-door" imgAlt="Chauffeur opening the rear door of a black car">
        Luxury, reliability and professionalism. Book a chauffeured Cadillac Escalade, Chevy Suburban or Lincoln for airport transfers, weddings, proms, corporate travel or an hourly charter anywhere in Nova Scotia.
      </PageHero>
      <Section title="Limo rates" intro="Point-to-point limo rides use our standard fare: $2 per km, $48 minimum, plus the vehicle surcharge (Lincoln +$15, Chevy Suburban +$25, Cadillac Escalade +$40). Hourly charters:">
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
