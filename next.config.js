/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    remotePatterns: [],
  },
  compress: true,
  poweredByHeader: false,
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
  async redirects() {
    return [
      // ── Legacy category slugs → canonical slugs ──────────────────────────
      { source: '/category/tutorials',  destination: '/category/how-to',         permanent: true },
      { source: '/category/tools',      destination: '/category/developer-tools', permanent: true },
      { source: '/category/indie-dev',  destination: '/category/vps-cloud',       permanent: true },
      { source: '/category/tech',       destination: '/category/vps-cloud',       permanent: true },

      // ── Legacy series URLs ────────────────────────────────────────────────
      { source: '/series/nextjs-deployment', destination: '/category/how-to',       permanent: true },
      { source: '/series/nextjs-tutorials',  destination: '/category/how-to',       permanent: true },
      { source: '/series/self-hosting',      destination: '/category/self-hosting', permanent: true },

      // ── Misc ──────────────────────────────────────────────────────────────
      { source: '/tag/cloudflare', destination: '/tag/deployment', permanent: true },
      { source: '/tag/docker', destination: '/tag/deployment', permanent: true },
      { source: '/tag/postgresql', destination: '/tag/deployment', permanent: true },
      { source: '/tag/nextjs', destination: '/tag/deployment', permanent: true },
      { source: '/tag/vps', destination: '/tag/deployment', permanent: true },
      { source: '/tag/automation', destination: '/tag/deployment', permanent: true },
      { source: '/hire', destination: '/about', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

module.exports = nextConfig
