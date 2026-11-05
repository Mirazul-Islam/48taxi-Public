import { Link, NavLink, useLocation } from 'react-router-dom';
import { business, telHref, fullAddress } from '../data/site.js';
import { Icon } from './ui.jsx';

const nav = [
  { to: '/halifax-airport-taxi/', label: 'Airport Taxi' },
  { to: '/schedule/', label: 'Prices' },
  { to: '/parkfly/', label: 'Park & Fly' },
  { to: '/tour/', label: 'Tours' },
  {
    label: 'Services',
    children: [
      { to: '/halifax-limo-service/', label: 'Limo service' },
      { to: '/airport-shuttle-halifax/', label: 'Airport shuttle & group fares' },
      { to: '/corporate-hotel-transportation/', label: 'Corporate & hotels' },
      { to: '/services-rates/', label: 'Airport rates by area' },
      { to: '/truck-container-parking/', label: 'Truck & container parking' },
      { to: '/slim-jim/', label: 'Car lockout & battery boost' },
      { to: '/service-areas/', label: 'Service areas' },
    ],
  },
  { to: '/contact/', label: 'Contact' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="48Taxi & Limo home">
      <picture>
        <source type="image/webp" srcSet="/images/logo-48taxi-282.webp" />
        <img src="/images/logo-48taxi-282.png" alt="48Taxi & Limo" width="141" height="50" className="h-10 w-auto sm:h-11" />
      </picture>
    </Link>
  );
}

const linkCls = ({ isActive }) =>
  `rounded-md px-3 py-2 text-[15px] font-medium no-underline ${isActive ? 'text-brand-700' : 'text-ink hover:text-brand-700'}`;

export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">Skip to content</a>
      <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center lg:flex">
          {nav.map((n) =>
            n.children ? (
              <div key={n.label} className="group relative">
                <button type="button" className="flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-ink hover:text-brand-700" aria-haspopup="true">
                  {n.label} <span aria-hidden="true" className="text-xs">▾</span>
                </button>
                <div className="invisible absolute left-0 top-full w-72 translate-y-1 rounded-xl border border-line bg-card p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {n.children.map((c) => (
                    <NavLink key={c.to} to={c.to} className="block rounded-lg px-3 py-2 text-[15px] text-ink no-underline hover:bg-band hover:text-brand-700">{c.label}</NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={n.to} to={n.to} className={linkCls}>{n.label}</NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <a href={telHref} className="hidden items-center gap-2 px-2 text-[15px] font-semibold text-ink no-underline hover:text-brand-700 md:flex">
            <Icon name="phone" className="h-4 w-4" /> {business.phone.display}
          </a>
          <Link to="/book-now/" className="btn-primary hidden min-h-[40px] px-4 sm:inline-flex">Book a ride</Link>
          {/* Mobile menu: <details> works before JavaScript loads. `key` closes it on navigation. */}
          <details key={pathname} className="relative lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-line [&::-webkit-details-marker]:hidden" aria-label="Open menu">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </summary>
            <div className="fixed inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-card px-4 pb-6 pt-2 shadow-lg">
              <nav aria-label="Mobile">
                {nav.flatMap((n) => (n.children ? n.children : [n])).map((n) => (
                  <Link key={n.to} to={n.to} className="block border-b border-line py-3 text-[16px] font-medium text-ink no-underline">{n.label}</Link>
                ))}
                <Link to="/about/" className="block border-b border-line py-3 text-[16px] font-medium text-ink no-underline">About</Link>
              </nav>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link to="/book-now/" className="btn-primary">Book a ride</Link>
                <a href={telHref} className="btn-ghost"><Icon name="phone" className="h-4 w-4" /> Call</a>
              </div>
            </div>
          </details>
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
      ['/schedule/', 'Prices & fare estimator'], ['/services-rates/', 'Airport rates by area'], ['/gti/', 'YHZ pickup instructions'], ['/parkfly/', 'Park & Fly'],
      ['/truck-container-parking/', 'Truck & container parking'], ['/slim-jim/', 'Car lockout & battery boost'], ['/faq/', 'FAQ'],
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
    <footer className="bg-night text-gray-300">
      <div className="wrap grid gap-10 py-14 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <p className="text-lg font-bold text-white">{business.name}</p>
          <p className="mt-2 text-sm">Locally owned taxi, limo and airport transfer service in Halifax, Nova Scotia.</p>
          <address className="mt-5 space-y-2 text-sm not-italic">
            <a href={telHref} className="flex items-center gap-2 font-semibold text-white no-underline hover:text-white"><Icon name="phone" className="h-4 w-4" />{business.phone.display}</a>
            <a href={`tel:${business.phone2.tel}`} className="block pl-6 text-gray-300 no-underline hover:text-white">{business.phone2.display}</a>
            <a href={`tel:${business.tollFree.tel}`} className="block pl-6 text-gray-300 no-underline hover:text-white">Toll free {business.tollFree.display}</a>
            <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-gray-300 no-underline hover:text-white"><Icon name="mail" className="h-4 w-4" />{business.email}</a>
            <span className="flex items-start gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 flex-none" />{fullAddress}</span>
            <span className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4" />{business.hours}</span>
          </address>
          <ul className="mt-5 flex gap-4 text-sm">
            <li><a href={business.social.facebook} rel="noopener" target="_blank" className="text-gray-300 hover:text-white">Facebook</a></li>
            <li><a href={business.social.instagram} rel="noopener" target="_blank" className="text-gray-300 hover:text-white">Instagram</a></li>
            <li><a href={business.social.tiktok} rel="noopener" target="_blank" className="text-gray-300 hover:text-white">TikTok</a></li>
          </ul>
        </div>
        {footerCols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-gray-300 no-underline hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-gray-400 sm:flex-row sm:justify-between">
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
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-line bg-card p-2 sm:hidden">
      <a href={telHref} className="btn-ghost min-h-[46px]"><Icon name="phone" className="h-4 w-4" /> Call 24/7</a>
      <Link to="/book-now/" className="btn-primary min-h-[46px]">Book a ride</Link>
    </div>
  );
}
