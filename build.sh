#!/usr/bin/env bash
set -Eeuo pipefail

# ================================================
# build.sh — build + reload WITHOUT git pull
# Use after Claude Desktop or Codex edits files
# directly on the server via SSH.
# ================================================

APP_DIR="/var/www/blixamo"
APP_NAME="blixamo"
PORT="3000"
LOG="/var/log/blixamo-deploy.log"
BOT_HOME="/home/bot"
PM2_HOME_DIR="/home/bot/.pm2"
BUILD_USER="$(id -un)"
BUILD_GROUP="$(id -gn)"

echo "==== BLIXAMO BUILD START ====" | tee -a "$LOG"
echo "[$(date)] build.sh triggered" | tee -a "$LOG"

cd "$APP_DIR"

echo "==> Prepare Next.js build artifacts" | tee -a "$LOG"
if [ -d "$APP_DIR/.next" ]; then
  sudo chown -R "$BUILD_USER:$BUILD_GROUP" "$APP_DIR/.next" 2>&1 | tee -a "$LOG"
  sudo find "$APP_DIR/.next" -type d -exec chmod u+rwx {} + 2>&1 | tee -a "$LOG"
  sudo find "$APP_DIR/.next" -type f -exec chmod u+rw {} + 2>&1 | tee -a "$LOG"
  sudo rm -rf "$APP_DIR/.next/cache" 2>&1 | tee -a "$LOG"
fi

echo "==> Install dependencies" | tee -a "$LOG"
npm install --frozen-lockfile 2>&1 | tee -a "$LOG" || npm install 2>&1 | tee -a "$LOG"

echo "==> Build Next.js" | tee -a "$LOG"
npm run build 2>&1 | tee -a "$LOG"

echo "==> Validate sitemap" | tee -a "$LOG"
node scripts/validate-sitemap.js 2>&1 | tee -a "$LOG"

echo "==> Reload PM2" | tee -a "$LOG"
env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" pm2 reload "$APP_NAME" 2>&1 | tee -a "$LOG" || env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" pm2 start ecosystem.config.js --only "$APP_NAME" 2>&1 | tee -a "$LOG"

echo "==> Health check" | tee -a "$LOG"
sleep 3
curl -sf "http://127.0.0.1:$PORT" >/dev/null

echo "[$(date)] BUILD SUCCESS" | tee -a "$LOG"
echo "==== BLIXAMO BUILD END ====" | tee -a "$LOG"
