import { airportFares } from '../data/fares.js';
import { business } from '../data/site.js';

const isAirport = (s) => /stanfield|\byhz\b|1 bell blvd|halifax (international )?airport/i.test(s || '');
// Most specific names first so "Lower Sackville" wins over "Sackville", and "Halifax" is last.
const AREAS = [...airportFares].sort((a, b) => b.area.length - a.area.length);
const matchArea = (addr) => AREAS.find((a) => new RegExp(`\\b${a.area.replace(/\s+/g, '\\s+')}\\b`, 'i').test(addr || ''));

const vehicleKey = (v) => (v && v !== 'Sedan' ? 'SUV' : 'SED');
const fmt = (n) => `$${Math.round(n)} CAD`;

/** Flat-fare lookup for trips to/from YHZ using the published area table (works without any API key). */
export function flatAirportFare({ pickup, dropoff, vehicle, roundTrip }) {
  const toAirport = isAirport(dropoff);
  const fromAirport = isAirport(pickup);
  if (!toAirport && !fromAirport) return null;
  const area = matchArea(toAirport ? pickup : dropoff);
  if (!area) return null;
  const k = vehicleKey(vehicle);
  const one = toAirport ? area.toAirport[k] : area.fromAirport[k];
  const back = toAirport ? area.fromAirport[k] : area.toAirport[k];
  const amount = roundTrip ? one + back : one;
  return { amount, text: `From ${fmt(amount)}`, detail: `flat ${toAirport ? 'to-airport' : 'from-airport'} fare for ${area.area}${roundTrip ? ', round trip' : ''}` };
}

export async function requestEstimate(trip) {
  try {
    const res = await fetch('/.netlify/functions/fare-estimate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(trip),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.configured && d.amount) return { amount: d.amount, text: `≈ ${fmt(d.amount)} (${d.km} km, about ${d.minutes} min)` };
    }
  } catch {
    /* fall through to the flat-fare table */
  }
  const flat = flatAirportFare(trip);
  if (flat) return { amount: flat.amount, text: `${flat.text} · ${flat.detail}` };
  return { amount: null, text: `We’ll confirm your exact fare when we contact you, or call ${business.phone.display} for an instant quote.` };
}
