import { getAllPosts, getAllCategories } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = [...new Set(posts.flatMap(post => post.tags))].sort()
  const authors = [...new Set(posts.map(post => post.author.toLowerCase()))].sort()
  const latestPostDate = posts.reduce((latest, post) => {
    const value = new Date(post.updatedAt || post.date)
    return value > latest ? value : latest
  }, new Date(0))

  function latestDateFor(matches: typeof posts): Date {
    return matches.reduce((latest, post) => {
      const value = new Date(post.updatedAt || post.date)
      return value > latest ? value : latest
    }, new Date(0))
  }

  return [
    { url: absoluteUrl(), lastModified: latestPostDate, changeFrequency: 'daily', priority: 1.0 },
    { url: absoluteUrl('/blog'), lastModified: latestPostDate, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: latestPostDate, changeFrequency: 'monthly', priority: 0.5 },
    ...categories.map(category => ({
      url: absoluteUrl(`/category/${category}`),
      lastModified: latestDateFor(posts.filter(post => post.category === category)),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...tags.map(tag => ({
      url: absoluteUrl(`/tag/${encodeURIComponent(tag)}`),
      lastModified: latestDateFor(posts.filter(post => post.tags.includes(tag))),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...authors.map(author => ({
      url: absoluteUrl(`/author/${encodeURIComponent(author)}`),
      lastModified: latestDateFor(posts.filter(post => post.author.toLowerCase() === author)),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...posts.map(p => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt || p.date),
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.9 : 0.7,
    })),
  ]
}
