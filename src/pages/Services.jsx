import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, CallButton, Reviews } from '../components/ui.jsx';
import { LockoutForm } from '../components/Forms.jsx';
import { faqsFor } from '../lib/seo.js';
import { vehicles, hotels } from '../data/content.js';
import { hourly, groupDiscount, fareNotes } from '../data/fares.js';
import { business, telHref } from '../data/site.js';

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
