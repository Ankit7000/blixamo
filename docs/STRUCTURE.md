# STRUCTURE.md - Blixamo Repository Architecture

> Production site: https://blixamo.com
> VPS: root@204.168.203.255 -> /var/www/blixamo
> Last audited: 2026-03-29
> Do not rename directories, move key files, or add routes without updating this doc.

---

## Core App Structure

- `app/layout.tsx`
  Root layout and default metadata. Treat as global SEO surface.
- `app/page.tsx`
  Homepage.
- `app/sitemap.ts`
  Generates `/sitemap.xml`.
- `app/robots.ts`
  Generates `/robots.txt`.
- `app/about/page.tsx`
  About page.
- `app/community/page.tsx`
  Community hub page.
- `app/ai-for-developers/page.tsx`
  AI for Developers mini hub page.
- `app/dev-tools-watch/page.tsx`
  Dev Tools Watch mini hub page.
- `app/infrastructure-watch/page.tsx`
  Infrastructure Watch mini hub page.
- `app/nextjs-mdx-hub/page.tsx`
  Next.js MDX mini hub page.
- `app/coolify-hub/page.tsx`
  Coolify mini hub page.
- `app/hetzner-billing-hub/page.tsx`
  Hetzner Billing mini hub page.
- `app/n8n-automation-hub/page.tsx`
  n8n Automation mini hub page.
- `app/contact/page.tsx`
  Contact page.
- `app/privacy-policy/page.tsx`
  Privacy Policy page.
- `app/terms/page.tsx`
  Terms page.
- `app/disclaimer/page.tsx`
  Disclaimer page.
- `app/blog/page.tsx`
  Blog archive page 1.
- `app/blog/page/[page]/page.tsx`
  Paginated blog archive pages. These remain `noindex`.
- `app/blog/[slug]/page.tsx`
  Individual article pages.
- `app/category/[slug]/page.tsx`
  Category cluster pages.
- `app/tag/[tag]/page.tsx`
  Tag pages. `/tag/deployment` is the Resources Hub. Other tag pages are low-priority archives.
- `app/guides/[slug]/page.tsx`
  Pillar guide pages. These sit between categories and articles as topic-cluster hubs.
- `app/author/[author]/page.tsx`
  Author archive pages.
- `app/search/page.tsx`
  Server wrapper for search metadata and robots handling.
- `app/feed.xml/route.ts`
  RSS route.
- `app/api/posts/route.ts`
  Search/post metadata endpoint.
- `app/api/revalidate/route.ts`
  Secret-protected revalidation endpoint.

---

## Component Structure

- `components/blog/*`
  Post UI such as header, footer, related posts, TOC, and MDX visuals.
- `components/layout/*`
  Header and footer.
- `components/monetization/*`
  Newsletter and monetization UI.
- `components/search/SearchPageClient.tsx`
  Client-side search UI used by `app/search/page.tsx`.
- `components/seo/*`
  Analytics, JSON-LD, and web-vitals helpers.

---

## Content and Data Layer

- `content/posts/*.mdx`
  Source of truth for article content. Filename = URL slug. Never rename after publish.
- `lib/categories.ts`
  Canonical 9-category registry.
- `lib/posts.ts`
  Post parsing, category extraction, related-post selection, and freshness helpers.
- `lib/resources.ts`
  Shared homepage/resources-hub curation, related categories, and hub constants.
- `lib/site.ts`
  Site URL and absolute URL helpers.

---

## Public Assets

- `public/ads.txt`
  AdSense publisher declaration.
- `public/images/`
  Logos, author images, per-post images, and shared resource images.

Note:
- `public/robots.txt` was removed.
- `app/robots.ts` is now the only robots source.

---

## Routing Summary

| URL Pattern | Source File | Render Type |
|-------------|-------------|-------------|
| `/` | `app/page.tsx` | SSG |
| `/about` | `app/about/page.tsx` | SSG |
| `/community` | `app/community/page.tsx` | SSG |
| `/ai-for-developers` | `app/ai-for-developers/page.tsx` | SSG |
| `/dev-tools-watch` | `app/dev-tools-watch/page.tsx` | SSG |
| `/infrastructure-watch` | `app/infrastructure-watch/page.tsx` | SSG |
| `/nextjs-mdx-hub` | `app/nextjs-mdx-hub/page.tsx` | SSG |
| `/coolify-hub` | `app/coolify-hub/page.tsx` | SSG |
| `/hetzner-billing-hub` | `app/hetzner-billing-hub/page.tsx` | SSG |
| `/n8n-automation-hub` | `app/n8n-automation-hub/page.tsx` | SSG |
| `/contact` | `app/contact/page.tsx` | SSG |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | SSG |
| `/terms` | `app/terms/page.tsx` | SSG |
| `/disclaimer` | `app/disclaimer/page.tsx` | SSG |
| `/blog` | `app/blog/page.tsx` | SSG |
| `/blog/page/[page]` | `app/blog/page/[page]/page.tsx` | SSG |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | SSG via `generateStaticParams` |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | SSG via `generateStaticParams` |
| `/tag/[tag]` | `app/tag/[tag]/page.tsx` | SSG via `generateStaticParams` |
| `/guides/[slug]` | `app/guides/[slug]/page.tsx` | SSG via `generateStaticParams` |
| `/author/[author]` | `app/author/[author]/page.tsx` | SSG via `generateStaticParams` |
| `/search` | `app/search/page.tsx` | server wrapper + client UI |
| `/feed.xml` | `app/feed.xml/route.ts` | Route Handler |
| `/sitemap.xml` | `app/sitemap.ts` | build-time generated |
| `/robots.txt` | `app/robots.ts` | build-time generated |
| `/ads.txt` | `public/ads.txt` | static file |

---

## SEO Architecture

Primary crawl path:
- Homepage
- Resources Hub: `/tag/deployment`
- Category pages: `/category/[slug]`
- Pillar guide pages: `/guides/[slug]`
- AI mini hub: `/ai-for-developers`
- Dev Tools mini hub: `/dev-tools-watch`
- Infrastructure mini hub: `/infrastructure-watch`
- Next.js MDX mini hub: `/nextjs-mdx-hub`
- Coolify mini hub: `/coolify-hub`
- Hetzner Billing mini hub: `/hetzner-billing-hub`
- n8n Automation mini hub: `/n8n-automation-hub`
- Article pages: `/blog/[slug]`
- Community hub: `/community`

Indexing intent:
- Keep indexed: homepage, resources hub, categories, pillar guides, articles, about page, and community hub
- Keep accessible but low priority: AI mini hub, Dev Tools mini hub, Infrastructure mini hub, Next.js MDX mini hub, Coolify mini hub, Hetzner Billing mini hub, n8n Automation mini hub, other tag pages, author pages, search, legal pages, and pagination
- Use `noindex, follow` on low-value archive/utility routes rather than removing routes

---

## Sensitive Files

- `lib/categories.ts`
  Changing a slug breaks live URLs.
- `lib/posts.ts`
  The Post interface and category/related logic affect multiple pages.
- `lib/site.ts`
  Controls canonical and OG absolute URLs.
- `app/sitemap.ts`
  Controls sitemap contents and crawl focus.
- `app/layout.tsx`
  Controls global metadata and shared layout.
- `next.config.js`
  Controls redirects.
- `content/posts/*.mdx`
  Filenames are the canonical slugs.

---

## Data Flow

`content/posts/*.mdx`
-> parsed by `lib/posts.ts`
-> used by homepage, resources hub, categories, articles, API, and sitemap

`lib/resources.ts`
-> drives homepage and `/tag/deployment` curation
-> provides resource hub constants and related-category links

Important note:
- `getAllCategories()` only returns categories used by current posts.
- If no post uses a category, that category route is not pre-rendered.
