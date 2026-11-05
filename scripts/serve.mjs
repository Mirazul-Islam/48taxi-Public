// Local preview server that behaves like Netlify for the things that matter in testing:
// pretty URLs (/path/ -> /path/index.html), gzip compression, long cache on /assets, 404.html.
// Usage: npm run preview   (then open http://localhost:4173)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const compressible = /\.(html|js|css|json|xml|txt|svg|webmanifest)$/;

async function resolve(url) {
  const p = normalize(decodeURIComponent(url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidates = p.endsWith('/') ? [join(root, p, 'index.html')] : [join(root, p), join(root, p, 'index.html')];
  for (const c of candidates) {
    try { if ((await stat(c)).isFile()) return { file: c, status: 200 }; } catch { /* next */ }
  }
  return { file: join(root, '404.html'), status: 404 };
}

createServer(async (req, res) => {
  if (req.method === 'POST') { res.writeHead(200).end('ok'); return; } // stand-in for Netlify Forms/Functions
  const { file, status } = await resolve(req.url);
  let body = await readFile(file);
  const ext = extname(file);
  const headers = { 'content-type': types[ext] || 'application/octet-stream' };
  if (req.url.startsWith('/assets/')) headers['cache-control'] = 'public, max-age=31536000, immutable';
  if (compressible.test(file) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    body = gzipSync(body);
    headers['content-encoding'] = 'gzip';
  }
  res.writeHead(status, headers).end(body);
}).listen(port, () => console.log(`Serving dist on http://localhost:${port}`));
