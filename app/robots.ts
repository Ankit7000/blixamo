import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/search', '/author/', '/page/', '/blog/page/', '/feed.xml'],
      },
    ],
    sitemap: 'https://blixamo.com/sitemap.xml',
  }
}
