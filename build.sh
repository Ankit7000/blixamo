#!/bin/bash
# ================================================
# blixamo — local build + reload (no git pull)
# Use this after Claude Desktop or Codex edits files
# directly on the server via SSH.
#
# Usage:
#   bash /var/www/blixamo/build.sh
#   or via alias: ssh blixamo "bash /var/www/blixamo/build.sh"
# ================================================
set -e

APP_DIR="/var/www/blixamo"
LOG="/var/log/blixamo-deploy.log"

echo "[$(date)] build.sh started" | tee -a $LOG

cd $APP_DIR

echo "==> Installing dependencies (if needed)" | tee -a $LOG
npm install --frozen-lockfile >> $LOG 2>&1 || npm install >> $LOG 2>&1

echo "==> Building Next.js" | tee -a $LOG
npm run build 2>&1 | tee -a $LOG

echo "==> Validating sitemap" | tee -a $LOG
node scripts/validate-sitemap.js 2>&1 | tee -a $LOG

echo "==> Reloading PM2 (zero downtime)" | tee -a $LOG
sudo pm2 reload blixamo 2>&1 | tee -a $LOG

echo "==> Health check" | tee -a $LOG
sleep 2
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
  echo "[$(date)] BUILD SUCCESS — HTTP $STATUS" | tee -a $LOG
else
  echo "[$(date)] BUILD FAILED — HTTP $STATUS" | tee -a $LOG
  exit 1
fi
