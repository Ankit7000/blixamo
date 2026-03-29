# AGENTS.md â€” Rules for AI Agents (Codex, Claude Code, Cursor)

> Read this file COMPLETELY before touching any file in this repository.
> This is a PRODUCTION website. SEO and URL stability matter more than code cleanliness.

---

## Mandatory Reading Order

Before starting ANY task, read these in full â€” no exceptions:

1. `AGENTS.md` â† this file
2. `docs/STRUCTURE.md` â€” folder layout, routing, data flow, key files
3. `docs/SITEMAP.md` â€” all routes, slug list, redirects, sitemap logic
4. `docs/CONTENT_MODEL.md` â€” frontmatter schema, Post interface, 9-category system
5. `docs/SEO_RULES.md` â€” titles, canonicals, JSON-LD, OG, robots rules
6. `docs/DEPLOY.md` â€” VPS info, SSH, deploy steps, PM2, GSC indexing
7. `docs/KNOWN_ISSUES.md` â€” existing bugs, risks, debt â€” know before touching anything
8. `docs/ARTICLE_RULES.md` â€” 40 writing rules, do not override

No docs read = no code written. Non-negotiable.

---

## Critical Rules â€” Never Break These

1. Never rename a post MDX filename â€” the filename IS the URL slug. Renaming = 404 for Google-indexed URLs.
2. Never rename a category slug in lib/categories.ts â€” breaks /category/[slug] and sitemap.
3. Never remove a category from lib/categories.ts â€” breaks all posts using it.
4. Never change the Post interface in lib/posts.ts without auditing every page that uses it.
5. Never change SITE_URL or hardcoded https://blixamo.com â€” all canonicals and OG URLs depend on it.
6. Never modify nginx.conf without running nginx -t first.
7. Never change the /blog/[slug] URL pattern â€” it is the canonical post URL format.
8. Never add or remove redirects in next.config.js without documenting in docs/SITEMAP.md.
9. Never change app/sitemap.ts â€” controls what Google indexes.
10. Never change app/layout.tsx without explicit instruction â€” affects every page globally.
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

1. New blog article — OK to index
2. Major rewrite of an article — OK to index
3. New category page — usually rely on sitemap only
4. Homepage changes — do not index
5. Layout, design, or code changes — do not index
6. Minor typo or small content edits — do not index
7. Sitemap-only change — submit sitemap, do not index pages

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

### Step 1 â€” Read
Read all docs in Mandatory Reading Order. Identify every file that will be touched.

### Step 2 â€” Plan
Write a numbered plan: which files change, what changes, why.
For route/category/layout changes: confirm URL impact and sitemap effect.
For SEO changes: confirm canonical and OG tag impact.

### Step 3 â€” Confirm
If task touches routes, categories, layout, sitemap, or nginx â†’ wait for explicit approval.
If task is minor style or content change â†’ proceed after showing the plan.

### Step 4 â€” Execute
Make the MINIMUM changes to accomplish the task.
Do NOT refactor unrelated code.
Do NOT rename variables, move files, or reorganise unless explicitly asked.
Do NOT upgrade dependencies unless explicitly asked.

### Step 5 â€” Verify
- No routes broken
- No category slugs changed
- No frontmatter fields removed
- Build would succeed (npm run build)

### Step 6 â€” Document
If structural changes were made, update the relevant docs/*.md file.

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

## Blixamo deployment workflow

Deploy branch: master

After making changes:
1. Commit changes
2. Push to origin/master
3. Do not run manual deploy unless explicitly asked

Production deploy:
- GitHub Actions auto-deploys on push to master
- Remote deploy command is: bash /var/www/blixamo/build.sh

Server:
- SSH alias: blixamo
- Host: 204.168.203.255
- User: bot
- App path: /var/www/blixamo

Runtime rules:

- blixamo runs under bot PM2
- blixamo-webhook remains under root PM2
- never move the main app back to root PM2

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
- VPS: root@77.42.17.13
- Deploy: cd /var/www/blixamo && npm run build && pm2 reload blixamo
- Google has indexed all 44 posts. URL changes = ranking loss.
- Prefer a safe small change over an elegant large refactor.
- When in doubt: do less, document more, ask.



