import { Link } from 'react-router-dom';
import { Pic, Icon, Section, Reviews, CtaBand, Ratings, BookButton, CallButton, Checklist } from '../components/ui.jsx';
import { popularServices, golf, hotels } from '../data/content.js';
import { airportFares, perPerson, money } from '../data/fares.js';
import { business } from '../data/site.js';

const values = [
  ['Reliability', 'We show up on time, every time. Flights are tracked and drivers arrive early.', 'clock'],
  ['Safety', 'Fully insured vehicles and licensed, carefully selected drivers.', 'shield'],
  ['Affordability', 'Transparent flat fares to the airport with no hidden fees.', 'check'],
  ['Local knowledge', 'We know the best routes, shortcuts and hotspots across Nova Scotia.', 'pin'],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-band to-paper">
        <div className="wrap grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Halifax · Dartmouth · Halifax Stanfield (YHZ) · Open 24/7</p>
            <h1 className="mt-3 text-[2.15rem] font-extrabold leading-[1.1] sm:text-5xl">Halifax taxi &amp; airport limo service</h1>
            <p className="lede mt-5 max-w-xl">
              48Taxi &amp; Limo is a locally owned Halifax taxi company. Book a flat-rate Halifax taxi to the airport, a city cab across Halifax and
              Dartmouth, a chauffeured limo or a private Nova Scotia tour, day or night.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <BookButton>Book a ride</BookButton>
              <CallButton label={`Call ${business.phone.display}`} />
            </div>
            <div className="mt-6"><Ratings /></div>
            <ul className="mt-6 grid gap-2 text-[15px] text-ink-2 sm:grid-cols-2">
              {['Flat airport fares from $60', 'Flight tracking, no charge for delays', 'Sedans, SUVs & minivans', 'Child seats on request'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-brand-700" />{t}</li>
              ))}
            </ul>
          </div>
          <Pic name="airport-meet-greet" alt="48Taxi chauffeur holding a welcome sign in the arrivals hall at Halifax Stanfield airport" priority sizes="(min-width: 1024px) 600px, 100vw" imgClass="h-auto w-full rounded-2xl object-cover shadow-lg" />
        </div>
      </section>

      <Section eyebrow="Airport fares" title="Flat-rate Halifax taxi to the airport" intro="Fixed prices to and from Halifax Stanfield International Airport (YHZ). Cash, credit and debit accepted.">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="table">
              <thead><tr><th>Area</th><th className="text-right">To airport</th><th className="text-right">From airport</th></tr></thead>
              <tbody>
                {airportFares.slice(0, 8).map((a) => (
                  <tr key={a.area}><td className="font-medium">{a.area}</td><td className="text-right tabular-nums">from {money(a.toAirport.SED)}</td><td className="text-right tabular-nums">from {money(a.fromAirport.SED)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card flex flex-col justify-between bg-band">
            <div>
              <h3 className="text-lg font-semibold">More areas, SUVs and long distance</h3>
              <p className="mt-2 text-ink-2">Sedan prices shown. SUV fares, Eastern Passage, Upper Sackville and every Nova Scotia town from Amherst to Yarmouth are on our prices pages.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/services-rates/" className="btn-dark">All airport rates</Link>
              <Link to="/schedule/" className="btn-ghost">Fare estimator</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Our services" title="Popular services" className="bg-band">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularServices.map((s) => (
            <Link key={s.title} to={s.to} className="group overflow-hidden rounded-xl border border-line bg-card no-underline transition hover:shadow-md">
              <Pic name={s.img} alt="" sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" imgClass="aspect-[3/2] h-auto w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-ink group-hover:text-brand-700">{s.title}</h3>
                <p className="mt-1.5 text-[15px] text-ink-2">{s.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Why 48Taxi" title="Your trusted taxi partner, from the Maritimes to the United States" intro="Our carefully selected drivers prioritize punctuality, discretion and customer care, and our modern fleet keeps every trip comfortable, whether it’s an airport transfer, a corporate ride, a special event or a private chauffeur service.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(([t, d, ic]) => (
            <div key={t} className="card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon name={ic} /></span>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] text-ink-2">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-night text-white">
        <div className="wrap grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Park &amp; Fly · Sackville</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Park for $1 a day. Ride to YHZ for a flat $48.</h2>
            <p className="mt-4 text-gray-300">Leave your car in our private, gated, camera-monitored yard at 344 Sackville Drive, then ride to Halifax Stanfield with 48 Taxi. No contract and 24-hour access. Add a wash or detail while you’re away.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/parkfly/" className="btn-primary">Reserve Park &amp; Fly</Link><CallButton className="btn-light" /></div>
          </div>
          <Pic name="sackville-yard-trucks" alt="Gated, lit parking yard at 344 Sackville Drive at night" sizes="(min-width: 1024px) 560px, 100vw" imgClass="h-auto w-full rounded-2xl object-cover" />
        </div>
      </section>

      <Section eyebrow="Per-person fares" title="Travelling together? Pay per person" intro="Within our standard coverage area. Outside it, additional fees apply.">
        <div className="grid gap-5 md:grid-cols-3">
          {perPerson.map((p) => (
            <div key={p.label} className="card">
              <p className="font-semibold text-ink-2">{p.label}</p>
              <p className="mt-2 text-4xl font-extrabold">{money(p.price)}<span className="text-base font-semibold text-ink-3"> / person</span></p>
              <Checklist items={p.points} className="mt-4 text-[15px] text-ink-2" />
              <BookButton className="btn-dark mt-6 w-full">Book a ride</BookButton>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="48Taxi’s holiday hotspots" title="Golf getaways and scenic trips across Nova Scotia" intro="Enjoy scenic getaways organized by your trusted local taxi team. We drive golfers, clubs and luggage door to door." className="bg-band">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {golf.map((g) => (
            <article key={g.name} className="overflow-hidden rounded-xl border border-line bg-card">
              <Pic name={g.img} alt={g.name} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" imgClass="aspect-[3/2] h-auto w-full object-cover" />
              <div className="p-5"><h3 className="font-semibold">{g.name}</h3><p className="mt-1.5 text-[15px] text-ink-2">{g.text}</p></div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/tour/" className="btn-dark">See all tours</Link><Link to="/schedule/" className="btn-ghost">Long distance fares</Link></div>
      </Section>

      <Section eyebrow="For hotels" title="Trusted transportation partner for Halifax hotels" intro="Guest airport transfers, concierge bookings and billed accounts for hotels across Halifax and Dartmouth.">
        <ul className="flex flex-wrap gap-2">{hotels.map((h) => <li key={h} className="chip text-[13px]">{h}</li>)}</ul>
        <Link to="/corporate-hotel-transportation/" className="mt-6 inline-flex font-semibold">Corporate &amp; hotel accounts →</Link>
      </Section>

      <Reviews />

      <Section eyebrow="Where we drive" title="Serving Halifax, Dartmouth and all of Nova Scotia" className="bg-band" tight>
        <div className="flex flex-wrap gap-3">
          {[['/service-areas/dartmouth/', 'Dartmouth'], ['/service-areas/bedford/', 'Bedford'], ['/service-areas/truro/', 'Truro'], ['/service-areas/wolfville/', 'Wolfville & Acadia'], ['/service-areas/', 'All areas']].map(([to, l]) => (
            <Link key={to} to={to} className="btn-ghost">{l}</Link>
          ))}
        </div>
      </Section>

      <CtaBand title="From the airport in Canada & USA, we’ve got you covered." text="Comfort. Reliability. 48 Taxi. Book online or call 24/7." />
    </>
  );
}
