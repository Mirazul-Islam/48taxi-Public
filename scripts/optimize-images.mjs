// Converts the source photos in assets-src/ into responsive AVIF + WebP files in public/images/.
// Run with: npm run images   (output is committed, so Netlify builds don't need to re-run it)
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = new URL('../assets-src/', import.meta.url).pathname;
const OUT = new URL('../public/images/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// name: [source file, widths, optional crop aspect (w/h)]
const MAP = {
  'airport-meet-greet': ['838cea01-42ec-4e0b-90f7-b6a4c21b47f1.png', [640, 1024, 1536], 3 / 2],
  'airport-traveller': ['2149272095.jpg', [640, 1024, 1600], 3 / 2],
  'name-sign-yhz': ['ChatGPT-Image-Feb-7-2026-03_51_02-PM.png', [480, 800], 2 / 3],
  'nova-scotia-service-map': ['ChatGPT-Image-Mar-28-2026-06_51_23-PM.png', [640, 1024, 1536]],
  'private-jet-pickup': ['Avionco-blog-June-21-640x427-1.jpg', [640]],
  'yhz-baggage-claim': ['WhatsApp-Image-2026-02-01-at-7.41.18-PM.jpeg', [480, 960], 4 / 3],
  'yhz-information-desk': ['WhatsApp-Image-2026-02-01-at-7.48.19-PM.jpeg', [480, 960], 4 / 3],
  'yhz-pickup-point': ['WhatsApp-Image-2026-02-01-at-7.49.16-PM.jpeg', [480, 960], 4 / 3],
  'yhz-curbside-lane': ['WhatsApp-Image-2026-02-01-at-7.49.17-PM-1.jpeg', [480, 960], 4 / 3],
  'golf-cabot-cliffs': ['rolling-fairways-high.jpg', [480, 960], 3 / 2],
  'golf-highlands-links': ['Golf-Gallery-8.jpeg', [480, 960], 3 / 2],
  'golf-fox-harbr': ['Fox-Harbr-Resort-Nova-Scotia-FB.jpg', [480, 960], 3 / 2],
  'golf-digby-pines': ['digby-pines-summer.jpg', [480, 960], 3 / 2],
  'golf-brunello': ['brunello-golf.jpg', [480, 960], 3 / 2],
  'golf-northumberland': ['Revised-Crafted-by-the-sea-photo-1-e1746034937914.jpg', [480, 960], 3 / 2],
  'peggys-cove-lighthouse': ['peggy-cove-lighthouse-reflection-photo-by-shawn-m-kent.webp', [640, 1024, 1600], 3 / 2],
  'lunenburg-harbour': ['fisheries-museum-of-the-atlantic-1920x1080-67250dbe7172b.webp', [640, 1024, 1600], 3 / 2],
  'peggys-cove-thumb': ['peggyscove-190x190_c.jpg', [190]],
  'lunenburg-thumb': ['lunenburg-190x190_c.jpg', [190]],
  'chester-thumb': ['chester-190x190_c.jpg', [190]],
  'crystal-crescent-thumb': ['beach-190x190_c.jpg', [190]],
  'acadia-thumb': ['acadia-university-campus-image-190x190_c.jpg', [190]],
  'car-lockout': ['locked-keys-car-1.jpg', [640, 1024], 3 / 2],
  'chauffeur-door': ['pexels-pavel-danilyuk-8425047.jpg', [640, 1024, 1600], 3 / 2],
  'chauffeur-driving': ['pexels-vitaliy-photo-503045294-18679016.jpg', [640, 1024], 4 / 5],
  'driver-cockpit': ['pexels-matheus-amaral-74119761-33493503-scaled.jpg', [640, 1024], 3 / 2],
  'passenger-call': ['pexels-cottonbro-4606338-1.jpg', [640, 1024], 3 / 2],
  'courier-delivery': ['pexels-yankrukov-6818154-scaled.jpg', [640, 1024], 3 / 2],
  'boat-trip': ['pexels-zeynep-sude-emek-193601188-29359151-1.jpg', [640, 1024], 3 / 2],
};

const manifest = {};
for (const [name, [file, widths, aspect]] of Object.entries(MAP)) {
  const src = sharp(SRC + file).rotate();
  const meta = await src.metadata();
  let base = src;
  let w0 = meta.width, h0 = meta.height;
  if (aspect) {
    const cur = w0 / h0;
    if (Math.abs(cur - aspect) > 0.02) {
      const cw = cur > aspect ? Math.round(h0 * aspect) : w0;
      const ch = cur > aspect ? h0 : Math.round(w0 / aspect);
      base = sharp(await src.extract({ left: Math.round((w0 - cw) / 2), top: Math.round((h0 - ch) / 2), width: cw, height: ch }).toBuffer());
      w0 = cw; h0 = ch;
    }
  }
  const buf = await base.toBuffer();
  const ws = [...new Set(widths.map((w) => Math.min(w, w0)))];
  for (const w of ws) {
    const s = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await s.clone().avif({ quality: 52, effort: 4 }).toFile(`${OUT}${name}-${w}.avif`);
    await s.clone().webp({ quality: 72 }).toFile(`${OUT}${name}-${w}.webp`);
  }
  manifest[name] = { widths: ws, w: ws[ws.length - 1], h: Math.round((ws[ws.length - 1] * h0) / w0) };
  console.log(name, ws.join(','));
}

// logos & icons
const logo = SRC + 'cropped-image-removebg-preview-1.png';
await sharp(logo).resize({ width: 282 }).webp({ quality: 90 }).toFile(OUT + 'logo-48taxi-282.webp');
await sharp(logo).resize({ width: 282 }).png({ compressionLevel: 9 }).toFile(OUT + 'logo-48taxi-282.png');
await sharp(logo).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(OUT + 'logo-48taxi-600.png');
const icon = SRC + 'cropped-Artboard-1-scaled-2-270x270.png';
for (const s of [32, 180, 192, 512]) await sharp(icon).resize(s, s).png().toFile(`${OUT.replace('images/', '')}icon-${s}.png`);
// Social share image 1200x630: meet-and-greet photo with logo strip
const og = await sharp(SRC + MAP['airport-meet-greet'][0]).resize(1200, 630, { fit: 'cover' }).toBuffer();
const strip = Buffer.from('<svg width="1200" height="630"><rect y="510" width="1200" height="120" fill="#ffffff"/></svg>');
await sharp(og).composite([{ input: strip }, { input: await sharp(logo).resize({ height: 90 }).toBuffer(), left: 40, top: 525 }]).jpeg({ quality: 80 }).toFile(OUT + 'og-48taxi.jpg');

writeFileSync(new URL('../src/data/images.json', import.meta.url), JSON.stringify(manifest, null, 1));
console.log('done');
