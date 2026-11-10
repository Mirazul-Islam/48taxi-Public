// The fare rules live in src/lib/pricing.js (shared with the website), so the server and the
// booking form can never disagree. Change prices there.
export { PRICING, VEHICLES, ADDONS, tripFare, quote } from '../../src/lib/pricing.js';
