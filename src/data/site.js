// Single source of truth for business facts (NAP). Every page, the footer and the
// structured data read from here, so Google sees one consistent name/address/phone.
// TODO(owner): confirm address, hours and primary phone (see README "Please confirm").

export const SITE_URL = 'https://48taxi.co';

export const business = {
  name: '48Taxi & Limo',
  legalName: '48 Taxi & Limo Service',
  tagline: 'Halifax taxi, airport transfers and limo service',
  phone: { display: '(902) 789-7777', tel: '+19027897777' },
  phone2: { display: '(902) 488-8882', tel: '+19024888882' },
  tollFree: { display: '1 (866) 482-9090', tel: '+18664829090' },
  email: 'info@48taxi.co',
  address: {
    street: '344 Sackville Drive',
    locality: 'Lower Sackville',
    region: 'NS',
    regionName: 'Nova Scotia',
    country: 'CA',
  },
  hours: 'Open 24 hours, 7 days a week',
  airport: { name: 'Halifax Stanfield International Airport (YHZ)', address: '1 Bell Blvd, Enfield, NS B2T 1K2' },
  social: {
    facebook: 'https://www.facebook.com/48taxi/',
    instagram: 'https://www.instagram.com/48taxi.limo/',
    tiktok: 'https://www.tiktok.com/@48.taxi.limo',
    yelp: 'https://www.yelp.ca/biz/48-taxi-and-limo-services-halifax-2',
    tripadvisor:
      'https://www.tripadvisor.ca/Attraction_Review-g154976-d25092713-Reviews-48_Taxi_and_Limo_Services-Halifax_Halifax_Regional_Municipality_Nova_Scotia.html',
    googleReviews: 'https://www.google.com/search?q=48+Taxi+%26+Limo+Halifax+reviews',
  },
  ratings: [
    { source: 'Google', score: 4.9, href: 'https://www.google.com/search?q=48+Taxi+%26+Limo+Halifax+reviews' },
    { source: 'TripAdvisor', score: 5.0, href: 'https://www.tripadvisor.ca/Attraction_Review-g154976-d25092713-Reviews-48_Taxi_and_Limo_Services-Halifax_Halifax_Regional_Municipality_Nova_Scotia.html' },
    { source: 'Yelp', score: 4.0, href: 'https://www.yelp.ca/biz/48-taxi-and-limo-services-halifax-2' },
  ],
  areaServed: [
    'Halifax', 'Dartmouth', 'Bedford', 'Sackville', 'Cole Harbour', 'Fall River', 'Eastern Passage',
    'Truro', 'Wolfville', 'Lunenburg', 'Halifax Regional Municipality', 'Nova Scotia',
  ],
};

// Google Maps browser key, read at build time from the Netlify environment variable
// VITE_GOOGLE_MAPS_KEY (Site configuration → Environment variables). Kept out of the repository.
// It powers address autocomplete and the automatic fare calculation (src/lib/maps.js).
// Without it the site still works: customers type addresses and the fare is confirmed by phone.
export const GOOGLE_MAPS_KEY = (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_KEY) || '';

export const telHref = `tel:${business.phone.tel}`;
// WhatsApp uses the main number. Optional message pre-fills the chat.
export const whatsappHref = (text = 'Hi 48 Taxi, I’d like to book a ride.') => `https://wa.me/${business.phone.tel.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
export const fullAddress = `${business.address.street}, ${business.address.locality}, ${business.address.regionName}`;
