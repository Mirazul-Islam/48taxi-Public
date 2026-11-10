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

- **Existing URLs kept exactly** (`/book-now/`, `/schedule/`, `/gti/`, `/tour/`, …), so rankings and backlinks carry over.
- **Retired services:** Park & Fly, truck/container parking, and car lockout & battery boost were removed. `/parkfly/` 301-redirects to `/halifax-airport-taxi/`, `/truck-container-parking/` and `/slim-jim/` to `/`; the build fails if those redirects are ever removed.
- **11 new keyword pages:** `/halifax-airport-taxi/`, `/halifax-limo-service/`, `/airport-shuttle-halifax/`, `/service-areas/` (+ Dartmouth, Bedford, Truro, Wolfville), `/tour/peggys-cove/`, `/corporate-hotel-transportation/`, `/faq/`.
- **One clean set of SEO tags per page** (the old site printed two of everything): title, description, canonical, robots, Open Graph, plus JSON-LD for `LocalBusiness`, `WebSite`, `WebPage`, `BreadcrumbList`, `TaxiService` and `FAQPage`.
- `sitemap.xml`, `robots.txt` and a `noindex` 404 page are generated at build time.
- 301 redirects in `netlify.toml` for WordPress leftovers (`/feed/`, `/wp-content/…`, old fare PDFs, `/sitemap.rss`, …) and friendly aliases (`/prices/`, `/tours/`, `/park-and-fly/` …).
- **Forms** (booking, contact, affiliate) are stored by Netlify Forms, with a honeypot to filter spam.
- **Functions:**
  - `fare-estimate` gets the driving distance from the Google Routes API when a key is set. Without a key, riders can type the distance in the estimator, and the booking form shows a "from" price that the team confirms.
  - `submission-created` can email each form submission through Resend.

## Homepage door scene (scroll animation)

Right under the hero, the homepage has a pinned, scroll-scrubbed scene (`src/components/DoorScene.jsx`):
as you scroll, the camera moves in on the chauffeur's hand, the door swings open towards you with warm
light coming out of the cabin, the camera flies through the door, and the "Step in" booking call to action appears.

It works today with the existing photo (the door panel is cut out and rotated in 3D, with no extra downloads).
To swap in a cinematic AI video, Apple-style:

1. Generate a 5–8 second clip in Sora, Higgsfield, Kling, Runway or Veo. Landscape 16:9, 1080p or larger. A prompt that works well:
   > Slow cinematic dolly-in, low angle, on a glossy black luxury sedan parked at night on a wet Halifax street.
   > A chauffeur in a dark suit and white gloves reaches for the rear door handle and slowly opens the door
   > towards the camera, revealing a warm amber-lit leather interior. The camera keeps moving forward into
   > the open door. Rain drops on the paint, shallow depth of field, moody espresso-brown and amber colour grade,
   > no text, no logos, steady camera, 24 fps.
2. Install ffmpeg once (`brew install ffmpeg` on macOS, `winget install ffmpeg` on Windows).
3. Run the converter, then check it with `npm run dev`:

```bash
npm run frames -- path/to/clip.mp4 --frames 120 --focus 0.6
```

   `--focus` is the horizontal point (0 to 1) kept in view on phones; point it at the door handle.
   This writes WebP frames to `public/sequence/door/` (desktop and mobile sets) and `src/data/door-sequence.json`.
   Commit both. Frames only download when a visitor gets near the scene.
4. To go back to the built-in 3D door: `npm run frames -- --clear`.

Visitors with "reduce motion" turned on see a still photo with the call to action instead.

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
   | `GOOGLE_MAPS_API_KEY` | **Needed for automatic prices.** Measures the driving distance so the booking form and estimator show the exact fare. Enable the Routes API, and restrict the key to that API. |
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
4. **Pricing** follows the November 2026 pricing guide and lives in one file, `src/lib/pricing.js`: the higher of $48 or $2/km plus the vehicle surcharge, extras, and waiting time. The old flat fare tables (by area, by zone, and long distance) were removed. Not covered by the guide, so kept as they were: hourly rates ($70 sedan / $95 SUV), the 15% minimum gratuity on prepaid and billed trips, and the 20% group discount outside HRM. Taxes aren't mentioned in the guide, so the site doesn't say whether HST is included.
5. **Per-person fares ($20 / $30 / $60, cash):** the homepage didn't say what they apply to. They're shown here as airport per-person fares.
6. **Charging extras after the ride (Stripe)** from the pricing guide isn't built yet. Until it is, the booking form's consent says waiting time and extras are "added to my fare"; switch to the guide's "charged to my card on file" wording once cards are saved at booking.
7. **Hotel list** on the homepage and Corporate page: confirm each is a current partner.
8. **Refund policy contact** lists `48taxii@gmail.com`; everywhere else uses `info@48taxi.co`.
9. **Address:** the footer and schema still use 344 Sackville Drive (the former Park & Fly yard). Confirm the business address to show now that Park & Fly is gone.
10. **Privacy policy** still has a section on the Park & Fly lot cameras; remove it if the lot is no longer used.
11. **Fleet photos:** seating now follows the pricing guide (confirm against each vehicle's actual setup); real fleet photos are still needed.
12. **Careers:** "Application deadline: May 1" has no year.

## Project layout

```
src/
  meta.js            one entry per URL: title, description, schema types
  routes.jsx         URL → page component (each page group is its own JS chunk)
  lib/pricing.js     ALL prices: fare formula, vehicle surcharges, extras, waiting time
  data/              business facts (site.js), tours, reviews, FAQs, areas, legal text
  components/        layout, UI kit, booking + other forms
  pages/             page components
  lib/seo.js         <head> tags + JSON-LD
  lib/forms.js       Netlify Forms registry (every field must be listed here)
scripts/             prerender, SEO check, local preview server, image optimizer, video → frames
netlify/functions/   fare-estimate, submission-created
public/images/       optimized AVIF/WebP images (generated by `npm run images` from assets-src/,
                     the 14 MB of originals are kept out of git)
```

Business facts (name, phones, address, hours) live only in `src/data/site.js`, so you change them in one place.
