#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  BLIXAMO NEXT ARTICLE PICKER v1.0
//  Uses Bayesian EV = P(rank) × est_traffic × revenue_multiplier
//  Data sources:
//    1. Published articles (avoid cluster repetition)
//    2. GSC impressions (once site exits sandbox)
//    3. Static prior: KD + India-specificity + personal experience
//  Run: node blixamo-next-article.js
//  Run: node blixamo-next-article.js --top 5
//  Run: node blixamo-next-article.js --gsc   (include live GSC data)
// ═══════════════════════════════════════════════════════════════
"use strict";
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const POSTS_DIR = '/var/www/blixamo/content/posts';
const TOP_N     = (() => { const i = process.argv.indexOf('--top'); return i > -1 ? parseInt(process.argv[i+1]) : 3; })();
const USE_GSC   = process.argv.includes('--gsc');

// ── COLORS ──────────────────────────────────────────────────────
const C = { r:'\x1b[0m', bold:'\x1b[1m', green:'\x1b[32m', yellow:'\x1b[33m',
  cyan:'\x1b[36m', gray:'\x1b[90m', red:'\x1b[31m', magenta:'\x1b[35m', blue:'\x1b[34m' };
const clr = (c,t) => `${C[c]}${t}${C.r}`;

// ═══════════════════════════════════════════════════════════════
//  ARTICLE PIPELINE — 100+ candidates
//  Fields:
//    slug        — what the MDX filename would be
//    title       — full article title
//    keyword     — target keyword
//    cluster     — topical cluster
//    category    — tutorials|tech|tools|indie-dev|ai
//    schema      — howto|comparison|review|faq|article
//    kd          — keyword difficulty: 'very-low'|'low'|'medium'|'high'
//    india       — India-specific angle: true/false
//    hasExp      — Ankit has real personal experience: true/false
//    estTraffic  — estimated monthly visitors if ranked (conservative)
//    revMult     — revenue multiplier (affiliate potential, RPM, lead value)
//    linksTo     — existing articles this would link to (internal link value)
// ═══════════════════════════════════════════════════════════════
const PIPELINE = [

  // ── TUTORIALS ───────────────────────────────────────────────
  {
    slug:       'search-console-self-hosted-nextjs',
    title:      'How to Set Up Google Search Console on Self-Hosted Next.js (Hetzner 2026)',
    keyword:    'google search console self hosted nextjs',
    cluster:    'nextjs',
    category:   'tutorials',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,  // Ankit literally built the GSC CLI tool
    estTraffic: 400,
    revMult:    1.2,
    linksTo:    ['nextjs-mdx-blog-2026','deploy-nextjs-coolify-hetzner','multiple-projects-single-vps'],
  },
  {
    slug:       'hetzner-vps-setup-ubuntu-2026',
    title:      'How to Set Up a Hetzner VPS from Scratch in 2026 (Ubuntu 24.04)',
    keyword:    'hetzner vps setup ubuntu',
    cluster:    'hetzner/vps',
    category:   'tutorials',
    schema:     'howto',
    kd:         'low',
    india:      true,
    hasExp:     true,
    estTraffic: 600,
    revMult:    2.0,  // Hetzner affiliate = €20 per referral
    linksTo:    ['multiple-projects-single-vps','pay-hetzner-from-india','vps-security-harden-ubuntu-2026'],
  },
  {
    slug:       'nextjs-docker-hetzner-deploy',
    title:      'How to Deploy Next.js with Docker on Hetzner VPS (2026 Guide)',
    keyword:    'nextjs docker hetzner deploy',
    cluster:    'deployment',
    category:   'tutorials',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 350,
    revMult:    1.8,
    linksTo:    ['deploy-nextjs-coolify-hetzner','multiple-projects-single-vps','coolify-vs-caprover-2026'],
  },
  {
    slug:       'nginx-reverse-proxy-multiple-apps',
    title:      'How to Set Up Nginx Reverse Proxy for Multiple Apps on One VPS (2026)',
    keyword:    'nginx reverse proxy multiple apps vps',
    cluster:    'hetzner/vps',
    category:   'tutorials',
    schema:     'howto',
    kd:         'low',
    india:      false,
    hasExp:     true,
    estTraffic: 500,
    revMult:    1.5,
    linksTo:    ['multiple-projects-single-vps','deploy-nextjs-coolify-hetzner','vps-security-harden-ubuntu-2026'],
  },
  {
    slug:       'pm2-nodejs-production-guide',
    title:      'PM2 for Node.js in Production — Complete Guide 2026',
    keyword:    'pm2 nodejs production',
    cluster:    'hetzner/vps',
    category:   'tutorials',
    schema:     'howto',
    kd:         'low',
    india:      false,
    hasExp:     true,
    estTraffic: 700,
    revMult:    1.3,
    linksTo:    ['multiple-projects-single-vps','nextjs-mdx-blog-2026','vps-security-harden-ubuntu-2026'],
  },
  {
    slug:       'cloudflare-free-tier-indie-dev',
    title:      'Cloudflare Free Tier for Indie Developers — What You Actually Get in 2026',
    keyword:    'cloudflare free tier indie developer',
    cluster:    'indie-dev',
    category:   'tutorials',
    schema:     'article',
    kd:         'low',
    india:      true,
    hasExp:     true,
    estTraffic: 400,
    revMult:    1.2,
    linksTo:    ['multiple-projects-single-vps','vps-security-harden-ubuntu-2026','free-tools-indian-indie-developer'],
  },

  // ── TECH ────────────────────────────────────────────────────
  {
    slug:       'oracle-cloud-free-vs-hetzner',
    title:      'Oracle Cloud Free vs Hetzner in 2026 — Which Is Better for Indie Developers?',
    keyword:    'oracle cloud free vs hetzner',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'comparison',
    kd:         'very-low',
    india:      true,
    hasExp:     false,  // Ankit uses Hetzner, not Oracle Cloud
    estTraffic: 500,
    revMult:    2.0,
    linksTo:    ['multiple-projects-single-vps','hetzner-vs-digitalocean-vs-vultr-india','pay-hetzner-from-india'],
  },
  {
    slug:       'hetzner-arm-vs-x86-2026',
    title:      'Hetzner ARM vs x86 in 2026 — Which Server Should You Pick?',
    keyword:    'hetzner arm vs x86',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'comparison',
    kd:         'very-low',
    india:      false,
    hasExp:     false,
    estTraffic: 300,
    revMult:    2.0,
    linksTo:    ['multiple-projects-single-vps','hetzner-vs-digitalocean-vs-vultr-india'],
  },
  {
    slug:       'supabase-vs-firebase-indie-dev',
    title:      'Supabase vs Firebase for Indie Developers in 2026 — Honest Comparison',
    keyword:    'supabase vs firebase indie developer',
    cluster:    'database',
    category:   'tech',
    schema:     'comparison',
    kd:         'medium',
    india:      true,
    hasExp:     true,
    estTraffic: 800,
    revMult:    1.4,
    linksTo:    ['free-tools-indian-indie-developer','self-hosting-n8n-hetzner-vps'],
  },
  {
    slug:       'docker-compose-self-hosted-apps',
    title:      'Docker Compose for Self-Hosted Apps on Hetzner VPS (2026 Guide)',
    keyword:    'docker compose self hosted vps',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'howto',
    kd:         'low',
    india:      false,
    hasExp:     true,
    estTraffic: 550,
    revMult:    1.6,
    linksTo:    ['multiple-projects-single-vps','self-hosting-n8n-hetzner-vps','coolify-vs-caprover-2026'],
  },
  {
    slug:       'redis-self-hosted-hetzner',
    title:      'How to Self-Host Redis on Hetzner VPS in 2026',
    keyword:    'self host redis hetzner vps',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,  // Redis runs on his VPS right now
    estTraffic: 300,
    revMult:    1.5,
    linksTo:    ['self-hosting-n8n-hetzner-vps','multiple-projects-single-vps'],
  },

  // ── TOOLS ───────────────────────────────────────────────────
  {
    slug:       'cursor-vs-github-copilot-indie-dev',
    title:      'Cursor vs GitHub Copilot for Indie Developers in 2026 — Real Comparison',
    keyword:    'cursor vs github copilot indie developer',
    cluster:    'tools',
    category:   'tools',
    schema:     'comparison',
    kd:         'low',
    india:      true,
    hasExp:     true,
    estTraffic: 900,
    revMult:    1.5,
    linksTo:    ['free-tools-indian-indie-developer','claude-api-vs-openai-cost-india'],
  },
  {
    slug:       'uptime-kuma-self-hosted-monitoring',
    title:      'How to Set Up Uptime Kuma on Hetzner VPS (2026 Self-Hosted Monitoring)',
    keyword:    'uptime kuma self hosted hetzner',
    cluster:    'hetzner/vps',
    category:   'tools',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 350,
    revMult:    1.3,
    linksTo:    ['multiple-projects-single-vps','vps-security-harden-ubuntu-2026'],
  },
  {
    slug:       'n8n-telegram-bot-automation',
    title:      'How to Build a Telegram Bot with n8n in 2026 (No Code)',
    keyword:    'n8n telegram bot automation',
    cluster:    'ai/automation',
    category:   'tools',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 400,
    revMult:    1.4,
    linksTo:    ['self-hosting-n8n-hetzner-vps','whatsapp-ai-assistant-n8n-claude-api','build-telegram-bot-claude-api-python'],
  },
  {
    slug:       'ghost-vs-wordpress-indie-blog',
    title:      'Ghost vs WordPress for Indie Developer Blog in 2026',
    keyword:    'ghost vs wordpress indie blog',
    cluster:    'tools',
    category:   'tools',
    schema:     'comparison',
    kd:         'medium',
    india:      false,
    hasExp:     false,
    estTraffic: 600,
    revMult:    1.2,
    linksTo:    ['nextjs-mdx-blog-2026'],
  },

  // ── INDIE-DEV ───────────────────────────────────────────────
  {
    slug:       'stripe-india-indie-developer',
    title:      'How to Use Stripe as an Indian Indie Developer in 2026',
    keyword:    'stripe india indie developer',
    cluster:    'indie-dev',
    category:   'indie-dev',
    schema:     'howto',
    kd:         'very-low',
    india:      true,
    hasExp:     true,
    estTraffic: 600,
    revMult:    1.8,
    linksTo:    ['indian-debit-cards-dev-tools','pay-hetzner-from-india','wise-vs-payoneer-india-freelancer'],
  },
  {
    slug:       'fiverr-vs-toptal-india-developer',
    title:      'Fiverr vs Toptal for Indian Developers in 2026 — Where to Get Clients',
    keyword:    'fiverr vs toptal indian developer',
    cluster:    'indie-dev',
    category:   'indie-dev',
    schema:     'comparison',
    kd:         'low',
    india:      true,
    hasExp:     true,  // Ankit uses Fiverr
    estTraffic: 500,
    revMult:    1.6,
    linksTo:    ['wise-vs-payoneer-india-freelancer','indian-debit-cards-dev-tools'],
  },
  {
    slug:       'usd-billing-indian-freelancer-taxes',
    title:      'USD Billing and Taxes for Indian Freelancers in 2026 — Complete Guide',
    keyword:    'usd billing indian freelancer taxes',
    cluster:    'indie-dev',
    category:   'indie-dev',
    schema:     'article',
    kd:         'very-low',
    india:      true,
    hasExp:     true,
    estTraffic: 700,
    revMult:    1.5,
    linksTo:    ['wise-vs-payoneer-india-freelancer','indian-debit-cards-dev-tools','pay-hetzner-from-india'],
  },
  {
    slug:       'building-saas-india-2026',
    title:      'Building a SaaS from India in 2026 — Stack, Payments, Infrastructure',
    keyword:    'building saas india 2026',
    cluster:    'indie-dev',
    category:   'indie-dev',
    schema:     'article',
    kd:         'very-low',
    india:      true,
    hasExp:     true,
    estTraffic: 800,
    revMult:    2.0,
    linksTo:    ['multiple-projects-single-vps','pay-hetzner-from-india','indian-debit-cards-dev-tools','free-tools-indian-indie-developer'],
  },

  // ── AI ──────────────────────────────────────────────────────
  {
    slug:       'n8n-social-media-automation',
    title:      'How to Automate Social Media Posts with n8n and Claude API in 2026',
    keyword:    'n8n social media automation',
    cluster:    'ai/automation',
    category:   'ai',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 500,
    revMult:    1.4,
    linksTo:    ['self-hosting-n8n-hetzner-vps','whatsapp-ai-assistant-n8n-claude-api','n8n-vs-make-vs-zapier-indie-dev'],
  },
  {
    slug:       'ollama-self-hosted-llm-hetzner',
    title:      'How to Run Ollama on Hetzner VPS in 2026 (Self-Hosted LLM)',
    keyword:    'ollama self hosted vps hetzner',
    cluster:    'ai/automation',
    category:   'ai',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     false,
    estTraffic: 600,
    revMult:    1.6,
    linksTo:    ['self-hosting-n8n-hetzner-vps','multiple-projects-single-vps','claude-api-vs-openai-cost-india'],
  },
  {
    slug:       'claude-api-python-tutorial',
    title:      'Claude API with Python — Complete Tutorial for Indie Developers 2026',
    keyword:    'claude api python tutorial',
    cluster:    'ai/automation',
    category:   'ai',
    schema:     'howto',
    kd:         'low',
    india:      true,
    hasExp:     true,
    estTraffic: 700,
    revMult:    1.5,
    linksTo:    ['build-telegram-bot-claude-api-python','claude-api-vs-openai-cost-india','whatsapp-ai-assistant-n8n-claude-api'],
  },
  {
    slug:       'rag-app-supabase-claude-api',
    title:      'How to Build a RAG App with Supabase and Claude API in 2026',
    keyword:    'rag app supabase claude api',
    cluster:    'ai/automation',
    category:   'ai',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     false,
    estTraffic: 400,
    revMult:    1.6,
    linksTo:    ['claude-api-vs-openai-cost-india','build-telegram-bot-claude-api-python'],
  },

  // ── TODAY'S SESSION ARTICLES (blixamo system we built) ─────────
  {
    slug:       'self-healing-vps-monitoring-nodejs',
    title:      'How I Built a Self-Healing VPS That Monitors and Fixes Itself (2026)',
    keyword:    'self healing vps monitoring nodejs',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'article',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 700,
    revMult:    2.0,
    linksTo:    ['multiple-projects-single-vps','vps-security-harden-ubuntu-2026','self-hosting-n8n-hetzner-vps'],
    notes:      'Built today — blixamo-checker.js, supervisor.js, Bayesian error detection, auto-fix loop',
  },
  {
    slug:       'scu-blocks-ai-overview-seo-2026',
    title:      'What Are SCU Blocks and Why They Get You Into AI Overviews in 2026',
    keyword:    'scu blocks ai overview seo 2026',
    cluster:    'seo',
    category:   'tutorials',
    schema:     'article',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 600,
    revMult:    1.4,
    linksTo:    ['nextjs-mdx-blog-2026','whatsapp-ai-assistant-n8n-claude-api'],
    notes:      'Rule 26, extraction test, 8x citation rate research — we implemented this today',
  },
  {
    slug:       'ai-article-fixer-claude-api-automation',
    title:      'How I Use Claude API to Auto-Fix My Blog Articles at 4am (2026)',
    keyword:    'ai article fixer claude api automation',
    cluster:    'ai/automation',
    category:   'ai',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 500,
    revMult:    1.6,
    linksTo:    ['whatsapp-ai-assistant-n8n-claude-api','claude-api-vs-openai-cost-india','nextjs-mdx-blog-2026'],
    notes:      'blixamo-ai-fixer.js + blixamo-scu-fixer.js — built today, real code',
  },
  {
    slug:       'bayesian-content-strategy-blog-2026',
    title:      'How to Pick Your Next Blog Article Using Bayesian EV Scoring (2026)',
    keyword:    'bayesian content strategy blog 2026',
    cluster:    'seo',
    category:   'tutorials',
    schema:     'howto',
    kd:         'very-low',
    india:      true,
    hasExp:     true,
    estTraffic: 500,
    revMult:    1.5,
    linksTo:    ['nextjs-mdx-blog-2026','free-tools-indian-indie-developer'],
    notes:      'blixamo-next-article.js — EV formula, KD multipliers, cluster rotation — built today',
  },
  {
    slug:       'ai-generated-content-seo-fix-2026',
    title:      'Why Your AI Content Does Not Rank (And How to Fix It With Real Data)',
    keyword:    'ai generated content seo ranking 2026',
    cluster:    'seo',
    category:   'tools',
    schema:     'article',
    kd:         'low',
    india:      false,
    hasExp:     true,
    estTraffic: 900,
    revMult:    1.5,
    linksTo:    ['nextjs-mdx-blog-2026','whatsapp-ai-assistant-n8n-claude-api','claude-api-vs-openai-cost-india'],
    notes:      'context-builder insight — AI needs YOUR real numbers not generic filler — core insight from today',
  },
  {
    slug:       'vps-bayesian-supervisor-auto-heal',
    title:      'Building a Bayesian VPS Supervisor That Self-Heals With Confidence Scoring',
    keyword:    'vps supervisor auto heal bayesian nodejs',
    cluster:    'hetzner/vps',
    category:   'tech',
    schema:     'article',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 400,
    revMult:    1.8,
    linksTo:    ['multiple-projects-single-vps','vps-security-harden-ubuntu-2026','self-hosting-n8n-hetzner-vps'],
    notes:      'blixamo-supervisor.js — anti-loop laws, confidence scoring, escalation — built in last session',
  },
  {
    slug:       'automated-seo-checker-blog-nodejs',
    title:      'How to Build an Automated SEO Checker for Your Blog With Node.js (2026)',
    keyword:    'automated seo checker blog nodejs',
    cluster:    'seo',
    category:   'tutorials',
    schema:     'howto',
    kd:         'very-low',
    india:      false,
    hasExp:     true,
    estTraffic: 550,
    revMult:    1.4,
    linksTo:    ['nextjs-mdx-blog-2026','deploy-nextjs-coolify-hetzner'],
    notes:      'blixamo-checker.js article module — 30 rules, scoring, auto-fix — real code we wrote today',
  },
];

// ── READ PUBLISHED ARTICLES ──────────────────────────────────────
function getPublished() {
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const published = {};
  posts.forEach(f => {
    const slug = f.replace('.mdx','');
    const raw  = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const catMatch = raw.match(/^category:\s*["']?(.+?)["']?\s*$/m);
    const dateMatch = raw.match(/^date:\s*["']?(.+?)["']?\s*$/m);
    published[slug] = {
      category: catMatch ? catMatch[1] : 'unknown',
      date:     dateMatch ? dateMatch[1] : '2026-01-01',
    };
  });
  return published;
}

// ── GET GSC DATA ─────────────────────────────────────────────────
function getGSCData() {
  try {
    const out = execSync('node /var/www/gsc-tool/gsc.js report 28 2>&1', { encoding: 'utf8', timeout: 15000 });
    // Parse impressions per query if available
    // For now returns empty if sandbox
    if (out.includes('Impressions:  0')) return {};
    return { hasData: true, raw: out };
  } catch { return {}; }
}

// ── BAYESIAN EV SCORING ──────────────────────────────────────────
function pRank(article) {
  // Base probability by KD
  const base = { 'very-low': 0.75, 'low': 0.50, 'medium': 0.20, 'high': 0.05 }[article.kd] || 0.30;
  let p = base;
  if (article.india)   p = Math.min(0.98, p + 0.20);  // India-specific: +20%
  if (article.hasExp)  p = Math.min(0.98, p + 0.25);  // Real experience: +25%
  // Long-tail keyword (3+ words)
  if ((article.keyword.split(' ').length) >= 3) p = Math.min(0.98, p + 0.10);
  return p;
}

function ev(article) {
  return pRank(article) * article.estTraffic * article.revMult;
}

// ── CLUSTER ROTATION CHECK ───────────────────────────────────────
function clusterLastThree(published) {
  // Get last 3 published categories
  const sorted = Object.entries(published)
    .sort((a,b) => new Date(b[1].date) - new Date(a[1].date))
    .slice(0,3)
    .map(([,v]) => v.category);
  return sorted;
}

// ── CADENCE CHECK (R28) ───────────────────────────────────────────
function cadenceCheck(published) {
  const dates = Object.values(published).map(v => new Date(v.date)).sort((a,b) => b-a);
  if (dates.length === 0) return { ok: true, daysSinceLast: null };
  const daysSinceLast = Math.floor((Date.now() - dates[0]) / 86400000);
  const lastTwoDates  = dates.slice(0,2);
  const gapDays       = lastTwoDates.length === 2
    ? Math.floor((lastTwoDates[0] - lastTwoDates[1]) / 86400000)
    : 99;
  return {
    ok:             daysSinceLast >= 3,
    daysSinceLast,
    lastGapDays:    gapDays,
    tooSoon:        daysSinceLast < 3,
    overdue:        daysSinceLast > 7,
  };
}

// ── INTERNAL LINK VALUE ───────────────────────────────────────────
function linkValue(article, published) {
  // How many existing articles does this new article link to?
  const validLinks = (article.linksTo||[]).filter(s => published[s]);
  return validLinks.length;
}

// ── MAIN ─────────────────────────────────────────────────────────
function main() {
  console.log('\n' + clr('cyan','█'.repeat(64)));
  console.log(clr('bold',' BLIXAMO NEXT ARTICLE PICKER — Bayesian EV Ranking'));
  console.log(clr('cyan','█'.repeat(64)));

  const TARGET_PER_CAT = 5;
  const published    = getPublished();
  const catBalance   = {};
  Object.values(published).forEach(v => { catBalance[v.category] = (catBalance[v.category]||0)+1; });
  const maxCatCount  = Math.max(...Object.values(catBalance).concat([0]));
  const minCatCount  = Math.min(...Object.values(catBalance).concat([0]));
  const isBalanced   = (maxCatCount - minCatCount) <= 1;
  const publishedSet = new Set(Object.keys(published));
  const gsc          = USE_GSC ? getGSCData() : {};
  const cadence      = cadenceCheck(published);
  const lastThreeCats = clusterLastThree(published);

  // ── Cadence advisory ──────────────────────────────────────────
  console.log('\n' + clr('bold','📅 PUBLISH CADENCE (R28)'));
  console.log(`  Last article: ${cadence.daysSinceLast === null ? 'none' : cadence.daysSinceLast + ' days ago'}`);
  if (cadence.tooSoon)  console.log(clr('yellow',`  ⚠️  ${cadence.daysSinceLast}d since last — wait ${3 - cadence.daysSinceLast} more day(s) (Rule 28: min 3 days)`));
  else if (cadence.overdue) console.log(clr('red',`  ❌ ${cadence.daysSinceLast}d since last — overdue! Publish today.`));
  else console.log(clr('green',`  ✅ Good window — publish anytime in next ${7 - cadence.daysSinceLast} day(s)`));

  // ── Already published ─────────────────────────────────────────
  console.log('\n' + clr('bold','📚 PUBLISHED: ') + clr('gray', `${publishedSet.size} articles`));
  const catCount = {};
  Object.values(published).forEach(v => { catCount[v.category] = (catCount[v.category]||0)+1; });
  Object.entries(catCount).sort((a,b)=>b[1]-a[1]).forEach(([cat,n]) => {
    console.log(`  ${cat.padEnd(12)} ${'█'.repeat(n)} ${n}`);
  });
  console.log(clr('gray',`  Last 3 categories: ${lastThreeCats.join(' → ')}`));

  // Category balance display
  const allCats = ['tutorials','tech','tools','indie-dev','ai'];
  console.log('\n' + clr('bold','⚖️  CATEGORY BALANCE (target: ' + TARGET_PER_CAT + ' each)'));
  allCats.forEach(cat => {
    const count = catBalance[cat] || 0;
    const bar   = '█'.repeat(count) + '░'.repeat(Math.max(0, TARGET_PER_CAT - count));
    const gap   = TARGET_PER_CAT - count;
    const status = count >= TARGET_PER_CAT ? clr('green','✅ filled') :
                   gap === 1               ? clr('yellow','⚠️  needs 1') :
                                             clr('red',`❌ needs ${gap}`);
    console.log(`  ${cat.padEnd(12)} ${bar} ${count}/${TARGET_PER_CAT}  ${status}`);
  });
  if (!isBalanced) {
    const needsCat = allCats.filter(c => (catBalance[c]||0) === minCatCount);
    console.log(clr('yellow',`\n  Priority: fill "${needsCat.join('" or "')}" first to stay balanced`));
  }

  // ── Category balance state ───────────────────────────────────────
  // ── Filter + score unpublished candidates ─────────────────────
  const candidates = PIPELINE
    .filter(a => !publishedSet.has(a.slug))
    .map(a => {
      const p       = pRank(a);
      const evScore = ev(a);
      const lv      = linkValue(a, published);

      // Penalty 1: same category as last 2 published (cluster repetition)
      const clusterPenalty = lastThreeCats.slice(0,2).filter(c => c === a.category).length * 0.15;

      // Penalty 2: category already at or above target (balance enforcement)
      const thisCatCount  = catBalance[a.category] || 0;
      const overTarget    = Math.max(0, thisCatCount - TARGET_PER_CAT);
      const balancePenalty = overTarget * 0.20; // -20% per article over target

      // Bonus: category is BELOW average (needs articles) = +15% per article short
      const belowAvg    = Math.max(0, Math.round((maxCatCount + minCatCount) / 2) - thisCatCount);
      const balanceBonus = belowAvg * 0.15;

      const finalEV = evScore * (1 - clusterPenalty) * (1 - balancePenalty) * (1 + balanceBonus) * (1 + lv * 0.05);
      return { ...a, pRank: p, ev: evScore, linkValue: lv, clusterPenalty, balancePenalty, balanceBonus, thisCatCount, finalEV };
    })
    .sort((a,b) => b.finalEV - a.finalEV);

  // ── Top N recommendations ─────────────────────────────────────
  console.log('\n' + clr('bold',`🏆 TOP ${TOP_N} NEXT ARTICLES — by EV = P(rank) × traffic × revenue`));
  console.log(clr('gray','  EV = Expected monthly value if ranked. Higher = write this first.\n'));

  candidates.slice(0, TOP_N).forEach((a, i) => {
    const medal = ['🥇','🥈','🥉'][i] || `${i+1}.`;
    const kdColor = { 'very-low': 'green', 'low': 'green', 'medium': 'yellow', 'high': 'red' }[a.kd];
    console.log(`  ${medal} ${clr('bold', a.title)}`);
    console.log(`     keyword  : "${a.keyword}"`);
    console.log(`     cluster  : ${a.cluster} | category: ${a.category} | schema: ${a.schema}`);
    console.log(`     P(rank)  : ${clr('green',(a.pRank*100).toFixed(0)+'%')} | KD: ${clr(kdColor,a.kd)} | India: ${a.india?'✅':'—'} | Real exp: ${a.hasExp?'✅':'❌'}`);
    console.log(`     traffic  : ~${a.estTraffic}/mo if ranked | rev multiplier: ${a.revMult}x`);
    console.log(`     EV score : ${clr('cyan', a.finalEV.toFixed(0))} ${a.clusterPenalty > 0 ? clr('yellow',`(−${(a.clusterPenalty*100).toFixed(0)}% cluster repeat penalty)`) : ''}`);
    console.log(`     links to : ${(a.linksTo||[]).filter(s=>publishedSet.has(s)).join(', ')||'none yet'} (${a.linkValue} existing articles)`);
    if (!a.hasExp) console.log(clr('red','     ⚠️  No personal experience — research required before writing'));
    console.log();
  });

  // ── Full ranked list ──────────────────────────────────────────
  console.log(clr('bold','📋 FULL PIPELINE — ranked by EV'));
  console.log(clr('gray','  Rank  EV     P(rank) KD          Category    Slug'));
  console.log(clr('gray','  ' + '─'.repeat(80)));
  candidates.forEach((a,i) => {
    const kdPad   = a.kd.padEnd(10);
    const catPad  = a.category.padEnd(10);
    const evStr   = a.finalEV.toFixed(0).padStart(6);
    const pStr    = (a.pRank*100).toFixed(0).padStart(3) + '%';
    const noExp   = !a.hasExp ? clr('red',' ⚠no-exp') : '';
    const repeat  = a.clusterPenalty > 0 ? clr('yellow',' ⚡repeat') : '';
    const overCat = a.balancePenalty  > 0 ? clr('red',' ↑overcat') : '';
    const needCat = a.balanceBonus    > 0 ? clr('green',' ↓needcat') : '';
    const catFill = `${a.thisCatCount}/${TARGET_PER_CAT}`.padStart(3);
    console.log(`  ${String(i+1).padStart(2)}.  ${evStr}  ${pStr}  ${kdPad}  ${catPad}[${catFill}]  ${a.slug}${noExp}${repeat}${overCat}${needCat}`);
  });

  // ── GSC intent check ─────────────────────────────────────────
  if (USE_GSC && gsc.hasData) {
    console.log('\n' + clr('bold','🔍 GSC SIGNAL — live search data'));
    console.log(gsc.raw.slice(0,500));
  } else {
    console.log('\n' + clr('gray','  GSC: Site in sandbox (published 2 days ago — normal). No impression data yet.'));
    console.log(clr('gray','  Run with --gsc flag once site has 6-8 weeks of data for demand-driven picks.'));
  }

  // ── Decision summary ─────────────────────────────────────────
  const top = candidates[0];
  console.log('\n' + clr('cyan','═'.repeat(64)));
  console.log(clr('bold',' WRITE THIS NEXT'));
  console.log(clr('cyan','═'.repeat(64)));
  console.log(` Slug    : ${top.slug}`);
  console.log(` Title   : ${top.title}`);
  console.log(` Keyword : ${top.keyword}`);
  console.log(` Reason  : P(rank)=${(top.pRank*100).toFixed(0)}% | KD=${top.kd} | EV=${top.finalEV.toFixed(0)}`);
  console.log(` Schema  : ${top.schema} | Category: ${top.category}`);
  console.log(` Links   : connects to ${top.linkValue} existing articles`);
  if (cadence.tooSoon) {
    console.log(clr('yellow',` Cadence : Wait ${3 - cadence.daysSinceLast} more day(s) before publishing (Rule 28)`));
  } else {
    console.log(clr('green',` Cadence : ✅ Publish window open`));
  }
  console.log(clr('cyan','═'.repeat(64)) + '\n');
}

main();
