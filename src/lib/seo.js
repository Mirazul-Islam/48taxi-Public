import { metaFor, pages } from '../meta.js';
import { business, SITE_URL } from '../data/site.js';
import { faqs, areaFaqs } from '../data/faqs.js';
import { areaPages } from '../data/areas.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const OG_IMAGE = `${SITE_URL}/images/og-48taxi.jpg`;

export function faqsFor(path) {
  if (faqs[path]) return faqs[path];
  const area = areaPages[path];
  return area ? areaFaqs(area.name, area.faqFare) : null;
}

function breadcrumbTrail(path) {
  if (path === '/') return [];
  const trail = [{ name: 'Home', path: '/' }];
  const parts = path.split('/').filter(Boolean);
  let acc = '/';
  for (const part of parts) {
    acc += `${part}/`;
    const m = pages.find((p) => p.path === acc);
    if (m) trail.push({ name: m.name, path: m.path });
  }
  return trail;
}
export { breadcrumbTrail };

const businessNode = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: business.name,
  alternateName: business.legalName,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/logo-48taxi-600.png`,
  image: OG_IMAGE,
  telephone: business.phone.tel,
  email: business.email,
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: 'Cash, Credit Card, Debit Card',
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  }],
  areaServed: business.areaServed.map((name) => ({ '@type': 'Place', name })),
  sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok, business.social.yelp, business.social.tripadvisor],
};

const websiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: business.name,
  inLanguage: 'en-CA',
  publisher: { '@id': `${SITE_URL}/#business` },
};

export function jsonLd(path) {
  const m = metaFor(path);
  const url = `${SITE_URL}${m.path}`;
  const graph = [businessNode, websiteNode, {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: m.title,
    description: m.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en-CA',
  }];
  const trail = breadcrumbTrail(m.path);
  if (trail.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE_URL}${t.path}` })),
    });
  }
  const kinds = m.schema || [];
  if (kinds.includes('service')) {
    graph.push({
      '@type': 'TaxiService',
      '@id': `${url}#service`,
      name: m.name === 'Home' ? 'Taxi and airport transfers in Halifax' : m.name,
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: m.area ? { '@type': 'City', name: m.area } : business.areaServed.slice(0, 8).map((name) => ({ '@type': 'City', name })),
      url,
    });
  }
  if (kinds.includes('lockout')) {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      serviceType: 'Vehicle lockout and battery boost',
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: { '@type': 'Place', name: 'Halifax Regional Municipality' },
      offers: [
        { '@type': 'Offer', name: 'Vehicle unlocking', price: '85', priceCurrency: 'CAD' },
        { '@type': 'Offer', name: 'Battery boost', price: '48', priceCurrency: 'CAD' },
      ],
    });
  }
  const f = kinds.includes('faq') ? faqsFor(m.path) : null;
  if (f) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: f.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// Returns the <head> markup for a pre-rendered page. Exactly one of each tag.
export function buildHead(path) {
  const m = metaFor(path);
  const url = `${SITE_URL}${m.path}`;
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    m.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    m.noindex ? '' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(business.name)}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${JSON.stringify(jsonLd(path)).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}
