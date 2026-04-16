import type { MetadataRoute } from 'next'
import { CATEGORY_META } from './categories'
import { getPillarDefinitions, getPillarPageBySlug, PILLAR_BASE_PATH } from './pillars'
import { getAllPosts, getPostFreshnessDate, isPostNoindex, type Post } from './posts'
import { RESOURCE_HUB_PATH } from './resources'

export type SitemapRouteKind = 'core' | 'hub' | 'community' | 'category' | 'guide' | 'post'

export type ClassifiedSitemapEntry = MetadataRoute.Sitemap[number] & {
  kind: SitemapRouteKind
}

export type SitemapAuditIssue = {
  url: string
  reason: string
}

export type SitemapAuditReport = {
  totalCount: number
  countsByKind: Record<SitemapRouteKind, number>
  includedHubPages: string[]
  excludedRoutes: string[]
  duplicates: string[]
  unexpectedUrls: SitemapAuditIssue[]
  missingExpectedUrls: SitemapAuditIssue[]
  urls: string[]
}

export const SITEMAP_SITE_ORIGIN = 'https://blixamo.com'

const BUILD_LAST_MODIFIED = new Date()
const COMMUNITY_PATH = '/community'
const BLOG_INDEX_PATH = '/blog'
const ABOUT_PATH = '/about'
const SERVICES_PATH = '/services'
const PRODUCTS_PATH = '/products'
const CONTACT_PATH = '/contact'
const HOME_PATH = '/'

const CORE_SITEMAP_PATHS = [HOME_PATH, ABOUT_PATH, BLOG_INDEX_PATH, SERVICES_PATH, PRODUCTS_PATH, CONTACT_PATH] as const
const HUB_SITEMAP_PATHS = [
  RESOURCE_HUB_PATH,
] as const
const COMMUNITY_SITEMAP_PATHS = [COMMUNITY_PATH] as const
const STATIC_SITEMAP_PATHS = [...CORE_SITEMAP_PATHS, ...HUB_SITEMAP_PATHS, ...COMMUNITY_SITEMAP_PATHS] as const

const DISALLOWED_EXACT_PATHS = new Set(['/disclaimer', '/privacy-policy', '/search', '/subscribe', '/terms'])
const DISALLOWED_PREFIXES = ['/api/', '/author/', '/blog/page/', '/feed.xml']

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return ''
  return pathname.replace(/\/+$/, '')
}

export function normalizeSitemapUrl(pathOrUrl: string): string {
  const url = pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')
    ? new URL(pathOrUrl)
    : new URL(pathOrUrl, SITEMAP_SITE_ORIGIN)

  url.hash = ''
  url.search = ''

  return `${SITEMAP_SITE_ORIGIN}${normalizePathname(url.pathname)}`
}

function getNormalizedSitemapPath(url: string): string {
  return normalizePathname(new URL(normalizeSitemapUrl(url)).pathname) || '/'
}

function getLatestDate(posts: readonly Pick<Post, 'updatedAt' | 'date'>[]): Date {
  if (posts.length === 0) return BUILD_LAST_MODIFIED

  return posts.reduce((latestDate, post) => {
    const freshnessDate = getPostFreshnessDate(post)
    return freshnessDate.getTime() > latestDate.getTime() ? freshnessDate : latestDate
  }, getPostFreshnessDate(posts[0]))
}

function getLatestDateForCategory(posts: readonly Post[], category: string): Date {
  const categoryPosts = posts.filter((post) => post.category === category)
  return getLatestDate(categoryPosts)
}

function getLatestDateForGuide(posts: readonly Post[], slug: string): Date {
  const pillar = getPillarPageBySlug(slug, [...posts])

  if (!pillar) return BUILD_LAST_MODIFIED

  const linkedPosts = [
    ...pillar.primaryArticles,
    ...pillar.guides,
    ...pillar.comparisons,
    ...pillar.tools,
    ...pillar.learningPath,
    ...pillar.relatedArticles,
  ].filter((post, index, collection) => collection.findIndex((entry) => entry.slug === post.slug) === index)

  return getLatestDate(linkedPosts)
}

function getDuplicateUrls(entries: readonly ClassifiedSitemapEntry[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const entry of entries) {
    const url = normalizeSitemapUrl(entry.url)
    if (seen.has(url)) {
      duplicates.add(url)
      continue
    }

    seen.add(url)
  }

  return [...duplicates].sort()
}

function dedupeSitemapEntries(entries: readonly ClassifiedSitemapEntry[]): ClassifiedSitemapEntry[] {
  const uniqueEntries = new Map<string, ClassifiedSitemapEntry>()

  for (const entry of entries) {
    const url = normalizeSitemapUrl(entry.url)

    if (!uniqueEntries.has(url)) {
      uniqueEntries.set(url, {
        ...entry,
        url,
      })
    }
  }

  return [...uniqueEntries.values()]
}

function getUnexpectedUrlReason(
  rawUrl: string,
  allowedCategoryPaths: ReadonlySet<string>,
  allowedGuidePaths: ReadonlySet<string>,
  allowedPostPaths: ReadonlySet<string>
): string | null {
  let parsedUrl: URL

  try {
    parsedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? new URL(rawUrl)
      : new URL(rawUrl, SITEMAP_SITE_ORIGIN)
  } catch {
    return 'invalid URL'
  }

  if (parsedUrl.origin !== SITEMAP_SITE_ORIGIN) return 'non-canonical origin'
  if (parsedUrl.search) return 'query URL'
  if (parsedUrl.hash) return 'hash URL'

  const path = normalizePathname(parsedUrl.pathname) || '/'

  if (STATIC_SITEMAP_PATHS.includes(path as (typeof STATIC_SITEMAP_PATHS)[number])) return null
  if (allowedCategoryPaths.has(path)) return null
  if (allowedGuidePaths.has(path)) return null
  if (allowedPostPaths.has(path)) return null
  if (DISALLOWED_EXACT_PATHS.has(path)) return 'disallowed exact route'
  if (path.startsWith('/tag/')) return 'non-hub tag route'

  for (const prefix of DISALLOWED_PREFIXES) {
    if (path.startsWith(prefix)) {
      return `disallowed route group (${prefix})`
    }
  }

  return 'not in explicit sitemap allowlist'
}

export function shouldIncludePostInSitemap(post: Pick<Post, 'slug' | 'noindex' | 'canonical'>): boolean {
  if (!post.slug || isPostNoindex(post)) return false
  if (!post.canonical) return true

  try {
    const canonicalUrl = new URL(post.canonical, SITEMAP_SITE_ORIGIN)
    return canonicalUrl.origin === SITEMAP_SITE_ORIGIN &&
      normalizePathname(canonicalUrl.pathname) === `/blog/${post.slug}` &&
      !canonicalUrl.search &&
      !canonicalUrl.hash
  } catch {
    return false
  }
}

export function getSitemapPosts(posts: readonly Post[] = getAllPosts()): Post[] {
  return posts.filter(shouldIncludePostInSitemap)
}

export function getSitemapCategories(posts: readonly Post[] = getAllPosts()): string[] {
  const usedCategories = new Set(posts.map((post) => post.category))
  return Object.keys(CATEGORY_META).filter((slug) => usedCategories.has(slug))
}

export function getSitemapGuideSlugs(): string[] {
  return getPillarDefinitions().map((pillar) => pillar.slug)
}

function getIncludedHubPages(): string[] {
  return HUB_SITEMAP_PATHS.map((path) => normalizeSitemapUrl(path))
}

function getExcludedRoutes(): string[] {
  return [
    ...[...DISALLOWED_EXACT_PATHS].sort(),
    '/tag/* except /tag/deployment',
    ...DISALLOWED_PREFIXES,
    '/_next/',
    'query URLs',
    'duplicate URLs',
    'redirect URLs',
    'non-canonical URLs',
    'pagination pages',
    'archive pages',
    'internal utility pages',
  ]
}

export function buildSitemapEntriesWithKinds(posts: readonly Post[] = getAllPosts()): ClassifiedSitemapEntry[] {
  const sitemapPosts = getSitemapPosts(posts)
  const categories = getSitemapCategories(posts)

  const rawEntries: ClassifiedSitemapEntry[] = [
    { kind: 'core', url: SITEMAP_SITE_ORIGIN, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'daily', priority: 1.0 },
    { kind: 'core', url: `${SITEMAP_SITE_ORIGIN}${ABOUT_PATH}`, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { kind: 'core', url: `${SITEMAP_SITE_ORIGIN}${BLOG_INDEX_PATH}`, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { kind: 'core', url: `${SITEMAP_SITE_ORIGIN}${SERVICES_PATH}`, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { kind: 'core', url: `${SITEMAP_SITE_ORIGIN}${PRODUCTS_PATH}`, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { kind: 'core', url: `${SITEMAP_SITE_ORIGIN}${CONTACT_PATH}`, lastModified: BUILD_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.4 },
    {
      kind: 'hub',
      url: `${SITEMAP_SITE_ORIGIN}${RESOURCE_HUB_PATH}`,
      lastModified: BUILD_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      kind: 'community',
      url: `${SITEMAP_SITE_ORIGIN}${COMMUNITY_PATH}`,
      lastModified: BUILD_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.6,
    },

    // Indexed category hubs are intentionally limited to canonical category slugs.
    ...categories.map((category) => ({
      kind: 'category' as const,
      url: `${SITEMAP_SITE_ORIGIN}/category/${category}`,
      lastModified: getLatestDateForCategory(posts, category),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // Pillar guides are intentional hub pages, not accidental archive routes.
    ...getSitemapGuideSlugs().map((slug) => ({
      kind: 'guide' as const,
      url: `${SITEMAP_SITE_ORIGIN}${PILLAR_BASE_PATH}/${slug}`,
      lastModified: getLatestDateForGuide(posts, slug),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // Only canonical, indexable article URLs belong here.
    ...sitemapPosts.map((post) => ({
      kind: 'post' as const,
      url: `${SITEMAP_SITE_ORIGIN}/blog/${post.slug}`,
      lastModified: getPostFreshnessDate(post),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.9 : 0.7,
    })),
  ]

  return dedupeSitemapEntries(rawEntries)
}

export function buildSitemapEntries(posts: readonly Post[] = getAllPosts()): MetadataRoute.Sitemap {
  return buildSitemapEntriesWithKinds(posts).map(({ kind, ...entry }) => entry)
}

export function getSitemapAuditReport(posts: readonly Post[] = getAllPosts()): SitemapAuditReport {
  const sitemapPosts = getSitemapPosts(posts)
  const rawEntries = buildSitemapEntriesWithKinds(posts)
  const duplicates = getDuplicateUrls(rawEntries)
  const entries = dedupeSitemapEntries(rawEntries)

  const allowedCategoryPaths = new Set(getSitemapCategories(posts).map((slug) => `/category/${slug}`))
  const allowedGuidePaths = new Set(getSitemapGuideSlugs().map((slug) => `${PILLAR_BASE_PATH}/${slug}`))
  const allowedPostPaths = new Set(sitemapPosts.map((post) => `/blog/${post.slug}`))
  const expectedPaths = new Set<string>([
    ...STATIC_SITEMAP_PATHS,
    ...allowedCategoryPaths,
    ...allowedGuidePaths,
    ...allowedPostPaths,
  ])
  const actualPaths = new Set(entries.map((entry) => getNormalizedSitemapPath(entry.url)))

  const countsByKind: Record<SitemapRouteKind, number> = {
    core: 0,
    hub: 0,
    community: 0,
    category: 0,
    guide: 0,
    post: 0,
  }

  for (const entry of entries) {
    countsByKind[entry.kind] += 1
  }

  const unexpectedUrls = entries
    .map((entry) => {
      const reason = getUnexpectedUrlReason(entry.url, allowedCategoryPaths, allowedGuidePaths, allowedPostPaths)
      return reason ? { url: entry.url, reason } : null
    })
    .filter((issue): issue is SitemapAuditIssue => issue !== null)

  const missingExpectedUrls = [...expectedPaths]
    .filter((path) => !actualPaths.has(path))
    .sort()
    .map((path) => ({
      url: normalizeSitemapUrl(path),
      reason: 'expected route missing from sitemap',
    }))

  return {
    totalCount: entries.length,
    countsByKind,
    includedHubPages: getIncludedHubPages(),
    excludedRoutes: getExcludedRoutes(),
    duplicates,
    unexpectedUrls,
    missingExpectedUrls,
    urls: entries.map((entry) => entry.url),
  }
}
