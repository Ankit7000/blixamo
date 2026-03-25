import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  updatedAt?: string
  author: string
  category: string
  tags: string[]
  keyword: string
  featured: boolean
  featuredImage: string
  readingTime: string
  content: string
  schema?: 'article' | 'howto' | 'faq' | 'review'
  noindex?: boolean
  canonical?: string
}

function calcReadingTime(text: string): string {
  const words = text.split(/\s+/).length
  const mins = Math.ceil(words / 200)
  return `${mins} min read`
}

export function getPostFreshnessDate(post: Pick<Post, 'updatedAt' | 'date'>): Date {
  return new Date(post.updatedAt || post.date)
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        updatedAt: data.updatedAt,
        author: data.author || 'Blixamo',
        category: data.category || 'general',
        tags: data.tags || [],
        keyword: data.keyword || '',
        featured: data.featured || false,
        featuredImage: data.featuredImage || '/images/default-og.jpg',
        readingTime: calcReadingTime(content),
        content,
        schema: data.schema || 'article',
        noindex: data.noindex || false,
        canonical: data.canonical || '',
      } as Post
    })
    .sort((a, b) => getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(p => p.slug === slug)
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedPosts(limit = 5): Post[] {
  return getAllPosts().filter(p => p.featured).slice(0, limit)
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const allOtherPosts = getAllPosts().filter(p => p.slug !== post.slug)

  const scored = allOtherPosts
    .map(p => ({
      post: p,
      score:
        p.tags.filter(t => post.tags.includes(t)).length * 2 +
        (p.category === post.category ? 4 : 0),
      freshness: getPostFreshnessDate(p).getTime(),
    }))
    .sort((a, b) => b.score - a.score || b.freshness - a.freshness)

  const positiveMatches = scored.filter(entry => entry.score > 0).slice(0, limit)
  if (positiveMatches.length >= limit) {
    return positiveMatches.map(({ post }) => post)
  }

  const fallback = scored
    .filter(entry => !positiveMatches.some(match => match.post.slug === entry.post.slug))
    .slice(0, limit - positiveMatches.length)

  return [...positiveMatches, ...fallback].map(({ post }) => post)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.map(p => p.category))]
}
