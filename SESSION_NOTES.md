# BLIXAMO SESSION NOTES — March 19, 2026
# Read this at the start of every new Claude session

## TOOLS BUILT THIS SESSION (all in /var/www/blixamo/tools/)

### 1. blixamo-checker.js — Master health checker
- 5 modules: errors, bugs, articles, health, infra
- Covers 28/30 ARTICLE_RULES.md rules
- Cron: hourly health, 8am full+fix, 9am errors+bugs
- Run: node tools/blixamo-checker.js [--health|--articles|--infra|--errors|--bugs] [--fix]

### 2. blixamo-ai-fixer.js — Article structural fixer
- Fixes: hook (R5), TL;DR (R11), FAQ (R7), troubleshooting (R4), What Next (R14)
- Fixes: banned words (R15), EUR+INR pricing (R21), disclosure (R18), code blocks (R22)
- Checks: word count guide (R3), readability (R16), LSI (R19), clusters (R23), schema (R24)
- Run: node tools/blixamo-ai-fixer.js [--slug <slug>] [--dry]
- NOTE: needs ANTHROPIC_API_KEY in .env.local — not set yet

### 3. blixamo-context-builder.js — Real data extractor
- Reads all 15 articles, extracts Ankit's REAL numbers
- Real data: Rs 465/mo, 306ms load, 550MB for 5 apps, 13 OOM restarts, 4/6 cards failed
- Used by scu-fixer as source of truth — NEVER fabricates
- Run: node tools/blixamo-context-builder.js (outputs JSON)

### 4. blixamo-scu-fixer.js — Quality fixer (SCU + Links + E-E-A-T)
- Architecture: dump → Claude reads → generates patch → apply
- 3 modes: audit, dump, apply --patch '{json}'
- Claude (this session) generates content from real data — no API key needed on VPS
- Run: node tools/blixamo-scu-fixer.js [--slug <slug>] --mode [audit|dump|apply] [--patch '{}']
- IMPORTANT: pay-hetzner-from-india already patched (8 SCU blocks added, links fixed)

### 5. blixamo-next-article.js — Bayesian article picker
- EV = P(rank) × estimated_traffic × revenue_multiplier
- Category balance: target 5 per category, penalties for over/under
- 30 articles in pipeline, 7 from today's session added
- Run: node tools/blixamo-next-article.js [--top N] [--gsc]

## ARTICLE QUALITY STATUS (as of this session)
- 15 articles live, all published March 16 2026
- Average score: 4.4/10 before fixes, pay-hetzner-from-india now 6/10 after SCU fix
- BIGGEST GAP across all articles: R5 (hook not first-person), R26 (no SCU blocks)
- scu-fixer workflow: run dump on each slug → paste to new Claude session → apply patch

## CATEGORY BALANCE RIGHT NOW
- tutorials:  3/5 published
- tech:       3/5 published
- tools:      3/5 published
- indie-dev:  3/5 published
- ai:         3/5 published
- Target: 5 each = 25 total articles

## 7 ARTICLES TO WRITE FROM TODAY'S SESSION (real experience, high EV)
Write in this order (3 days apart per Rule 28):
1. self-healing-vps-monitoring-nodejs     [tech]      Mar 21 — PARTIALLY STARTED
2. scu-blocks-ai-overview-seo-2026        [tutorials] Mar 24
3. ai-generated-content-seo-fix-2026      [tools]     Mar 27
4. automated-seo-checker-blog-nodejs      [tutorials] Mar 30
5. vps-bayesian-supervisor-auto-heal      [tech]      Apr 2
6. bayesian-content-strategy-blog-2026   [tutorials] Apr 5
7. ai-article-fixer-claude-api-automation [ai]        Apr 8

## AFTER THOSE 7 — 4 MORE TO BALANCE ALL CATEGORIES TO 5
8. building-saas-india-2026        [indie-dev] — highest EV overall (1882)
9. stripe-india-indie-developer    [indie-dev]
10. cursor-vs-github-copilot-indie-dev [tools]
11. claude-api-python-tutorial     [ai]

## WHAT 28/30 RULES MEANS
- R17 (search intent) = can't automate, needs Google search before writing
- R28 (cadence) = human discipline, 3 days minimum between publishes
- R29 (extraction test) = paste first 200w into ChatGPT, check it answers keyword standalone
- Everything else = checker detects, ai-fixer or scu-fixer fixes

## HOW TO WRITE A NEW ARTICLE (full workflow)
1. node tools/blixamo-next-article.js       ← pick highest EV topic
2. node tools/blixamo-scu-fixer.js --slug <existing-related> --mode dump  ← get real data
3. Tell Claude: "write article: <slug>" — Claude reads real data, writes full MDX
4. Save to /var/www/blixamo/content/posts/<slug>.mdx
5. Watcher auto-deploys in 1 second, GSC auto-submitted
6. node tools/blixamo-ai-fixer.js --slug <slug> --dry  ← check quality
7. node tools/blixamo-ai-fixer.js --slug <slug>        ← auto-fix what it can
8. node tools/blixamo-scu-fixer.js --slug <slug> --mode audit ← check SCU/links/EEAT
9. Run R29 extraction test manually in ChatGPT
10. Tweet it, update cluster hub with backlink

## VPS REAL DATA (use in every article — never fabricate)
- Server: Hetzner CPX22, 2vCPU, 4GB RAM, 75GB SSD, Helsinki — €5.19/mo (Rs 465)
- RAM idle: ~400MB OS, 3.3GB usable
- 5 projects total RAM: ~550MB, 2.75GB headroom
- blixamo.com: 306ms avg load, live March 2026
- India+Cloudflare: 280-350ms. Without CDN: 800-1200ms
- n8n: ~80MB idle, ~180MB queue+Redis, peaks 250-350MB
- 2GB swap: added after 13 PM2 OOM restarts in one week during builds
- Niyo KYC: 5-7 min from download to working virtual card
- Kotak 811: failed auto-renewal 2/5 times
- 4/6 Indian cards declined on Hetzner (RBI 3DS)
- DigitalOcean 2GB was Rs 1,700/mo → Hetzner 4GB: Rs 465/mo
- Wise saves ~Rs 800 per $1,000 vs Payoneer
- WhatsApp bot: under 3 seconds via Claude API on n8n
- Zapier was Rs 7,400/mo → self-hosted n8n: Rs 0/mo
- SSH brute-force within 3 hours on fresh VPS — confirmed from logs
- Ubuntu 24.04, Next.js 15, Coolify v4, Claude Sonnet 4.5
- PM2 blixamo: 77 restarts (ISR-related, not crashes)

## PROTECTION LAYERS (how server stays up automatically)
1. Hetzner hardware SLA
2. UFW firewall + fail2ban + certbot auto-renew
3. PM2 autorestart + systemd + Docker --restart + 2GB swap
4. blixamo-checker.js (cron hourly) + blixamo-supervisor.js (cron 30min)
5. Gmail escalation via n8n when auto-fix fails 3x
6. Daily backup at 2am → /var/backups/blixamo (7 days kept)

## SELF-HEALING SYSTEM (checker + supervisor)
- Checker: Bayesian hypothesis table, posterior scoring, LAW1-4 anti-loop
- Supervisor: LAW1-6, SELF_HEAL_BUDGET=5/24h, THRASH_MAX=3/2h, MIN_CONFIDENCE=0.25
- Escalation: n8n webhook → Gmail when budget exhausted or stuck 3 runs
- Supervisor crashes 3x in a row → reboots VPS

## INTERNAL LINKS MAP (all live articles)
/blog/pay-hetzner-from-india → "how to pay for Hetzner from India with Niyo Global"
/blog/multiple-projects-single-vps → "how I run 5 side projects on a single 4GB Hetzner VPS"
/blog/deploy-nextjs-coolify-hetzner → "deploying Next.js with Coolify on Hetzner"
/blog/indian-debit-cards-dev-tools → "Indian debit cards for developer subscriptions"
/blog/coolify-vs-caprover-2026 → "Coolify vs Caprover full comparison"
/blog/free-tools-indian-indie-developer → "free tools for Indian indie developers in 2026"
/blog/nextjs-mdx-blog-2026 → "how I built this blog with Next.js and MDX"
/blog/whatsapp-ai-assistant-n8n-claude-api → "WhatsApp AI assistant built with n8n and Claude API"
/blog/n8n-vs-make-vs-zapier-indie-dev → "n8n vs Make vs Zapier for indie developers"
/blog/hetzner-vs-digitalocean-vs-vultr-india → "Hetzner vs DigitalOcean vs Vultr for Indian developers"
/blog/self-hosting-n8n-hetzner-vps → "self-hosting n8n on Hetzner VPS"
/blog/vps-security-harden-ubuntu-2026 → "VPS security hardening guide for Ubuntu 2026"
/blog/claude-api-vs-openai-cost-india → "Claude API vs OpenAI cost comparison for Indian developers"
/blog/wise-vs-payoneer-india-freelancer → "Wise vs Payoneer for Indian freelancers"
/blog/build-telegram-bot-claude-api-python → "building a Telegram bot with Claude API and Python"

## NEXT SESSION — START HERE
1. Read this file
2. Run: node tools/blixamo-checker.js --health (check VPS state)
3. Run: node tools/blixamo-next-article.js (confirm next article)
4. Say: "write self-healing-vps-monitoring-nodejs" to start article #1
5. The partial MDX was deleted — start fresh from scratch
# Auto-deploy test Wed Mar 25 06:32:28 AM UTC 2026
