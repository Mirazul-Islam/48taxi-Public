import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, Reviews } from '../components/ui.jsx';
import { tours, golf } from '../data/content.js';
import { faqsFor } from '../lib/seo.js';

const bookUrl = (slug) => `/book-now/?service=tours&package=${slug}`;

export function Tours() {
  const path = '/tour/';
  return (
    <>
      <PageHero path={path} eyebrow="Tour packages" title="Private tours from Halifax" img="peggys-cove-lighthouse" imgAlt="Peggy’s Cove lighthouse on the granite shore at sunset">
        Take your Nova Scotia trip to the next level with your own driver and vehicle. Every tour is private, so you can customize the stops for your group, from Peggy’s Cove and Lunenburg to the Cabot Trail.
      </PageHero>
      <Section title="Tour packages">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <article key={t.slug} className="card flex flex-col">
              <p className="text-sm font-semibold text-brand-700">{t.length}</p>
              <h3 className="mt-1 text-lg font-semibold">{t.page ? <Link to={t.page} className="text-ink no-underline hover:text-brand-700">{t.name}</Link> : t.name}</h3>
              <p className="mt-2 flex-1 text-[15px] text-ink-2">{t.text}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">{t.tags.map((g) => <li key={g} className="chip">{g}</li>)}</ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to={bookUrl(t.slug)} className="btn-dark min-h-[40px] px-4">Book now</Link>
                {t.page && <Link to={t.page} className="text-sm font-semibold">Tour details →</Link>}
              </div>
              <p className="mt-3 text-xs text-ink-3">Private tours available; customize stops for your group.</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Golf getaways" intro="Door-to-door rides with room for clubs to Nova Scotia’s best courses." className="bg-band">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {golf.map((g) => <div key={g.name} className="card"><h3 className="font-semibold">{g.name}</h3><p className="mt-1 text-[15px] text-ink-2">{g.text}</p></div>)}
        </div>
      </Section>
      <Reviews only={['Sbeii Ahlem', 'Tania Sultana']} title="Tour reviews" />
      <CtaBand title="Plan a custom tour" text="Pick “Custom tour” on the booking form and tell us what you’d like to see." />
    </>
  );
}

export function PeggysCove() {
  const path = '/tour/peggys-cove/';
  return (
    <>
      <PageHero path={path} eyebrow="Half-day private tour" title="Peggy’s Cove tour from Halifax" img="peggys-cove-lighthouse" imgAlt="Peggy’s Cove lighthouse reflected in a tide pool">
        Iconic lighthouse views, fishing villages and classic South Shore photo stops, with your own driver and no tour bus. We pick you up at your hotel, the cruise terminal or your home in Halifax.
      </PageHero>
      <Section title="What you’ll see">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 text-ink-2">
            <p>Peggy’s Cove sits on the granite coast about 45 minutes southwest of Halifax. Its red-and-white lighthouse, perched on wave-smoothed rock, is one of the most photographed places in Canada.</p>
            <p>On a private tour you set the pace: linger at the lighthouse at golden hour, stop for chowder or lobster, and pull over for the coves and villages along the way.</p>
            <Checklist items={['Peggy’s Point Lighthouse and the granite shoreline', 'The working fishing village and harbour', 'Coastal photo stops along St. Margarets Bay', 'Optional stops for lunch, galleries and craft shops', 'Extend to Lunenburg and Mahone Bay for a full day']} />
          </div>
          <Pic name="lunenburg-harbour" alt="Colourful waterfront buildings in Lunenburg harbour" sizes="(min-width: 1024px) 560px, 100vw" imgClass="h-auto w-full rounded-2xl object-cover" />
        </div>
      </Section>
      <Section title="Good to know" className="bg-band">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="card"><h3 className="font-semibold">Length</h3><p className="mt-1 text-ink-2">Half-day. Extend to a full day with Lunenburg (UNESCO World Heritage Site) and Mahone Bay.</p></div>
          <div className="card"><h3 className="font-semibold">Private & flexible</h3><p className="mt-1 text-ink-2">Just your group and your driver. Customize the stops; families with child seats welcome.</p></div>
          <div className="card"><h3 className="font-semibold">Safety on the rocks</h3><p className="mt-1 text-ink-2">Stay off the black rocks near the water: waves at Peggy’s Cove can be dangerous even on calm days.</p></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><Link to={bookUrl('peggys-cove-coastal-stops')} className="btn-primary">Book the Peggy’s Cove tour</Link><Link to="/tour/" className="btn-ghost">All tours</Link></div>
      </Section>
      <Reviews only={['Sbeii Ahlem', 'Tania Sultana']} title="Tour reviews" />
      <Faq items={faqsFor(path)} />
      <CtaBand title="See Peggy’s Cove your way" />
    </>
  );
}
