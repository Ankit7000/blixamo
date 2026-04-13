import { getCategoryMeta } from './categories'
import type { Post } from './posts'

export type HomepageArticle = Pick<
  Post,
  'slug' | 'title' | 'description' | 'category' | 'featuredImage' | 'readingTime' | 'date' | 'updatedAt'
> & {
  categoryLabel: string
}

export type HeroAction = {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export type HeroSection = {
  eyebrow: string
  headline: string
  subhead: string
  proofPoints: string[]
  actions: HeroAction[]
  visual: {
    label: string
    title: string
    description: string
    rows: {
      label: string
      title: string
      copy: string
    }[]
  }
}

export type StartHereItem = {
  title: string
  outcome: string
  href: string
  linkLabel: string
}

export type TopicLane = {
  id: string
  label: string
  routeLabel: string
  description: string
  color: string
  leadArticle: HomepageArticle
  supportArticles: HomepageArticle[]
}

export type LeadStoriesSection = {
  featured: HomepageArticle
  supporting: HomepageArticle[]
}

type TopicLaneDefinition = {
  id: string
  label: string
  routeLabel: string
  description: string
  leadSlug: string
  supportSlugs: [string, string]
}

type HomepageDefinition = {
  hero: HeroSection
  startHere: StartHereItem[]
  lanes: TopicLaneDefinition[]
  leadStories: {
    featuredSlug: string
    supportingSlugs: [string, string, string]
  }
}

export type HomepageContent = {
  hero: HeroSection
  startHere: StartHereItem[]
  lanes: TopicLane[]
  leadStories: LeadStoriesSection
}

const HOMEPAGE_DEFINITION: HomepageDefinition = {
  hero: {
    eyebrow: 'Blixamo Publication',
    headline: 'Practical self-hosting, VPS, and automation guides for developers',
    subhead: 'Real setups, real failures, real fixes  not generic tutorials.',
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
      label: 'Coverage map',
      title: 'A technical publication built around operator problems',
      description:
        'This visual slot stays functional for now. It should explain the editorial surface instead of filling space with random art.',
      rows: [
        {
          label: 'Deploy',
          title: 'VPS, Coolify, Next.js, Nginx',
          copy: 'Blixamo covers how to ship and operate production setups without widening into generic cloud content.',
        },
        {
          label: 'Decide',
          title: 'Tool and platform comparisons',
          copy: 'The strongest reads help you choose between providers, tooling layers, and workflow patterns before you commit.',
        },
        {
          label: 'Improve',
          title: 'Automation and AI workflows',
          copy: 'The workflow lane focuses on systems that reduce repeat work and survive real operating constraints.',
        },
      ],
    },
  },
  startHere: [
    {
      title: 'Deploy on a VPS',
      outcome: 'Start with a practical deploy path for a real app instead of a generic hosting overview.',
      href: '/blog/deploy-nextjs-coolify-hetzner',
      linkLabel: 'Deployment guide',
    },
    {
      title: 'Self-host a stack',
      outcome: 'Use a self-hosting path that covers the app layer, the box, and the parts that usually break later.',
      href: '/blog/self-hosting-n8n-hetzner-vps',
      linkLabel: 'Self-hosting guide',
    },
    {
      title: 'Choose tools or platforms',
      outcome: 'Open a decision page first when the real question is fit, not implementation.',
      href: '/blog/coolify-vs-caprover-2026',
      linkLabel: 'Comparison read',
    },
    {
      title: 'Improve automation or AI workflows',
      outcome: 'Move into workflow automation only after you have one useful system worth operating.',
      href: '/blog/n8n-complete-guide-2026',
      linkLabel: 'Automation guide',
    },
  ],
  lanes: [
    {
      id: 'vps-cloud',
      label: 'VPS & Cloud',
      routeLabel: '/category/vps-cloud',
      description:
        'Provider choices, hardening, recovery, and cost tradeoffs for developers who want a stronger infrastructure base.',
      leadSlug: 'vps-security-harden-ubuntu-2026',
      supportSlugs: ['hetzner-vs-aws-lightsail-2026', 'compromised-vps-recovery-2026'],
    },
    {
      id: 'self-hosting',
      label: 'Self Hosting',
      routeLabel: '/category/self-hosting',
      description:
        'Self-hosted services, practical stack planning, and the operator work required to keep your own infrastructure reliable.',
      leadSlug: 'self-hosting-resources',
      supportSlugs: ['self-host-plausible-analytics-2026', 'self-healing-vps-monitor-nodejs'],
    },
    {
      id: 'coolify',
      label: 'Coolify',
      routeLabel: '/coolify-hub',
      description:
        'The Coolify lane is for developers deciding whether a platform layer helps, how to deploy with it, and how to keep the VPS layout sane.',
      leadSlug: 'coolify-complete-guide-2026',
      supportSlugs: ['deploy-nextjs-coolify-hetzner', 'fix-coolify-deploy-failures-nextjs-2026'],
    },
    {
      id: 'nextjs-mdx',
      label: 'Next.js MDX',
      routeLabel: '/nextjs-mdx-hub',
      description:
        'File-backed content infrastructure, production publishing, and the runtime fixes needed when a Next.js MDX setup stops acting simple.',
      leadSlug: 'nextjs-mdx-blog-2026',
      supportSlugs: ['nextjs-mdx-blog-syntax-highlighting-rss-sitemap-seo', 'nextjs-mdx-remote-rsc-edge-runtime-fix'],
    },
    {
      id: 'automation',
      label: 'Automation',
      routeLabel: '/category/automation',
      description:
        'n8n, workflow architecture, retries, observability, and the practical decisions that turn automation into something you can trust.',
      leadSlug: 'n8n-complete-guide-2026',
      supportSlugs: ['n8n-fastapi-hetzner-vps', 'debug-slow-fragile-n8n-workflows-2026'],
    },
    {
      id: 'ai-workflows',
      label: 'AI Workflows',
      routeLabel: '/category/ai',
      description:
        'Model choice, structured output, human review, and AI-assisted systems that help developers ship faster without losing control.',
      leadSlug: 'claude-ai-guide',
      supportSlugs: ['claude-api-content-automation-nodejs', 'validate-ai-json-output-2026'],
    },
  ],
  leadStories: {
    featuredSlug: 'hetzner-payment-methods-2026',
    supportingSlugs: [
      'nextjs-mdx-blog-2026',
      'deploy-nextjs-coolify-hetzner',
      'vps-security-harden-ubuntu-2026',
    ],
  },
}

function toHomepageArticle(post: Post): HomepageArticle {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    categoryLabel: getCategoryMeta(post.category).label,
    featuredImage: post.featuredImage,
    readingTime: post.readingTime,
    date: post.date,
    updatedAt: post.updatedAt,
  }
}

function requirePost(postsBySlug: Map<string, Post>, slug: string): Post {
  const post = postsBySlug.get(slug)

  if (!post) {
    throw new Error(`Homepage curation references missing post: ${slug}`)
  }

  return post
}

export function getHomepageContent(posts: Post[]): HomepageContent {
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]))

  return {
    hero: HOMEPAGE_DEFINITION.hero,
    startHere: HOMEPAGE_DEFINITION.startHere,
    lanes: HOMEPAGE_DEFINITION.lanes.map((lane) => ({
      id: lane.id,
      label: lane.label,
      routeLabel: lane.routeLabel,
      description: lane.description,
      color: getCategoryMeta(requirePost(postsBySlug, lane.leadSlug).category).color,
      leadArticle: toHomepageArticle(requirePost(postsBySlug, lane.leadSlug)),
      supportArticles: lane.supportSlugs.map((slug) => toHomepageArticle(requirePost(postsBySlug, slug))),
    })),
    leadStories: {
      featured: toHomepageArticle(requirePost(postsBySlug, HOMEPAGE_DEFINITION.leadStories.featuredSlug)),
      supporting: HOMEPAGE_DEFINITION.leadStories.supportingSlugs.map((slug) =>
        toHomepageArticle(requirePost(postsBySlug, slug))
      ),
    },
  }
}
