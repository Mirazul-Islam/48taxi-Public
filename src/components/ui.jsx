import { Link } from 'react-router-dom';
import images from '../data/images.json';
import { business, telHref, whatsappHref } from '../data/site.js';
import { reviews } from '../data/content.js';
import { breadcrumbTrail } from '../lib/seo.js';

/** Responsive image: AVIF + WebP, explicit size (no layout shift), lazy unless `priority`. */
export function Pic({ name, alt, sizes = '100vw', priority = false, className = '', imgClass = '' }) {
  const m = images[name];
  if (!m) return null;
  const set = (ext) => m.widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/images/${name}-${m.widths[0]}.webp`}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={imgClass}
      />
    </picture>
  );
}

export function Icon({ name, className = 'h-5 w-5' }) {
  const p = {
    phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a1.125 1.125 0 0 1-1.21.38 12.035 12.035 0 0 1-7.143-7.143 1.125 1.125 0 0 1 .38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z',
    check: 'm4.5 12.75 6 6 9-13.5',
    plane: 'M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5',
    clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
    pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
    mail: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
    star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
    arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
    arrowUpRight: 'm4.5 19.5 15-15m0 0H8.25m11.25 0v11.25',
    car: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    user: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
    bag: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    sparkle: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z',
  }[name];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'star' ? 0 : 1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={p} fill={name === 'star' ? 'currentColor' : 'none'} />
    </svg>
  );
}

export const Arrow = ({ className = 'arr h-4 w-4' }) => <Icon name="arrow" className={className} />;

/** WhatsApp glyph (filled), drawn to sit with the outline icons. */
export function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2C6.55 2 2.09 6.45 2.09 11.94c0 1.75.46 3.46 1.33 4.97L2 22l5.22-1.37a9.9 9.9 0 0 0 4.82 1.23h.01c5.49 0 9.95-4.46 9.95-9.95A9.9 9.9 0 0 0 12.04 2Zm0 18.18h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

export function WhatsAppButton({ className = 'btn-ghost', label = 'WhatsApp', text }) {
  return (
    <a href={whatsappHref(text)} target="_blank" rel="noopener" className={className} aria-label={`${label}: chat with us on WhatsApp at ${business.phone.display}`}>
      <WhatsAppIcon className="h-[18px] w-[18px] text-[#25D366]" />
      {label}
    </a>
  );
}

export function CallButton({ className = 'btn-ghost', label }) {
  return (
    <a href={telHref} className={className}>
      <Icon name="phone" className="h-4 w-4" />
      {label || business.phone.display}
    </a>
  );
}

export function BookButton({ to = '/book-now/', className = 'btn-primary', children = 'Book a ride' }) {
  return <Link to={to} className={className}>{children}<Arrow /></Link>;
}

export function Breadcrumbs({ path }) {
  const trail = breadcrumbTrail(path);
  if (trail.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-ink-3">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-brand-700">/</span>}
            {i < trail.length - 1 ? <Link to={t.path} className="text-ink-3 no-underline hover:text-ink">{t.name}</Link> : <span aria-current="page" className="text-ink-2">{t.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Title whose lines slide up on load. `|` forces a line break; a single <em>…</em> (our own
 * strings only, never user input) renders as the italic amber accent.
 */
export function MaskTitle({ text, as: Tag = 'h1', className = '', delay = 0 }) {
  const lines = String(text).split('|');
  const safe = (s) => s.trim().replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/<(?!\/?em>)/g, '&lt;');
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask"><span style={{ '--d': `${delay + i * 110}ms` }} dangerouslySetInnerHTML={{ __html: safe(l) }} /></span>
      ))}
    </Tag>
  );
}

/** Inner-page hero: cinematic photo backdrop, giant serif title, glass actions. */
export function PageHero({ path, eyebrow, title, children, img, imgAlt, actions = true }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      {img && (
        <div className="absolute inset-0 -z-10">
          <Pic name={img} alt={imgAlt || ''} priority sizes="100vw" imgClass="kenburns h-full w-full object-cover opacity-[0.38]" className="block h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/60" />
        </div>
      )}
      {!img && <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-brand-700/10 blur-3xl" />}
      <div className="wrap pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pb-24">
        <Breadcrumbs path={path} />
        {eyebrow && <p className="eyebrow fade-up mt-10" style={{ '--d': '80ms' }}>{eyebrow}</p>}
        <MaskTitle text={title} className="display mt-5 max-w-4xl text-[2.9rem] sm:text-7xl lg:text-[5.4rem]" delay={120} />
        {children && <div className="lede fade-up mt-6 max-w-2xl" style={{ '--d': '420ms' }}>{children}</div>}
        {actions && (
          <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ '--d': '520ms' }}>
            <BookButton />
            <CallButton />
          </div>
        )}
      </div>
    </section>
  );
}

export function Section({ id, eyebrow, num, title, intro, children, className = '', tight = false, wide = false }) {
  return (
    <section id={id} className={`${tight ? 'py-14 sm:py-16' : 'py-20 sm:py-28'} ${className}`}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div className={wide ? 'max-w-5xl' : 'max-w-3xl'}>
            {eyebrow && <p className="eyebrow" data-reveal="fade">{num && <span className="num">{num}</span>}{eyebrow}</p>}
            {title && <h2 className="h-section mt-5" data-reveal>{title}</h2>}
            {intro && <p className="lede mt-5" data-reveal style={{ '--d': '100ms' }}>{intro}</p>}
          </div>
        )}
        <div className={title ? 'mt-12' : ''}>{children}</div>
      </div>
    </section>
  );
}

export function Checklist({ items, className = '' }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((t, i) => (
        <li key={t} className="flex gap-3" data-reveal style={{ '--d': `${i * 60}ms` }}>
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-700/15 text-brand-700"><Icon name="check" className="h-3.5 w-3.5" /></span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Faq({ items, title = 'Frequently asked questions' }) {
  if (!items?.length) return null;
  return (
    <section className="border-t border-white/[0.06] bg-night py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow" data-reveal="fade">FAQ</p>
          <h2 className="h-section mt-5" data-reveal>{title}</h2>
          <p className="lede mt-5" data-reveal>Still wondering? Call <a href={telHref}>{business.phone.display}</a>, any hour.</p>
        </div>
        <div className="border-t border-white/10">
          {items.map(([q, a], i) => (
            <details key={q} className="group border-b border-white/10 [&_summary::-webkit-details-marker]:hidden" data-reveal style={{ '--d': `${i * 50}ms` }}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                <h3 className="text-lg font-medium text-ink transition-colors group-hover:text-brand-700 sm:text-xl">{q}</h3>
                <span aria-hidden="true" className="relative mt-1.5 h-4 w-4 flex-none">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-brand-700" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-brand-700 transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-7 leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stars({ className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5 text-brand-700" role="img" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" className={className} />)}
    </span>
  );
}

export function Ratings({ dark = false }) {
  return (
    <ul className="flex flex-wrap gap-x-7 gap-y-2">
      {business.ratings.map((r) => (
        <li key={r.source}>
          <a href={r.href} rel="noopener" target="_blank" className={`flex items-center gap-2 text-sm font-semibold no-underline ${dark ? 'text-white hover:text-white' : 'text-ink hover:text-brand-700'}`}>
            <Icon name="star" className="h-4 w-4 text-brand-700" />
            {r.score.toFixed(1)}
            <span className="font-normal text-ink-3">{r.source}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Reviews({ only, limit = 6, title = 'What customers are saying' }) {
  const list = (only ? reviews.filter((r) => only.includes(r.name)) : reviews).slice(0, limit);
  return (
    <Section eyebrow="Reviews" title={title}>
      <div className="mb-10" data-reveal><Ratings /></div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => (
          <figure key={r.name} className="card spotlight flex flex-col" data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
            <span aria-hidden="true" className="display text-6xl leading-none text-brand-700">“</span>
            <Stars />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-2">{r.text}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700/15 font-semibold text-brand-700">{r.name[0].toUpperCase()}</span>
              <span><span className="block font-semibold text-white">{r.name}</span><span className="text-ink-3">{r.meta}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function CtaBand({ title = 'Need a ride? We’re up 24/7.', text = 'Book online in a couple of minutes, or call and talk to a real dispatcher.' }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden="true" className="absolute left-1/2 top-full -z-10 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-700/20 blur-[120px]" />
      <div className="wrap flex flex-col items-center py-24 text-center sm:py-32">
        <h2 className="display max-w-4xl text-5xl sm:text-7xl" data-reveal>{title}</h2>
        <p className="lede mt-6 max-w-xl" data-reveal style={{ '--d': '100ms' }}>{text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal style={{ '--d': '200ms' }}>
          <BookButton />
          <CallButton />
          <WhatsAppButton label="WhatsApp us" />
        </div>
      </div>
    </section>
  );
}

export function Prose({ blocks }) {
  // Renders extracted policy text (headings, paragraphs and list items) as semantic HTML.
  const groups = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (b.t === 'li' && last?.t === 'ul') last.items.push(b.x);
    else if (b.t === 'li') groups.push({ t: 'ul', items: [b.x] });
    else groups.push(b);
  }
  return (
    <div className="prose-legal max-w-3xl">
      {groups.map((g, i) => {
        if (g.t === 'ul') return <ul key={i}>{g.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        if (g.t === 'h1' || g.t === 'h2') return <h2 key={i}>{g.x}</h2>;
        if (/^h[3-6]$/.test(g.t)) return <h3 key={i}>{g.x}</h3>;
        return <p key={i}>{g.x}</p>;
      })}
    </div>
  );
}
