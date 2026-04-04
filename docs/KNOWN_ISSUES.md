# KNOWN_ISSUES.md - Bugs, Risks and Technical Debt

> Last audited: 2026-03-26
> Do not fix these without reading this doc first. Some fixes can break SEO.

---

## High Risk - Fix Carefully

### 1. Category mismatch in older posts
- Problem: some older posts may still use non-canonical category values in frontmatter.
- Effect: routing and category clustering can drift from the 9-category system.
- Risk: weak category consistency and possible archive confusion.
- Fix: audit frontmatter values and migrate to canonical slugs only.
- Status: Open.

### 2. Comparison schema type not in the TypeScript union
- Problem: some posts use `schema: comparison` while the Post interface only supports `article | howto | faq | review`.
- Effect: those pages fall back to Article JSON-LD.
- Risk: comparison pages miss specialized structured data.
- Fix: either support `comparison` in the interface and JSON-LD layer or normalize those posts to `article`.
- Status: Open.

---

## Medium Risk - Monitor

### 3. No in-memory cache on `getAllPosts()`
- Problem: `lib/posts.ts` reads all MDX files from disk for each server-side call.
- Effect: performance cost grows with post volume.
- Risk: slower response times as the site grows.
- Fix: add a safe metadata cache with revalidation when scale requires it.
- Status: Monitor.

### 4. Mixed featured image paths
- Problem: older posts and newer posts use slightly different image path conventions.
- Effect: both work, but the content model is inconsistent.
- Risk: low, mostly maintenance overhead.
- Fix: standardize new content on `/images/posts/[slug]/featured.jpg` or `/og.jpg` without renaming live assets casually.
- Status: Low priority.

### 5. Too many posts with `featured: true`
- Problem: multiple posts are marked featured.
- Effect: homepage and curation semantics drift.
- Risk: older pages can keep surfacing too aggressively.
- Fix: keep the featured set intentionally small.
- Status: Low priority.

---

## Low Risk - Tech Debt

### 6. Root clutter files
- Problem: backup and session files still exist in the repository root.
- Effect: no runtime issue, but repo hygiene is worse.
- Fix: archive or remove when convenient.
- Status: Cleanup later.

### 7. `tools/` and `scripts/` are separate Node projects
- Problem: these directories are not part of the main Next.js app dependency flow.
- Effect: they need separate install steps when used.
- Risk: low.
- Status: Known and acceptable.

### 8. `nginx.conf` in repo is reference-only
- Problem: editing the repo copy does not change the live server automatically.
- Effect: repo config can drift from VPS config.
- Risk: operational confusion.
- Status: Acceptable with documentation.

---

## Resolved Issues

### 1. Duplicate robots definitions
- Previous problem: both `app/robots.ts` and `public/robots.txt` existed.
- Resolution: `public/robots.txt` was removed. `app/robots.ts` is now the only robots source.
- Status: Resolved on 2026-03-26.

### 2. Search route indexing leak
- Previous problem: `/search` was crawlable and indexable.
- Resolution: `/search` now uses route metadata `noindex, follow`, and `robots.txt` disallows `/search`.
- Status: Resolved on 2026-03-26.
