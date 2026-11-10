// Post-build SEO guard. Run `npm run check` after `npm run build`; it exits non-zero on problems.
// Checks every pre-rendered page for: exactly one <title>, meta description, canonical and <h1>;
// title/description length; canonical = page URL; valid JSON-LD; internal links that resolve;
// all old WordPress URLs present (or 301-redirected if retired); image alt text; form field registry.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const SITE = 'https://48taxi.co';
const LEGACY = ['/', '/about/', '/affiliate/', '/book-now/', '/careers/', '/contact/', '/gti/', '/privacy-policy/', '/refund-policy/', '/return-policy-cancellation-policy/', '/schedule/', '/services-rates/', '/tour/'];
// Retired on purpose; must stay as 301 redirects so their links and rankings pass on.
const RETIRED = { '/parkfly/': '/halifax-airport-taxi/', '/truck-container-parking/': '/', '/slim-jim/': '/' };

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('index.html') && files.push(p); });
walk(dist);
const urlOf = (f) => `/${relative(dist, f).replace(/index\.html$/, '')}`.replace(/\/+/g, '/');
const urls = new Set(files.map(urlOf));

const errors = [];
const warn = [];
const count = (s, re) => (s.match(re) || []).length;
const titles = new Map();

for (const f of files) {
  const u = urlOf(f);
  const s = readFileSync(f, 'utf8');
  const head = s.slice(0, s.indexOf('</head>'));
  const e = (m) => errors.push(`${u}: ${m}`);
  if (count(head, /<title>/g) !== 1) e('needs exactly one <title>');
  if (count(head, /<meta name="description"/g) !== 1) e('needs exactly one meta description');
  if (count(head, /<link rel="canonical"/g) !== 1) e('needs exactly one canonical');
  if (count(head, /<meta name="robots"/g) !== 1) e('needs exactly one robots meta');
  if (count(s, /<h1[\s>]/g) !== 1) e(`needs exactly one <h1> (found ${count(s, /<h1[\s>]/g)})`);
  const title = (head.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const desc = (head.match(/<meta name="description" content="(.*?)"/) || [])[1] || '';
  const canon = (head.match(/<link rel="canonical" href="(.*?)"/) || [])[1];
  if (canon !== `${SITE}${u}`) e(`canonical ${canon} should be ${SITE}${u}`);
  const tlen = title.replace(/&amp;/g, '&').length;
  if (tlen > 65) warn.push(`${u}: title is ${tlen} chars`);
  const dlen = desc.replace(/&amp;/g, '&').length;
  if (dlen < 70 || dlen > 165) warn.push(`${u}: description is ${dlen} chars`);
  if (titles.has(title)) e(`duplicate title with ${titles.get(title)}`);
  titles.set(title, u);
  for (const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch { e('invalid JSON-LD'); }
  }
  for (const m of s.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) e(`img without alt: ${m[0].slice(0, 80)}`);
  for (const m of s.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = m[1];
    if (/\.(png|webp|avif|jpg|ico|xml|txt|webmanifest|js|css)$/.test(h) || h.startsWith('/assets/') || h.startsWith('/images/')) {
      if (!existsSync(join(dist, h))) e(`missing file ${h}`);
      continue;
    }
    if (!urls.has(h)) e(`broken internal link ${h}`);
  }
}
for (const l of LEGACY) if (!urls.has(l)) errors.push(`legacy URL missing: ${l}`);
const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');
for (const [from, to] of Object.entries(RETIRED)) {
  if (urls.has(from)) errors.push(`retired URL ${from} should not be built`);
  if (!new RegExp(`from = "${from}\\*"\\s+to = "${to}"\\s+status = 301`).test(toml)) errors.push(`netlify.toml needs a 301 from ${from}* to ${to}`);
}
for (const f of ['404.html', 'sitemap.xml', 'robots.txt', '__forms.html']) if (!existsSync(join(dist, f))) errors.push(`missing ${f}`);
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
for (const u of urls) if (!sitemap.includes(`<loc>${SITE}${u}</loc>`)) errors.push(`sitemap missing ${u}`);
if (!/noindex/.test(readFileSync(join(dist, '404.html'), 'utf8'))) errors.push('404.html should be noindex');

// Form fields used in components must be registered (Netlify drops unregistered fields).
const { FORMS } = await import(new URL('../src/lib/forms.js', import.meta.url).href);
const all = new Set(Object.values(FORMS).flat());
for (const comp of ['src/components/Forms.jsx', 'src/components/BookingForm.jsx']) {
  const src = readFileSync(join(root, comp), 'utf8');
  for (const m of src.matchAll(/name="([a-zA-Z]+)"/g)) if (!all.has(m[1]) && !(m[1] in FORMS)) errors.push(`${comp}: field "${m[1]}" not in FORMS registry`);
}

console.log(`Checked ${files.length} pages.`);
warn.forEach((w) => console.log(`  warn  ${w}`));
errors.forEach((x) => console.log(`  ERROR ${x}`));
if (errors.length) { console.log(`${errors.length} error(s).`); process.exit(1); }
console.log('All SEO checks passed.');
