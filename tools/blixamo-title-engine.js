#!/usr/bin/env node
// ================================================================
// BLIXAMO ULTIMATE TITLE ENGINE v2.0
// 6 AI model personas + GSC live data + Thompson Sampling +
// Meta desc generation + Full deploy pipeline + Cron integration
//
// Usage:
//   node blixamo-title-engine.js --topic "docker hetzner"
//   node blixamo-title-engine.js --slug coolify-vs-caprover-2026
//   node blixamo-title-engine.js --audit          # GSC-weighted audit
//   node blixamo-title-engine.js --opportunities  # CTR gap report
//   node blixamo-title-engine.js --apply --slug X # full deploy pipeline
//   node blixamo-title-engine.js --thompson       # Thompson Sampling report
// ================================================================
'use strict'

const fs     = require('fs')
const path   = require('path')
const https  = require('https')
const matter = require('/var/www/blixamo/node_modules/gray-matter')

// ── Load env ──────────────────────────────────────────────────
const envVars = {}
try {
  fs.readFileSync('/var/www/blixamo/.env.local','utf8')
    .split('\n').forEach(l => { const e=l.indexOf('='); if(e>0) envVars[l.slice(0,e).trim()]=l.slice(e+1).trim() })
} catch {}

const ANTHROPIC_API_KEY = envVars['ANTHROPIC_API_KEY'] || process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('\n❌  ANTHROPIC_API_KEY not set in /var/www/blixamo/.env.local')
  console.error('   Fix: echo "ANTHROPIC_API_KEY=sk-ant-..." >> /var/www/blixamo/.env.local\n')
  process.exit(1)
}

const Anthropic = require('/var/www/blixamo/node_modules/@anthropic-ai/sdk')
const ai = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

// ── Paths ─────────────────────────────────────────────────────
const POSTS_DIR    = '/var/www/blixamo/content/posts'
const GSC_DIR      = '/var/www/gsc-tool'
const STATE_FILE   = '/var/log/blixamo-title-state.json'
const REPORT_FILE  = '/var/log/blixamo-title-report.json'
const N8N_WEBHOOK  = 'http://localhost:5679/webhook/title-engine'

// ── Colors ────────────────────────────────────────────────────
const C = { r:'\x1b[0m',bold:'\x1b[1m',red:'\x1b[31m',green:'\x1b[32m',
  yellow:'\x1b[33m',blue:'\x1b[34m',cyan:'\x1b[36m',gray:'\x1b[90m',magenta:'\x1b[35m' }
const clr = (c,t) => `${C[c]}${t}${C.r}`
const ts  = () => new Date().toISOString().replace('T',' ').slice(0,19)

// ── State (Thompson Sampling persistence) ─────────────────────
function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE,'utf8')) }
  catch { return { titleTests: {}, gscCache: {}, lastAudit: null, history: [] } }
}
function saveState(s) { fs.writeFileSync(STATE_FILE, JSON.stringify(s,null,2)) }

// ================================================================
// GSC INTEGRATION — live data from Search Console
// ================================================================
async function fetchGSCData(days=90) {
  const state = loadState()
  const cacheKey = `gsc_${days}`
  const cacheAge = state.gscCache[cacheKey]?.ts || 0
  if (Date.now() - cacheAge < 3600000) { // 1h cache
    return state.gscCache[cacheKey].data
  }

  try {
    const { google } = require('/var/www/gsc-tool/node_modules/googleapis')
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(GSC_DIR, 'service-account.json'),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    })
    const sc = google.searchconsole({ version: 'v1', auth })
    const dateStr = d => { const dt=new Date(); dt.setDate(dt.getDate()-d); return dt.toISOString().split('T')[0] }

    // Page-level CTR data
    const pageRes = await sc.searchanalytics.query({
      siteUrl: 'https://blixamo.com/',
      requestBody: { startDate: dateStr(days), endDate: dateStr(1),
        dimensions: ['page'], rowLimit: 100 }
    })

    // Query-level data (top keywords driving traffic)
    const queryRes = await sc.searchanalytics.query({
      siteUrl: 'https://blixamo.com/',
      requestBody: { startDate: dateStr(days), endDate: dateStr(1),
        dimensions: ['query'], rowLimit: 200 }
    })

    // Page+Query breakdown for top pages
    const pageQueryRes = await sc.searchanalytics.query({
      siteUrl: 'https://blixamo.com/',
      requestBody: { startDate: dateStr(days), endDate: dateStr(1),
        dimensions: ['page','query'], rowLimit: 500 }
    })

    const data = {
      pages: (pageRes.data.rows || []).map(r => ({
        url: r.keys[0], slug: r.keys[0].replace('https://blixamo.com/blog/','').replace('https://blixamo.com/',''),
        clicks: r.clicks, impressions: r.impressions,
        ctr: parseFloat((r.ctr*100).toFixed(2)), position: parseFloat(r.position.toFixed(1))
      })),
      queries: (queryRes.data.rows || []).map(r => ({
        query: r.keys[0], clicks: r.clicks, impressions: r.impressions,
        ctr: parseFloat((r.ctr*100).toFixed(2)), position: parseFloat(r.position.toFixed(1))
      })),
      pageQueries: (pageQueryRes.data.rows || []).map(r => ({
        slug: r.keys[0].replace('https://blixamo.com/blog/',''),
        query: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr*100
      }))
    }

    state.gscCache[cacheKey] = { ts: Date.now(), data }
    saveState(state)
    return data
  } catch(e) {
    console.log(clr('yellow', `  ⚠ GSC unavailable: ${e.message.slice(0,60)} — using estimates`))
    return null
  }
}

// Get GSC stats for a specific slug
function getSlugStats(gscData, slug) {
  if (!gscData) return null
  const page = gscData.pages.find(p => p.slug === slug || p.slug === `blog/${slug}`)
  const queries = gscData.pageQueries.filter(pq => pq.slug.includes(slug))
  return { ...page, topQueries: queries.slice(0,5) }
}

// ================================================================
// THOMPSON SAMPLING — multi-armed bandit for title A/B testing
// ================================================================
// Each title variant has Beta(alpha, beta) distribution
// alpha = clicks+1, beta = impressions-clicks+1
// Sample → pick highest → track outcomes

function thompsonSample(alpha, beta) {
  // Beta distribution sampling via Johnk's method
  const a = alpha, b = beta
  let x, y
  do {
    x = Math.pow(Math.random(), 1/a)
    y = Math.pow(Math.random(), 1/b)
  } while (x + y > 1)
  return x / (x + y)
}

function updateThompson(state, slug, titleVariant, clicks, impressions) {
  if (!state.titleTests[slug]) state.titleTests[slug] = {}
  const key = titleVariant.slice(0,40)
  if (!state.titleTests[slug][key]) state.titleTests[slug][key] = { alpha:1, beta:1, title:titleVariant }
  state.titleTests[slug][key].alpha += clicks
  state.titleTests[slug][key].beta  += Math.max(0, impressions - clicks)
  return state
}

function thompsonBestTitle(state, slug) {
  const tests = state.titleTests[slug]
  if (!tests || !Object.keys(tests).length) return null
  let best = null, bestSample = -1
  for (const [,v] of Object.entries(tests)) {
    const sample = thompsonSample(v.alpha, v.beta)
    if (sample > bestSample) { bestSample = sample; best = { ...v, sample } }
  }
  return best
}

// ================================================================
// BLIXAMO CONTEXT
// ================================================================
const BLIXAMO_CTX = `
BLOG: blixamo.com — indie developer blog by Ankit Sorathiya
NICHE: Self-hosting, VPS (Hetzner), DevOps, AI automation, indie building
AUDIENCE: Global indie developers, solo builders, DevOps practitioners
DOMAIN AUTHORITY: ~8 (new blog — needs low-KD long-tail keywords)
REAL NUMBERS: €5.19/month VPS · 306ms load · 5 apps on 1 VPS · Rs 465/month · 847 SSH attacks blocked · 35s build time
HETZNER AFFILIATE: €20 per signup — prioritize Hetzner mentions naturally
VOICE: First-person "I/My/How I", direct, technical, no hype, real failures included
BANNED: Complete, Ultimate, Comprehensive, Step-by-Step, In-Depth, Discover, Unlock, Leverage, Utilize, Boost
TITLE RULES: ≤60 chars total · primary keyword in first 40 chars · no truncation · no clickbait
CTR SIGNALS: Number (+15%) · Personal "How I" (+18%) · VS format (+20%) · Power word Real/Tested/Free (+12%) · Year 2026 (+5%)
`

// ================================================================
// 6 MODEL PERSONAS
// ================================================================
const MODELS = [
  {
    id:'semrush', name:'Semrush', icon:'📊', weight:0.22,
    specialty:'SEO data + keyword placement + search intent',
    system:`You are Semrush's title optimizer. Optimize for:
1. Exact keyword in first 40 characters
2. Search intent: informational/commercial/navigational match
3. ≤60 chars strictly (truncation = death for CTR)
4. Long-tail 3-5 word phrases (DA~8 can rank these)
5. Year 2026 for freshness
${BLIXAMO_CTX}
Return JSON: [{"title":"...","intent":"informational|commercial","kw_position":N,"chars":N,"desc":"155-char meta description optimized for CTR"}]
ONLY JSON. No markdown. No explanation.`
  },
  {
    id:'surfer', name:'Surfer SEO', icon:'🏄', weight:0.20,
    specialty:'SERP pattern matching + competitor differentiation',
    system:`You are Surfer SEO. Study the SERP and:
1. Match structural pattern of #1-3 ranking titles
2. Add differentiator competitors lack: personal numbers, 2026, real data
3. "How I" and "X vs Y" dominate indie dev SERPs
4. Featured snippet eligible (question + direct answer hint)
5. Beat competitors with specificity: "306ms", "€5.19/mo", "5 apps"
${BLIXAMO_CTX}
Return JSON: [{"title":"...","pattern":"howto|vs|listicle|question","differentiator":"what beats competitors","chars":N,"desc":"155-char meta desc"}]
ONLY JSON. No markdown. No explanation.`
  },
  {
    id:'writesonic', name:'Writesonic', icon:'🚀', weight:0.18,
    specialty:'Viral + SEO — storytelling meets searchability',
    system:`You are Writesonic AI Article Writer 6.0. Combine:
1. Narrative tension — hint at a conflict or surprising discovery
2. Outcome promise — reader knows exactly what they'll gain
3. SEO keyword embedded naturally (not stuffed)
4. 2026 trends: AI agents, self-hosting wave, indie devs quitting SaaS
5. Pattern interrupt: unexpected angle on common topics
${BLIXAMO_CTX}
Return JSON: [{"title":"...","narrative":"tension|outcome|conflict|surprise","viral_score":1-10,"chars":N,"desc":"155-char meta desc with strong hook"}]
ONLY JSON. No markdown. No explanation.`
  },
  {
    id:'copyai', name:'Copy.ai', icon:'✍️', weight:0.15,
    specialty:'Short-form virality + social sharing magnetism',
    system:`You are Copy.ai viral headline generator. Optimize for:
1. Emotional resonance: curiosity gap, FOMO, achievement
2. Social shareability: would a developer retweet this?
3. Ultra-short punch: under 50 chars when possible
4. Power words: Real, Tested, Free, Actual, Proven, Dead Simple
5. Community hooks: "I switched", "Nobody tells you", "The truth about X"
${BLIXAMO_CTX}
Return JSON: [{"title":"...","hook":"curiosity|fomo|achievement|pain|surprise","share_score":1-10,"chars":N,"desc":"155-char punchy meta desc"}]
ONLY JSON. No markdown. No explanation.`
  },
  {
    id:'chatgpt', name:'ChatGPT', icon:'🤖', weight:0.15,
    specialty:'Creative diversity — covers all format types',
    system:`You are ChatGPT generating maximally diverse title formats. Produce:
1. One listicle (number-first), one how-to, one comparison, one story
2. Natural conversational language — not robotic SEO
3. Specific numbers and real stack names for credibility
4. Developer-specific terms that signal genuine expertise
5. Cover angles other tools miss
${BLIXAMO_CTX}
Return JSON: [{"title":"...","format":"listicle|howto|comparison|story","chars":N,"desc":"155-char meta desc matching format"}]
ONLY JSON. No markdown. No explanation.`
  },
  {
    id:'jasper', name:'Jasper', icon:'💎', weight:0.10,
    specialty:'Brand voice — blixamo tone + India+global appeal',
    system:`You are Jasper AI tuned to blixamo.com brand voice. Ensure:
1. Ankit's first-person voice: "I", "My", "How I" — real experience
2. Resonates with both Indian indie devs AND global audience
3. Anti-hype: honest, direct, no exaggerated claims
4. Tech credibility: specific tools in stack (Next.js, n8n, Hetzner, PM2)
5. Consistent tone with existing blixamo articles
${BLIXAMO_CTX}
Return JSON: [{"title":"...","voice_match":1-10,"india_global_balance":1-10,"chars":N,"desc":"155-char authentic meta desc"}]
ONLY JSON. No markdown. No explanation.`
  }
]

// ================================================================
// BAYESIAN SCORER (9 signals, 100pt scale)
// ================================================================
function bayesianScore(title, gscStats=null) {
  if (!title) return { score:0, signals:{} }
  const t   = title.toLowerCase()
  const len = title.length

  const signals = {
    lengthOk:     len <= 60 ? 20 : Math.max(0, 20 - (len-60)*3),
    kwFirst40:    /^.{0,39}(hetzner|vps|docker|n8n|nextjs|self.host|deploy|claude|coolify|postgres|tailwind|razorpay|security|ubuntu|n8n|whatsapp|telegram|oracle|payoneer|wise)/.test(t) ? 15 : 5,
    hasNumber:    /\d+/.test(title) ? 12 : 0,
    hasPowerWord: /\b(real|tested|honest|free|actual|fast|cheap|dead.simple|production|live|working)\b/i.test(title) ? 10 : 0,
    hasPersonal:  /\bhow i\b|\bmy \b|\bi run\b|\bi use\b|\bi built\b|\bi switched\b|\bi tested\b/i.test(title) ? 12 : 0,
    hasVS:        /\bvs\b|\bversus\b/.test(t) ? 8 : 0,
    hasYear:      /2026|2027/.test(title) ? 5 : 0,
    hasHetzner:   /hetzner|€5|rs 465|cpx22/.test(t) ? 10 : 0,
    noFiller:     /\b(complete|ultimate|comprehensive|step.by.step|in.depth|discover|unlock|boost|leverage|utilize)\b/i.test(title) ? -15 : 8,
  }

  // GSC signal: boost based on actual impression volume (more impressions = more at stake)
  let gscBoost = 0
  if (gscStats) {
    if (gscStats.impressions > 200) gscBoost = 15 // priority: high impression, low CTR article
    else if (gscStats.impressions > 100) gscBoost = 8
    else if (gscStats.impressions > 50) gscBoost = 4
    if (gscStats.ctr < 0.5 && gscStats.impressions > 50) gscBoost += 10 // CTR emergency
  }
  signals.gscBoost = gscBoost

  const total = Object.values(signals).reduce((a,b) => a+b, 0)
  return { score: Math.max(0, Math.min(100, total)), signals }
}

// ================================================================
// CALL ONE MODEL AGENT
// ================================================================
async function callModel(model, topic, gscContext='') {
  const userMsg = `Generate 3 optimized blog post titles for blixamo.com.
Topic/keyword: "${topic}"
${gscContext ? 'GSC context: '+gscContext : ''}
Apply your specialized optimization. Return ONLY the JSON array.`

  try {
    const res = await ai.messages.create({
      model: 'claude-haiku-4-5', max_tokens: 800,
      system: model.system,
      messages: [{ role:'user', content:userMsg }]
    })
    const raw   = res.content[0].text.trim()
    const clean = raw.replace(/^```json\s*/,'').replace(/\s*```$/,'').replace(/^```\s*/,'').trim()
    const parsed = JSON.parse(clean)
    return parsed.map(item => ({
      title:    (item.title||'').trim(),
      desc:     (item.desc||'').trim(),
      model:    model.id,
      modelName:model.name,
      modelIcon:model.icon,
      meta:     item,
    })).filter(t => t.title.length >= 15)
  } catch(e) {
    console.log(clr('red', `  ⚠ ${model.name}: ${e.message.slice(0,70)}`))
    return []
  }
}

// ================================================================
// PARALLEL MODEL RUNNER
// ================================================================
async function runAllModels(topic, gscStats=null) {
  const gscCtx = gscStats
    ? `This article has ${gscStats.impressions} impressions, ${gscStats.ctr}% CTR at position ${gscStats.position}. ` +
      `Top queries: ${(gscStats.topQueries||[]).map(q=>q.query).join(', ')}. ` +
      `CTR is ${gscStats.ctr < 1 ? 'CRITICALLY LOW' : 'low'} — title must be much more compelling.`
    : ''

  process.stdout.write(clr('cyan','  Running 6 models in parallel '))

  const results = await Promise.allSettled(
    MODELS.map(m => callModel(m, topic, gscCtx))
  )
  process.stdout.write('\n')

  const allTitles = []
  results.forEach((r,i) => {
    const model = MODELS[i]
    if (r.status==='fulfilled' && r.value.length) {
      r.value.forEach(item => {
        const { score, signals } = bayesianScore(item.title, gscStats)
        allTitles.push({ ...item, bayesianScore:score, signals, chars:item.title.length, lenOk:item.title.length<=60 })
      })
      process.stdout.write(clr('green', `  ✅ ${model.icon} ${model.name} (${r.value.length})\n`))
    } else {
      process.stdout.write(clr('red', `  ❌ ${model.icon} ${model.name}\n`))
    }
  })
  return allTitles
}

// ================================================================
// ENSEMBLE RANK — consensus boost + Thompson integration
// ================================================================
function ensembleRank(allTitles, state, slug) {
  const groups = {}
  allTitles.forEach(t => {
    const key = t.title.slice(0,28).toLowerCase().replace(/[^a-z0-9]/g,'')
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })

  const ranked = Object.values(groups).map(group => {
    const best   = group.sort((a,b) => b.bayesianScore-a.bayesianScore)[0]
    const models = [...new Set(group.map(g => `${g.modelIcon}${g.modelName}`))]
    const consensusBoost = (models.length-1) * 5

    // Thompson Sampling boost — if this variant has been tested, weight by CTR posterior
    let thompsonBoost = 0
    if (slug && state.titleTests[slug]) {
      const tKey = best.title.slice(0,40)
      const t = state.titleTests[slug][tKey]
      if (t) {
        const expectedCTR = (t.alpha-1) / (t.alpha+t.beta-2)
        thompsonBoost = Math.round(expectedCTR * 20) // up to +20 for proven high-CTR
      }
    }

    return {
      ...best,
      finalScore: Math.min(100, best.bayesianScore + consensusBoost + thompsonBoost),
      agreedModels: models, consensusBoost, thompsonBoost,
    }
  })

  return ranked.sort((a,b) => b.finalScore-a.finalScore)
}

// ================================================================
// APPLY PIPELINE — update MDX + regen OG + deploy
// ================================================================
async function applyTitle(slug, newTitle, newDesc=null) {
  const { execSync } = require('child_process')
  const fpath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fpath)) { console.error(clr('red',`  Article not found: ${slug}`)); return false }

  const raw = fs.readFileSync(fpath,'utf8')
  let updated = raw.replace(/^title: ".*?"/m, `title: "${newTitle}"`)
                   .replace(/^title: '.*?'/m, `title: "${newTitle}"`)
  if (newDesc) {
    updated = updated.replace(/^description: ".*?"/m, `description: "${newDesc.slice(0,160)}"`)
                     .replace(/^description: '.*?'/m, `description: "${newDesc.slice(0,160)}"`)
  }

  // Backup
  fs.writeFileSync(fpath+'.title_bak', raw)
  fs.writeFileSync(fpath, updated)
  console.log(clr('green',`  ✅ MDX updated: ${slug}`))

  // Track in Thompson state
  const state = loadState()
  updateThompson(state, slug, newTitle, 0, 0) // will get clicks/impressions from next GSC pull
  state.history.push({ ts: ts(), slug, oldTitle: raw.match(/^title: "?(.+?)"?$/m)?.[1], newTitle, newDesc })
  saveState(state)

  // Regen OG image
  try {
    execSync(`node /var/www/blixamo/tools/generate-og-images.js --force --slug ${slug}`, { stdio:'pipe' })
    console.log(clr('green',`  ✅ OG image regenerated`))
  } catch(e) { console.log(clr('yellow',`  ⚠ OG regen: ${e.message.slice(0,50)}`)) }

  return true
}

async function applyAndDeploy(slug, newTitle, newDesc=null) {
  const { execSync } = require('child_process')
  const applied = await applyTitle(slug, newTitle, newDesc)
  if (!applied) return

  console.log(clr('cyan','\n  Building + deploying...'))
  try {
    execSync('cd /var/www/blixamo && npm run build', { stdio:'pipe' })
    execSync('pm2 restart blixamo', { stdio:'pipe' })
    console.log(clr('green','  ✅ Deployed successfully'))
  } catch(e) {
    console.log(clr('red',`  ❌ Deploy failed: ${e.message.slice(0,80)}`))
  }
}

// ================================================================
// N8N WEBHOOK NOTIFICATION
// ================================================================
function notifyN8N(payload) {
  try {
    const data = JSON.stringify(payload)
    const url = new URL(N8N_WEBHOOK)
    const req = https.request({ hostname:url.hostname, port:url.port||80,
      path:url.pathname, method:'POST',
      headers:{'Content-Type':'application/json','Content-Length':data.length}
    })
    req.write(data); req.end()
  } catch {}
}

// ================================================================
// PRINT RESULTS
// ================================================================
function printResults(ranked, topic, gscStats=null) {
  console.log(`\n${clr('cyan','═'.repeat(68))}`)
  console.log(clr('bold',`  ENSEMBLE RESULTS: "${topic}"`))
  if (gscStats) {
    const urgency = gscStats.ctr < 0.5 && gscStats.impressions > 50
      ? clr('red','🚨 CTR EMERGENCY') : clr('yellow','⚠ CTR opportunity')
    console.log(`  GSC: ${gscStats.impressions} impr · ${gscStats.ctr}% CTR · pos ${gscStats.position}  ${urgency}`)
  }
  console.log(clr('cyan','═'.repeat(68)))

  ranked.slice(0,6).forEach((t,i) => {
    const sc  = t.finalScore
    const col = sc>=75?'green':sc>=50?'yellow':'red'
    const star = i===0 ? clr('yellow','★ WINNER') : `  #${i+1}  `
    const lenMark = t.lenOk ? clr('green',`✓ ${t.chars}ch`) : clr('red',`✗ ${t.chars}ch`)

    console.log(`\n  ${star}  ${clr(col, String(sc).padStart(3))}/100  ${lenMark}  [${t.modelIcon} ${t.modelName}]`)
    console.log(`  ${clr('bold', t.title)}`)
    if (t.desc) console.log(`  ${clr('gray','Desc: '+t.desc.slice(0,80)+'...')}`)
    if (t.agreedModels.length>1) console.log(`  ${clr('magenta','Consensus:')} ${t.agreedModels.join(' + ')} (+${t.consensusBoost})`)
    if (t.thompsonBoost>0) console.log(`  ${clr('blue','Thompson:')} proven CTR boost (+${t.thompsonBoost})`)
  })

  const w = ranked[0]
  console.log(`\n${clr('cyan','─'.repeat(68))}`)
  console.log(clr('bold','  🏆 WINNER:'))
  console.log(`  Title: "${clr('green', w.title)}"`)
  if (w.desc) console.log(`  Desc:  "${clr('green', w.desc.slice(0,100))}"`)
  console.log(`  Score: ${w.finalScore}/100  ${w.chars}ch  by ${w.modelName}`)
  console.log(clr('cyan','─'.repeat(68)))
  return w
}

// ================================================================
// CTR OPPORTUNITY REPORT
// ================================================================
async function ctrOpportunities() {
  console.log(clr('bold','\n  Fetching GSC data...'))
  const gsc = await fetchGSCData(90)
  if (!gsc) { console.error(clr('red','  GSC unavailable')); return }

  const articles = fs.readdirSync(POSTS_DIR).filter(f=>f.endsWith('.mdx'))
    .map(f => { const raw=fs.readFileSync(path.join(POSTS_DIR,f),'utf8'); const {data}=matter(raw); return data })

  console.log(`\n${clr('cyan','═'.repeat(68))}`)
  console.log(clr('bold','  CTR OPPORTUNITIES — HIGH IMPRESSIONS · LOW CLICK-THROUGH'))
  console.log(clr('cyan','═'.repeat(68)))

  // Sort by opportunity score: impressions * (1 - CTR/100) * position_factor
  const opps = gsc.pages
    .filter(p => p.slug.startsWith('blog/') || p.impressions > 10)
    .map(p => {
      const slug = p.slug.replace('blog/','')
      const art  = articles.find(a => a.slug===slug || a.keyword?.includes(slug.split('-')[0]))
      const oppScore = Math.round(p.impressions * (1 - p.ctr/100) * (p.position<=10?1.5:1))
      return { ...p, slug, title: art?.title||slug, oppScore }
    })
    .sort((a,b) => b.oppScore-a.oppScore)

  opps.slice(0,10).forEach((o,i) => {
    const urgency = o.ctr < 0.5 && o.impressions > 50
      ? clr('red','🚨 CRITICAL') : o.impressions > 100
      ? clr('yellow','⚠  HIGH')   : clr('gray','   low')
    const potential = Math.round(o.impressions * 0.03) // 3% CTR = realistic target
    console.log(`\n  ${String(i+1).padStart(2)}. ${urgency}  opp:${o.oppScore}`)
    console.log(`     ${o.slug}`)
    console.log(`     ${clr('gray',o.title)}`)
    console.log(`     ${o.impressions} impr · ${o.ctr}% CTR · pos ${o.position}`)
    console.log(`     ${clr('green','Target:')} 3% CTR = ${clr('green',String(potential)+' clicks/period')} (currently ${o.clicks})`)
  })

  console.log(`\n  Run: node blixamo-title-engine.js --slug <slug> --apply  to fix`)
  return opps
}

// ================================================================
// THOMPSON SAMPLING REPORT
// ================================================================
function thompsonReport() {
  const state = loadState()
  if (!Object.keys(state.titleTests).length) {
    console.log(clr('gray','\n  No A/B test data yet. Apply title changes to start tracking.\n'))
    return
  }
  console.log(`\n${clr('cyan','═'.repeat(68))}`)
  console.log(clr('bold','  THOMPSON SAMPLING — Title A/B Test Results'))
  console.log(clr('cyan','═'.repeat(68)))

  for (const [slug, variants] of Object.entries(state.titleTests)) {
    console.log(`\n  ${slug}`)
    const entries = Object.values(variants).sort((a,b) => {
      return thompsonSample(b.alpha,b.beta) - thompsonSample(a.alpha,a.beta)
    })
    entries.forEach((v,i) => {
      const expectedCTR = ((v.alpha-1)/(v.alpha+v.beta-2)*100).toFixed(1)
      const n = v.alpha + v.beta - 2
      const star = i===0 ? clr('yellow','★') : ' '
      console.log(`  ${star} ${v.title.slice(0,55)}`)
      console.log(`    ${clr('gray',`E[CTR]: ${expectedCTR}% | n=${n} | α=${v.alpha} β=${v.beta}`)}`)
    })
  }
}

// ================================================================
// FULL AUDIT — GSC-weighted, all 24 articles
// ================================================================
async function fullAudit() {
  console.log(clr('bold','\n  Fetching GSC data...'))
  const gsc = await fetchGSCData(90)
  const state = loadState()
  const files = fs.readdirSync(POSTS_DIR).filter(f=>f.endsWith('.mdx'))
  const report = []

  // Sort by GSC opportunity first (fixes that matter most)
  const sorted = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR,file),'utf8')
    const {data:fm} = matter(raw)
    const slug = fm.slug || file.replace('.mdx','')
    const gscStats = gsc ? getSlugStats(gsc, slug) : null
    const oppScore = gscStats ? Math.round(gscStats.impressions*(1-gscStats.ctr/100)) : 0
    return { file, fm, slug, gscStats, oppScore }
  }).sort((a,b) => b.oppScore-a.oppScore)

  console.log(clr('bold',`\n  Auditing ${files.length} articles (GSC-prioritized)...\n`))

  for (const { file, fm, slug, gscStats } of sorted) {
    const topic = fm.keyword || fm.title || slug
    console.log(clr('cyan', `  ── ${slug}`))
    if (gscStats) {
      console.log(clr('gray', `     GSC: ${gscStats.impressions} impr · ${gscStats.ctr}% CTR · pos ${gscStats.position}`))
    }

    const allTitles = await runAllModels(topic, gscStats)
    const ranked    = ensembleRank(allTitles, state, slug)
    const winner    = ranked[0]
    const currentScore = bayesianScore(fm.title||'', gscStats).score
    const gain = winner.finalScore - currentScore

    console.log(`  Current (${currentScore}): ${fm.title}`)
    console.log(`  Best    (${clr(gain>0?'green':'gray', String(winner.finalScore))}): ${clr('green', winner.title)}`)

    report.push({
      slug, category:fm.category||'unknown',
      currentTitle:fm.title, currentScore,
      bestTitle:winner.title, bestDesc:winner.desc,
      bestScore:winner.finalScore, gain,
      gsc:gscStats,
      top5:ranked.slice(0,5).map(r=>({title:r.title,desc:r.desc,score:r.finalScore,model:r.modelName}))
    })
    await new Promise(r=>setTimeout(r,600)) // rate limiting
  }

  // Summary
  report.sort((a,b)=>b.gain-a.gain)
  console.log(`\n${clr('cyan','═'.repeat(68))}`)
  console.log(clr('bold','  TOP IMPROVEMENTS'))
  report.slice(0,8).forEach((r,i) => {
    const g = r.gain
    console.log(`\n  ${i+1}. ${clr(g>20?'green':g>0?'yellow':'gray','gain:'+g)} ${clr('gray',r.slug)}`)
    console.log(`     OLD: ${r.currentTitle}`)
    console.log(`     NEW: ${clr('green',r.bestTitle)}`)
    if (r.gsc?.impressions>50) console.log(`     ${clr('yellow',`⚠ ${r.gsc.impressions} impr @ ${r.gsc.ctr}% CTR — PRIORITY`)}`)
  })

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report,null,2))
  console.log(clr('gray',`\n  Full report → ${REPORT_FILE}\n`))

  notifyN8N({ event:'title_audit_complete', ts:ts(), articles:report.length,
    topWin:report[0]?.slug, topGain:report[0]?.gain })
  return report
}

// ================================================================
// MAIN
// ================================================================
async function main() {
  const argv    = process.argv.slice(2)
  const get     = k => { const i=argv.indexOf(k); return i>-1?argv[i+1]:null }
  const has     = k => argv.includes(k)
  const topic   = get('--topic')
  const slug    = get('--slug')
  const doApply = has('--apply')

  console.log(`\n${clr('cyan','█'.repeat(68))}`)
  console.log(clr('bold','  BLIXAMO ULTIMATE TITLE ENGINE v2.0'))
  console.log(clr('gray', '  📊Semrush · 🏄Surfer · 🚀Writesonic · ✍️Copy.ai · 🤖ChatGPT · 💎Jasper'))
  console.log(clr('gray', '  GSC Live Data · Thompson Sampling · Full Deploy Pipeline'))
  console.log(clr('cyan','█'.repeat(68)))

  // ── REPORTS ──
  if (has('--opportunities')) { await ctrOpportunities(); return }
  if (has('--thompson'))      { thompsonReport(); return }

  // ── FULL AUDIT ──
  if (has('--audit')) { await fullAudit(); return }

  // ── SLUG MODE (existing article) ──
  if (slug) {
    const fpath = path.join(POSTS_DIR,`${slug}.mdx`)
    if (!fs.existsSync(fpath)) { console.error(clr('red',`  Not found: ${slug}`)); process.exit(1) }
    const raw = fs.readFileSync(fpath,'utf8')
    const {data:fm} = matter(raw)
    console.log(clr('gray',`\n  Article: ${fm.title}`))

    const gsc = await fetchGSCData(90)
    const gscStats = gsc ? getSlugStats(gsc,slug) : null
    if (gscStats) console.log(clr('yellow',`  GSC: ${gscStats.impressions} impr · ${gscStats.ctr}% CTR · pos ${gscStats.position}`))

    const allTitles = await runAllModels(fm.keyword||fm.title, gscStats)
    const state = loadState()
    const ranked = ensembleRank(allTitles, state, slug)
    const winner = printResults(ranked, fm.keyword||slug, gscStats)

    if (doApply) {
      console.log(clr('cyan','\n  Applying winner + deploying...'))
      await applyAndDeploy(slug, winner.title, winner.desc)
    } else {
      console.log(clr('gray','\n  Add --apply to update MDX + regen OG + deploy'))
    }
    return
  }

  // ── TOPIC MODE (new article or custom) ──
  if (topic) {
    const gsc = await fetchGSCData(90)
    const allTitles = await runAllModels(topic, null)
    const state = loadState()
    const ranked = ensembleRank(allTitles, state, null)
    printResults(ranked, topic, null)
    fs.writeFileSync(REPORT_FILE, JSON.stringify({topic,ranked:ranked.slice(0,10)},null,2))
    return
  }

  // ── HELP ──
  console.log(`
  Commands:
    --topic "keyword"          Generate titles for any topic
    --slug article-slug        Optimize existing article
    --slug X --apply           Optimize + update MDX + deploy
    --audit                    Full GSC-weighted audit all articles
    --opportunities            Show CTR gap report (high impr, 0 clicks)
    --thompson                 Show A/B test results (Thompson Sampling)
  `)
}

main().catch(e=>{console.error(clr('red',`\n  Fatal: ${e.message}\n${e.stack?.slice(0,300)}`));process.exit(1)})
