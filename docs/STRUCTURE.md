# STRUCTURE.md — Blixamo Repository Architecture

> Production site: https://blixamo.com
> VPS: root@77.42.17.13 — /var/www/blixamo
> Last audited: 2026-03-25
> Do NOT rename directories, move key files, or add routes without updating this doc.

---

## Full Folder Structure

```
blixamo/
├── AGENTS.md                          # AI agent rules — read before any task
├── docs/                              # Documentation (this folder)
│   ├── STRUCTURE.md                   # This file
│   ├── SITEMAP.md                     # All routes, slugs, redirects
│   ├── CONTENT_MODEL.md               # Frontmatter schema, Post interface
│   ├── SEO_RULES.md                   # Title, canonical, JSON-LD, OG rules
│   ├── DEPLOY.md                      # VPS, SSH, PM2, deploy steps
│   ├── KNOWN_ISSUES.md                # Bugs, risks, tech debt
│   └── ARTICLE_RULES.md              # 40 writing rules
│
├── app/                               # Next.js 15 App Router
│   ├── layout.tsx                     # Root layout: Inter font, Header, Footer, Analytics, Clarity
│   ├── page.tsx                       # Homepage — hero, categories, latest posts
│   ├── not-found.tsx                  # Global 404 page
│   ├── robots.ts                      # Generates /robots.txt
│   ├── sitemap.ts                     # Generates /sitemap.xml at build time
│   ├── head.tsx                       # Extra <head> tags
│   ├── about/
│   │   └── page.tsx                   # /about — static author page
│   ├── contact/
│   │   └── page.tsx                   # /contact — static contact page
│   ├── privacy-policy/
│   │   └── page.tsx                   # /privacy-policy — static legal page
│   ├── terms/
│   │   └── page.tsx                   # /terms — static legal page
│   ├── disclaimer/
│   │   └── page.tsx                   # /disclaimer — static legal page
│   ├── blog/
│   │   ├── page.tsx                   # /blog — post index (page 1 only, pagination broken)
│   │   ├── page/                      # Directory exists but no [page] route — pagination broken
│   │   └── [slug]/
│   │       └── page.tsx               # /blog/[slug] — SSG post page
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx               # /category/[slug] — SSG
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx               # /tag/[tag] — SSG
│   ├── author/
│   │   └── [author]/
│   │       └── page.tsx               # /author/[author] — SSG
│   ├── search/
│   │   └── page.tsx                   # /search — client-side, fetches /api/posts
│   ├── feed.xml/                      # /feed.xml — RSS 2.0 (last 20 posts)
│   └── api/
│       ├── posts/                     # GET /api/posts — all post metadata JSON
│       ├── subscribe/                 # POST /api/subscribe — newsletter
│       └── revalidate/
│           └── route.ts               # POST|GET /api/revalidate — ISR (secret-protected)
│
├── components/
│   ├── blog/
│   │   ├── AuthorBio.tsx              # Author bio block
│   │   ├── Callout.tsx                # MDX <Callout type="info|warning|error|success|tip">
│   │   ├── PostCard.tsx               # Article card used in all grids
│   │   ├── PostFooter.tsx             # Prev/next navigation below article
│   │   ├── PostHeader.tsx             # Title, meta, category badge, reading time
│   │   ├── ReadingProgress.tsx        # Fixed top progress bar
│   │   ├── RelatedPosts.tsx           # Related articles section
│   │   ├── ShareButtons.tsx           # Social share buttons
│   │   ├── StickyShare.tsx            # Sticky share sidebar (desktop)
│   │   └── TableOfContents.tsx        # Sticky right TOC (desktop only)
│   ├── layout/
│   │   ├── Header.tsx                 # Sticky nav, dark mode toggle, mobile menu
│   │   └── Footer.tsx                 # 3-col footer: logo, categories, links
│   ├── monetization/
│   │   ├── AdSlot.tsx                 # Google AdSense slot wrapper
│   │   ├── AffiliateBox.tsx           # Affiliate product box
│   │   ├── AffiliateDisclosure.tsx    # FTC disclosure banner
│   │   ├── AffiliateLink.tsx          # Styled affiliate link
│   │   ├── EmailCapture.tsx           # Newsletter signup form
│   │   └── ProductCTA.tsx             # Product recommendation CTA
│   ├── seo/
│   │   ├── Analytics.tsx              # GA4 script injection
│   │   ├── JsonLd.tsx                 # JSON-LD: Article, HowTo, FAQ, WebSite, BreadcrumbList
│   │   └── WebVitals.tsx              # Core Web Vitals reporting
│   ├── shared/
│   │   └── AuthorImage.tsx            # Author avatar/photo
│   └── ui/
│       ├── Badge.tsx                  # Category/tag badge
│       ├── Button.tsx                 # Reusable button
│       ├── ChatbotWidget.tsx          # Chatbot UI widget
│       ├── MobileTOC.tsx              # Mobile table of contents
│       ├── Newsletter.tsx             # Newsletter signup UI
│       ├── Pagination.tsx             # Prev/next pagination
│       └── ScrollToTop.tsx            # Scroll-to-top button
│
├── content/
│   └── posts/                         # 44 MDX files. Filename = URL slug. NEVER rename after publish.
│       └── *.mdx
│
├── lib/                               # Core data layer — no React, no UI
│   ├── categories.ts                  # 9-category registry — SINGLE SOURCE OF TRUTH for slugs
│   ├── posts.ts                       # getAllPosts, getPostBySlug, etc. No in-memory cache.
│   ├── site.ts                        # SITE_URL, SITE_NAME, SITE_TWITTER, absoluteUrl()
│   └── utils.ts                       # truncate, slugify, formatDate, readingTime, groupByCategory
│
├── public/
│   ├── ads.txt                        # /ads.txt — AdSense publisher declaration
│   ├── robots.txt                     # ⚠️ STATIC robots file — conflicts with app/robots.ts
│   └── images/
│       ├── logo.svg
│       ├── default-og.jpg             # Fallback OG image for posts without featuredImage
│       ├── author-avatar.jpg
│       ├── author-photo.jpg
│       └── posts/
│           └── [slug]/                # Per-post images
│               ├── featured.png       # Featured image (Ideogram v2, 16:9, dark)
│               └── og.jpg             # OG image (1200x630)
│
├── scripts/                           # Utility scripts (not part of Next.js app)
│   ├── build.js                       # Custom build script (npm run build calls this)
│   └── process_og_images.py           # OG image processing
│
├── styles/
│   └── globals.css                    # Single CSS file: variables, reset, prose, dark mode, responsive
│
├── tools/                             # JS automation tools (not part of Next.js app)
│   ├── blixamo-seo-engine.js          # SEO analysis
│   ├── blixamo-supervisor.js          # Build supervisor
│   ├── blixamo-checker.js             # Content checker
│   ├── blixamo-ai-fixer.js            # Article quality fixer
│   ├── blixamo-next-article.js        # Next article planner
│   ├── blixamo-title-engine.js        # Title generator
│   └── generate-og-images.js          # OG image generation
│
├── mdx-components.tsx                 # Global MDX component registry (Callout registered here)
├── next.config.js                     # Redirects, headers, image config, @ alias
├── tailwind.config.js                 # dark mode via [data-theme="dark"], accent #6c63ff
├── ecosystem.config.js                # PM2 cluster config, memory limits, log paths
├── nginx.conf                         # Reference Nginx config (NOT auto-applied to server)
├── deploy.sh                          # Fresh deploy script (rsync + npm install + build + pm2)
├── package.json                       # npm scripts: dev, build, start, lint
├── tsconfig.json                      # TypeScript config
└── .env.example                       # Environment variable template
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
| `/robots.txt` | app/robots.ts + public/robots.txt | ⚠️ Duplicate — see KNOWN_ISSUES |
| `/ads.txt` | public/ads.txt | Static file from public/ |

---

## Layout System

Root layout (app/layout.tsx) renders in this order:
  WebVitals → Header → main{children} → Footer → Analytics → [Clarity script if env set]

Theme system:
- Stored in localStorage key `'theme'` (values: 'light' | 'dark')
- Applied as `data-theme` attribute on `<html>` element
- Inline script in `<head>` runs before paint to prevent flash of wrong theme
- Tailwind dark mode selector: `[data-theme="dark"]`

Header (components/layout/Header.tsx):
- 'use client' component — sticky, z-index 50
- Contains nav links for all 9 categories + About
- Mobile hamburger menu
- Dark mode toggle button

---

## Data Flow

```
content/posts/*.mdx
  ↓ (gray-matter parse, fs.readFileSync on every request — no cache)
lib/posts.ts
  → getAllPosts()          → sitemap, homepage, /blog, /api/posts
  → getPostBySlug()       → /blog/[slug]
  → getPostsByCategory()  → /category/[slug]
  → getFeaturedPosts()    → homepage hero section
  → getRelatedPosts()     → below each post
  → getAllCategories()    → sitemap, footer, generateStaticParams for /category/[slug]
```

Important: getAllCategories() returns only categories actually used in posts — not the full
CATEGORY_META list. If no post uses a category, that /category/[slug] route is NOT pre-rendered.

---

## Key Files — Handle With Care

| File | Why Critical |
|------|-------------|
| lib/categories.ts | Defines 9 category slugs — changing any slug breaks live URLs |
| lib/posts.ts | Post interface — all 8+ pages depend on it |
| lib/site.ts | SITE_URL = https://blixamo.com — all canonicals |
| app/sitemap.ts | Controls exactly what Google indexes |
| app/layout.tsx | Root metadata + layout for every page |
| next.config.js | Redirects + headers |
| nginx.conf | Production web server (reference only in repo) |
| ecosystem.config.js | PM2 process manager config |
| content/posts/*.mdx | Filename IS the slug — never rename after publish |

---

## Things That Must Not Change Without a Plan

1. Category slugs in lib/categories.ts (live in Google-indexed URLs)
2. MDX filenames in content/posts/ (filename = slug = URL)
3. Post TypeScript interface in lib/posts.ts
4. Hardcoded https://blixamo.com throughout codebase
5. The /blog/[slug] URL pattern
6. Any existing redirect in next.config.js


