#!/usr/bin/env node
// Blixamo In-Article Image Generator
// Generates contextual 1200x630 dark-theme mockup images for article body

const { createCanvas } = require('/var/www/blixamo/node_modules/canvas')
const fs   = require('fs')
const path = require('path')

const OUT_BASE = '/var/www/blixamo/public/images'

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

function drawTerminal(ctx, x, y, w, h, lines, title = 'terminal') {
  // Window chrome
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, x, y, w, h, 8)
  ctx.fill()
  ctx.strokeStyle = '#313244'
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, h, 8)
  ctx.stroke()

  // Title bar
  ctx.fillStyle = '#181825'
  roundRect(ctx, x, y, w, 32, 8)
  ctx.fill()
  ctx.fillStyle = '#181825'
  ctx.fillRect(x, y + 16, w, 16)

  // Traffic lights
  const dots = ['#ff5f57', '#febc2e', '#28c840']
  dots.forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(x + 16 + i * 20, y + 16, 6, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  // Title text
  ctx.fillStyle = '#6c7086'
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(title, x + w / 2, y + 21)
  ctx.textAlign = 'left'

  // Terminal lines
  const lineH = 22
  const startY = y + 50
  lines.forEach((line, i) => {
    const color = line.startsWith('$') ? '#a6e3a1'
      : line.startsWith('#') ? '#6c7086'
      : line.startsWith('✅') || line.startsWith('✓') ? '#a6e3a1'
      : line.startsWith('❌') || line.startsWith('Error') ? '#f38ba8'
      : line.startsWith('→') || line.startsWith('⚡') ? '#89b4fa'
      : line.startsWith('📊') || line.startsWith('──') ? '#cba6f7'
      : '#cdd6f4'
    ctx.fillStyle = color
    ctx.font = '13px monospace'
    ctx.fillText(line, x + 16, startY + i * lineH)
  })
}

function drawCard(ctx, x, y, w, h, title, rows, accentColor = '#7c3aed') {
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, x, y, w, h, 8)
  ctx.fill()
  ctx.strokeStyle = accentColor + '44'
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, h, 8)
  ctx.stroke()

  // Accent top bar
  ctx.fillStyle = accentColor
  ctx.fillRect(x, y, w, 3)

  // Title
  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText(title, x + 14, y + 22)

  // Divider
  ctx.strokeStyle = '#313244'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x + 14, y + 32)
  ctx.lineTo(x + w - 14, y + 32)
  ctx.stroke()

  // Rows
  rows.forEach((row, i) => {
    const ry = y + 50 + i * 28
    ctx.fillStyle = '#6c7086'
    ctx.font = '12px sans-serif'
    ctx.fillText(row.label, x + 14, ry)
    ctx.fillStyle = row.highlight ? accentColor : '#cdd6f4'
    ctx.font = row.highlight ? 'bold 12px sans-serif' : '12px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(row.value, x + w - 14, ry)
    ctx.textAlign = 'left'
  })
}

function save(canvas, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const buf = canvas.toBuffer('image/png')
  fs.writeFileSync(outPath, buf)
  const kb = Math.round(buf.length / 1024)
  console.log(`✅ ${outPath.replace('/var/www/blixamo/public', '')} (${kb}KB)`)
}

// ── IMAGE DEFINITIONS ─────────────────────────────────────────────────────────

// 1. DBeaver schema browser
;(() => {
  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#11111b'
  ctx.fillRect(0, 0, 1200, 630)

  // Label top
  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('DBeaver Community — PostgreSQL Schema Browser', 48, 50)
  ctx.fillStyle = '#6c7086'
  ctx.font = '14px sans-serif'
  ctx.fillText('Open source · 100+ databases · SSH tunnel support · 0 cost', 48, 76)

  // Left panel — tree
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, 48, 96, 260, 490, 8)
  ctx.fill()
  ctx.strokeStyle = '#313244'
  ctx.lineWidth = 1
  roundRect(ctx, 48, 96, 260, 490, 8)
  ctx.stroke()

  const treeItems = [
    { text: '▾ PostgreSQL 16', depth: 0, color: '#89b4fa' },
    { text: '  ▾ Databases', depth: 1, color: '#cdd6f4' },
    { text: '    ▾ supabase_db', depth: 2, color: '#a6e3a1' },
    { text: '      ▾ Schemas', depth: 3, color: '#cdd6f4' },
    { text: '        ▾ public', depth: 4, color: '#cba6f7' },
    { text: '          ▾ Tables (20)', depth: 5, color: '#cdd6f4' },
    { text: '            users', depth: 6, color: '#f9e2af' },
    { text: '            posts', depth: 6, color: '#f9e2af' },
    { text: '            comments', depth: 6, color: '#f9e2af' },
    { text: '            categories', depth: 6, color: '#f9e2af' },
    { text: '            sessions', depth: 6, color: '#f9e2af' },
    { text: '          ▾ Views (3)', depth: 5, color: '#cdd6f4' },
    { text: '          ▾ Functions', depth: 5, color: '#cdd6f4' },
    { text: '      ▾ auth (Supabase)', depth: 3, color: '#6c7086' },
    { text: '      ▾ storage', depth: 3, color: '#6c7086' },
  ]
  treeItems.forEach((item, i) => {
    ctx.fillStyle = item.color
    ctx.font = '12px monospace'
    ctx.fillText(item.text, 62, 124 + i * 22)
  })

  // Main panel — table preview
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, 324, 96, 828, 490, 8)
  ctx.fill()
  ctx.strokeStyle = '#313244'
  ctx.lineWidth = 1
  roundRect(ctx, 324, 96, 828, 490, 8)
  ctx.stroke()

  // Tab bar
  ctx.fillStyle = '#181825'
  ctx.fillRect(324, 96, 828, 36)
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, 332, 102, 120, 24, 4)
  ctx.fill()
  ctx.fillStyle = '#cdd6f4'
  ctx.font = '12px sans-serif'
  ctx.fillText('users — Data', 344, 118)

  // Table header
  const cols = ['id (uuid)', 'email', 'created_at', 'role', 'active']
  const colW = [180, 220, 160, 100, 80]
  let cx = 340
  ctx.fillStyle = '#181825'
  ctx.fillRect(324, 132, 828, 28)
  cols.forEach((col, i) => {
    ctx.fillStyle = '#89b4fa'
    ctx.font = 'bold 12px monospace'
    ctx.fillText(col, cx, 150)
    cx += colW[i]
  })

  // Table rows
  const rows = [
    ['3f4a...', 'ankit@blixamo.com', '2026-03-14 09:12', 'admin', 'true'],
    ['8b2c...', 'user@example.com', '2026-03-15 14:33', 'user', 'true'],
    ['1d9e...', 'test@domain.in', '2026-03-16 11:05', 'user', 'false'],
    ['7a3f...', 'dev@indie.io', '2026-03-17 08:44', 'editor', 'true'],
    ['2c8b...', 'hello@startup.in', '2026-03-18 16:21', 'user', 'true'],
  ]
  rows.forEach((row, ri) => {
    ctx.fillStyle = ri % 2 === 0 ? '#181825' : '#1e1e2e'
    ctx.fillRect(324, 160 + ri * 28, 828, 28)
    let cx2 = 340
    row.forEach((cell, ci) => {
      ctx.fillStyle = ci === 0 ? '#6c7086' : ci === 4 ? (cell === 'true' ? '#a6e3a1' : '#f38ba8') : '#cdd6f4'
      ctx.font = '12px monospace'
      ctx.fillText(cell, cx2, 178 + ri * 28)
      cx2 += colW[ci]
    })
  })

  // Status bar
  ctx.fillStyle = '#7c3aed'
  ctx.fillRect(324, 548, 828, 38)
  ctx.fillStyle = '#fff'
  ctx.font = '12px sans-serif'
  ctx.fillText('PostgreSQL 16  |  supabase_db.public.users  |  5 rows  |  Loaded in 0.8s', 340, 571)

  // Watermark
  ctx.fillStyle = '#313244'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1152, 620)
  ctx.textAlign = 'left'

  save(canvas, `${OUT_BASE}/best-postgresql-gui-free/01-dbeaver-schema.png`)
})()

// 2. Adminer browser UI
;(() => {
  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#11111b'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('Adminer — Browser-Based PostgreSQL GUI on Hetzner VPS', 48, 50)
  ctx.fillStyle = '#6c7086'
  ctx.font = '14px sans-serif'
  ctx.fillText('Single PHP file · No install · Restrict with Nginx IP whitelist · Free forever', 48, 76)

  // Browser chrome
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, 48, 96, 1104, 490, 8)
  ctx.fill()

  // Browser top bar
  ctx.fillStyle = '#181825'
  roundRect(ctx, 48, 96, 1104, 44, 8)
  ctx.fill()
  ctx.fillStyle = '#181825'
  ctx.fillRect(48, 118, 1104, 22)

  // Traffic lights
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(78 + i * 22, 118, 6, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  // URL bar
  ctx.fillStyle = '#313244'
  roundRect(ctx, 160, 108, 600, 22, 4)
  ctx.fill()
  ctx.fillStyle = '#a6e3a1'
  ctx.font = '12px monospace'
  ctx.fillText('https://77.42.17.13/adminer.php', 170, 123)

  // Adminer content area
  ctx.fillStyle = '#f8f8f2'
  ctx.fillRect(48, 140, 1104, 446)

  // Adminer header bar
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(48, 140, 1104, 48)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('Adminer 4.8', 68, 168)
  ctx.fillStyle = '#89b4fa'
  ctx.font = '13px sans-serif'
  ctx.fillText('PostgreSQL 16 — supabase_db — public', 200, 168)

  // Left sidebar
  ctx.fillStyle = '#e8e8e8'
  ctx.fillRect(48, 188, 200, 398)
  const sideItems = ['users', 'posts', 'comments', 'categories', 'sessions', 'tags', 'media', 'settings']
  sideItems.forEach((item, i) => {
    ctx.fillStyle = i === 0 ? '#1a1a2e' : '#444'
    ctx.fillRect(48, 188 + i * 46, 200, 46)
    if (i === 0) {
      ctx.fillStyle = '#fff'
    } else {
      ctx.fillStyle = i % 2 === 0 ? '#e0e0e0' : '#e8e8e8'
      ctx.fillRect(48, 188 + i * 46, 200, 46)
      ctx.fillStyle = '#333'
    }
    ctx.font = '13px sans-serif'
    ctx.fillText(item, 68, 215 + i * 46)
    ctx.fillStyle = '#888'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.floor(Math.random() * 200 + 10)} rows`, 234, 215 + i * 46)
    ctx.textAlign = 'left'
  })

  // Main table area
  ctx.fillStyle = '#fff'
  ctx.fillRect(248, 188, 904, 398)
  // Table header
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(248, 188, 904, 36)
  ;['id', 'email', 'created_at', 'role', 'active', 'Actions'].forEach((h, i) => {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(h, 264 + i * 148, 210)
  })
  // Rows
  const aRows = [
    ['1', 'ankit@blixamo.com', '2026-03-14', 'admin', '✓'],
    ['2', 'user@example.com', '2026-03-15', 'user', '✓'],
    ['3', 'test@domain.in', '2026-03-16', 'user', '✗'],
  ]
  aRows.forEach((row, ri) => {
    ctx.fillStyle = ri % 2 === 0 ? '#f9f9f9' : '#fff'
    ctx.fillRect(248, 224 + ri * 32, 904, 32)
    row.forEach((cell, ci) => {
      ctx.fillStyle = cell === '✓' ? '#059669' : cell === '✗' ? '#dc2626' : '#333'
      ctx.font = '12px sans-serif'
      ctx.fillText(cell, 264 + ci * 148, 244 + ri * 32)
    })
    // Edit/Delete buttons
    ctx.fillStyle = '#0891b2'
    roundRect(ctx, 1000, 228 + ri * 32, 44, 20, 3)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '11px sans-serif'
    ctx.fillText('Edit', 1010, 242 + ri * 32)
  })

  ctx.fillStyle = '#313244'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1152, 620)
  ctx.textAlign = 'left'

  save(canvas, `${OUT_BASE}/best-postgresql-gui-free/02-adminer-browser.png`)
})()

// 3. Claude API terminal response
;(() => {
  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#11111b'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('Claude API — First Response in Node.js', 48, 50)
  ctx.fillStyle = '#6c7086'
  ctx.font = '14px sans-serif'
  ctx.fillText('claude-sonnet-4 · 1.2s response time · 150 tokens · Rs 0.05 per call', 48, 76)

  drawTerminal(ctx, 48, 96, 680, 490, [
    '$ node claude-test.ts',
    '',
    '# Sending request to Anthropic API...',
    '# Model: claude-sonnet-4-20250514',
    '# Max tokens: 1024',
    '',
    '→ Response received in 1.2s',
    '',
    'JWT tokens are signed, encoded strings that',
    'securely transmit user identity between a',
    'client and server. They contain three parts:',
    'header, payload, and signature — separated',
    'by dots. The server validates the signature',
    'without storing session state.',
    '',
    '# Token usage:',
    '→ Input:  42 tokens  (Rs 0.011)',
    '→ Output: 68 tokens  (Rs 0.038)',
    '→ Total:  110 tokens (Rs 0.049)',
    '',
    '✅ Request complete',
  ], 'claude-test.ts — node')

  // Stats cards on right
  const stats = [
    { label: 'Response time', value: '1.2s', color: '#a6e3a1' },
    { label: 'Model', value: 'Sonnet 4', color: '#89b4fa' },
    { label: 'Context window', value: '200K tokens', color: '#cba6f7' },
    { label: 'Cost per call', value: '₹0.05', color: '#f9e2af' },
    { label: 'vs GPT-4o cost', value: '−60%', color: '#a6e3a1' },
  ]
  stats.forEach((s, i) => {
    ctx.fillStyle = '#1e1e2e'
    roundRect(ctx, 756, 96 + i * 98, 396, 82, 8)
    ctx.fill()
    ctx.strokeStyle = s.color + '44'
    ctx.lineWidth = 1
    roundRect(ctx, 756, 96 + i * 98, 396, 82, 8)
    ctx.stroke()
    ctx.fillStyle = '#6c7086'
    ctx.font = '13px sans-serif'
    ctx.fillText(s.label, 776, 128 + i * 98)
    ctx.fillStyle = s.color
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(s.value, 776, 158 + i * 98)
  })

  ctx.fillStyle = '#313244'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1152, 620)
  ctx.textAlign = 'left'

  save(canvas, `${OUT_BASE}/claude-ai-guide/01-claude-api-response.png`)
})()

// 4. n8n dashboard
;(() => {
  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#11111b'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('n8n Self-Hosted — Workflow Automation on Hetzner VPS', 48, 50)
  ctx.fillStyle = '#6c7086'
  ctx.font = '14px sans-serif'
  ctx.fillText('Replaces Zapier Rs 4,400/month · Unlimited executions · ₹0 running cost', 48, 76)

  // n8n sidebar
  ctx.fillStyle = '#1a1a2e'
  roundRect(ctx, 48, 96, 220, 490, 8)
  ctx.fill()
  const navItems = [
    { icon: '⚡', label: 'Workflows', active: true },
    { icon: '▶', label: 'Executions', active: false },
    { icon: '🔗', label: 'Credentials', active: false },
    { icon: '⚙', label: 'Settings', active: false },
  ]
  navItems.forEach((item, i) => {
    if (item.active) {
      ctx.fillStyle = '#7c3aed33'
      ctx.fillRect(48, 110 + i * 52, 220, 44)
      ctx.fillStyle = '#cba6f7'
    } else {
      ctx.fillStyle = '#6c7086'
    }
    ctx.font = '14px sans-serif'
    ctx.fillText(`${item.icon}  ${item.label}`, 72, 136 + i * 52)
  })

  // Main area
  ctx.fillStyle = '#1e1e2e'
  roundRect(ctx, 284, 96, 868, 490, 8)
  ctx.fill()

  // Header
  ctx.fillStyle = '#181825'
  ctx.fillRect(284, 96, 868, 52)
  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('Workflows', 308, 126)
  ctx.fillStyle = '#7c3aed'
  roundRect(ctx, 1060, 108, 78, 28, 4)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = '12px sans-serif'
  ctx.fillText('+ New', 1078, 126)

  // Workflow cards
  const workflows = [
    { name: 'Blog Article Generator', status: 'Active', runs: '147', last: '2m ago', color: '#a6e3a1' },
    { name: 'WhatsApp AI Assistant', status: 'Active', runs: '89', last: '12m ago', color: '#a6e3a1' },
    { name: 'VPS Health Monitor', status: 'Active', runs: '2,341', last: '5m ago', color: '#a6e3a1' },
    { name: 'GSC Index Request', status: 'Active', runs: '24', last: '1h ago', color: '#a6e3a1' },
  ]
  workflows.forEach((wf, i) => {
    const wy = 160 + i * 96
    ctx.fillStyle = '#181825'
    roundRect(ctx, 304, wy, 828, 78, 6)
    ctx.fill()
    ctx.strokeStyle = '#313244'
    ctx.lineWidth = 1
    roundRect(ctx, 304, wy, 828, 78, 6)
    ctx.stroke()

    // Status dot
    ctx.beginPath()
    ctx.arc(326, wy + 30, 6, 0, Math.PI * 2)
    ctx.fillStyle = wf.color
    ctx.fill()

    ctx.fillStyle = '#cdd6f4'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(wf.name, 344, wy + 34)

    ctx.fillStyle = '#6c7086'
    ctx.font = '12px sans-serif'
    ctx.fillText(`${wf.runs} executions · last run ${wf.last}`, 344, wy + 56)

    // Run button
    ctx.fillStyle = '#313244'
    roundRect(ctx, 1060, wy + 22, 58, 26, 4)
    ctx.fill()
    ctx.fillStyle = '#cdd6f4'
    ctx.font = '12px sans-serif'
    ctx.fillText('▶ Run', 1072, wy + 38)
  })

  ctx.fillStyle = '#313244'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1152, 620)
  ctx.textAlign = 'left'

  save(canvas, `${OUT_BASE}/open-source-tools-2026/01-n8n-dashboard.png`)
})()

// 5. Tailwind config screenshot
;(() => {
  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#11111b'
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('Next.js 15 + Tailwind CSS — tailwind.config.ts', 48, 50)
  ctx.fillStyle = '#6c7086'
  ctx.font = '14px sans-serif'
  ctx.fillText('App Router · JIT compiler · 11KB bundle · Dark mode via class strategy', 48, 76)

  // Code editor
  drawTerminal(ctx, 48, 96, 680, 490, [
    '// tailwind.config.ts',
    "import type { Config } from 'tailwindcss'",
    '',
    'const config: Config = {',
    "  content: [",
    "    './src/pages/**/*.{ts,tsx,mdx}',",
    "    './src/components/**/*.{ts,tsx}',",
    "    './src/app/**/*.{ts,tsx,mdx}',",
    "    './content/**/*.{mdx,md}',  // MDX!",
    "  ],",
    "  darkMode: 'class',",
    "  theme: {",
    "    extend: {",
    "      colors: {",
    "        brand: '#7c3aed',",
    "      },",
    "    },",
    "  },",
    "  plugins: [require('@tailwindcss/typography')],",
    '}',
    '',
    'export default config',
  ], 'tailwind.config.ts — VSCode')

  // Right: bundle size comparison
  const items = [
    { label: 'Tailwind CSS (JIT)', size: 11, color: '#a6e3a1', max: 140 },
    { label: 'Bootstrap 5', size: 140, color: '#f38ba8', max: 140 },
    { label: 'Foundation 6', size: 120, color: '#fab387', max: 140 },
    { label: 'Bulma', size: 80, color: '#f9e2af', max: 140 },
    { label: 'CSS Modules (avg)', size: 22, color: '#89b4fa', max: 140 },
  ]

  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('CSS Bundle Size Comparison (gzipped)', 756, 130)

  items.forEach((item, i) => {
    const bx = 756
    const by = 160 + i * 78
    const bw = 396
    ctx.fillStyle = '#6c7086'
    ctx.font = '13px sans-serif'
    ctx.fillText(item.label, bx, by)
    // Bar bg
    ctx.fillStyle = '#313244'
    roundRect(ctx, bx, by + 10, bw - 60, 20, 4)
    ctx.fill()
    // Bar fill
    const fillW = Math.round((item.size / item.max) * (bw - 60))
    ctx.fillStyle = item.color
    roundRect(ctx, bx, by + 10, fillW, 20, 4)
    ctx.fill()
    // Value
    ctx.fillStyle = item.color
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${item.size}KB`, bx + bw - 55, by + 24)
    ctx.textAlign = 'left'
  })

  ctx.fillStyle = '#313244'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('blixamo.com', 1152, 620)
  ctx.textAlign = 'left'

  save(canvas, `${OUT_BASE}/tailwind-css-vs-css-modules/01-nextjs-tailwind-config.png`)
})()

console.log('\nAll article images generated.')
