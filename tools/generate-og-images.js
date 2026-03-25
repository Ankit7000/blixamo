#!/usr/bin/env node
// Blixamo OG Image Generator — v1.0
// Usage: node tools/generate-og-images.js [--force] [--slug <slug>]

const { createCanvas, registerFont } = require('/var/www/blixamo/node_modules/canvas')
const matter = require('/var/www/blixamo/node_modules/gray-matter')
const fs   = require('fs')
const path = require('path')

const POSTS_DIR = '/var/www/blixamo/content/posts'
const OUT_BASE  = '/var/www/blixamo/public/images/posts'

const args      = process.argv.slice(2)
const FORCE     = args.includes('--force')
const SLUG_ONLY = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null

// ── Category colours ─────────────────────────────────────────────────────────
const CAT_COLORS = {
  tutorials:   '#0891b2',
  tech:        '#059669',
  ai:          '#7c3aed',
  'indie-dev': '#e11d48',
  tools:       '#d97706',
  default:     '#7c3aed',
}

function catColor(category) {
  return CAT_COLORS[(category || '').toLowerCase()] || CAT_COLORS.default
}

// ── Difficulty colours ────────────────────────────────────────────────────────
function diffColor(difficulty) {
  const d = (difficulty || '').toLowerCase()
  if (d === 'beginner')     return '#4ade80'
  if (d === 'intermediate') return '#fbbf24'
  if (d === 'advanced')     return '#f87171'
  return '#a1a1aa'
}

// ── Extract key stat from title / description ─────────────────────────────────
function extractKeyStat(fm) {
  // Per-slug overrides — curated for maximum visual impact
  const OVERRIDES = {
    'razorpay-integration-nextjs-india':    { val: '4h',    label: 'to integrate' },
    'claude-api-vs-openai-cost-india':      { val: '3x',    label: 'cheaper' },
    'best-postgresql-gui-free':             { val: 'Free',  label: '7 tools tested' },
    'tailwind-css-vs-css-modules':          { val: '11KB',  label: 'CSS bundle' },
    'open-source-tools-2026':               { val: '₹0',    label: 'replaces ₹28K/mo' },
    'claude-ai-guide':                      { val: '60%',   label: 'cheaper than GPT-4' },
    'n8n-vs-make-vs-zapier-indie-dev':      { val: '₹0',    label: 'vs ₹7,200/mo Zapier' },
    'self-healing-vps-monitor-nodejs':      { val: '90d',   label: 'zero downtime' },
    'multiple-projects-single-vps':         { val: '5',     label: 'projects, 1 VPS' },
    'hetzner-vs-digitalocean-vs-vultr-india': { val: '3x',  label: 'cheaper' },
    'wise-vs-payoneer-india-freelancer':    { val: '₹800',  label: 'saved per ₹50K' },
    'coolify-vs-caprover-2026':             { val: '1',     label: 'failed under load' },
    'vps-security-harden-ubuntu-2026':      { val: '15',    label: 'hardening steps' },
    'google-search-console-self-hosted-nextjs': { val: '15m', label: 'full setup' },
    'oracle-cloud-free-vs-hetzner-2026':    { val: '4',     label: 'hidden limits' },
    'whatsapp-ai-assistant-n8n-claude-api': { val: '50+',   label: 'msgs/day automated' },
    'build-telegram-bot-claude-api-python': { val: '2h',    label: 'to build & deploy' },
    'claude-api-content-automation-nodejs': { val: '3h',    label: 'saved per week' },
    'nextjs-mdx-blog-2026':                 { val: '306ms', label: 'load time' },
    'self-hosting-n8n-hetzner-vps':         { val: '30m',   label: 'full setup' },
    'indian-debit-cards-dev-tools':         { val: '2',     label: 'cards that work' },
    'pay-hetzner-from-india':               { val: 'Niyo',  label: 'card that works' },
    'free-tools-indian-indie-developer':    { val: '₹465',  label: 'total infra/month' },
  }
  if (fm.slug && OVERRIDES[fm.slug]) return OVERRIDES[fm.slug]

  // Fallback: smart extraction from title + description
  const src = `${fm.title || ''} ${fm.description || ''}`
  let m = src.match(/(\d+)\s*x\s*(cheaper|faster)/i)
  if (m) return { val: `${m[1]}x`, label: m[2] }
  m = src.match(/₹([\d,]+)/)
  if (m) return { val: `₹${m[1]}`, label: 'per month' }
  m = src.match(/Rs\s*([\d,]+)/)
  if (m) return { val: `₹${m[1]}`, label: 'per month' }
  m = src.match(/€([\d.]+)/)
  if (m) return { val: `€${m[1]}`, label: 'per month' }
  m = src.match(/(\d+)\s*%/)
  if (m) return { val: `${m[1]}%`, label: 'savings' }
  m = src.match(/(\d+)\s*hour/i)
  if (m) return { val: `${m[1]}h`, label: 'setup time' }
  m = (fm.timeToComplete || '').match(/(\d+)/)
  if (m) return { val: `${m[1]}m`, label: 'read time' }
  return { val: '—', label: 'guide' }
}

// ── Wrap text ─────────────────────────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxWidth, lineH, maxLines = 3) {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0
  const lines = []

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
      lineCount++
      if (lineCount >= maxLines) { lines[lines.length - 1] += '…'; break }
    } else {
      line = test
    }
  }
  if (lineCount < maxLines && line) lines.push(line)

  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH))
  return lines.length
}

// ── Rounded rect helper ───────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Main image generator ──────────────────────────────────────────────────────
async function generateImage(slug, fm) {
  const canvas = createCanvas(1200, 630)
  const ctx    = canvas.getContext('2d')
  const color  = catColor(fm.category)
  const title  = fm.title || slug

  // ── LAYER 0: Background ──────────────────────────────────────────────────
  ctx.fillStyle = '#09090b'
  ctx.fillRect(0, 0, 1200, 630)

  // ── LAYER 1: Grid texture ────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.015)'
  ctx.lineWidth = 0.5
  for (let y = 0; y <= 630; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke()
  }
  for (let x = 0; x <= 1200; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke()
  }

  // ── LAYER 2: Glow blobs ──────────────────────────────────────────────────
  // Top-left blue glow
  ctx.save()
  ctx.filter = 'blur(80px)'
  ctx.globalAlpha = 0.20
  ctx.fillStyle = '#2563eb'
  ctx.beginPath(); ctx.arc(-60, -60, 300, 0, Math.PI * 2); ctx.fill()
  // Bottom-right category glow
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(1260, 690, 300, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  ctx.globalAlpha = 1

  // ── LAYER 3: Left accent bar ─────────────────────────────────────────────
  const barGrad = ctx.createLinearGradient(0, 0, 0, 630)
  barGrad.addColorStop(0, color)
  barGrad.addColorStop(1, '#7c3aed')
  ctx.fillStyle = barGrad
  ctx.fillRect(0, 0, 4, 630)

  // ── LAYER 4: Right divider ───────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(1020, 40); ctx.lineTo(1020, 590); ctx.stroke()

  // ── LAYER 5: Site name + category badge ──────────────────────────────────
  ctx.font = 'bold 22px sans-serif'
  ctx.fillStyle = color
  ctx.fillText('blixamo.com', 50, 60)

  // Category badge (right panel)
  const catLabel = (fm.category || 'article').toUpperCase()
  ctx.font = 'bold 11px sans-serif'
  const badgeW = ctx.measureText(catLabel).width + 24
  const badgeX = 1030
  const badgeY = 38
  ctx.save()
  roundRect(ctx, badgeX, badgeY, badgeW, 26, 13)
  ctx.fillStyle = `${color}26`
  ctx.fill()
  ctx.strokeStyle = `${color}4d`
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = color
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText(catLabel, badgeX + 12, badgeY + 17)

  // ── LAYER 6: Article title ───────────────────────────────────────────────
  const titleLen = title.length
  const fontSize = titleLen < 40 ? 58 : titleLen < 70 ? 52 : 44
  ctx.font = `900 ${fontSize}px sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.letterSpacing = '-1px'
  const titleLines = wrapText(ctx, title, 50, 140, 940, fontSize * 1.2, 3)

  // ── LAYER 7: Stats row ───────────────────────────────────────────────────
  const statsY = 430
  const stat1Val   = fm.timeToComplete || '—'
  const stat1Label = 'TO COMPLETE'
  const stat2Val   = fm.difficulty ? fm.difficulty.charAt(0).toUpperCase() + fm.difficulty.slice(1) : '—'
  const stat2Label = 'DIFFICULTY'
  const stat3Val   = (fm.tags && fm.tags[0]) ? fm.tags[0] : (fm.category || '—')
  const stat3Label = 'TOPIC'

  function drawStat(x, val, label, valColor) {
    ctx.font = 'bold 20px monospace'
    ctx.fillStyle = valColor
    ctx.fillText(val, x, statsY)
    ctx.font = '500 10px sans-serif'
    ctx.fillStyle = '#a1a1aa'
    ctx.fillText(label, x, statsY + 20)
  }

  function drawDivider(x) {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x, statsY - 18); ctx.lineTo(x, statsY + 22); ctx.stroke()
  }

  drawStat(50,  stat1Val, stat1Label, '#60a5fa')
  drawDivider(200)
  drawStat(220, stat2Val, stat2Label, diffColor(fm.difficulty))
  drawDivider(390)
  drawStat(410, stat3Val, stat3Label, '#a78bfa')

  // ── LAYER 8: Bottom row ──────────────────────────────────────────────────
  const bottomY = 570
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, 555); ctx.lineTo(1200, 555); ctx.stroke()

  // Avatar — real photo clipped to circle
  const AVATAR_PATH = '/var/www/blixamo/public/images/ankit-avatar.jpg'
  try {
    const { loadImage } = require('/var/www/blixamo/node_modules/canvas')
    const avatarImg = await loadImage(AVATAR_PATH)
    const R = 18
    const ax = 62, ay = bottomY
    ctx.save()
    ctx.beginPath()
    ctx.arc(ax, ay, R, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(avatarImg, ax - R, ay - R, R * 2, R * 2)
    ctx.restore()
    ctx.beginPath()
    ctx.arc(ax, ay, R, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  } catch(e) {
    const avatarGrad = ctx.createLinearGradient(50, bottomY - 18, 80, bottomY + 18)
    avatarGrad.addColorStop(0, '#3b82f6')
    avatarGrad.addColorStop(1, '#7c3aed')
    ctx.fillStyle = avatarGrad
    ctx.beginPath(); ctx.arc(62, bottomY, 18, 0, Math.PI * 2); ctx.fill()
    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('A', 62, bottomY + 4)
    ctx.textAlign = 'left'
  }

  // Author + date
  const dateStr = fm.date ? new Date(fm.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#71717a'
  ctx.fillText(`Ankit Sorathiya · ${dateStr}`, 82, bottomY + 4)

  // Right side site name
  ctx.font = '500 11px sans-serif'
  ctx.fillStyle = '#3f3f46'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1190, bottomY + 4)
  ctx.textAlign = 'left'

  // ── LAYER 9: Right side big stat ─────────────────────────────────────────
  const { val: bigVal, label: bigLabel } = extractKeyStat(fm)
  const bigGrad = ctx.createLinearGradient(1020, 200, 1200, 400)
  bigGrad.addColorStop(0, color)
  bigGrad.addColorStop(1, '#22d3ee')

  ctx.font = 'bold 64px monospace'
  ctx.fillStyle = bigGrad
  ctx.textAlign = 'center'
  ctx.fillText(bigVal, 1110, 310)

  ctx.font = '500 11px sans-serif'
  ctx.fillStyle = '#a1a1aa'
  ctx.fillText(bigLabel, 1110, 350)
  ctx.textAlign = 'left'

  // ── Save ─────────────────────────────────────────────────────────────────
  const outDir  = path.join(OUT_BASE, slug)
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'featured.png')
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'))
  return outPath
}

// ── Update frontmatter featuredImage field ────────────────────────────────────
function updateFrontmatter(filePath, slug) {
  let raw = fs.readFileSync(filePath, 'utf8')
  const newVal = `/images/posts/${slug}/featured.png`
  if (raw.includes('featuredImage:')) {
    raw = raw.replace(/featuredImage:\s*.+/, `featuredImage: ${newVal}`)
  } else {
    raw = raw.replace(/^(---\n)/, `$1featuredImage: ${newVal}\n`)
  }
  fs.writeFileSync(filePath, raw, 'utf8')
}

// ── Run ───────────────────────────────────────────────────────────────────────
;(async () => {
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
let generated = 0, skipped = 0, errors = 0

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file)
  const raw      = fs.readFileSync(filePath, 'utf8')
  const { data: fm } = matter(raw)
  const slug     = fm.slug || file.replace('.mdx', '')

  if (SLUG_ONLY && slug !== SLUG_ONLY) continue

  const outPath = path.join(OUT_BASE, slug, 'featured.png')
  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`⏭  SKIP  ${slug}`)
    skipped++
    continue
  }

  try {
    const saved = await generateImage(slug, fm)
    updateFrontmatter(filePath, slug)
    const kb = Math.round(fs.statSync(saved).size / 1024)
    console.log(`✅ GEN   ${slug} → ${saved} (${kb}KB)`)
    generated++
  } catch (e) {
    console.error(`❌ ERROR ${slug}: ${e.message}`)
    errors++
  }
}

console.log(`\nDone: ${generated} generated · ${skipped} skipped · ${errors} errors`)
})()
