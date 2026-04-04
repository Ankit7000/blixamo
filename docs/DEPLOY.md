---

## Auto-Deploy Pipeline (GitHub Actions)

Every push to `master` triggers this pipeline automatically:

```
git push origin master
       â†“
GitHub Actions triggers (.github/workflows/deploy.yml)
       â†“
SSH into root@77.42.17.13
       â†“
git fetch origin
       â†“
git reset --hard origin/master
       â†“
git clean -fd
       â†“
npm install --frozen-lockfile
       â†“
npm run build        â† STOPS HERE if build fails (site stays on old version)
       â†“
pm2 reload blixamo   â† zero-downtime reload
       â†“
health check curl localhost:3000
       â†“
âœ… Site live  OR  âŒ auto-rollback triggered
```

This flow intentionally discards untracked files and local modifications on the VPS so the working tree always matches GitHub `master` before build.

### Failure Points

| Step | What happens on failure |
|---|---|
| `git fetch` / `git reset --hard` / `git clean -fd` | Deploy stops if Git sync fails |
| `npm install` | Deploy stops â€” old code stays live |
| `npm run build` | Deploy stops â€” old code stays live âœ… safest point |
| `pm2 reload` | Deploy stops â€” site may be down, restart manually |
| Health check fails | Auto-rollback: git stash + rebuild + reload |

### Manual Rollback Steps

```bash
ssh -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13

cd /var/www/blixamo

# Option 1 â€” revert last commit
git revert HEAD --no-edit
npm run build && pm2 reload blixamo

# Option 2 â€” reset to specific commit
git log --oneline -5          # find good commit hash
git reset --hard <hash>
npm run build && pm2 reload blixamo
```

### Check Deploy Status
- GitHub Actions: https://github.com/Ankit7000/blixamo/actions
- VPS live check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
- PM2 status: `pm2 status`

---

## Verified GSC Setup

Verified on 2026-03-25 via read-only SSH checks against the live VPS.

- Live CLI: `/var/www/gsc-tool/gsc.js`
- Active credential file used by the live CLI and helper scripts: `/var/www/gsc-tool/service-account.json`
- Extra credential file present on disk but not referenced by the live scripts: `/var/www/gsc-tool/credentials.json`
- Helper scripts already present: `/var/www/gsc-tool/check-index.js`, `/var/www/gsc-tool/check-all-index.js`, `/var/www/gsc-tool/quick-check.js`
- Known input file used by helper scripts: `/var/www/gsc-tool/known-slugs.txt`

### Canonical Commands

Run directly on the VPS:

```bash
node /var/www/gsc-tool/gsc.js sitemaps
node /var/www/gsc-tool/gsc.js pages 7
node /var/www/gsc-tool/gsc.js report 7
node /var/www/gsc-tool/gsc.js inspect https://blixamo.com/blog/[slug]
node /var/www/gsc-tool/gsc.js submit
node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]
```

Run remotely from local machine:

```bash
ssh -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13 "node /var/www/gsc-tool/gsc.js sitemaps"
ssh -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13 "node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]"
```

### Safe Usage Rules

- Do not print or copy the contents of `service-account.json` or `credentials.json`.
- Do not move credential files into the repo.
- Use read-only commands first for verification: `sitemaps`, `pages`, `report`, `inspect`.
- Use write commands only after an approved publish or deploy task: `submit`, `index`.

### Current Automation Status

- No GSC cron job found in `/etc/cron*` or `/var/spool/cron/crontabs`
- No GSC systemd unit found in `/etc/systemd/system` or `/lib/systemd/system`
- No GSC shell alias found in root shell startup files

### GSC Post-Deploy Policy

- Use only the existing VPS GSC workflow: `node /var/www/gsc-tool/gsc.js ...`
- Credentials stay on the VPS only. Never expose secrets, credential contents, or token contents. Never print them. Never commit credential files.
- Do not recreate or replace the current GSC integration if `/var/www/gsc-tool/gsc.js` is working.
- Normal deploy with no new article and no major URL or content change:
  - do not run manual `index`
  - do not resubmit the sitemap repeatedly
- Newly published article:
  - verify deploy succeeded
  - verify the live URL returns HTTP 200
  - verify the URL is present in `/sitemap.xml`
  - run `submit` only if needed
  - run `index` for that one new article URL only
- Materially updated article:
  - run `index` only if the update is substantial
  - never request indexing for the same URL more than once within 7 days
- Never bulk-index the whole site.
- Never index category pages, homepage, about page, legal pages, or unchanged pages unless explicitly instructed.
- Safe limits:
  - max 1 `submit` per deploy
  - max 1 `index` per changed URL
  - max 10 indexing requests per day unless explicitly instructed
- Keep a simple VPS-side log/state so the same URL is not indexed repeatedly.
- Prefer sitemap + internal linking over manual indexing for most changes.
- Before any indexing request, confirm the page is live on production, not blocked by `robots.txt`, and has the correct canonical URL.
- After any GSC action, report exactly:
  - command run
  - URLs affected
  - whether it was read-only or state-changing
- Read-only SEO checks may use `sitemaps`, `pages`, `queries`, `report`, `inspect`, or `coverage`.
- State-changing commands stay limited to `submit` and `index`:
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
