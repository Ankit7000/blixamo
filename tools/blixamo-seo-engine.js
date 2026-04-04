#!/usr/bin/env node
// ============================================================
// BLIXAMO BAYESIAN SEO ENGINE v1.0
// Automatically generates optimized keywords + titles
// using 2026 Bayesian signal weights
//
// Usage:
//   node tools/blixamo-seo-engine.js --audit
//   node tools/blixamo-seo-engine.js --keyword "hetzner coolify nextjs"
//   node tools/blixamo-seo-engine.js --title "docker setup hetzner"
//   node tools/blixamo-seo-engine.js --opportunities
//   node tools/blixamo-seo-engine.js --full-report
// ============================================================
'use strict'

const fs   = require('fs')
const path = require('path')
const matter = require('/var/www/blixamo/node_modules/gray-matter')

// ── CONFIG ────────────────────────────────────────────────────
const POSTS_DIR  = '/var/www/blixamo/content/posts'
const REPORT_OUT = '/var/log/blixamo-seo-report.json'
const args       = process.argv.slice(2)

// ── COLORS ───────────────────────────────────────────────────
const C = {
  r:'\x1b[0m', bold:'\x1b[1m',
  red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m',
  blue:'\x1b[34m', cyan:'\x1b[36m', gray:'\x1b[90m', magenta:'\x1b[35m'
}
const clr = (c, t) => `${C[c]}${t}${C.r}`
const ts  = () => new Date().toISOString().replace('T',' ').slice(0,19)

// ── PRIOR TABLE: P(rank) for DA~8 blog ───────────────────────
function basePrior(kd) {
  if (kd <= 5)  return 0.80
  if (kd <= 10) return 0.55
  if (kd <= 15) return 0.40
  if (kd <= 20) return 0.25
  if (kd <= 30) return 0.12
  if (kd <= 40) return 0.05
  return 0.02
}

// ── SIGNAL BOOSTS ─────────────────────────────────────────────
function applySignals(keyword, description='') {
  const kw  = (keyword + ' ' + description).toLowerCase()
  const signals = []
  let pBoost  = 0
  let ctrMult = 1.0

  // India/Hetzner niche — biggest boost for blixamo
  if (/hetzner|india|indian|niyo|kotak|razorpay|rupee|₹|inr/.test(kw)) {
    pBoost += 0.35; ctrMult *= 1.30
    signals.push({ name: 'Hetzner/India niche', pBoost: '+35%', ctrBoost: '+30%' })
  }

  // Personal experience angle
  if (/\bi\b|\bmy\b|how i|i run|i use|i built|i tested|i moved|i switched/.test(kw)) {
    pBoost += 0.25; ctrMult *= 1.18
    signals.push({ name: 'Personal experience', pBoost: '+25%', ctrBoost: '+18%' })
  }

  // Long-tail (3+ distinct content words)
  const words = kw.split(/\s+/).filter(w => w.length > 2 && !/\b(the|and|for|with|from|on|in|of|to|a|an)\b/.test(w))
  if (words.length >= 3) {
    pBoost += 0.15; ctrMult *= 1.08
    signals.push({ name: `Long-tail (${words.length} words)`, pBoost: '+15%', ctrBoost: '+8%' })
  }

  // VS / comparison
  if (/\bvs\b|\bversus\b/.test(kw)) {
    pBoost += 0.12; ctrMult *= 1.20
    signals.push({ name: 'VS/comparison format', pBoost: '+12%', ctrBoost: '+20%' })
  }

  // Year
  if (/2026|2027/.test(kw)) {
    pBoost += 0.08; ctrMult *= 1.05
    signals.push({ name: 'Year 2026', pBoost: '+8%', ctrBoost: '+5%' })
  }

  // Number in content
  if (/\d+/.test(kw)) {
    ctrMult *= 1.15
    signals.push({ name: 'Number', pBoost: '0%', ctrBoost: '+15%' })
  }

  // Power word
  if (/\b(real|tested|honest|free|actual|proven|fast|cheap|best|complete|full)\b/.test(kw)) {
    pBoost += 0.05; ctrMult *= 1.12
    signals.push({ name: 'Power word', pBoost: '+5%', ctrBoost: '+12%' })
  }

  // How-to intent
  if (/^(how|what|why|build|deploy|setup|install|run|create|configure)/.test(kw.trim())) {
    pBoost += 0.05; ctrMult *= 1.08
    signals.push({ name: 'How-to intent', pBoost: '+5%', ctrBoost: '+8%' })
  }

  // Title length check (if full title given)
  if (kw.length >= 20) {
    if (kw.length <= 60) {
      ctrMult *= 1.23
      signals.push({ name: 'Title ≤60ch', pBoost: '0%', ctrBoost: '+23%' })
    } else {
      ctrMult *= 0.77
      signals.push({ name: `Title truncated (${kw.length}ch)`, pBoost: '0%', ctrBoost: '-23%' })
    }
  }

  return { pBoost, ctrMult, signals }
}

// ── ESTIMATE KD FROM KEYWORD ───────────────────────────────────
function estimateKD(keyword) {
  const kw = keyword.toLowerCase()
  const words = kw.split(/\s+/)
  let kd = 40 // start broad

  if (words.length >= 4) kd = 5
  else if (words.length === 3) kd = 12
  else if (words.length === 2) kd = 22
  else kd = 45

  // India/Hetzner specificity reduces KD dramatically
  if (/india|indian|hetzner|niyo|kotak|razorpay/.test(kw)) kd = Math.max(2, kd - 18)
  if (/\bvs\b/.test(kw)) kd = Math.max(4, kd - 8)
  if (/2026/.test(kw)) kd = Math.max(2, kd - 5)

  // Specific technical combos — very low KD
  if (/hetzner.*(coolify|cpx|nextjs|n8n|docker|pm2)/.test(kw)) kd = Math.min(kd, 7)
  if (/self.host.*(n8n|hetzner|vps)/.test(kw)) kd = Math.min(kd, 6)

  return Math.round(kd)
}

// ── ESTIMATE MONTHLY SEARCHES ──────────────────────────────────
function estimateSearches(keyword) {
  const kw = keyword.toLowerCase()
  let base = 500

  // High-volume topics
  if (/docker|nginx|nextjs|react|typescript/.test(kw)) base = 8000
  if (/vps|server|cloud/.test(kw)) base = 4000
  if (/n8n|coolify|caprover|hetzner/.test(kw)) base = 1500
  if (/claude|openai|chatgpt|ai/.test(kw)) base = 6000
  if (/india|indian|rupee|payment/.test(kw)) base = 1000
  if (/postgres|postgresql/.test(kw)) base = 5000
  if (/tailwind|css/.test(kw)) base = 7000

  // Long-tail reduces volume
  const words = kw.split(/\s+/).length
  if (words >= 4) base = Math.round(base * 0.15)
  else if (words === 3) base = Math.round(base * 0.35)
  else if (words === 2) base = Math.round(base * 0.65)

  // Niche combos
  if (/hetzner.*(india|indian)/.test(kw)) base = Math.min(base, 400)
  if (/hetzner.*(coolify|nextjs|n8n)/.test(kw)) base = Math.min(base, 700)

  return Math.max(base, 100)
}

// ── REVENUE WEIGHT ─────────────────────────────────────────────
function revenueWeight(keyword) {
  const kw = keyword.toLowerCase()
  if (/hetzner|vps|server|cloud|self.host|deploy/.test(kw)) return 1.4 // €20 affiliate
  return 1.0
}

// ── COMPUTE FULL EV SCORE ──────────────────────────────────────
function scoreKeyword(keyword) {
  const kd       = estimateKD(keyword)
  const base     = basePrior(kd)
  const { pBoost, ctrMult, signals } = applySignals(keyword)
  const pRank    = Math.min(0.97, base + pBoost)
  const searches = estimateSearches(keyword)
  const revW     = revenueWeight(keyword)
  const ev       = Math.round(pRank * searches * ctrMult * revW / 100)

  return { keyword, kd, basePrior: base, pBoost, pRank, searches, ctrMult, revW, ev, signals }
}

// ── TITLE GENERATOR ───────────────────────────────────────────
function generateTitles(topic) {
  const t = topic.trim()
  const lower = t.toLowerCase()

  // Strip filler from core topic
  const core = t
    .replace(/^(how to|how i|what is|guide to|tutorial on|the complete|complete guide to)/i, '')
    .replace(/\b(in 2026|2026|complete|step.by.step|comprehensive|ultimate|guide|tutorial)\b/gi, '')
    .trim()
  const Core = core.charAt(0).toUpperCase() + core.slice(1)

  const hasHetzner = /hetzner/.test(lower)
  const hasVPS     = /vps|server/.test(lower)
  const hasVS      = /\bvs\b/.test(lower)
  const hasIndia   = /india|indian/.test(lower)
  const hasNumber  = /\d+/.test(lower)

  const templates = [
    // Personal + real number — highest CTR
    `How I ${Core} — Real Setup in 2026`,
    hasNumber
      ? `${Core} — My ${lower.match(/\d+/)?.[0] || 5}-Step Production Setup`
      : `How I ${Core} in Production`,

    // VS format
    hasVS
      ? `${Core} 2026 — Real Verdict After 30 Days`
      : `${Core} vs The Alternatives — Real 2026 Verdict`,

    // Number + audience
    `${hasNumber ? Core : '5 Ways to ' + Core} for Indie Developers 2026`,

    // Hetzner/VPS hook
    (hasHetzner || hasVPS)
      ? `${Core} on Hetzner 2026 — €5/mo Setup`
      : `${Core} 2026 — Self-Hosted for Free`,

    // Power word + specificity
    `${Core} — Tested and Deployed in 2026`,

    // India angle
    hasIndia
      ? `${Core} — India Guide 2026 (What Actually Works)`
      : `${Core} 2026 — What Nobody Tells You`,

    // Short punchy
    `${Core} 2026`,
  ]

  return templates
    .map(title => {
      const clean = title.replace(/\s+/g, ' ').trim()
      const score = scoreKeyword(clean)
      return { title: clean, chars: clean.length, ...score }
    })
    .filter((v, i, arr) => arr.findIndex(x => x.title === v.title) === i) // dedupe
    .sort((a, b) => b.ev - a.ev)
    .slice(0, 6)
}

// ── AUDIT ALL EXISTING ARTICLES ────────────────────────────────
function auditArticles() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
  const results = []

  files.forEach(file => {
    const raw  = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const { data: fm } = matter(raw)
    const slug  = fm.slug || file.replace('.mdx','')
    const title = fm.title || ''
    const kw    = fm.keyword || ''

    const titleScore = scoreKeyword(title)
    const kwScore    = scoreKeyword(kw)

    // Generate optimized title
    const optimized = generateTitles(kw || title)[0]

    results.push({
      slug,
      category: fm.category || 'unknown',
      currentTitle: title,
      currentKw: kw,
      titleScore: titleScore.ev,
      kwScore: kwScore.ev,
      pRank: Math.round(kwScore.pRank * 100),
      searches: kwScore.searches,
      signals: kwScore.signals.map(s => s.name),
      optimizedTitle: optimized?.title || title,
      optimizedTitleScore: optimized?.ev || 0,
      gain: optimized ? optimized.ev - titleScore.ev : 0,
    })
  })

  return results.sort((a, b) => b.kwScore - a.kwScore)
}

// ── UNTAPPED OPPORTUNITIES ────────────────────────────────────
function findOpportunities() {
  const targets = [
    'hetzner coolify nextjs 2026',
    'self hosted plausible analytics hetzner',
    'n8n ai agent workflow hetzner vps',
    'fastapi hetzner deployment python 2026',
    'supabase self hosted hetzner vps',
    'cloudflare pages vs hetzner vps 2026',
    'vps vs serverless cost indie developer',
    'free vps alternatives hetzner 2026',
    'ubuntu 24 vps setup guide 2026',
    'docker compose hetzner tutorial 2026',
    'nginx reverse proxy multiple apps hetzner',
    'coolify vs dokku self hosted 2026',
    'nextjs app router hetzner production',
    'redis docker hetzner setup',
    'postgresql self hosted vps hetzner',
    'github actions deploy hetzner vps',
    'fail2ban ubuntu 24 setup 2026',
    'caddy vs nginx hetzner 2026',
    'node.js pm2 hetzner production',
    'cloudflare tunnel hetzner self hosted',
  ]

  return targets
    .map(kw => scoreKeyword(kw))
    .sort((a, b) => b.ev - a.ev)
}

// ── PRINT HELPERS ─────────────────────────────────────────────
function printScore(result, label='') {
  const { keyword, kd, pRank, searches, ctrMult, ev, signals } = result
  const evColor = ev >= 70 ? 'green' : ev >= 40 ? 'yellow' : 'red'
  const pct = Math.round(pRank * 100)

  console.log(`\n${clr('cyan','─'.repeat(62))}`)
  if (label) console.log(clr('bold', ` ${label}`))
  console.log(` Keyword : ${clr('bold', keyword)}`)
  console.log(` KD est  : ${kd}  |  P(rank): ${clr(pct>=70?'green':pct>=40?'yellow':'red', pct+'%')}  |  ~${searches.toLocaleString()} searches/mo`)
  console.log(` EV Score: ${clr(evColor, String(ev))}  |  CTR mult: ${ctrMult.toFixed(2)}x`)
  console.log(` Priority: ${ev>=70?clr('green','HIGH — write this week'):ev>=40?clr('yellow','MEDIUM — write this month'):clr('red','LOW — skip unless topical')}`)
  if (signals.length) {
    console.log(` Signals :`)
    signals.forEach(s => console.log(`   ${clr('gray','•')} ${s.name}  ${clr('gray',`P:${s.pBoost} CTR:${s.ctrBoost}`)}`))
  }
}

function printTitles(titles, topic) {
  console.log(`\n${clr('cyan','═'.repeat(62))}`)
  console.log(clr('bold', ` Title variants for: "${topic}"`))
  console.log(clr('cyan','═'.repeat(62)))
  titles.forEach((t, i) => {
    const evColor = t.ev >= 70 ? 'green' : t.ev >= 40 ? 'yellow' : 'red'
    const lenOk   = t.chars <= 60
    console.log(`\n  ${clr('bold', `#${i+1}`)} EV:${clr(evColor, String(t.ev))}  ${lenOk ? clr('green','✓') : clr('red','✗')} ${t.chars}ch`)
    console.log(`     ${clr('bold', t.title)}`)
    if (t.signals.length) console.log(`     ${t.signals.slice(0,3).map(s=>clr('gray',s.name)).join(' · ')}`)
  })
}

// ── MAIN ──────────────────────────────────────────────────────
function main() {
  const mode       = args[0] || '--full-report'
  const inputIdx   = args.indexOf('--keyword') > -1 ? args.indexOf('--keyword') + 1
                   : args.indexOf('--title') > -1 ? args.indexOf('--title') + 1
                   : -1
  const inputVal   = inputIdx > -1 ? args[inputIdx] : null

  console.log(`\n${clr('cyan','█'.repeat(62))}`)
  console.log(clr('bold', ` BLIXAMO BAYESIAN SEO ENGINE v1.0 — ${ts()}`))
  console.log(clr('cyan','█'.repeat(62)))

  // ── SCORE SINGLE KEYWORD ──────────────────────────────────
  if (mode === '--keyword') {
    if (!inputVal) { console.error(clr('red', 'Usage: --keyword "your keyword here"')); process.exit(1) }
    const result = scoreKeyword(inputVal)
    printScore(result, 'KEYWORD SCORE')
    console.log('\n' + clr('cyan','─'.repeat(62)))
    console.log(clr('bold', ' Optimized title variants:'))
    printTitles(generateTitles(inputVal), inputVal)
    return
  }

  // ── GENERATE TITLES ───────────────────────────────────────
  if (mode === '--title') {
    if (!inputVal) { console.error(clr('red', 'Usage: --title "your topic here"')); process.exit(1) }
    printTitles(generateTitles(inputVal), inputVal)
    return
  }

  // ── OPPORTUNITIES ─────────────────────────────────────────
  if (mode === '--opportunities') {
    const opps = findOpportunities()
    console.log(clr('bold', '\n TOP UNTAPPED KEYWORD OPPORTUNITIES FOR BLIXAMO\n'))
    opps.forEach((o, i) => {
      const ec = o.ev >= 70 ? 'green' : o.ev >= 40 ? 'yellow' : 'red'
      console.log(` ${String(i+1).padStart(2,'0')}. EV:${clr(ec, String(o.ev).padStart(3))}  P(rank):${Math.round(o.pRank*100)}%  ~${o.searches.toLocaleString().padStart(6)}/mo  ${clr('bold', o.keyword)}`)
    })
    return
  }

  // ── AUDIT ALL ARTICLES ────────────────────────────────────
  if (mode === '--audit' || mode === '--full-report') {
    const audit = auditArticles()
    console.log(clr('bold', '\n ARTICLE SEO AUDIT — RANKED BY EV SCORE\n'))

    audit.forEach((a, i) => {
      const ec = a.kwScore >= 70 ? 'green' : a.kwScore >= 40 ? 'yellow' : 'red'
      const gainStr = a.gain > 0 ? clr('green', `+${a.gain}`) : clr('gray', String(a.gain))
      console.log(` ${String(i+1).padStart(2,'0')}. ${clr(ec, String(a.kwScore).padStart(3))} EV  P(rank):${String(a.pRank).padStart(2)}%  gain:${gainStr}`)
      console.log(`     ${clr('gray', a.slug)}`)
      console.log(`     CUR: ${a.currentTitle}`)
      if (a.gain > 5) console.log(`     OPT: ${clr('green', a.optimizedTitle)}`)
    })

    const total = audit.length
    const high  = audit.filter(a => a.kwScore >= 70).length
    const mid   = audit.filter(a => a.kwScore >= 40 && a.kwScore < 70).length
    const low   = audit.filter(a => a.kwScore < 40).length

    console.log(`\n${clr('cyan','═'.repeat(62))}`)
    console.log(` ${total} articles  |  ${clr('green',high+' HIGH')}  ${clr('yellow',mid+' MEDIUM')}  ${clr('red',low+' LOW')}`)
    console.log(clr('cyan','═'.repeat(62)))
  }

  // ── OPPORTUNITIES IN FULL REPORT ──────────────────────────
  if (mode === '--full-report') {
    const opps = findOpportunities().slice(0, 10)
    console.log(clr('bold', '\n TOP 10 UNTAPPED KEYWORDS — WRITE THESE NEXT\n'))
    opps.forEach((o, i) => {
      const ec = o.ev >= 70 ? 'green' : 'yellow'
      console.log(` ${String(i+1).padStart(2)}. EV:${clr(ec, String(o.ev))}  P(rank):${Math.round(o.pRank*100)}%  "${clr('bold', o.keyword)}"`)
    })

    // Save JSON report
    const report = {
      generated: ts(),
      audit: auditArticles(),
      opportunities: findOpportunities(),
    }
    fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2))
    console.log(`\n${clr('gray', `Report saved → ${REPORT_OUT}`)}`)
  }

  console.log()
}

main()
