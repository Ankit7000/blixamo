#!/bin/bash
# ============================================
# Blixamo — VPS Deploy Script (Zero-Downtime)
# Usage: bash deploy.sh
# ============================================
set -e

APP_DIR="/var/www/blixamo"
LOG_DIR="/var/log/pm2"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓] $1${NC}"; }
warn() { echo -e "${YELLOW}[!] $1${NC}"; }
err()  { echo -e "${RED}[✗] $1${NC}"; exit 1; }

echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🚀  Blixamo VPS Deployment         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""

# 1. Node.js
if ! command -v node &> /dev/null; then
  warn "Node.js not found — installing v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
log "Node.js $(node --version)"

# 2. PM2
if ! command -v pm2 &> /dev/null; then
  warn "PM2 not found — installing..."
  sudo npm install -g pm2
fi
log "PM2 $(pm2 --version)"

# 3. Nginx
if ! command -v nginx &> /dev/null; then
  warn "Nginx not found — installing..."
  sudo apt-get update -qq && sudo apt-get install -y nginx
  sudo systemctl enable nginx
fi
log "Nginx installed"

# 4. Log directory
sudo mkdir -p "$LOG_DIR"
sudo chown -R "$USER:$USER" "$LOG_DIR"

# 5. App directory
log "Setting up $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"

# 6. Copy files (exclude dev artifacts)
log "Syncing project files to $APP_DIR..."
rsync -av --exclude='node_modules' --exclude='.next' --exclude='*.log' \
  --exclude='.env.local' . "$APP_DIR/"

# 7. Install deps
log "Installing dependencies..."
cd "$APP_DIR"
npm install --frozen-lockfile 2>/dev/null || npm install

# 8. Environment check
if [ ! -f .env.local ]; then
  warn "No .env.local found — copying from .env.example"
  cp .env.example .env.local
  warn "⚠️  Edit $APP_DIR/.env.local then re-run: npm run build && pm2 reload blixamo"
fi

# 9. Build
log "Building Next.js app..."
npm run build

# 10. Nginx config
log "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/blixamo
sudo ln -sf /etc/nginx/sites-available/blixamo /etc/nginx/sites-enabled/blixamo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
log "Nginx configured and reloaded"

# 11. PM2 — zero-downtime start/reload
log "Starting/reloading app with PM2..."
if pm2 describe blixamo > /dev/null 2>&1; then
  # Already running — zero-downtime reload (no dropped requests)
  pm2 reload blixamo
  log "App reloaded with zero downtime"
else
  # First deploy — start fresh
  pm2 start ecosystem.config.js
  log "App started"
fi
pm2 save

# 12. Auto-start PM2 on server reboot
PM2_STARTUP=$(pm2 startup 2>/dev/null | grep "sudo" | tail -1)
if [ -n "$PM2_STARTUP" ]; then
  eval "$PM2_STARTUP" 2>/dev/null || warn "Set PM2 startup manually: $PM2_STARTUP"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅  Blixamo deployed successfully!                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Site:          https://blixamo.com"
echo "  App port:      3000 (proxied via Nginx)"
echo "  Logs:          $LOG_DIR"
echo ""
echo "  ── Next steps ──────────────────────────────────────────"
echo "  1. Edit env:   nano $APP_DIR/.env.local"
echo "  2. Rebuild:    npm run build && pm2 reload blixamo"
echo "  3. HTTPS:      sudo apt install certbot python3-certbot-nginx -y"
echo "                 sudo certbot --nginx -d blixamo.com -d www.blixamo.com"
echo "  4. DNS:        A record blixamo.com -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_VPS_IP')"
echo ""
echo "  ── PM2 commands ────────────────────────────────────────"
echo "    pm2 status              — app health"
echo "    pm2 logs blixamo        — live logs"
echo "    pm2 reload blixamo      — zero-downtime reload"
echo "    pm2 monit               — CPU/memory dashboard"
echo ""
