# Business Layer

## Final Routes Added

- `/services`
- `/products`
- `/contact` expanded
- `/subscribe`
- `/api/subscribe`

## Indexability Decisions

- `/services` -> indexable and included in sitemap
- `/products` -> indexable and included in sitemap
- `/contact` -> indexable and included in sitemap
- `/subscribe` -> `noindex, follow` and excluded from sitemap

## Subscriber Storage

- The owned subscribe flow writes to `SUBSCRIBERS_FILE`.
- Recommended production value: `/home/bot/blixamo-data/subscribers.jsonl`
- Storage is intentionally outside the git-tracked repo.
- The API validates email format, dedupes exact emails, and only returns success after a real write or a duplicate check.
- Existing newsletter surfaces now respect real API success and failure instead of assuming success.

## Environment Variable

- `SUBSCRIBERS_FILE=/home/bot/blixamo-data/subscribers.jsonl`

## Backup Note

- Back up the subscriber file with the rest of the VPS application data.
- Do not keep subscriber data in the repository worktree.
- The parent directory must stay writable by the app process.

## Proof Assets Still Needed Later

- Real project screenshots or deliverable previews for `/services`
- Real sample pack previews or redacted outputs for `/products`
- Future optional service artifacts that show before and after implementation states
- Any future product proof should stay real and request-based, not fake storefront polish

## Follow-Up Recommendations

1. Verify `SUBSCRIBERS_FILE` exists and is writable on production before using `/subscribe` publicly.
2. Add real proof assets to `/services` and `/products` only when they exist.
3. Keep the homepage and about page editorial-first even with the new business links.
4. Finish the final AdSense cleanup pass before applying.
