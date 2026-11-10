import { Link } from 'react-router-dom';
import { PageHero, Section, Checklist, Faq, CtaBand, Reviews, Pic } from '../components/ui.jsx';
import { areaPages } from '../data/areas.js';
import { faqsFor } from '../lib/seo.js';
import { FareEstimator, FareFormula } from '../components/Pricing.jsx';
import { business } from '../data/site.js';

export function AreasHub() {
  const path = '/service-areas/';
  const featured = ['Lunenburg', 'Wolfville', 'Kentville', 'Truro', 'Antigonish', 'New Glasgow', 'Bridgewater', 'Yarmouth', 'Sydney', 'Moncton, NB', 'Charlottetown, PEI'];
  return (
    <>
      <PageHero path={path} eyebrow="Where we drive" title="Taxi service areas across Nova Scotia" img="nova-scotia-service-map" imgAlt="Map of Nova Scotia showing Halifax, Truro, Wolfville, New Glasgow, Antigonish, Bridgewater and Sydney">
        Based in Halifax and open 24/7, we cover the whole Halifax Regional Municipality and drive anywhere in Nova Scotia, New Brunswick and PEI. Every trip is priced the same way: $2 per km with a $48 minimum, plus the vehicle surcharge.
      </PageHero>
      <Section title="Local area pages">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(areaPages).map(([to, a]) => (
            <Link key={to} to={to} className="card no-underline hover:shadow-md"><h3 className="text-lg font-semibold text-ink">{a.name} taxi</h3><p className="mt-1.5 text-[15px] text-ink-2">{a.intro.split('. ')[0]}.</p></Link>
          ))}
        </div>
      </Section>
      <Section title="Halifax Regional Municipality" className="bg-band">
        <p className="max-w-3xl text-ink-2">Halifax Peninsula, Clayton Park, Spryfield, Cowie Hill, Timberlea, Dartmouth, Cole Harbour, Eastern Passage, Bedford, Hammonds Plains, Lower, Middle and Upper Sackville, Beaver Bank, Fall River and Waverley. <Link to="/schedule/">Estimate your fare →</Link></p>
      </Section>
      <Section title="Long distance across Nova Scotia">
        <ul className="flex flex-wrap gap-2">{featured.map((p) => <li key={p} className="chip text-[13px]">{p}</li>)}</ul>
        <p className="mt-4 text-[15px] text-ink-2">Long distance trips use the same per-km formula. <Link to="/schedule/#long-distance">Estimate a long distance fare →</Link></p>
      </Section>
      <CtaBand />
    </>
  );
}

export function AreaPage({ path }) {
  const a = areaPages[path];
  return (
    <>
      <PageHero path={path} eyebrow={`${a.name}, Nova Scotia`} title={a.h1} img={a.img} imgAlt={`48Taxi & Limo serving ${a.name}`}>
        {a.intro}
      </PageHero>
      <Section title={`${a.name} taxi fares`} intro="Priced by driving distance. Cash, credit and debit accepted.">
        <FareFormula />
        <div className="mt-6"><FareEstimator defaultFrom={`${a.name}, NS`} defaultTo="Halifax Stanfield International Airport" /></div>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/book-now/?service=airport" className="btn-primary">Book a {a.name} ride</Link><Link to="/schedule/" className="btn-ghost">All prices</Link></div>
      </Section>
      <Section title={`Why ${a.name} riders choose 48Taxi`} className="bg-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <Checklist className="text-[17px]" items={a.points} />
          <div>
            <h3 className="font-semibold">Pickups across {a.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">{a.neighbourhoods.map((n) => <li key={n} className="chip">{n}</li>)}</ul>
          </div>
        </div>
      </Section>
      {a.review ? <Reviews only={[a.review]} limit={1} title={`A ${a.name} rider’s review`} /> : null}
      <Section title="Also nearby" tight>
        <div className="flex flex-wrap gap-3">
          {Object.entries(areaPages).filter(([to]) => to !== path).map(([to, x]) => <Link key={to} to={to} className="btn-ghost">{x.name}</Link>)}
          <Link to="/halifax-airport-taxi/" className="btn-ghost">Halifax airport taxi</Link>
        </div>
      </Section>
      <Faq items={faqsFor(path)} />
      <CtaBand title={`Need a ride in ${a.name}?`} text={`Book online or call ${business.phone.display}, 24/7.`} />
    </>
  );
}

export { Pic };
