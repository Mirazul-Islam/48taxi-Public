import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { business, telHref, fullAddress } from '../data/site.js';
import { Icon, Arrow } from './ui.jsx';

const nav = [
  { to: '/halifax-airport-taxi/', label: 'Airport' },
  { to: '/schedule/', label: 'Prices' },
  { to: '/tour/', label: 'Tours' },
  {
    label: 'Services',
    children: [
      { to: '/halifax-limo-service/', label: 'Limo service', note: 'Escalade, Suburban, Lincoln' },
      { to: '/airport-shuttle-halifax/', label: 'Airport shuttle', note: 'Group fares from $20' },
      { to: '/corporate-hotel-transportation/', label: 'Corporate & hotels', note: 'Billed accounts' },
      { to: '/services-rates/', label: 'Rates & extras', note: '$2/km, $48 minimum' },
      { to: '/service-areas/', label: 'Service areas', note: 'All of Nova Scotia' },
    ],
  },
  { to: '/contact/', label: 'Contact' },
];

function Logo() {
  return (
    <Link to="/" className="relative z-10 flex items-center" aria-label="48Taxi & Limo home">
      <picture>
        <source type="image/webp" srcSet="/images/logo-48taxi-282.webp" />
        <img src="/images/logo-48taxi-282.png" alt="48Taxi & Limo" width="141" height="50" className="h-9 w-auto sm:h-10" />
      </picture>
    </Link>
  );
}

const linkCls = ({ isActive }) =>
  `group relative px-3.5 py-2 text-[14px] font-medium no-underline transition-colors ${isActive ? 'text-white' : 'text-ink-2 hover:text-white'}`;
const Underline = () => <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-brand-700 transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />;

export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${scrolled || open ? 'border-b border-white/[0.07] bg-paper/75 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-black/40 to-transparent'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-paper focus:px-3 focus:py-2">Skip to content</a>
      <div className="wrap flex h-[72px] items-center justify-between gap-4 sm:h-[84px]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center lg:flex">
          {nav.map((n) =>
            n.children ? (
              <div key={n.label} className="group/dd relative">
                <button type="button" className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-ink-2 transition-colors hover:text-white" aria-haspopup="true">
                  {n.label} <span aria-hidden="true" className="text-[10px] transition-transform duration-300 group-hover/dd:rotate-180">▼</span>
                </button>
                <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition-all duration-300 group-focus-within/dd:visible group-focus-within/dd:translate-y-0 group-focus-within/dd:opacity-100 group-hover/dd:visible group-hover/dd:translate-y-0 group-hover/dd:opacity-100">
                  <div className="glass grid grid-cols-2 gap-1 rounded-2xl bg-paper/90 p-3">
                    {n.children.map((c) => (
                      <NavLink key={c.to} to={c.to} className="group/i rounded-xl px-4 py-3 no-underline transition-colors hover:bg-white/[0.06]">
                        <span className="flex items-center justify-between text-[15px] font-medium text-white">{c.label}<Icon name="arrowUpRight" className="h-3.5 w-3.5 text-brand-700 opacity-0 transition-opacity group-hover/i:opacity-100" /></span>
                        <span className="mt-0.5 block text-[13px] text-ink-3">{c.note}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={n.to} to={n.to} className={linkCls}>{n.label}<Underline /></NavLink>
            ),
          )}
        </nav>
        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a href={telHref} className="hidden items-center gap-2 text-[14px] font-semibold text-white no-underline hover:text-brand-700 xl:flex">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            {business.phone.display}
          </a>
          <Link to="/book-now/" className="btn-primary hidden min-h-[42px] px-5 text-[14px] sm:inline-flex">Book a ride <Arrow /></Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 lg:hidden">
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu: full-screen overlay with large serif links */}
      <div id="mobile-menu" className={`fixed inset-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto bg-paper px-6 pb-10 pt-6 transition-all duration-500 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <nav aria-label="Mobile">
          {[...nav.filter((n) => !n.children), ...nav.find((n) => n.children).children, { to: '/about/', label: 'About' }].map((n, i) => (
            <Link key={n.to} to={n.to} className="display flex items-center justify-between border-b border-white/[0.08] py-4 text-[2rem] text-white no-underline transition-all duration-500" style={{ transitionDelay: open ? `${80 + i * 35}ms` : '0ms', transform: open ? 'none' : 'translateY(14px)', opacity: open ? 1 : 0 }}>
              {n.label}<Icon name="arrowUpRight" className="h-5 w-5 text-brand-700" />
            </Link>
          ))}
        </nav>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link to="/book-now/" className="btn-primary">Book <Arrow /></Link>
          <a href={telHref} className="btn-ghost"><Icon name="phone" className="h-4 w-4" /> Call 24/7</a>
        </div>
      </div>
    </header>
  );
}

const footerCols = [
  {
    title: 'Rides',
    links: [
      ['/halifax-airport-taxi/', 'Halifax airport taxi'], ['/halifax-limo-service/', 'Limo service'], ['/airport-shuttle-halifax/', 'Airport shuttle & group fares'],
      ['/tour/', 'Tours'], ['/tour/peggys-cove/', 'Peggy’s Cove tour'], ['/corporate-hotel-transportation/', 'Corporate & hotels'], ['/book-now/', 'Book now'],
    ],
  },
  {
    title: 'Prices & info',
    links: [
      ['/schedule/', 'Prices & fare estimator'], ['/services-rates/', 'Rates & extras'], ['/gti/', 'YHZ pickup instructions'], ['/faq/', 'FAQ'],
    ],
  },
  {
    title: 'Areas',
    links: [
      ['/service-areas/', 'All service areas'], ['/service-areas/dartmouth/', 'Dartmouth'], ['/service-areas/bedford/', 'Bedford'],
      ['/service-areas/truro/', 'Truro'], ['/service-areas/wolfville/', 'Wolfville & Acadia'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['/about/', 'About'], ['/careers/', 'Careers'], ['/affiliate/', 'Affiliates & partners'], ['/contact/', 'Contact'],
      ['/privacy-policy/', 'Privacy policy'], ['/refund-policy/', 'Refund policy & terms'], ['/return-policy-cancellation-policy/', 'Vouchers & cancellations'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-night text-ink-2">
      <div className="wrap grid gap-12 pb-12 pt-20 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <p className="display text-4xl text-white">Comfort. Reliability. <em>48 Taxi.</em></p>
          <address className="mt-8 space-y-3 text-[15px] not-italic">
            <a href={telHref} className="flex items-center gap-3 text-xl font-semibold text-white no-underline hover:text-brand-700"><Icon name="phone" className="h-5 w-5 text-brand-700" />{business.phone.display}</a>
            <p className="pl-8 text-sm"><a href={`tel:${business.phone2.tel}`} className="text-ink-2 no-underline hover:text-white">{business.phone2.display}</a> · <a href={`tel:${business.tollFree.tel}`} className="text-ink-2 no-underline hover:text-white">{business.tollFree.display}</a></p>
            <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-ink-2 no-underline hover:text-white"><Icon name="mail" className="h-5 w-5 text-brand-700" />{business.email}</a>
            <span className="flex items-start gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 flex-none text-brand-700" />{fullAddress}</span>
            <span className="flex items-center gap-3"><Icon name="clock" className="h-5 w-5 text-brand-700" />{business.hours}</span>
          </address>
          <ul className="mt-8 flex gap-2 text-sm">
            {[['Facebook', business.social.facebook], ['Instagram', business.social.instagram], ['TikTok', business.social.tiktok]].map(([l, h]) => (
              <li key={l}><a href={h} rel="noopener" target="_blank" className="chip no-underline hover:border-brand-700 hover:text-white">{l}</a></li>
            ))}
          </ul>
        </div>
        {footerCols.map((c) => (
          <div key={c.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sand">{c.title}</p>
            <ul className="mt-5 space-y-3 text-[14px]">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-ink-2 no-underline transition-colors hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="wrap select-none overflow-hidden">
        <div className="display translate-y-[18%] whitespace-nowrap text-center text-[22vw] leading-none text-white/[0.05] after:content-['Ride_with_48.'] lg:text-[17rem]" />
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-ink-3 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</p>
          <p>Halifax, Nova Scotia · Serving all of Nova Scotia, New Brunswick and PEI</p>
        </div>
      </div>
    </footer>
  );
}

/** Sticky call/book bar on phones: most taxi bookings start on mobile. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-paper/80 p-1.5 shadow-2xl backdrop-blur-xl sm:hidden">
      <a href={telHref} className="btn min-h-[44px] text-ink"><Icon name="phone" className="h-4 w-4" /> Call 24/7</a>
      <Link to="/book-now/" className="btn-primary min-h-[44px]">Book a ride</Link>
    </div>
  );
}
