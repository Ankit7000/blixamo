#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  BLIXAMO SCU + LINKS + E-E-A-T FIXER
//  Architecture: reads article from VPS, prints JSON patch to stdout.
//  Claude AI Desktop (this session) generates the content.
//  Then apply-patch.js writes the result back.
//
//  Usage:
//    node blixamo-scu-fixer.js --slug <slug> --mode audit
//    → prints what needs fixing (no write)
//
//    node blixamo-scu-fixer.js --slug <slug> --mode dump
//    → dumps article body + H2 list + real data context as JSON
//      (Claude reads this, generates fixes, sends back as patch)
//
//    node blixamo-scu-fixer.js --slug <slug> --mode apply --patch '<json>'
//    → applies the patch JSON Claude generated
// ═══════════════════════════════════════════════════════════════
"use strict";
const fs   = require('fs');
const path = require('path');

const POSTS_DIR = '/var/www/blixamo/content/posts';
const { buildFullContext, REAL_DATA } = require('./blixamo-context-builder');

const SLUG_IDX = process.argv.indexOf('--slug');
const MODE_IDX = process.argv.indexOf('--mode');
const PATCH_IDX = process.argv.indexOf('--patch');
const slug  = SLUG_IDX  > -1 ? process.argv[SLUG_IDX+1]  : null;
const mode  = MODE_IDX  > -1 ? process.argv[MODE_IDX+1]  : 'audit';
const patch = PATCH_IDX > -1 ? process.argv[PATCH_IDX+1] : null;

const readFile = fp => { try { return fs.readFileSync(fp,'utf8'); } catch { return null; } };
const countWords = t => (t.match(/\b\w+\b/g)||[]).length;

function parseFM(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (m) m[1].split('\n').forEach(l => {
    const c = l.indexOf(':');
    if (c > 0) fm[l.slice(0,c).trim()] = l.slice(c+1).trim().replace(/^["']|["']$/g,'');
  });
  return { fm, body: m ? raw.slice(m[0].length).trim() : raw };
}

function audit(slug) {
  const fp  = path.join(POSTS_DIR, slug+'.mdx');
  const raw = readFile(fp);
  if (!raw) { console.error('Article not found: '+slug); process.exit(1); }

  const { fm, body } = parseFM(raw);
  const lines  = raw.split('\n');
  const h2pos  = [];
  lines.forEach((l,i) => { if (l.startsWith('## ')) h2pos.push(i); });

  // SCU check
  const weakH2s = [];
  h2pos.forEach(pos => {
    let para = '';
    for (let i=pos+1; i<lines.length; i++) {
      if (lines[i].startsWith('#') || lines[i].startsWith('```')) break;
      if (!lines[i].trim()) { if (para.trim()) break; continue; }
      para += ' ' + lines[i];
    }
    const w = countWords(para.trim());
    weakH2s.push({ h2: lines[pos].replace('## ',''), words: w, hasSCU: w >= 60 });
  });

  // Link check
  const intLinks = (raw.match(/\(\/blog\//g)||[]).length;
  const first500 = raw.split(/\s+/).slice(0,500).join(' ');
  const hasFirst500Link = first500.includes('/blog/');
  const existingLinkSlugs = (raw.match(/\/blog\/([\w-]+)/g)||[]).map(l=>l.replace('/blog/',''));

  // E-E-A-T check
  let eeat = 0, eeatDetail = [];
  if (/\d+\s*(MB|GB|ms|%|Rs|₹|€|\$|\/month)/.test(body)) { eeat++; eeatDetail.push('real numbers ✅'); }
  else eeatDetail.push('real numbers ❌');
  if (/I've been|in production|I built|I tested|I run/.test(body)) { eeat++; eeatDetail.push('personal outcome ✅'); }
  else eeatDetail.push('personal outcome ❌');
  if (/failed|error|declined|blocked|didn't work/.test(body)) { eeat++; eeatDetail.push('failure story ✅'); }
  else eeatDetail.push('failure story ❌');
  if (/Next\.js \d|v\d|Ubuntu \d|\d+\.\d+\.\d+/.test(body)) { eeat++; eeatDetail.push('version specificity ✅'); }
  else eeatDetail.push('version specificity ❌');
  if (/as of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* 20\d\d/.test(body)) { eeat++; eeatDetail.push('freshness signal ✅'); }
  else eeatDetail.push('freshness signal ❌');
  if (/€\d|Rs \d|\$\d/.test(body)) { eeat++; eeatDetail.push('cost breakdown ✅'); }
  else eeatDetail.push('cost breakdown ❌');

  return {
    slug, title: fm.title, keyword: fm.keyword, schema: fm.schema,
    weakH2s: weakH2s.filter(h => !h.hasSCU),
    allH2s: weakH2s,
    intLinks, hasFirst500Link, existingLinkSlugs,
    eeat, eeatDetail,
    needsSCU: weakH2s.filter(h => !h.hasSCU).length > 0,
    needsLinks: intLinks < 3 || !hasFirst500Link,
    needsEEAT: eeat < 4,
  };
}

function dump(slug) {
  const fp  = path.join(POSTS_DIR, slug+'.mdx');
  const raw = readFile(fp);
  if (!raw) { console.error('Article not found: '+slug); process.exit(1); }

  const { fm, body } = parseFM(raw);
  const lines  = raw.split('\n');
  const h2pos  = [];
  lines.forEach((l,i) => { if (l.startsWith('## ')) h2pos.push(i); });

  // Collect H2s with their opening paragraphs
  const h2blocks = [];
  h2pos.forEach(pos => {
    let para = '';
    for (let i=pos+1; i<lines.length; i++) {
      if (lines[i].startsWith('#') || lines[i].startsWith('```')) break;
      if (!lines[i].trim()) { if (para.trim()) break; continue; }
      para += ' ' + lines[i];
    }
    h2blocks.push({
      h2: lines[pos].replace('## ',''),
      currentOpening: para.trim(),
      words: countWords(para.trim()),
      needsSCU: countWords(para.trim()) < 60
    });
  });

  const intLinks = (raw.match(/\(\/blog\//g)||[]).length;
  const existingLinkSlugs = (raw.match(/\/blog\/([\w-]+)/g)||[]).map(l=>l.replace('/blog/',''));

  let eeat = 0;
  if (/\d+\s*(MB|GB|ms|%|Rs|₹|€|\$|\/month)/.test(body)) eeat++;
  if (/I've been|in production|I built|I tested|I run/.test(body)) eeat++;
  if (/failed|error|declined|blocked|didn't work/.test(body)) eeat++;
  if (/Next\.js \d|v\d|Ubuntu \d|\d+\.\d+\.\d+/.test(body)) eeat++;
  if (/as of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* 20\d\d/.test(body)) eeat++;
  if (/€\d|Rs \d|\$\d/.test(body)) eeat++;

  const rd = REAL_DATA;
  const availableLinks = Object.entries(rd.internalLinks)
    .filter(([s]) => s !== slug && !existingLinkSlugs.includes(s))
    .map(([s,anchor]) => ({ slug: s, anchor }));

  const result = {
    article: {
      slug, title: fm.title, keyword: fm.keyword,
      schema: fm.schema, category: fm.category,
      wordCount: countWords(body),
      intLinks, existingLinkSlugs,
      eeat,
      h2blocks,
      bodyPreview: body.slice(0,600),
    },
    needs: {
      scu: h2blocks.filter(h => h.needsSCU).map(h => h.h2),
      links: intLinks < 3 ? `${3-intLinks} more links needed` : 'OK',
      first500Link: (raw.split(/\s+/).slice(0,500).join(' ')).includes('/blog/') ? 'OK' : 'MISSING — need link in first 500 words',
      eeat: eeat < 4 ? `${4-eeat} more E-E-A-T signals needed` : 'OK',
    },
    realData: {
      numbers: [
        `Hetzner CPX22: 2 vCPU, 4GB RAM, 75GB SSD — ${rd.costs.hetzner}`,
        `RAM at idle: ~400MB OS, 3.3GB usable for projects`,
        `5 projects on one VPS: ~550MB total, 2.75GB headroom`,
        `blixamo.com: 306ms avg load, live March 2026`,
        `India+Cloudflare: 280-350ms. Without CDN: 800-1200ms`,
        `n8n: ~80MB idle, ~180MB queue+Redis, peaks 250-350MB`,
        `Coolify+Traefik+Postgres+Redis: 300-400MB idle`,
        `Next.js build on CPX22: 2-4 minutes`,
        `2GB swapfile: added after 13 OOM PM2 restarts in one week`,
        `Niyo KYC: 5-7 min from download to working virtual card`,
        `Kotak 811: failed auto-renewal 2/5 times in testing`,
        `4/6 Indian cards declined on Hetzner (RBI 3DS blocks auto-renewals)`,
        `DigitalOcean 2GB: Rs 1,700/mo → Hetzner 4GB: Rs 465/mo`,
        `Wise saves ~Rs 800 per $1,000 received vs Payoneer`,
        `WhatsApp bot: under 3 seconds response via Claude API on n8n`,
        `Claude Sonnet 3.5: 400 msg/day × 500 tokens = $3/day (Rs 252)`,
        `Zapier: Rs 7,400/mo → self-hosted n8n: Rs 0/mo`,
        `SSH brute-force within 3 hours on fresh Hetzner VPS — verified from logs`,
        `PM2 blixamo: 77 restarts (ISR-related, not crashes), 2+ days uptime`,
        `Ubuntu 24.04, Next.js 15, Coolify v4, Claude Sonnet 4.5`,
      ],
      failures: rd.failures,
      production: rd.production,
    },
    availableLinks,
  };

  console.log(JSON.stringify(result, null, 2));
}

function applyPatch(slug, patchJson) {
  const fp  = path.join(POSTS_DIR, slug+'.mdx');
  let raw   = readFile(fp);
  if (!raw) { console.error('Article not found: '+slug); process.exit(1); }

  let patch;
  try { patch = JSON.parse(patchJson); }
  catch(e) { console.error('Invalid patch JSON: '+e.message); process.exit(1); }

  const fixes = [];

  // ── Apply SCU blocks ─────────────────────────────────────────
  if (patch.scuBlocks && Array.isArray(patch.scuBlocks)) {
    for (const { h2, scu } of patch.scuBlocks) {
      if (!h2 || !scu) continue;
      const w = countWords(scu);
      if (w < 50) { console.log(`  ⚠️  SCU too short (${w}w) for "${h2}" — skipping`); continue; }
      const h2Line = '## ' + h2;
      const idx    = raw.indexOf(h2Line);
      if (idx === -1) { console.log(`  ⚠️  H2 not found: "${h2}"`); continue; }
      const afterH2 = raw.indexOf('\n', idx) + 1;
      // Skip any existing blank line right after H2
      let insertAt = afterH2;
      while (raw[insertAt] === '\n') insertAt++;
      raw = raw.slice(0, afterH2) + '\n' + scu.trim() + '\n\n' + raw.slice(insertAt);
      fixes.push(`✅ SCU: "${h2.slice(0,50)}" (${w}w)`);
    }
  }

  // ── Apply internal links ──────────────────────────────────────
  if (patch.links && Array.isArray(patch.links)) {
    for (const { anchor, slug: lSlug, insertAfter } of patch.links) {
      if (!anchor || !lSlug) continue;
      if (raw.includes(`/blog/${lSlug}`)) { console.log(`  ⏭  Already linked: /blog/${lSlug}`); continue; }
      const mdLink = `[${anchor}](/blog/${lSlug})`;
      const searchIdx = insertAfter ? raw.indexOf(insertAfter.slice(0,50)) : -1;
      if (searchIdx > -1) {
        const dotIdx = raw.indexOf('.', searchIdx);
        if (dotIdx > -1) {
          raw = raw.slice(0, dotIdx+1) + ` See also: ${mdLink}.` + raw.slice(dotIdx+1);
          fixes.push(`✅ Link: ${mdLink}`);
          continue;
        }
      }
      // Fallback: before What Next or end of body
      const wnIdx = raw.indexOf('\n## What Next');
      const at    = wnIdx > -1 ? wnIdx : raw.lastIndexOf('\n## ');
      raw = raw.slice(0, at) + `\n\nFor more detail, see ${mdLink}.\n` + raw.slice(at);
      fixes.push(`✅ Link (fallback): ${mdLink}`);
    }
  }

  // ── Apply E-E-A-T sentences ───────────────────────────────────
  if (patch.eeat && Array.isArray(patch.eeat)) {
    for (const { sentence, insertAfter } of patch.eeat) {
      if (!sentence || sentence.length < 20) continue;
      const searchIdx = insertAfter ? raw.indexOf(insertAfter.slice(0,50)) : -1;
      if (searchIdx > -1) {
        const paraEnd = raw.indexOf('\n\n', searchIdx);
        if (paraEnd > -1) {
          raw = raw.slice(0, paraEnd) + ' ' + sentence.trim() + raw.slice(paraEnd);
          fixes.push(`✅ E-E-A-T: "${sentence.slice(0,60)}..."`);
          continue;
        }
      }
      // Fallback: add after first body paragraph
      const { body } = parseFM(raw);
      const firstPara = body.split('\n\n')[0];
      const firstParaIdx = raw.indexOf(firstPara);
      if (firstParaIdx > -1) {
        const endIdx = firstParaIdx + firstPara.length;
        raw = raw.slice(0, endIdx) + '\n\n' + sentence.trim() + raw.slice(endIdx);
        fixes.push(`✅ E-E-A-T (fallback): "${sentence.slice(0,60)}..."`);
      }
    }
  }

  if (fixes.length === 0) {
    console.log('Nothing applied — check patch format.');
    process.exit(0);
  }

  // Write back
  fs.writeFileSync(fp, raw);
  console.log(`\n Saved ${slug}.mdx — ${fixes.length} fix(es):`);
  fixes.forEach(f => console.log('  ' + f));

  // Append to fix log
  try {
    const ts = new Date().toISOString().replace('T',' ').slice(0,19);
    const logLine = fixes.map(f => `[${ts}] [${slug}] ${f}`).join('\n') + '\n';
    fs.appendFileSync('/var/log/blixamo-ai-fixer.log', logLine);
  } catch {}
}

// ── MAIN ──────────────────────────────────────────────────────
if (!slug) {
  // Audit all articles
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const results = posts.map(f => {
    const s = f.replace('.mdx','');
    const a = audit(s);
    return {
      slug: s,
      needsSCU: a.weakH2s.length,
      needsLinks: a.needsLinks,
      needsEEAT: a.needsEEAT,
      eeat: a.eeat,
      intLinks: a.intLinks,
    };
  });
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

if (mode === 'audit') {
  console.log(JSON.stringify(audit(slug), null, 2));
} else if (mode === 'dump') {
  dump(slug);
} else if (mode === 'apply') {
  if (!patch) { console.error('--patch required for apply mode'); process.exit(1); }
  applyPatch(slug, patch);
} else {
  console.error('Unknown mode: '+mode);
  process.exit(1);
}
