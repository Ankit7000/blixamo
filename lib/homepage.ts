import { getCategoryMeta } from './categories'
import type { Post } from './posts'

const RESOURCE_HUB_PATH = '/tag/deployment'

type HomepageAction = {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

type HomepageLink = {
  label: string
  href: string
}

type CuratedSlugEntry = {
  slug: string
  eyebrow?: string
}

type SectionIntro = {
  kicker: string
  title: string
  description: string
  link?: HomepageLink
}

export type HomepageArticle = {
  slug: string
  title: string
  description: string
  category: string
  categoryLabel: string
  categoryColor: string
  featuredImage: string
  readingTime: string
  publishedAt: string
  freshnessLabel: string
  eyebrow?: string
}

export type HeroRouteCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

export type HeroSection = {
  eyebrow: string
  headline: string
  subhead: string
  proofPoints: string[]
  actions: HomepageAction[]
  visual: {
    label: string
    title: string
    description: string
  }
  routeCards: HeroRouteCard[]
}

export type StartHereItem = {
  title: string
  description: string
  primaryLink: HomepageLink
  secondaryLink?: HomepageLink
}

export type StartHereSection = SectionIntro & {
  items: StartHereItem[]
}

export type TopicLane = {
  id: string
  label: string
  description: string
  color: string
  articleCountLabel?: string
  categoryLink: HomepageLink
  featuredArticle: HomepageArticle
}

export type TopicLanesSection = SectionIntro & {
  lanes: TopicLane[]
}

export type FeaturedNowSection = SectionIntro & {
  lead: HomepageArticle
  secondary: HomepageArticle[]
  recentlyUpdatedTitle: string
  recentlyUpdated: HomepageArticle[]
}

export type PillarGuide = {
  title: string
  summary: string
  href: string
  bestFor?: string
}

export type PillarGuidesSection = SectionIntro & {
  guides: PillarGuide[]
}

export type CuratedPath = {
  title: string
  summary: string
  href: string
  stepCount: string
  bestFor?: string
}

export type CuratedPathsSection = SectionIntro & {
  paths: CuratedPath[]
}

export type TrustPoint = {
  title: string
  description: string
}

export type TrustSection = SectionIntro & {
  points: TrustPoint[]
  actions: HomepageLink[]
}

export type HomepageContent = {
  hero: HeroSection
  featuredNow: FeaturedNowSection
  startHere: StartHereSection
  topicLanes: TopicLanesSection
  pillarGuides: PillarGuidesSection
  curatedPaths: CuratedPathsSection
  trust: TrustSection
}

const HERO: HeroSection = {
  eyebrow: 'Blixamo Publication',
  headline: 'Practical self-hosting, VPS, and automation guides for developers',
  subhead: 'Real setups, real failures, real fixes. Not generic tutorials.',
  proofPoints: [
    'Deploy apps on VPS',
    'Fix production issues',
    'Choose tools with practical comparisons',
  ],
  actions: [
    { label: 'Start here', href: '#start-here', variant: 'primary' },
    { label: 'Browse topic lanes', href: '#topic-lanes', variant: 'secondary' },
  ],
  visual: {
    label: 'Front Page',
    title: 'Start with the lane that matches the problem in front of you',
    description: 'These three routes cover the highest-intent jobs readers come to Blixamo to solve first.',
  },
  routeCards: [
    {
      eyebrow: 'Self-Hosting',
      title: 'Run your own stack without turning one VPS into a mess',
      description: 'Coolify, n8n, analytics, and practical self-hosting decisions that stay operable.',
      href: '/category/self-hosting',
    },
    {
      eyebrow: 'VPS & Cloud',
      title: 'Choose infrastructure and ship on it with fewer wrong turns',
      description: 'Provider comparisons, hardening guides, deploy routes, and recovery-minded setup work.',
      href: '/category/vps-cloud',
    },
    {
      eyebrow: 'Automation',
      title: 'Reduce repetitive work with workflows that hold up in production',
      description: 'n8n, AI-assisted workflows, and operator-friendly automation patterns for developers.',
      href: '/category/automation',
    },
  ],
}

const FEATURED_NOW: Omit<FeaturedNowSection, 'lead' | 'secondary' | 'recentlyUpdated'> & {
  lead: CuratedSlugEntry
  secondary: CuratedSlugEntry[]
  recentlyUpdated: CuratedSlugEntry[]
} = {
  kicker: 'Featured Now',
  title: 'Editorial picks worth opening first',
  description:
    'A tight front-page mix of one lead feature, two strong follow-up reads, and recently updated pages worth reopening.',
  lead: {
    slug: 'hetzner-payment-methods-2026',
    eyebrow: 'Lead feature',
  },
  secondary: [
    {
      slug: 'nextjs-mdx-blog-2026',
      eyebrow: 'Publishing systems',
    },
    {
      slug: 'deploy-nextjs-coolify-hetzner',
      eyebrow: 'Deployment guide',
    },
  ],
  recentlyUpdatedTitle: 'Recently Updated',
  recentlyUpdated: [
    {
      slug: 'vps-security-harden-ubuntu-2026',
      eyebrow: 'Security',
    },
    {
      slug: 'fix-coolify-deploy-failures-nextjs-2026',
      eyebrow: 'Troubleshooting',
    },
    {
      slug: 'debug-slow-fragile-n8n-workflows-2026',
      eyebrow: 'Automation',
    },
    {
      slug: 'validate-ai-json-output-2026',
      eyebrow: 'AI workflows',
    },
  ],
}

const START_HERE: StartHereSection = {
  kicker: 'Start Here by Goal',
  title: 'Choose the shortest route into the job you are trying to finish',
  description:
    'Start with the operational goal, then move into the guide, comparison, or lane that reduces guesswork fastest.',
  items: [
    {
      title: 'I want to deploy apps on a VPS',
      description:
        'Go from server setup and deploy flow into a production-ready app route without browsing the full archive.',
      primaryLink: {
        label: 'Open the VPS deploy guide',
        href: '/guides/deploy-apps-on-vps-complete-guide',
      },
      secondaryLink: {
        label: 'See a Next.js deploy example',
        href: '/blog/deploy-nextjs-coolify-hetzner',
      },
    },
    {
      title: 'I want to self-host my stack',
      description:
        'Use the self-hosting route if the question is what to run yourself, what to delay, and how to keep it stable.',
      primaryLink: {
        label: 'Open the self-hosting guide',
        href: '/guides/self-hosting-complete-guide',
      },
      secondaryLink: {
        label: 'Start with self-hosting resources',
        href: '/blog/self-hosting-resources',
      },
    },
    {
      title: 'I want practical tool comparisons',
      description:
        'Take the comparison route when a hosting, platform, or workflow choice is actively blocking the next step.',
      primaryLink: {
        label: 'Browse comparison routes',
        href: '/guides/comparisons-hub',
      },
      secondaryLink: {
        label: 'Start with Coolify vs CapRover',
        href: '/blog/coolify-vs-caprover-2026',
      },
    },
    {
      title: 'I want free tools and lean workflows',
      description:
        'Open the budget-first route for free tools, smaller stacks, and practical developer workflows that stay useful.',
      primaryLink: {
        label: 'Open the free tools guide',
        href: '/guides/free-tools-for-developers',
      },
      secondaryLink: {
        label: 'See a practical free-tool stack',
        href: '/blog/practical-free-developer-tool-stack-2026',
      },
    },
  ],
}

const TOPIC_LANES: Omit<TopicLanesSection, 'lanes'> & {
  lanes: Array<{
    id: string
    label: string
    description: string
    categoryLink: HomepageLink
    articleCountLabel?: string
    featuredArticle: CuratedSlugEntry
  }>
} = {
  kicker: 'Topic Lanes',
  title: 'Read the publication by lane, not by archive date',
  description: 'Each lane highlights one defining page, then routes outward into the matching category or guide path.',
  lanes: [
    {
      id: 'vps-cloud',
      label: 'VPS & Cloud',
      description: 'Provider choices, security, cost decisions, and real-world hosting tradeoffs.',
      articleCountLabel: '9 key reads',
      categoryLink: { label: 'Browse VPS & Cloud', href: '/category/vps-cloud' },
      featuredArticle: { slug: 'vps-security-harden-ubuntu-2026', eyebrow: 'Featured in lane' },
    },
    {
      id: 'self-hosting',
      label: 'Self Hosting',
      description: 'Operator-minded guides for running useful services without overbuilding the stack.',
      articleCountLabel: '6 key reads',
      categoryLink: { label: 'Browse Self-Hosting', href: '/category/self-hosting' },
      featuredArticle: { slug: 'self-hosting-resources', eyebrow: 'Featured in lane' },
    },
    {
      id: 'coolify',
      label: 'Coolify',
      description: 'Deployment paths, platform fit, and troubleshooting for self-hosted app shipping.',
      articleCountLabel: '4 key reads',
      categoryLink: { label: 'Open the Coolify hub', href: '/coolify-hub' },
      featuredArticle: { slug: 'coolify-complete-guide-2026', eyebrow: 'Featured in lane' },
    },
    {
      id: 'nextjs-mdx',
      label: 'Next.js MDX',
      description: 'Practical publishing infrastructure for MDX, SEO, edge/runtime issues, and content systems.',
      articleCountLabel: '4 key reads',
      categoryLink: { label: 'Browse Web Development', href: '/category/web-dev' },
      featuredArticle: { slug: 'nextjs-mdx-blog-2026', eyebrow: 'Featured in lane' },
    },
    {
      id: 'automation',
      label: 'Automation',
      description: 'n8n workflows, reliability fixes, and automation paths that remove real manual work.',
      articleCountLabel: '6 key reads',
      categoryLink: { label: 'Browse Automation', href: '/category/automation' },
      featuredArticle: { slug: 'n8n-complete-guide-2026', eyebrow: 'Featured in lane' },
    },
    {
      id: 'ai-workflows',
      label: 'AI Workflows',
      description: 'Claude-based workflow patterns, AI-assisted operations, and practical developer usage.',
      articleCountLabel: '4 key reads',
      categoryLink: { label: 'Browse AI Developers', href: '/category/ai' },
      featuredArticle: { slug: 'claude-ai-guide', eyebrow: 'Featured in lane' },
    },
  ],
}

const PILLAR_GUIDES: PillarGuidesSection = {
  kicker: 'Pillar Guides',
  title: 'Guide routes that orient the rest of the publication',
  description:
    'These are the strongest guide-level entry points when you need a broader route before choosing individual posts.',
  link: {
    label: 'View all guide routes',
    href: `${RESOURCE_HUB_PATH}#authority-pages`,
  },
  guides: [
    {
      title: 'Deploy Apps on VPS Complete Guide',
      summary: 'The cleanest route from server choice to deployment workflow, reverse proxy, and production checks.',
      href: '/guides/deploy-apps-on-vps-complete-guide',
      bestFor: 'Best for shipping apps on your own server without improvising the stack',
    },
    {
      title: 'Self Hosting Complete Guide',
      summary: 'Use this route when you want to self-host apps, automation, or analytics without letting the stack sprawl.',
      href: '/guides/self-hosting-complete-guide',
      bestFor: 'Best for operators deciding what to run themselves and what to keep lean',
    },
    {
      title: 'VPS & Cloud for Developers Guide',
      summary: 'A practical route through provider choice, hardening, cost tradeoffs, and infrastructure fit.',
      href: '/guides/vps-cloud-for-developers-guide',
      bestFor: 'Best for readers choosing infrastructure before they choose platforms',
    },
    {
      title: 'Automation Guide for Developers',
      summary: 'Start here for n8n, workflow design, and automation paths that support real engineering work.',
      href: '/guides/automation-guide-for-developers',
      bestFor: 'Best for cutting manual operations and repetitive developer tasks',
    },
  ],
}

const CURATED_PATHS: CuratedPathsSection = {
  kicker: 'Curated Paths',
  title: 'Three front-page routes into the strongest clusters',
  description: 'Short, opinionated paths for readers who want sequencing, not just a list of links.',
  link: {
    label: 'View all paths',
    href: `${RESOURCE_HUB_PATH}#learning-paths`,
  },
  paths: [
    {
      title: 'Deploy your first production app on a VPS',
      summary: 'Follow the shortest path from VPS setup into a real deploy workflow with fewer structural detours.',
      href: '/guides/deploy-apps-on-vps-complete-guide',
      stepCount: '4-step route',
      bestFor: 'Best for developers moving off managed app hosting or shipping on raw VPS for the first time',
    },
    {
      title: 'Self-host the right services first',
      summary: 'Use this path to choose a sane first self-hosted stack before you add platforms, sidecars, and complexity.',
      href: '/guides/self-hosting-complete-guide',
      stepCount: '4-step route',
      bestFor: 'Best for Coolify, n8n, analytics, and lean self-hosted setups',
    },
    {
      title: 'Keep the stack lean with free tools and practical workflows',
      summary: 'Budget-first route through free tools, comparisons, and workflow choices that still hold up in real use.',
      href: '/guides/free-tools-for-developers',
      stepCount: '3-step route',
      bestFor: 'Best for solo developers reducing tool spend without degrading the workflow',
    },
  ],
}

const TRUST: TrustSection = {
  kicker: 'Why Blixamo',
  title: 'This publication exists for developers who need practical answers, not filler content',
  description:
    'Blixamo is built around operator problems: shipping on VPS, self-hosting the right pieces, comparing tools clearly, and fixing technical issues when the fast path stops working.',
  points: [
    {
      title: 'Operator-led coverage',
      description:
        'The focus is real infrastructure, deploy flow, and workflow decisions that developers actually carry in production.',
    },
    {
      title: 'Practical technical comparisons',
      description:
        'Comparisons exist to help take a decision and move into implementation, not to create endless shortlist browsing.',
    },
    {
      title: 'Guides, fixes, and workflows',
      description: 'The site is organized around guides, troubleshooting, practical setups, and reusable workflow routes.',
    },
    {
      title: 'Supporting actions, not the homepage mission',
      description:
        'Services, products, community, and subscribe exist to support readers who want more, not to turn the homepage into a sales page.',
    },
  ],
  actions: [
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Community', href: '/community' },
    { label: 'Subscribe', href: '/subscribe' },
  ],
}

function getFreshnessLabel(post: Pick<Post, 'updatedAt' | 'date'>): string {
  const value = post.updatedAt || post.date
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function toHomepageArticle(post: Post, eyebrow?: string): HomepageArticle {
  const category = getCategoryMeta(post.category)

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    categoryLabel: category.label,
    categoryColor: category.color,
    featuredImage: post.featuredImage,
    readingTime: post.readingTime,
    publishedAt: post.updatedAt || post.date,
    freshnessLabel: getFreshnessLabel(post),
    eyebrow,
  }
}

function requirePost(postMap: Map<string, Post>, slug: string): Post {
  const post = postMap.get(slug)

  if (!post) {
    throw new Error(`Missing homepage article for slug "${slug}"`)
  }

  return post
}

function resolveArticle(postMap: Map<string, Post>, entry: CuratedSlugEntry): HomepageArticle {
  return toHomepageArticle(requirePost(postMap, entry.slug), entry.eyebrow)
}

export function getHomepageContent(posts: Post[]): HomepageContent {
  const postMap = new Map(posts.map((post) => [post.slug, post]))

  return {
    hero: HERO,
    featuredNow: {
      kicker: FEATURED_NOW.kicker,
      title: FEATURED_NOW.title,
      description: FEATURED_NOW.description,
      recentlyUpdatedTitle: FEATURED_NOW.recentlyUpdatedTitle,
      lead: resolveArticle(postMap, FEATURED_NOW.lead),
      secondary: FEATURED_NOW.secondary.map((entry) => resolveArticle(postMap, entry)),
      recentlyUpdated: FEATURED_NOW.recentlyUpdated.map((entry) => resolveArticle(postMap, entry)),
    },
    startHere: START_HERE,
    topicLanes: {
      kicker: TOPIC_LANES.kicker,
      title: TOPIC_LANES.title,
      description: TOPIC_LANES.description,
      lanes: TOPIC_LANES.lanes.map((lane) => ({
        id: lane.id,
        label: lane.label,
        description: lane.description,
        color: getCategoryMeta(
          lane.featuredArticle.slug === 'claude-ai-guide' ? 'ai' : requirePost(postMap, lane.featuredArticle.slug).category
        ).color,
        articleCountLabel: lane.articleCountLabel,
        categoryLink: lane.categoryLink,
        featuredArticle: resolveArticle(postMap, lane.featuredArticle),
      })),
    },
    pillarGuides: PILLAR_GUIDES,
    curatedPaths: CURATED_PATHS,
    trust: TRUST,
  }
}
