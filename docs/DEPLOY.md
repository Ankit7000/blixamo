---

## Auto-Deploy Pipeline (GitHub Actions)

The deploy workflow is temporarily set to `workflow_dispatch` only while the GitHub Actions SSH key is re-verified on the current VPS. After one successful manual Actions deploy against the current server, restore the push trigger for `master`.

```
git push origin master
       â†“
GitHub Actions workflow is started manually from Actions â†’ Run workflow
       â†“
SSH into bot@204.168.203.255
       â†“
run bash /var/www/blixamo/build.sh
       â†“
build script syncs repo, builds, reloads PM2, and checks health
       â†“
âœ… Site live
```

The workflow now validates the required GitHub Actions configuration before opening SSH:

- repository variable `BLIXAMO_SSH_HOST`
- repository variable `BLIXAMO_SSH_USER`
- repository variable `BLIXAMO_SSH_PORT`
- repository secret `BLIXAMO_SSH_KEY`

Current production values:

- `BLIXAMO_SSH_HOST=204.168.203.255`
- `BLIXAMO_SSH_USER=bot`
- `BLIXAMO_SSH_PORT=22`
- `BLIXAMO_SSH_KEY` must contain the full private key from `C:\Users\ankit\.ssh\blixamo_actions_nopass`

The build script on the VPS remains the source of truth for sync, build, reload, and health checks.

Temporary safety note:

- The previous GitHub Actions key failed because it was passphrase-protected.
- GitHub Actions can offer the public key to the server, but non-interactive SSH cannot answer a passphrase prompt.
- Use a dedicated no-passphrase deploy key for GitHub Actions only.
- Keep deploy manual until one GitHub Actions run succeeds with the new no-passphrase key and server settings.
- After that, re-enable the `push` trigger for `master`.

### Create A New No-Passphrase GitHub Actions Key

Run this exact PowerShell command on the local machine:

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\blixamo_actions_nopass -C "blixamo-actions-nopass"
```

Important:

- When prompted for a passphrase, press `Enter`.
- When prompted to confirm the passphrase, press `Enter` again.
- The goal is an empty passphrase.

Expected files:

- `C:\Users\ankit\.ssh\blixamo_actions_nopass`
- `C:\Users\ankit\.ssh\blixamo_actions_nopass.pub`

### Verify The New Key

Run these exact PowerShell commands:

1. Show the public key:

```powershell
Get-Content $env:USERPROFILE\.ssh\blixamo_actions_nopass.pub
```

2. Verify the private key does not prompt for a passphrase:

```powershell
ssh-keygen -y -f $env:USERPROFILE\.ssh\blixamo_actions_nopass
```

3. Verify SSH login works with the new key:

```powershell
ssh -i $env:USERPROFILE\.ssh\blixamo_actions_nopass bot@204.168.203.255 "echo SSH_OK && whoami && hostname"
```

### Authorize The New Key On The VPS

SSH to the VPS and append the new public key to `/home/bot/.ssh/authorized_keys`:

```bash
cat >> /home/bot/.ssh/authorized_keys
```

Paste the full public key line from `C:\Users\ankit\.ssh\blixamo_actions_nopass.pub`, then press `Ctrl+D`.

Fix ownership and permissions:

```bash
chown bot:bot /home/bot/.ssh/authorized_keys
chmod 600 /home/bot/.ssh/authorized_keys
```

Optional verification:

```bash
tail -n 2 /home/bot/.ssh/authorized_keys
```

### Update The GitHub Secret

Replace the repository secret:

- `BLIXAMO_SSH_KEY`

with the full contents of:

- `C:\Users\ankit\.ssh\blixamo_actions_nopass`

Important:

- This must be the private key, not the `.pub` file.
- The pasted secret should begin with `-----BEGIN OPENSSH PRIVATE KEY-----`
- The pasted secret should end with `-----END OPENSSH PRIVATE KEY-----`

### Next GitHub Actions Test

After updating `BLIXAMO_SSH_KEY`:

1. Run `Deploy to VPS` manually with `workflow_dispatch`.
2. Confirm the SSH step passes.
3. Confirm the workflow reaches:

```bash
bash /var/www/blixamo/build.sh
```

4. Keep push-based deploy disabled until this manual run succeeds once.

### Failure Points

| Step | What happens on failure |
|---|---|
| Missing GitHub variable/secret | Workflow fails immediately with a named config error |
| SSH port check | Workflow fails early if the host or port is unreachable |
| SSH authentication | Workflow stops before deploy if the key or user is wrong |
| `bash /var/www/blixamo/build.sh` | Deploy stops if repo sync, build, PM2 reload, or health checks fail |

### Manual Rollback Steps

```bash
ssh -i C:\Users\ankit\.ssh\blixamo_bot bot@204.168.203.255

cd /var/www/blixamo

# Option 1 â€” revert last commit
git revert HEAD --no-edit
bash /var/www/blixamo/build.sh

# Option 2 â€” reset to specific commit
git log --oneline -5          # find good commit hash
git reset --hard <hash>
bash /var/www/blixamo/build.sh
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
ssh -i C:\Users\ankit\.ssh\blixamo_bot bot@204.168.203.255 "node /var/www/gsc-tool/gsc.js sitemaps"
ssh -i C:\Users\ankit\.ssh\blixamo_bot bot@204.168.203.255 "node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/[slug]"
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

---

## Subscriber Storage

- The owned subscribe flow writes to `SUBSCRIBERS_FILE`.
- Production value should point outside the repo, for example: `/home/bot/blixamo-data/subscribers.jsonl`
- The parent directory should be writable by the app process.
- Back up this file with the rest of the VPS application data. Do not store it inside the git worktree.
