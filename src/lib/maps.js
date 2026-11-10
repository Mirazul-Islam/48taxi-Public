// Google Maps in the browser: address autocomplete (Places) and driving distance
// (Distance Matrix, or Directions when there are stops). Same APIs as the old WordPress form.
//
// The key comes from the Netlify environment variable VITE_GOOGLE_MAPS_KEY (see src/data/site.js).
// It is a browser key, so it ends up in the page; it is protected by the website restriction on the
// key in Google Cloud (Credentials → the key → Website restrictions), which must list every domain
// the site runs on, e.g. 48taxi.co/* and the *.netlify.app address.
//
// The script is only downloaded the first time someone focuses an address field, so pages that
// never need it stay fast.
import { GOOGLE_MAPS_KEY } from '../data/site.js';

// Halifax Stanfield International Airport (YHZ)
export const YHZ = {
  text: 'Halifax Stanfield International Airport (YHZ), 1 Bell Blvd, Enfield, NS B2T 1K2',
  lat: 44.8808,
  lng: -63.5086,
  placeId: 'ChIJN4Eg-NsdW0wRMUiUOoEbtPg',
};
export const isYhzText = (s) => /\byhz\b|stanfield|halifax (international )?airport/i.test(s || '');

let loading = null;
let failed = false;
const listeners = new Set();
export const mapsFailed = () => failed;
export const onMapsFailure = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
function fail(why) {
  if (failed) return;
  failed = true;
  console.warn(`[48 Taxi] Google Maps unavailable (${why}). Check the key's website restrictions and enabled APIs: Maps JavaScript, Places, Distance Matrix, Directions.`);
  listeners.forEach((fn) => fn());
}

/** Loads the Maps JavaScript API once. Resolves with google.maps. */
export function loadMaps() {
  if (typeof window === 'undefined') return Promise.reject(new Error('server'));
  if (window.google?.maps?.places) return Promise.resolve(window.google.maps);
  if (!GOOGLE_MAPS_KEY) fail('no VITE_GOOGLE_MAPS_KEY set');
  if (failed) return Promise.reject(new Error('failed'));
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.gm_authFailure = () => { fail('key rejected'); reject(new Error('auth')); };
    window.__l48MapsReady = () => resolve(window.google.maps);
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key: GOOGLE_MAPS_KEY, libraries: 'places', callback: '__l48MapsReady', language: 'en', region: 'CA', loading: 'async' })}`;
    s.onerror = () => { fail('script blocked'); reject(new Error('load')); };
    document.head.appendChild(s);
    setTimeout(() => { if (!window.google?.maps?.places) { fail('timeout'); reject(new Error('timeout')); } }, 15000);
  });
  return loading;
}

/** Nova Scotia, to rank local suggestions first (not a hard limit). */
const NS_BOUNDS = { south: 43.3, west: -66.5, north: 47.1, east: -59.6 };

/** Turns an <input> into a Google Places autocomplete. onPick({ text, lat, lng, placeId }). */
export function attachAutocomplete(input, onPick) {
  const maps = window.google.maps;
  const ac = new maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'ca' },
    bounds: NS_BOUNDS,
    strictBounds: false,
    fields: ['place_id', 'formatted_address', 'geometry', 'name'],
  });
  const sub = ac.addListener('place_changed', () => {
    const p = ac.getPlace();
    const loc = p?.geometry?.location;
    if (!loc) return; // user pressed enter on free text: leave it unconfirmed
    // Businesses (hotels, terminals) read better as "Name, address".
    const addr = p.formatted_address || '';
    const text = p.name && addr && !addr.startsWith(p.name) ? `${p.name}, ${addr}` : addr || p.name || input.value;
    onPick({ text, lat: loc.lat(), lng: loc.lng(), placeId: p.place_id || '' });
  });
  return () => sub.remove();
}

const point = (p) => (p && typeof p.lat === 'number' ? { lat: p.lat, lng: p.lng } : p?.text || p);

/**
 * Driving distance in the browser. Points are { lat, lng } objects (from autocomplete) or text.
 * Resolves { km, minutes } or null.
 */
export async function routeDistance(origin, destination, stops = []) {
  const maps = await loadMaps();
  if (stops.length) {
    const res = await new Promise((resolve) => new maps.DirectionsService().route({
      origin: point(origin),
      destination: point(destination),
      waypoints: stops.map((s) => ({ location: point(s), stopover: true })),
      travelMode: maps.TravelMode.DRIVING,
      unitSystem: maps.UnitSystem.METRIC,
      region: 'CA',
    }, (r, status) => resolve(status === 'OK' ? r : null)));
    const legs = res?.routes?.[0]?.legs;
    if (!legs) return null;
    const m = legs.reduce((t, l) => t + (l.distance?.value || 0), 0);
    const s = legs.reduce((t, l) => t + (l.duration?.value || 0), 0);
    return { km: Math.round(m / 100) / 10, minutes: Math.round(s / 60) };
  }
  const res = await new Promise((resolve) => new maps.DistanceMatrixService().getDistanceMatrix({
    origins: [point(origin)],
    destinations: [point(destination)],
    travelMode: maps.TravelMode.DRIVING,
    unitSystem: maps.UnitSystem.METRIC,
    region: 'CA',
  }, (r, status) => resolve(status === 'OK' ? r : null)));
  const el = res?.rows?.[0]?.elements?.[0];
  if (!el || el.status !== 'OK') return null;
  return { km: Math.round(el.distance.value / 100) / 10, minutes: Math.round(el.duration.value / 60) };
}
