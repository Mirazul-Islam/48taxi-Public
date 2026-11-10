// Adds a transparent cut-out picture (car, luggage or seat) to the site.
//   node scripts/add-cutout.mjs path/to/picture.png car-camry
// Trims the empty border, writes WebP + AVIF at two widths to public/images/ and registers
// the size in src/data/images.json. Cars use 360/720 px, luggage and seats 160/320 px.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const [input, name] = process.argv.slice(2);
if (!input || !name) { console.error('Usage: node scripts/add-cutout.mjs <picture.png> <name>'); process.exit(1); }
const ws = name.startsWith('car-') ? '360,720' : '160,320';
const src = await sharp(input).ensureAlpha().trim({ threshold: 2 }).png().toBuffer();
const OUT = new URL('../public/images/', import.meta.url).pathname;
const meta = await sharp(src).metadata();
const widths = ws.split(',').map(Number).filter((w) => w < meta.width);
widths.push(Math.min(meta.width, Math.max(...ws.split(',').map(Number))));
widths.splice(0, widths.length, ...[...new Set(widths)].sort((a, b) => a - b));
for (const w of widths) {
  const img = sharp(src).resize({ width: w });
  await img.clone().webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(`${OUT}${name}-${w}.webp`);
  await img.clone().avif({ quality: 60, effort: 5 }).toFile(`${OUT}${name}-${w}.avif`);
}
const top = widths[widths.length - 1];
const h = Math.round((meta.height * top) / meta.width);
const p = new URL('../src/data/images.json', import.meta.url).pathname;
const j = JSON.parse(readFileSync(p, 'utf8'));
j[name] = { widths, w: top, h };
writeFileSync(p, JSON.stringify(j, null, 1));
console.log(`Added ${name}: ${widths.join(', ')} px wide.`);
