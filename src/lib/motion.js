// Tiny motion runtime: reveal-on-scroll, image wipes, count-up numbers, pointer spotlight,
// and Lenis smooth scrolling on desktop. Called after every route render.
const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let io;
let lenis;

function observer() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        // Wipes are observed through their parent: a fully clipped element never "intersects".
        const el = e.target.__wipe || e.target;
        el.classList.add('in');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  return io;
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

export function initMotion() {
  if (typeof window === 'undefined') return;
  clearTimeout(window.__rv);
  const o = observer();
  document.querySelectorAll('[data-reveal]:not(.in), [data-count]:not(.in)').forEach((el) => o.observe(el));
  document.querySelectorAll('[data-wipe]:not(.in)').forEach((el) => {
    const host = el.parentElement || el;
    host.__wipe = el;
    o.observe(host);
  });
  spotlight(document);
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
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -90 });
  else el.scrollIntoView();
}
