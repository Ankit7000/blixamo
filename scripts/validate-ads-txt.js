const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'public', 'ads.txt')

if (!fs.existsSync(filePath)) {
  console.error(`[ads:check] Missing file: ${filePath}`)
  process.exit(1)
}

const body = fs.readFileSync(filePath, 'utf8').trim()

if (!body) {
  console.error('[ads:check] public/ads.txt is empty')
  process.exit(1)
}

const lines = body
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

if (lines.length !== 1) {
  console.error(`[ads:check] Expected exactly 1 non-empty line, found ${lines.length}`)
  process.exit(1)
}

const expectedPattern = /^google\.com,\s*pub-\d{16},\s*DIRECT,\s*f08c47fec0942fa0$/i

if (!expectedPattern.test(lines[0])) {
  console.error('[ads:check] public/ads.txt does not match the expected AdSense publisher format')
  console.error(`[ads:check] Found: ${lines[0]}`)
  process.exit(1)
}

console.log(`[ads:check] PASS ${filePath}`)
console.log(`[ads:check] ${lines[0]}`)
