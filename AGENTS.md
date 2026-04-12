# AGENTS.md — Rules for AI Agents (Codex, Claude Code, Cursor)

> Read this file COMPLETELY before touching any file in this repository.
> This is a PRODUCTION website. SEO and URL stability matter more than code cleanliness.

---

## Mandatory Reading Order

Before starting ANY task, read these in full — no exceptions:

1. `AGENTS.md` ← this file
2. `docs/STRUCTURE.md` — folder layout, routing, data flow, key files
3. `docs/SITEMAP.md` — all routes, slug list, redirects, sitemap logic
4. `docs/CONTENT_MODEL.md` — frontmatter schema, Post interface, 9-category system
5. `docs/SEO_RULES.md` — titles, canonicals, JSON-LD, OG, robots rules
6. `docs/DEPLOY.md` — VPS info, SSH, deploy steps, PM2, GSC indexing
7. `docs/KNOWN_ISSUES.md` — existing bugs, risks, debt — know before touching anything
8. `docs/ARTICLE_RULES.md` — 40 writing rules, do not override

No docs read = no code written. Non-negotiable.

---

## Critical Rules — Never Break These

1. Never rename a post MDX filename — the filename IS the URL slug. Renaming = 404 for Google-indexed URLs.
2. Never rename a category slug in lib/categories.ts — breaks /category/[slug] and sitemap.
3. Never remove a category from lib/categories.ts — breaks all posts using it.
4. Never change the Post interface in lib/posts.ts without auditing every page that uses it.
5. Never change SITE_URL or hardcoded https://blixamo.com — all canonicals and OG URLs depend on it.
6. Never modify nginx.conf without running nginx -t first.
7. Never change the /blog/[slug] URL pattern — it is the canonical post URL format.
8. Never add or remove redirects in next.config.js without documenting in docs/SITEMAP.md.
9. Never change app/sitemap.ts — controls what Google indexes.
10. Never change app/layout.tsx without explicit instruction — affects every page globally.
11. Never run npm install on VPS during a deploy without a full build plan.

---

## Google Search Console and Indexing Rules

- Use only the existing VPS GSC command/system: `node /var/www/gsc-tool/gsc.js ...`
- Credentials stay on the VPS only. Never expose secrets, credential contents, or token contents. Never print them. Never commit any credential file.
- Do not recreate or replace the GSC integration if the existing `/var/www/gsc-tool/gsc.js` workflow works.
- For normal deploys with no new article and no major URL or content change:
  - do not run manual indexing
  - do not resubmit the sitemap repeatedly
- For a newly published article:
  - verify the deploy succeeded
  - verify the production URL returns HTTP 200
  - verify the URL is in `/sitemap.xml`
  - run `submit` only if needed
  - request indexing for that one new article URL only
- For a materially updated article:
  - request indexing only if the update is substantial
  - never request indexing for the same URL more than once within 7 days
- Never bulk-index the whole site.
- Never index category pages, homepage, about page, legal pages, or unchanged pages unless explicitly instructed.
- Do not exceed safe limits:
  - max 1 sitemap submit per deploy
  - max 1 indexing request per changed URL
  - max 10 indexing requests per day unless explicitly instructed
- Keep a simple VPS-side log/state so the same URL is not indexed repeatedly.
- Prefer sitemap + internal linking over manual indexing for most changes.
- Before any indexing request, confirm all of these:
  - page is live on production
  - page is not blocked by `robots.txt`
  - canonical URL is correct
- After any GSC action, report exactly:
  - command run
  - URLs affected
  - whether it was read-only or state-changing
- For read-only SEO checks, allowed commands include: `sitemaps`, `pages`, `queries`, `report`, `inspect`, `coverage`
- For state-changing commands:
  - use `submit` only when sitemap or important content changed
  - use `index` only for new or materially updated article URLs

### Indexing Priority Rules

When deciding whether to request indexing, use this priority:

1. New blog article � OK to index
2. Major rewrite of an article � OK to index
3. New category page � usually rely on sitemap only
4. Homepage changes � do not index
5. Layout, design, or code changes � do not index
6. Minor typo or small content edits � do not index
7. Sitemap-only change � submit sitemap, do not index pages

---
## Always Ask Before

- Adding a new category (requires lib/categories.ts update + 3 doc updates)
- Modifying the Post interface (requires all-pages audit)
- Touching app/layout.tsx, app/sitemap.ts, app/robots.ts
- Touching nginx.conf or ecosystem.config.js
- Adding/removing nav links in components/layout/Header.tsx
- Creating or removing any file under app/

---

## Workflow For Every Task

### Step 1 — Read
Read all docs in Mandatory Reading Order. Identify every file that will be touched.

## Avoid Duplicate Content by Intent, Not Just Topic

Before creating any new article, always search the repo for overlapping posts.

Rule:
- Same topic is allowed.
- Same intent is not allowed.
- Different intent is a valid topic-cluster expansion.

For every proposed article, identify:
- Topic
- Search intent
- Page type
- Audience
- Closest existing related posts

Allowed page intents: guide, tutorial, comparison, alternatives, best tools, checklist, troubleshooting, migration, monitoring, security, performance, pricing, setup, review, resources.

Decision logic:
1. Search the repo for existing posts on the same topic.
2. Determine the intent of the new post.
3. If an existing post already serves the same topic + same intent, do not create a duplicate.
4. Instead, suggest a different angle or page type.
5. Prefer expanding a topic cluster sideways rather than repeating the same article.

Examples:
- Ubuntu VPS hardening guide and Ubuntu VPS hardening checklist are different intents, so both are allowed.
- Pay Hetzner from India and Hetzner payment methods in 2026 may overlap, so the second must be angled differently (global billing coverage).
- Coolify guide and Coolify alternatives are different intents, so both are allowed.

Mandatory preflight before creating a new article:
- List related existing posts.
- State the new page intent.
- Explain why the page is not duplicate content.
- If overlap exists, propose a differentiated angle first.

Same topic is fine. Same intent is duplication. Different intent is a cluster expansion.

### Step 2 — Plan
Write a numbered plan: which files change, what changes, why.
For route/category/layout changes: confirm URL impact and sitemap effect.
For SEO changes: confirm canonical and OG tag impact.

### Step 3 — Confirm
If task touches routes, categories, layout, sitemap, or nginx → wait for explicit approval.
If task is minor style or content change → proceed after showing the plan.

### Step 4 — Execute
Make the MINIMUM changes to accomplish the task.
Do NOT refactor unrelated code.
Do NOT rename variables, move files, or reorganise unless explicitly asked.
Do NOT upgrade dependencies unless explicitly asked.

### Step 5 — Verify
- No routes broken
- No category slugs changed
- No frontmatter fields removed
- Build would succeed (npm run build)

### Step 6 — Document
If structural changes were made, update the relevant docs/*.md file.

---

## SEO Structure and Internal Linking Rules

The site must follow this internal linking authority structure:

Hub Pages
   
Strong Articles
   
Opportunity Articles
   
Weak Articles
   
Related Articles
   
Back to Hub / Category / Guide

Definitions:

Hub Pages:
- Homepage (`/`)
- Resources Hub (`/tag/deployment`)
- Community (`/community`)
- Blog index (`/blog`)
- Category pages (`/category/*`)
- Guide pages (`/guides/*`)

Strong Articles:
- Articles with highest impressions, clicks, or internal links
- These pages should link to opportunity and weak articles

Opportunity Articles:
- Articles with impressions but low clicks or mid rankings
- These should receive links from strong articles
- These should link to weak articles and related articles

Weak Articles:
- Articles with low impressions or weak internal linking support
- These should receive links from strong and opportunity articles
- These must link back to hub, category, guide, and related articles

Related Articles:
- Articles within the same topic cluster
- These should link sideways within the same cluster

Internal linking rules:

1. Every article must contain contextual internal links inside the article content.
2. Footer and template links are not enough.
3. Every article must link to:
   - Resources hub (`/tag/deployment`)
   - Its category page
   - Its primary guide/pillar page
   - At least 2 related articles
4. Prefer linking within the same topic cluster first.
5. Default contextual link priority order is:
   - Same cluster articles
   - Guide
   - Category
   - Hub
   - Strong article
6. Strong articles should link to opportunity and weak articles.
7. Weak articles must link back to hub, category, and guide.
8. Do not create random links across unrelated topics.
9. Do not change URLs, categories, guides, or site structure when adding links.
10. Do not create geographic-specific clusters; keep the site global and developer-focused.
11. Goal is to build strong topic clusters and internal authority flow.

Minimum contextual links per article:
- 1 hub link
- 1 category link
- 1 guide link
- 2 related article links
- Minimum total: 5 contextual internal links per article.

---

## New Article Publishing Checklist

Before publishing any new article, ensure:

1. Article is assigned to the correct category.
2. Article is associated with a relevant guide/pillar if applicable.
3. Article contains contextual links to:
   - At least 2 related articles
   - Guide/pillar page
   - Category page
   - Resources hub
4. Article follows the default contextual link priority order:
   - Same cluster articles
   - Guide
   - Category
   - Hub
   - Strong article
5. Article links mostly to articles within the same topic cluster.
6. Article includes at least 5 contextual internal links.
7. Article should help strengthen a topic cluster, not exist in isolation.
8. After publishing, ensure the article appears in:
   - Category page
   - Guide page (if applicable)
   - Related articles section
   - Sitemap
9. Do not publish articles that are isolated from the internal linking structure.

---

## Topic Cluster Strategy

Articles should be organized into clusters such as:

- Self hosting
- VPS / cloud
- Deployment Platforms
- Security / VPS hardening
- Automation / AI / n8n
- Developer Tools
- Web Development / Next.js
- SaaS / Indie Hackers

New articles should be added to existing clusters and linked to related cluster articles.

---

## Goal of Site Structure

The site should follow this crawl and authority flow:

Homepage
   
Resources Hub
   
Community / Blog
   
Categories
   
Guides
   
Strong Articles
   
Opportunity Articles
   
Weak Articles
   
Related Articles
   
Back to Hub / Category / Guide

This structure must be preserved for all future content and internal linking.

---

## Sensitive Areas

| Area | File(s) | Risk |
|------|---------|------|
| Category system | lib/categories.ts | Slug changes = URL 404s = SEO loss |
| Post data model | lib/posts.ts | All pages depend on Post interface |
| Site URL | lib/site.ts + multiple files | Controls all canonical + OG URLs |
| Root metadata | app/layout.tsx | Affects every page SEO |
| Sitemap | app/sitemap.ts | Controls what Google indexes |
| Redirects | next.config.js | Wrong change = broken legacy URLs |
| Nginx config | nginx.conf | Wrong change = site down |
| PM2 config | ecosystem.config.js | Wrong change = app won't restart |
| Post slugs | content/posts/*.mdx filenames | Rename = 404 for indexed URLs |
| featured: true | any .mdx frontmatter | Too many featured posts skews homepage |

---

## Documentation Update Rules

| Change Made | Update These Docs |
|-------------|------------------|
| New route added | docs/STRUCTURE.md + docs/SITEMAP.md |
| New category added | docs/CONTENT_MODEL.md + docs/SITEMAP.md + docs/ARTICLE_RULES.md |
| Post interface changed | docs/CONTENT_MODEL.md |
| New env variable | docs/DEPLOY.md + .env.example |
| New known bug | docs/KNOWN_ISSUES.md |
| Nginx/PM2 config changed | docs/DEPLOY.md |
| New MDX component | docs/CONTENT_MODEL.md |
| SEO logic changed | docs/SEO_RULES.md |
| Redirect added/removed | docs/SITEMAP.md |

---

## Definition of Done

A task is complete when ALL of these are true:
- [ ] The requested feature/fix works correctly
- [ ] No existing routes, slugs, or category names were changed
- [ ] TypeScript build would succeed without errors
- [ ] No unrelated code was modified
- [ ] Relevant docs updated if structural changes were made
- [ ] Agent clearly states exactly what was changed and why

---

## Production Context

- Live site: https://blixamo.com (Hetzner VPS, Helsinki)
- VPS: 204.168.203.255 (current Blixamo server IP)
- Deploy: cd /var/www/blixamo && npm run build && pm2 reload blixamo
- SSH alias: `blixamo`
- Remote app path: `/var/www/blixamo`
- After editing any file, run: `bash /var/www/blixamo/build.sh`
- Google has indexed all 44 posts. URL changes = ranking loss.
- Prefer a safe small change over an elegant large refactor.
- When in doubt: do less, document more, ask.

## Deployment

- Remote host: `blixamo`
- App path: `/var/www/blixamo`
- Deploy command: `ssh blixamo "bash /var/www/blixamo/build.sh"`

## After Editing Code

1. Commit changes
2. Push to `master`
3. Run deploy command
4. Verify health endpoint returns `200`




