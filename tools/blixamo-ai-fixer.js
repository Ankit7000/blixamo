#!/usr/bin/env node
// BLIXAMO AI CONTENT FIXER v1.0
// node blixamo-ai-fixer.js              -> fix all articles
// node blixamo-ai-fixer.js --slug <s>  -> fix one article
// node blixamo-ai-fixer.js --dry       -> show only, no write
// node blixamo-ai-fixer.js --report    -> show fix log
"use strict";
const fs = require("fs");
const path = require("path");

// Load env
const envVars = {};
try { fs.readFileSync("/var/www/blixamo/.env.local","utf8").split("\n").forEach(l=>{const e=l.indexOf("=");if(e>0)envVars[l.slice(0,e).trim()]=l.slice(e+1).trim()}); } catch{}

const ANTHROPIC_API_KEY = envVars["ANTHROPIC_API_KEY"] || process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("\n Error: ANTHROPIC_API_KEY not set in /var/www/blixamo/.env.local");
  console.error("  Add it: echo ANTHROPIC_API_KEY=sk-ant-... >> /var/www/blixamo/.env.local\n");
  process.exit(1);
}
const Anthropic = require("@anthropic-ai/sdk");
const AI = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// CONFIG
const POSTS_DIR = '/var/www/blixamo/content/posts';
const FIX_LOG   = '/var/log/blixamo-ai-fixer.log';
const DRY       = process.argv.includes('--dry');
const SHOW_RPT  = process.argv.includes('--report');
const SLUG_IDX  = process.argv.indexOf('--slug');
const TARGET    = SLUG_IDX > -1 ? process.argv[SLUG_IDX+1] : null;
const DISCLOSURE= '\n> **Disclosure:** Some links in this article are affiliate links — I earn a small commission at no extra cost to you.\n\n';
const HETZNER_AFF = 'https://hetzner.cloud/?ref=blixamo';

const LIVE_ARTICLES = {
  'pay-hetzner-from-india':              'Pay for Hetzner from India (Niyo Global, Kotak 811)',
  'multiple-projects-single-vps':        'Run Multiple Projects on a Single Hetzner VPS',
  'deploy-nextjs-coolify-hetzner':       'Deploy Next.js with Coolify on Hetzner',
  'indian-debit-cards-dev-tools':        'Best Indian Debit Cards for Dev Tools',
  'coolify-vs-caprover-2026':            'Coolify vs Caprover 2026 Comparison',
  'free-tools-indian-indie-developer':   'Free Tools for Indian Indie Developers 2026',
  'nextjs-mdx-blog-2026':                'Next.js MDX Blog Setup 2026',
  'whatsapp-ai-assistant-n8n-claude-api':'WhatsApp AI Assistant with n8n and Claude API',
  'n8n-vs-make-vs-zapier-indie-dev':     'n8n vs Make vs Zapier for Indie Developers',
  'hetzner-vs-digitalocean-vs-vultr-india':'Hetzner vs DigitalOcean vs Vultr for India',
  'self-hosting-n8n-hetzner-vps':        'Self-Hosting n8n on Hetzner VPS',
  'vps-security-harden-ubuntu-2026':     'VPS Security Hardening Ubuntu 2026',
  'claude-api-vs-openai-cost-india':     'Claude API vs OpenAI Cost for Indian Developers',
  'wise-vs-payoneer-india-freelancer':   'Wise vs Payoneer for Indian Freelancers',
  'build-telegram-bot-claude-api-python':'Build Telegram Bot with Claude API and Python',
};

// Colors
const C = {r:'\x1b[0m',bold:'\x1b[1m',red:'\x1b[31m',green:'\x1b[32m',
  yellow:'\x1b[33m',blue:'\x1b[34m',cyan:'\x1b[36m',gray:'\x1b[90m'};
const clr = (c,t) => `${C[c]}${t}${C.r}`;
const ts  = () => new Date().toISOString().replace('T',' ').slice(0,19);

const readFile   = fp => { try { return fs.readFileSync(fp,'utf8'); } catch { return null; } };
const countWords = t  => (t.match(/\b\w+\b/g)||[]).length;
function appendLog(slug,what,preview) {
  try { fs.appendFileSync(FIX_LOG,`[${ts()}] [${slug}] ${what} | ${(preview||'').slice(0,80).replace(/\n/g,' ')}\n`); } catch{}
}
function parseFM(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {fm:{},body:raw};
  const fm={};
  m[1].split('\n').forEach(l=>{const c=l.indexOf(':');if(c>0)fm[l.slice(0,c).trim()]=l.slice(c+1).trim().replace(/^["']|["']$/g,'');});
  return {fm, body:raw.slice(m[0].length).trim()};
}
async function ask(system,user,maxTokens=700) {
  const r = await AI.messages.create({model:'claude-haiku-4-5',max_tokens:maxTokens,system,messages:[{role:'user',content:user}]});
  return (r.content[0].text||'').trim();
}
function sysPrompt(fm,slug) {
  const links = Object.entries(LIVE_ARTICLES).filter(([s])=>s!==slug).map(([s,t])=>`  /blog/${s} — "${t}"`).join('\n');
  return `You write for blixamo.com by Ankit Sorathiya, Indian indie developer.
VOICE: first-person "I", direct, India-first, real numbers (Rs+EUR), short paragraphs (2-3 sentences).
NEVER: "certainly","delve","In this article","Are you looking for","Have you ever wondered".
ARTICLE: "${fm.title}" | Keyword:"${fm.keyword}" | Schema:${fm.schema}
LIVE LINKS:\n${links}
HETZNER AFFILIATE: ${HETZNER_AFF} (anchor: "sign up for Hetzner with €20 credit")
OUTPUT: raw markdown only. No preamble. No explanation.`;
}

// === AI FIX 1: HOOK ===
async function fixHook(raw,fm,slug) {
  const {body} = parseFM(raw);
  const firstPara = (body.split('\n\n').find(p=>p.trim()&&!p.startsWith('>')&&!p.startsWith('#'))||'').trim();
  if (firstPara.startsWith('I ')&&countWords(firstPara)<=45) return null;
  const r = await ask(sysPrompt(fm,slug),
    `Rewrite the opening hook. Must start: "I [did thing] — [outcome creating tension]." Then 1-3 sentences max. Under 45 words. Include one real number. No banned openers. Title:"${fm.title}" Keyword:"${fm.keyword}" Return ONLY the hook paragraph.`,150);
  if (!r||(!r.startsWith('I ')&&!r.startsWith('My '))) return null;
  return {raw:raw.replace(firstPara,r), what:'Hook rewritten', preview:r.slice(0,80)};
}

// === AI FIX 2: TLDR ===
async function fixTLDR(raw,fm,slug) {
  if (raw.includes('TL;DR')) return null;
  const {body} = parseFM(raw);
  const r = await ask(sysPrompt(fm,slug),
    `Write TL;DR box. EXACT FORMAT:\n> **TL;DR**\n> - ✅ [keyword: "${fm.keyword}"] — [outcome <10 words]\n> - ✅ [second point] — [value]\n> - ⚠️ [caveat] — [<10 words]\n> - ❌ [avoid] — [why <10 words]\n> - 💡 [key insight] — [non-obvious thing]\nRules: exactly 5 bullets, first bullet has keyword, real specifics. Context:\n${body.slice(0,1000)}\nReturn ONLY the > **TL;DR** blockquote.`,260);
  if (!r||!r.includes('TL;DR')) return null;
  const fmClose=raw.indexOf('---\n',4)+4;
  const afterHook=raw.indexOf('\n\n',fmClose+10);
  if (afterHook===-1) return null;
  return {raw:raw.slice(0,afterHook+2)+r+'\n\n'+raw.slice(afterHook+2), what:'TL;DR box added', preview:r.slice(0,80)};
}

// === AI FIX 3: TROUBLESHOOTING ===
async function fixTroubleshooting(raw,fm,slug) {
  if (raw.split('\n').filter(l=>l.startsWith('## ')).some(h=>/(error|troubleshoot|common|fix)/i.test(h))) return null;
  const r = await ask(sysPrompt(fm,slug),
    `Write "Common Errors and How to Fix Them" section. FORMAT:\n## Common Errors and How to Fix Them\n\n[60-100w opening: what errors beginners hit, quick fix]\n\n### "[Error 1 message or symptom]"\n\n[60-120w self-contained answer: sentence 1=fix, then why, language-tagged code if needed]\n\n### "[Error 2]"\n\n[60-120w answer]\n\n### "[Error 3]"\n\n[60-120w answer]\n\nTopic:"${fm.title}" Keyword:"${fm.keyword}"\nReturn ONLY the section starting with ## Common Errors`,700);
  if (!r||!r.startsWith('## ')) return null;
  const lastH2=raw.lastIndexOf('\n## ');
  const insertAt=lastH2>0?lastH2:raw.length;
  return {raw:raw.slice(0,insertAt)+'\n\n'+r+raw.slice(insertAt), what:'Troubleshooting H2 added', preview:r.slice(0,80)};
}

// === AI FIX 4: FAQ ===
async function fixFAQ(raw,fm,slug) {
  const lines=raw.split('\n');
  if (lines.filter(l=>l.startsWith('## ')).some(h=>/(faq|frequently|questions)/i.test(h))) return null;
  if (lines.filter(l=>l.startsWith('### ')).length>=6) return null;
  const {body} = parseFM(raw);
  const r = await ask(sysPrompt(fm,slug),
    `Write FAQ section targeting Google PAA and AI Overview citations. FORMAT:\n## Frequently Asked Questions\n\n### [Question 1?]\n\n[60-180w self-contained answer. Sentence 1=direct answer. Include real number. Never "It depends".]\n\n[6 H3 questions total]\n\nRules: 6 H3s ending with ?, mix how/why/does/which/can/what, each answer extractable standalone, include Hetzner affiliate in one answer: ${HETZNER_AFF}. Keyword:"${fm.keyword}"\nContext:\n${body.slice(0,2000)}\nReturn ONLY section starting with ## Frequently Asked Questions`,1000);
  if (!r||!r.includes('### ')) return null;
  const wni=raw.lastIndexOf('\n## What Next');
  const at=wni>0?wni:raw.length;
  return {raw:raw.slice(0,at)+'\n\n'+r+raw.slice(at), what:'FAQ section added (6 H3s)', preview:r.slice(0,80)};
}

// === AI FIX 5: WHAT NEXT ===
async function fixWhatNext(raw,fm,slug) {
  if (raw.split('\n').filter(l=>l.startsWith('## ')).some(h=>/(what next|next step|what now)/i.test(h))) return null;
  const links=Object.entries(LIVE_ARTICLES).filter(([s])=>s!==slug).map(([s,t])=>`  /blog/${s} — "${t}"`).join('\n');
  const r = await ask(sysPrompt(fm,slug),
    `Write What Next closing section. FORMAT:\n## What Next?\n\n[1-2 sentences: what problem reader faces next after this article]\n\n[One internal link: [descriptive anchor text](/blog/slug) — pick most relevant below]\n\nIf you found this useful, subscribe below. I write about self-hosting, Hetzner, n8n automation, and building indie projects from India. No spam. One email when something worth reading goes up.\n\nAvailable links (pick ONE):\n${links}\n\nRules: ONE link only, descriptive anchor, under 90 words total, last line=subscribe sentence exactly as shown. Topic:"${fm.title}"\nReturn ONLY the ## What Next? section.`,220);
  if (!r||!r.includes('## What Next')) return null;
  return {raw:raw.trimEnd()+'\n\n'+r+'\n', what:'What Next CTA added', preview:r.slice(0,80)};
}

// === NON-AI FIXES ===
function fixDisclosure(raw,fm) {
  if (!raw.toLowerCase().includes('hetzner')||raw.toLowerCase().includes('affiliate')) return null;
  const e=raw.indexOf('---\n',4)+4; if(e<=4) return null;
  return {raw:raw.slice(0,e)+DISCLOSURE+raw.slice(e), what:'Affiliate disclosure added', preview:'Disclosure block inserted'};
}
function fixCodeBlocks(raw) {
  // Only tag OPENING fences that have no language (plain ``` on a line by itself
  // that is NOT a closing fence). We track state: if we are outside a code block
  // and see plain ```, it is an unlabeled opener — tag it as bash.
  // If we are inside a code block and see plain ```, it is a closer — leave it alone.
  const lines = raw.split('\n');
  let inside = false;
  let count  = 0;
  const out  = lines.map(line => {
    const isOpenWithLang = /^```[a-zA-Z]/.test(line);
    const isPlainFence   = /^```\s*$/.test(line);
    if (!inside) {
      if (isOpenWithLang) { inside = true; return line; }
      if (isPlainFence)   { inside = true; count++; return '```bash'; } // unlabeled opener
      return line;
    } else {
      if (isPlainFence)   { inside = false; return line; } // proper closer — leave alone
      if (isOpenWithLang) { inside = false; return line; } // malformed but treat as closer
      return line;
    }
  });
  if (count === 0) return null;
  return {raw: out.join('\n'), what: `${count} unlabeled code block(s) tagged as bash`, preview: `${count} untagged opener(s) -> bash`};
}
function fixExcerpt(raw,fm) {
  if(!fm.excerpt||fm.excerpt.split(/\s+/).length<=20) return null;
  const t=fm.excerpt.split(/\s+/).slice(0,18).join(' ')+'.';
  return {raw:raw.replace(/^excerpt: .*/m,`excerpt: "${t}"`), what:`Excerpt trimmed to ${countWords(t)} words`, preview:t};
}
function fixDescription(raw,fm) {
  if(!fm.description||fm.description.length<=160) return null;
  const t=fm.description.slice(0,157)+'...';
  return {raw:raw.replace(/^description: .*/m,`description: "${t}"`), what:`Description trimmed to ${t.length} chars`, preview:t.slice(0,60)};
}


// === R15: BANNED WORDS AUTO-FIX (non-AI, pure replace) ===
const BANNED_REPLACEMENTS = {
  'certainly': '',
  'delve': 'explore',
  'leverage': 'use',
  'comprehensive': 'full',
  'straightforward': 'simple',
  'robust': 'solid',
  'seamless': 'smooth',
  'game-changer': 'major improvement',
  'cutting-edge': 'modern',
  'innovative': 'new',
  'utilize': 'use',
  'furthermore': 'also',
  'moreover': 'also',
  'it is important to note': '',
  "it's worth noting": '',
  'one should': 'you should',
  'one must': 'you must',
  'developers often': 'most developers',
  'this will help you': '',
  'you will learn': 'this covers',
  'this guide covers': 'this article covers',
  'step-by-step guide to': 'how to',
  'everything you need to know about': 'how to use',
  'in conclusion': 'bottom line',
  'to summarize': 'in short',
  'in essence': 'simply put',
  'feel free to': '',
  "don't hesitate": '',
  'I hope this helps': '',
};

function fixBannedWords(raw, fm) {
  const {body} = parseFM(raw);
  let fixed = raw;
  let count = 0;
  for (const [banned, replacement] of Object.entries(BANNED_REPLACEMENTS)) {
    const regex = new RegExp(banned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(fixed)) {
      fixed = fixed.replace(regex, replacement);
      count++;
    }
  }
  if (count === 0) return null;
  return { raw: fixed, what: `R15: ${count} banned word(s) removed/replaced`, preview: `${count} filler phrases cleaned` };
}

// === R21: EUR+INR PRICING AUTO-FIX ===
// Known prices — always current as of March 2026
const KNOWN_PRICES = {
  'CPX22': '€5.19/month (Rs 465)',
  'CPX21': '€3.79/month (Rs 341)',
  'CPX31': '€9.49/month (Rs 854)',
  'CPX41': '€17.79/month (Rs 1,601)',
  'Hetzner CPX22': '€5.19/month (Rs 465)',
  'Claude Haiku': '$0.80/million tokens (Rs 67/million)',
  'Claude Sonnet': '$3/million input (Rs 252/million)',
};

function fixPricing(raw, fm) {
  let fixed = raw;
  let count = 0;
  // Find EUR-only prices and add INR
  fixed = fixed.replace(/€(\d+\.\d+)\/month(?!\s*\(Rs)/g, (match, eur) => {
    const inr = Math.round(parseFloat(eur) * 90);
    count++;
    return `€${eur}/month (Rs ${inr})`;
  });
  // Find USD-only prices and add INR
  fixed = fixed.replace(/\$(\d+(?:\.\d+)?)\/month(?!\s*\(Rs)/g, (match, usd) => {
    const inr = Math.round(parseFloat(usd) * 84);
    count++;
    return `$${usd}/month (Rs ${inr})`;
  });
  if (count === 0) return null;
  return { raw: fixed, what: `R21: ${count} price(s) updated with INR equivalent`, preview: `EUR/USD prices now include Rs equivalent` };
}

// === R16: READABILITY — para length check (flag only, no rewrite) ===
function checkReadability(raw, fm) {
  const {body} = parseFM(raw);
  const paras = body.split('\n\n').filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('`') && !p.startsWith('>'));
  const longParas = paras.filter(p => (p.match(/\./g)||[]).length > 4 && p.split(' ').length > 80);
  if (longParas.length === 0) return null;
  return { what: `R16: ${longParas.length} paragraph(s) over 4 sentences — split for mobile readability`, preview: longParas[0].slice(0,60) };
}

// === R19: LSI / SEMANTIC ENRICHMENT CHECK ===
const LSI_ENTITIES = {
  hetzner:  ['VPS','Nginx','PM2','CPX22','cloud server','Helsinki','Linux','Ubuntu'],
  payment:  ['RBI','3DS','forex','UPI','virtual card','international transaction'],
  n8n:      ['workflow','webhook','trigger','Docker','automation','queue'],
  nextjs:   ['ISR','MDX','SSR','Vercel','build','deployment','static'],
  security: ['UFW','fail2ban','SSH','firewall','brute-force','certbot','SSL'],
  ai:       ['API','tokens','Claude','OpenAI','prompt','model','context'],
};

function checkLSI(raw, fm) {
  const bodyLower = raw.toLowerCase();
  const missing = [];
  for (const [topic, terms] of Object.entries(LSI_ENTITIES)) {
    if (!bodyLower.includes(topic) && !terms.some(t => bodyLower.includes(t.toLowerCase()))) continue;
    const found = terms.filter(t => bodyLower.includes(t.toLowerCase())).length;
    if (found < 3) {
      const needed = terms.filter(t => !bodyLower.includes(t.toLowerCase())).slice(0,3);
      missing.push(`${topic}: add "${needed.join('", "')}"`);
    }
  }
  if (missing.length === 0) return null;
  return { what: `R19: LSI gaps — ${missing.join(' | ')}`, preview: missing[0] };
}

// === R23: CLUSTER LINKING CHECK ===
const CLUSTER_MAP = {
  'payment/india':  ['pay-hetzner-from-india','indian-debit-cards-dev-tools','wise-vs-payoneer-india-freelancer'],
  'hetzner/vps':    ['multiple-projects-single-vps','hetzner-vs-digitalocean-vs-vultr-india','vps-security-harden-ubuntu-2026','self-hosting-n8n-hetzner-vps'],
  'deployment':     ['deploy-nextjs-coolify-hetzner','coolify-vs-caprover-2026'],
  'nextjs':         ['nextjs-mdx-blog-2026','deploy-nextjs-coolify-hetzner'],
  'ai/automation':  ['whatsapp-ai-assistant-n8n-claude-api','n8n-vs-make-vs-zapier-indie-dev','self-hosting-n8n-hetzner-vps','claude-api-vs-openai-cost-india','build-telegram-bot-claude-api-python'],
  'indie-dev':      ['free-tools-indian-indie-developer','indian-debit-cards-dev-tools'],
};

function checkClusters(raw, slug, fm) {
  const issues = [];
  // Find which cluster this article belongs to
  for (const [cluster, members] of Object.entries(CLUSTER_MAP)) {
    if (!members.includes(slug)) continue;
    // Check it links to at least one other cluster member
    const otherMembers = members.filter(m => m !== slug);
    const hasClusterLink = otherMembers.some(m => raw.includes(`/blog/${m}`));
    if (!hasClusterLink) {
      issues.push(`R23: Cluster "${cluster}" — no link to cluster siblings: ${otherMembers.slice(0,2).join(', ')}`);
    }
  }
  return issues.length > 0 ? { what: issues.join(' | '), preview: issues[0] } : null;
}

// === R24: SCHEMA CORRECTNESS CHECK ===
function checkSchema(raw, fm) {
  if (!fm.schema) return { what: 'R24: schema field missing in frontmatter', preview: 'Add schema: howto|comparison|review|faq|article' };
  const title = (fm.title||'').toLowerCase();
  const schema = fm.schema;
  // Detect likely wrong schema
  if ((title.includes(' vs ') || title.includes(' versus ')) && schema !== 'comparison')
    return { what: `R24: Title contains "vs" but schema="${schema}" — should be "comparison"`, preview: 'Change schema to: comparison' };
  if ((title.startsWith('how to') || title.startsWith('how i')) && schema !== 'howto' && schema !== 'article')
    return { what: `R24: Title starts "How to" but schema="${schema}" — should be "howto"`, preview: 'Change schema to: howto' };
  if (title.includes('review') && schema !== 'review')
    return { what: `R24: Title contains "review" but schema="${schema}" — should be "review"`, preview: 'Change schema to: review' };
  return null;
}

// === R3: WORD COUNT + SECTION EXPANSION GUIDE ===
function checkWordCountWithGuide(raw, fm) {
  const {body} = parseFM(raw);
  const wordCount = (body.match(/\b\w+\b/g)||[]).length;
  const minWords = {howto:1500,comparison:1800,review:1500,faq:1200,article:800}[fm.schema||'article']||800;
  const targetWords = {howto:2500,comparison:3500,review:2500,faq:2000,article:1500}[fm.schema||'article']||1500;
  if (wordCount >= minWords) return null;
  const gap = minWords - wordCount;
  const lines = body.split('\n');
  const h2s = lines.filter(l => l.startsWith('## ')).map(l => l.replace('## ',''));
  // Find shortest H2 sections — those are candidates for expansion
  const h2pos = [];
  lines.forEach((l,i) => { if(l.startsWith('## ')) h2pos.push(i); });
  const sectionLengths = [];
  h2pos.forEach((pos,idx) => {
    const end = h2pos[idx+1] || lines.length;
    const sectionWords = (lines.slice(pos,end).join(' ').match(/\b\w+\b/g)||[]).length;
    sectionLengths.push({ h2: lines[pos].replace('## ',''), words: sectionWords });
  });
  sectionLengths.sort((a,b) => a.words - b.words);
  const shortest = sectionLengths.slice(0,3).map(s => `"${s.h2}" (${s.words}w)`).join(', ');
  return { what: `R3: ${wordCount}w — need ${gap} more words to hit ${minWords}w minimum. Expand shortest sections: ${shortest}`, preview: `${gap} words short` };
}



// === MANUAL REPORT ===
function manualReport(raw,fm,slug) {
  const manual=[]; const lines=raw.split('\n'); const {body}=parseFM(raw);
  // SCU check
  const h2pos=[]; lines.forEach((l,i)=>{if(l.startsWith('## '))h2pos.push(i);});
  let weak=0;
  h2pos.forEach(pos=>{
    let p='';
    for(let i=pos+1;i<lines.length;i++){
      if(lines[i].startsWith('#')||lines[i].startsWith('```'))break;
      if(!lines[i].trim()){if(p.trim())break;continue;}
      p+=' '+lines[i];
    }
    if(countWords(p.trim())<60)weak++;
  });
  if(weak>2) manual.push(`SCU blocks: ${weak} H2s need 60-180w self-contained opening (from YOUR real experience)`);
  const il=(raw.match(/\(\/blog\//g)||[]).length;
  if(il<3) manual.push(`Internal links: ${il} found, need ${3-il} more`);
  if(body.toLowerCase().includes('hetzner')){
    const hasEUR=/€\d|EUR/.test(body), hasINR=/Rs |₹|INR/.test(body);
    if(!hasEUR||!hasINR) manual.push(`Pricing: show EUR + INR for every paid tool`);
  }
  let ee=0;
  if(/\d+\s*(MB|GB|ms|%|Rs|₹|EUR|USD|€|\$|\/month)/.test(body))ee++;
  if(/I've been|in production|I built|I tested|I moved/.test(body))ee++;
  if(/didn't work|failed|error|declined|blocked/.test(body))ee++;
  if(/Next\.js \d|v\d|Ubuntu \d|\d+\.\d+\.\d+/.test(body))ee++;
  if(/as of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* 20\d\d/.test(body))ee++;
  if(/€\d|Rs \d|\$\d/.test(body))ee++;
  if(ee<4) manual.push(`E-E-A-T: ${ee}/7 — add real numbers, failures, versions, "as of March 2026"`);
  if(!/as of (Jan|Feb|Mar)/i.test(body.slice(0,900))) manual.push('Freshness: add "as of March 2026" in first 200 words');
  // R3 word count
  const r3 = checkWordCountWithGuide(raw,fm);
  if(r3) manual.push(r3.what);
  // R16 readability
  const r16 = checkReadability(raw,fm);
  if(r16) manual.push(r16.what);
  // R19 LSI
  const r19 = checkLSI(raw,fm);
  if(r19) manual.push(r19.what);
  // R23 cluster
  const r23 = checkClusters(raw,slug,fm);
  if(r23) manual.push(r23.what);
  // R24 schema
  const r24 = checkSchema(raw,fm);
  if(r24) manual.push(r24.what);
  return manual;
}

// === PROCESS ARTICLE ===
async function processArticle(fname) {
  const fp=path.join(POSTS_DIR,fname), slug=fname.replace('.mdx','');
  let raw=readFile(fp); if(!raw) return null;
  let {fm}=parseFM(raw); const fixes=[],errors=[];
  console.log(`\n${clr('cyan','─'.repeat(60))}\n${clr('bold',' '+slug)}\n${clr('cyan','─'.repeat(60))}`);
  for(const fix of [fixDisclosure(raw,fm),fixCodeBlocks(raw),fixExcerpt(raw,fm),fixDescription(raw,fm),fixBannedWords(raw,fm),fixPricing(raw,fm)].filter(Boolean)){
    raw=fix.raw;fm=parseFM(raw).fm;fixes.push(fix);
    console.log(clr('green',`  ✅ ${fix.what}`));appendLog(slug,fix.what,fix.preview);
  }
  for(const {label,fn} of [{label:'hook',fn:()=>fixHook(raw,fm,slug)},{label:'tldr',fn:()=>fixTLDR(raw,fm,slug)},{label:'troubleshooting',fn:()=>fixTroubleshooting(raw,fm,slug)},{label:'faq',fn:()=>fixFAQ(raw,fm,slug)},{label:'whatnext',fn:()=>fixWhatNext(raw,fm,slug)},{label:'scu-links-eeat',fn:()=>fixSCULinksEEAT(raw,fm,slug)}]){
    try{const fix=await fn();if(fix){raw=fix.raw;fm=parseFM(raw).fm;fixes.push(fix);console.log(clr('blue',`  🤖 ${fix.what}`));appendLog(slug,fix.what,fix.preview);}}
    catch(e){const m=`AI[${label}]:${e.message}`;errors.push(m);console.log(clr('yellow',`  ⚠️  ${m}`));}
  }
  if(fixes.length>0){
    if(!DRY){fs.writeFileSync(fp,raw);console.log(clr('green',`  💾 Saved — ${fixes.length} fix(es)`))}
    else console.log(clr('yellow',`  🔍 DRY — ${fixes.length} would apply`));
  }else console.log(clr('gray','  ✓ Nothing to auto-fix'));
  const manual=manualReport(raw,fm,slug);
  if(manual.length>0){console.log(clr('yellow',`\n  ⚠️  Still needs YOU (${manual.length}):`));manual.forEach(m=>console.log(clr('yellow',`    • ${m}`)));}
  return {slug,aiFixes:fixes.length,manual:manual.length,errors:errors.length};
}

// === MAIN ===
async function main() {
  if(SHOW_RPT){const l=readFile(FIX_LOG)||'(empty)';console.log('\n=== AI FIXER LOG ===\n'+l.split('\n').slice(-30).join('\n'));return;}
  console.log('\n'+clr('cyan','█'.repeat(62)));
  console.log(clr('bold',` BLIXAMO AI CONTENT FIXER v1.0 — ${ts()}`));
  console.log(clr('gray',` DRY=${DRY} Target=${TARGET||'all'}`));
  console.log(clr('cyan','█'.repeat(62)));
  const posts=fs.readdirSync(POSTS_DIR).filter(f=>f.endsWith('.mdx')).filter(f=>!TARGET||f.includes(TARGET));
  if(!posts.length){console.error(clr('red','No articles found'));process.exit(1);}
  const results=[];
  for(const f of posts){const r=await processArticle(f);if(r)results.push(r);}
  const ta=results.reduce((a,b)=>a+b.aiFixes,0),tm=results.reduce((a,b)=>a+b.manual,0),te=results.reduce((a,b)=>a+b.errors,0);
  console.log('\n'+clr('cyan','═'.repeat(62)));
  console.log(clr('bold',' SUMMARY'));
  console.log(clr('cyan','═'.repeat(62)));
  console.log(` Articles : ${results.length}\n AI fixes : ${clr('blue',String(ta))}\n Manual   : ${clr('yellow',String(tm))} items need your real experience\n Errors   : ${te>0?clr('red',String(te)):'0'}`);
  if(tm>0)console.log(clr('yellow','\n  Items flagged ⚠️ need YOUR real numbers, failures, versions — AI cannot fabricate real experience.'));
  console.log(clr('cyan','═'.repeat(62))+'\n');
}

// ═══════════════════════════════════════════════════════════════
//  AI FIX 6 — SCU BLOCKS + INTERNAL LINKS + E-E-A-T
//  Reads ALL existing articles + blixamo-context-builder.js
//  Uses ONLY Ankit's real numbers — never fabricates data
//  Uses existing Claude API client (AI) already initialized above
// ═══════════════════════════════════════════════════════════════

const { buildFullContext, REAL_DATA } = require('./blixamo-context-builder');

function buildRealDataPromptContext(slug) {
  const rd = REAL_DATA;
  const realNumbers = [
    `Server: Hetzner CPX22, 2 vCPU, 4GB RAM, 75GB SSD — ${rd.costs.hetzner}`,
    `RAM at idle: ~400MB OS overhead, 3.3GB usable for projects`,
    `5 production projects on one VPS — ~550MB total RAM for 4 apps, 2.75GB headroom left`,
    `blixamo.com: 306ms average load time, live since March 2026`,
    `India via Cloudflare: 280-350ms. Without Cloudflare: 800-1200ms`,
    `n8n RAM: ~80MB idle, ~180MB queue+Redis, peaks 250-350MB during complex workflows`,
    `Coolify+Traefik+Postgres+Redis: 300-400MB at idle on CPX22`,
    `Next.js build on CPX22: 2-4 minutes`,
    `2GB swapfile — added after 13 PM2 OOM restarts in one week during builds`,
    `Niyo KYC: 5-7 minutes from download to working virtual card`,
    `Kotak 811 failed auto-renewal 2/5 times in testing`,
    `4 out of 6 Indian cards declined on Hetzner (RBI 3DS mandate blocks auto-renewals)`,
    `DigitalOcean 2GB: Rs 1,700/month — moved to Hetzner 4GB: Rs 465/month`,
    `Wise saves ~Rs 800 per $1,000 received vs Payoneer`,
    `WhatsApp bot responds under 3 seconds via Claude API on n8n`,
    `Claude Sonnet 3.5: 400 msg/day x 500 tokens = $3/day (Rs 252)`,
    `Zapier: Rs 7,400/month → self-hosted n8n: Rs 0/month`,
    `New Hetzner VPS gets SSH brute-force attempt within 3 hours — confirmed from logs`,
    `PM2 blixamo: 77 restarts (all ISR-related, not crashes)`,
    `Ubuntu 24.04, Next.js 15, Coolify v4, PM2, Claude Sonnet 4.5`,
  ].join('\n• ');

  const failures = rd.failures.slice(0,6).join('\n• ');
  const outcomes = rd.production.slice(0,5).join('\n• ');

  const linkMap = Object.entries(rd.internalLinks)
    .filter(([s]) => s !== slug)
    .map(([s, anchor]) => `  /blog/${s} → anchor: "${anchor}"`)
    .join('\n');

  return { realNumbers, failures, outcomes, linkMap };
}

async function fixSCULinksEEAT(raw, fm, slug) {
  const lines   = raw.split('\n');
  const body    = (() => { const m=raw.match(/^---\n[\s\S]*?\n---\n/); return m ? raw.slice(m[0].length).trim() : raw; })();

  // ── Check SCU weakness ─────────────────────────────────────
  const h2pos = [];
  lines.forEach((l,i) => { if (l.startsWith('## ')) h2pos.push(i); });
  const weakH2s = [];
  h2pos.forEach(pos => {
    let para = '';
    for (let i=pos+1; i<lines.length; i++) {
      if (lines[i].startsWith('#') || lines[i].startsWith('```')) break;
      if (!lines[i].trim()) { if (para.trim()) break; continue; }
      para += ' ' + lines[i];
    }
    const w = (para.trim().match(/\b\w+\b/g)||[]).length;
    if (w < 60) weakH2s.push(lines[pos].replace('## ',''));
  });

  // ── Check internal links ────────────────────────────────────
  const intLinks = (raw.match(/\(\/blog\//g)||[]).length;
  const first500HasLink = raw.split(/\s+/).slice(0,500).join(' ').includes('/blog/');

  // ── Check E-E-A-T ───────────────────────────────────────────
  let eeat = 0;
  if (/\d+\s*(MB|GB|ms|%|Rs|₹|€|\$|\/month)/.test(body)) eeat++;
  if (/I've been|in production|I built|I tested|I run/.test(body)) eeat++;
  if (/failed|error|declined|blocked|didn't work/.test(body)) eeat++;
  if (/Next\.js \d|v\d|Ubuntu \d|\d+\.\d+\.\d+/.test(body)) eeat++;
  if (/as of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* 20\d\d/.test(body)) eeat++;
  if (/€\d|Rs \d|\$\d/.test(body)) eeat++;

  const needsSCU   = weakH2s.length > 2;
  const needsLinks = intLinks < 3 || !first500HasLink;
  const needsEEAT  = eeat < 4;

  if (!needsSCU && !needsLinks && !needsEEAT) return null;

  const { realNumbers, failures, outcomes, linkMap } = buildRealDataPromptContext(slug);

  const systemCtx = `You write for blixamo.com — Ankit Sorathiya's indie dev blog from India.
Voice: first-person "I", direct, India-first, real numbers, short paragraphs (2-3 sentences max).
NEVER invent numbers. ONLY use the real data provided below.
NEVER use: "certainly","delve","leverage","straightforward","comprehensive","in conclusion".
Output ONLY valid JSON. No preamble. No markdown fences.

═══ ANKIT'S REAL PRODUCTION DATA (use ONLY these) ═══
NUMBERS:
• ${realNumbers}

FAILURES (use when topically relevant):
• ${failures}

PRODUCTION OUTCOMES (use when topically relevant):
• ${outcomes}

LIVE INTERNAL LINKS (ONLY use slugs from this list):
${linkMap}
════════════════════════════════════════════════════════`;

  let finalRaw = raw;
  const fixes  = [];

  // ── TASK 1: SCU blocks ──────────────────────────────────────
  if (needsSCU) {
    const targets = weakH2s.slice(0,3).map(h => `"${h}"`).join(', ');
    try {
      const resp = await ask(systemCtx,
        `Write SCU (Self-Contained Unit) opening paragraphs for these H2 sections: ${targets}

SCU rules:
- 70-150 words each
- Must answer the H2 question COMPLETELY as a standalone unit (extractable by AI without surrounding context)
- Sentence 1 = direct answer with the most relevant real number from the data above
- First-person "I" — Ankit's real production experience
- Relevant failure or production outcome if it fits the H2 topic
- End with what the reader should do or what happens next

Article: "${fm.title}" | Keyword: "${fm.keyword}" | Schema: ${fm.schema||'article'}

Return JSON array ONLY:
[{"h2":"exact H2 title","scu":"the paragraph text"}]`, 1200);

      const parsed = JSON.parse(resp.replace(/\`\`\`json|\`\`\`/g,'').trim());
      if (Array.isArray(parsed)) {
        for (const { h2, scu } of parsed) {
          if (!h2 || !scu || (scu.match(/\b\w+\b/g)||[]).length < 50) continue;
          const h2Line = `## ${h2}`;
          const idx = finalRaw.indexOf(h2Line);
          if (idx === -1) continue;
          const afterH2 = finalRaw.indexOf('\n', idx) + 1;
          finalRaw = finalRaw.slice(0, afterH2) + '\n' + scu.trim() + '\n\n' + finalRaw.slice(afterH2);
          fixes.push(`SCU: "${h2.slice(0,50)}" (${(scu.match(/\b\w+\b/g)||[]).length}w)`);
        }
      }
    } catch(e) { console.log(clr('yellow',`  ⚠️  SCU: ${e.message.slice(0,80)}`)); }
  }

  // ── TASK 2: Internal links ──────────────────────────────────
  if (needsLinks) {
    const currentLinks = (finalRaw.match(/\/blog\/[\w-]+/g)||[]).map(l=>l.replace('/blog/',''));
    const availableLinks = linkMap.split('\n').filter(l => !currentLinks.some(cl => l.includes(cl)));
    try {
      const resp = await ask(systemCtx,
        `Add ${Math.max(1, 3-intLinks)} internal link(s) to this article.
Current links: ${intLinks}. Need: minimum 3. ${!first500HasLink?'MUST add 1 link within first 500 words.':''}

Available links (ONLY use these):
${availableLinks.slice(0,8).join('\n')}

Rules:
- Descriptive anchor text matching the linked article's topic
- Choose links most relevant to: "${fm.title}"
- ${!first500HasLink ? 'First link must go early in the article' : ''}
- No anchors: "click here","here","read more","this article"

Return JSON array ONLY:
[{"anchor":"descriptive text","slug":"the-slug","insertAfter":"first 50 chars of the sentence after which to insert"}]`, 500);

      const parsed = JSON.parse(resp.replace(/\`\`\`json|\`\`\`/g,'').trim());
      if (Array.isArray(parsed)) {
        for (const { anchor, slug: lSlug, insertAfter } of parsed) {
          if (!anchor || !lSlug) continue;
          if (finalRaw.includes(`/blog/${lSlug}`)) continue;
          if (!REAL_DATA.internalLinks[lSlug]) continue; // only real slugs
          const mdLink = `[${anchor}](/blog/${lSlug})`;
          const searchIdx = insertAfter ? finalRaw.indexOf(insertAfter.slice(0,40)) : -1;
          if (searchIdx > -1) {
            const dotIdx = finalRaw.indexOf('.', searchIdx) + 1;
            finalRaw = finalRaw.slice(0, dotIdx) + ` For more detail, see ${mdLink}.` + finalRaw.slice(dotIdx);
          } else {
            // Append before What Next or at end
            const wnIdx = finalRaw.indexOf('\n## What Next');
            const at    = wnIdx > -1 ? wnIdx : finalRaw.length;
            finalRaw = finalRaw.slice(0, at) + `\n\nAlso useful: ${mdLink}.\n` + finalRaw.slice(at);
          }
          fixes.push(`Link: [${anchor}](/blog/${lSlug})`);
        }
      }
    } catch(e) { console.log(clr('yellow',`  ⚠️  Links: ${e.message.slice(0,80)}`)); }
  }

  // ── TASK 3: E-E-A-T sentences ──────────────────────────────
  if (needsEEAT) {
    try {
      const resp = await ask(systemCtx,
        `This article has only ${eeat}/4 required E-E-A-T signals. Add 2-3 short sentences to inject real credibility.

Each sentence must include AT LEAST ONE of:
- A specific real number from the data above (RAM MB, cost Rs/€, time, version)
- A personal production outcome ("I've been running X for Y months in production")
- A failure/error with exact detail ("failed auto-renewal 2/5 times")
- "as of March 2026" freshness signal

Rules:
- First-person "I" voice — Ankit's experience
- ONLY use numbers from the real data above — never invent
- Each sentence natural in context of: "${fm.title}"
- 1-2 sentences max per injection point

Return JSON array ONLY:
[{"sentence":"the full sentence","insertAfter":"first 40 chars of nearby existing text"}]`, 600);

      const parsed = JSON.parse(resp.replace(/\`\`\`json|\`\`\`/g,'').trim());
      if (Array.isArray(parsed)) {
        for (const { sentence, insertAfter } of parsed) {
          if (!sentence || sentence.length < 20) continue;
          const searchIdx = insertAfter ? finalRaw.indexOf(insertAfter.slice(0,40)) : -1;
          if (searchIdx > -1) {
            const paraEnd = finalRaw.indexOf('\n\n', searchIdx);
            if (paraEnd > -1) {
              finalRaw = finalRaw.slice(0, paraEnd) + ' ' + sentence.trim() + finalRaw.slice(paraEnd);
              fixes.push(`E-E-A-T: "${sentence.slice(0,60)}"`);
            }
          }
        }
      }
    } catch(e) { console.log(clr('yellow',`  ⚠️  E-E-A-T: ${e.message.slice(0,80)}`)); }
  }

  if (fixes.length === 0) return null;
  return { raw: finalRaw, what: `SCU+Links+E-E-A-T (${fixes.length} fixes)`, preview: fixes[0] };
}

main().catch(e=>{console.error(clr('red','Fatal: '+e.message));process.exit(1);});
