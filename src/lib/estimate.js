// Driving distance for a trip. Prices are then worked out in the browser with src/lib/pricing.js,
// so the breakdown updates instantly as extras change.
//
// 1. Google Maps in the browser (src/lib/maps.js), the same way the old WordPress form worked.
// 2. If that isn't available, the fare-estimate Netlify function (only used when a server key is set).
import { routeDistance, mapsFailed } from './maps.js';

const asText = (p) => (typeof p === 'string' ? p : p?.text || '');

/** Returns { km, minutes } or null when no route could be measured. */
export async function requestRoute({ pickup, dropoff, stops = [], vehicle, roundTrip }) {
  if (!pickup || !dropoff) return null;
  if (!mapsFailed()) {
    try {
      const r = await routeDistance(pickup, dropoff, stops);
      if (r) return r;
    } catch {
      /* fall through */
    }
  }
  try {
    const res = await fetch('/.netlify/functions/fare-estimate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pickup: asText(pickup), dropoff: asText(dropoff), stops: stops.map(asText), vehicle, roundTrip }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d.configured && d.km ? { km: d.km, minutes: d.minutes } : null;
  } catch {
    return null;
  }
}
