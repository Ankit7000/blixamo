#!/usr/bin/env node
// ================================================================
// BLIXAMO MULTI-MODEL TITLE ENGINE v1.0
// Simulates 6 AI model personas via Claude API, each optimizing
// for a different signal. Bayesian scorer picks the winner.
//
// Usage:
//   node tools/blixamo-title-engine.js --topic "docker on hetzner"
//   node tools/blixamo-title-engine.js --topic "n8n vs zapier" --category tools
//   node tools/blixamo-title-engine.js --audit-all
//   node tools/blixamo-title-engine.js --slug nextjs-mdx-blog-2026
// ================================================================
'use strict'

const fs     = require('fs')
const path   = require('path')
const matter = require('/var/www/blixamo/node_modules/gray-matter')

// ── Load env ──────────────────────────────────────────────────
const envVars = {}
try {
  fs.readFileSync('/var/www/blixamo/.env.local','utf8')
    .split('\n').forEach(l => {
      const e = l.indexOf('=')
      if (e > 0) envVars[l.slice(0,e).trim()] = l.slice(e+1).trim()
    })
} catch {}

const ANTHROPIC_API_KEY = envVars['ANTHROPIC_API_KEY'] || process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('\n❌ ANTHROPIC_API_KEY not set in /var/www/blixamo/.env.local')
  console.error('   Add it: echo "ANTHROPIC_API_KEY=sk-ant-..." >> /var/www/blixamo/.env.local\n')
  process.exit(1)
}

const Anthropic = require('/var/www/blixamo/node_modules/@anthropic-ai/sdk')
const ai = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

const POSTS_DIR  = '/var/www/blixamo/content/posts'
const REPORT_OUT = '/var/log/blixamo-title-report.json'

// ── Colors ────────────────────────────────────────────────────
const C = { r:'\x1b[0m', bold:'\x1b[1m', red:'\x1b[31m', green:'\x1b[32m',
  yellow:'\x1b[33m', blue:'\x1b[34m', cyan:'\x1b[36m', gray:'\x1b[90m', magenta:'\x1b[35m' }
const clr = (c, t) => `${C[c]}${t}${C.r}`

// ── Blixamo context (injected into every agent) ───────────────
const BLIXAMO_CONTEXT = `
BLOG: blixamo.com by Ankit Sorathiya — indie developer blog
NICHE: Self-hosting, VPS (Hetzner), DevOps, AI automation, indie dev
AUDIENCE: Global indie developers, solo builders, DevOps practitioners
DA: ~8 (new blog — needs low-KD, long-tail keywords)
STACK: Next.js, Docker, n8n, Hetzner CPX22, PM2, Nginx, Claude API
REAL NUMBERS TO USE: €5.19/month VPS · 306ms load · 5 apps on 1 VPS · Rs 465/month
HETZNER AFFILIATE: €20 per referral — prioritize Hetzner mentions
VOICE: First-person "I", direct, technical, no fluff
BANNED WORDS: Complete, Ultimate, Comprehensive, Step-by-Step, In-Depth, Discover, Unlock, Boost
TITLE RULES: Max 60 chars · Primary keyword first 40 chars · No truncation
`

// ================================================================
// SIX MODEL PERSONAS
// Each has a unique optimization target and scoring weight
// ================================================================
const MODELS = [
  {
    id: 'semrush',
    name: 'Semrush',
    icon: '📊',
    specialty: 'SEO data-driven — keyword density & search intent',
    weight: 0.22,
    systemPrompt: `You are Semrush's AI title optimizer. You ONLY care about:
1. Exact keyword placement in first 40 characters (primary KD signal)
2. Search intent match — informational/commercial/navigational
3. Title length strictly under 60 characters
4. Long-tail specificity (3-5 word keyword phrases rank easier for DA<10)
5. Year (2026) inclusion for freshness
You DO NOT care about creativity or brand voice. Pure SEO data.
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","intent":"informational|commercial","keyword":"exact kw used","chars":N}]
No preamble. No explanation. Raw JSON only.`,
  },
  {
    id: 'surfer',
    name: 'Surfer SEO',
    icon: '🏄',
    specialty: 'SERP competitor analysis — match top-ranking patterns',
    weight: 0.20,
    systemPrompt: `You are Surfer SEO's title analyzer. You study the top 10 SERP results and:
1. Match the structural pattern of titles that rank #1-3
2. Include the exact phrasing competitors use (but make it better)
3. Add differentiator that existing results lack (personal experience, real numbers, 2026)
4. Prioritize "How I" and "X vs Y" formats — they dominate SERPs for indie dev content
5. Optimize for featured snippet eligibility (question + direct answer in title)
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","pattern":"howto|vs|listicle|question","differentiator":"what makes it better than competitors"}]
No preamble. No explanation. Raw JSON only.`,
  },
  {
    id: 'copyai',
    name: 'Copy.ai',
    icon: '✍️',
    specialty: 'Short-form virality — social sharing & click magnetism',
    weight: 0.15,
    systemPrompt: `You are Copy.ai's viral headline generator. You optimize for:
1. Emotional resonance — curiosity gap, fear of missing out, achievement
2. Social sharing potential — would someone retweet/share this?
3. Ultra-short punch — under 50 chars if possible
4. Power words: Real, Tested, Free, Actual, Proven, Fast, Simple
5. Developer community hooks — "I switched", "Nobody tells you", "The truth about"
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","hook":"curiosity|fomo|achievement|pain","shareability":1-10}]
No preamble. No explanation. Raw JSON only.`,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    specialty: 'Creative versatility — maximum variation across formats',
    weight: 0.15,
    systemPrompt: `You are ChatGPT generating diverse, creative title variations. You produce:
1. Maximum diversity — each title uses a completely different structural format
2. One listicle, one how-to, one comparison, one story-driven
3. Natural, conversational language (not robotic SEO-speak)
4. Specific numbers and real data make titles credible
5. Developer-specific terminology that signals expertise
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","format":"listicle|howto|comparison|story","creativity_score":1-10}]
No preamble. No explanation. Raw JSON only.`,
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    icon: '🚀',
    specialty: 'Viral + SEO balance — storytelling meets searchability',
    weight: 0.18,
    systemPrompt: `You are Writesonic's AI Article Writer 6.0. You combine:
1. Real-time search data signals — what's trending in 2026 dev blogs
2. Narrative tension — titles that hint at a story or conflict
3. Specific outcome promise — reader knows exactly what they'll gain
4. SEO keyword naturally embedded (not stuffed)
5. Pattern interrupts — unexpected angles on common topics
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","narrative":"tension|outcome|conflict|surprise","seo_score":1-10}]
No preamble. No explanation. Raw JSON only.`,
  },
  {
    id: 'jasper',
    name: 'Jasper AI',
    icon: '💎',
    specialty: 'Brand voice consistency — blixamo tone & personality',
    weight: 0.10,
    systemPrompt: `You are Jasper AI tuned to blixamo.com's brand voice. You ensure:
1. First-person authentic voice — Ankit's real experience ("I", "My", "How I")
2. India + global dev community appeal simultaneously  
3. Anti-hype — no buzzwords, just honest direct titles
4. Technical credibility — includes specific tech stack terms
5. Consistent with existing blixamo articles (real numbers, honest verdicts)
${BLIXAMO_CONTEXT}
Output EXACTLY 3 title variants as JSON array: [{"title":"...","voice_score":1-10,"india_appeal":true|false}]
No preamble. No explanation. Raw JSON only.`,
  },
]

// ================================================================
// BAYESIAN SCORER
// Scores each generated title across 9 signals
// ================================================================
function bayesianScore(title, category='tutorials') {
  const t   = title.toLowerCase()
  const len = title.length

  // Signal weights calibrated from 2026 CTR data
  const signals = {
    lengthOk:     len <= 60 ? 20 : Math.max(0, 20 - (len-60)*2),
    kwFirst40:    /^.{0,40}(hetzner|vps|docker|n8n|nextjs|self.host|deploy|claude|coolify|postgres|tailwind|razorpay|payment|security|ubuntu)/.test(t) ? 15 : 5,
    hasNumber:    /\d+/.test(title) ? 12 : 0,
    hasPowerWord: /\b(real|tested|honest|free|actual|fast|simple|cheap|production|live)\b/i.test(title) ? 10 : 0,
    hasPersonal:  /\bhow i\b|\bmy \b|\bi run\b|\bi use\b|\bi built\b|\bi switched\b/i.test(title) ? 12 : 0,
    hasVS:        /\bvs\b|\bversus\b/.test(t) ? 8 : 0,
    hasYear:      /2026|2027/.test(title) ? 5 : 0,
    hasHetzner:   /hetzner|€5|rs 465|cpx22/.test(t) ? 10 : 0,
    noFiller:     /\b(complete|ultimate|comprehensive|step.by.step|in.depth|discover|unlock|boost)\b/i.test(title) ? -15 : 8,
  }

  const total = Object.values(signals).reduce((a,b) => a+b, 0)
  return { score: Math.max(0, Math.min(100, total)), signals }
}

// ================================================================
// CALL ONE MODEL AGENT
// ================================================================
async function callModel(model, topic, category) {
  const userMsg = `Generate 3 optimized blog post titles for blixamo.com.
Topic: "${topic}"
Category: ${category}
Apply your specialized optimization approach.
Return ONLY the JSON array, no other text.`

  try {
    const res = await ai.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      system: model.systemPrompt,
      messages: [{ role: 'user', content: userMsg }]
    })

    const raw = res.content[0].text.trim()
    // Strip code fences if present
    const clean = raw.replace(/^```json\s*/,'').replace(/\s*```$/,'').replace(/^```\s*/,'').trim()
    const parsed = JSON.parse(clean)

    return parsed.map(item => ({
      title: (item.title || '').trim(),
      model: model.id,
      modelName: model.name,
      modelIcon: model.icon,
      meta: item,
    }))
  } catch(e) {
    console.error(clr('red', `  ⚠ ${model.name}: ${e.message.slice(0,60)}`))
    return []
  }
}

// ================================================================
// RUN ALL 6 MODELS IN PARALLEL
// ================================================================
async function runAllModels(topic, category='tutorials') {
  console.log(clr('cyan', '\n  Running 6 model agents in parallel...'))

  const results = await Promise.allSettled(
    MODELS.map(m => callModel(m, topic, category))
  )

  // Flatten all titles
  const allTitles = []
  results.forEach((r, i) => {
    const model = MODELS[i]
    if (r.status === 'fulfilled') {
      r.value.forEach(item => {
        if (!item.title || item.title.length < 10) return
        const { score, signals } = bayesianScore(item.title, category)
        const modelWeight = model.weight
        const weightedScore = Math.round(score * modelWeight * 10) / 10
        allTitles.push({
          ...item,
          bayesianScore: score,
          modelWeight,
          weightedScore,
          signals,
          chars: item.title.length,
          lenOk: item.title.length <= 60,
        })
      })
      console.log(clr('green', `  ✅ ${model.icon} ${model.name} — ${r.value.length} titles`))
    } else {
      console.log(clr('red', `  ❌ ${model.icon} ${model.name} — failed`))
    }
  })

  return allTitles
}

// ================================================================
// ENSEMBLE DEDUPLICATION + RANKING
// If similar titles appear from multiple models → boost score
// ================================================================
function ensembleRank(allTitles) {
  // Group near-duplicates (same first 30 chars)
  const groups = {}
  allTitles.forEach(t => {
    const key = t.title.slice(0,30).toLowerCase().replace(/[^a-z0-9]/g,'')
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })

  const ranked = Object.values(groups).map(group => {
    // Highest scorer in group, boosted by consensus
    const best   = group.sort((a,b) => b.bayesianScore - a.bayesianScore)[0]
    const models = [...new Set(group.map(g => g.modelIcon + g.modelName))]
    const consensusBoost = (models.length - 1) * 5 // +5 per additional model agreement
    return {
      ...best,
      finalScore: Math.min(100, best.bayesianScore + consensusBoost),
      agreedModels: models,
      consensusBoost,
    }
  })

  return ranked.sort((a,b) => b.finalScore - a.finalScore)
}

// ================================================================
// PRINT RESULTS
// ================================================================
function printResults(ranked, topic) {
  console.log(`\n${clr('cyan','═'.repeat(66))}`)
  console.log(clr('bold', `  ENSEMBLE TITLE RANKINGS for: "${topic}"`))
  console.log(clr('cyan','═'.repeat(66)))

  ranked.slice(0, 8).forEach((t, i) => {
    const sc   = t.finalScore
    const col  = sc >= 75 ? 'green' : sc >= 50 ? 'yellow' : 'red'
    const star = i === 0 ? clr('yellow','★ WINNER') : `#${i+1}`
    const lenMark = t.lenOk ? clr('green','✓') : clr('red',`✗ ${t.chars}ch`)

    console.log(`\n  ${clr('bold',star)}  Score: ${clr(col, String(sc))}  ${lenMark}  [${t.modelIcon} ${t.modelName}]`)
    console.log(`  ${clr('bold', t.title)}`)

    if (t.agreedModels.length > 1) {
      console.log(`  ${clr('magenta','Consensus:')} ${t.agreedModels.join(' + ')}  ${clr('magenta','(+'+t.consensusBoost+' boost)')}`)
    }

    // Signal breakdown for top 3
    if (i < 3) {
      const sigs = Object.entries(t.signals)
        .filter(([,v]) => v > 0)
        .map(([k,v]) => `${k}:+${v}`)
        .join(' · ')
      console.log(`  ${clr('gray', sigs)}`)
    }
  })

  // Winner summary
  const winner = ranked[0]
  console.log(`\n${clr('cyan','─'.repeat(66))}`)
  console.log(clr('bold', '  🏆 RECOMMENDED TITLE:'))
  console.log(`  "${clr('green', winner.title)}"`)
  console.log(`  Score: ${winner.finalScore}/100  |  ${winner.chars} chars  |  By: ${winner.modelName}`)
  console.log(clr('cyan','─'.repeat(66)))

  return winner
}

// ================================================================
// AUDIT ALL ARTICLES
// ================================================================
async function auditAll() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
  const report = []

  console.log(clr('bold', `\n  Auditing ${files.length} articles...\n`))

  for (const file of files) {
    const raw   = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const { data: fm } = matter(raw)
    const slug  = fm.slug || file.replace('.mdx','')
    const topic = fm.keyword || fm.title || slug
    const cat   = fm.category || 'tutorials'

    console.log(clr('cyan', `\n  ── ${slug} ──`))
    console.log(clr('gray', `  Current: ${fm.title}`))

    const allTitles = await runAllModels(topic, cat)
    const ranked    = ensembleRank(allTitles)
    const winner    = ranked[0]

    const currentScore = bayesianScore(fm.title || '', cat).score
    const gain = winner.finalScore - currentScore

    console.log(`  Current score: ${currentScore}  →  Best: ${clr(gain>0?'green':'gray', String(winner.finalScore))}  (${gain>0?'+':''}${gain})`)
    console.log(`  Best title: "${clr('green', winner.title)}"`)

    report.push({
      slug, category: cat,
      currentTitle: fm.title,
      currentScore,
      bestTitle: winner.title,
      bestScore: winner.finalScore,
      gain,
      allOptions: ranked.slice(0,5).map(r => ({ title: r.title, score: r.finalScore, model: r.modelName })),
    })

    // Rate limiting
    await new Promise(r => setTimeout(r, 800))
  }

  // Sort by gain
  report.sort((a,b) => b.gain - a.gain)

  console.log(`\n${clr('cyan','═'.repeat(66))}`)
  console.log(clr('bold','  AUDIT COMPLETE — TOP 10 IMPROVEMENTS'))
  console.log(clr('cyan','═'.repeat(66)))
  report.slice(0,10).forEach((r,i) => {
    const col = r.gain > 20 ? 'green' : r.gain > 0 ? 'yellow' : 'gray'
    console.log(`\n  ${i+1}. ${clr(col,'gain:+'+r.gain)}  ${r.slug}`)
    console.log(`     OLD: ${r.currentTitle}`)
    console.log(`     NEW: ${clr('green', r.bestTitle)}`)
  })

  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2))
  console.log(clr('gray', `\n  Report → ${REPORT_OUT}`))

  return report
}

// ================================================================
// MAIN
// ================================================================
async function main() {
  const args     = process.argv.slice(2)
  const topicIdx = args.indexOf('--topic')
  const slugIdx  = args.indexOf('--slug')
  const catIdx   = args.indexOf('--category')

  const topic    = topicIdx > -1 ? args[topicIdx + 1] : null
  const slug     = slugIdx  > -1 ? args[slugIdx  + 1] : null
  const category = catIdx   > -1 ? args[catIdx   + 1] : 'tutorials'
  const doAudit  = args.includes('--audit-all')

  console.log(`\n${clr('cyan','█'.repeat(66))}`)
  console.log(clr('bold', '  BLIXAMO MULTI-MODEL TITLE ENGINE v1.0'))
  console.log(clr('gray',  '  Semrush · Surfer · Copy.ai · ChatGPT · Writesonic · Jasper'))
  console.log(clr('cyan','█'.repeat(66)))

  // ── Audit all articles
  if (doAudit) {
    await auditAll()
    return
  }

  // ── Single slug from existing articles
  if (slug) {
    const file = path.join(POSTS_DIR, `${slug}.mdx`)
    if (!fs.existsSync(file)) {
      console.error(clr('red', `  Article not found: ${slug}`))
      process.exit(1)
    }
    const raw  = fs.readFileSync(file, 'utf8')
    const { data: fm } = matter(raw)
    console.log(clr('gray', `\n  Current title: ${fm.title}`))
    const allTitles = await runAllModels(fm.keyword || fm.title, fm.category || 'tutorials')
    const ranked    = ensembleRank(allTitles)
    printResults(ranked, fm.keyword || slug)
    return
  }

  // ── Custom topic
  if (topic) {
    const allTitles = await runAllModels(topic, category)
    if (!allTitles.length) {
      console.error(clr('red', '  No titles generated. Check ANTHROPIC_API_KEY.'))
      process.exit(1)
    }
    const ranked = ensembleRank(allTitles)
    const winner = printResults(ranked, topic)

    // Save mini report
    const out = { topic, category, winner, allOptions: ranked.slice(0,10) }
    fs.writeFileSync(REPORT_OUT, JSON.stringify(out, null, 2))
    console.log(clr('gray', `\n  Report → ${REPORT_OUT}\n`))
    return
  }

  // ── No args
  console.log(`
  Usage:
    node tools/blixamo-title-engine.js --topic "docker on hetzner"
    node tools/blixamo-title-engine.js --topic "n8n vs zapier" --category tools
    node tools/blixamo-title-engine.js --slug nextjs-mdx-blog-2026
    node tools/blixamo-title-engine.js --audit-all
  `)
}

main().catch(e => {
  console.error(clr('red', `\n  Fatal: ${e.message}`))
  process.exit(1)
})
