import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { normalizeCategorySlug } from './categories'
import {
  getPostComparisonGroup,
  getPostRecommendationScope,
  getPrimaryPillarForPost,
  getScopedPillarTopicArticlesForPost,
  isComparisonPost,
  type PillarPage,
} from './pillars'
import { getRelatedCategorySlugs } from './resources'

const postsDirectory = path.join(process.cwd(), 'content/posts')

const FORCED_NOINDEX_POST_SLUGS = new Set([
  'migrate-postman-to-hoppscotch-2026',
  'docker-compose-health-checks-actually-help-2026',
])

const WEAK_ARTICLE_BOOSTS_BY_CATEGORY: Record<string, Set<string>> = {
  'developer-tools': new Set(['best-vpn-for-developers-2026']),
  'free-tools': new Set([
    'best-free-api-testing-tools-2026',
    'best-free-documentation-tools-2026',
    'best-free-git-tools-2026',
    'best-free-diagram-tools-2026',
  ]),
  'how-to': new Set(['build-telegram-bot-claude-api-python']),
  'indie-hacking': new Set(['razorpay-integration-nextjs-india', 'wise-vs-payoneer-india-freelancer']),
  'self-hosting': new Set(['self-hosting-resources']),
  'vps-cloud': new Set(['hetzner-vs-aws-2026', 'ssh-security-hardening-vps-2026', 'compromised-vps-recovery-2026']),
  'web-dev': new Set(['nextjs-mdx-remote-rsc-edge-runtime-fix', 'tailwind-css-tips']),
}

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
  comparisonGroup?: string
  relatedScope?: string
}

export type RecommendationMismatchReason =
  | 'category-mismatch'
  | 'comparison-group-mismatch'
  | 'scope-mismatch'

export type RecommendationValidationIssue = {
  currentSlug: string
  relatedSlug: string
  source: 'same-category' | 'overlapping-tags' | 'same-pillar'
  reasons: RecommendationMismatchReason[]
}

export type PostRecommendationSections = {
  sameScopePosts: Post[]
  sameCategoryPosts: Post[]
  overlappingTagPosts: Post[]
  samePillarPosts: Post[]
  primaryPosts: Post[]
  authorityPosts: Post[]
  relatedComparisons: Post[]
  validationIssues: RecommendationValidationIssue[]
}

function calcReadingTime(text: string): string {
  const words = text.split(/\s+/).length
  const mins = Math.ceil(words / 200)
  return `${mins} min read`
}

function uniquePosts(posts: Post[]): Post[] {
  const seen = new Set<string>()
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function comparePostsByArchiveOrder(
  a: Pick<Post, 'slug' | 'updatedAt' | 'date'>,
  b: Pick<Post, 'slug' | 'updatedAt' | 'date'>
): number {
  return getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime() || a.slug.localeCompare(b.slug)
}

function sortByFreshness(posts: Post[]): Post[] {
  return [...posts].sort(comparePostsByArchiveOrder)
}

function getTagOverlapCount(base: Pick<Post, 'tags'>, candidate: Pick<Post, 'tags'>): number {
  if (!base.tags.length || !candidate.tags.length) return 0
  return candidate.tags.filter((tag) => base.tags.includes(tag)).length
}

function isIndiaSpecificPost(post: Pick<Post, 'slug' | 'title' | 'keyword' | 'tags'>): boolean {
  const haystack = [
    post.slug,
    post.title,
    post.keyword,
    ...post.tags,
  ]
    .join(' ')
    .toLowerCase()

  return /\bindia(n)?\b/.test(haystack)
}

function sortByRelevance(base: Post, posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const scoreA = getTagOverlapCount(base, a)
    const scoreB = getTagOverlapCount(base, b)
    return scoreB - scoreA || getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime()
  })
}

function takeUniquePosts(posts: Post[], seen: Set<string>, limit: number): Post[] {
  const picked: Post[] = []

  for (const post of posts) {
    if (seen.has(post.slug)) continue
    seen.add(post.slug)
    picked.push(post)

    if (picked.length >= limit) break
  }

  return picked
}

export function getPostFreshnessDate(post: Pick<Post, 'updatedAt' | 'date'>): Date {
  return new Date(post.updatedAt || post.date)
}

export function isPostNoindex(post: Pick<Post, 'slug' | 'noindex'>): boolean {
  return Boolean(post.noindex) || FORCED_NOINDEX_POST_SLUGS.has(post.slug)
}

export function isIndexablePost(post: Pick<Post, 'slug' | 'noindex'>): boolean {
  return !isPostNoindex(post)
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory).sort()
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
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
        category: normalizeCategorySlug(data.category || 'general'),
        tags: data.tags || [],
        keyword: data.keyword || '',
        featured: data.featured || false,
        featuredImage: data.featuredImage || '/images/default-og.jpg',
        readingTime: calcReadingTime(content),
        content,
        schema: data.schema || 'article',
        noindex: data.noindex || false,
        canonical: data.canonical || '',
        comparisonGroup: data.comparisonGroup || '',
        relatedScope: data.relatedScope || '',
      } as Post
    })
    .sort(comparePostsByArchiveOrder)
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export function getPostsByCategory(category: string): Post[] {
  const slug = normalizeCategorySlug(category)
  return getAllPosts().filter((post) => post.category.toLowerCase() === slug.toLowerCase())
}

export function getIndexablePosts(): Post[] {
  return getAllPosts().filter(isIndexablePost)
}

export function getIndexablePostsByCategory(category: string): Post[] {
  const slug = normalizeCategorySlug(category)
  return getIndexablePosts().filter((post) => post.category.toLowerCase() === slug.toLowerCase())
}

export function getFeaturedPosts(limit = 5): Post[] {
  return getAllPosts().filter((post) => post.featured).slice(0, limit)
}

export function getRecommendationMismatchReasons(
  currentPost: Post,
  relatedPost: Post
): RecommendationMismatchReason[] {
  const currentScope = getPostRecommendationScope(currentPost)
  const relatedScope = getPostRecommendationScope(relatedPost)
  const currentComparisonGroup = getPostComparisonGroup(currentPost)
  const relatedComparisonGroup = getPostComparisonGroup(relatedPost)
  const relatedCategories = new Set([currentPost.category, ...getRelatedCategorySlugs(currentPost.category)])
  const overlapCount = getTagOverlapCount(currentPost, relatedPost)
  const reasons: RecommendationMismatchReason[] = []

  if (currentScope && relatedScope && currentScope !== relatedScope) {
    reasons.push('scope-mismatch')
  }

  if (
    currentComparisonGroup &&
    relatedComparisonGroup &&
    currentComparisonGroup !== relatedComparisonGroup
  ) {
    reasons.push('comparison-group-mismatch')
  }

  if (
    currentPost.category !== relatedPost.category &&
    !relatedCategories.has(relatedPost.category) &&
    overlapCount === 0 &&
    !(currentScope && relatedScope && currentScope === relatedScope)
  ) {
    reasons.push('category-mismatch')
  }

  return reasons
}

function hasBlockingRecommendationMismatch(currentPost: Post, relatedPost: Post): boolean {
  const reasons = getRecommendationMismatchReasons(currentPost, relatedPost)
  return reasons.includes('scope-mismatch') || reasons.includes('category-mismatch')
}

function logRecommendationValidationIssues(post: Post, issues: RecommendationValidationIssue[]) {
  if (!issues.length) return

  for (const issue of issues) {
    console.warn(
      `[recommendations] ${post.slug} -> ${issue.relatedSlug} blocked from ${issue.source}: ${issue.reasons.join(', ')}`
    )
  }
}

export function getPostRecommendationSections(
  post: Post,
  posts: Post[] = getAllPosts(),
  options: { limit?: number; pillarPage?: PillarPage | null } = {}
): PostRecommendationSections {
  const limit = options.limit ?? 3
  const boostedTargets = WEAK_ARTICLE_BOOSTS_BY_CATEGORY[post.category] || new Set<string>()
  const pillarPage = options.pillarPage ?? getPrimaryPillarForPost(post, posts)
  const allOtherPosts = posts.filter((entry) => entry.slug !== post.slug)
  const currentScope = getPostRecommendationScope(post)
  const currentComparisonGroup = getPostComparisonGroup(post)
  const currentPostIsIndiaSpecific = isIndiaSpecificPost(post)
  const validationIssues: RecommendationValidationIssue[] = []
  const seen = new Set<string>()

  const sameScopeCandidates = currentScope
    ? allOtherPosts.filter((entry) => getPostRecommendationScope(entry) === currentScope)
    : []

  const sameCategoryCandidates = allOtherPosts.filter((entry) => entry.category === post.category)

  const overlappingTagCandidates = allOtherPosts.filter((entry) => getTagOverlapCount(post, entry) > 0)

  const samePillarCandidates = getScopedPillarTopicArticlesForPost(post, posts, pillarPage).filter(
    (entry) => entry.slug !== post.slug
  )

  const sameScopePosts = takeUniquePosts(sortByRelevance(post, sameScopeCandidates), seen, limit)

  for (const entry of sameCategoryCandidates) {
    if (sameScopePosts.some((candidate) => candidate.slug === entry.slug)) continue
    const reasons = getRecommendationMismatchReasons(post, entry)
    if (reasons.includes('comparison-group-mismatch')) {
      validationIssues.push({
        currentSlug: post.slug,
        relatedSlug: entry.slug,
        source: 'same-category',
        reasons,
      })
    }
  }

  const sameCategoryPosts = takeUniquePosts(
    sortByRelevance(
      post,
      sameCategoryCandidates.filter((entry) => {
        if (hasBlockingRecommendationMismatch(post, entry)) return false

        const sameScope = currentScope && getPostRecommendationScope(entry) === currentScope
        const hasTagOverlap = getTagOverlapCount(post, entry) > 0

        if (currentScope && !sameScope && !hasTagOverlap) return false
        if (!currentPostIsIndiaSpecific && isIndiaSpecificPost(entry) && !sameScope) return false

        return true
      })
    ),
    seen,
    limit
  )

  const overlappingTagPosts = takeUniquePosts(
    sortByRelevance(
      post,
      overlappingTagCandidates.filter((entry) => {
        if (hasBlockingRecommendationMismatch(post, entry)) return false

        const sameScope = currentScope && getPostRecommendationScope(entry) === currentScope
        if (!currentPostIsIndiaSpecific && isIndiaSpecificPost(entry) && !sameScope) return false

        return true
      })
    ),
    seen,
    limit
  )

  const relatedCategorySlugs = getRelatedCategorySlugs(post.category)

  const samePillarPosts = takeUniquePosts(
    sortByRelevance(
      post,
      samePillarCandidates.filter((entry) => {
        const reasons = getRecommendationMismatchReasons(post, entry)
        const sameScope = currentScope && getPostRecommendationScope(entry) === currentScope
        const isRelevantPillarFallback =
          entry.category === post.category ||
          relatedCategorySlugs.includes(entry.category) ||
          getTagOverlapCount(post, entry) > 0 ||
          Boolean(sameScope)

        if (!isRelevantPillarFallback || reasons.includes('scope-mismatch') || reasons.includes('category-mismatch')) {
          validationIssues.push({
            currentSlug: post.slug,
            relatedSlug: entry.slug,
            source: 'same-pillar',
            reasons: reasons.length ? reasons : ['category-mismatch'],
          })
          return false
        }

        if (!currentPostIsIndiaSpecific && isIndiaSpecificPost(entry) && !sameScope) {
          validationIssues.push({
            currentSlug: post.slug,
            relatedSlug: entry.slug,
            source: 'same-pillar',
            reasons: ['category-mismatch'],
          })
          return false
        }

        if (
          currentComparisonGroup &&
          getPostComparisonGroup(entry) &&
          currentComparisonGroup !== getPostComparisonGroup(entry)
        ) {
          validationIssues.push({
            currentSlug: post.slug,
            relatedSlug: entry.slug,
            source: 'same-pillar',
            reasons,
          })
        }

        return true
      })
    ),
    seen,
    limit
  )

  const authorityPosts = sortByRelevance(
    post,
    uniquePosts([...sameScopePosts, ...sameCategoryPosts, ...overlappingTagPosts, ...samePillarPosts])
  ).slice(0, Math.max(limit * 2, 6))

  const relatedComparisons = sortByRelevance(
    post,
    authorityPosts.filter((entry) => isComparisonPost(entry))
  ).slice(0, 2)

  const primaryPosts = uniquePosts([
    ...sameScopePosts,
    ...sameCategoryPosts,
    ...overlappingTagPosts,
    ...samePillarPosts,
    ...sortByFreshness(authorityPosts.filter((entry) => boostedTargets.has(entry.slug))),
  ]).slice(0, limit)

  logRecommendationValidationIssues(post, validationIssues)

  return {
    sameScopePosts,
    sameCategoryPosts,
    overlappingTagPosts,
    samePillarPosts,
    primaryPosts,
    authorityPosts,
    relatedComparisons,
    validationIssues,
  }
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getPostRecommendationSections(post, getAllPosts(), { limit }).primaryPosts
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.map((post) => post.category))]
}
