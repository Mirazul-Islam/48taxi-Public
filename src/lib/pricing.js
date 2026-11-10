// 48 Taxi & Limo pricing: the ONE place fares are defined.
// Used by the booking form, the fare estimator, the price pages and the Netlify fare-estimate
// function, so changing a number here changes it everywhere.
// Source: "48 Taxi & Limo: Pricing Guide" (proposed November 2026).
//
//   Fare = the higher of $48 or ($2 × km), plus the vehicle surcharge.
//   Over 100 km, the Chevy Suburban and Cadillac Escalade are $2.50/km instead of $2/km.

export const PRICING = {
  perKm: 2,
  minimumFare: 48,
  longDistanceKm: 100,
  perStop: 5,
  longStopExtra: 10, // added when a stop runs over 5 minutes (charged after the ride)
  waiting: { perMinute: 0.75, perHour: 45, freeAirportMin: 30, freeOtherMin: 10 },
};

// Typical seating; vehicle selection depends on availability.
export const VEHICLES = [
  { model: 'Toyota Corolla', cls: 'Sedan', pax: 4, surcharge: 0 },
  { model: 'Toyota Camry', cls: 'Sedan', pax: 4, surcharge: 0 },
  { model: 'Lincoln MKS', cls: 'Sedan', pax: 4, surcharge: 15 },
  { model: 'Toyota Highlander', cls: 'Mid Size SUV', pax: 6, surcharge: 10 },
  { model: 'Lincoln MKX', cls: 'Mid Size SUV', pax: 4, surcharge: 15 },
  { model: 'Dodge Caravan', cls: 'Mini Van', pax: 6, surcharge: 10 },
  { model: 'Honda Odyssey', cls: 'Mini Van', pax: 7, surcharge: 10 },
  { model: 'Chevy Suburban', cls: 'Full Size SUV', pax: 7, surcharge: 25, longDistancePerKm: 2.5 },
  { model: 'Cadillac Escalade', cls: 'Full Size SUV', pax: 6, surcharge: 40, longDistancePerKm: 2.5 },
];
export const DEFAULT_VEHICLE = 'Toyota Camry';
export const vehicleFor = (model) => VEHICLES.find((v) => v.model === model) || VEHICLES.find((v) => v.model === DEFAULT_VEHICLE);

export const ADDONS = {
  meetGreet: 20,
  seat: 10, // child / booster seat, per seat
  infantSeat: 15, // infant rear-facing seat
  wakeUpCall: 2,
  delivery: 15, // per drop during a ride
  assistBags: 10, // to the door
  assistBagsHeavy: 20, // stairs, or 4+ heavy bags
  pet: 10, // per pet carrier, covers cleaning
  oversize: 10, // sports / oversize item or golf bag
};

// Price list as shown on the website.
export const ADDON_LIST = [
  ['Extra stop', '$5 per stop', 'Add $10 if the stop runs over 5 minutes'],
  ['Meet & greet', '$20', 'Driver parks and waits inside arrivals with a name sign'],
  ['Child / booster seat', '$10 per seat', 'Infant rear-facing seat $15'],
  ['Wake-up call', '$2', ''],
  ['Deliveries', '$15 per drop', 'During a ride. A standalone delivery uses the normal fare formula'],
  ['Assist with bags', '$10', 'To the door. $20 for stairs or 4 or more heavy bags'],
  ['Pet carrier (dog or cat)', '$10 per pet', 'Covers cleaning'],
  ['Sports / oversize item, golf bag', '$10 per item', ''],
  ['Personal item, carry-on, check-in bags', 'Free', 'Standard luggage is included'],
  ['Stroller, garment case', 'Free', ''],
];

export const WAITING_LIST = [
  ['Airport pickup', '30 minutes after the flight lands', '$0.75/min ($45/hour)'],
  ['All other pickups', '10 minutes after the scheduled time', '$0.75/min ($45/hour)'],
];

export const WAITING_TERMS = 'Waiting time beyond the free waiting period (30 minutes after landing for airport pickups, 10 minutes for other pickups) is billed at $0.75 per minute, and is added to the fare along with any additional services used during the ride.';

const cents = (n) => Math.round(n * 100) / 100;

/** Per-km rate for a vehicle and distance. */
export function ratePerKm(model, km) {
  const v = vehicleFor(model);
  return km > PRICING.longDistanceKm && v.longDistancePerKm ? v.longDistancePerKm : PRICING.perKm;
}

/** One-way fare for a trip of `km`: higher of the minimum or rate × km, plus the vehicle surcharge. */
export function tripFare(km, model) {
  const v = vehicleFor(model);
  return cents(Math.max(PRICING.minimumFare, ratePerKm(v.model, km) * km) + v.surcharge);
}

/**
 * Full quote with a line-by-line breakdown.
 * km: one-way route distance (null when it isn't known yet; the quote is then a "from" price).
 * extras: { meetGreet, seats: {highback, backless, infant}, wakeUpCall, assistBags: '' | 'door' | 'heavy', pets, oversize }
 * Each line has a kind: 'distance' | 'vehicle' | 'stops' | 'extra'.
 */
export function quote({ km = null, vehicle = DEFAULT_VEHICLE, stops = 0, roundTrip = false, extras = {}, extrasOnly = false }) {
  const v = vehicleFor(vehicle);
  const legs = roundTrip ? 2 : 1;
  const known = typeof km === 'number' && km > 0;
  const lines = [];
  const add = (label, amount, kind = 'extra') => amount && lines.push({ label, amount: cents(amount), kind });

  if (known) {
    const rate = ratePerKm(v.model, km);
    const distance = Math.max(PRICING.minimumFare, rate * km);
    add(rate * km < PRICING.minimumFare
      ? `Minimum fare (${km.toFixed(1)} km)${legs > 1 ? ' × 2 legs' : ''}`
      : `${km.toFixed(1)} km × $${rate.toFixed(2)}${legs > 1 ? ' × 2 legs' : ''}`, distance * legs, 'distance');
  } else {
    add(`Distance fare: $${PRICING.perKm}/km, $${PRICING.minimumFare} minimum${legs > 1 ? ' × 2 legs' : ''}`, PRICING.minimumFare * legs, 'distance');
  }
  add(`${v.model} surcharge${legs > 1 ? ' × 2 legs' : ''}`, v.surcharge * legs, 'vehicle');
  add(`Extra stops × ${stops}`, stops * PRICING.perStop, 'stops');
  if (extras.meetGreet) add('Meet & greet', ADDONS.meetGreet);
  const s = extras.seats || {};
  const std = (s.highback || 0) + (s.backless || 0);
  add(`Booster seats × ${std}`, std * ADDONS.seat);
  add(`Infant seats × ${s.infant || 0}`, (s.infant || 0) * ADDONS.infantSeat);
  if (extras.wakeUpCall) add('Wake-up call', ADDONS.wakeUpCall);
  if (extras.assistBags === 'door') add('Assist with bags', ADDONS.assistBags);
  if (extras.assistBags === 'heavy') add('Assist with bags (stairs / 4+ heavy bags)', ADDONS.assistBagsHeavy);
  add(`Pet carriers × ${extras.pets || 0}`, (extras.pets || 0) * ADDONS.pet);
  add(`Sports / oversize items × ${extras.oversize || 0}`, (extras.oversize || 0) * ADDONS.oversize);

  // Hourly and tour bookings are quoted by the team; only the extras are priced here.
  const shown = extrasOnly ? lines.filter((l) => l.kind === 'extra') : lines;
  const total = cents(shown.reduce((t, l) => t + l.amount, 0));
  return { lines: shown, total, exact: known, km: known ? km : null, extrasOnly };
}

/** Example fares for the price pages (10 km city ride, YHZ ↔ downtown 38 km, 80 km trip). */
export const EXAMPLE_TRIPS = [
  { label: 'Short city ride', km: 10 },
  { label: 'Halifax Stanfield (YHZ) ↔ downtown Halifax', km: 38 },
  { label: 'Longer trip', km: 80 },
];
