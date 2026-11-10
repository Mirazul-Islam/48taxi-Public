// Tiny motion runtime: reveal-on-scroll, image wipes, count-up numbers, pointer spotlight,
// and Lenis smooth scrolling on desktop.
//
// It watches the DOM itself (MutationObserver), so any element with data-reveal / data-wipe /
// data-count is picked up automatically: on first load, after client-side navigation, when a
// lazy page chunk arrives, or when React re-renders a section. No page has to remember to call it.
const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEL = '[data-reveal], [data-wipe], [data-count]';

let io;
let mo;
let lenis;
let queued = false;

function reveal(el) {
  el.__shown = true;
  el.classList.add('in');
  if (el.hasAttribute('data-count') && !el.__counted) { el.__counted = true; countUp(el); }
}

function observer() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        // Wipes are observed through their parent: a fully clipped element never "intersects".
        reveal(e.target.__wipe || e.target);
        io.unobserve(e.target);
      }
    },
    // threshold 0 so even very tall blocks reveal as soon as their top edge enters the view
    { rootMargin: '0px 0px -6% 0px', threshold: 0 },
  );
  return io;
}

function register(el) {
  if (el.__registered) return;
  el.__registered = true;
  if (el.hasAttribute('data-wipe')) {
    const host = el.parentElement || el;
    host.__wipe = el;
    observer().observe(host);
  } else {
    observer().observe(el);
  }
}

function scan() {
  queued = false;
  document.querySelectorAll(SEL).forEach((el) => {
    if (el.__shown && !el.classList.contains('in')) el.classList.add('in'); // React replaced className
    else register(el);
  });
  spotlight(document);
}

function queueScan() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(scan);
}

function countUp(el) {
  const to = parseFloat(el.getAttribute('data-count'));
  const dec = (el.getAttribute('data-count').split('.')[1] || '').length;
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  if (reduce()) { el.textContent = `${prefix}${to.toFixed(dec)}${suffix}`; return; }
  const dur = 1600;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = `${prefix}${(to * eased).toFixed(dec)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function spotlight(root) {
  root.querySelectorAll('.spotlight:not([data-sp])').forEach((el) => {
    el.setAttribute('data-sp', '');
    el.addEventListener('pointermove', (ev) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      el.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  });
}

/** Start once; safe to call again (e.g. after each route render). */
export function initMotion() {
  if (typeof window === 'undefined') return;
  clearTimeout(window.__rv);
  if (!mo) {
    mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'childList' && r.addedNodes.length) { queueScan(); return; }
        if (r.type === 'attributes' && r.target.__shown && !r.target.classList.contains('in')) r.target.classList.add('in');
      }
    });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  scan();
}

export async function initSmoothScroll() {
  if (typeof window === 'undefined' || lenis || reduce()) return;
  if (!window.matchMedia('(pointer: fine)').matches) return; // native scrolling on touch devices
  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -90 });
  else el.scrollIntoView();
}
