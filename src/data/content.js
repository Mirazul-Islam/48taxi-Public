// Content carried over from the current 48taxi.co pages (same wording where possible).

export const tours = [
  { slug: 'peggys-cove-coastal-stops', name: 'Peggy’s Cove + Coastal Stops', length: 'Half-day', text: 'Iconic lighthouse views, fishing villages, and classic South Shore photo stops.', tags: ['Lighthouse', 'Coast', 'Photos'], page: '/tour/peggys-cove/', img: 'peggys-cove-lighthouse' },
  { slug: 'halifax-city-citadel-waterfront', name: 'Halifax City + Citadel + Waterfront', length: '2–4 hours', text: 'Top city highlights, historic Citadel views, plus the waterfront boardwalk vibe.', tags: ['City', 'History', 'Waterfront'] },
  { slug: 'lunenburg-mahone-bay', name: 'Lunenburg + Mahone Bay', length: 'Full-day', text: 'Colorful coastal towns, scenic harbours, and postcard-perfect streets.', tags: ['South Shore', 'Coastal', 'Relaxed'], img: 'lunenburg-harbour' },
  { slug: 'cabot-trail-scenic-day', name: 'Cabot Trail Scenic Day', length: 'Full-day', text: 'Ocean cliffs, lookoffs, winding coast roads — Cape Breton’s most famous drive.', tags: ['Scenic', 'Lookouts', 'Cape Breton'] },
  { slug: 'cape-breton-highlands-viewpoints-short-hikes', name: 'Cape Breton Highlands Viewpoints + Short Hikes', length: 'Full-day', text: 'Big views and fresh air — pick the best lookouts and easy trails for your group.', tags: ['Highlands', 'Hikes', 'Nature'] },
  { slug: 'fortress-of-louisbourg-historic-experience', name: 'Fortress of Louisbourg Historic Experience', length: 'Half / Full-day', text: 'Step back into an 18th-century fortified town with immersive history stops.', tags: ['History', 'Cape Breton', 'Family'] },
  { slug: 'whale-watching-bay-of-fundy', name: 'Whale Watching (Bay of Fundy)', length: '2–4 hours', text: 'Seasonal cruises for whales, seabirds, and incredible coastal scenery.', tags: ['Wildlife', 'Ocean', 'Seasonal'] },
  { slug: 'shubenacadie-tidal-bore-rafting', name: 'Shubenacadie Tidal Bore Rafting', length: '2–4 hours', text: 'High-energy rafting on the tidal river — one of Nova Scotia’s most unique adventures.', tags: ['Adventure', 'Bay of Fundy', 'Adrenaline'] },
  { slug: 'annapolis-royal-fort-anne', name: 'Annapolis Royal + Fort Anne', length: 'Full-day', text: 'Historic Annapolis Royal with a classic fort visit and beautiful riverside views.', tags: ['History', 'Scenic', 'Southwest NS'] },
  { slug: 'kejimkujik-keji-paddling-day', name: 'Kejimkujik (Keji) Paddling Day', length: 'Half / Full-day', text: 'Peaceful lakes and waterways — canoe/kayak time in one of Nova Scotia’s top parks.', tags: ['Paddling', 'Nature', 'Relaxed'] },
  { slug: 'bluenose-ii-sailing-harbour-cruise', name: 'Bluenose II Sailing / Harbour Cruise', length: '2 hours', text: 'A true Nova Scotia icon — a memorable harbour sail (seasonal schedule).', tags: ['Sailing', 'Maritime', 'Seasonal'] },
  { slug: 'joggins-fossil-cliffs-guided-beach-tour', name: 'Joggins Fossil Cliffs Guided Beach Tour', length: '1–2 hours', text: 'Explore dramatic sea cliffs and fossil beds with a guided beach experience.', tags: ['UNESCO', 'Fossils', 'Family'] },
];

export const reviews = [
  { name: 'Tom Howard', meta: 'Local Guide · Google', text: 'Second Sunday in a row I used this great service to move from Truro to the airport. Clean, modern vehicles and impeccable customer service. This morning I reserved my ride in advance. A half hour before the pick up time I got a text confirming and my ride was there 15 minutes early. Highly recommend.' },
  { name: 'barb c', meta: 'Google', text: 'Great service, thank you. Booked transportation from and to airport for 6 adults and one infant in suburban suv. Both times drivers were early, friendly, and assisted with luggage. Car was clean and comfortable. Would definitely use again.' },
  { name: 'Sbeii Ahlem', meta: 'Google', text: 'I’ve been hearing a lot of great things about 48 Taxi and Limo, and after using their service, I can clearly see why. They are professional, reliable, and provide some of the best long-distance transportation in the area. Their drivers are friendly and punctual, and the rides are always comfortable. They also offer amazing tours to Peggy’s Cove and Lunenburg, which I highly recommend.' },
  { name: 'Dania Dabbas', meta: 'Google', text: '48 Taxi & Limo Service is by far the best in Halifax! Always on time, super professional, and the cars are clean and comfortable. The drivers are friendly and know the city well. Highly recommend them for airport pickups, business trips, or just a smooth ride around town.' },
  { name: 'Jass Narwal', meta: 'Google', text: 'Fantastic ride! The driver was punctual, the car was spotless, and the trip was fast and smooth. Very professional and helpful—made the whole journey stress-free. Highly recommended!' },
  { name: 'Tania Sultana', meta: 'Google', text: 'Great service. We booked for whole day tour. It was very comfortable, smooth. He explains and shows the beautiful places.' },
  { name: 'Mikhail Graves-Smith', meta: 'Google', text: 'Great experience. Reliable, pleasant and very clean. Very impressed. Great prices and great service.' },
];

export const golf = [
  { name: 'Cabot Cliffs (Cabot Cape Breton)', text: 'Frequently ranked #1 in Canada by SCOREGolf and featured in Golf Digest’s and Golfweek’s global rankings.', img: 'golf-cabot-cliffs' },
  { name: 'Highlands Links (Cape Breton Highlands Links)', text: 'Designed by Stanley Thompson, this historic course is set within Cape Breton Highlands National Park and has earned high national and international acclaim.', img: 'golf-highlands-links' },
  { name: 'Fox Harb’r Golf Resort & Spa', text: 'The only five-star golf resort in Nova Scotia, featuring an 18-hole championship course designed by Graham Cooke.', img: 'golf-fox-harbr' },
  { name: 'Digby Pines Golf Resort & Spa', text: 'A signature resort with hotel and spa, featuring a historic layout designed by Stanley Thompson.', img: 'golf-digby-pines' },
  { name: 'The Links at Brunello', text: 'A relatively new and highly regarded course designed by Tom McBroom, located just outside Halifax.', img: 'golf-brunello' },
  { name: 'Northumberland Links', text: 'An 18-hole championship course with panoramic views over the Northumberland Strait.', img: 'golf-northumberland' },
];

// Hotels shown on the current homepage under "Trusted Transportation Partner for Hotels".
// TODO(owner): confirm each is still a current partner before launch.
export const hotels = [
  'Alt Hotel Halifax Airport', 'Holiday Inn Express & Suites Halifax Airport', 'Cambridge Suites Hotel', 'Courtyard by Marriott Halifax Downtown',
  'Delta Barrington', 'Halifax Marriott Harbourfront', 'Residence Inn Halifax Downtown', 'Lord Nelson Hotel & Suites',
  'Muir, a Luxury Collection Hotel', 'Prince George Hotel', 'Radisson Suite Hotel Halifax', 'The Halliburton',
  'Four Points by Sheraton', 'Halifax Tower Hotel & Conference Centre', 'Homewood Suites by Hilton', 'Hilton Garden Inn',
  'Hampton Inn', 'The Sutton Place Hotel Halifax',
];

export const popularServices = [
  { title: 'Airport runs', text: 'Rides to and from Halifax Stanfield (YHZ), priced upfront, with flight tracking and meet & greet.', to: '/halifax-airport-taxi/', img: 'airport-traveller' },
  { title: 'Long distance & holiday trips', text: 'Anywhere in Nova Scotia, plus New Brunswick and PEI, at $2 per km. Up to 20% off for groups.', to: '/schedule/', img: 'nova-scotia-service-map' },
  { title: 'Private jet pickups', text: 'Discreet chauffeured pickups at private terminals and FBOs.', to: '/halifax-limo-service/', img: 'private-jet-pickup' },
  { title: 'Boat trips', text: 'Rides to harbour cruises, ferries and the Bluenose II.', to: '/tour/', img: 'boat-trip' },
  { title: 'Courier service', text: 'Same-day parcel and document delivery across HRM.', to: '/contact/', img: 'courier-delivery' },
];

export const vehicles = [
  { model: 'Toyota Camry', cls: 'Sedan' }, { model: 'Toyota Corolla', cls: 'Sedan' }, { model: 'Lincoln MKS', cls: 'Sedan' },
  { model: 'Toyota Highlander', cls: 'Mid Size SUV' }, { model: 'Lincoln MKX', cls: 'Mid Size SUV' },
  { model: 'Chevy Suburban', cls: 'Full Size SUV' }, { model: 'Cadillac Escalade', cls: 'Full Size SUV' },
  { model: 'Honda Odyssey', cls: 'Mini Van' }, { model: 'Dodge Caravan', cls: 'Mini Van' },
];

export const airlines = [
  'Air Canada', 'Air Saint-Pierre', 'BermudAir', 'Flair Airlines', 'PAL Airlines', 'Pascan Aviation', 'Porter', 'United Airlines', 'WestJet',
  'American Airlines (Summer)', 'Delta Air Lines (Summer)', 'Discover Airlines (Summer)', 'Edelweiss (Summer)', 'Icelandair (Summer)', 'Air Transat (Winter)', 'Other',
];

export const luggageTypes = [
  ['personal', 'Personal item'], ['carryon', 'Small carry-on'], ['checkedMedium', 'Check-in (medium)'], ['checkedLarge', 'Check-in (large)'],
  ['oversize', 'Sports / oversize'], ['garment', 'Garment case'], ['petDog', 'Pet carrier (dog)'], ['petCat', 'Pet carrier (cat)'],
  ['golf', 'Golf bag'], ['stroller', 'Stroller'],
];

export const getaways = [
  { name: 'St. FX & Acadia', text: 'Looking to take a trip to St. FX or Acadia? We’ve got you covered with the best rates.', img: 'acadia-thumb' },
  { name: 'Peggy’s Cove', text: 'Explore the breathtaking shores of Nova Scotia’s Peggy’s Cove and its famous lighthouse.', img: 'peggys-cove-thumb', to: '/tour/peggys-cove/' },
  { name: 'Crystal Crescent Beach', text: 'Crystal Crescent Beach Provincial Park is in Sambro Creek, with three white-sand crescent beaches.', img: 'crystal-crescent-thumb' },
  { name: 'Chester', text: 'Founded in 1759 by New England Planters, Chester is noted for sailing, stately homes, gardens and a relaxed lifestyle.', img: 'chester-thumb' },
  { name: 'Old Town Lunenburg', text: 'A UNESCO World Heritage Site, and home port of Nova Scotia’s sailing ambassador, the Bluenose II.', img: 'lunenburg-thumb' },
];
