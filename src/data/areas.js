// Service-area pages. Each has its own neighbourhoods, reasons and FAQ answer so the pages are
// genuinely different (not doorway pages). Fares follow the shared formula in src/lib/pricing.js.

export const areaPages = {
  '/service-areas/dartmouth/': {
    name: 'Dartmouth',
    h1: 'Dartmouth taxi and airport transfers',
    intro: 'From Burnside business parks to downtown Dartmouth, Woodside and Portland Estates, 48Taxi & Limo picks you up at your door and gets you to Halifax Stanfield, the ferry or across the harbour with the price shown before you book.',
    faqFare: 'A ride between Dartmouth and Halifax Stanfield is priced by the driving distance and the vehicle you choose. Enter your address in the fare calculator on this page, or in the booking form, to see the exact price before you book.',
    neighbourhoods: ['Downtown Dartmouth', 'Burnside', 'Woodside', 'Portland Estates', 'Manor Park', 'Woodlawn', 'Forest Hills', 'Colby Village', 'Cole Harbour', 'Eastern Passage', 'Shearwater', 'Waverley'],
    points: ['Price shown before you book, no surge', 'Burnside and business park pickups for crews and staff', 'Cross-harbour rides into Halifax', 'Child seats and minivans for families'],
    img: 'airport-traveller',
  },
  '/service-areas/bedford/': {
    name: 'Bedford',
    h1: 'Bedford taxi and airport transfers',
    intro: 'Bedford is one of the quickest runs to Halifax Stanfield on Highway 102. Book a ride from Bedford, Hammonds Plains or Kearney Lake and your driver is waiting at the door, early.',
    faqFare: 'A ride between Bedford and Halifax Stanfield is priced by the driving distance and the vehicle you choose. Enter your address in the fare calculator on this page, or in the booking form, to see the exact price before you book.',
    neighbourhoods: ['Bedford Highway', 'Bedford West', 'Kearney Lake', 'Larry Uteck', 'Hammonds Plains', 'Upper Hammonds Plains', 'Fall River', 'Waverley'],
    points: ['Short, predictable run to YHZ on Highway 102', 'Early morning flights covered, 24/7', 'SUVs for skis, golf bags and extra luggage', 'Business accounts for Bedford offices'],
    img: 'chauffeur-door',
  },
  '/service-areas/truro/': {
    name: 'Truro',
    h1: 'Truro taxi to Halifax airport and beyond',
    intro: 'Getting from Truro or Bible Hill to a flight at Halifax Stanfield, or home again after a late landing, is one of our regular runs. Book ahead and you get a confirmation text before pickup and a driver who arrives early.',
    faqFare: 'A ride between Truro and Halifax Stanfield is priced by the driving distance and the vehicle you choose. Enter your address in the fare calculator on this page, or in the booking form, to see the exact price before you book.',
    neighbourhoods: ['Downtown Truro', 'Bible Hill', 'Salmon River', 'Valley', 'Brookfield', 'Debert', 'Stewiacke', 'Enfield'],
    points: ['Pre-booked rides with text confirmation', 'Clean, modern sedans and SUVs', 'Upfront long distance pricing, not a meter', 'Return trips from YHZ after late arrivals'],
    review: 'Tom Howard',
    img: 'chauffeur-driving',
  },
  '/service-areas/wolfville/': {
    name: 'Wolfville',
    h1: 'Wolfville and Acadia taxi to Halifax',
    intro: 'Heading to or from Acadia University, Wolfville or the Annapolis Valley? We run rides between Halifax Stanfield and the Valley year round, including move-in and move-out weekends.',
    faqFare: 'A ride between Wolfville and Halifax Stanfield is priced by the driving distance and the vehicle you choose. Enter your address in the fare calculator on this page, or in the booking form, to see the exact price before you book. Student groups travelling outside HRM can save up to 20%.',
    neighbourhoods: ['Wolfville', 'Acadia University', 'Grand Pré', 'New Minas', 'Kentville', 'Port Williams', 'Canning', 'Windsor'],
    points: ['Acadia move-in and move-out rides', 'Student and university team group discounts', 'Wine country and Valley day trips', 'Upfront fares to and from YHZ'],
    img: 'nova-scotia-service-map',
  },
};
