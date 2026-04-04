# Blixamo — Project Structure Reference
> Generated: 2026-03-25 | Status: AUTHORITATIVE — update whenever structure changes

This file is the source of truth for project architecture. Before making any changes to routing, categories, components, or CSS, read this file to avoid breaking the site.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.12 (App Router, RSC) |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 3 + CSS custom properties (globals.css) |
| Content | MDX files in `content/posts/` via `next-mdx-remote` |
| Font | Inter (Google Fonts, display:swap) |
| Syntax highlight | rehype-pretty-code + shiki |
| Search | fuse.js (client-side) |
| RSS | `rss` package → `/feed.xml` |
| Email | ConvertKit (or MailerLite) via `/api/subscribe` |
| Analytics | Google Analytics 4 + Microsoft Clarity |
| Process manager | PM2 (cluster mode, `max` instances) |
| Reverse proxy | Nginx (Cloudflare CDN in front) |
| Server | Hetzner CPX22, Helsinki — 77.42.17.13 |

---

## Directory Layout

```
/var/www/blixamo/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — Header, Footer, Analytics, Clarity, theme script
│   ├── page.tsx                # Homepage — hero, category pills, recent posts, sidebar
│   ├── not-found.tsx           # Global 404 page
│   ├── robots.ts               # /robots.txt (Next.js handler)
│   ├── sitemap.ts              # /sitemap.xml (Next.js handler)
│   ├── about/page.tsx          # /about static page
│   ├── blog/
│   │   ├── page.tsx            # /blog — paginated post index (10/page)
│   │   ├── page/               # /blog/page/[n] — pagination
│   │   └── [slug]/page.tsx     # /blog/[slug] — individual post
│   ├── category/[slug]/page.tsx# /category/[slug] — all posts in one category
│   ├── tag/[tag]/page.tsx      # /tag/[tag] — all posts with one tag
│   ├── author/[author]/        # /author/[author] — author archive
│   ├── search/page.tsx         # /search — client-side fuse.js search
│   ├── feed.xml/route.ts       # /feed.xml — RSS feed
│   └── api/
│       ├── posts/route.ts      # GET /api/posts — JSON list of all posts
│       ├── revalidate/route.ts # POST /api/revalidate?secret=X — ISR revalidation
│       └── subscribe/route.ts  # POST /api/subscribe — ConvertKit email signup
│
├── components/
│   ├── blog/                   # Post-specific UI
│   │   ├── AuthorBio.tsx
│   │   ├── Callout.tsx         # <Callout type="info|warn|error" title="…"> — used in MDX
│   │   ├── PostCard.tsx        # Card shown on index/category/tag pages
│   │   ├── PostFooter.tsx      # Prev/next nav + share
│   │   ├── PostHeader.tsx      # Title, meta, featured image
│   │   ├── ReadingProgress.tsx # Thin progress bar at top
│   │   ├── RelatedPosts.tsx    # Related posts below post body
│   │   ├── ShareButtons.tsx
│   │   ├── StickyShare.tsx     # Floating share bar
│   │   └── TableOfContents.tsx # Sticky TOC (desktop sidebar)
│   ├── layout/
│   │   ├── Header.tsx          # Top nav — logo, links, dark-mode toggle
│   │   └── Footer.tsx          # Site footer
│   ├── monetization/
│   │   ├── AdSlot.tsx          # Google AdSense slot wrapper
│   │   ├── AffiliateBox.tsx    # Affiliate product callout box
│   │   ├── AffiliateDisclosure.tsx
│   │   ├── AffiliateLink.tsx
│   │   ├── EmailCapture.tsx    # Newsletter signup (inline + end-of-post)
│   │   └── ProductCTA.tsx      # "Check price" / "Get it free" CTA
│   ├── seo/
│   │   ├── Analytics.tsx       # GA4 script
│   │   ├── JsonLd.tsx          # JSON-LD (Article, Website, FAQ schemas)
│   │   └── WebVitals.tsx       # Core Web Vitals reporting
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ChatbotWidget.tsx
│       ├── MobileTOC.tsx       # TOC for mobile (collapsible)
│       ├── Newsletter.tsx
│       ├── Pagination.tsx      # Used on /blog and category pages
│       └── ScrollToTop.tsx
│
├── content/posts/              # ALL MDX blog posts live here
│   └── [slug].mdx
│
├── lib/
│   ├── categories.ts           # SINGLE SOURCE OF TRUTH for category metadata
│   ├── posts.ts                # getAllPosts, getPostBySlug, getRelatedPosts, etc.
│   ├── site.ts                 # SITE_URL, SITE_NAME, absoluteUrl()
│   └── utils.ts                # Shared helpers
│
├── public/
│   ├── images/
│   │   ├── posts/[slug]/       # NEW location for featured images (PNG 1200×630)
│   │   └── [legacy-slug].jpg   # Old images at root level — still served
│   ├── robots.txt              # Static fallback (app/robots.ts takes precedence)
│   └── ...
│
├── styles/globals.css          # All CSS custom properties + prose + layout classes
├── mdx-components.tsx          # MDX component map (Callout, etc.)
├── next.config.js              # Next.js config — redirects, headers, image config
├── tailwind.config.js
├── tsconfig.json
├── ecosystem.config.js         # PM2 config
├── nginx.conf                  # Nginx vhost (Cloudflare IP passthrough)
├── ARTICLE_RULES.md            # Content rules — read before writing any post
├── STRUCTURE.md                # ← this file
└── DEPLOY.md                   # Deployment & ops reference
```

---

## URL Routing

| URL Pattern | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero + recent posts + sidebar |
| `/blog` | `app/blog/page.tsx` | All posts, 10/page |
| `/blog/page/[n]` | `app/blog/page/` | Paginated blog index |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Single post — statically generated |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | Category archive |
| `/tag/[tag]` | `app/tag/[tag]/page.tsx` | Tag archive |
| `/author/[author]` | `app/author/[author]/` | Author archive |
| `/about` | `app/about/page.tsx` | Static about page |
| `/search` | `app/search/page.tsx` | Client-side search |
| `/feed.xml` | `app/feed.xml/route.ts` | RSS feed |
| `/sitemap.xml` | `app/sitemap.ts` | Auto-generated |
| `/robots.txt` | `app/robots.ts` | Auto-generated |
| `/api/posts` | `app/api/posts/route.ts` | JSON API |
| `/api/revalidate` | `app/api/revalidate/route.ts` | ISR trigger |
| `/api/subscribe` | `app/api/subscribe/route.ts` | Email signup |

### Active Redirects (next.config.js)
| From | To | Permanent |
|---|---|---|
| `/category/tech` | `/category/vps-cloud` | ✅ 301 |
| `/hire` | `/about` | ✅ 301 |
| `/series/nextjs-deployment` | `/category/tutorials` | ✅ 301 |
| `/series/nextjs-tutorials` | `/category/tutorials` | ✅ 301 |
| `/series/self-hosting` | `/category/self-hosting` | ✅ 301 |

---

## Data Layer: `lib/posts.ts`

All post data flows through `getAllPosts()`. There is NO database — everything reads from MDX files on disk at build time.

### Post interface (all fields)

```typescript
interface Post {
  slug: string           // filename without .mdx
  title: string
  description: string    // 150-160 chars for meta
  date: string           // YYYY-MM-DD
  updatedAt?: string     // YYYY-MM-DD — used in sitemap + OG
  author: string         // default: "Blixamo"
  category: string       // MUST match a key in lib/categories.ts
  tags: string[]         // 6-10 tags
  keyword: string        // primary SEO keyword
  featured: boolean      // appears in getFeaturedPosts()
  featuredImage: string  // path from /public — e.g. /images/posts/[slug]/featured.jpg
  readingTime: string    // auto-calculated (200 wpm)
  content: string        // MDX body
  schema?: 'article' | 'howto' | 'faq' | 'review'
  noindex?: boolean
  canonical?: string
}
```

### Functions
| Function | Returns |
|---|---|
| `getAllPosts()` | All posts sorted newest-first |
| `getPostBySlug(slug)` | Single post or undefined |
| `getPostsByCategory(cat)` | Posts filtered by category |
| `getFeaturedPosts(limit=5)` | Posts where featured=true |
| `getRelatedPosts(post, limit=3)` | Scored by tag overlap + same category |
| `getAllCategories()` | Unique category strings from all posts |

---

## Categories (lib/categories.ts)

**9 canonical categories — this is the ONLY valid list:**

| Slug | Label | Icon | Color |
|---|---|---|---|
| `how-to` | How-To Guides | 📖 | #0891b2 |
| `ai` | AI Developers | 🤖 | #7c3aed |
| `developer-tools` | Developer Tools | 🛠 | #d97706 |
| `indie-hacking` | Indie Hacking | 🚀 | #e11d48 |
| `self-hosting` | Self-Hosting | 🖥 | #059669 |
| `vps-cloud` | VPS & Cloud | ☁️ | #2563eb |
| `web-dev` | Web Development | 💻 | #ea580c |
| `automation` | Automation | ⚡ | #db2777 |
| `free-tools` | Free Tools | 🆓 | #0d9488 |

⚠️ **Category mismatch warning:** Several existing posts use non-canonical slugs (`tools`, `tutorials`, `indie-dev`). These fall through to the generic `getCategoryMeta()` handler and will NOT appear in category archives. This needs cleanup — see DEPLOY.md.

---

## MDX Frontmatter: Full Schema

All 17 fields required per ARTICLE_RULES.md Rule 1:

```yaml
---
title: "Exact title string"
slug: "exact-slug-matching-filename"
description: "150-160 chars exactly"
date: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
author: "Ankit Sorathiya"
category: "one-of-9-canonical-slugs"
tags: [tag1, tag2, tag3, tag4, tag5, tag6]   # 6-10 tags, no quotes needed
keyword: "primary seo keyword"
secondaryKeywords: ["kw2", "kw3", "kw4", "kw5"]
featured: false
featuredImage: /images/posts/[slug]/featured.jpg
schema: "article"       # article | howto | faq | review | comparison
difficulty: "beginner"  # beginner | intermediate | advanced
timeToComplete: "X minutes"
excerpt: "One-sentence hook for internal use"
toc: true
---
```

### MDX Components Available in Posts

| Component | Usage |
|---|---|
| `<Callout type="info\|warn\|error" title="…">` | Highlighted tip/warning box |

All standard HTML + Markdown is supported. Code blocks use rehype-pretty-code with shiki syntax highlighting.

---

## CSS Design System (globals.css)

Theme controlled via `data-theme` attribute on `<html>`. Toggled via localStorage in a blocking inline script in `layout.tsx` to prevent flash.

### CSS Custom Properties

| Variable | Light | Dark | Usage |
|---|---|---|---|
| `--bg` | #ffffff | #0f1117 | Page background |
| `--bg-subtle` | #f8f9fa | #161b22 | Cards, sidebar panels |
| `--surface` | #f1f3f5 | #1c2128 | Code bg, table headers |
| `--border` | #e9ecef | #30363d | All borders |
| `--text-primary` | #1a1a2e | #e6edf3 | Headings, body |
| `--text-secondary` | #495057 | #8b949e | Subtext |
| `--text-muted` | #868e96 | #6e7681 | Labels, dates |
| `--accent` | #6c63ff | #7c6dff | Links, CTAs, active states |
| `--accent-hover` | #5a52d5 | #6a5cf0 | Hover state |
| `--accent-soft` | rgba(108,99,255,0.08) | rgba(124,109,255,0.12) | Highlight bg |
| `--link` | #6c63ff | #7c6dff | `<a>` color |
| `--code-bg` | #f1f3f5 | #1c2128 | Inline code |
| `--code-text` | #e83e8c | #f778ba | Inline code text |
| `--success` | #2f9e44 | — | Success states |
| `--warning` | #f08c00 | — | Warning states |
| `--error` | #c92a2a | — | Error states |

### Key Layout Classes (globals.css, NOT Tailwind)

| Class | Purpose |
|---|---|
| `.prose` | All article body content — headings, paragraphs, tables, code |
| `.post-layout` | CSS grid: left gutter + prose column + TOC sidebar |
| `.homepage-grid` | CSS grid: main posts + 300px sidebar |
| `.toc` | Sticky table of contents |
| `.toc a.active` | Highlights current section |

⚠️ **Do not use Tailwind classes inside `.mdx` post content** — the `.prose` class handles all MDX typography.

---

## Featured Images

| Detail | Value |
|---|---|
| Location | `/public/images/posts/[slug]/featured.jpg` (new) or `/public/images/[slug].jpg` (legacy) |
| Dimensions | 1200 × 630px |
| Format | JPG or PNG |
| Max size | < 150 KB |
| Tool | Ideogram v2, Render 3D, 16:9, Dark theme |
| Frontmatter | `featuredImage: /images/posts/[slug]/featured.jpg` |

**Category accent colors for Ideogram:**
- ai → #7c3aed
- developer-tools / tools → #d97706
- how-to / tutorials → #0891b2
- self-hosting / vps-cloud → #059669
- indie-hacking → #e11d48

---

## SEO & Structured Data

- JSON-LD schemas: Article, HowTo, FAQ, Website — generated by `components/seo/JsonLd.tsx`
- FAQ JSON-LD auto-extracted from `## Frequently Asked Questions` H2 section
- Canonical URLs set per post via `alternates.canonical` in generateMetadata
- OG images: post `featuredImage` at 1200×630
- Twitter card: `summary_large_image`
- Sitemap includes: homepage (1.0), categories (0.7), KEEP_TAGS (0.6), posts (0.7 or 0.9 if featured)
- robots.txt: disallows `/api/`, `/_next/`, `/search?*`

---

## Environment Variables

| Var | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No (defaults to blixamo.com) | Site base URL |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | No | Microsoft Clarity project ID |
| `NEXT_PUBLIC_ADSENSE_ID` | No | AdSense publisher ID |
| `NEXT_PUBLIC_ADS_ENABLED` | No | `"true"` to enable ad slots |
| `NEXT_PUBLIC_AD_SLOT_1` | No | AdSense slot IDs |
| `CONVERTKIT_API_KEY` | No | ConvertKit API secret |
| `CONVERTKIT_FORM_ID` | No | ConvertKit form ID |
| `REVALIDATE_SECRET` | Yes | Protects `/api/revalidate` endpoint |

Set in `/var/www/blixamo/.env.local` (not committed to git).

---

## Nginx Behaviour

- HTTP → HTTPS redirect (301)
- www → non-www redirect (301)
- Cloudflare IP ranges in `set_real_ip_from` — real client IP passed via CF-Connecting-IP
- `/_next/static/` → immutable cache 1 year
- `/images/` → cache 30 days
- `/` (HTML) → `Cache-Control: public, s-maxage=0, must-revalidate` + `CDN-Cache-Control: no-store` (allows ISR revalidation through Cloudflare)
- SSL via Let's Encrypt + certbot, HSTS enabled

---

## What NOT to Touch

| Thing | Why |
|---|---|
| `lib/categories.ts` slug keys | Changing a key breaks all posts in that category + sitemap + category pages |
| `lib/posts.ts` Post interface | Removing a field breaks frontmatter parsing site-wide |
| `--accent` CSS var | Used in 30+ places including reading progress, TOC, links, CTAs |
| `.prose` class in globals.css | Removing or renaming breaks all post typography |
| `app/layout.tsx` inline theme script | Removing causes white flash on dark-mode page load |
| `generateStaticParams()` in `[slug]` | Removing causes dynamic routes to 404 in production |
| Nginx `CDN-Cache-Control: no-store` on HTML | Removing breaks ISR — Cloudflare will cache stale HTML forever |
