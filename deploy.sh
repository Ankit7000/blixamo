#!/bin/bash
set -euo pipefail

APP_DIR="/var/www/blixamo"

log() {
  echo "[deploy] $1"
}

err() {
  echo "[deploy] $1" >&2
  exit 1
}

[ -d "$APP_DIR" ] || err "App directory not found: $APP_DIR"

cd "$APP_DIR"
[ -d .git ] || err "Git repository not found in $APP_DIR"

command -v git >/dev/null 2>&1 || err "git is required"
command -v npm >/dev/null 2>&1 || err "npm is required"
command -v pm2 >/dev/null 2>&1 || err "pm2 is required"

echo "==> Starting Blixamo deployment"
echo "==> App directory: $APP_DIR"

log "Step 1/6: Fetching latest code from origin/main"
git fetch origin main

log "Step 2/6: Resetting worktree to origin/main"
git reset --hard origin/main

log "Step 3/6: Installing dependencies with npm ci"
npm ci

log "Step 4/6: Removing previous .next build output"
rm -rf .next

log "Step 5/6: Building application"
npm run build

log "Step 6/6: Reloading PM2 process"
if pm2 describe blixamo >/dev/null 2>&1; then
  pm2 reload blixamo --update-env
else
  pm2 start ecosystem.config.js --only blixamo
fi

log "Saving PM2 process list"
pm2 save

echo "==> Blixamo deployment completed successfully"
