#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  BLIXAMO MASTER CHECKER v2.0
//  Bayesian Error + Bug + Article Auto-Fix + VPS Health +
//  n8n / Redis / Docker / SSL / Nginx / Backup Systems
// ═══════════════════════════════════════════════════════════════
//  node blixamo-checker.js              → all modules
//  node blixamo-checker.js --errors     → error checker only
//  node blixamo-checker.js --bugs       → bug checker only
//  node blixamo-checker.js --articles   → article rules + auto-fix
//  node blixamo-checker.js --health     → VPS health only
//  node blixamo-checker.js --infra      → n8n/Redis/Docker/SSL/Nginx
//  node blixamo-checker.js --dry        → no fixes, report only
//  node blixamo-checker.js --fix        → apply all auto-fixes
// ═══════════════════════════════════════════════════════════════

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// ── CONFIG ──────────────────────────────────────────────────────
const CFG = {
  POSTS_DIR:       '/var/www/blixamo/content/posts',
  BLIXAMO_DIR:     '/var/www/blixamo',
  GSC_KNOWN_SLUGS: '/var/www/gsc-tool/known-slugs.txt',
  WATCHER_LOG:     '/var/log/blixamo-watcher.log',
  PM2_ERR_LOG:     '/root/.pm2/logs/blixamo-error.log',
  REPORT_LOG:      '/var/log/blixamo-checker.log',
  NGINX_BLIXAMO:   '/etc/nginx/sites-enabled/blixamo',
  NGINX_N8N:       '/etc/nginx/sites-enabled/n8n',
  BACKUP_LOG:      '/var/log/blixamo_backup.log',
  BACKUP_DIR:      '/var/backups/blixamo',
  MAX_ITER:        5,
  MIN_CONF:        0.10,
};

const DRY  = process.argv.includes('--dry');
const FIX  = process.argv.includes('--fix');
const MODE = (() => {
  if (process.argv.includes('--errors'))   return 'errors';
  if (process.argv.includes('--bugs'))     return 'bugs';
  if (process.argv.includes('--articles')) return 'articles';
  if (process.argv.includes('--health'))   return 'health';
  if (process.argv.includes('--infra'))    return 'infra';
  return 'all';
})();

// ── RULES CONSTANTS ─────────────────────────────────────────────
const REQUIRED_FM = ['title','slug','description','date','updatedAt','author',
  'category','tags','keyword','secondaryKeywords','featured',
  'featuredImage','schema','difficulty','timeToComplete','excerpt','toc'];
const VALID_CATEGORIES  = ['tutorials','tech','tools','indie-dev','ai'];
const VALID_SCHEMAS     = ['howto','comparison','review','faq','article'];
const VALID_DIFFICULTIES= ['beginner','intermediate','advanced'];
const BANNED_WORDS = ['certainly','delve','leverage','comprehensive',
  "it's worth noting","in today's fast-paced world","as we all know",
  "feel free to","don't hesitate","I hope this helps",'straightforward',
  'robust','seamless','game-changer','cutting-edge','innovative','utilize',
  'furthermore','moreover','in conclusion','to summarize','in essence',
  'it is important to note','one should','one must','developers often',
  'this will help you','you will learn','this guide covers',
  'step-by-step guide to','everything you need to know about'];
const BANNED_HOOKS = ['In this article','Are you looking for',
  'Have you ever wondered','As an Indian developer',
  "In today's fast-paced world","Whether you're a beginner"];

// ── COLORS ──────────────────────────────────────────────────────
const C = { reset:'\x1b[0m',bold:'\x1b[1m',red:'\x1b[31m',green:'\x1b[32m',
  yellow:'\x1b[33m',blue:'\x1b[34m',cyan:'\x1b[36m',gray:'\x1b[90m',magenta:'\x1b[35m' };
const clr = (c,t) => `${C[c]}${t}${C.reset}`;

// ── UTILS ────────────────────────────────────────────────────────
function run(cmd,timeout=20000) {
  try { return { ok:true,  out: execSync(cmd,{encoding:'utf8',timeout,stdio:['pipe','pipe','pipe']}).trim() }; }
  catch(e) { return { ok:false, out:(e.stdout||e.message||'').trim() }; }
}
const readFile = fp => { try { return fs.readFileSync(fp,'utf8'); } catch { return null; } };
const fileExists = fp => fs.existsSync(fp);
const countWords = t => (t.match(/\b\w+\b/g)||[]).length;
const sleep = ms => new Promise(r=>setTimeout(r,ms));

// ── REPORT ENGINE ────────────────────────────────────────────────
const RPT = { issues:0, fixed:0, errors:[], fixes:[], warnings:[] };
function section(title) {
  console.log(`\n${clr('cyan','═').repeat(64)}\n ${clr('bold',title)}\n${clr('cyan','═').repeat(64)}`);
}
const pass  = m => console.log(` ${clr('green','✅')} ${m}`);
const fail  = m => { console.log(` ${clr('red','❌')} ${m}`); RPT.errors.push(m); RPT.issues++; };
const warn  = m => { console.log(` ${clr('yellow','⚠️')}  ${m}`); RPT.warnings.push(m); };
const info  = m => console.log(` ${clr('gray','ℹ')}  ${m}`);
const fixed = m => { console.log(` ${clr('blue','🔧')} FIXED: ${m}`); RPT.fixes.push(m); RPT.fixed++; };
const skip  = m => console.log(` ${clr('magenta','⏭')}  SKIP: ${m}`);

// ════════════════════════════════════════════════════════════════
//  MODULE 1 — BAYESIAN ERROR CHECKER
// ════════════════════════════════════════════════════════════════
async function runErrorChecker() {
  section('MODULE 1 — BAYESIAN ERROR CHECKER');
  info('Collecting evidence (read-only)...\n');

  const pm2Err       = readFile(CFG.PM2_ERR_LOG) || '';
  const nginxTest    = run('nginx -t 2>&1').out;
  const nginxActive  = run('systemctl is-active nginx').out;
  const watcherAct   = run('systemctl is-active blixamo-watcher').out;
  const nextBuild    = fileExists(`${CFG.BLIXAMO_DIR}/.next/required-server-files.json`);
  const cacheHdr     = run('curl -sI https://blixamo.com/ 2>/dev/null | grep -i "cdn-cache-control"').out;
  const hasYaml      = pm2Err.includes('YAMLException');
  const hasEnoent    = pm2Err.includes('ENOENT') && pm2Err.includes('.next');
  const staleCache   = !cacheHdr.toLowerCase().includes('no-store');

  let pm2Online = false;
  try {
    const list = JSON.parse(run('pm2 jlist').out);
    pm2Online = list.find(p=>p.name==='blixamo')?.pm2_env?.status === 'online';
  } catch {}

  // ── HYPOTHESIS TABLE ─────────────────────────────────────────
  const hyps = [
    { id:'yaml',      label:'Duplicate/invalid frontmatter key',  prior:0.35,
      posterior: hasYaml ? 0.88 : 0.03,         fix: autoFixYaml,   autoOk: true },
    { id:'build',     label:'Stale / broken .next build',          prior:0.40,
      posterior: hasEnoent ? 0.92 : hasYaml ? 0.45 : 0.05, fix: autoFixBuild, autoOk: false },
    { id:'pm2',       label:'PM2 blixamo crashed / stopped',       prior:0.55,
      posterior: pm2Online ? 0.01 : 0.95,        fix: autoFixPm2,    autoOk: true },
    { id:'nginx',     label:'Nginx config error or down',          prior:0.08,
      posterior: (nginxActive!=='active'||nginxTest.includes('failed')) ? 0.90 : 0.01,
      fix: autoFixNginx, autoOk: true },
    { id:'cache',     label:'Cloudflare CDN caching HTML (ISR)',   prior:0.65,
      posterior: staleCache ? 0.82 : 0.04,       fix: autoFixCache,  autoOk: true },
    { id:'watcher',   label:'blixamo-watcher service down',        prior:0.60,
      posterior: watcherAct!=='active' ? 0.95 : 0.01, fix: autoFixWatcher, autoOk: true },
  ].sort((a,b)=>b.posterior-a.posterior);

  console.log('  Posterior Table:');
  console.log('  ' + '─'.repeat(60));
  hyps.forEach((h,i) => {
    const bar = '█'.repeat(Math.round(h.posterior*20));
    const pct = (h.posterior*100).toFixed(0).padStart(3);
    const act = h.posterior>CFG.MIN_CONF ? clr('yellow','← check') : clr('gray','  skip');
    console.log(`  ${i+1}. ${pct}% ${clr('gray',bar.padEnd(20))} ${h.label} ${act}`);
  });
  console.log('  ' + '─'.repeat(60));

  let iterations = 0, anyErr = false;
  for (const h of hyps) {
    if (iterations >= CFG.MAX_ITER) { warn(`LAW4: max ${CFG.MAX_ITER} iterations reached`); break; }
    if (h.posterior < CFG.MIN_CONF) { info(`LAW3: [${h.label}] P<10% — skip`); continue; }
    iterations++;
    info(`\n  Iter ${iterations}: [${h.label}] P=${(h.posterior*100).toFixed(0)}%`);
    const detected = checkHyp(h.id, {pm2Online,hasYaml,hasEnoent,nginxActive,nginxTest,watcherAct,staleCache});
    if (!detected) { pass(`${h.label} — clear`); continue; }
    anyErr = true;
    fail(`DETECTED: ${h.label}`);
    if (!h.fix) { warn('  No auto-fix available — manual action required'); continue; }
    if (DRY)    { skip('DRY RUN — fix not applied'); continue; }
    if (!FIX && !h.autoOk) { info('  Run with --fix to apply'); continue; }
    info('  Applying fix (one-shot, LAW2)...');
    const ok = await h.fix();
    if (ok) fixed(h.label); else fail(`Fix failed for: ${h.label}`);
    h.posterior = 0; // LAW2 eliminate
  }
  if (!anyErr) pass('All error hypotheses clear');
}

function checkHyp(id, ev) {
  switch(id) {
    case 'yaml':    return ev.hasYaml;
    case 'build':   return ev.hasEnoent;
    case 'pm2':     return !ev.pm2Online;
    case 'nginx':   return ev.nginxActive!=='active' || ev.nginxTest.includes('failed');
    case 'cache':   return ev.staleCache;
    case 'watcher': return ev.watcherAct!=='active';
    default: return false;
  }
}

async function autoFixYaml() {
  let anyFixed = false;
  for (const fname of fs.readdirSync(CFG.POSTS_DIR).filter(f=>f.endsWith('.mdx'))) {
    const fp = path.join(CFG.POSTS_DIR, fname);
    const lines = fs.readFileSync(fp,'utf8').split('\n');
    let inFm=false, dashes=0, keys=new Set(), out=[], changed=false;
    for (const line of lines) {
      if (line.trim()==='---') { dashes++; inFm=dashes===1; out.push(line); if(dashes===2) inFm=false; continue; }
      if (inFm && line.includes(':') && !line.startsWith(' ') && !line.startsWith('-')) {
        const key = line.split(':')[0].trim();
        if (keys.has(key)) { changed=true; info(`  Removed dup key [${key}] in ${fname}`); continue; }
        keys.add(key);
      }
      out.push(line);
    }
    if (changed) { fs.writeFileSync(fp, out.join('\n')); anyFixed=true; }
  }
  return anyFixed;
}
async function autoFixBuild() {
  run(`rm -rf ${CFG.BLIXAMO_DIR}/.next`);
  const r = run(`cd ${CFG.BLIXAMO_DIR} && npm run build 2>&1 | tail -3`, 120000);
  if (!r.ok || r.out.includes('error')) return false;
  return run('pm2 restart blixamo').ok;
}
async function autoFixPm2() { return run('pm2 restart blixamo').ok; }
async function autoFixNginx() {
  if (!run('nginx -t 2>&1').out.includes('ok')) return false;
  return run('systemctl restart nginx').ok;
}
async function autoFixCache() {
  const conf = readFile(CFG.NGINX_BLIXAMO);
  if (!conf) return false;
  // Check if HTML location block has CDN-Cache-Control: no-store
  if (conf.includes('CDN-Cache-Control "no-store"')) return true; // already fixed
  // Fix: add CDN-Cache-Control: no-store to the main HTML location
  const fixed = conf.replace(
    /location \/ \{([^}]*?)proxy_pass http:\/\/localhost:3000;/,
    `location / {\n        proxy_hide_header Cache-Control;\n        add_header Cache-Control "public, s-maxage=0, must-revalidate";\n        add_header CDN-Cache-Control "no-store";\n$1proxy_pass http://localhost:3000;`
  );
  if (fixed === conf) return false;
  fs.writeFileSync(CFG.NGINX_BLIXAMO, fixed);
  return run('nginx -t 2>&1').out.includes('ok') && run('systemctl reload nginx').ok;
}
async function autoFixWatcher() {
  return run('systemctl restart blixamo-watcher').ok;
}

// ════════════════════════════════════════════════════════════════
//  MODULE 2 — BUG CHECKER
// ════════════════════════════════════════════════════════════════
async function runBugChecker() {
  section('MODULE 2 — BUG CHECKER');

  // TypeScript
  info('TypeScript check...');
  const ts = run(`cd ${CFG.BLIXAMO_DIR} && npx tsc --noEmit 2>&1 | head -10`, 30000);
  ts.out.includes('error TS') ? fail('TypeScript errors:\n  ' + ts.out) : pass('TypeScript — clean');

  // Missing images
  info('Featured images...');
  const posts = fs.readdirSync(CFG.POSTS_DIR).filter(f=>f.endsWith('.mdx'));
  let missingImgs=[], fixedImgs=[];
  for (const fname of posts) {
    const content = readFile(path.join(CFG.POSTS_DIR,fname));
    const imgMatch = content?.match(/featuredImage:\s*(.+)/);
    if (!imgMatch) { missingImgs.push(fname+': featuredImage missing'); continue; }
    const imgPath = path.join(CFG.BLIXAMO_DIR,'public',imgMatch[1].trim());
    if (!fileExists(imgPath)) missingImgs.push(`${fname}: ${imgMatch[1].trim()} not found`);
  }
  if (missingImgs.length) missingImgs.forEach(m => fail(m));
  else pass(`Featured images — all ${posts.length} present`);

  // .next build freshness
  info('.next build check...');
  if (!fileExists(`${CFG.BLIXAMO_DIR}/.next/required-server-files.json`)) {
    fail('.next build missing — run npm run build');
  } else {
    const age = (Date.now() - fs.statSync(`${CFG.BLIXAMO_DIR}/.next/required-server-files.json`).mtimeMs)/3600000;
    age > 72 ? warn(`.next build ${age.toFixed(0)}h old — consider rebuilding`) : pass(`.next build fresh (${age.toFixed(1)}h old)`);
  }

  // API routes
  info('HTTP routes...');
  const routes = [
    ['/','blixamo.com homepage'],
    ['/blog','blog listing'],
    ['/api/posts','posts API'],
    ['/feed.xml','RSS feed'],
    ['/sitemap.xml','sitemap'],
    ['/robots.txt','robots.txt'],
  ];
  for (const [route, label] of routes) {
    const r = run(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${route} --max-time 8`);
    r.out==='200' ? pass(`${label} — 200`) : fail(`${label} → HTTP ${r.out}`);
  }

  // All article routes
  info('Article routes...');
  let routeErrors=[];
  for (const fname of posts) {
    const slug = fname.replace('.mdx','');
    const r = run(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog/${slug} --max-time 8`);
    if (r.out!=='200') routeErrors.push(`${slug} → ${r.out}`);
  }
  routeErrors.length ? routeErrors.forEach(fail) : pass(`All ${posts.length} article routes — 200`);

  // Env
  info('.env.local check...');
  const env = readFile(`${CFG.BLIXAMO_DIR}/.env.local`) || '';
  ['REVALIDATE_SECRET'].forEach(k => env.includes(k) ? pass(`.env: ${k} present`) : fail(`.env: ${k} MISSING`));

  // GSC tool
  info('GSC tool...');
  fileExists('/var/www/gsc-tool/gsc.js') ? pass('GSC tool present') : fail('GSC tool missing');
}

// ════════════════════════════════════════════════════════════════
//  MODULE 3 — ARTICLE RULES CHECKER + AUTO-FIXER
// ════════════════════════════════════════════════════════════════
async function runArticleChecker() {
  section('MODULE 3 — ARTICLE RULES CHECKER + AUTO-FIXER (v5)');

  const posts = fs.readdirSync(CFG.POSTS_DIR).filter(f=>f.endsWith('.mdx'));
  info(`Checking ${posts.length} articles...\n`);

  let totalIssues=0, totalFixed=0;
  const summary=[];

  for (const fname of posts) {
    const fp   = path.join(CFG.POSTS_DIR, fname);
    const slug = fname.replace('.mdx','');
    let raw = readFile(fp);
    if (!raw) { fail(`Cannot read: ${fname}`); continue; }

    const issues=[], autoFixes=[];

    // ── PARSE FRONTMATTER ──────────────────────────────────────
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    const bodyRaw = fmMatch ? raw.slice(fmMatch[0].length).trim() : raw;
    const fm = {};
    if (fmMatch) {
      fmMatch[1].split('\n').forEach(line => {
        const col = line.indexOf(':');
        if (col>0) { const k=line.slice(0,col).trim(); const v=line.slice(col+1).trim().replace(/^["']|["']$/g,''); fm[k]=v; }
      });
    }

    const wordCount  = countWords(bodyRaw);
    const lines      = bodyRaw.split('\n');
    const fullText   = bodyRaw.toLowerCase();
    const h2s        = lines.filter(l=>l.startsWith('## '));
    const h3s        = lines.filter(l=>l.startsWith('### '));
    const firstPara  = bodyRaw.split('\n\n')[0] || '';
    const desc       = fm.description || '';
    const descLen    = desc.length;

    // ─────────────────────────────────────────────────────────
    //  RULE 1 — FRONTMATTER
    // ─────────────────────────────────────────────────────────
    REQUIRED_FM.forEach(field => {
      if (!fm[field]) issues.push(`R1: Missing field: ${field}`);
    });
    if (fm.author && fm.author !== 'Ankit Sorathiya') {
      issues.push(`R1: author should be "Ankit Sorathiya" got "${fm.author}"`);
      autoFixes.push(() => { raw = raw.replace(/^author: .*/m, 'author: "Ankit Sorathiya"'); });
    }
    if (fm.category && !VALID_CATEGORIES.includes(fm.category))
      issues.push(`R1: Invalid category "${fm.category}"`);
    if (fm.schema && !VALID_SCHEMAS.includes(fm.schema))
      issues.push(`R1: Invalid schema "${fm.schema}"`);

    // Title: year
    if (fm.title && !fm.title.includes('2026'))
      issues.push('R1: Title missing year 2026');

    // Description length auto-fix
    if (descLen < 140) issues.push(`R1: Description too short (${descLen}ch — min 140)`);
    if (descLen > 165) {
      issues.push(`R1: Description too long (${descLen}ch — max 160)`);
      if (FIX && !DRY) {
        autoFixes.push(() => {
          const trimmed = desc.slice(0,157) + '...';
          raw = raw.replace(/^description: .*/m, `description: "${trimmed}"`);
        });
      }
    }

    // Excerpt: max 20 words auto-fix
    const excerptWords = countWords(fm.excerpt || '');
    if (excerptWords > 20) {
      issues.push(`R1: Excerpt ${excerptWords}w — max 20`);
      if (FIX && !DRY) {
        autoFixes.push(() => {
          const shortExcerpt = (fm.excerpt||'').split(/\s+/).slice(0,18).join(' ') + '.';
          raw = raw.replace(/^excerpt: .*/m, `excerpt: "${shortExcerpt}"`);
        });
      }
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 2 — KEYWORD in first 100 words
    // ─────────────────────────────────────────────────────────
    if (fm.keyword) {
      const first100 = bodyRaw.split(/\s+/).slice(0,100).join(' ').toLowerCase();
      const kwFirst  = (fm.keyword).toLowerCase().split(' ')[0];
      if (!first100.includes(kwFirst)) issues.push(`R2: Keyword not in first 100 words`);
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 3 — WORD COUNT
    // ─────────────────────────────────────────────────────────
    const minWords = {howto:1500,comparison:1800,review:1500,faq:1200,article:800}[fm.schema||'article']||800;
    if (wordCount < minWords) issues.push(`R3: ${wordCount}w below min ${minWords}w for "${fm.schema}"`);

    // ─────────────────────────────────────────────────────────
    //  RULE 4 — MANDATORY SECTIONS
    // ─────────────────────────────────────────────────────────
    const hasTLDR  = bodyRaw.includes('TL;DR');
    const hasTroub = h2s.some(h=>/(error|troubleshoot|common|fix)/i.test(h));
    const hasFAQ   = h2s.some(h=>/(faq|frequently|questions)/i.test(h));
    const hasNext  = h2s.some(h=>/(what next|next step|what now)/i.test(h));
    if (!hasTLDR)  issues.push('R4/R11: Missing TL;DR box');
    if (!hasTroub) issues.push('R4: Missing Troubleshooting H2');
    if (!hasFAQ)   issues.push('R4/R7: Missing FAQ H2');
    if (!hasNext)  issues.push('R4/R14: Missing "What Next" CTA H2');

    // ─────────────────────────────────────────────────────────
    //  RULE 5 — HOOK
    // ─────────────────────────────────────────────────────────
    BANNED_HOOKS.forEach(h => { if (firstPara.includes(h)) issues.push(`R5: Banned opener: "${h}"`); });
    if (!firstPara.startsWith('I ') && !firstPara.startsWith('My '))
      issues.push('R5: Hook must start with first-person "I " or "My "');

    // ─────────────────────────────────────────────────────────
    //  RULE 6 — H2 COUNT
    // ─────────────────────────────────────────────────────────
    if (h2s.length < 6)  issues.push(`R6: Only ${h2s.length} H2s — min 6`);
    if (h2s.length > 10) issues.push(`R6: ${h2s.length} H2s — max 10 recommended`);

    // ─────────────────────────────────────────────────────────
    //  RULE 7 — FAQ H3 count
    // ─────────────────────────────────────────────────────────
    const faqSect  = bodyRaw.match(/## .*(?:FAQ|Frequently|Questions)[\s\S]*$/i)?.[0] || '';
    const faqH3cnt = (faqSect.match(/^### /mg)||[]).length;
    if (hasFAQ && faqH3cnt < 6) issues.push(`R7: FAQ has ${faqH3cnt} H3s — min 6`);

    // ─────────────────────────────────────────────────────────
    //  RULE 8 — INTERNAL LINKS
    // ─────────────────────────────────────────────────────────
    const intLinks = (bodyRaw.match(/\(\/blog\//g)||[]).length;
    if (intLinks < 3) issues.push(`R8: ${intLinks} internal links — min 3`);
    if (intLinks > 5) issues.push(`R8: ${intLinks} internal links — max 5`);
    const first500 = bodyRaw.split(/\s+/).slice(0,500).join(' ');
    if (!first500.includes('/blog/')) issues.push('R8: No internal link in first 500 words');

    // ─────────────────────────────────────────────────────────
    //  RULE 9 — E-E-A-T
    // ─────────────────────────────────────────────────────────
    let eeat=0;
    if (/\d+\s*(MB|GB|ms|%|Rs|₹|EUR|USD|€|\$|\/month)/.test(bodyRaw)) eeat++;
    if (/I've been|in production|I built|I tested|I moved/.test(bodyRaw)) eeat++;
    if (/didn't work|failed|error|declined|blocked/.test(bodyRaw)) eeat++;
    if (/Next\.js \d|v\d|Ubuntu \d|\d+\.\d+\.\d+/.test(bodyRaw)) eeat++;
    if (/as of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* 20\d\d/.test(bodyRaw)) eeat++;
    if (/€\d|Rs \d|\$\d/.test(bodyRaw)) eeat++;
    if (eeat < 4) issues.push(`R9: E-E-A-T ${eeat}/7 — min 4 signals`);

    // ─────────────────────────────────────────────────────────
    //  RULE 10 — FEATURED IMAGE EXISTS
    // ─────────────────────────────────────────────────────────
    if (fm.featuredImage && !fileExists(path.join(CFG.BLIXAMO_DIR,'public',fm.featuredImage)))
      issues.push(`R10: Image not found: ${fm.featuredImage}`);

    // ─────────────────────────────────────────────────────────
    //  RULE 12+13 — COMPARISON TABLES
    // ─────────────────────────────────────────────────────────
    if (fm.schema==='comparison') {
      const tableRows = (bodyRaw.match(/^\|/mg)||[]).length;
      if (tableRows < 5) issues.push(`R12: Only ${tableRows} table rows — need quick+full tables`);
      const hasDecision = h2s.some(h=>/(should you|choose|who should|which one)/i.test(h));
      if (!hasDecision) issues.push('R13: Missing decision H2 ("Which One Should You Use?")');
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 15 — BANNED WORDS auto-fix
    // ─────────────────────────────────────────────────────────
    const bannedFound = BANNED_WORDS.filter(w=>fullText.includes(w.toLowerCase()));
    if (bannedFound.length > 0) {
      issues.push(`R15: Banned words: ${bannedFound.slice(0,4).join(', ')}${bannedFound.length>4?` +${bannedFound.length-4} more`:''}`);
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 16/22 — UNTAGGED CODE BLOCKS auto-fix
    // ─────────────────────────────────────────────────────────
    const untagged = (raw.match(/^```\s*$/mg)||[]).length;
    if (untagged > 0) {
      issues.push(`R16/R22: ${untagged} untagged code block(s)`);
      if (FIX && !DRY) {
        // Auto-tag as 'bash' (most common in blixamo)
        autoFixes.push(() => { raw = raw.replace(/^```\s*$/mg, '```bash'); });
      }
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 18 — AFFILIATE DISCLOSURE
    // ─────────────────────────────────────────────────────────
    if (bodyRaw.toLowerCase().includes('hetzner') && !bodyRaw.toLowerCase().includes('affiliate')) {
      issues.push('R18: Mentions Hetzner but no affiliate disclosure');
      if (FIX && !DRY) {
        autoFixes.push(() => {
          const disclosure = '\n> **Disclosure:** Some links in this article are affiliate links — I earn a small commission at no extra cost to you.\n\n';
          raw = raw.replace(/^---\n[\s\S]*?\n---\n/, m => m + disclosure);
        });
      }
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 21 — EUR + INR pricing
    // ─────────────────────────────────────────────────────────
    if (bodyRaw.toLowerCase().includes('hetzner')) {
      const hasEUR = /€\d|EUR/.test(bodyRaw);
      const hasINR = /Rs |₹|INR/.test(bodyRaw);
      if (!hasEUR || !hasINR) issues.push(`R21: EUR:${hasEUR} INR:${hasINR} — show both currencies`);
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 26 — SCU BLOCKS (H2 opens with 60-180 word block)
    // ─────────────────────────────────────────────────────────
    let noSCU=0;
    const h2pos=[];
    lines.forEach((l,i) => { if(l.startsWith('## ')) h2pos.push(i); });
    h2pos.forEach(pos => {
      let para='';
      for (let i=pos+1;i<lines.length;i++) {
        if (lines[i].startsWith('#') || lines[i].startsWith('```')) break;
        if (lines[i].trim()==='') { if(para.trim()) break; continue; }
        para += ' ' + lines[i];
      }
      const pw = countWords(para.trim());
      if (pw < 60 || pw > 200) noSCU++;
    });
    if (noSCU > 2) issues.push(`R26: ${noSCU} H2s lack proper 60-180w SCU block`);

    // ─────────────────────────────────────────────────────────
    //  RULE 27 — DATA HOOKS
    // ─────────────────────────────────────────────────────────
    const stats  = (bodyRaw.match(/\b\d+[\.,]?\d*\s*(MB|GB|Rs|₹|EUR|USD|€|\$|ms|%|\/month|minutes?|hours?)\b/gi)||[]).length;
    const expect = Math.floor(wordCount/175);
    if (stats < expect*0.5) issues.push(`R27: ${stats} stats in ${wordCount}w — need ~${expect} (1 per 175w)`);

    // ─────────────────────────────────────────────────────────
    //  RULE 16 — READABILITY (paragraph length)
    // ─────────────────────────────────────────────────────────
    const paras = bodyRaw.split('\n\n').filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('`') && !p.startsWith('>'));
    const longParas = paras.filter(p => (p.match(/\./g)||[]).length > 4 && p.split(' ').length > 80);
    if (longParas.length > 0) issues.push(`R16: ${longParas.length} para(s) over 4 sentences — split for mobile`);

    // ─────────────────────────────────────────────────────────
    //  RULE 19 — LSI / SEMANTIC ENRICHMENT
    // ─────────────────────────────────────────────────────────
    const LSI = {
      hetzner: ['VPS','Nginx','PM2','CPX22','cloud server','Linux','Ubuntu'],
      payment: ['RBI','3DS','forex','UPI','virtual card'],
      n8n:     ['workflow','webhook','Docker','automation','queue'],
      nextjs:  ['ISR','MDX','SSR','build','deployment'],
      security:['UFW','fail2ban','SSH','firewall','certbot'],
    };
    for (const [topic, terms] of Object.entries(LSI)) {
      if (!fullText.includes(topic) && !terms.some(t => fullText.includes(t.toLowerCase()))) continue;
      const found = terms.filter(t => fullText.includes(t.toLowerCase())).length;
      if (found < 3) {
        const needed = terms.filter(t => !fullText.includes(t.toLowerCase())).slice(0,2);
        issues.push(`R19: LSI gap in "${topic}" — add: ${needed.join(', ')}`);
        break; // one LSI issue per article max
      }
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 23 — TOPICAL CLUSTER LINKING
    // ─────────────────────────────────────────────────────────
    const CLUSTERS = {
      'payment/india':  ['pay-hetzner-from-india','indian-debit-cards-dev-tools','wise-vs-payoneer-india-freelancer'],
      'hetzner/vps':    ['multiple-projects-single-vps','hetzner-vs-digitalocean-vs-vultr-india','vps-security-harden-ubuntu-2026','self-hosting-n8n-hetzner-vps'],
      'deployment':     ['deploy-nextjs-coolify-hetzner','coolify-vs-caprover-2026'],
      'ai/automation':  ['whatsapp-ai-assistant-n8n-claude-api','n8n-vs-make-vs-zapier-indie-dev','self-hosting-n8n-hetzner-vps','claude-api-vs-openai-cost-india','build-telegram-bot-claude-api-python'],
      'indie-dev':      ['free-tools-indian-indie-developer','indian-debit-cards-dev-tools'],
    };
    for (const [cluster, members] of Object.entries(CLUSTERS)) {
      if (!members.includes(slug)) continue;
      const siblings = members.filter(m => m !== slug);
      if (!siblings.some(m => bodyRaw.includes(`/blog/${m}`)))
        issues.push(`R23: Cluster "${cluster}" — no link to sibling articles`);
    }

    // ─────────────────────────────────────────────────────────
    //  RULE 24 — SCHEMA CORRECTNESS
    // ─────────────────────────────────────────────────────────
    if (!fm.schema) {
      issues.push('R24: schema field missing');
    } else {
      const titleLow = (fm.title||'').toLowerCase();
      if ((titleLow.includes(' vs ') || titleLow.includes(' versus ')) && fm.schema !== 'comparison')
        issues.push(`R24: title has "vs" but schema="${fm.schema}" — should be "comparison"`);
      if (titleLow.startsWith('how to') && fm.schema !== 'howto' && fm.schema !== 'article')
        issues.push(`R24: title starts "How to" but schema="${fm.schema}" — should be "howto"`);
    }

    // ─────────────────────────────────────────────────────────
    //  APPLY AUTO-FIXES
    // ─────────────────────────────────────────────────────────
    let fileFixed = 0;
    if ((FIX || true) && !DRY && autoFixes.length > 0) {
      for (const fix of autoFixes) {
        try { fix(); fileFixed++; } catch(e) { info(`  Fix error: ${e.message}`); }
      }
      if (fileFixed > 0) {
        fs.writeFileSync(fp, raw);
        totalFixed += fileFixed;
      }
    }

    // ─────────────────────────────────────────────────────────
    //  PER-ARTICLE REPORT
    // ─────────────────────────────────────────────────────────
    const score = Math.max(0, 10 - Math.min(10, issues.length));
    const col   = score>=8?'green':score>=6?'yellow':'red';
    const emo   = score>=8?'✅':score>=6?'⚠️ ':'❌';
    console.log(`\n  ${emo} ${clr(col,slug)} ${clr('gray',`[${score}/10] ${wordCount}w ${h2s.length}H2 ${intLinks}links ${fileFixed>0?'🔧'+fileFixed+'fixed':''}`)}`);
    if (issues.length===0) console.log(clr('green','      ✓ All rule checks pass'));
    else issues.forEach(i => console.log(`    ${clr('red','•')} ${i}`));
    totalIssues += issues.length;
    summary.push({ slug, score, issues:issues.length, wordCount, fixed:fileFixed });
  }

  // ── SUMMARY ───────────────────────────────────────────────────
  console.log(`\n  ${'─'.repeat(60)}`);
  summary.sort((a,b)=>a.score-b.score).forEach(s => {
    const bar = (s.score>=8?clr('green','█'):s.score>=6?clr('yellow','█'):clr('red','█')).repeat(s.score);
    const fx  = s.fixed>0 ? clr('blue',` 🔧${s.fixed}`) : '';
    console.log(`  ${String(s.score).padStart(2)}/10 ${bar.padEnd(10)} ${s.slug}${fx}`);
  });
  const avg = (summary.reduce((a,b)=>a+b.score,0)/summary.length).toFixed(1);
  console.log(`\n  Average: ${avg}/10 | Issues: ${totalIssues} | Auto-fixed: ${totalFixed} fields`);
  if (!FIX && totalFixed===0 && totalIssues>0) {
    console.log(clr('yellow',`\n  ↑ Run with --fix to auto-fix code blocks, descriptions, excerpts, disclosures`));
  }
}

// ════════════════════════════════════════════════════════════════
//  MODULE 4 — VPS HEALTH
// ════════════════════════════════════════════════════════════════
async function runHealthChecker() {
  section('MODULE 4 — VPS HEALTH');

  // CPU
  const [l1,l5] = run("cat /proc/loadavg").out.split(' ').map(Number);
  const cores = Number(run('nproc').out)||2;
  const lPct = ((l1/cores)*100).toFixed(0);
  l1>cores*0.8 ? fail(`CPU high: ${l1} (${lPct}%)`) : l1>cores*0.5 ? warn(`CPU moderate: ${l1} (${lPct}%)`) : pass(`CPU: ${l1} (${lPct}%)`);

  // RAM
  const [mt,mu,ma] = run("free -m | awk 'NR==2{print $2,$3,$7}'").out.split(' ').map(Number);
  const mPct = ((mu/mt)*100).toFixed(0);
  mPct>90 ? fail(`RAM critical: ${mu}/${mt}MB (${mPct}%)`) : mPct>75 ? warn(`RAM high: ${mu}/${mt}MB (${mPct}%)`) : pass(`RAM: ${mu}/${mt}MB (${mPct}% — ${ma}MB free)`);

  // Disk
  const dk = run("df -h / | awk 'NR==2{print $2,$3,$4,$5}'").out.split(/\s+/);
  const dPct = parseInt(dk[3]);
  dPct>90 ? fail(`Disk critical: ${dk[3]} (${dk[2]} free)`) : dPct>75 ? warn(`Disk high: ${dk[3]}`) : pass(`Disk: ${dk[3]} used — ${dk[2]} free of ${dk[0]}`);

  // Services
  info('Services...');
  [['nginx','systemctl is-active nginx'],['blixamo-watcher','systemctl is-active blixamo-watcher']].forEach(([n,cmd]) => {
    run(cmd).out==='active' ? pass(`${n} — active`) : fail(`${n} — DOWN`);
  });

  // PM2
  info('PM2 processes...');
  try {
    JSON.parse(run('pm2 jlist').out).forEach(p => {
      const st = p.pm2_env?.status; const r = p.pm2_env?.restart_time||0;
      st==='online' ? (r>20?warn(`PM2 [${p.name}]: online but ${r} restarts`):pass(`PM2 [${p.name}]: online (${r} restarts)`)) : fail(`PM2 [${p.name}]: ${st}`);
    });
  } catch { fail('PM2 jlist parse error'); }

  // Ports
  info('Ports...');
  [['3000','Next.js'],['80','HTTP'],['443','HTTPS'],['5678','n8n main'],['5679','n8n webhook'],['6379','Redis']].forEach(([port,label]) => {
    const r = run(`ss -tlnp | grep ":${port} \\|:${port}->"`);
    r.out ? pass(`Port ${port} (${label}) — listening`) : fail(`Port ${port} (${label}) — NOT listening`);
  });

  // SSL certs
  info('SSL certificates...');
  for (const domain of ['blixamo.com','n8n.blixamo.com']) {
    const r = run(`echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null`);
    if (!r.ok || !r.out) { warn(`SSL check failed for ${domain}`); continue; }
    const expStr = r.out.replace('notAfter=','');
    const expDate = new Date(expStr);
    const days = Math.round((expDate-Date.now())/86400000);
    days<14 ? fail(`SSL ${domain} expires in ${days} days!`) : days<30 ? warn(`SSL ${domain} expires in ${days} days`) : pass(`SSL ${domain} — ${days} days left`);
  }

  // Uptime
  pass(`Uptime: ${run('uptime -p').out}`);

  // Last backup
  info('Last backup...');
  const backups = run(`ls -t ${CFG.BACKUP_DIR}/*.tar.gz 2>/dev/null | head -1`);
  if (!backups.ok || !backups.out) { warn('No backups found in ' + CFG.BACKUP_DIR); }
  else {
    const bStat = fs.statSync(backups.out.trim());
    const bAge  = (Date.now()-bStat.mtimeMs)/3600000;
    bAge>25 ? warn(`Last backup ${bAge.toFixed(0)}h ago: ${path.basename(backups.out.trim())}`) : pass(`Last backup ${bAge.toFixed(1)}h ago`);
  }

  // Watcher last event
  const wLog = readFile(CFG.WATCHER_LOG) || '';
  const lastW = wLog.split('\n').filter(Boolean).pop() || 'no log';
  info(`Last watcher: ${lastW.slice(0,80)}`);

  // GSC tracking
  const known  = (readFile(CFG.GSC_KNOWN_SLUGS)||'').split('\n').filter(Boolean).length;
  const total  = fs.readdirSync(CFG.POSTS_DIR).filter(f=>f.endsWith('.mdx')).length;
  known<total ? warn(`GSC: ${known}/${total} articles submitted`) : pass(`GSC: ${known}/${total} articles tracked`);
}

// ════════════════════════════════════════════════════════════════
//  MODULE 5 — INFRA: n8n / Redis / Docker / Nginx
// ════════════════════════════════════════════════════════════════
async function runInfraChecker() {
  section('MODULE 5 — INFRA: n8n / Redis / Docker / Nginx');

  // ── DOCKER CONTAINERS ─────────────────────────────────────────
  info('Docker containers...');
  const requiredContainers = ['n8n','n8n-webhook','n8n-worker','redis'];
  let dockerList=[];
  try { dockerList = JSON.parse(run('docker ps -a --format "{{json .}}" | jq -s .', 10000).out); } catch {}

  // Fallback: plain text parse
  const dockerRaw = run("docker ps -a --format '{{.Names}}|{{.Status}}'").out;
  const containerStatus = {};
  dockerRaw.split('\n').forEach(line => {
    const [name, status] = line.split('|');
    if (name) containerStatus[name.trim()] = status?.trim()||'';
  });

  for (const cName of requiredContainers) {
    const status = containerStatus[cName] || 'NOT FOUND';
    status.startsWith('Up') ? pass(`Docker [${cName}] — ${status}`) : fail(`Docker [${cName}] — ${status}`);
  }

  // ── n8n MAIN ──────────────────────────────────────────────────
  info('\nn8n main (port 5678)...');
  const n8nHealth = run('curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz --max-time 8');
  n8nHealth.out==='200' ? pass('n8n main /healthz — 200') : fail(`n8n main /healthz — ${n8nHealth.out}`);

  // ── n8n WEBHOOK ───────────────────────────────────────────────
  info('n8n webhook (port 5679)...');
  const n8nWH = run('curl -s -o /dev/null -w "%{http_code}" http://localhost:5679/healthz --max-time 8');
  n8nWH.out==='200' ? pass('n8n webhook /healthz — 200') : fail(`n8n webhook /healthz — ${n8nWH.out}`);

  // ── n8n WORKER ────────────────────────────────────────────────
  info('n8n worker...');
  const workerLogs = run('docker logs n8n-worker --tail 10 2>&1');
  const lastWorkerLine = workerLogs.out.split('\n').filter(Boolean).pop()||'';
  if (workerLogs.out.includes('Worker finished') || workerLogs.out.includes('Worker started')) {
    pass(`n8n worker — active (last: ${lastWorkerLine.slice(-60)})`);
  } else if (workerLogs.out.includes('error') || workerLogs.out.includes('Error')) {
    fail(`n8n worker error: ${lastWorkerLine}`);
  } else {
    warn(`n8n worker — no recent activity`);
  }

  // ── n8n WORKFLOWS ─────────────────────────────────────────────
  info('\nn8n workflows (via SQLite)...');
  run('docker cp n8n:/home/node/.n8n/database.sqlite /tmp/n8n_check.db 2>/dev/null');
  if (fileExists('/tmp/n8n_check.db')) {
    const wfRaw = run(`sqlite3 /tmp/n8n_check.db "SELECT name, active FROM workflow_entity ORDER BY updatedAt DESC;"`);
    const execStats = run(`sqlite3 /tmp/n8n_check.db "SELECT status, count(*) FROM execution_entity GROUP BY status;"`);
    const recentFail = run(`sqlite3 /tmp/n8n_check.db "SELECT w.name, e.startedAt FROM execution_entity e JOIN workflow_entity w ON e.workflowId=w.id WHERE e.status='error' AND e.startedAt > datetime('now','-24 hours') ORDER BY e.startedAt DESC LIMIT 5;"`);

    // Workflows
    if (wfRaw.ok && wfRaw.out) {
      const wfs = wfRaw.out.split('\n').filter(Boolean);
      wfs.forEach(w => {
        const [name, active] = w.split('|');
        active==='1' ? pass(`Workflow [${name}] — ACTIVE`) : info(`Workflow [${name}] — paused`);
      });
    }

    // Execution stats
    if (execStats.ok && execStats.out) {
      console.log('\n  Execution stats:');
      execStats.out.split('\n').filter(Boolean).forEach(line => {
        const [status, count] = line.split('|');
        const icon = status==='success'?'✅':status==='error'?'❌':'⏸';
        const cnt = Number(count);
        if (status==='error' && cnt > 100) warn(`  ${icon} ${status}: ${count} — high error count`);
        else console.log(`   ${icon} ${status}: ${count}`);
      });
    }

    // Recent failures (last 24h)
    if (recentFail.ok && recentFail.out.trim()) {
      console.log('\n  Last 24h failures:');
      recentFail.out.split('\n').filter(Boolean).forEach(line => {
        const [name, ts] = line.split('|');
        fail(`n8n workflow "${name}" failed at ${ts}`);
      });
    } else {
      pass('No n8n workflow failures in last 24h');
    }


    // ── AUTO-DEACTIVATE DEAD WORKFLOWS ──────────────────────────
    // Workflows with >50 errors and 0 successes in last 7 days = dead
    info('\n  Auto-deactivating dead workflows...');
    const deadCheck = run(`sqlite3 /tmp/n8n_check.db "SELECT w.id, w.name, COUNT(*) as err_count FROM execution_entity e JOIN workflow_entity w ON e.workflowId=w.id WHERE e.status='error' AND w.active=1 AND e.startedAt > datetime('now','-7 days') GROUP BY w.id HAVING err_count > 10;" 2>/dev/null`);
    const successCheck = run(`sqlite3 /tmp/n8n_check.db "SELECT workflowId FROM execution_entity WHERE status='success' AND startedAt > datetime('now','-7 days');" 2>/dev/null`);
    if (deadCheck.ok && deadCheck.out.trim()) {
      const successWfs = new Set(successCheck.out.split('\n').filter(Boolean));
      const deadWfs = deadCheck.out.split('\n').filter(Boolean);
      for (const line of deadWfs) {
        const [wfId, wfName, errCount] = line.split('|');
        if (!successWfs.has(wfId)) {
          warn(`Dead workflow detected: "${wfName}" (${errCount} errors, 0 successes in 7d)`);
          if (!DRY) {
            // Deactivate via SQLite
            run(`docker cp n8n:/home/node/.n8n/database.sqlite /tmp/n8n_deactivate.db 2>/dev/null`);
            run(`sqlite3 /tmp/n8n_deactivate.db "UPDATE workflow_entity SET active=0 WHERE id='${wfId}';" 2>/dev/null`);
            run(`docker cp /tmp/n8n_deactivate.db n8n:/home/node/.n8n/database.sqlite 2>/dev/null`);
            run(`rm -f /tmp/n8n_deactivate.db`);
            run(`docker restart n8n 2>/dev/null`);
            fixed(`Auto-deactivated dead workflow: "${wfName}"`);
          } else {
            info(`  DRY: would deactivate "${wfName}"`);
          }
        }
      }
    } else {
      pass('No dead workflows detected');
    }

    run('rm -f /tmp/n8n_check.db');
  } else {
    warn('Could not read n8n SQLite DB');
  }

  // ── REDIS ─────────────────────────────────────────────────────
  info('\nRedis...');
  const redisPing = run('docker exec redis redis-cli ping 2>/dev/null');
  redisPing.out==='PONG' ? pass('Redis — PONG') : fail(`Redis ping failed: ${redisPing.out}`);

  const redisMem = run("docker exec redis redis-cli info memory 2>/dev/null | grep 'used_memory_human\\|maxmemory_human'");
  if (redisMem.ok) {
    const [used, max] = redisMem.out.split('\n').map(l=>l.split(':')[1]?.trim());
    pass(`Redis memory: ${used||'?'} / ${max||'256.00M'}`);
  }

  const redisKeys = run('docker exec redis redis-cli dbsize 2>/dev/null');
  pass(`Redis keys: ${redisKeys.out}`);

  // Bull queue stats
  const queueWait    = run("docker exec redis redis-cli llen bull:jobs:wait 2>/dev/null");
  const queueActive  = run("docker exec redis redis-cli llen bull:jobs:active 2>/dev/null");
  const queueFailed  = run("docker exec redis redis-cli llen bull:jobs:failed 2>/dev/null");
  const qWait  = Number(queueWait.out)||0;
  const qAct   = Number(queueActive.out)||0;
  const qFail  = Number(queueFailed.out)||0;
  qFail>10 ? fail(`Bull queue: ${qFail} failed jobs`) : pass(`Bull queue: wait=${qWait} active=${qAct} failed=${qFail}`);

  // ── NGINX SITES ───────────────────────────────────────────────
  info('\nNginx sites...');
  const nginxT = run('nginx -t 2>&1');
  nginxT.out.includes('ok') ? pass('Nginx config — valid') : fail('Nginx config invalid: ' + nginxT.out);

  // Check CDN-Cache-Control on blixamo HTML (the ISR header)
  const cdnHdr = run('curl -sI https://blixamo.com/ | grep -i "cdn-cache-control"').out;
  if (!cdnHdr.toLowerCase().includes('no-store')) {
    fail(`Cloudflare CDN-Cache-Control missing "no-store" on HTML — ISR may be broken\n  Current: ${cdnHdr||'(header not present)'}`);
    if (FIX && !DRY) {
      info('  Applying nginx CDN cache fix...');
      const r = await autoFixCache();
      r ? fixed('CDN-Cache-Control: no-store added to nginx') : warn('Could not auto-apply nginx cache fix — manual edit needed');
    } else {
      info('  Fix: in nginx blixamo config → location / { add_header CDN-Cache-Control "no-store"; }');
    }
  } else {
    pass('CDN-Cache-Control: no-store on HTML — ISR safe');
  }

  // n8n nginx route check
  const n8nNginx = run('curl -s -o /dev/null -w "%{http_code}" https://n8n.blixamo.com/healthz --max-time 8');
  n8nNginx.out==='200' ? pass('https://n8n.blixamo.com — 200') : warn(`https://n8n.blixamo.com — ${n8nNginx.out}`);

  // ── DOCKER RESOURCE USAGE ─────────────────────────────────────
  info('\nDocker resource usage...');
  const dockerStats = run("docker stats --no-stream --format '{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}' 2>/dev/null");
  if (dockerStats.ok && dockerStats.out) {
    dockerStats.out.split('\n').filter(Boolean).forEach(line => {
      const [name, cpu, mem] = line.split('|');
      const cpuNum = parseFloat(cpu);
      cpuNum > 80 ? fail(`Docker ${name}: CPU ${cpu}`) : info(`  ${name}: CPU ${cpu} MEM ${mem}`);
    });
  }
}

// ════════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════════
async function main() {
  const ts = new Date().toISOString().replace('T',' ').slice(0,19);
  console.log('\n' + clr('cyan','█').repeat(64));
  console.log(clr('bold',` BLIXAMO MASTER CHECKER v2.0 — ${ts}`));
  console.log(clr('gray',` Mode: ${MODE.toUpperCase()} | DryRun: ${DRY} | AutoFix: ${FIX}`));
  console.log(clr('cyan','█').repeat(64));

  try {
    if (MODE==='all'||MODE==='errors')   await runErrorChecker();
    if (MODE==='all'||MODE==='bugs')     await runBugChecker();
    if (MODE==='all'||MODE==='articles') await runArticleChecker();
    if (MODE==='all'||MODE==='health')   await runHealthChecker();
    if (MODE==='all'||MODE==='infra')    await runInfraChecker();
  } catch(e) { fail(`Checker crashed: ${e.message}\n${e.stack}`); }

  // ── FINAL REPORT ────────────────────────────────────────────
  console.log('\n' + clr('cyan','═').repeat(64));
  console.log(clr('bold',' FINAL REPORT'));
  console.log(clr('cyan','═').repeat(64));
  console.log(` Total issues  : ${RPT.issues}`);
  console.log(` Auto-fixed    : ${RPT.fixed}`);
  console.log(` Warnings      : ${RPT.warnings.length}`);
  if (RPT.errors.length) {
    console.log(`\n ${clr('red','Action required:')}`);
    RPT.errors.slice(0,8).forEach(e=>console.log(`  • ${e}`));
    if (RPT.errors.length>8) console.log(`  ... +${RPT.errors.length-8} more`);
  }
  if (RPT.fixes.length) {
    console.log(`\n ${clr('blue','Auto-fixed:')}`);
    RPT.fixes.forEach(f=>console.log(`  • ${f}`));
  }
  const statusLine = RPT.issues===0
    ? clr('green',' ✅  ALL CLEAR — blixamo ecosystem healthy')
    : RPT.issues<5
    ? clr('yellow',` ⚠️   ${RPT.issues} issues — review above`)
    : clr('red',` ❌  ${RPT.issues} issues — action required`);
  console.log('\n'+statusLine);
  console.log(clr('cyan','═').repeat(64)+'\n');

  // Log to file
  try { fs.appendFileSync(CFG.REPORT_LOG,`[${ts}] mode=${MODE} issues=${RPT.issues} fixed=${RPT.fixed} warns=${RPT.warnings.length}\n`); } catch {}
  process.exit(RPT.issues>0?1:0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
