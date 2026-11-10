// Asks the fare-estimate function for the driving distance of a trip. Prices are then worked out
// in the browser with src/lib/pricing.js, so the breakdown updates instantly as extras change.

/** Returns { km, minutes } or null when routing isn't available (no API key, bad address, offline). */
export async function requestRoute({ pickup, dropoff, stops = [], vehicle, roundTrip }) {
  if (!pickup || !dropoff) return null;
  try {
    const res = await fetch('/.netlify/functions/fare-estimate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pickup, dropoff, stops, vehicle, roundTrip }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d.configured && d.km ? { km: d.km, minutes: d.minutes } : null;
  } catch {
    return null;
  }
}
