# 48Taxi & Limo — public website

The rebuilt **48taxi.co**: React, pre-rendered to static HTML for SEO, hosted on Netlify with
Netlify Forms and Netlify Functions. Colours follow the current site (espresso brown, cream
text, amber `#FD9800` accents, orange `#F85A00` logo), with an editorial premium design:
Instrument Serif display type, film grain, glass surfaces, scroll reveals, image wipes,
count-up stats, marquees and smooth scrolling (all motion respects reduced-motion settings).

| Lighthouse (lab, mobile) | Old WordPress site | This site |
|---|---|---|
| Performance | 58 | 94–96 (desktop 100) |
| Accessibility | 87 | 100 |
| Best practices | 96 | 100 |
| SEO | 92 | 100 |
| Largest Contentful Paint | 14.2 s | ~2 s |
| Homepage weight | 6.8 MB | ~0.35 MB |

## What's inside

- **Existing URLs kept exactly** (`/book-now/`, `/schedule/`, `/gti/`, `/slim-jim/`, …), so rankings and backlinks carry over.
- **Retired services:** Park & Fly and truck/container parking were removed. `/parkfly/` 301-redirects to `/halifax-airport-taxi/` and `/truck-container-parking/` to `/`; the build fails if those redirects are ever removed.
- **11 new keyword pages:** `/halifax-airport-taxi/`, `/halifax-limo-service/`, `/airport-shuttle-halifax/`, `/service-areas/` (+ Dartmouth, Bedford, Truro, Wolfville), `/tour/peggys-cove/`, `/corporate-hotel-transportation/`, `/faq/`.
- **One clean set of SEO tags per page** (the old site printed two of everything): title, description, canonical, robots, Open Graph, plus JSON-LD for `LocalBusiness`, `WebSite`, `WebPage`, `BreadcrumbList`, `TaxiService` and `FAQPage`.
- `sitemap.xml`, `robots.txt` and a `noindex` 404 page are generated at build time.
- 301 redirects in `netlify.toml` for WordPress leftovers (`/feed/`, `/wp-content/…`, old fare PDFs, `/sitemap.rss`, …) and friendly aliases (`/prices/`, `/tours/`, `/park-and-fly/` …).
- **Forms** (booking, lockout, contact, affiliate) are stored by Netlify Forms, with a honeypot to filter spam.
- **Functions:**
  - `fare-estimate` uses the Google Routes API when a key is set. Without a key, the site falls back to the published flat airport fares by area.
  - `submission-created` can email each form submission through Resend.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173 (client-rendered, for editing)
npm run build      # client + server build, pre-render all pages, then SEO checks
npm run preview    # serves dist/ like Netlify (gzip, pretty URLs, 404) on :4173
```

`npm run build` fails if any page has a missing or duplicate title, description, canonical or H1, a broken internal link, invalid JSON-LD, or if any of the 16 legacy URLs is missing.

## Deploy on Netlify

1. Netlify → **Add new site → Import an existing project → GitHub** → choose `48taxi-public`. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`, functions in `netlify/functions`).
2. **Forms:** Site configuration → Forms → **Enable form detection**, then redeploy once. Netlify finds the forms in `/__forms.html`. Add email notifications under Forms → Form notifications.
3. **Optional environment variables** (Site configuration → Environment variables):

   | Variable | Purpose |
   |---|---|
   | `GOOGLE_MAPS_API_KEY` | Exact distance-based quotes in the fare estimator. Enable the Routes API, and restrict the key to that API. |
   | `RESEND_API_KEY`, `NOTIFY_EMAIL`, `FROM_EMAIL` | Email every submission to your inbox via Resend. `FROM_EMAIL` must be on a domain you verified in Resend. |
   | `SEND_CONFIRMATION=true` | Also email the customer a copy. |
4. Test on the `*.netlify.app` URL first: book a test ride and check it appears under Forms.
5. **Domain:** Domain management → add `48taxi.co` and `www.48taxi.co` (www redirects to the bare domain), update DNS at your registrar, and let Netlify issue HTTPS.

## Launch-day SEO checklist

- [ ] In WordPress, note any pages that aren't in the sitemap (drafts, landing pages). Add a redirect for each one in `netlify.toml`.
- [ ] Switch DNS. Then in Google Search Console, submit `https://48taxi.co/sitemap.xml` and use URL Inspection → Request indexing on `/`, `/halifax-airport-taxi/`, `/schedule/` and `/tour/`.
- [ ] Check that `https://www.48taxi.co/` and `http://48taxi.co/` both 301 to `https://48taxi.co/`.
- [ ] Update Google Business Profile: website URL, hours (24/7), category "Taxi service", address and phone matching the footer.
- [ ] Keep WordPress available (not deleted) for 30 days in case anything was missed.
- [ ] Don't buy backlink packages. The old profile is about 97% spam links. Build real citations instead (BBB, Birdeye, Yelp, TripAdvisor, hotel partners).

## Please confirm before launch (owner)

These are taken from the current site, but they conflict or are unclear:

1. **Address:** footer and schema use **344 Sackville Drive, Lower Sackville, NS** (the Park & Fly yard). Is this the business address you want on Google?
2. **Hours:** the site says 24/7, but the old schema said Mon–Sun 09:00–17:00. This build uses **24/7**.
3. **Main phone:** (902) 789-7777 is primary, with (902) 488-8882 and 1 (866) 482-9090 shown as secondary numbers.
4. **Fare estimator formula** (`netlify/lib/pricing.mjs`): $1.70/km, $60 minimum, SUV/van +20–25%, +$5 per stop. Please match it to your real pricing.
5. **Per-person fares ($20 / $30 / $60, cash):** the homepage didn't say what they apply to. They're shown here as airport per-person fares.
6. **Three airport fare tables disagree** (Services & Rates vs the Prices tabs, for example Halifax $60+ vs $59.75 vs $63). All three are kept as they were. Pick one and the others can be removed.
7. **Hotel list** on the homepage and Corporate page: confirm each is a current partner.
8. **Refund policy contact** lists `48taxii@gmail.com`; everywhere else uses `info@48taxi.co`.
9. **Address:** the footer and schema still use 344 Sackville Drive (the former Park & Fly yard). Confirm the business address to show now that Park & Fly is gone.
10. **Privacy policy** still has a section on the Park & Fly lot cameras; remove it if the lot is no longer used.
11. **Fleet capacities** on the homepage (sedan 3, mid-size SUV 5, full-size SUV 6, minivan 6) and real fleet photos.
12. **Careers:** "Application deadline: May 1" has no year.

## Project layout

```
src/
  meta.js            one entry per URL: title, description, schema types
  routes.jsx         URL → page component (each page group is its own JS chunk)
  data/              business facts (site.js), fares, tours, reviews, FAQs, areas, legal text
  components/        layout, UI kit, booking + other forms
  pages/             page components
  lib/seo.js         <head> tags + JSON-LD
  lib/forms.js       Netlify Forms registry (every field must be listed here)
scripts/             prerender, SEO check, local preview server, image optimizer
netlify/functions/   fare-estimate, submission-created
public/images/       optimized AVIF/WebP images (generated by `npm run images` from assets-src/,
                     the 14 MB of originals are kept out of git)
```

Business facts (name, phones, address, hours) live only in `src/data/site.js`, so you change them in one place.
