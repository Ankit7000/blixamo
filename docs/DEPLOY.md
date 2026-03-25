---

## Auto-Deploy Pipeline (GitHub Actions)

Every push to `master` triggers this pipeline automatically:

```
git push origin master
       ↓
GitHub Actions triggers (.github/workflows/deploy.yml)
       ↓
SSH into root@77.42.17.13
       ↓
git fetch origin
       ↓
git reset --hard origin/master
       ↓
git clean -fd
       ↓
npm install --frozen-lockfile
       ↓
npm run build        ← STOPS HERE if build fails (site stays on old version)
       ↓
pm2 reload blixamo   ← zero-downtime reload
       ↓
health check curl localhost:3000
       ↓
✅ Site live  OR  ❌ auto-rollback triggered
```

This flow intentionally discards untracked files and local modifications on the VPS so the working tree always matches GitHub `master` before build.

### Failure Points

| Step | What happens on failure |
|---|---|
| `git fetch` / `git reset --hard` / `git clean -fd` | Deploy stops if Git sync fails |
| `npm install` | Deploy stops — old code stays live |
| `npm run build` | Deploy stops — old code stays live ✅ safest point |
| `pm2 reload` | Deploy stops — site may be down, restart manually |
| Health check fails | Auto-rollback: git stash + rebuild + reload |

### Manual Rollback Steps

```bash
ssh -i C:\Users\ankit\.ssh\id_ed25519 root@77.42.17.13

cd /var/www/blixamo

# Option 1 — revert last commit
git revert HEAD --no-edit
npm run build && pm2 reload blixamo

# Option 2 — reset to specific commit
git log --oneline -5          # find good commit hash
git reset --hard <hash>
npm run build && pm2 reload blixamo
```

### Check Deploy Status
- GitHub Actions: https://github.com/Ankit7000/blixamo/actions
- VPS live check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
- PM2 status: `pm2 status`
