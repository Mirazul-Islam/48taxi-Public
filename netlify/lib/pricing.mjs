// Distance-based fare rules used by the online estimator.
// TODO(owner): confirm these against the old estimator's formula before launch.
// Source: published "Sedan long distance rate $1.70/km", lowest flat airport fare ($60),
// SUV/van airport fares run roughly 20–25% above sedan, "each added stop is +$5".
export const PRICING = {
  perKm: 1.7,
  minimumFare: 60,
  vehicleMultiplier: { Sedan: 1, 'Mid Size SUV': 1.2, 'Full Size SUV': 1.25, 'Mini Van': 1.25 },
  perStop: 5,
};

export function priceTrip({ km, vehicle = 'Sedan', stops = 0, roundTrip = false }) {
  const mult = PRICING.vehicleMultiplier[vehicle] ?? 1;
  const oneWay = Math.max(PRICING.minimumFare, km * PRICING.perKm) * mult + stops * PRICING.perStop;
  return Math.round(oneWay * (roundTrip ? 2 : 1));
}
