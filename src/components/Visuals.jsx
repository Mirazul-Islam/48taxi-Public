import images from '../data/images.json';

/* Cut-out product pictures (cars, luggage, seats) with transparent backgrounds.
   Falls back to a simple line drawing when a picture isn't available yet. */

const FALLBACK = {
  car: 'M3 15.5V13l2.2-4.4A2 2 0 0 1 7 7.5h9.3a2 2 0 0 1 1.6.8L21 12.5v3a1 1 0 0 1-1 1h-1.2M3 15.5a1 1 0 0 0 1 1h1.2m13.6 0a2 2 0 1 1-3.6 0m3.6 0a2 2 0 0 0-3.6 0m0 0H8.8m-3.6 0a2 2 0 1 0 3.6 0m-3.6 0a2 2 0 0 1 3.6 0M5.5 12.5h15',
  suitcase: 'M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6M7 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm1 14v1m8-1v1M9 10v6m6-6v6',
  garment: 'M12 3a1.5 1.5 0 0 1 1.5 1.5c0 .8-.6 1.2-1.5 1.8V7m0 0L5 10.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9.5L12 7Zm-3 7h6',
  seat: 'M8 4h5a2 2 0 0 1 2 2v6h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a3 3 0 0 1-3-3v-1a2 2 0 0 1 2-2h1V4Z',
};

function Fallback({ kind = 'car', className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`text-ink-3/70 ${className}`}>
      <path d={FALLBACK[kind] || FALLBACK.car} />
    </svg>
  );
}

/** A transparent cut-out, contained inside its box. */
export function Cutout({ name, alt = '', sizes = '200px', fallback = 'car', className = '', imgClass = '' }) {
  const m = images[name];
  if (!m) return <span className={`flex items-center justify-center ${className}`}><Fallback kind={fallback} className="h-1/2 max-h-16 w-1/2 max-w-16" /></span>;
  const set = (ext) => m.widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className={`flex items-center justify-center ${className}`}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`/images/${name}-${m.widths[0]}.webp`} alt={alt} width={m.w} height={m.h} loading="lazy" decoding="async" className={`max-h-full max-w-full object-contain ${imgClass}`} />
    </picture>
  );
}

// Luggage and seat pictures (key → image name, fallback drawing).
export const ITEM_IMAGES = {
  personal: ['item-personal', 'suitcase'],
  carryon: ['item-carryon', 'suitcase'],
  checkedMedium: ['item-checkedMedium', 'suitcase'],
  checkedLarge: ['item-checkedLarge', 'suitcase'],
  oversize: ['item-oversize', 'suitcase'],
  garment: ['item-garment', 'garment'],
  petDog: ['item-petDog', 'suitcase'],
  petCat: ['item-petCat', 'suitcase'],
  golf: ['item-golf', 'suitcase'],
  stroller: ['item-stroller', 'suitcase'],
  highback: ['item-highback', 'seat'],
  backless: ['item-backless', 'seat'],
  infant: ['item-infant', 'seat'],
};

/** Picture card with a − / + counter, for luggage and child seats. */
export function ItemCounter({ id, label, note, value = 0, onChange, max = 5 }) {
  const [img, fb] = ITEM_IMAGES[id] || [];
  const on = value > 0;
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-xl border transition-colors ${on ? 'border-brand-700 bg-brand-700/[0.08]' : 'border-line bg-black/20 hover:border-white/25'}`}>
      <div className="relative flex h-24 items-end justify-center px-3 pt-3 sm:h-28">
        <span aria-hidden="true" className="absolute inset-x-6 bottom-1.5 h-3 rounded-[50%] bg-black/50 blur-md" />
        <Cutout name={img} fallback={fb} sizes="120px" className="relative h-full w-full" imgClass={`drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)] transition-transform duration-500 ${on ? 'scale-105' : 'group-hover:scale-105'}`} />
        {on && <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-700 px-1.5 text-xs font-bold text-onaccent">{value}</span>}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
        <p className="text-[14px] font-medium leading-tight text-white">{label}</p>
        <p className={`mt-0.5 text-xs ${note && note !== 'Free' ? 'text-brand-700' : 'text-ink-3'}`}>{note}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <button type="button" className="h-8 w-8 rounded-full border border-white/15 text-lg leading-none transition-colors hover:border-white/40 disabled:opacity-30" onClick={() => onChange(Math.max(0, value - 1))} disabled={!value} aria-label={`Fewer: ${label}`}>−</button>
          <span className="w-5 text-center tabular-nums" aria-live="polite">{value}</span>
          <button type="button" className="h-8 w-8 rounded-full border border-white/15 text-lg leading-none transition-colors hover:border-brand-700 hover:text-brand-700 disabled:opacity-30" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More: ${label}`}>+</button>
        </div>
      </div>
    </div>
  );
}
