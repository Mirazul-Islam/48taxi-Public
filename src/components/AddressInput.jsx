import { useEffect, useRef, useState } from 'react';
import { loadMaps, attachAutocomplete, onMapsFailure, mapsFailed, YHZ } from '../lib/maps.js';

/** An address value: { text } while typing, { text, lat, lng, placeId } once picked from Google. */
export const isPicked = (a) => !!a && typeof a.lat === 'number';
export const addrText = (a) => (typeof a === 'string' ? a : a?.text || '');

/**
 * Address field with Google Places suggestions. Google's script loads on first focus/hover.
 * If Google isn't available, it behaves like a normal text field.
 */
export default function AddressInput({ value, onChange, id, name, placeholder = 'Start typing an address…', required, className = 'field', airport = false }) {
  const ref = useRef(null);
  const cb = useRef(onChange);
  cb.current = onChange;
  const [live, setLive] = useState(false); // suggestions attached
  const [broken, setBroken] = useState(false);
  const picked = isPicked(value);

  useEffect(() => onMapsFailure(() => setBroken(true)), []);

  const start = () => {
    const el = ref.current;
    if (!el || el.__l48ac || mapsFailed()) return;
    el.__l48ac = true;
    loadMaps()
      .then(() => { el.__l48off = attachAutocomplete(el, (p) => cb.current(p)); setLive(true); })
      .catch(() => setBroken(true));
  };
  useEffect(() => () => ref.current?.__l48off?.(), []);

  // When suggestions work, an address must be picked from them so the fare can be calculated.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const needPick = live && !broken && addrText(value).trim() && !picked;
    el.setCustomValidity(needPick ? 'Please choose the address from the suggestions so we can price your ride.' : '');
  }, [live, broken, value, picked]);

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        required={required}
        value={addrText(value)}
        onChange={(e) => onChange({ text: e.target.value })}
        onFocus={start}
        onMouseEnter={start}
        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`${className} ${airport || picked ? 'pr-24' : ''} ${picked ? '!border-emerald-500/60' : ''}`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {picked && <span className="text-sm font-semibold text-emerald-400" aria-hidden="true">✓</span>}
      </span>
      {airport && !picked && (
        <button type="button" onClick={() => onChange({ ...YHZ })} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-brand-700 hover:text-brand-700">
          ✈ YHZ
        </button>
      )}
      {live && !broken && addrText(value).trim() && !picked && (
        <p className="hint">Choose your address from the suggestions.</p>
      )}
    </div>
  );
}
