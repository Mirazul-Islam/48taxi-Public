// Pre-renders every route to static HTML so search engines (and visitors on slow phones) get
// complete pages without waiting for JavaScript. Also writes 404.html, sitemap.xml, robots.txt
// and the hidden Netlify Forms file.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, '.ssr');

const { render, routes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const { pages } = await import(pathToFileURL(join(root, 'src/meta.js')).href);
const { formsHtml } = await import(pathToFileURL(join(root, 'src/lib/forms.js')).href);
const { SITE_URL } = await import(pathToFileURL(join(root, 'src/data/site.js')).href);

const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--head-->') || !template.includes('<!--app-->')) throw new Error('index.html is missing placeholders');

// Vite manifest: maps each page source file to its built chunk (+ the chunks it imports).
const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'));
const preloadsFor = (src) => {
  const seen = new Set();
  const walk = (key) => {
    const m = manifest[key];
    if (!m || seen.has(m.file)) return;
    seen.add(m.file);
    (m.imports || []).forEach(walk);
  };
  walk(src);
  return [...seen].map((f) => `<link rel="modulepreload" href="/${f}" />`).join('\n    ');
};

const page = async (url, src) => {
  const { html, head } = await render(url);
  const preload = src ? preloadsFor(src) : '';
  return template.replace('<!--head-->', `${head}\n    ${preload}`).replace('<!--app-->', html);
};

let count = 0;
for (const { path, src } of routes) {
  const out = join(dist, path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await page(path, src));
  count++;
}
writeFileSync(join(dist, '404.html'), await page('/404'));
rmSync(join(dist, '.vite'), { recursive: true, force: true });

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /__forms.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
writeFileSync(join(dist, '__forms.html'), formsHtml());

if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${count} pages + 404, sitemap.xml, robots.txt, __forms.html`);
