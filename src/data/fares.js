import tables from './fares-tables.json';

// Flat airport fares by area (Services & Rates page). Values are "from" prices in CAD.
export const airportFares = tables.airportFlatByArea;
// "Rates to Airport" zone table (Prices page, second tab).
export const airportZones = tables.ratesToAirportZones;
// "Halifax Airport to HRM" table (Prices page, third tab).
export const airportToHRM = tables.airportToHRM;
// Long distance fixed fares from Halifax Stanfield.
export const longDistanceNS = tables.longDistanceNS;
export const longDistanceNBPEI = tables.longDistanceNBPEI;

export const fareNotes = {
  general:
    'Price may vary based on distance, additional stops, booster seats, weather conditions, weekends or holidays, extra waiting time or delay, tolls, extra bags, late reservation, high demand (peak hours), and vehicle type/size. Gratuity is not included. A minimum gratuity surcharge of 15% applies to all prepaid & billed reservations.',
  fuel: 'Due to sharp increases in gasoline prices, all local rates are temporarily subject to a $5.00 fuel surcharge.',
  longDistance:
    'All long distance rates include HST. Tips are not included. Tolls, waiting time and extra stops are subject to surcharges. 48Taxi & Limo can go up to 20% off the regular price for groups.',
  payment: 'Cash, Visa, Mastercard, American Express and debit accepted.',
};

export const extras = [
  ['Baby seat', '$10'],
  ['Holding (name) sign', '$10'],
  ['Debit or credit card fee', '$7'],
  ['Wake-up call', '$5'],
  ['Each added stop', '$5'],
  ['Waiting time after the first 5 minutes', '$1 / minute'],
];

export const hourly = [
  ['Sedan, long distance', '$1.70 / km'],
  ['Sedan, hourly', '$70 / hour'],
  ['SUV, hourly', '$95 / hour'],
];

export const groupDiscount = {
  text: 'Up to 20% off the regular price to anywhere outside HRM for groups.',
  groups: ['Seniors', 'Military groups', 'Student groups', 'Wedding groups', 'Prom groups', 'Conference groups', 'University teams'],
};

// Per-person fares shown on the current homepage.
export const perPerson = [
  { label: 'Group (3+ people)', price: 20, points: ['You arrange a group of 3 or more people', 'You make your own flight arrangements', 'Within the standard coverage area (otherwise additional fees apply)', 'Payment: cash in car'] },
  { label: 'Pairs', price: 30, points: ['You arrange for 2 passengers', 'You make your own flight arrangements', 'Within the standard coverage area (otherwise additional fees apply)', 'Payment: cash in car'] },
  { label: 'Individual', price: 60, points: ['For individual travel', 'Within the standard coverage area (otherwise additional fees apply)', 'Payment: cash in car'] },
];

export const money = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-CA', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}` : n);
export const fareFor = (place) => longDistanceNS.find((x) => x.place.toLowerCase().startsWith(place.toLowerCase()));
