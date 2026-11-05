import { Link } from 'react-router-dom';
import { PageHero, Section, Checklist, Faq, CtaBand, Reviews, Pic } from '../components/ui.jsx';
import { areaPages } from '../data/areas.js';
import { faqsFor } from '../lib/seo.js';
import { longDistanceNS, money } from '../data/fares.js';
import { business } from '../data/site.js';

export function AreasHub() {
  const path = '/service-areas/';
  const featured = ['Lunenburg', 'Wolfville', 'Kentville', 'Antigonish', 'New Glasgow', 'Bridgewater', 'Yarmouth', 'Sydney'];
  return (
    <>
      <PageHero path={path} eyebrow="Where we drive" title="Taxi service areas across Nova Scotia" img="nova-scotia-service-map" imgAlt="Map of Nova Scotia showing Halifax, Truro, Wolfville, New Glasgow, Antigonish, Bridgewater and Sydney">
        Based in Halifax and open 24/7, we cover the whole Halifax Regional Municipality with flat airport fares and drive anywhere in Nova Scotia, New Brunswick and PEI with fixed long distance fares.
      </PageHero>
      <Section title="Local area pages">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(areaPages).map(([to, a]) => (
            <Link key={to} to={to} className="card no-underline hover:shadow-md"><h3 className="text-lg font-semibold text-ink">{a.name} taxi</h3><p className="mt-1.5 text-[15px] text-ink-2">{a.intro.split('. ')[0]}.</p></Link>
          ))}
        </div>
      </Section>
      <Section title="Halifax Regional Municipality" className="bg-band">
        <p className="max-w-3xl text-ink-2">Halifax Peninsula, Clayton Park, Spryfield, Cowie Hill, Timberlea, Dartmouth, Cole Harbour, Eastern Passage, Bedford, Hammonds Plains, Lower, Middle and Upper Sackville, Beaver Bank, Fall River and Waverley. <Link to="/services-rates/">See flat airport fares by area →</Link></p>
      </Section>
      <Section title="Long distance across Nova Scotia">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => { const f = longDistanceNS.find((x) => x.place.startsWith(p)); return f && <li key={p} className="card flex justify-between py-3"><span>{f.place}</span><span className="font-semibold">{money(f.fare)}</span></li>; })}
        </ul>
        <p className="mt-4 text-[15px]"><Link to="/schedule/#long-distance">All 99 Nova Scotia destinations plus New Brunswick &amp; PEI →</Link></p>
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
      <Section title={`${a.name} airport fares`} intro="Flat fares, sedan / SUV. Cash, credit and debit accepted.">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="table min-w-[520px]">
            <thead><tr><th>Area</th><th className="text-right">To YHZ</th><th className="text-right">From YHZ</th></tr></thead>
            <tbody>{a.fares.map((r) => <tr key={r.area}><td className="font-medium">{r.area}</td><td className="text-right tabular-nums">{r.to}</td><td className="text-right tabular-nums">{r.from}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-3">“Quoted” fares are confirmed when you book. Prices may vary with stops, waiting time, weather, peak hours and vehicle size; gratuity not included.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/book-now/?service=airport" className="btn-primary">Book a {a.name} ride</Link><Link to="/schedule/" className="btn-ghost">Fare estimator</Link></div>
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
