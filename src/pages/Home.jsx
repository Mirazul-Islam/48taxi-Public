import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pic, Icon, Arrow, CtaBand, Ratings, BookButton, CallButton, Stars, MaskTitle } from '../components/ui.jsx';
import { popularServices, golf, hotels, reviews, tours } from '../data/content.js';
import { perPerson, money } from '../data/fares.js';
import { PRICING, VEHICLES, EXAMPLE_TRIPS, tripFare } from '../lib/pricing.js';
import { business } from '../data/site.js';
import DoorScene from '../components/DoorScene.jsx';

/* ------------------------------------------------------------------ */
/* Hero booking bar: collects the trip and hands it to /book-now/.      */
/* (The fare engine is connected later; this is front end only.)        */
/* ------------------------------------------------------------------ */
function HeroBooking() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('airport');
  const [v, setV] = useState({ pickup: '', dropoff: '', date: '', time: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams({ service: mode === 'hourly' ? 'hourly' : mode === 'airport' ? 'airport' : 'p2p' });
    Object.entries(v).forEach(([k, x]) => x && q.set(k, x));
    navigate(`/book-now/?${q.toString()}`);
  };
  const tabs = [['airport', 'Airport'], ['p2p', 'City ride'], ['hourly', 'By the hour']];
  const fieldCls = 'w-full bg-transparent text-[15px] text-white placeholder:text-ink-3 focus:outline-none';
  return (
    <form onSubmit={submit} className="glass fade-up rounded-[28px] p-2 sm:p-2.5" style={{ '--d': '700ms' }} aria-label="Start a booking">
      <div role="tablist" aria-label="Ride type" className="flex gap-1 p-1">
        {tabs.map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${mode === k ? 'bg-white text-paper' : 'text-ink-2 hover:text-white'}`}>{l}</button>
        ))}
      </div>
      <div className="grid gap-1 rounded-[22px] bg-black/35 p-1.5 md:grid-cols-[1.3fr_1.3fr_1fr_0.8fr_auto]">
        <label className="rounded-2xl px-4 py-3 transition-colors focus-within:bg-white/[0.06] hover:bg-white/[0.04]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">Pickup</span>
          <input className={fieldCls} placeholder={mode === 'airport' ? 'Address, or Halifax Stanfield (YHZ)' : 'Pickup address'} value={v.pickup} onChange={set('pickup')} autoComplete="street-address" />
        </label>
        <label className="rounded-2xl px-4 py-3 transition-colors focus-within:bg-white/[0.06] hover:bg-white/[0.04]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">{mode === 'hourly' ? 'Plan / notes' : 'Drop-off'}</span>
          <input className={fieldCls} placeholder={mode === 'hourly' ? 'e.g. wedding, 4 hours' : mode === 'airport' ? 'Halifax Stanfield (YHZ)' : 'Destination'} value={v.dropoff} onChange={set('dropoff')} />
        </label>
        <label className="rounded-2xl px-4 py-3 transition-colors focus-within:bg-white/[0.06] hover:bg-white/[0.04]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">Date</span>
          <input type="date" className={fieldCls} value={v.date} onChange={set('date')} />
        </label>
        <label className="rounded-2xl px-4 py-3 transition-colors focus-within:bg-white/[0.06] hover:bg-white/[0.04]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">Time</span>
          <input type="time" className={fieldCls} value={v.time} onChange={set('time')} />
        </label>
        <button type="submit" className="btn-primary m-1 min-h-[56px] rounded-[18px] px-7">See fare <Arrow /></button>
      </div>
    </form>
  );
}

/* Circular rotating badge */
function Badge() {
  return (
    <div className="relative hidden h-36 w-36 lg:block" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full">
        <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text className="fill-sand text-[9.5px] font-semibold uppercase tracking-[0.32em]"><textPath href="#circ">Open 24/7 · Halifax · YHZ · Nova Scotia ·</textPath></text>
      </svg>
      <span className="display absolute inset-0 flex items-center justify-center text-5xl text-brand-700">48</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Pic name="chauffeur-door" alt="" priority sizes="100vw" className="block h-full w-full" imgClass="kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-paper/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper/90 via-paper/40 to-transparent" />
      </div>
      <div className="wrap pb-10 pt-36 sm:pb-14">
        <div className="flex items-end justify-between gap-10">
          <div className="max-w-4xl">
            <p className="eyebrow fade-up" style={{ '--d': '100ms' }}>Halifax · Dartmouth · Halifax Stanfield (YHZ)</p>
            <MaskTitle
              text="Halifax taxi & airport limo,|<em>always on time.</em>"
              className="display mt-6 text-[3.1rem] sm:text-[5.2rem] lg:text-[7rem]"
              delay={200}
            />
            <p className="lede fade-up mt-7 max-w-xl" style={{ '--d': '550ms' }}>
              A locally owned taxi and chauffeur company. Rides to Halifax Stanfield, private tours, and
              long-distance trips across Nova Scotia, any hour of the day, with the price shown before you book.
            </p>
          </div>
          <Badge />
        </div>
        <div className="mt-10"><HeroBooking /></div>
        <div className="fade-up mt-6 flex flex-wrap items-center justify-between gap-4" style={{ '--d': '850ms' }}>
          <Ratings />
          <CallButton className="link-arrow text-[15px]" label={`Or call ${business.phone.display}`} />
        </div>
      </div>
    </section>
  );
}

/* MaskTitle renders text; allow a single <em> for the italic accent */
function Ticker({ items, speed = '45s', reverse = false, className = '' }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? 'marquee-rev' : ''}`} style={{ '--speed': speed }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 px-4 whitespace-nowrap">
            {t}<span className="text-brand-700">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { n: 4.9, dec: true, suf: '', label: 'Google rating', note: 'from real riders' },
    { n: 24, suf: '/7', label: 'Dispatch & rides', note: 'red-eyes included' },
    { n: PRICING.minimumFare, pre: '$', suf: '', label: 'Minimum fare', note: `then $${PRICING.perKm}/km, no surge` },
    { n: PRICING.waiting.freeAirportMin, suf: ' min', label: 'Free airport waiting', note: 'after your flight lands' },
  ];
  return (
    <section className="border-y border-white/[0.06]">
      <div className="wrap grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`py-10 sm:py-14 ${i % 2 ? 'pl-6 sm:pl-10' : 'pr-6'} ${i > 0 ? 'lg:border-l lg:border-white/[0.06] lg:pl-10' : ''} ${i === 1 ? 'border-l border-white/[0.06] lg:border-l' : ''} ${i === 3 ? 'border-l border-white/[0.06]' : ''} ${i > 1 ? 'border-t border-white/[0.06] lg:border-t-0' : ''}`} data-reveal style={{ '--d': `${i * 90}ms` }}>
            <p className="display text-6xl text-white sm:text-7xl">
              <span data-count={s.dec ? s.n.toFixed(1) : s.n} data-prefix={s.pre || ''} data-suffix={s.suf}>{s.pre || ''}{s.dec ? s.n.toFixed(1) : s.n}{s.suf}</span>
            </p>
            <p className="mt-3 text-[15px] font-medium text-white">{s.label}</p>
            <p className="text-sm text-ink-3">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ num, eyebrow, title, intro, right }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow" data-reveal="fade"><span className="num">{num}</span>{eyebrow}</p>
        <h2 className="h-section mt-5" data-reveal dangerouslySetInnerHTML={{ __html: title }} />
        {intro && <p className="lede mt-5 max-w-xl" data-reveal style={{ '--d': '100ms' }}>{intro}</p>}
      </div>
      {right && <div data-reveal style={{ '--d': '150ms' }}>{right}</div>}
    </div>
  );
}

/* Services: numbered list; hovering a row crossfades the photo panel */
function Services() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap">
        <SectionHead num="01" eyebrow="Services" title="Every ride, <em>handled.</em>" intro="From a 5 a.m. run to YHZ to a day on the Cabot Trail, one call or one form gets it done." right={<Link to="/halifax-limo-service/" className="link-arrow">Limo & chauffeur service <Arrow /></Link>} />
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <ol className="border-t border-white/10">
            {popularServices.map((s, i) => (
              <li key={s.title} data-reveal style={{ '--d': `${i * 60}ms` }}>
                <Link to={s.to} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/10 py-6 no-underline sm:py-7">
                  <span className={`text-sm tabular-nums transition-colors ${active === i ? 'text-brand-700' : 'text-ink-3'}`}>0{i + 1}</span>
                  <span>
                    <span className={`display block text-3xl transition-all duration-500 sm:text-[2.6rem] ${active === i ? 'translate-x-2 text-white' : 'text-ink-2'}`}>{s.title}</span>
                    <span className="mt-1 block max-w-md text-[15px] text-ink-3">{s.text}</span>
                  </span>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${active === i ? 'rotate-0 border-brand-700 bg-brand-700 text-onaccent' : '-rotate-45 border-white/15 text-white'}`}><Arrow className="h-4 w-4" /></span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[28px]" data-wipe>
              {popularServices.map((s, i) => (
                <Pic key={s.img} name={s.img} alt={s.title} sizes="560px" className={`absolute inset-0 transition-all duration-700 ${active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} imgClass="h-full w-full object-cover" />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 text-sm text-ink-2"><span className="display block text-3xl text-white">{popularServices[active].title}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Pricing: the fare formula, worked examples and a live distance slider */
function FareSection() {
  const [km, setKm] = useState(38);
  const base = VEHICLES.filter((v, i, all) => all.findIndex((x) => x.cls === v.cls) === i); // cheapest of each class
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.06] bg-night py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-brand-700/10 blur-[110px]" />
      <div className="wrap grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow" data-reveal="fade"><span className="num">02</span>Honest pricing</p>
          <h2 className="h-section mt-5" data-reveal>${PRICING.perKm} a kilometre. <em>Shown before you book.</em></h2>
          <p className="lede mt-6" data-reveal>Every fare is the higher of ${PRICING.minimumFare} or ${PRICING.perKm} × km, plus a small surcharge for bigger or premium vehicles. No meter, no surge. The booking form adds it all up for you, extras included.</p>
          <div className="mt-8 overflow-hidden rounded-[24px]" data-wipe>
            <Pic name="airport-meet-greet" alt="48Taxi chauffeur waiting with a welcome sign in the arrivals hall at Halifax Stanfield" sizes="(min-width: 1024px) 520px, 100vw" imgClass="aspect-[3/2] h-auto w-full object-cover" />
          </div>
        </div>
        <div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 sm:p-8" data-reveal>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="km-slider" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">Try a distance</label>
              <p className="display text-4xl text-white"><span className="tabular-nums">{km}</span> km</p>
            </div>
            <input id="km-slider" type="range" min="2" max="150" value={km} onChange={(e) => setKm(+e.target.value)} className="mt-4 w-full accent-brand-700" />
            <ul className="mt-6">
              {base.map((v) => (
                <li key={v.cls} className="flex items-baseline gap-4 border-b border-white/[0.07] py-4 last:border-b-0">
                  <span className="text-[17px] text-white">{v.cls} <span className="text-ink-3">· {v.model}</span></span>
                  <span aria-hidden="true" className="flex-1 translate-y-[-4px] border-b border-dotted border-white/15" />
                  <span className="display text-3xl tabular-nums text-white">{money(tripFare(km, v.model))}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
            <span>Example trip</span><span>Corolla / Camry</span>
          </div>
          <ul>
            {EXAMPLE_TRIPS.map((t, i) => (
              <li key={t.km} className="group flex items-baseline gap-4 border-b border-white/[0.07] py-5" data-reveal style={{ '--d': `${i * 60}ms` }}>
                <span className="text-[17px] text-white transition-colors group-hover:text-brand-700">{t.label} <span className="text-ink-3">· {t.km} km</span></span>
                <span aria-hidden="true" className="flex-1 translate-y-[-4px] border-b border-dotted border-white/15" />
                <span className="display text-3xl text-white">{money(tripFare(t.km, 'Toyota Camry'))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Link to="/book-now/" className="btn-primary">See my exact fare <Arrow /></Link>
            <Link to="/services-rates/" className="btn-ghost">Every vehicle & extra</Link>
          </div>
          <p className="mt-6 text-sm text-ink-3">Extra stops ${PRICING.perStop}. Airport pickups include {PRICING.waiting.freeAirportMin} minutes of free waiting after landing. See <Link to="/schedule/">all prices</Link>.</p>
        </div>
      </div>
    </section>
  );
}

/* Fleet: horizontal scroll-snap slider with arrow controls */
const FLEET = [
  { cls: 'Sedan', models: 'Toyota Corolla · Camry · Lincoln MKS', pax: 4, from: '+$0–15', use: 'Airport runs & business travel', img: 'chauffeur-door' },
  { cls: 'Mid-size SUV', models: 'Toyota Highlander · Lincoln MKX', pax: 6, from: '+$10–15', use: 'Families & winter roads', img: 'airport-traveller' },
  { cls: 'Full-size SUV', models: 'Chevy Suburban · Cadillac Escalade', pax: 7, from: '+$25–40', use: 'Groups, golf bags, VIP', img: 'driver-cockpit' },
  { cls: 'Minivan', models: 'Dodge Caravan · Honda Odyssey', pax: 7, from: '+$10', use: 'Groups with luggage', img: 'passenger-call' },
]; // Seating and surcharges from the pricing guide (src/lib/pricing.js). TODO(owner): send real fleet photos.

function Fleet() {
  const ref = useRef(null);
  const go = (d) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: 'smooth' });
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap">
        <SectionHead num="03" eyebrow="The fleet" title="Chosen for <em>comfort.</em>" intro="Clean, modern sedans, SUVs and minivans. Every vehicle insured, every driver licensed and carefully selected." right={
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous vehicles" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-brand-700 hover:text-brand-700"><Arrow className="h-4 w-4 rotate-180" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next vehicles" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-brand-700 hover:text-brand-700"><Arrow className="h-4 w-4" /></button>
          </div>
        } />
      </div>
      <div ref={ref} className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-8 lg:px-[max(2rem,calc((100vw_-_76rem)/2_+_2rem))] scroll-px-5 sm:scroll-px-8 lg:scroll-px-[max(2rem,calc((100vw_-_76rem)/2_+_2rem))]">
        {FLEET.map((f, i) => (
          <article key={f.cls} className="group spotlight relative w-[82vw] flex-none snap-start overflow-hidden rounded-[28px] border border-white/[0.08] bg-card sm:w-[440px]" data-reveal style={{ '--d': `${i * 90}ms` }}>
            <div className="overflow-hidden">
              <Pic name={f.img} alt={`${f.cls}: ${f.models}`} sizes="440px" imgClass="aspect-[4/3] h-auto w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            </div>
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">0{i + 1}</p>
              <h3 className="display mt-2 text-4xl">{f.cls}</h3>
              <p className="mt-1 text-[15px] text-ink-3">{f.models}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.08] pt-5 text-sm text-ink-2">
                <span className="flex items-center gap-2"><Icon name="user" className="h-4 w-4 text-brand-700" />Up to {f.pax}</span>
                <span className="tabular-nums text-brand-700">{f.from}</span>
                <span className="flex items-center gap-2"><Icon name="sparkle" className="h-4 w-4 text-brand-700" />{f.use}</span>
              </div>
            </div>
          </article>
        ))}
        <div className="w-1 flex-none" aria-hidden="true" />
      </div>
    </section>
  );
}

/* How it works: sticky heading, steps with an amber timeline */
function HowItWorks() {
  const steps = [
    ['Book in a minute', 'Tell us where and when online, or call a real dispatcher 24/7. Add child seats, stops or a return trip.'],
    ['Fare confirmed', 'Your price is agreed before the trip. A confirmation text arrives ahead of pickup.'],
    ['We track your flight', 'Land early or late and your driver adjusts. Verified delays are never charged.'],
    ['Arrive, rested', 'Door to door in a clean, quiet car. Bags handled; you just sit back.'],
  ];
  return (
    <section className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow" data-reveal="fade"><span className="num">04</span>How it works</p>
          <h2 className="h-section mt-5" data-reveal>Four steps. <em>Zero stress.</em></h2>
          <p className="lede mt-6 max-w-md" data-reveal>Booking a Halifax taxi or airport limo with 48 is designed to take less time than finding your boarding pass.</p>
          <div className="mt-8" data-reveal><BookButton>Start booking</BookButton></div>
        </div>
        <ol className="relative border-l border-white/10 pl-10">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative pb-14 last:pb-0" data-reveal style={{ '--d': `${i * 80}ms` }}>
              <span className="absolute -left-[3.05rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-brand-700 bg-paper"><span className="h-1.5 w-1.5 rounded-full bg-brand-700" /></span>
              <p className="text-sm tabular-nums text-brand-700">Step 0{i + 1}</p>
              <h3 className="display mt-2 text-4xl sm:text-5xl">{t}</h3>
              <p className="mt-3 max-w-md text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Tours: fanned photo stack that opens on hover */
function Tours() {
  const fan = ['peggys-cove-lighthouse', 'lunenburg-harbour', 'golf-cabot-cliffs'];
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        <div className="group relative mx-auto aspect-square w-full max-w-[520px]" data-reveal="scale">
          {fan.map((n, i) => (
            <div key={n} className={`absolute inset-[12%] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl transition-transform duration-700 ease-out ${[
              '-translate-x-[6%] -rotate-[7deg] group-hover:-translate-x-[16%] group-hover:-rotate-12',
              'z-10 group-hover:scale-105',
              'translate-x-[6%] rotate-[7deg] group-hover:translate-x-[16%] group-hover:rotate-12',
            ][i]}`}>
              <Pic name={n} alt="" sizes="420px" imgClass="h-full w-full object-cover" className="block h-full w-full" />
            </div>
          ))}
        </div>
        <div>
          <p className="eyebrow" data-reveal="fade"><span className="num">05</span>Private tours</p>
          <h2 className="h-section mt-5" data-reveal>Nova Scotia, <em>at your pace.</em></h2>
          <p className="lede mt-6" data-reveal>Your own driver and vehicle, no tour bus. Peggy’s Cove at golden hour, Lunenburg’s harbour, the Cabot Trail, or the province’s best golf.</p>
          <ul className="mt-8 border-t border-white/10">
            {tours.slice(0, 5).map((t, i) => (
              <li key={t.slug} data-reveal style={{ '--d': `${i * 60}ms` }}>
                <Link to={t.page || `/book-now/?service=tours&package=${t.slug}`} className="group/t flex items-center justify-between gap-4 border-b border-white/10 py-4 no-underline">
                  <span className="text-[17px] text-white transition-colors group-hover/t:text-brand-700">{t.name}</span>
                  <span className="flex items-center gap-3 text-sm text-ink-3">{t.length}<Arrow className="h-4 w-4 -rotate-45 text-brand-700 transition-transform group-hover/t:rotate-0" /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8" data-reveal><Link to="/tour/" className="link-arrow">All {tours.length} tours & golf trips <Arrow /></Link></div>
        </div>
      </div>
    </section>
  );
}

/* Testimonials: large serif quote, auto-advancing */
function Testimonials() {
  const list = reviews.slice(0, 6);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % list.length), 7000);
    return () => clearInterval(t);
  }, [list.length]);
  const r = list[i];
  return (
    <section className="border-t border-white/[0.06] bg-night py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="eyebrow" data-reveal="fade"><span className="num">06</span>What riders say</p>
          <div data-reveal><Ratings /></div>
        </div>
        <figure className="mt-12 min-h-[300px] sm:min-h-[260px]" aria-live="polite">
          <Stars className="h-5 w-5" />
          <blockquote key={i} className="display fade-up mt-6 max-w-5xl text-[2rem] leading-[1.15] text-white sm:text-5xl">“{r.text.length > 230 ? `${r.text.slice(0, r.text.lastIndexOf(' ', 230))}…` : r.text}”</blockquote>
          <figcaption className="mt-8 text-[15px]"><span className="font-semibold text-white">{r.name}</span> <span className="text-ink-3">· {r.meta}</span></figcaption>
        </figure>
        <div className="mt-10 flex gap-2" role="tablist" aria-label="Choose review">
          {list.map((x, k) => (
            <button key={x.name} type="button" role="tab" aria-selected={k === i} aria-label={`Review by ${x.name}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-brand-700' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PerPerson() {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap">
        <SectionHead num="07" eyebrow="Per-person fares" title="Travelling together? <em>Pay per person.</em>" intro="Within our standard coverage area. Outside it, additional fees apply." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {perPerson.map((p, i) => (
            <div key={p.label} className={`card spotlight flex flex-col p-8 ${i === 0 ? 'border-brand-700/40 bg-gradient-to-b from-brand-700/10 to-card' : ''}`} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <div className="flex items-center justify-between"><p className="font-medium text-ink-2">{p.label}</p>{i === 0 && <span className="chip border-brand-700/40 text-brand-700">Best value</span>}</div>
              <p className="display mt-6 text-7xl text-white">{money(p.price)}<span className="font-sans text-base text-ink-3"> / person</span></p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/[0.08] pt-6 text-[15px] text-ink-2">
                {p.points.map((x) => <li key={x} className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-700" />{x}</li>)}
              </ul>
              <BookButton className={`${i === 0 ? 'btn-primary' : 'btn-ghost'} mt-8 w-full`}>Book</BookButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const places = ['Halifax Stanfield (YHZ)', 'Peggy’s Cove', 'Lunenburg', 'Dartmouth', 'Bedford', 'Truro', 'Wolfville', 'Cabot Trail', 'Mahone Bay', 'Chester'];
  return (
    <>
      <Hero />
      <DoorScene />
      <div className="border-y border-white/[0.06] bg-brand-700 py-4 text-[15px] font-semibold uppercase tracking-[0.18em] text-onaccent">
        <Ticker items={places} speed="50s" className="[&_.text-brand-700]:text-onaccent/60" />
      </div>
      <Stats />
      <Services />
      <FareSection />
      <Fleet />
      <HowItWorks />
      <Tours />
      <Testimonials />
      <PerPerson />
      <section className="border-t border-white/[0.06] py-16" aria-label="Hotels we serve">
        <p className="wrap eyebrow">Trusted by guests of Halifax’s best hotels</p>
        <div className="mt-8 text-2xl text-ink-3 [&_.display]:text-ink-2">
          <Ticker items={hotels.map((h) => <span key={h} className="display">{h}</span>)} speed="70s" />
        </div>
        <div className="wrap mt-8"><Link to="/corporate-hotel-transportation/" className="link-arrow">Corporate & hotel accounts <Arrow /></Link></div>
      </section>
      <section className="border-t border-white/[0.06] py-16">
        <div className="wrap">
          <p className="eyebrow">Golf getaways</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {golf.slice(0, 3).map((g, i) => (
              <article key={g.name} className="group overflow-hidden rounded-[24px] border border-white/[0.08] bg-card" data-reveal style={{ '--d': `${i * 90}ms` }}>
                <div className="overflow-hidden"><Pic name={g.img} alt={g.name} sizes="(min-width: 1024px) 400px, 100vw" imgClass="aspect-[3/2] h-auto w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" /></div>
                <div className="p-6"><h3 className="display text-3xl">{g.name}</h3><p className="mt-2 text-[15px] text-ink-3">{g.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="From the airport in Canada & USA, we’ve got you covered." text="Comfort. Reliability. 48 Taxi. Book online or call, any hour." />
    </>
  );
}
