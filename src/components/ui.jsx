import { Link } from 'react-router-dom';
import images from '../data/images.json';
import { business, telHref } from '../data/site.js';
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
    car: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  }[name];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'star' ? 0 : 1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={p} fill={name === 'star' ? 'currentColor' : 'none'} />
    </svg>
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
  return <Link to={to} className={className}>{children}</Link>;
}

export function Breadcrumbs({ path }) {
  const trail = breadcrumbTrail(path);
  if (trail.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < trail.length - 1 ? <Link to={t.path} className="text-ink-3 no-underline hover:text-ink">{t.name}</Link> : <span aria-current="page" className="text-ink-2">{t.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Standard inner-page hero. Text-first so the LCP element is text, not a large image. */
export function PageHero({ path, eyebrow, title, children, img, imgAlt, actions = true }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-band to-paper">
      <div className={`wrap grid gap-8 py-8 sm:py-12 ${img ? 'lg:grid-cols-[1.1fr_1fr] lg:items-center' : ''}`}>
        <div>
          <Breadcrumbs path={path} />
          {eyebrow && <p className="eyebrow mt-5">{eyebrow}</p>}
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{title}</h1>
          {children && <div className="lede mt-4 max-w-2xl">{children}</div>}
          {actions && (
            <div className="mt-6 flex flex-wrap gap-3">
              <BookButton />
              <CallButton />
            </div>
          )}
        </div>
        {img && <Pic name={img} alt={imgAlt} priority sizes="(min-width: 1024px) 560px, 100vw" imgClass="h-auto w-full rounded-2xl object-cover shadow-sm" />}
      </div>
    </section>
  );
}

export function Section({ id, eyebrow, title, intro, children, className = '', tight = false }) {
  return (
    <section id={id} className={`${tight ? 'py-10' : 'py-12 sm:py-16'} ${className}`}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div className="max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="h-section mt-1.5">{title}</h2>}
            {intro && <p className="mt-3 text-ink-2">{intro}</p>}
          </div>
        )}
        <div className={title ? 'mt-8' : ''}>{children}</div>
      </div>
    </section>
  );
}

export function Checklist({ items, className = '' }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <Icon name="check" className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Faq({ items, title = 'Frequently asked questions' }) {
  if (!items?.length) return null;
  return (
    <Section title={title} className="bg-band">
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line bg-card">
        {items.map(([q, a]) => (
          <details key={q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold">
              <h3 className="text-base">{q}</h3>
              <span aria-hidden="true" className="mt-0.5 text-xl leading-none text-brand-700 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-ink-2">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function Ratings({ dark = false }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {business.ratings.map((r) => (
        <li key={r.source}>
          <a href={r.href} rel="noopener" target="_blank" className={`flex items-center gap-1.5 text-sm font-semibold no-underline ${dark ? 'text-white hover:text-white' : 'text-ink hover:text-brand-700'}`}>
            <Icon name="star" className="h-4 w-4 text-amber-400" />
            {r.score.toFixed(1)}
            <span className={dark ? 'font-normal text-gray-300' : 'font-normal text-ink-3'}>on {r.source}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Reviews({ only, limit = 6, title = 'What customers are saying' }) {
  const list = (only ? reviews.filter((r) => only.includes(r.name)) : reviews).slice(0, limit);
  return (
    <Section eyebrow="Reviews" title={title} intro="Real feedback from recent rides and tours, from our Google reviews.">
      <div className="mb-6"><Ratings /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <figure key={r.name} className="card flex flex-col">
            <div className="flex gap-0.5 text-amber-400" role="img" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" className="h-4 w-4" />)}
            </div>
            <blockquote className="mt-3 flex-1 text-[15px] text-ink-2">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold">{r.name} <span className="font-normal text-ink-3">· {r.meta}</span></figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function CtaBand({ title = 'Need a ride? We’re up 24/7.', text = 'Book online in a couple of minutes, or call and talk to a real dispatcher.' }) {
  return (
    <section className="bg-night text-white">
      <div className="wrap flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 text-gray-300">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <BookButton className="btn-primary">Book a ride</BookButton>
          <CallButton className="btn-light" />
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
