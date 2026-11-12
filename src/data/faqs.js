// FAQ answers are drawn from the pricing guide (src/lib/pricing.js), policies and service details.
// They render on the page AND feed FAQPage structured data, so keep both in sync here only.

const airport = [
  ['How much is a taxi from Halifax to the airport?', 'Halifax Stanfield (YHZ) to downtown Halifax is about $76 in a Toyota Corolla or Camry, $86 in a minivan or Highlander and $116 in a Cadillac Escalade. Enter your address in the booking form or fare calculator to see your exact price before you book.'],
  ['Can I book a taxi to Halifax airport in advance?', 'Yes. Book online any time or call (902) 789-7777, 24/7. You see your price before you book, choose your vehicle, and lets you add child seats or a meet & greet.'],
  ['What happens if my flight is delayed?', 'When you give us your flight details, we monitor your arrival and adjust the pickup time. Waiting is free for 30 minutes after your flight actually lands; after that it is $0.75 per minute.'],
  ['Where do I meet my driver at Halifax Stanfield?', 'After baggage claim, go to the Ground Transportation desk in the arrivals area and check in with your name. Staff call your driver to the pre-arranged pickup zone. With meet & greet, your driver waits inside arrivals with a name sign.'],
  ['Do you have child and booster seats?', 'Yes. Highback boosters, backless boosters and infant car seats are available on request when you book. Booster seats are $10 each and an infant rear-facing seat is $15.'],
  ['How do I pay?', 'Cash, Visa, Mastercard, American Express and debit are accepted.'],
];

export const faqs = {
  '/halifax-airport-taxi/': airport,
  '/halifax-limo-service/': [
    ['How much is a limo in Halifax?', 'Hourly chauffeured service starts at $70 per hour in a sedan and $95 per hour in an SUV. Point-to-point limo rides are priced by distance and vehicle; YHZ to downtown Halifax is about $116 in a Cadillac Escalade. Groups travelling outside HRM can save up to 20%.'],
    ['What vehicles do you have?', 'Executive sedans (Lincoln MKS, Toyota Camry), mid-size SUVs (Lincoln MKX, Toyota Highlander), full-size SUVs (Cadillac Escalade, Chevy Suburban) and minivans (Honda Odyssey, Dodge Caravan). Vehicle selection depends on availability.'],
    ['Do you do weddings and proms?', 'Yes. Weddings, proms, galas and conferences are some of our most common bookings, and wedding and prom groups qualify for our group discount on trips outside HRM.'],
    ['Is gratuity included?', 'Gratuity is not included. A minimum 15% gratuity surcharge applies to prepaid and billed reservations.'],
  ],
  '/airport-shuttle-halifax/': [
    ['What is the best option for a group going to YHZ?', 'Book one minivan or Chevy Suburban for the whole group (up to 7 passengers with luggage) instead of separate cars. Groups travelling outside HRM can save up to 20%.'],
    ['Is this a shared shuttle with other passengers?', 'We typically provide private transportation. In rare cases, and only when operationally needed, passengers departing from the same area may share a ride.'],
    ['Can you take a large group with luggage?', 'Yes. Chevy Suburbans and minivans carry 6–7 passengers with luggage. For larger groups we send more than one vehicle.'],
  ],
  '/tour/peggys-cove/': [
    ['How long is the Peggy’s Cove tour?', 'It is a half-day private tour. You can add stops along the South Shore or extend it to Lunenburg and Mahone Bay for a full day.'],
    ['Can you pick us up from a hotel or cruise ship?', 'Yes. We pick up from any Halifax hotel, the cruise terminal or your home, and drop you back at the end.'],
    ['Is it a group bus tour?', 'No. Every tour is private: just your group, your driver and your own schedule.'],
  ],
  '/faq/': [
    ...airport,
    ['Do you drive outside Halifax?', 'Yes. We drive anywhere in Nova Scotia, New Brunswick and PEI. Enter your destination in the fare calculator to see the price before you book. Tolls are extra.'],
    ['What is your cancellation policy for airport trips?', 'More than 24 hours before pickup you receive a 100% company voucher. Between 12 and 24 hours a 25% fee applies, and under 12 hours a 50% fee applies, with the rest issued as a voucher. Vouchers are valid for 31 days.'],
    ['Is there a charge for waiting?', 'Waiting is free for 30 minutes after your flight lands for airport pickups, and for 10 minutes after the scheduled time for other pickups. After that it is $0.75 per minute ($45 per hour).'],
    ['Do you offer group discounts?', 'Up to 20% off the regular price to anywhere outside HRM for seniors, military, students, weddings, proms, conferences and university teams.'],
    ['Are you open 24/7?', 'Yes. Call (902) 789-7777 at any hour, or book online.'],
  ],
};

export const areaFaqs = (area, fareLine) => [
  [`How much is a taxi from ${area} to Halifax airport?`, fareLine],
  [`Can I book a ${area} taxi in advance?`, 'Yes. Book online or call (902) 789-7777, 24/7. We confirm by text or email, and you can add child seats, extra stops or a return trip.'],
  ['What vehicles can I book?', 'Sedans, mid-size and full-size SUVs and minivans. Vehicle selection depends on availability.'],
];
