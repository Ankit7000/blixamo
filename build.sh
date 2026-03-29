#!/usr/bin/env bash
set -euo pipefail

# ================================================
# build.sh — sync git + clean build + reload
# Canonical production deploy entrypoint.
# ================================================

APP_DIR="/var/www/blixamo"
APP_NAME="blixamo"
PORT="3000"
SITE_URL="https://blixamo.com"
LOG="/var/log/blixamo-deploy.log"
BOT_HOME="/home/bot"
PM2_HOME_DIR="/home/bot/.pm2"
BUILD_USER="$(id -un)"
BUILD_GROUP="$(id -gn)"
LOCK_FILE="/tmp/blixamo-build.lock"
VERIFY_ONLY=0
START_TS="$(date +%s)"
BRANCH=""
COMMIT_SHA=""

if [ "${1:-}" = "--verify-only" ]; then
  VERIFY_ONLY=1
elif [ "${1:-}" != "" ]; then
  echo "Unknown argument: $1" >&2
  echo "Usage: bash /var/www/blixamo/build.sh [--verify-only]" >&2
  exit 1
fi

log() {
  printf '[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" | tee -a "$LOG"
}

run_logged() {
  local label="$1"
  shift
  log "==> $label"
  "$@" 2>&1 | tee -a "$LOG"
}

fail() {
  log "ERROR: $*"
  exit 1
}

run_pm2() {
  env HOME="$BOT_HOME" PM2_HOME="$PM2_HOME_DIR" PM2_DISABLE_COLORS=1 pm2 "$@"
}

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

verify_build_artifacts() {
  log "==> Validate critical build artifacts"

  [ -f "$APP_DIR/.next/BUILD_ID" ] || fail "Missing .next/BUILD_ID after build"
  [ -d "$APP_DIR/.next/server" ] || fail "Missing .next/server after build"
  [ -f "$APP_DIR/.next/server/app/blog/page/[page]/page.js" ] || fail "Missing paginated blog route artifact after build"
}

fetch_sitemap_to_file() {
  local output_file="$1"
  curl -fsS "$SITE_URL/sitemap.xml" -o "$output_file"
}

detect_known_article_url() {
  local sitemap_file="$1"
  local article_url

  article_url="$(grep -Eo 'https://blixamo\.com/blog/[^<]+' "$sitemap_file" | grep -Ev '/blog/page/' | head -n 1 || true)"
  if [ -n "$article_url" ]; then
    printf '%s\n' "$article_url"
    return
  fi

  local first_post=""
  first_post="$(find "$APP_DIR/content/posts" -maxdepth 1 -type f \( -name '*.mdx' -o -name '*.md' \) | sort | head -n 1 || true)"
  if [ -n "$first_post" ]; then
    printf '%s/blog/%s\n' "$SITE_URL" "$(basename "$first_post" | sed -E 's/\.(md|mdx)$//')"
    return
  fi

  fail "Unable to detect a known article URL for verification"
}

check_http_status() {
  local url="$1"
  local expected_status="$2"
  local actual_status

  actual_status="$(curl -sS -o /dev/null -w '%{http_code}' "$url")"
  if [ "$actual_status" != "$expected_status" ]; then
    fail "Expected HTTP $expected_status for $url but got $actual_status"
  fi

  log "HTTP $expected_status OK: $url"
}

verify_pm2_online() {
  log "==> Verify PM2 status"

  local describe_output
  local sanitized_output
  describe_output="$(run_pm2 describe "$APP_NAME" 2>&1)" || fail "pm2 describe $APP_NAME failed"
  sanitized_output="$(printf '%s\n' "$describe_output" | sed 's/[^[:alnum:][:space:].:_\/-]//g')"

  if ! printf '%s\n' "$sanitized_output" | grep -Eiq 'status[[:space:]]+online'; then
    printf '%s\n' "$describe_output" | tee -a "$LOG"
    fail "PM2 app $APP_NAME is not online"
  fi

  log "PM2 status online: $APP_NAME"
}

verify_sitemap_http() {
  log "==> Verify sitemap contents"

  local sitemap_file
  sitemap_file="$(mktemp)"

  fetch_sitemap_to_file "$sitemap_file" || fail "Failed to fetch sitemap.xml"

  grep -Eq 'https://blixamo\.com/?<' "$sitemap_file" || fail "Homepage URL missing from sitemap.xml"
  grep -Eq 'https://blixamo\.com/blog/[^<]+' "$sitemap_file" || fail "No article URLs found in sitemap.xml"
  if grep -Fq '/blog/page/' "$sitemap_file"; then
    fail "Pagination URLs must not appear in sitemap.xml"
  fi

  KNOWN_ARTICLE_URL="$(detect_known_article_url "$sitemap_file")"
  rm -f "$sitemap_file"
  log "Known article selected for verification: $KNOWN_ARTICLE_URL"
}

verify_http_endpoints() {
  log "==> Verify public HTTP endpoints"

  check_http_status "$SITE_URL/" "200"
  check_http_status "$SITE_URL/blog" "200"
  check_http_status "$SITE_URL/blog/page/2" "200"
  check_http_status "$SITE_URL/sitemap.xml" "200"
  check_http_status "$KNOWN_ARTICLE_URL" "200"
  check_http_status "$SITE_URL/blog/page/abc" "404"
}

verify_deploy() {
  verify_build_artifacts
  verify_pm2_online
  verify_sitemap_http
  verify_http_endpoints
  log "Health checks passed"
}

cd "$APP_DIR"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "Another Blixamo deploy is already running"
  exit 1
fi

if [ "$VERIFY_ONLY" -eq 1 ]; then
  log "==== BLIXAMO VERIFY START ===="
  BRANCH="$(git branch --show-current 2>/dev/null || true)"
  COMMIT_SHA="$(git rev-parse --short HEAD 2>/dev/null || true)"
  log "Branch deployed: ${BRANCH:-unknown}"
  log "Commit SHA deployed: ${COMMIT_SHA:-unknown}"
  verify_deploy
  END_TS="$(date +%s)"
  log "Verification duration: $((END_TS - START_TS))s"
  log "Deploy completed successfully"
  log "==== BLIXAMO VERIFY END ===="
  exit 0
fi

log "==== BLIXAMO DEPLOY START ===="
log "Deploy start"

run_logged "Fetch latest code" git fetch origin

BRANCH="$(detect_deploy_branch)"
if [ -z "$BRANCH" ]; then
  fail "Unable to detect deploy branch from origin"
fi

run_logged "Reset to origin/$BRANCH" git reset --hard "origin/$BRANCH"
COMMIT_SHA="$(git rev-parse --short HEAD)"
log "Branch deployed: $BRANCH"
log "Commit SHA deployed: $COMMIT_SHA"

run_logged "Clean untracked files" git clean -fd

log "==> Remove stale Next.js build output"
if [ -d "$APP_DIR/.next" ]; then
  sudo chown -R "$BUILD_USER:$BUILD_GROUP" "$APP_DIR/.next" 2>&1 | tee -a "$LOG"
fi
rm -rf "$APP_DIR/.next" 2>&1 | tee -a "$LOG"

run_logged "Install dependencies" npm ci

run_logged "Build Next.js" npm run build
log "Build success"

verify_build_artifacts

run_logged "Validate sitemap" node scripts/validate-sitemap.js

log "==> Reload PM2"
run_pm2 reload "$APP_NAME" --update-env 2>&1 | tee -a "$LOG" || run_pm2 start ecosystem.config.js --only "$APP_NAME" 2>&1 | tee -a "$LOG"
log "PM2 reload success"

run_logged "Save PM2 process list" run_pm2 save

sleep 3
verify_deploy

END_TS="$(date +%s)"
log "Deploy duration: $((END_TS - START_TS))s"
log "Deploy completed successfully"
log "==== BLIXAMO DEPLOY END ===="
