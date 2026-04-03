const fs = require('fs')
const path = require('path')

const expectedBody = fs
  .readFileSync(path.join(process.cwd(), 'public', 'ads.txt'), 'utf8')
  .trim()

const checks = [
  {
    inputUrl: 'https://blixamo.com/ads.txt',
    expectedFinalUrl: 'https://blixamo.com/ads.txt',
    maxRedirects: 0,
  },
  {
    inputUrl: 'https://www.blixamo.com/ads.txt',
    expectedFinalUrl: 'https://blixamo.com/ads.txt',
    maxRedirects: 2,
  },
  {
    inputUrl: 'http://blixamo.com/ads.txt',
    expectedFinalUrl: 'https://blixamo.com/ads.txt',
    maxRedirects: 2,
  },
]

async function fetchWithRedirects(inputUrl, limit = 5) {
  const hops = []
  let currentUrl = inputUrl

  for (let i = 0; i <= limit; i += 1) {
    const response = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'user-agent': 'blixamo-ads-verifier/1.0',
      },
    })

    const location = response.headers.get('location')
    const isRedirect = response.status >= 300 && response.status < 400 && location

    if (isRedirect) {
      const nextUrl = new URL(location, currentUrl).toString()
      hops.push({
        status: response.status,
        url: currentUrl,
        location: nextUrl,
      })
      currentUrl = nextUrl
      continue
    }

    return {
      finalUrl: currentUrl,
      response,
      hops,
    }
  }

  throw new Error(`Too many redirects while fetching ${inputUrl}`)
}

function fail(message) {
  console.error(`[ads:verify:prod] ${message}`)
  process.exit(1)
}

;(async () => {
  for (const check of checks) {
    const { inputUrl, expectedFinalUrl, maxRedirects } = check
    const result = await fetchWithRedirects(inputUrl, 5)
    const { finalUrl, response, hops } = result
    const contentType = response.headers.get('content-type') || ''
    const body = (await response.text()).trim()
    const looksLikeHtml = /<!doctype html|<html/i.test(body)

    console.log(`[ads:verify:prod] ${inputUrl}`)
    hops.forEach((hop, index) => {
      console.log(
        `[ads:verify:prod]   hop ${index + 1}: ${hop.status} ${hop.url} -> ${hop.location}`
      )
    })
    console.log(
      `[ads:verify:prod]   final: ${response.status} ${finalUrl} (${contentType || 'no content-type'})`
    )

    if (hops.length > maxRedirects) {
      fail(`${inputUrl} exceeded redirect limit (${hops.length} > ${maxRedirects})`)
    }

    if (finalUrl !== expectedFinalUrl) {
      fail(`${inputUrl} resolved to ${finalUrl}, expected ${expectedFinalUrl}`)
    }

    if (response.status !== 200) {
      fail(`${inputUrl} returned ${response.status}, expected 200`)
    }

    if (!contentType.toLowerCase().startsWith('text/plain')) {
      fail(`${inputUrl} returned content-type "${contentType}", expected text/plain`)
    }

    if (looksLikeHtml) {
      fail(`${inputUrl} returned HTML instead of plain text`)
    }

    if (body !== expectedBody) {
      fail(`${inputUrl} body mismatch. Found "${body}"`)
    }
  }

  console.log('[ads:verify:prod] PASS all ads.txt variants')
})().catch((error) => {
  fail(error instanceof Error ? error.message : String(error))
})
