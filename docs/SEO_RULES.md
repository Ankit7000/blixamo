# SEO_RULES.md — SEO Rules for Blixamo

> Last audited: 2026-03-25
> These rules apply to all pages. Do not change SEO logic without updating this doc.

---

## Title Rules

Template (set in app/layout.tsx):
  default: "Blixamo — Tech, Tips & Trends"
  per-page: "%s | Blixamo"

Post title rules (from ARTICLE_RULES.md):
- 50-60 characters including " | Blixamo" suffix
- Must contain primary keyword
- No clickbait — must match article content
- Never add "India" unless the post is exclusively India content

Examples of good titles:
  "Best PostgreSQL GUI Tools (Free) in 2026 | Blixamo"
  "Hetzner vs DigitalOcean vs Vultr: Real Cost Comparison | Blixamo"

---

## Meta Description Rules

- 150-160 characters
- Must contain the primary keyword (frontmatter: keyword)
- Must be unique per post — no duplicates
- Must describe actual post content — no generic filler
- Set in frontmatter: description field

---

## Canonical Rules

- All pages have a canonical URL set automatically from SITE_URL + path
- SITE_URL = https://blixamo.com (set in lib/site.ts)
- Override only for syndicated/cross-posted content using frontmatter canonical field
- Never leave canonical pointing to a wrong URL
- Root layout sets: alternates: { canonical: 'https://blixamo.com' }

Post canonical format: https://blixamo.com/blog/[slug]

---

## Robots Rules

- All pages: index=true, follow=true by default (set in app/layout.tsx metadata)
- Set frontmatter noindex: true to block a specific post from Google
- app/robots.ts generates /robots.txt
- ⚠️ public/robots.txt also exists — this causes a conflict (see KNOWN_ISSUES.md)
- Sitemap URL in robots.txt: https://blixamo.com/sitemap.xml

---

## OpenGraph Rules

Set in app/layout.tsx (defaults):
  siteName: "Blixamo"
  type: "website"
  locale: "en_US"

Per-post OG (set in app/blog/[slug]/page.tsx):
  og:title = post.title
  og:description = post.description
  og:image = post.featuredImage (absolute URL)
  og:type = "article"

OG image requirements:
  Recommended: 1200×630px
  Format: JPG or PNG
  Path: /images/posts/[slug]/og.jpg or featured.png
  Fallback: /images/default-og.jpg

---

## Twitter Card Rules

Set in app/layout.tsx:
  twitter:card = "summary_large_image"
  twitter:site = "@blixamo"

Per-post twitter tags inherit from OG settings.

---

## JSON-LD Structured Data

Component: components/seo/JsonLd.tsx
Rendered on: /blog/[slug] pages

Types generated based on frontmatter schema field:

### Article (default, schema: "article")
```json
{
  "@type": "Article",
  "headline": post.title,
  "description": post.description,
  "datePublished": post.date,
  "dateModified": post.updatedAt || post.date,
  "author": { "@type": "Person", "name": post.author },
  "publisher": { "@type": "Organization", "name": "Blixamo" },
  "image": post.featuredImage,
  "keywords": post.keyword,
  "articleSection": post.category
}
```

### HowTo (schema: "howto")
Generates HowTo structured data — use for step-by-step tutorial posts.

### FAQ (schema: "faq")
Generates FAQPage structured data — use for posts with Q&A sections.

### Review (schema: "review")
Generates Review structured data — use for tool/product review posts.

### BreadcrumbList
Generated on all post pages:
  Home > [Category Label] > [Post Title]

### WebSite
Generated on homepage with SearchAction for Google Sitelinks Searchbox.

---

## Internal Linking Rules

- Every post must link to 3-5 other posts on blixamo.com
- Links must be contextually relevant — not random
- Use descriptive anchor text containing target post keywords
- Bidirectional: if post A links to B, consider adding a link from B to A
- No orphan posts — every post should have at least 2 incoming internal links
- Use full path: /blog/[slug] (not absolute URL in MDX)

---

## Sitemap SEO Rules

- /sitemap.xml generated at build time by app/sitemap.ts
- Homepage priority: 1.0
- Category pages: 0.7
- Tag pages (13 curated only): 0.6
- Regular posts: 0.7
- Featured posts: 0.9
- /blog index, /search, /author/* are NOT in sitemap
- `lastmod` must follow real content freshness rather than the build timestamp:
  - posts use `updatedAt` or `date` 
  - homepage/category/tag pages inherit freshness from the newest relevant post
  - static legal pages use a fixed document date until they are actually edited

After any new post: run node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]

---

## Category SEO Rules

Each category has a dedicated page at /category/[slug] with:
- Unique title and meta description from CATEGORY_META.description
- List of all posts in that category
- Category icon and color from CATEGORY_META

Category pages ARE in sitemap. Author pages are NOT.

---

## URL SEO Rules

- Post URLs: /blog/[slug] — lowercase, hyphen-separated, descriptive
- No trailing slashes
- No query parameters in canonical URLs
- Never change a URL after it has been indexed by Google
- 301 redirects are in place for all legacy URLs (see SITEMAP.md)
