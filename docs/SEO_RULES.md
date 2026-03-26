# SEO_RULES.md - SEO Rules for Blixamo

> Last audited: 2026-03-26
> These rules apply to all pages. Do not change SEO logic without updating this doc.

---

## Title Rules

Template (set in `app/layout.tsx`):
- default: `Blixamo - Tech, Tips & Trends`
- per-page: `%s | Blixamo`

Post title rules (from `ARTICLE_RULES.md`):
- 50-60 characters including the `| Blixamo` suffix
- must contain the primary keyword
- no clickbait
- do not add `India` unless the post is exclusively India-specific

---

## Meta Description Rules

- 150-160 characters
- must contain the primary keyword when practical
- must be unique per post
- must describe the real content, not generic filler
- set in frontmatter `description`

---

## Canonical Rules

- Canonicals are based on `SITE_URL + path`
- `SITE_URL = https://blixamo.com` in `lib/site.ts`
- Override only for syndicated content using frontmatter `canonical`
- Never point canonical to a non-live or wrong URL
- Post canonical format: `https://blixamo.com/blog/[slug]`

---

## Robots Rules

Default:
- root metadata is `index, follow`
- post-level `frontmatter noindex: true` still works for specific articles

Route-level noindex rules:
- `/search` -> `noindex, follow`
- `/author/*` -> `noindex, follow`
- `/contact` -> `noindex, follow`
- `/privacy-policy` -> `noindex, follow`
- `/terms` -> `noindex, follow`
- `/disclaimer` -> `noindex, follow`
- `/blog/page/*` -> `noindex, follow`
- `/tag/deployment` -> stays `index, follow`
- all other `/tag/*` pages -> `noindex, follow`

Robots file:
- `app/robots.ts` is the only source for `/robots.txt`
- it disallows `/api/`, `/_next/`, and `/search`
- sitemap declared in robots: `https://blixamo.com/sitemap.xml`

---

## OpenGraph Rules

Defaults in `app/layout.tsx`:
- `siteName = Blixamo`
- `type = website`
- `locale = en_US`

Per-post OG in `app/blog/[slug]/page.tsx`:
- `og:title = post.title`
- `og:description = post.description`
- `og:image = post.featuredImage` as an absolute URL
- `og:type = article`

OG image guidance:
- preferred size: `1200x630`
- format: JPG or PNG
- common path: `/images/posts/[slug]/featured.jpg` or `/images/posts/[slug]/og.jpg`
- fallback: `/images/default-og.jpg`

---

## Twitter Card Rules

Set in `app/layout.tsx`:
- `twitter:card = summary_large_image`
- `twitter:site = @blixamo`

Per-post Twitter data inherits from OG settings.

---

## JSON-LD Structured Data

Component: `components/seo/JsonLd.tsx`
Rendered on: `/blog/[slug]`

Generated types depend on frontmatter `schema`:
- `article`
- `howto`
- `faq`
- `review`

Additional structured data:
- `BreadcrumbList` on all post pages
- `WebSite` on homepage with search action

---

## Sitemap SEO Rules

`/sitemap.xml` is generated at build time by `app/sitemap.ts`.

Included:
- `/`
- `/about`
- `/tag/deployment`
- `/category/[slug]`
- `/blog/[slug]`

Excluded:
- `/blog`
- `/search`
- `/author/*`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/disclaimer`
- `/blog/page/*`
- all `/tag/*` except `/tag/deployment`

Priority targets:
- homepage: `1.0`
- resources hub: `0.9`
- category pages: `0.7`
- regular posts: `0.7`
- featured posts: `0.9`

`lastmod` rules:
- posts use `updatedAt` or `date`
- homepage/category/resources hub inherit freshness from the newest relevant post
- static pages use a fixed document date until edited

---

## Internal Linking Rules

Every article should reinforce the site architecture:
- homepage -> resources hub -> category -> article
- articles should also link laterally to related posts

Minimum article structure for linking:
- link to the Resources Hub when relevant
- link to the primary category page
- link to at least 2 related articles
- link to homepage when useful
- link to comparison/tools pages when relevant

Tag chips on article pages should not be a crawl-priority navigation surface.

---

## Category SEO Rules

Each category page at `/category/[slug]` should have:
- unique title and description from `CATEGORY_META`
- a short intro
- links back to the Resources Hub
- links to important posts in the category
- links to related categories when useful

Category pages stay indexed and remain in sitemap.

---

## GSC Rules

For normal deploys with no new article and no major URL/content launch:
- do not run manual indexing
- do not resubmit the sitemap repeatedly

For a new article:
1. verify deploy succeeded
2. verify production URL returns `200`
3. verify the URL is in `/sitemap.xml`
4. request indexing only for that article if needed

Use only the VPS GSC workflow:
- `node /var/www/gsc-tool/gsc.js ...`
