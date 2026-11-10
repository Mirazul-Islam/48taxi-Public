import { useEffect, useRef, useState } from 'react';
import { Pic, BookButton, CallButton, WhatsAppButton } from './ui.jsx';
import sequence from '../data/door-sequence.json';

/* ==========================================================================
   Scroll-driven "chauffeur opens the door" scene.

   The section is several screens tall and its content is pinned (sticky), so
   scrolling scrubs a timeline instead of moving the page:

     1. the camera eases in on the chauffeur's hand on the handle
     2. the door swings open towards you in 3D and warm light spills out
     3. the camera flies into the open door and the booking call-to-action lands

   Two renderers share the same timeline and captions:
   - Frame sequence (Apple-style): if `src/data/door-sequence.json` lists frames
     (made from an AI video with `npm run frames -- clip.mp4`), they are painted
     on a <canvas>, one frame per scroll position.
   - Built-in 3D door: otherwise, the existing photo is cut along the door seam
     and the door panel is rotated in CSS 3D. No extra downloads.

   Reduced motion: no pinning, just the photo and the call to action.
   ========================================================================== */

const AR = 1279 / 854; // chauffeur-door photo
const FOCUS_X = 0.64; // keep the hand on the handle in view on narrow screens
// Door panel outline on the photo (percent of width / height), traced along the seam and window chrome.
const DOOR = 'polygon(67.4% 100%, 61.8% 91.3%, 54.7% 82%, 48.5% 73.8%, 43.2% 65%, 39.5% 56.2%, 37.4% 48%, 37.5% 44.3%, 41.3% 37.7%, 46.9% 30.7%, 54.7% 24.1%, 64.1% 18.7%, 74.3% 14.2%, 81.7% 11.7%, 80.5% 0%, 100% 0%, 100% 100%)';
const OPENING = { x: 0.6, y: 0.56 }; // where the camera flies in (centre of the door opening)

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t) => t * t * t;
const mix = (a, b, t) => a + (b - a) * t;

// Caption windows on the 0..1 timeline: [fade in start, fully in, start out, fully out]
const CAPS = [
  [-1, 0, 0.16, 0.24],
  [0.3, 0.38, 0.56, 0.64],
  [0.8, 0.9, 2, 2],
];
const capAmount = (p, [a, b, c, d]) => (p < b ? seg(p, a, b) : 1 - seg(p, c, d));

function coverBox(vw, vh, ar, fx) {
  const w = Math.max(vw, vh * ar);
  const h = w / ar;
  const left = clamp(vw / 2 - fx * w, vw - w, 0);
  return { w, h, left, top: (vh - h) / 2 };
}

export default function DoorScene() {
  const root = useRef(null);
  const els = useRef({});
  const [mode, setMode] = useState('scene'); // 'scene' | 'still'
  const frames = sequence.frames > 0;
  const $ = (k) => (el) => { els.current[k] = el; };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setMode('still'); return undefined; }
    const e = els.current;
    const sec = root.current;
    let vw = 0;
    let vh = 0;
    let box = null;
    let running = false;
    let raf = 0;
    let last = -1;

    /* ---------- optional frame sequence ---------- */
    const imgs = [];
    let ctx = null;
    let drawn = -1;
    const loadFrames = () => {
      if (!frames || imgs.length) return;
      const set = vw < 768 && sequence.mobile ? sequence.mobile : sequence.desktop;
      const pad = (n) => String(n).padStart(3, '0');
      // Load every 8th frame first so the whole scrub is roughly covered quickly, then fill in.
      const order = [];
      for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
        for (let i = 0; i < sequence.frames; i += step) if (!order.includes(i)) order.push(i);
        if (step === 1) break;
      }
      order.forEach((i) => {
        const im = new Image();
        im.decoding = 'async';
        im.src = `${set.dir}${pad(i + 1)}.${sequence.ext}`;
        im.onload = () => { drawn = -1; last = -1; };
        imgs[i] = im;
      });
    };
    const nearestLoaded = (i) => {
      for (let d = 0; d < sequence.frames; d++) {
        if (imgs[i - d]?.complete && imgs[i - d].naturalWidth) return imgs[i - d];
        if (imgs[i + d]?.complete && imgs[i + d].naturalWidth) return imgs[i + d];
      }
      return null;
    };
    const paint = (i) => {
      if (!ctx || i === drawn) return;
      const im = nearestLoaded(i);
      if (!im) return;
      const c = e.canvas;
      const b = coverBox(c.width, c.height, im.naturalWidth / im.naturalHeight, sequence.focusX ?? 0.5);
      ctx.drawImage(im, b.left, b.top, b.w, b.h);
      if (im === imgs[i]) drawn = i;
    };

    const layout = () => {
      vw = window.innerWidth;
      vh = e.sticky.clientHeight || window.innerHeight;
      box = coverBox(vw, vh, AR, FOCUS_X);
      if (e.stage) Object.assign(e.stage.style, { width: `${box.w}px`, height: `${box.h}px`, left: `${box.left}px`, top: `${box.top}px` });
      if (frames && e.canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        e.canvas.width = Math.round(vw * dpr);
        e.canvas.height = Math.round(vh * dpr);
        ctx = e.canvas.getContext('2d');
        drawn = -1;
      }
      last = -1;
    };

    const render = (p) => {
      /* camera: slow push on the handle, then a fast dolly through the open door */
      const push = ease(seg(p, 0, 0.42));
      const fly = easeIn(seg(p, 0.62, 0.95));
      const scale = mix(1, 1.14, push) * mix(1, 4.2, fly);
      if (e.cam && box) {
        const ox = box.left + box.w * mix(FOCUS_X, OPENING.x, seg(p, 0.3, 0.7));
        const oy = box.top + box.h * mix(0.52, OPENING.y, seg(p, 0.3, 0.7));
        e.cam.style.transformOrigin = `${ox}px ${oy}px`;
        e.cam.style.transform = `scale(${scale.toFixed(4)})`;
      }

      if (frames) {
        paint(Math.round(seg(p, 0, 0.82) * (sequence.frames - 1)));
      } else {
        /* door swings towards the viewer on its front hinge */
        const open = ease(seg(p, 0.26, 0.7));
        if (e.door) {
          e.door.style.transform = `rotateY(${(open * 58).toFixed(2)}deg)`;
          e.shade.style.opacity = (open * 0.75).toFixed(3);
        }
        if (e.inside) e.inside.style.opacity = Math.min(1, open * 3).toFixed(3);
        if (e.spill) e.spill.style.opacity = (open * 0.85).toFixed(3);
      }

      /* light floods the frame as we pass through the door */
      if (e.flood) e.flood.style.opacity = seg(p, 0.7, 0.92).toFixed(3);
      /* top fade continues the hero above; vignette lifts as the scene starts */
      if (e.veil) e.veil.style.opacity = (1 - seg(p, 0, 0.1)).toFixed(3);

      CAPS.forEach((w, i) => {
        const c = e[`cap${i}`];
        if (!c) return;
        const a = capAmount(p, w);
        c.style.opacity = a.toFixed(3);
        c.style.transform = `translate3d(0, ${((1 - a) * (p < w[1] ? 30 : -30)).toFixed(1)}px, 0)`;
        c.style.visibility = a < 0.01 ? 'hidden' : 'visible';
      });
      if (e.bar) e.bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (e.hint) e.hint.style.opacity = (1 - seg(p, 0.02, 0.1)).toFixed(3);
    };

    const progress = () => {
      const r = sec.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - vh));
    };
    const tick = () => {
      const p = progress();
      if (Math.abs(p - last) > 0.0004) { render(p); last = p; }
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    layout();
    render(progress());
    sec.classList.add('door-live');
    // Only animate (and only download frames) while the scene is on or near the screen.
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { loadFrames(); start(); } else stop();
    }, { rootMargin: '50% 0px 50% 0px' });
    io.observe(sec);
    const onResize = () => { layout(); render(progress()); };
    window.addEventListener('resize', onResize);
    return () => { io.disconnect(); stop(); window.removeEventListener('resize', onResize); };
  }, [frames]);

  if (mode === 'still') {
    return (
      <section className="relative isolate overflow-hidden py-28" aria-labelledby="door-title">
        <div className="absolute inset-0 -z-10">
          <Pic name="chauffeur-door" alt="" sizes="100vw" className="block h-full w-full" imgClass="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-paper/75" />
        </div>
        <div className="wrap">
          <Final />
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="door-scene relative h-[420vh]" aria-labelledby="door-title">
      <div ref={$('sticky')} className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {/* camera */}
        <div ref={$('cam')} className="absolute inset-0 will-change-transform">
          {frames ? (
            <canvas ref={$('canvas')} className="absolute inset-0 h-full w-full" aria-hidden="true" />
          ) : (
            <div ref={$('stage')} className="door-stage absolute" aria-hidden="true">
              <Pic name="chauffeur-door" alt="" sizes="100vw" className="absolute inset-0 block h-full w-full" imgClass="h-full w-full object-cover" />
              {/* what you see through the opening: warm cabin light */}
              <div ref={$('inside')} className="door-inside absolute inset-0 overflow-hidden opacity-0" style={{ clipPath: DOOR }}>
                <Pic name="driver-cockpit" alt="" sizes="60vw" className="absolute inset-y-0 left-[30%] right-0 block" imgClass="door-cabin h-full w-full object-cover" />
                <div className="door-glow absolute inset-0" />
              </div>
              {/* the door panel itself, hinged on its front (right) edge */}
              <div className="door-pivot absolute inset-0">
                <div ref={$('door')} className="door-panel absolute inset-0" style={{ clipPath: DOOR }}>
                  <Pic name="chauffeur-door" alt="" sizes="100vw" className="absolute inset-0 block h-full w-full" imgClass="h-full w-full object-cover" />
                  <div ref={$('shade')} className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10 opacity-0" />
                </div>
              </div>
              <div ref={$('spill')} className="door-spill pointer-events-none absolute inset-0 opacity-0" />
            </div>
          )}
          <div ref={$('flood')} className="door-flood pointer-events-none absolute inset-0 opacity-0" />
        </div>

        {/* readability gradients (not scaled with the camera) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
        <div ref={$('veil')} className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper via-paper/60 to-paper/10" />

        {/* captions */}
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 top-0">
          <div ref={$('cap0')} className="door-cap absolute bottom-[18%] left-5 right-5 max-w-xl sm:left-8">
            <p className="eyebrow">The 48 arrival</p>
            <p className="display mt-4 text-[2.6rem] text-white sm:text-6xl">Your chauffeur is <em>already waiting.</em></p>
          </div>
          <div ref={$('cap1')} className="door-cap absolute bottom-[18%] left-5 right-5 max-w-xl sm:left-8">
            <p className="eyebrow">Door held · bags loaded</p>
            <p className="display mt-4 text-[2.6rem] text-white sm:text-6xl">On time, <em>every time.</em> Even at 5 a.m.</p>
          </div>
          <div ref={$('cap2')} className="door-cap door-final pointer-events-auto absolute inset-x-5 top-[44%] -translate-y-1/2 sm:top-1/2 sm:inset-x-8">
            <Final />
          </div>
        </div>

        {/* progress + scroll hint */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10"><div ref={$('bar')} className="h-full origin-left scale-x-0 bg-brand-700" /></div>
        <p ref={$('hint')} className="door-hint pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-2">Scroll</p>
      </div>
    </section>
  );
}

function Final() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow justify-center">Your ride is ready</p>
      <h2 id="door-title" className="display mt-5 text-[3rem] text-white sm:text-7xl lg:text-[6rem]">Step in. <em>We’ll take it from here.</em></h2>
      <p className="lede mx-auto mt-6 max-w-lg text-ink">Upfront prices, flight tracking and a driver who knows Halifax. Book in a minute, any hour.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <BookButton>Book your ride</BookButton>
        <CallButton />
        <WhatsAppButton />
      </div>
    </div>
  );
}

