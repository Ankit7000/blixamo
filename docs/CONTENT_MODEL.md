# CONTENT_MODEL.md — Frontmatter Schema & Content System

> Last audited: 2026-03-25
> All fields reflect what lib/posts.ts actually reads at runtime.

---

## Post Frontmatter Schema

Every file in content/posts/*.mdx must start with this YAML frontmatter block.

```yaml
---
title: "Full article title"                          # Required
description: "150-160 char meta description"         # Required
date: "YYYY-MM-DD"                                   # Required
updatedAt: "YYYY-MM-DD"                              # Optional
author: "Blixamo"                                    # Required
category: "vps-cloud"                                # Required — must be one of 9 slugs
tags: ["hetzner", "vps", "devops"]                  # Required (can be [])
keyword: "primary seo keyword"                       # Required
featured: false                                      # Optional boolean
featuredImage: "/images/posts/slug/featured.png"     # Optional — path under /public
schema: "article"                                    # Optional enum
noindex: false                                       # Optional boolean
canonical: ""                                        # Optional URL override
---
```

---

## Post Interface (lib/posts.ts)

This is what the app actually reads. If a field is not here, it has no effect.

```typescript
interface Post {
  slug: string           // auto — derived from filename
  title: string          // frontmatter.title
  description: string    // frontmatter.description
  date: string           // frontmatter.date
  updatedAt?: string     // frontmatter.updatedAt
  author: string         // frontmatter.author (default: 'Blixamo')
  category: string       // frontmatter.category (default: 'general')
  tags: string[]         // frontmatter.tags (default: [])
  keyword: string        // frontmatter.keyword
  featured: boolean      // frontmatter.featured (default: false)
  featuredImage: string  // frontmatter.featuredImage (default: '/images/default-og.jpg')
  readingTime: string    // auto-calculated at 200 wpm
  content: string        // MDX body
  schema?: 'article' | 'howto' | 'faq' | 'review'
  noindex?: boolean
  canonical?: string
}
```

readingTime is auto-calculated — do not add it to frontmatter.
slug is derived from the MDX filename — do not add it to frontmatter.

---

## Required Fields

| Field | Type | Used For |
|-------|------|---------|
| title | string | `<title>`, OG title, JSON-LD headline, PostCard |
| description | string | meta description, OG description, JSON-LD, PostCard |
| date | YYYY-MM-DD string | Sort order, sitemap lastModified, JSON-LD datePublished |
| author | string | JSON-LD author, /author/[author] route |
| category | string | /category/[slug] route, breadcrumb, JSON-LD articleSection |
| tags | string[] | /tag/[tag] routes, RelatedPosts scoring, JSON-LD keywords |
| keyword | string | keywords meta tag, JSON-LD keywords field |

---

## Optional Fields

| Field | Default | Effect When Set |
|-------|---------|----------------|
| updatedAt | — | Overrides sitemap lastModified, adds JSON-LD dateModified |
| featured | false | Sitemap priority 0.9 (vs 0.7), shown in homepage hero |
| featuredImage | /images/default-og.jpg | OG image, PostCard thumbnail |
| schema | article | Selects JSON-LD structured data type |
| noindex | false | Adds `noindex` to robots meta — hides page from Google |
| canonical | auto | Override canonical URL — only for syndicated content |

---

## The 9 Category Slugs

Use EXACTLY these values in the category field. No other values are valid.

| Slug | Label | Use For |
|------|-------|---------|
| `how-to` | How-To Guides | Step-by-step tutorials |
| `ai` | AI Developers | Claude API, OpenAI, AI tools |
| `developer-tools` | Developer Tools | Tool comparisons and reviews |
| `indie-hacking` | Indie Hacking | Payments, shipping, solo business |
| `self-hosting` | Self-Hosting | Running apps on own VPS |
| `vps-cloud` | VPS & Cloud | VPS comparisons, cloud providers |
| `web-dev` | Web Development | Next.js, Tailwind, App Router |
| `automation` | Automation | n8n, workflows, bots |
| `free-tools` | Free Tools | Open source, free alternatives |

Using any other category value will:
- Not crash the app (getCategoryMeta has a fallback)
- Miss the /category/[slug] route pre-rendering
- Show unstyled fallback metadata

---

## Schema Types

| Value | JSON-LD Type Generated |
|-------|----------------------|
| `article` | Article (default for all posts) |
| `howto` | HowTo with steps |
| `faq` | FAQPage |
| `review` | Review |
| `comparison` | ⚠️ NOT in TypeScript union — falls back to article silently |

10 posts currently use "comparison" — this is a known issue (see KNOWN_ISSUES.md).

---

## Featured Images

Standard path: /public/images/posts/[slug]/featured.png
OG image path: /public/images/posts/[slug]/og.jpg
Fallback: /images/default-og.jpg (used if featuredImage is not set)

Generation tool: Ideogram v2
Settings: Render 3D · 16:9 ratio · Dark theme · 1200×630px

Category accent colors for image generation:
- ai: #7c3aed
- developer-tools: #d97706
- how-to: #0891b2
- self-hosting / tech: #059669
- indie-hacking: #e11d48

---

## MDX Components Available

Registered in mdx-components.tsx:

| Component | Usage | Types |
|-----------|-------|-------|
| `<Callout>` | Highlight important info | type="info\|warning\|error\|success\|tip" |

Standard HTML elements (h1-h6, p, ul, ol, code, pre, table, a) are styled via globals.css prose classes.

---

## Publishing Workflow

1. Write content/posts/[slug].mdx with all required frontmatter
2. Category must be one of the 9 registered slugs
3. Generate featured image with Ideogram v2, save to public/images/posts/[slug]/featured.png
4. SCP post to VPS: scp -i C:\Users\ankit\.ssh\id_ed25519 [slug].mdx root@77.42.17.13:/var/www/blixamo/content/posts/
5. SCP image to VPS: scp -i C:\Users\ankit\.ssh\id_ed25519 featured.png root@77.42.17.13:/var/www/blixamo/public/images/posts/[slug]/
6. Deploy: cd /var/www/blixamo && npm run build && pm2 reload blixamo
7. Verify: curl -s https://blixamo.com/blog/[slug] | grep -i title
8. Index: node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]
