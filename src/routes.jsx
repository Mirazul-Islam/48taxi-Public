import { lazy } from 'react';
import { pages } from './meta.js';

// Each page group is its own JavaScript chunk, so a visitor only downloads the code for the
// page they're on. Pre-rendered HTML is shown immediately; the chunk hydrates it when loaded.
// `src` lets the prerender step add <link rel="modulepreload"> for the right chunk.
const mods = {
  home: { src: 'src/pages/Home.jsx', load: () => import('./pages/Home.jsx') },
  airport: { src: 'src/pages/Airport.jsx', load: () => import('./pages/Airport.jsx') },
  services: { src: 'src/pages/Services.jsx', load: () => import('./pages/Services.jsx') },
  tours: { src: 'src/pages/Tours.jsx', load: () => import('./pages/Tours.jsx') },
  areas: { src: 'src/pages/Areas.jsx', load: () => import('./pages/Areas.jsx') },
  info: { src: 'src/pages/Info.jsx', load: () => import('./pages/Info.jsx') },
};

const table = {
  '/': ['home', 'default'],
  '/about/': ['info', 'About'],
  '/book-now/': ['info', 'BookNow'],
  '/careers/': ['info', 'Careers'],
  '/contact/': ['info', 'Contact'],
  '/affiliate/': ['info', 'Affiliate'],
  '/gti/': ['airport', 'Gti'],
  '/schedule/': ['airport', 'Prices'],
  '/services-rates/': ['airport', 'ServicesRates'],
  '/tour/': ['tours', 'Tours'],
  '/privacy-policy/': ['info', 'PrivacyPolicy'],
  '/refund-policy/': ['info', 'RefundPolicy'],
  '/return-policy-cancellation-policy/': ['info', 'CancellationPolicy'],
  '/halifax-airport-taxi/': ['airport', 'AirportTaxi'],
  '/halifax-limo-service/': ['services', 'Limo'],
  '/airport-shuttle-halifax/': ['airport', 'AirportShuttle'],
  '/service-areas/': ['areas', 'AreasHub'],
  '/service-areas/dartmouth/': ['areas', 'AreaPage'],
  '/service-areas/bedford/': ['areas', 'AreaPage'],
  '/service-areas/truro/': ['areas', 'AreaPage'],
  '/service-areas/wolfville/': ['areas', 'AreaPage'],
  '/tour/peggys-cove/': ['tours', 'PeggysCove'],
  '/corporate-hotel-transportation/': ['services', 'Corporate'],
  '/faq/': ['info', 'FaqPage'],
};

// Fail the build loudly if a page in meta.js has no component (or vice versa).
for (const p of pages) if (!table[p.path]) throw new Error(`No component for ${p.path}`);
for (const k of Object.keys(table)) if (!pages.find((p) => p.path === k)) throw new Error(`No meta for ${k}`);

const lazyCache = {};
const lazyExport = (mod, name) => {
  const key = `${mod}:${name}`;
  lazyCache[key] ||= lazy(() => mods[mod].load().then((m) => ({ default: m[name] })));
  return lazyCache[key];
};

export const routes = pages.map((p) => {
  const [mod, name] = table[p.path];
  return { path: p.path, Component: lazyExport(mod, name), src: mods[mod].src, load: mods[mod].load };
});

export const routeFor = (pathname) => routes.find((r) => r.path === (pathname.endsWith('/') ? pathname : `${pathname}/`));
