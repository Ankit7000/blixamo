#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  BLIXAMO CONTEXT BUILDER
//  Reads all articles + ARTICLE_RULES.md and outputs a rich
//  context object of Ankit's REAL data for the AI fixer to use.
//  No API calls — pure file reading.
// ═══════════════════════════════════════════════════════════════
"use strict";
const fs   = require("fs");
const path = require("path");

const POSTS_DIR   = '/var/www/blixamo/content/posts';
const RULES_FILE  = '/var/www/blixamo/ARTICLE_RULES.md';

// ── REAL DATA EXTRACTED FROM ARTICLES + VPSRULESMD ──────────────
// These are ANKIT'S actual production numbers — used by AI fixer
// to write SCU blocks, internal links, and E-E-A-T sentences.
// Never invent — only use what's below.
const REAL_DATA = {

  server: {
    plan:       'Hetzner CPX22',
    specs:      '2 vCPU, 4GB RAM, 75GB SSD, AMD EPYC',
    cost:       '€5.19/month (Rs 465)',
    location:   'Helsinki, Finland',
    os:         'Ubuntu 24.04',
    uptime:     'over a year without OOM issues',
    swap:       '2GB swapfile (prevents OOM kills)',
    idleRAM:    '~400MB used by OS + SSH at idle',
    freeRAM:    '3.3GB usable after OS overhead',
    buildRAM:   '2-4 minutes for Next.js build on CPX22',
    loadTime:   '306ms average homepage load (blixamo.com)',
    loadIndia:  '280-350ms from India via Cloudflare CDN',
    loadNoCDN:  '800-1200ms without Cloudflare',
  },

  projects: {
    count:      5,
    list: [
      'blixamo.com — Next.js via PM2 (port 3000)',
      'aitoolsfordev.com — Next.js via PM2 (port 3001)',
      'n8n.blixamo.com — Docker (port 5678)',
      'FastAPI backend (port 8000)',
      'Redis — Docker internal (port 6379)',
    ],
    totalRAM:   '550MB for four projects, 2.75GB headroom left',
    n8nRAM:     '~80MB idle, ~180MB queue mode + Redis active, peaks 250-350MB during complex workflows',
    coolifyRAM: '300-400MB for Coolify + Traefik + PostgreSQL + Redis at idle',
    blixamoRAM: '56.9MB for blixamo Next.js process',
  },

  costs: {
    hetzner:    '€5.19/month (Rs 465)',
    digitalOcean: '$24/month (Rs 2,000) for same 2vCPU/4GB specs',
    zapier:     'Rs 7,400/month before switching to self-hosted n8n',
    n8n:        'Rs 0/month (self-hosted)',
    cloudflare: 'Rs 0 (free tier)',
    claude:     '$3/million input, $15/million output (Sonnet 3.5)',
    openai:     'GPT-4o mini for simple tasks, Sonnet for complex — 3x cheaper with Claude',
    wiseVsPayoneer: 'Wise saves ~Rs 800 per $1,000 received vs Payoneer',
  },

  cards: {
    works:      ['Niyo Global (SBM Bank)', 'Kotak 811 Virtual Visa'],
    fails:      ['SBI debit card', 'HDFC standard debit card'],
    reason:     'RBI 3DS mandate blocks auto-renewals on European platforms',
    niyo:       'Zero forex markup, instant setup, works for auto-renewals',
    kotak811:   'Failed auto-renewal 2/5 times in testing',
    wise:       'Virtual debit card — used to pay Hetzner, OpenAI, Anthropic, dev tools',
    kyc:        'Niyo KYC: 5-7 minutes from download to virtual card',
  },

  failures: [
    '13 PM2 restarts in a week — all OOM kills during Next.js builds before adding 2GB swap',
    'SBI and HDFC debit cards declined on Hetzner — 4 out of 6 Indian cards failed',
    'Kotak 811 failed auto-renewal 2/5 times in testing',
    'Without Cloudflare: 800-1200ms page load from India (unusable)',
    'n8n OOM kill: `dmesg | grep -i kill` confirms — fix: add 2GB swapfile or upgrade to CPX31',
    'Certbot renewal fails if port 80 blocked by UFW — fix: `ufw allow 80`',
    'Cloudflare caches HTML pages → ISR breaks → stale content served (fix: CDN-Cache-Control: no-store)',
    'blixamo-watcher not triggering: service down or file saved outside /content/posts/',
    'New accounts get verification call from Germany (+49 prefix) — must pick up',
    'API 429 rate limit errors — fix: prompt caching reduces input tokens by 90%',
  ],

  production: [
    'Running 5 production projects on single CPX22 for over a year',
    'blixamo.com live since March 2026 — Next.js 15, MDX, PM2',
    'n8n running in production since January 2026 — stable as of March 2026',
    'WhatsApp AI assistant responds in under 3 seconds using Claude API',
    'Claude Sonnet 3.5 handles 400 messages/day at ~500 output tokens each = $3/day (Rs 252)',
    'Ran production workloads on Hetzner, DigitalOcean, and Vultr — Hetzner wins on cost',
    'Switched from Payoneer to Wise for USD receipts — saves Rs 800 per $1,000',
    'Moved from DigitalOcean (Rs 1,700/month for 2GB) to Hetzner (Rs 465/month for 4GB)',
    'Running blixamo.com at 306ms average load, under 200ms for articles from Helsinki',
    'Coolify used for client projects, PM2+nginx for blixamo (need precise Cache-Control for ISR)',
  ],

  versions: {
    nextjs:     'Next.js 15',
    ubuntu:     'Ubuntu 24.04',
    coolify:    'Coolify v4 (installs in under 3 minutes)',
    pm2:        'PM2 (autorestart, max_memory_restart: 512M)',
    n8n:        'queue mode with Redis',
    claude:     'Claude Sonnet 4.5 (WhatsApp bot), Haiku (fast tasks)',
    anthropic:  'as of March 2026',
  },

  tools: {
    free: [
      'Cloudflare — CDN, DDoS, SSL, DNS (free tier)',
      'Uptime Robot — uptime monitoring (free tier)',
      'Wave — invoicing for freelancers (free)',
      'Niyo Global — zero forex markup card',
      'GitHub — version control + CI/CD via Coolify',
    ],
    paid: [
      'Hetzner CPX22 — €5.19/month (Rs 465)',
      'Niyo physical card — free, virtual instant',
      'Wise — variable fee (~0.4% FX for USD)',
    ],
  },

  internalLinks: {
    'pay-hetzner-from-india':               'how to pay for Hetzner from India with Niyo Global',
    'multiple-projects-single-vps':         'how I run 5 side projects on a single 4GB Hetzner VPS',
    'deploy-nextjs-coolify-hetzner':        'deploying Next.js with Coolify on Hetzner',
    'indian-debit-cards-dev-tools':         'Indian debit cards for developer subscriptions',
    'coolify-vs-caprover-2026':             'Coolify vs Caprover full comparison',
    'free-tools-indian-indie-developer':    'free tools for Indian indie developers in 2026',
    'nextjs-mdx-blog-2026':                 'how I built this blog with Next.js and MDX',
    'whatsapp-ai-assistant-n8n-claude-api': 'WhatsApp AI assistant built with n8n and Claude API',
    'n8n-vs-make-vs-zapier-indie-dev':      'n8n vs Make vs Zapier for indie developers',
    'hetzner-vs-digitalocean-vs-vultr-india':'Hetzner vs DigitalOcean vs Vultr for Indian developers',
    'self-hosting-n8n-hetzner-vps':         'self-hosting n8n on Hetzner VPS',
    'vps-security-harden-ubuntu-2026':      'VPS security hardening guide for Ubuntu 2026',
    'claude-api-vs-openai-cost-india':      'Claude API vs OpenAI cost comparison for Indian developers',
    'wise-vs-payoneer-india-freelancer':    'Wise vs Payoneer for Indian freelancers',
    'build-telegram-bot-claude-api-python': 'building a Telegram bot with Claude API and Python',
  },

  clusterMap: {
    'payment/india':   ['pay-hetzner-from-india','indian-debit-cards-dev-tools','wise-vs-payoneer-india-freelancer'],
    'hetzner/vps':     ['multiple-projects-single-vps','hetzner-vs-digitalocean-vs-vultr-india','vps-security-harden-ubuntu-2026','self-hosting-n8n-hetzner-vps'],
    'deployment':      ['deploy-nextjs-coolify-hetzner','coolify-vs-caprover-2026'],
    'nextjs':          ['nextjs-mdx-blog-2026','deploy-nextjs-coolify-hetzner'],
    'ai/automation':   ['whatsapp-ai-assistant-n8n-claude-api','n8n-vs-make-vs-zapier-indie-dev','self-hosting-n8n-hetzner-vps','claude-api-vs-openai-cost-india','build-telegram-bot-claude-api-python'],
    'indie-dev':       ['free-tools-indian-indie-developer','indian-debit-cards-dev-tools'],
  },
};

// ── LIVE ARTICLE CONTENT EXTRACTOR ──────────────────────────────
function extractArticleData(slug) {
  const fp = path.join(POSTS_DIR, slug + '.mdx');
  const raw = (() => { try { return fs.readFileSync(fp, 'utf8'); } catch { return null; } })();
  if (!raw) return null;

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(l => {
      const c = l.indexOf(':');
      if (c > 0) fm[l.slice(0,c).trim()] = l.slice(c+1).trim().replace(/^["']|["']$/g,'');
    });
  }
  const body = fmMatch ? raw.slice(fmMatch[0].length).trim() : raw;
  const h2s  = raw.split('\n').filter(l => l.startsWith('## ')).map(l => l.replace('## ',''));
  const links = (raw.match(/\(\/blog\/[\w-]+\)/g)||[]).map(l => l.replace('(/blog/','').replace(')',''));
  const words = (body.match(/\b\w+\b/g)||[]).length;

  // Extract first H2 opening paragraph (SCU candidate)
  const lines  = body.split('\n');
  const h2Scus = [];
  const h2pos  = [];
  lines.forEach((l,i) => { if (l.startsWith('## ')) h2pos.push(i); });
  h2pos.forEach(pos => {
    let para = '';
    for (let i = pos+1; i < lines.length; i++) {
      if (lines[i].startsWith('#') || lines[i].startsWith('```')) break;
      if (!lines[i].trim()) { if (para.trim()) break; continue; }
      para += ' ' + lines[i];
    }
    const w = (para.trim().match(/\b\w+\b/g)||[]).length;
    h2Scus.push({ h2: lines[pos].replace('## ',''), words: w, hasSCU: w >= 60 && w <= 200 });
  });

  return { slug, fm, body, h2s, links, words, h2Scus };
}

function buildFullContext() {
  const posts  = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const articles = {};
  posts.forEach(f => {
    const slug = f.replace('.mdx','');
    const data = extractArticleData(slug);
    if (data) articles[slug] = data;
  });

  return {
    realData: REAL_DATA,
    articles,
    articleCount: posts.length,
    slugs: posts.map(f => f.replace('.mdx','')),
  };
}

module.exports = { buildFullContext, REAL_DATA, extractArticleData };

if (require.main === module) {
  const ctx = buildFullContext();
  console.log(JSON.stringify({ articleCount: ctx.articleCount, slugs: ctx.slugs, realData: ctx.realData }, null, 2));
}
