# Blixamo — Codex Agent Instructions

## Server access
- SSH alias: `blixamo` (already configured in ~/.ssh/config)
- Simple SSH: `ssh blixamo "command"`
- App dir: `/var/www/blixamo`
- User: `bot` (has full passwordless sudo)

## After ANY file edit on the server — always run this:
```bash
ssh blixamo "bash /var/www/blixamo/build.sh"
```
This does: npm install → npm run build → sitemap validation → pm2 reload → health check.
Do NOT run manual `npm run build` or `pm2 reload` separately — always use build.sh.

## After git push (auto-handled)
git push → GitHub Actions → webhook → deploy.sh (git pull + build + reload)
You do NOT need to do anything after a git push.

## Scoped file deploy (SCP method — use when NOT editing directly on server)
```bash
# 1. tar the changed files
tar -czf deploy.tgz app/page.tsx lib/resources.ts ...

# 2. SCP to server
scp deploy.tgz blixamo:/var/www/blixamo/

# 3. Extract + build
ssh blixamo "cd /var/www/blixamo && tar -xzf deploy.tgz && rm deploy.tgz && bash build.sh"
```

## Key paths
| Path | Purpose |
|---|---|
| `/var/www/blixamo/content/posts/` | MDX blog posts |
| `/var/www/blixamo/app/` | Next.js app routes |
| `/var/www/blixamo/lib/` | Data layer (don't rewrite) |
| `/var/www/blixamo/public/images/posts/` | Featured images |
| `/var/log/blixamo-deploy.log` | Deploy log |

## Rules
- Never run `git clean -fd` on the server
- Never edit `lib/pillars.ts`, `lib/resources.ts`, `lib/posts.ts`, `lib/categories.ts` unless explicitly asked
- Never add new npm packages without checking package.json first
- Always run `build.sh` after any change — do not leave the server in an unbuilt state
- Sitemap must stay at 74 URLs — validate-sitemap.js will catch regressions
