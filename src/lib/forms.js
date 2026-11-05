// Netlify Forms registry. Netlify detects forms by scanning static HTML at deploy time, and it
// only stores fields it saw there. Because several fields appear conditionally (return trip,
// tours, etc.), the build writes /__forms.html with every form and every field listed below.
// Keep these lists in sync with the components (scripts/check-seo.mjs verifies this).

export const FORMS = {
  booking: [
    'name', 'email', 'phone', 'contactPreference', 'serviceType', 'airportDirection', 'tourPackage', 'customTour',
    'tripType', 'pickupDate', 'pickupTime', 'pickupAddress', 'dropoffAddress', 'stops', 'airline', 'otherAirline', 'flightNumber',
    'returnDate', 'returnTime', 'returnPickupAddress', 'returnDropoffAddress', 'returnAirline', 'returnFlightNumber',
    'vehicle', 'passengers', 'luggage', 'meetGreet', 'childSeats', 'wakeUpCall', 'assistBags', 'requestType',
    'estimate', 'notes', 'coupon', 'agreeTerms',
  ],
  'park-fly': [
    'name', 'phone', 'email', 'dropoffDate', 'dropoffTime', 'pickupDate', 'pickupTime', 'departingFlight', 'returningFlight',
    'plate', 'make', 'model', 'colour', 'vehicleType', 'rides', 'passengers', 'bags', 'addons', 'estimate', 'notes',
  ],
  'truck-parking-quote': ['name', 'company', 'email', 'phone', 'lookingFor', 'unitType', 'units', 'duration', 'startDate', 'otherDetails', 'details', 'consent'],
  'truck-parking-agreement': ['clientName', 'company', 'email', 'phone', 'units', 'plates', 'startDate', 'signature', 'signedDate', 'agree'],
  lockout: ['firstName', 'lastName', 'email', 'phone', 'service', 'address', 'vehicleLocation', 'vehicleModel', 'colour', 'year', 'plate', 'agree'],
  contact: ['name', 'email', 'phone', 'message'],
  affiliate: ['company', 'phone', 'tollFree', 'fax', 'mailingAddress', 'suite', 'city', 'province', 'postalCode', 'website', 'email', 'contactPerson', 'yearsInBusiness'],
};

const encode = (data) => new URLSearchParams(data).toString();

/**
 * Submits a form to Netlify Forms. Posting to the static /__forms.html file (not the page URL)
 * is Netlify's recommended path for JavaScript-rendered forms.
 */
export async function submitForm(formName, values) {
  const body = { 'form-name': formName, 'bot-field': values['bot-field'] || '' };
  for (const k of FORMS[formName]) {
    const v = values[k];
    if (v === undefined || v === null || v === '' || v === false) continue;
    body[k] = Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
  }
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode(body),
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
  return true;
}

export function formsHtml() {
  const forms = Object.entries(FORMS)
    .map(([name, fields]) => `<form name="${name}" data-netlify="true" netlify-honeypot="bot-field" hidden>\n  <input type="hidden" name="form-name" value="${name}" />\n  <input name="bot-field" />\n${fields.map((f) => `  <input name="${f}" />`).join('\n')}\n</form>`)
    .join('\n');
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Forms</title></head><body>\n${forms}\n</body></html>\n`;
}
