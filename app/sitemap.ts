import { getAllPosts, getAllCategories, getPostFreshnessDate } from '@/lib/posts'
import type { MetadataRoute } from 'next'

const SITE = 'https://blixamo.com'
const STATIC_PAGE_LAST_MODIFIED = new Date('2026-03-25')

const KEEP_TAGS = [
  'hetzner','self-hosting','vps','nextjs','indie-dev',
  'automation','n8n','india','nodejs','devops','coolify','claude','ai'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const latestPostDate = posts.length > 0 ? getPostFreshnessDate(posts[0]) : STATIC_PAGE_LAST_MODIFIED

  const getLatestDateForCategory = (category: string) => {
    const categoryPosts = posts.filter((post) => post.category === category)
    return categoryPosts.length > 0 ? getPostFreshnessDate(categoryPosts[0]) : STATIC_PAGE_LAST_MODIFIED
  }

  const getLatestDateForTag = (tag: string) => {
    const taggedPosts = posts.filter((post) => post.tags.includes(tag))
    return taggedPosts.length > 0 ? getPostFreshnessDate(taggedPosts[0]) : STATIC_PAGE_LAST_MODIFIED
  }

  return [
    { url: SITE, lastModified: latestPostDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE}/about`, lastModified: STATIC_PAGE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: STATIC_PAGE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE}/privacy-policy`, lastModified: STATIC_PAGE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: STATIC_PAGE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE}/disclaimer`, lastModified: STATIC_PAGE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    ...categories.map(c => ({
      url: `${SITE}/category/${c}`,
      lastModified: getLatestDateForCategory(c),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...KEEP_TAGS.map(t => ({
      url: `${SITE}/tag/${t}`,
      lastModified: getLatestDateForTag(t),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...posts.map(p => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: getPostFreshnessDate(p),
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.9 : 0.7,
    })),
  ]
}
