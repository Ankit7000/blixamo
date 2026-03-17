import { getAllPosts, getAllCategories } from '@/lib/posts'
import type { MetadataRoute } from 'next'

const SITE = 'https://blixamo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...categories.map(c => ({ url: `${SITE}/category/${c}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...posts.map(p => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.date),
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.9 : 0.7,
    })),
  ]
}
