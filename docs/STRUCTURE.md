# STRUCTURE.md â€” Blixamo Repository Architecture

> Production site: https://blixamo.com
> VPS: root@77.42.17.13 â€” /var/www/blixamo
> Last audited: 2026-03-25
> Do NOT rename directories, move key files, or add routes without updating this doc.

---

## Full Folder Structure

```
blixamo/
â”œâ”€â”€ AGENTS.md                          # AI agent rules â€” read before any task
â”œâ”€â”€ docs/                              # Documentation (this folder)
â”‚   â”œâ”€â”€ STRUCTURE.md                   # This file
â”‚   â”œâ”€â”€ SITEMAP.md                     # All routes, slugs, redirects
â”‚   â”œâ”€â”€ CONTENT_MODEL.md               # Frontmatter schema, Post interface
â”‚   â”œâ”€â”€ SEO_RULES.md                   # Title, canonical, JSON-LD, OG rules
â”‚   â”œâ”€â”€ DEPLOY.md                      # VPS, SSH, PM2, deploy steps
â”‚   â”œâ”€â”€ KNOWN_ISSUES.md                # Bugs, risks, tech debt
â”‚   â””â”€â”€ ARTICLE_RULES.md              # 40 writing rules
â”‚
â”œâ”€â”€ app/                               # Next.js 15 App Router
â”‚   â”œâ”€â”€ layout.tsx                     # Root layout: Inter font, Header, Footer, Analytics, Clarity
â”‚   â”œâ”€â”€ page.tsx                       # Homepage â€” hero, categories, latest posts
â”‚   â”œâ”€â”€ not-found.tsx                  # Global 404 page
â”‚   â”œâ”€â”€ robots.ts                      # Generates /robots.txt
â”‚   â”œâ”€â”€ sitemap.ts                     # Generates /sitemap.xml at build time
â”‚   â”œâ”€â”€ head.tsx                       # Extra <head> tags
â”‚   â”œâ”€â”€ about/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /about â€” static author page
â”‚   â”œâ”€â”€ contact/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /contact â€” static contact page
â”‚   â”œâ”€â”€ privacy-policy/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /privacy-policy â€” static legal page
â”‚   â”œâ”€â”€ terms/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /terms â€” static legal page
â”‚   â”œâ”€â”€ disclaimer/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /disclaimer â€” static legal page
â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”œâ”€â”€ page.tsx                   # /blog â€” post index (page 1 only, pagination broken)
â”‚   â”‚   â”œâ”€â”€ page/                      # Directory exists but no [page] route â€” pagination broken
â”‚   â”‚   â””â”€â”€ [slug]/
â”‚   â”‚       â””â”€â”€ page.tsx               # /blog/[slug] â€” SSG post page
â”‚   â”œâ”€â”€ category/
â”‚   â”‚   â””â”€â”€ [slug]/
â”‚   â”‚       â””â”€â”€ page.tsx               # /category/[slug] â€” SSG
â”‚   â”œâ”€â”€ tag/
â”‚   â”‚   â””â”€â”€ [tag]/
â”‚   â”‚       â””â”€â”€ page.tsx               # /tag/[tag] â€” SSG
â”‚   â”œâ”€â”€ author/
â”‚   â”‚   â””â”€â”€ [author]/
â”‚   â”‚       â””â”€â”€ page.tsx               # /author/[author] â€” SSG
â”‚   â”œâ”€â”€ search/
â”‚   â”‚   â””â”€â”€ page.tsx                   # /search â€” client-side, fetches /api/posts
â”‚   â”œâ”€â”€ feed.xml/                      # /feed.xml â€” RSS 2.0 (last 20 posts)
â”‚   â””â”€â”€ api/
â”‚       â”œâ”€â”€ posts/                     # GET /api/posts â€” all post metadata JSON
â”‚       â”œâ”€â”€ subscribe/                 # POST /api/subscribe â€” newsletter
â”‚       â””â”€â”€ revalidate/
â”‚           â””â”€â”€ route.ts               # POST|GET /api/revalidate â€” ISR (secret-protected)
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”œâ”€â”€ AuthorBio.tsx              # Author bio block
â”‚   â”‚   â”œâ”€â”€ Callout.tsx                # MDX <Callout type="info|warning|error|danger|success|tip">
???   ???   ????????? MdxVisuals.tsx             # MDX image/table wrappers + VisualBlock, ProsCons, VerdictBox
â”‚   â”‚   â”œâ”€â”€ PostCard.tsx               # Article card used in all grids
â”‚   â”‚   â”œâ”€â”€ PostFooter.tsx             # Prev/next navigation below article
â”‚   â”‚   â”œâ”€â”€ PostHeader.tsx             # Title, meta, category badge, reading time
â”‚   â”‚   â”œâ”€â”€ ReadingProgress.tsx        # Fixed top progress bar
â”‚   â”‚   â”œâ”€â”€ RelatedPosts.tsx           # Related articles section
â”‚   â”‚   â”œâ”€â”€ ShareButtons.tsx           # Social share buttons
â”‚   â”‚   â”œâ”€â”€ StickyShare.tsx            # Sticky share sidebar (desktop)
â”‚   â”‚   â””â”€â”€ TableOfContents.tsx        # Sticky right TOC (desktop only)
â”‚   â”œâ”€â”€ layout/
â”‚   â”‚   â”œâ”€â”€ Header.tsx                 # Sticky nav, dark mode toggle, mobile menu
â”‚   â”‚   â””â”€â”€ Footer.tsx                 # 3-col footer: logo, categories, links
â”‚   â”œâ”€â”€ monetization/
â”‚   â”‚   â”œâ”€â”€ AdSlot.tsx                 # Google AdSense slot wrapper
â”‚   â”‚   â”œâ”€â”€ AffiliateBox.tsx           # Affiliate product box
â”‚   â”‚   â”œâ”€â”€ AffiliateDisclosure.tsx    # FTC disclosure banner
â”‚   â”‚   â”œâ”€â”€ AffiliateLink.tsx          # Styled affiliate link
â”‚   â”‚   â”œâ”€â”€ EmailCapture.tsx           # Newsletter signup form
â”‚   â”‚   â””â”€â”€ ProductCTA.tsx             # Product recommendation CTA
â”‚   â”œâ”€â”€ seo/
â”‚   â”‚   â”œâ”€â”€ Analytics.tsx              # GA4 script injection
â”‚   â”‚   â”œâ”€â”€ JsonLd.tsx                 # JSON-LD: Article, HowTo, FAQ, WebSite, BreadcrumbList
â”‚   â”‚   â””â”€â”€ WebVitals.tsx              # Core Web Vitals reporting
â”‚   â”œâ”€â”€ shared/
â”‚   â”‚   â””â”€â”€ AuthorImage.tsx            # Author avatar/photo
â”‚   â””â”€â”€ ui/
â”‚       â”œâ”€â”€ Badge.tsx                  # Category/tag badge
â”‚       â”œâ”€â”€ Button.tsx                 # Reusable button
â”‚       â”œâ”€â”€ ChatbotWidget.tsx          # Chatbot UI widget
â”‚       â”œâ”€â”€ MobileTOC.tsx              # Mobile table of contents
â”‚       â”œâ”€â”€ Newsletter.tsx             # Newsletter signup UI
â”‚       â”œâ”€â”€ Pagination.tsx             # Prev/next pagination
â”‚       â””â”€â”€ ScrollToTop.tsx            # Scroll-to-top button
â”‚
â”œâ”€â”€ content/
â”‚   â””â”€â”€ posts/                         # 44 MDX files. Filename = URL slug. NEVER rename after publish.
â”‚       â””â”€â”€ *.mdx
â”‚
â”œâ”€â”€ lib/                               # Core data layer â€” no React, no UI
â”‚   â”œâ”€â”€ categories.ts                  # 9-category registry â€” SINGLE SOURCE OF TRUTH for slugs
â”‚   â”œâ”€â”€ posts.ts                       # getAllPosts, getPostBySlug, etc. No in-memory cache.
â”‚   â”œâ”€â”€ site.ts                        # SITE_URL, SITE_NAME, SITE_TWITTER, absoluteUrl()
â”‚   â””â”€â”€ utils.ts                       # truncate, slugify, formatDate, readingTime, groupByCategory
â”‚
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ ads.txt                        # /ads.txt â€” AdSense publisher declaration
â”‚   â”œâ”€â”€ robots.txt                     # âš ï¸ STATIC robots file â€” conflicts with app/robots.ts
â”‚   â””â”€â”€ images/
â”‚       â”œâ”€â”€ logo.svg
â”‚       â”œâ”€â”€ default-og.jpg             # Fallback OG image for posts without featuredImage
â”‚       â”œâ”€â”€ author-avatar.jpg
â”‚       â”œâ”€â”€ author-photo.jpg
â”‚       â””â”€â”€ posts/
â”‚           â””â”€â”€ [slug]/                # Per-post images
â”‚               â”œâ”€â”€ featured.png       # Featured image (Ideogram v2, 16:9, dark)
â”‚               â””â”€â”€ og.jpg             # OG image (1200x630)
â”‚
â”œâ”€â”€ scripts/                           # Utility scripts (not part of Next.js app)
â”‚   â”œâ”€â”€ build.js                       # Custom build script (npm run build calls this)
â”‚   â””â”€â”€ process_og_images.py           # OG image processing
â”‚
â”œâ”€â”€ styles/
â”‚   â””â”€â”€ globals.css                    # Single CSS file: variables, reset, prose, dark mode, responsive
â”‚
â”œâ”€â”€ tools/                             # JS automation tools (not part of Next.js app)
â”‚   â”œâ”€â”€ blixamo-seo-engine.js          # SEO analysis
â”‚   â”œâ”€â”€ blixamo-supervisor.js          # Build supervisor
â”‚   â”œâ”€â”€ blixamo-checker.js             # Content checker
â”‚   â”œâ”€â”€ blixamo-ai-fixer.js            # Article quality fixer
â”‚   â”œâ”€â”€ blixamo-next-article.js        # Next article planner
â”‚   â”œâ”€â”€ blixamo-title-engine.js        # Title generator
â”‚   â””â”€â”€ generate-og-images.js          # OG image generation
â”‚
â”œâ”€â”€ mdx-components.tsx                 # Global MDX component registry (Callout registered here)
â”œâ”€â”€ next.config.js                     # Redirects, headers, image config, @ alias
â”œâ”€â”€ tailwind.config.js                 # dark mode via [data-theme="dark"], accent #6c63ff
â”œâ”€â”€ ecosystem.config.js                # PM2 cluster config, memory limits, log paths
â”œâ”€â”€ nginx.conf                         # Reference Nginx config (NOT auto-applied to server)
â”œâ”€â”€ deploy.sh                          # Fresh deploy script (rsync + npm install + build + pm2)
â”œâ”€â”€ package.json                       # npm scripts: dev, build, start, lint
â”œâ”€â”€ tsconfig.json                      # TypeScript config
â””â”€â”€ .env.example                       # Environment variable template
```

---

## Routing Table

| URL Pattern | Source File | Render Type |
|-------------|-------------|-------------|
| `/` | app/page.tsx | SSG |
| `/about` | app/about/page.tsx | SSG |
| `/contact` | app/contact/page.tsx | SSG |
| `/privacy-policy` | app/privacy-policy/page.tsx | SSG |
| `/terms` | app/terms/page.tsx | SSG |
| `/disclaimer` | app/disclaimer/page.tsx | SSG |
| `/blog` | app/blog/page.tsx | SSG (page 1 only) |
| `/blog/[slug]` | app/blog/[slug]/page.tsx | SSG via generateStaticParams |
| `/category/[slug]` | app/category/[slug]/page.tsx | SSG via generateStaticParams |
| `/tag/[tag]` | app/tag/[tag]/page.tsx | SSG via generateStaticParams |
| `/author/[author]` | app/author/[author]/page.tsx | SSG via generateStaticParams |
| `/search` | app/search/page.tsx | Client-side only |
| `/api/posts` | app/api/posts/ | API Route |
| `/api/subscribe` | app/api/subscribe/ | API Route |
| `/api/revalidate` | app/api/revalidate/route.ts | API Route (secret-protected) |
| `/feed.xml` | app/feed.xml/ | Route Handler |
| `/sitemap.xml` | app/sitemap.ts | Auto-generated at build |
| `/robots.txt` | app/robots.ts + public/robots.txt | âš ï¸ Duplicate â€” see KNOWN_ISSUES |
| `/ads.txt` | public/ads.txt | Static file from public/ |

---

## Layout System

Root layout (app/layout.tsx) renders in this order:
  WebVitals â†’ Header â†’ main{children} â†’ Footer â†’ Analytics â†’ [Clarity script if env set]

Theme system:
- Stored in localStorage key `'theme'` (values: 'light' | 'dark')
- Applied as `data-theme` attribute on `<html>` element
- Inline script in `<head>` runs before paint to prevent flash of wrong theme
- Tailwind dark mode selector: `[data-theme="dark"]`

Header (components/layout/Header.tsx):
- 'use client' component â€” sticky, z-index 50
- Contains nav links for all 9 categories + About
- Mobile hamburger menu
- Dark mode toggle button

---

## Data Flow

```
content/posts/*.mdx
  â†“ (gray-matter parse, fs.readFileSync on every request â€” no cache)
lib/posts.ts
  â†’ getAllPosts()          â†’ sitemap, homepage, /blog, /api/posts
  â†’ getPostBySlug()       â†’ /blog/[slug]
  â†’ getPostsByCategory()  â†’ /category/[slug]
  â†’ getFeaturedPosts()    â†’ homepage hero section
  â†’ getRelatedPosts()     â†’ below each post
  â†’ getAllCategories()    â†’ sitemap, footer, generateStaticParams for /category/[slug]
```

Important: getAllCategories() returns only categories actually used in posts â€” not the full
CATEGORY_META list. If no post uses a category, that /category/[slug] route is NOT pre-rendered.

---

## Key Files â€” Handle With Care

| File | Why Critical |
|------|-------------|
| lib/categories.ts | Defines 9 category slugs â€” changing any slug breaks live URLs |
| lib/posts.ts | Post interface â€” all 8+ pages depend on it |
| lib/site.ts | SITE_URL = https://blixamo.com â€” all canonicals |
| app/sitemap.ts | Controls exactly what Google indexes |
| app/layout.tsx | Root metadata + layout for every page |
| next.config.js | Redirects + headers |
| nginx.conf | Production web server (reference only in repo) |
| ecosystem.config.js | PM2 process manager config |
| content/posts/*.mdx | Filename IS the slug â€” never rename after publish |

---

## Things That Must Not Change Without a Plan

1. Category slugs in lib/categories.ts (live in Google-indexed URLs)
2. MDX filenames in content/posts/ (filename = slug = URL)
3. Post TypeScript interface in lib/posts.ts
4. Hardcoded https://blixamo.com throughout codebase
5. The /blog/[slug] URL pattern
6. Any existing redirect in next.config.js




Shared data note:
- \\lib/author.ts\\ now holds the primary author profile used by the About page and author UI so server-rendered pages can use the same image paths safely.
