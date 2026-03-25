# Blixamo — Deployment & Ops Reference
> Generated: 2026-03-25 | Status: AUTHORITATIVE

---

## VPS Details

| Detail | Value |
|---|---|
| Provider | Hetzner Cloud CPX22 (Helsinki) |
| IP | 77.42.17.13 |
| OS | Ubuntu 24.04 |
| CPU | 3 vCPU |
| RAM | 4 GB |
| SSH key | `C:\Users\ankit\.ssh\id_ed25519` |
| SSH command | `ssh -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13` |

---

## Deploy Workflow

### Normal deploy (after build-time change)
```bash
cd /var/www/blixamo
npm run build
pm2 reload blixamo
```

### Quick verify
```bash
curl -s http://localhost:3000 | head -5
pm2 status
```

### After adding a new MDX post only (no code changes)
```bash
cd /var/www/blixamo
npm run build && pm2 reload blixamo
# Then index in Google Search Console:
node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]
```

### Emergency rollback (Next.js build cached)
```bash
pm2 stop blixamo
# restore previous .next from backup if available
pm2 start blixamo
```

---

## PM2 Configuration (ecosystem.config.js)

| Setting | Value |
|---|---|
| App name | `blixamo` |
| Script | `node_modules/.bin/next start` |
| Mode | cluster, `max` instances (uses all vCPUs) |
| Port | 3000 |
| Max memory | 512 MB per instance (triggers restart) |
| Logs | `/var/log/pm2/blixamo-out.log`, `/var/log/pm2/blixamo-error.log` |
| Zero-downtime | `pm2 reload blixamo` (not `pm2 restart`) |

---

## GSC CLI Tool

Path: `/var/www/gsc-tool/gsc.js`

| Command | Purpose |
|---|---|
| `node gsc.js index <url>` | Request indexing for a specific URL |
| `node gsc.js submit` | Submit sitemap |
| `node gsc.js pages 7` | Show page performance last 7 days |
| `node gsc.js queries 7` | Show query performance last 7 days |
| `node gsc.js report 7` | Full report last 7 days |

**Rule:** Run `node gsc.js index <url>` after EVERY new post publish. Do not wait.

---

## Other Services on This VPS

| Service | Port | How to access |
|---|---|---|
| Blixamo (Next.js) | 3000 | `pm2 status` / `curl localhost:3000` |
| n8n | 5678 | Docker, `docker ps` |
| Redis | 6379 | Docker, `docker ps` |

---

## File Transfer (SCP — never base64)

```bash
# Upload file TO vps
scp -i C:\Users\ankit\.ssh\id_ed25519 local-file.mdx root@77.42.17.13:/var/www/blixamo/content/posts/

# Upload featured image
scp -i C:\Users\ankit\.ssh\id_ed25519 featured.jpg root@77.42.17.13:/var/www/blixamo/public/images/posts/[slug]/

# Download file FROM vps
scp -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13:/var/www/blixamo/content/posts/file.mdx .
```

---

## New Post Publishing Checklist

1. [ ] Write MDX with all 17 frontmatter fields (see STRUCTURE.md)
2. [ ] Category is one of the 9 canonical slugs (see STRUCTURE.md)
3. [ ] Generate featured image via Ideogram v2 (Render 3D, 16:9, Dark, 1200×630)
4. [ ] Save image to `/public/images/posts/[slug]/featured.jpg`
5. [ ] SCP post file to `/var/www/blixamo/content/posts/[slug].mdx`
6. [ ] SCP image to `/var/www/blixamo/public/images/posts/[slug]/`
7. [ ] `npm run build && pm2 reload blixamo`
8. [ ] `curl -s https://blixamo.com/blog/[slug] | grep -i title`
9. [ ] `node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]`
10. [ ] Add bidirectional internal links (3-5) per ARTICLE_RULES.md Rule 8

---

## ISR Revalidation

Force refresh a cached page without a full rebuild:

```bash
# Revalidate a specific post
curl -X GET "https://blixamo.com/api/revalidate?secret=YOUR_SECRET&slug=hetzner-vs-aws-2026"

# Revalidate everything
curl -X GET "https://blixamo.com/api/revalidate?secret=YOUR_SECRET"
```

`REVALIDATE_SECRET` is set in `.env.local`. Never share it.

---

## Known Issues / Tech Debt

| Issue | Impact | Fix |
|---|---|---|
| Posts using `tools` category | Category page `/category/tools` shows 4 posts but `tools` is not in `lib/categories.ts` — no styled category page | Migrate posts to `developer-tools` |
| Posts using `tutorials` category (11 posts) | Same — `tutorials` not in canonical list, should be `how-to` | Audit and migrate slugs |
| Posts using `indie-dev` category (1 post) | Should be `indie-hacking` | Fix frontmatter |
| Mixed image paths | Old posts use `/images/[slug].jpg`, new posts use `/images/posts/[slug]/featured.jpg` | Both work, standardise on new path |

---

## Nginx File Location

Active config: `/etc/nginx/sites-available/blixamo.com` (symlinked to `sites-enabled/`)  
The `nginx.conf` in the repo is reference only — it is NOT auto-applied.

To apply after editing:
```bash
nginx -t && systemctl reload nginx
```

---

## SSL Renewal

Certbot handles auto-renewal via systemd timer. Manual check:
```bash
certbot renew --dry-run
```

---

## Log Locations

| Log | Path |
|---|---|
| PM2 stdout | `/var/log/pm2/blixamo-out.log` |
| PM2 stderr | `/var/log/pm2/blixamo-error.log` |
| Nginx access | `/var/log/nginx/access.log` |
| Nginx error | `/var/log/nginx/error.log` |
