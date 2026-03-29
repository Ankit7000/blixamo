#!/usr/bin/env bash
set -euo pipefail

# ================================================
# build.sh — sync git + clean build + reload
# Canonical production deploy entrypoint.
# ================================================

APP_DIR="/var/www/blixamo"
APP_NAME="blixamo"
PORT="3000"
LOG="/var/log/blixamo-deploy.log"
BOT_HOME="/home/bot"
PM2_HOME_DIR="/home/bot/.pm2"
BUILD_USER="$(id -un)"
BUILD_GROUP="$(id -gn)"
LOCK_FILE="/tmp/blixamo-build.lock"

detect_deploy_branch() {
  local current_branch=""
  current_branch="$(git branch --show-current 2>/dev/null || true)"

  if [ "$current_branch" = "master" ] || [ "$current_branch" = "main" ]; then
    printf '%s\n' "$current_branch"
    return
  fi

  if git symbolic-ref --quiet --short refs/remotes/origin/HEAD >/dev/null 2>&1; then
    git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's|^origin/||'
    return
  fi

  if git show-ref --verify --quiet refs/remotes/origin/master; then
    printf 'master\n'
    return
  fi

  if git show-ref --verify --quiet refs/remotes/origin/main; then
    printf 'main\n'
    return
  fi

  return 1
}

echo "==== BLIXAMO BUILD START ====" | tee -a "$LOG"
echo "[$(date)] build.sh triggered" | tee -a "$LOG"

cd "$APP_DIR"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another Blixamo deploy is already running" | tee -a "$LOG"
  exit 1
fi

echo "==> Fetch latest code" | tee -a "$LOG"
git fetch origin 2>&1 | tee -a "$LOG"

BRANCH="$(detect_deploy_branch)"
if [ -z "$BRANCH" ]; then
  echo "Unable to detect deploy branch from origin" | tee -a "$LOG"
  exit 1
fi

echo "==> Reset to origin/$BRANCH" | tee -a "$LOG"
git reset --hard "origin/$BRANCH" 2>&1 | tee -a "$LOG"

echo "==> Clean untracked files" | tee -a "$LOG"
git clean -fd 2>&1 | tee -a "$LOG"

echo "==> Remove stale Next.js build output" | tee -a "$LOG"
if [ -d "$APP_DIR/.next" ]; then
  sudo chown -R "$BUILD_USER:$BUILD_GROUP" "$APP_DIR/.next" 2>&1 | tee -a "$LOG"
fi
rm -rf "$APP_DIR/.next" 2>&1 | tee -a "$LOG"

echo "==> Install dependencies" | tee -a "$LOG"
npm ci 2>&1 | tee -a "$LOG"

echo "==> Build Next.js" | tee -a "$LOG"
npm run build 2>&1 | tee -a "$LOG"

echo "==> Validate critical build artifacts" | tee -a "$LOG"
if [ ! -f "$APP_DIR/.next/BUILD_ID" ]; then
  echo "Missing .next/BUILD_ID after build" | tee -a "$LOG"
  exit 1
fi
if [ ! -f "$APP_DIR/.next/server/app/blog/page/[page]/page.js" ]; then
  echo "Missing paginated blog route artifact after build" | tee -a "$LOG"
  exit 1
fi

echo "==> Validate sitemap" | tee -a "$LOG"
node scripts/validate-sitemap.js 2>&1 | tee -a "$LOG"

echo "==> Reload PM2" | tee -a "$LOG"
env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" pm2 reload "$APP_NAME" --update-env 2>&1 | tee -a "$LOG" || env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" pm2 start ecosystem.config.js --only "$APP_NAME" 2>&1 | tee -a "$LOG"

echo "==> Save PM2 process list" | tee -a "$LOG"
env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" pm2 save 2>&1 | tee -a "$LOG"

echo "==> Health check" | tee -a "$LOG"
sleep 3
curl -sf "http://127.0.0.1:$PORT" >/dev/null

echo "[$(date)] BUILD SUCCESS" | tee -a "$LOG"
echo "==== BLIXAMO BUILD END ====" | tee -a "$LOG"
