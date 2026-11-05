// Service-area pages. Each uses the fares actually published for that area so the pages are
// genuinely different (not doorway pages). Fares: to airport / from airport, sedan / SUV.

export const areaPages = {
  '/service-areas/dartmouth/': {
    name: 'Dartmouth',
    h1: 'Dartmouth taxi and airport transfers',
    intro: 'From Burnside business parks to downtown Dartmouth, Woodside and Portland Estates, 48Taxi & Limo picks you up at your door and gets you to Halifax Stanfield, the ferry or across the harbour on a flat, pre-agreed fare.',
    fares: [
      { area: 'Dartmouth (Burnside, Downtown, Waverley, Loon Lake)', to: '$60 / $75', from: '$71 / $86' },
      { area: 'Cole Harbour', to: '$60 / $70', from: '$72 / $81' },
      { area: 'Eastern Passage (past Shearwater)', to: '$78 / $88', from: '$88 / $99' },
    ],
    faqFare: 'Flat fares from Dartmouth (Burnside, downtown, Waverley, Loon Lake) to Halifax Stanfield start at $60 in a sedan or $75 in an SUV. From the airport to Dartmouth they start at $71 (sedan) or $86 (SUV). Cole Harbour starts at $60 and Eastern Passage at $78.',
    neighbourhoods: ['Downtown Dartmouth', 'Burnside', 'Woodside', 'Portland Estates', 'Manor Park', 'Woodlawn', 'Forest Hills', 'Colby Village', 'Cole Harbour', 'Eastern Passage', 'Shearwater', 'Waverley'],
    points: ['Flat airport fares, no meter surprises', 'Burnside and business park pickups for crews and staff', 'Cross-harbour rides into Halifax', 'Child seats and minivans for families'],
    img: 'airport-traveller',
  },
  '/service-areas/bedford/': {
    name: 'Bedford',
    h1: 'Bedford taxi and airport transfers',
    intro: 'Bedford is one of the quickest runs to Halifax Stanfield on Highway 102. Book a flat-rate ride from Bedford, Hammonds Plains or Kearney Lake and your driver is waiting at the door, early.',
    fares: [
      { area: 'Bedford (up to Hammonds Plains Rd)', to: '$60 / $70', from: '$71 / $86' },
      { area: 'Upper Hammonds Plains (Lucasville Rd to Yankeetown Rd)', to: '$75 / $85', from: '$86 / $98' },
      { area: 'Fall River', to: '$60 / $70', from: '$71 / $85' },
    ],
    faqFare: 'Flat fares from Bedford (up to Hammonds Plains Road) to Halifax Stanfield start at $60 in a sedan or $70 in an SUV. From the airport to Bedford they start at $71 (sedan) or $86 (SUV). Upper Hammonds Plains starts at $75.',
    neighbourhoods: ['Bedford Highway', 'Bedford West', 'Kearney Lake', 'Larry Uteck', 'Hammonds Plains', 'Upper Hammonds Plains', 'Fall River', 'Waverley'],
    points: ['Short, predictable run to YHZ on Highway 102', 'Early morning flights covered, 24/7', 'SUVs for skis, golf bags and extra luggage', 'Business accounts for Bedford offices'],
    img: 'chauffeur-door',
  },
  '/service-areas/truro/': {
    name: 'Truro',
    h1: 'Truro taxi to Halifax airport and beyond',
    intro: 'Getting from Truro or Bible Hill to a flight at Halifax Stanfield, or home again after a late landing, is one of our regular runs. Book ahead and you get a confirmation text before pickup and a driver who arrives early.',
    fares: [
      { area: 'Bible Hill (from YHZ)', to: 'Quoted', from: '$123' },
      { area: 'Debert (from YHZ)', to: 'Quoted', from: '$144' },
      { area: 'Truro', to: 'Quoted', from: 'Quoted' },
    ],
    faqFare: 'Our published long distance fare from Halifax Stanfield to Bible Hill is $123 and to Debert $144. Truro fares are confirmed when you book: use the fare estimator on our Prices page or call (902) 789-7777.',
    neighbourhoods: ['Downtown Truro', 'Bible Hill', 'Salmon River', 'Valley', 'Brookfield', 'Debert', 'Stewiacke', 'Enfield'],
    points: ['Pre-booked rides with text confirmation', 'Clean, modern sedans and SUVs', 'Fixed long distance fares, not a meter', 'Return trips from YHZ after late arrivals'],
    review: 'Tom Howard',
    img: 'chauffeur-driving',
  },
  '/service-areas/wolfville/': {
    name: 'Wolfville',
    h1: 'Wolfville and Acadia taxi to Halifax',
    intro: 'Heading to or from Acadia University, Wolfville or the Annapolis Valley? We run fixed-fare rides between Halifax Stanfield and the Valley year round, including move-in and move-out weekends.',
    fares: [
      { area: 'Wolfville (from YHZ)', to: 'Quoted', from: '$169' },
      { area: 'Kentville (from YHZ)', to: 'Quoted', from: '$195' },
      { area: 'Grand Pré (from YHZ)', to: 'Quoted', from: '$161' },
      { area: 'New Minas (from YHZ)', to: 'Quoted', from: '$187' },
    ],
    faqFare: 'Our fixed fare from Halifax Stanfield to Wolfville is $169, Grand Pré $161 and Kentville $195. Student groups travelling outside HRM can save up to 20%.',
    neighbourhoods: ['Wolfville', 'Acadia University', 'Grand Pré', 'New Minas', 'Kentville', 'Port Williams', 'Canning', 'Windsor'],
    points: ['Acadia move-in and move-out rides', 'Student and university team group discounts', 'Wine country and Valley day trips', 'Fixed fares from YHZ'],
    img: 'nova-scotia-service-map',
  },
};
