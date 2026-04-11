# Business Layer Live Diagnosis

## Expected changes

- `/services` should exist and be live
- `/products` should exist and be live
- `/contact` should use the expanded business-layer version
- `/subscribe` should exist, stay live, and remain `noindex, follow`
- `/sitemap.xml` should include `/services`, `/products`, and `/contact`
- `/sitemap.xml` should exclude `/subscribe`

## Repo findings

- `app/services/page.tsx` is present locally and contains the business-layer services page.
- `app/products/page.tsx` is present locally and contains the business-layer products page.
- `app/contact/page.tsx` is present locally and contains the expanded contact page.
- `app/subscribe/page.tsx` is present locally and contains the owned subscribe page with route-level `robots: { index: false, follow: true }`.
- `app/api/subscribe/route.ts` is present locally and implements file-backed subscriber capture with validation, dedupe, and honest failure handling.
- `components/layout/Footer.tsx`, `app/page.tsx`, and `app/about/page.tsx` all contain business-layer links in the local working tree.
- These business-layer files were not present in the committed `HEAD` revision:
  - `app/services/page.tsx`
  - `app/products/page.tsx`
  - `app/subscribe/page.tsx`
- The committed `HEAD` revision still contained the older thin `/contact` page and the older footer/business navigation state.

## Sitemap findings

- `app/sitemap.ts` simply returns `buildSitemapEntries()` from `lib/sitemap.ts`.
- Local `lib/sitemap.ts` includes:
  - `/services`
  - `/products`
  - `/contact`
- Local `lib/sitemap.ts` excludes:
  - `/subscribe`
- Local sitemap validation passed with:
  - `https://blixamo.com/services`
  - `https://blixamo.com/products`
  - `https://blixamo.com/contact`
  - no `https://blixamo.com/subscribe`
- The deployed `HEAD` revision still used the older sitemap allowlist and did not include the new business-layer routes.

## Link findings

- Local homepage links to `/services`, `/products`, and `/subscribe`.
- Local about page links to `/services`, `/products`, and `/contact`.
- Local footer links to `/services`, `/products`, `/contact`, and `/subscribe`.
- Local contact page links to `/services`, `/products`, and `/subscribe`.
- The older deployed revision still exposed the older footer and older contact page.

## Build findings

- `npm.cmd run build` passed outside the sandbox.
- The local production build generated these routes:
  - `/services`
  - `/products`
  - `/contact`
  - `/subscribe`
  - `/api/subscribe`
  - `/sitemap.xml`
- `npm.cmd run sitemap:check -- --list` passed locally.
- Local sitemap output includes `/services`, `/products`, and `/contact`, and excludes `/subscribe`.

## Deploy/live findings

- Live checks before the fix showed:
  - `/services` -> `404`
  - `/products` -> `404`
  - `/contact` -> `200` but still the old thin contact page
  - `/subscribe` -> `404`
- Live sitemap before the fix showed:
  - `/services` not present
  - `/products` not present
  - `/contact` not present
  - `/subscribe` not present
- Direct SSH check against the current server at `204.168.203.255` showed the deployed app was still on commit:
  - `a848d6e18448c1b43b3f4ad22aee8d0547f95240`
- That same deployed commit matched local `HEAD`, which confirms the business-layer work existed only in the local working tree and had not been committed and deployed yet.
- A separate local `ssh blixamo` alias was still pointing at the old server and produced a host-key mismatch. That was an environment-side operational mismatch, not the source of the website code behavior.

## Exact root cause

- The business-layer code existed locally but had not been landed into the committed revision that production was running.
- Because production was still running the older commit, the live site naturally showed:
  - no `/services`
  - no `/products`
  - no `/subscribe`
  - the old `/contact`
  - the old sitemap output
- This was not caused by broken route code or broken sitemap generation in the current working tree.

## Exact fix applied

- Built and verified the local business-layer implementation.
- Committed the business-layer route, sitemap, navigation, subscribe-flow, and documentation files.
- Pushed commit `0fcc547` to `origin/master`.
- Deployed the updated revision to the current server with `bash /var/www/blixamo/build.sh`.

## Final verification status

- Post-deploy public verification passed:
  - `/services` -> `200`
  - `/products` -> `200`
  - `/contact` -> `200` with the expanded contact copy live
  - `/subscribe` -> `200`
  - `/subscribe` HTML includes `noindex`
  - `/sitemap.xml` -> `200`
- Post-deploy sitemap verification passed:
  - `/services` present
  - `/products` present
  - `/contact` present
  - `/subscribe` excluded
- Homepage and about page now expose the business-layer links publicly.
- Footer and contact-route business links are present in the deployed HTML.
- Final status: fixed and live.
