// Turns a short video (e.g. made with Sora, Higgsfield, Kling, Runway or Veo) into the frame
// sequence the homepage "door" scene scrubs through as you scroll, Apple-style.
//
//   npm run frames -- path/to/chauffeur-door.mp4            (120 frames, the default)
//   npm run frames -- path/to/clip.mp4 --frames 150 --focus 0.6
//   npm run frames -- --clear                               (back to the built-in 3D door)
//
// Needs ffmpeg on your machine (https://ffmpeg.org). Writes WebP frames to
// public/sequence/door/{desktop,mobile}/ and their count to src/data/door-sequence.json.
// Commit both; Netlify only serves them, it never re-runs this.
//
// --focus (0..1) is the horizontal point to keep in view when a wide clip is cropped for a
// phone screen. 0.5 = centre. Point it at the door handle.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const OUT = join(root, 'public/sequence/door');
const JSON_OUT = join(root, 'src/data/door-sequence.json');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };

if (args.includes('--clear')) {
  rmSync(OUT, { recursive: true, force: true });
  writeFileSync(JSON_OUT, `${JSON.stringify({ frames: 0 }, null, 2)}\n`);
  console.log('Cleared the frame sequence; the homepage uses the built-in 3D door again.');
  process.exit(0);
}

const input = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!input) {
  console.error('Usage: npm run frames -- path/to/video.mp4 [--frames 120] [--focus 0.5]');
  process.exit(1);
}
const COUNT = Math.max(24, Math.min(240, parseInt(opt('frames', '120'), 10)));
const FOCUS = Math.max(0, Math.min(1, parseFloat(opt('focus', '0.5'))));
const SIZES = { desktop: { w: 1600, q: 68 }, mobile: { w: 900, q: 62 } };

const run = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
try { run('ffmpeg', ['-version']); } catch {
  console.error('ffmpeg was not found. Install it first (macOS: brew install ffmpeg, Windows: winget install ffmpeg).');
  process.exit(1);
}
const duration = parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', input]));
if (!duration) { console.error(`Could not read ${input}`); process.exit(1); }

// 1. Pull COUNT evenly spaced frames out as lossless PNGs.
const tmp = mkdtempSync(join(tmpdir(), 'door-frames-'));
run('ffmpeg', ['-v', 'error', '-i', input, '-vf', `fps=${COUNT / duration},scale=${SIZES.desktop.w}:-2:flags=lanczos`, '-frames:v', String(COUNT), join(tmp, '%03d.png')]);
const pngs = readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();

// 2. Encode desktop + mobile WebP sets.
rmSync(OUT, { recursive: true, force: true });
let bytes = 0;
let meta = null;
for (const [set, { w, q }] of Object.entries(SIZES)) {
  mkdirSync(join(OUT, set), { recursive: true });
  for (const [i, f] of pngs.entries()) {
    const info = await sharp(join(tmp, f)).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 5 })
      .toFile(join(OUT, set, `${String(i + 1).padStart(3, '0')}.webp`));
    bytes += set === 'desktop' ? info.size : 0;
    if (!meta) meta = { width: info.width, height: info.height };
  }
}
rmSync(tmp, { recursive: true, force: true });

writeFileSync(JSON_OUT, `${JSON.stringify({
  frames: pngs.length,
  ext: 'webp',
  width: meta.width,
  height: meta.height,
  focusX: FOCUS,
  desktop: { dir: '/sequence/door/desktop/' },
  mobile: { dir: '/sequence/door/mobile/' },
}, null, 2)}\n`);

console.log(`Wrote ${pngs.length} frames (${(bytes / 1024 / 1024).toFixed(1)} MB for desktop) to public/sequence/door/.`);
console.log('Run `npm run dev` and scroll the homepage to check it, then commit public/sequence/ and src/data/door-sequence.json.');
