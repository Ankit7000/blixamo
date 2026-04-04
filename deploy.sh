#!/usr/bin/env bash
set -euo pipefail

# ================================================
# deploy.sh — git pull + build + reload
# Triggered by: GitHub Actions → webhook → this
# DO NOT run manually unless you want a git reset
# ================================================

APP_DIR="/var/www/blixamo"
BRANCH="master"
APP_NAME="blixamo"
PORT="3000"
LOG="/var/log/blixamo-deploy.log"
BOT_HOME="/home/bot"
BOT_USER="bot"
PM2_HOME_DIR="/home/bot/.pm2"
BOT_PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

run_as_bot() {
  sudo -u "$BOT_USER" env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" PATH="$BOT_PATH" "$@"
}

echo "==== BLIXAMO DEPLOY START ====" | tee -a "$LOG"
echo "[$(date)] deploy.sh triggered" | tee -a "$LOG"

cd "$APP_DIR"

echo "==> Prepare Next.js build artifacts" | tee -a "$LOG"
if [ -d "$APP_DIR/.next" ]; then
  chown -R "$BOT_USER:$BOT_USER" "$APP_DIR/.next" 2>&1 | tee -a "$LOG"
  find "$APP_DIR/.next" -type d -exec chmod u+rwx {} + 2>&1 | tee -a "$LOG"
  find "$APP_DIR/.next" -type f -exec chmod u+rw {} + 2>&1 | tee -a "$LOG"
  rm -rf "$APP_DIR/.next/cache" 2>&1 | tee -a "$LOG"
fi

echo "==> Fetch latest code" | tee -a "$LOG"
run_as_bot git fetch origin 2>&1 | tee -a "$LOG"
run_as_bot git reset --hard "origin/$BRANCH" 2>&1 | tee -a "$LOG"

echo "==> Install dependencies" | tee -a "$LOG"
run_as_bot npm install --frozen-lockfile 2>&1 | tee -a "$LOG" || run_as_bot npm install 2>&1 | tee -a "$LOG"

echo "==> Build Next.js" | tee -a "$LOG"
run_as_bot npm run build 2>&1 | tee -a "$LOG"

echo "==> Validate sitemap" | tee -a "$LOG"
run_as_bot node scripts/validate-sitemap.js 2>&1 | tee -a "$LOG"

echo "==> Reload PM2" | tee -a "$LOG"
run_as_bot pm2 reload "$APP_NAME" 2>&1 | tee -a "$LOG" || run_as_bot pm2 start ecosystem.config.js --only "$APP_NAME" 2>&1 | tee -a "$LOG"

echo "==> Health check" | tee -a "$LOG"
sleep 3
curl -sf "http://127.0.0.1:$PORT" >/dev/null

echo "[$(date)] DEPLOY SUCCESS" | tee -a "$LOG"
echo "==== BLIXAMO DEPLOY END ====" | tee -a "$LOG"
