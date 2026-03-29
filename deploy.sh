#!/bin/bash
set -e

APP_DIR="/var/www/blixamo"
BRANCH="master"
LOG="/var/log/blixamo-deploy.log"

echo "[$(date)] Deploy started" >> $LOG

cd $APP_DIR

echo "==> Fetching latest code" >> $LOG
git fetch origin $BRANCH >> $LOG 2>&1
git reset --hard origin/$BRANCH >> $LOG 2>&1

echo "==> Installing dependencies" >> $LOG
npm install --frozen-lockfile >> $LOG 2>&1 || npm install >> $LOG 2>&1

echo "==> Building Next.js" >> $LOG
npm run build >> $LOG 2>&1

echo "==> Validating sitemap" >> $LOG
node scripts/validate-sitemap.js >> $LOG 2>&1

echo "==> Reloading PM2" >> $LOG
pm2 reload blixamo >> $LOG 2>&1

echo "==> Health check" >> $LOG
sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
  echo "[$(date)] Deploy SUCCESS — HTTP $STATUS" >> $LOG
else
  echo "[$(date)] Deploy FAILED — HTTP $STATUS" >> $LOG
  exit 1
fi
