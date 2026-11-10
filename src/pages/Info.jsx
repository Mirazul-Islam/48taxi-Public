import { Link } from 'react-router-dom';
import { PageHero, Section, Pic, Checklist, Faq, CtaBand, Prose, Ratings, Icon } from '../components/ui.jsx';
import BookingForm from '../components/BookingForm.jsx';
import { ContactForm, AffiliateForm } from '../components/Forms.jsx';
import { faqsFor } from '../lib/seo.js';
import legal from '../data/legal.json';
import { business, telHref, fullAddress } from '../data/site.js';

export function BookNow() {
  const path = '/book-now/';
  return (
    <>
      <PageHero path={path} eyebrow="Ride with us" title="Book a ride" actions={false}>
        Request a booking or a quote for an airport transfer, point-to-point ride, hourly charter or Nova Scotia tour. We’ll confirm by email, phone or text. Travelling within a few hours? Call <a href={telHref}>{business.phone.display}</a>.
      </PageHero>
      <section className="py-10 sm:py-14">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="card p-5 sm:p-8"><BookingForm /></div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card">
              <p className="font-semibold">Prefer to talk?</p>
              <a href={telHref} className="mt-2 flex items-center gap-2 text-xl font-bold no-underline"><Icon name="phone" />{business.phone.display}</a>
              <p className="mt-1 text-sm text-ink-3">Real dispatchers, 24/7.</p>
            </div>
            <div className="card"><p className="font-semibold">Good to know</p><Checklist className="mt-3 text-sm text-ink-2" items={['Flight tracking on airport trips', 'No charge for verified flight delays', 'Child & booster seats on request', 'Cash, credit and debit accepted']} /></div>
            <div className="card"><Ratings /></div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function About() {
  const path = '/about/';
  return (
    <>
      <PageHero path={path} eyebrow="About us" title="About 48Taxi & Limo" img="chauffeur-driving" imgAlt="48Taxi chauffeur at the wheel">
        At 48Taxi &amp; Limo Service, we redefine transportation by combining luxury, reliability and professionalism.
      </PageHero>
      <Section>
        <div className="max-w-3xl space-y-4 text-[17px] text-ink-2">
          <p>Our mission is to provide every client with a first-class travel experience, whether it’s an airport transfer, corporate ride, special event or private chauffeur service.</p>
          <p>Our carefully selected drivers prioritize punctuality, discretion and exceptional customer care, while our modern fleet ensures comfort and style on every journey. Available 24/7, we are committed to delivering seamless transportation solutions tailored to your schedule and expectations.</p>
          <p>With 48Taxi &amp; Limo Service, you’re not just getting a ride: you’re choosing dependable service, refined travel and peace of mind.</p>
        </div>
        <div className="mt-8"><Ratings /></div>
      </Section>
      <Section title="What we do" className="bg-band">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[['/halifax-airport-taxi/', 'Airport transfers'], ['/halifax-limo-service/', 'Limo & chauffeur service'], ['/tour/', 'Nova Scotia tours'], ['/schedule/', 'Prices & fare estimator'], ['/service-areas/', 'Service areas']].map(([to, l]) => <Link key={to} to={to} className="card font-semibold no-underline hover:shadow-md">{l} →</Link>)}
        </div>
      </Section>
      <CtaBand title="Ride with us" text="Take your travel experience to the next level." />
    </>
  );
}

export function Contact() {
  const path = '/contact/';
  const row = (icon, label, children) => (
    <div className="flex gap-3"><span className="mt-0.5 text-brand-700"><Icon name={icon} /></span><div><p className="text-sm text-ink-3">{label}</p><div className="font-semibold">{children}</div></div></div>
  );
  return (
    <>
      <PageHero path={path} eyebrow="Contact us" title="Contact 48Taxi & Limo" actions={false}>
        Reliable rides anytime. Call, email or send us a message and we’ll get back to you promptly.
      </PageHero>
      <section className="py-10 sm:py-14">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            {row('phone', 'Phone (24/7)', <><a href={telHref} className="block">{business.phone.display}</a><a href={`tel:${business.phone2.tel}`} className="block">{business.phone2.display}</a><a href={`tel:${business.tollFree.tel}`} className="block">Toll free {business.tollFree.display}</a></>)}
            {row('mail', 'Email', <a href={`mailto:${business.email}`}>{business.email}</a>)}
            {row('pin', 'Address', fullAddress)}
            {row('clock', 'Hours', business.hours)}
            <div className="card"><p className="font-semibold">Follow us</p><p className="mt-1 text-sm text-ink-3">Updates, promos and service highlights.</p>
              <ul className="mt-3 flex gap-4"><li><a href={business.social.facebook} rel="noopener" target="_blank">Facebook</a></li><li><a href={business.social.instagram} rel="noopener" target="_blank">Instagram</a></li><li><a href={business.social.tiktok} rel="noopener" target="_blank">TikTok</a></li></ul>
            </div>
          </div>
          <div className="card p-5 sm:p-8"><h2 className="mb-5 text-xl font-semibold">Send us a message</h2><ContactForm /></div>
        </div>
      </section>
    </>
  );
}

export function Affiliate() {
  const path = '/affiliate/';
  return (
    <>
      <PageHero path={path} eyebrow="Agencies & partners" title="Become a 48Taxi affiliate" actions={false}>
        Transportation companies, travel agencies, hotels and tour operators: partner with 48Taxi &amp; Limo for dependable rides in Halifax and across Nova Scotia. Tell us about your company and we’ll be in touch.
      </PageHero>
      <section className="py-10 sm:py-14"><div className="wrap max-w-3xl"><div className="card p-5 sm:p-8"><AffiliateForm /></div></div></section>
    </>
  );
}

const devRole = {
  title: 'Full Stack Software Developer', pay: '$25 to $30 per hour CAD, based on experience', meta: ['Fully remote (Nova Scotia based)', 'Flexible hours', 'Application deadline: May 1'],
  about: 'You will develop and maintain our software stack and AI dispatch systems, working directly with the founder on production systems used by customers and drivers every day. This is hands-on engineering work on real, in-market products, not a maintenance role.',
  doList: ['Develop and maintain React Native mobile applications for iOS and Android', 'Develop and maintain React based web applications', 'Develop and maintain backend APIs and serverless or cloud functions', 'Develop and maintain AI dispatch systems and agentic workflows', 'Design and manage PostgreSQL database schemas and queries via Supabase', 'Implement cloud infrastructure and deployment pipelines', 'Integrate LLMs and AI assisted workflows into production features', 'Write, test, deploy, and monitor production software', 'Participate in technical decision making and system architecture'],
  req: ['Proficiency in JavaScript and TypeScript', 'Experience with React and React Native', 'Comfortable building and consuming REST APIs', 'Working knowledge of SQL and relational databases (PostgreSQL preferred)', 'Familiarity with Git and modern development workflows', 'Strong portfolio, GitHub, or demonstrable projects'],
  nice: ['Experience with Supabase, Firebase, or similar BaaS platforms', 'Serverless or cloud functions (AWS Lambda, Vercel, Cloudflare Workers, Supabase Edge Functions)', 'Experience working with LLMs, AI assisted development tools, prompt engineering, and agentic workflows', 'Mobile app deployment (App Store, Google Play)', 'CI/CD and automated testing'],
  offer: ['Fully remote, work from anywhere in Nova Scotia', 'Flexible schedule, output focused culture', 'Performance based raises', 'Real production system experience from day one', 'Hands on work with a modern AI stack', 'Growth opportunity at an established, highly rated Nova Scotia company', 'Direct mentorship and collaboration with the founder'],
  mail: 'Application%20%E2%80%93%20Full%20Stack%20Software%20Developer',
};
const driverRole = {
  title: 'Limo Driver Partner', pay: 'Partnership opportunity', meta: ['Own your vehicle', 'Flexible schedule', 'Province-wide service'],
  about: 'We are expanding our network of partner drivers across Nova Scotia. If you own a clean, well maintained vehicle and want to operate under an established, trusted brand with steady dispatch volume, this is for you. You keep ownership of your vehicle and gain access to our customer base, booking system and dispatch operations.',
  doList: ['A vehicle you own (sedan, SUV, or limo class)', 'Clean driving record', 'Valid Nova Scotia driver’s licence and required taxi or limo permits', 'Proper insurance coverage for commercial passenger service', 'Professional appearance and customer service mindset', 'Smartphone for dispatch and booking app'],
  req: ['Operate under the 48 Taxi & Limo Service brand', 'Access to our dispatch and customer booking network', 'Flexible schedule, drive when it suits you', 'Steady demand across Nova Scotia', 'Support from a growing local company', 'Keep ownership and equity in your vehicle'],
  who: 'Experienced taxi, limo or rideshare drivers, owner-operators looking for steadier dispatch, and entrepreneurial drivers who want the support of an established brand while keeping their independence.',
  mail: 'Limo%20Driver%20Partner%20Application',
};

function Role({ r, labels }) {
  return (
    <article className="card p-6 sm:p-8">
      <p className="chip">{r === devRole ? 'Now hiring' : 'Partnership opportunity'}</p>
      <h2 className="mt-3 text-2xl font-bold">{r.title}</h2>
      <p className="mt-1 font-semibold text-brand-700">{r.pay}</p>
      <ul className="mt-2 flex flex-wrap gap-2">{r.meta.map((m) => <li key={m} className="chip">{m}</li>)}</ul>
      <p className="mt-5 text-ink-2">{r.about}</p>
      <h3 className="mt-6 font-semibold">{labels[0]}</h3><Checklist className="mt-2 text-[15px] text-ink-2" items={r.doList} />
      <h3 className="mt-6 font-semibold">{labels[1]}</h3><Checklist className="mt-2 text-[15px] text-ink-2" items={r.req} />
      {r.nice && <><h3 className="mt-6 font-semibold">Nice to have</h3><Checklist className="mt-2 text-[15px] text-ink-2" items={r.nice} /></>}
      {r.offer && <><h3 className="mt-6 font-semibold">What we offer</h3><Checklist className="mt-2 text-[15px] text-ink-2" items={r.offer} /></>}
      {r.who && <><h3 className="mt-6 font-semibold">Who should apply</h3><p className="mt-2 text-ink-2">{r.who}</p></>}
      <a href={`mailto:${business.email}?subject=${r.mail}`} className="btn-primary mt-6">Apply via email</a>
    </article>
  );
}

export function Careers() {
  const path = '/careers/';
  return (
    <>
      <PageHero path={path} eyebrow="Careers" title="Join the 48 Taxi team" actions={false}>
        48 Taxi &amp; Limo Service is one of the highest rated taxi and limo companies in Nova Scotia. Explore current opportunities below.
      </PageHero>
      <section className="py-10 sm:py-14">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <Role r={devRole} labels={['What you will do', 'Required skills']} />
          <Role r={driverRole} labels={['What you bring', 'What you get']} />
        </div>
        <div className="wrap mt-8"><div className="card bg-band"><h2 className="text-lg font-semibold">More roles coming soon</h2><p className="mt-1 text-ink-2">No other positions are available at this time. Send your resume to <a href={`mailto:${business.email}`}>{business.email}</a> to be considered for future openings.</p><p className="mt-3 text-sm text-ink-3">48 Taxi &amp; Limo Service is an equal opportunity employer. We welcome applications from all qualified candidates regardless of race, gender, age, religion, sexual orientation, disability or background.</p></div></div>
      </section>
    </>
  );
}

export function FaqPage() {
  const path = '/faq/';
  return (
    <>
      <PageHero path={path} eyebrow="Help" title="Frequently asked questions" actions={false}>
        Quick answers about fares, booking, airport pickups, payment and cancellations. Can’t find what you need? Call <a href={telHref}>{business.phone.display}</a>, 24/7.
      </PageHero>
      <Faq items={faqsFor(path)} title="Taxi, airport and booking questions" />
      <CtaBand />
    </>
  );
}

export function Legal({ path, title, blocks, eyebrow = 'Policies' }) {
  return (
    <>
      <PageHero path={path} eyebrow={eyebrow} title={title} actions={false} />
      <section className="py-10 sm:py-14"><div className="wrap"><Prose blocks={blocks} /></div></section>
    </>
  );
}
export const PrivacyPolicy = () => <Legal path="/privacy-policy/" title="Privacy policy" blocks={legal.privacy} />;
export const RefundPolicy = () => <Legal path="/refund-policy/" title="Airport service refund, cancellation & terms of service" blocks={legal.refund} />;
export const CancellationPolicy = () => (
  <Legal path="/return-policy-cancellation-policy/" title="Returns & cancellations" blocks={[{ t: 'h2', x: 'Voucher policy' }, ...legal.cancellation, { t: 'p', x: 'See also our full Refund, Cancellation & Terms of Service.' }]} />
);


export { Pic, Faq };
