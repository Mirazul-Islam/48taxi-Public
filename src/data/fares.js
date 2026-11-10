// Price notes and the few prices that are NOT distance-based (hourly charters).
// Distance fares, vehicle surcharges, extras and waiting time live in src/lib/pricing.js.

export const fareNotes = {
  general:
    'Fare = the higher of $48 or $2 per km, plus the vehicle surcharge. Extra stops are $5 each. Additional services and waiting time beyond the free period are added to the fare. Gratuity is not included. A minimum gratuity surcharge of 15% applies to all prepaid & billed reservations.',
  longDistance:
    'Long distance trips use the same formula: $2 per km ($2.50 per km for the Chevy Suburban and Cadillac Escalade over 100 km), plus the vehicle surcharge. Tolls are extra. 48Taxi & Limo can go up to 20% off the regular price for groups.',
  payment: 'Cash, Visa, Mastercard, American Express and debit accepted.',
};

export const hourly = [
  ['Sedan, hourly', '$70 / hour'],
  ['SUV, hourly', '$95 / hour'],
];

export const groupDiscount = {
  text: 'Up to 20% off the regular price to anywhere outside HRM for groups.',
  groups: ['Seniors', 'Military groups', 'Student groups', 'Wedding groups', 'Prom groups', 'Conference groups', 'University teams'],
};

export const money = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-CA', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}` : n);
