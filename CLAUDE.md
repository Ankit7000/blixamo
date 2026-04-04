# Blixamo — Claude Desktop Session Instructions

Read this file at the start of every session. It tells you how to access the server,
how to deploy, and what the rules are for this project.

---

## 1. Who You Are Talking To

Ankit — indie developer from Surat, India.
Building blixamo.com — a global Next.js developer blog.

---

## 2. Server Access

| Field        | Value                          |
|--------------|-------------------------------|
| IP           | 204.168.203.255               |
| User         | bot (full passwordless sudo)  |
| SSH alias    | `blixamo`                     |
| Key          | `C:\Users\ankit\.ssh\blixamo_bot` |
| App path     | `/var/www/blixamo`            |
| Stack        | Next.js 15 + PM2 + nginx + Cloudflare |

**Simple SSH command (use this always):**
```
ssh blixamo "your command here"
```

**SCP command:**
```
scp localfile.tgz blixamo:/var/www/blixamo/
```

> Firewall note: Port 22 only allows local IP 152.59.16.91.
> Claude Desktop connects from the local machine so SSH always works.
> GitHub Actions CANNOT SSH in — it uses the webhook instead.

---

## 3. How to Deploy After Editing Files

### Rule: Always end every session with a deploy.

**After editing ANY file on the server (direct SSH edit):**
```bash
ssh blixamo "bash /var/www/blixamo/build.sh"
```
This runs: npm install → npm run build → sitemap validate → pm2 reload → health check.
**Never run these steps manually one by one. Always use build.sh.**

**After SCP-deploying a tarball:**
```bash
# 1. Tar the changed files locally
tar -czf deploy.tgz app/page.tsx lib/resources.ts   # list your changed files

# 2. SCP to server
scp deploy.tgz blixamo:/var/www/blixamo/

# 3. Extract + build in one command
ssh blixamo "cd /var/www/blixamo && tar -xzf deploy.tgz && rm deploy.tgz && bash build.sh"
```

**After a git push (auto — you do nothing):**
```
git push → GitHub Actions → POST blixamo.com/deploy → webhook → deploy.sh (git pull + build)
```

---

## 4. Deploy Verification

After every deploy, confirm these pass:
```bash
ssh blixamo "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
# Expected: 200

ssh blixamo "node /var/www/blixamo/scripts/validate-sitemap.js 2>&1 | tail -5"
# Expected: total: 74, duplicates: none, unexpected: none, missing: none
```

Or check the deploy log:
```bash
ssh blixamo "tail -10 /var/log/blixamo-deploy.log"
```

---

## 5. Key File Paths on Server

| Path | Purpose |
|------|---------|
| `/var/www/blixamo/` | App root |
| `/var/www/blixamo/content/posts/` | MDX blog posts |
| `/var/www/blixamo/app/` | Next.js App Router pages |
| `/var/www/blixamo/lib/` | Data layer — see rules below |
| `/var/www/blixamo/public/images/posts/` | Featured images |
| `/var/www/blixamo/build.sh` | Build + reload script |
| `/var/www/blixamo/deploy.sh` | Git pull + build (used by webhook) |
| `/var/log/blixamo-deploy.log` | Deploy log |

---

## 6. Data Layer Rules — DO NOT touch these without explicit instruction

- `lib/pillars.ts` — pillar page definitions
- `lib/resources.ts` — resource hub content
- `lib/posts.ts` — MDX post loader
- `lib/categories.ts` — category metadata
- `lib/sitemap.ts` — sitemap builder

Only edit these files if Ankit explicitly asks. They are the source of truth for site structure.

---

## 7. Sitemap Lock — 74 URLs

The sitemap must always have exactly 74 URLs after deploy:
- core: 3 (/, /about, /blog)
- hub: 1 (/tag/deployment)
- community: 1 (/community)
- categories: 9 (/category/*)
- guides: 7 (/guides/*)
- posts: 53 (/blog/*)

If validate-sitemap.js reports anything other than `total: 74` — stop and tell Ankit before proceeding.

---

## 8. Blog Post Rules (summary — full rules in docs/ARTICLE_RULES.md)

- Posts are MDX files in `content/posts/[slug].mdx`
- blixamo is a GLOBAL dev blog — never add "India" to titles unless post is genuinely India-exclusive
- Every new post needs a featured image: `public/images/posts/[slug]/featured.png`
- Featured image tool: Ideogram v2 · Render 3D · 16:9 · Dark theme
- Color by category:
  - ai = #7c3aed
  - tools = #d97706
  - tutorials = #0891b2
  - tech = #059669
  - indie-dev = #e11d48

---

## 9. PM2 Commands

```bash
ssh blixamo "sudo pm2 status"                    # app health
ssh blixamo "sudo pm2 logs blixamo --lines 50"   # recent logs
ssh blixamo "sudo pm2 reload blixamo"            # reload without build (config changes only)
```

---

## 10. What NOT to Do

- Never run `git clean -fd` on the server
- Never run `npm run build` manually — always use `build.sh`
- Never edit `lib/posts.ts`, `lib/pillars.ts`, `lib/resources.ts`, `lib/categories.ts` without explicit ask
- Never add new npm packages without checking `package.json` first
- Never leave the server in an unbuilt state after editing files
- Never change sitemap total away from 74 without discussing with Ankit

---

## 11. Local Machine (Windows)

| Path | Purpose |
|------|---------|
| `D:\blixamo\` | Local repo |
| `C:\Users\ankit\.ssh\blixamo_bot` | SSH private key |
| `C:\Users\ankit\.ssh\config` | SSH aliases |

PowerShell deploy aliases (available after `. $PROFILE`):
```
blixamo-deploy   → ssh blixamo "bash /var/www/blixamo/build.sh"
blixamo-reload   → pm2 reload only
blixamo-log      → tail deploy log
blixamo-ssh      → open SSH session
```

---

## 12. Other Projects (context only — separate repos)

| Project | Stack | Status |
|---------|-------|--------|
| Fiverr: ankit70000 | AI chatbot gigs | Active |
| Khoonieratein | Hindi horror YouTube | Active |
| Dead Dominion | Unity game | In progress |
| CricPulse | FastAPI + Firebase | Not deployed |

---

## 13. Preferences

- Keep responses concise, no fluff
- Always apply Bayesian reasoning for decisions
- For VPS tasks use SCP not base64
- Start new chat per task to save context
- Always remind to generate Ideogram featured image for every new post
