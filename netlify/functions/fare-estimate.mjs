// POST /.netlify/functions/fare-estimate
// Body: { pickup, dropoff, stops: string[], vehicle, roundTrip }
// Uses the Google Routes API when GOOGLE_MAPS_API_KEY is set (kept server-side, never shipped
// to the browser) to get the driving distance, then prices it with the shared fare formula.
// Without a key it answers { configured: false } and the page shows a "from" price instead.
import { quote } from '../lib/pricing.mjs';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clean = (s) => (typeof s === 'string' ? s.trim().slice(0, 300) : '');

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' });
  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  const pickup = clean(input.pickup);
  const dropoff = clean(input.dropoff);
  const stops = (Array.isArray(input.stops) ? input.stops : []).map(clean).filter(Boolean).slice(0, 4);
  if (!pickup || !dropoff) return json(400, { error: 'pickup and dropoff are required' });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return json(200, { configured: false });

  try {
    const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration' },
      body: JSON.stringify({
        origin: { address: pickup },
        destination: { address: dropoff },
        intermediates: stops.map((address) => ({ address })),
        travelMode: 'DRIVE',
        regionCode: 'CA',
        units: 'METRIC',
      }),
    });
    if (!res.ok) return json(502, { error: 'Routing service error' });
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return json(422, { error: 'Could not find a route between those addresses' });
    const km = route.distanceMeters / 1000;
    const minutes = Math.round(parseInt(route.duration, 10) / 60);
    // Distance part only; the browser adds the extras the rider picked using the same formula.
    const amount = quote({ km, vehicle: input.vehicle, stops: stops.length, roundTrip: !!input.roundTrip }).total;
    return json(200, { configured: true, km: Math.round(km * 10) / 10, minutes, amount });
  } catch {
    return json(502, { error: 'Routing service unavailable' });
  }
};
