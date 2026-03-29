import { CATEGORY_META, getCategoryMeta } from './categories'
import { getAllPillarPages, getPillarsForCategory, type PillarPage } from './pillars'
import type { Post } from './posts'

export const RESOURCE_HUB_TAG = 'deployment'
export const RESOURCE_HUB_PATH = `/tag/${RESOURCE_HUB_TAG}`

type CuratedCard = {
  title: string
  description: string
  href: string
  eyebrow?: string
  icon?: string
  accentColor?: string
  stat?: string
}

type LearningPathDefinition = {
  id: string
  title: string
  description: string
  href: string
  slugs: string[]
}

type StackDefinition = {
  title: string
  description: string
  href: string
  items: { label: string; href: string }[]
}

export type LearningPath = LearningPathDefinition & {
  steps: Post[]
}

export type StackBlueprint = StackDefinition

export type RelatedCategoryLink = {
  slug: string
  href: string
  label: string
  description: string
  icon: string
  color: string
}

export type HubSectionLink = {
  id: string
  title: string
  href: string
}

export type CategoryClusterContent = {
  hubSection: HubSectionLink
  pillarPages: PillarPage[]
  guides: Post[]
  comparisons: Post[]
  tools: Post[]
}

type MissionPoint = {
  title: string
  description: string
}

type CategoryClusterDefinition = {
  hubSection: HubSectionLink
  guideSlugs: readonly string[]
  comparisonSlugs: readonly string[]
  toolSlugs: readonly string[]
}

type AuthorityPageDefinition = {
  id: string
  title: string
  description: string
  slug: string
  categories: readonly string[]
  cluster: string
  hubSectionKey: string
}

export type AuthorityPage = Omit<AuthorityPageDefinition, 'slug' | 'hubSectionKey'> & {
  href: string
  hubSection: HubSectionLink
  post: Post
}

const START_HERE_SLUGS = [
  'vps-setup-guide',
  'deploy-nextjs-coolify-hetzner',
  'how-to-self-host-nextjs-on-vps',
  'self-hosting-n8n-hetzner-vps',
  'coolify-complete-guide-2026',
  'build-saas-mvp-zero-budget-2026',
] as const

const POPULAR_GUIDE_SLUGS = [
  'deploy-nextjs-coolify-hetzner',
  'vps-security-harden-ubuntu-2026',
  'self-hosting-n8n-hetzner-vps',
  'n8n-complete-guide-2026',
  'google-search-console-self-hosted-nextjs',
  'coolify-complete-guide-2026',
  'tailwind-css-tips',
  'nextjs-mdx-remote-rsc-edge-runtime-fix',
  'ubuntu-vps-hardening-checklist',
  'n8n-fastapi-hetzner-vps',
] as const

const COMPARISON_SLUGS = [
  'coolify-vs-caprover-2026',
  'n8n-vs-make-vs-zapier-indie-dev',
  'hetzner-vs-digitalocean-vs-vultr-india',
  'hetzner-vs-aws-2026',
  'hetzner-vs-aws-lightsail-2026',
  'hetzner-vs-vultr-vs-linode-2026',
  'oracle-cloud-free-vs-hetzner-2026',
  'claude-api-vs-openai-gpt4-2026',
  'claude-vs-chatgpt-developers',
  'wise-vs-payoneer-india-freelancer',
  'tailwind-css-vs-css-modules',
] as const

const FREE_TOOL_SLUGS = [
  'best-free-developer-tools-2026',
  'best-postgresql-gui-free',
  'free-vps-hosting-2026',
  'best-ai-tools-2026',
  'free-tools-indian-indie-developer',
  'open-source-tools-2026',
] as const

const DEPLOYMENT_GUIDE_SLUGS = [
  'vps-setup-guide',
  'deploy-nextjs-coolify-hetzner',
  'how-to-self-host-nextjs-on-vps',
  'docker-compose-production-vps-2026',
  'nginx-reverse-proxy-guide-2026',
  'google-search-console-self-hosted-nextjs',
] as const

const VPS_CLOUD_SLUGS = [
  'free-vps-hosting-2026',
  'hetzner-vs-digitalocean-vs-vultr-india',
  'hetzner-vs-aws-lightsail-2026',
  'hetzner-vs-vultr-vs-linode-2026',
  'hetzner-vs-aws-2026',
  'ssh-security-hardening-vps-2026',
  'vps-security-harden-ubuntu-2026',
  'ubuntu-vps-hardening-checklist',
  'compromised-vps-recovery-2026',
] as const

const SELF_HOSTING_SLUGS = [
  'coolify-complete-guide-2026',
  'self-hosting-n8n-hetzner-vps',
  'self-host-plausible-analytics-2026',
  'self-healing-vps-monitor-nodejs',
  'self-hosting-resources',
  'vps-setup-guide',
] as const

const AUTOMATION_SLUGS = [
  'n8n-complete-guide-2026',
  'n8n-vs-make-vs-zapier-indie-dev',
  'claude-api-content-automation-nodejs',
  'n8n-fastapi-hetzner-vps',
  'build-telegram-bot-claude-api-python',
  'whatsapp-ai-assistant-n8n-claude-api',
] as const

const AI_TOOL_SLUGS = [
  'best-ai-tools-2026',
  'claude-ai-guide',
  'claude-api-vs-openai-gpt4-2026',
  'claude-api-vs-openai-cost-india',
  'claude-vs-chatgpt-developers',
  'whatsapp-ai-assistant-n8n-claude-api',
] as const

const DEVELOPER_TOOL_SLUGS = [
  'best-free-developer-tools-2026',
  'best-postgresql-gui-free',
  'best-vpn-for-developers-2026',
  'coolify-vs-caprover-2026',
  'tailwind-css-vs-css-modules',
  'claude-vs-chatgpt-developers',
] as const

const POSTGRESQL_TOOL_SLUGS = [
  'best-postgresql-gui-free',
  'best-free-developer-tools-2026',
  'open-source-tools-2026',
  'coolify-complete-guide-2026',
] as const

const WEB_DEVELOPMENT_SLUGS = [
  'nextjs-mdx-blog-2026',
  'nextjs-performance-optimization-2026',
  'tailwind-css-vs-css-modules',
  'nextjs-mdx-remote-rsc-edge-runtime-fix',
  'getting-started-with-nextjs',
  'tailwind-css-tips',
] as const

const INDIE_DEV_SAAS_SLUGS = [
  'build-saas-mvp-zero-budget-2026',
  'free-tools-indian-indie-developer',
  'razorpay-integration-nextjs-india',
  'wise-vs-payoneer-india-freelancer',
  'indian-debit-cards-dev-tools',
  'oracle-cloud-free-vs-hetzner-2026',
] as const

const POPULAR_ARTICLE_SLUGS = [
  'deploy-nextjs-coolify-hetzner',
  'best-ai-tools-2026',
  'vps-security-harden-ubuntu-2026',
  'self-hosting-n8n-hetzner-vps',
  'build-saas-mvp-zero-budget-2026',
  'coolify-vs-caprover-2026',
] as const

const RECOMMENDED_READING_SLUGS = [
  'self-hosting-resources',
  'nextjs-mdx-blog-2026',
  'nextjs-mdx-remote-rsc-edge-runtime-fix',
  'nextjs-performance-optimization-2026',
  'getting-started-with-nextjs',
  'tailwind-css-tips',
  'google-search-console-self-hosted-nextjs',
  'open-source-tools-2026',
] as const

const LEARNING_PATHS: LearningPathDefinition[] = [
  {
    id: 'deploy-apps',
    title: 'VPS & Cloud Path',
    description: 'Go from provider choice and server setup into a live app with repeatable deploy and reverse proxy steps.',
    href: `${RESOURCE_HUB_PATH}#deployment-guides`,
    slugs: [
      'vps-setup-guide',
      'deploy-nextjs-coolify-hetzner',
      'nginx-reverse-proxy-guide-2026',
      'google-search-console-self-hosted-nextjs',
    ],
  },
  {
    id: 'self-host-services',
    title: 'Self Hosting Path',
    description: 'Build a lean self-hosted stack for apps, services, analytics, and automation without making it fragile.',
    href: `${RESOURCE_HUB_PATH}#self-hosting`,
    slugs: [
      'coolify-complete-guide-2026',
      'self-hosting-n8n-hetzner-vps',
      'self-host-plausible-analytics-2026',
      'self-healing-vps-monitor-nodejs',
    ],
  },
  {
    id: 'choose-vps',
    title: 'Infrastructure Path',
    description: 'Compare VPS providers, understand the tradeoffs, and harden the box you choose.',
    href: `${RESOURCE_HUB_PATH}#vps-cloud`,
    slugs: [
      'free-vps-hosting-2026',
      'hetzner-vs-aws-lightsail-2026',
      'hetzner-vs-digitalocean-vs-vultr-india',
      'vps-security-harden-ubuntu-2026',
    ],
  },
  {
    id: 'automation-workflows',
    title: 'Automation Path',
    description: 'Start with n8n basics, compare the tooling, then layer AI-assisted workflows on top.',
    href: `${RESOURCE_HUB_PATH}#automation`,
    slugs: [
      'n8n-complete-guide-2026',
      'n8n-vs-make-vs-zapier-indie-dev',
      'claude-api-content-automation-nodejs',
      'whatsapp-ai-assistant-n8n-claude-api',
    ],
  },
  {
    id: 'better-dev-tools',
    title: 'Developer Tools Path',
    description: 'Use these picks and comparisons to improve database, AI, tooling, and daily workflow decisions.',
    href: `${RESOURCE_HUB_PATH}#developer-tools`,
    slugs: [
      'best-free-developer-tools-2026',
      'best-postgresql-gui-free',
      'best-ai-tools-2026',
      'best-vpn-for-developers-2026',
    ],
  },
  {
    id: 'low-cost-saas',
    title: 'Indie Hacker Path',
    description: 'Use this route if you want a low-cost but production-usable SaaS stack with monetization, tooling, and infrastructure you control.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    slugs: [
      'build-saas-mvp-zero-budget-2026',
      'coolify-complete-guide-2026',
      'deploy-nextjs-coolify-hetzner',
      'free-tools-indian-indie-developer',
    ],
  },
  {
    id: 'free-dev-tools',
    title: 'If you want free developer tools',
    description: 'Start with the strongest free-tool roundups, then move into open source replacements and budget stack picks.',
    href: `${RESOURCE_HUB_PATH}#resources-free-tools`,
    slugs: [
      'best-free-developer-tools-2026',
      'best-postgresql-gui-free',
      'open-source-tools-2026',
      'free-tools-indian-indie-developer',
    ],
  },
] as const

const STACK_BLUEPRINTS: StackDefinition[] = [
  {
    title: 'VPS + Coolify + PostgreSQL + Next.js',
    description: 'A simple app hosting stack for developers who want control, clean deploys, and a low monthly bill.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    items: [
      { label: 'VPS setup', href: '/blog/vps-setup-guide' },
      { label: 'Coolify guide', href: '/blog/coolify-complete-guide-2026' },
      { label: 'PostgreSQL GUI', href: '/blog/best-postgresql-gui-free' },
      { label: 'Deploy Next.js', href: '/blog/deploy-nextjs-coolify-hetzner' },
    ],
  },
  {
    title: 'Low-cost SaaS MVP stack',
    description: 'For indie builders who need authentication, deploys, billing, automation, and useful tooling without a large SaaS bill.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    items: [
      { label: 'MVP stack plan', href: '/blog/build-saas-mvp-zero-budget-2026' },
      { label: 'Budget tools', href: '/blog/free-tools-indian-indie-developer' },
      { label: 'Razorpay setup', href: '/blog/razorpay-integration-nextjs-india' },
      { label: 'AI tools', href: '/blog/best-ai-tools-2026' },
    ],
  },
  {
    title: 'Self-hosted dev workflow stack',
    description: 'Use this stack if you want deploys, analytics, automations, and basic recovery without relying on too many hosted services.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    items: [
      { label: 'Self-hosting hub', href: '/blog/self-hosting-resources' },
      { label: 'n8n on VPS', href: '/blog/self-hosting-n8n-hetzner-vps' },
      { label: 'Plausible setup', href: '/blog/self-host-plausible-analytics-2026' },
      { label: 'Self-healing monitor', href: '/blog/self-healing-vps-monitor-nodejs' },
    ],
  },
  {
    title: 'AI-assisted dev stack',
    description: 'A practical mix of AI tooling, automation, and messaging workflows for developers who want faster execution.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    items: [
      { label: 'Claude guide', href: '/blog/claude-ai-guide' },
      { label: 'AI tools list', href: '/blog/best-ai-tools-2026' },
      { label: 'Node automation', href: '/blog/claude-api-content-automation-nodejs' },
      { label: 'WhatsApp assistant', href: '/blog/whatsapp-ai-assistant-n8n-claude-api' },
    ],
  },
] as const

const CATEGORY_DISCOVERY_CARDS: CuratedCard[] = [
  {
    title: 'VPS & Cloud',
    description: 'VPS providers, cloud hosting, server setup, deployment, performance, and infrastructure.',
    href: '/category/vps-cloud',
    icon: '☁',
    accentColor: CATEGORY_META['vps-cloud'].color,
  },
  {
    title: 'Self Hosting',
    description: 'Self-hosting apps, services, analytics, automation tools, and open-source software on your own server.',
    href: '/category/self-hosting',
    icon: '▣',
    accentColor: CATEGORY_META['self-hosting'].color,
  },
  {
    title: 'AI & Automation',
    description: 'AI tools, automation workflows, APIs, AI integrations, and building AI-powered applications.',
    href: '/category/ai',
    icon: '✦',
    accentColor: CATEGORY_META.ai.color,
  },
  {
    title: 'How To',
    description: 'Step-by-step tutorials, guides, setup instructions, and troubleshooting.',
    href: '/category/how-to',
    icon: 'CLI',
    accentColor: CATEGORY_META['how-to'].color,
  },
  {
    title: 'Web Development',
    description: 'Next.js, Node.js, frontend, backend, performance optimization, deployment, and web app development.',
    href: '/category/web-dev',
    icon: '</>',
    accentColor: CATEGORY_META['web-dev'].color,
  },
  {
    title: 'Automation',
    description: 'Workflow automation, n8n, scripting, integrations, cron jobs, and automation systems.',
    href: '/category/automation',
    icon: '↻',
    accentColor: CATEGORY_META.automation.color,
  },
  {
    title: 'Indie Hacking',
    description: 'SaaS ideas, MVP building, monetization, payment gateways, growth strategies, and startup tools.',
    href: '/category/indie-hacking',
    icon: '↗',
    accentColor: CATEGORY_META['indie-hacking'].color,
  },
  {
    title: 'Developer Tools',
    description: 'Databases, APIs, automation tools, productivity tools, and development software.',
    href: '/category/developer-tools',
    icon: '⚙',
    accentColor: CATEGORY_META['developer-tools'].color,
  },
  {
    title: 'Free Tools',
    description: 'Free hosting, free software, open-source tools, and free developer resources.',
    href: '/category/free-tools',
    icon: '◎',
    accentColor: CATEGORY_META['free-tools'].color,
  },
] as const

const COVERAGE_CARDS: CuratedCard[] = [
  {
    title: 'VPS & Cloud',
    description: 'Provider comparisons, hardening guides, and hosting cost decisions.',
    href: '/category/vps-cloud',
    icon: CATEGORY_META['vps-cloud'].icon,
    accentColor: CATEGORY_META['vps-cloud'].color,
  },
  {
    title: 'Self Hosting',
    description: 'Lean infrastructure guides for running your own services well.',
    href: '/category/self-hosting',
    icon: CATEGORY_META['self-hosting'].icon,
    accentColor: CATEGORY_META['self-hosting'].color,
  },
  {
    title: 'Deployment',
    description: 'Real deployment workflows for Next.js, Docker, Nginx, and VPS setups.',
    href: `${RESOURCE_HUB_PATH}#deployment-guides`,
    icon: CATEGORY_META['how-to'].icon,
    accentColor: CATEGORY_META['how-to'].color,
  },
  {
    title: 'Automation',
    description: 'n8n and AI workflows that reduce manual operations work.',
    href: '/category/automation',
    icon: CATEGORY_META.automation.icon,
    accentColor: CATEGORY_META.automation.color,
  },
  {
    title: 'AI Tools',
    description: 'Practical model and workflow guidance for developers shipping faster.',
    href: '/category/ai',
    icon: CATEGORY_META.ai.icon,
    accentColor: CATEGORY_META.ai.color,
  },
  {
    title: 'Developer Tools',
    description: 'Tool picks, database clients, deployment platforms, and workflow upgrades.',
    href: '/category/developer-tools',
    icon: CATEGORY_META['developer-tools'].icon,
    accentColor: CATEGORY_META['developer-tools'].color,
  },
  {
    title: 'Web Development',
    description: 'Next.js, MDX, CSS, and performance patterns for production sites.',
    href: '/category/web-dev',
    icon: CATEGORY_META['web-dev'].icon,
    accentColor: CATEGORY_META['web-dev'].color,
  },
  {
    title: 'Indie Dev',
    description: 'Payments, budget stacks, and solo-builder decision support.',
    href: '/category/indie-hacking',
    icon: CATEGORY_META['indie-hacking'].icon,
    accentColor: CATEGORY_META['indie-hacking'].color,
  },
] as const

const HERO_PANELS: CuratedCard[] = [
  {
    title: 'Deploy on VPS',
    description: 'VPS setup, Coolify deploys, Nginx, SSL, and repeatable production checks.',
    href: `${RESOURCE_HUB_PATH}#deployment-guides`,
    icon: 'VPS',
    accentColor: CATEGORY_META['vps-cloud'].color,
  },
  {
    title: 'Self-Hosting Guides',
    description: 'Run n8n, analytics, and app stacks on infrastructure you control.',
    href: `${RESOURCE_HUB_PATH}#self-hosting`,
    icon: 'OPS',
    accentColor: CATEGORY_META['self-hosting'].color,
  },
  {
    title: 'Automation Workflows',
    description: 'Build n8n, bot, and AI-assisted workflows that save real time.',
    href: `${RESOURCE_HUB_PATH}#automation`,
    icon: 'AUT',
    accentColor: CATEGORY_META.automation.color,
  },
  {
    title: 'AI Tools for Developers',
    description: 'Choose models and tools based on workflow fit instead of generic hype.',
    href: `${RESOURCE_HUB_PATH}#ai-tools`,
    icon: 'AI',
    accentColor: CATEGORY_META.ai.color,
  },
  {
    title: 'Best Free Dev Tools',
    description: 'Free tools, PostgreSQL clients, and budget-friendly software picks.',
    href: `${RESOURCE_HUB_PATH}#resources-free-tools`,
    icon: 'OSS',
    accentColor: CATEGORY_META['free-tools'].color,
  },
  {
    title: 'Comparisons',
    description: 'Hosting, deployment, and tool comparisons for high-intent decisions.',
    href: `${RESOURCE_HUB_PATH}#resources-comparisons`,
    icon: 'VS',
    accentColor: CATEGORY_META['developer-tools'].color,
  },
] as const

const HERO_SIGNAL_LINKS: CuratedCard[] = [
  {
    title: 'VPS & Cloud',
    description: 'Browse VPS and hosting guides.',
    href: '/category/vps-cloud',
  },
  {
    title: 'Self Hosting',
    description: 'Open self-hosting guides and stacks.',
    href: '/category/self-hosting',
  },
  {
    title: 'Automation',
    description: 'Explore workflow and n8n articles.',
    href: '/category/automation',
  },
  {
    title: 'AI Tools',
    description: 'See AI tools and model comparisons.',
    href: '/category/ai',
  },
  {
    title: 'Comparisons',
    description: 'Jump into comparison-driven decisions.',
    href: `${RESOURCE_HUB_PATH}#resources-comparisons`,
  },
  {
    title: 'Free Tools',
    description: 'Browse free tools and budget stacks.',
    href: '/category/free-tools',
  },
] as const

const QUICK_ACCESS_CARDS: CuratedCard[] = [
  {
    title: 'Resources Hub',
    description: 'Open the hub that ties together start-here guides, learning paths, categories, tools, and comparisons.',
    href: RESOURCE_HUB_PATH,
    eyebrow: 'Hub',
    icon: '01',
  },
  {
    title: 'Best Free Developer Tools',
    description: 'Jump straight to the strongest free-tool roundup if you want useful software picks without browsing first.',
    href: '/blog/best-free-developer-tools-2026',
    eyebrow: 'Free Tools',
    icon: '02',
  },
  {
    title: 'Best PostgreSQL GUI',
    description: 'Go directly to the PostgreSQL GUI comparison if you are evaluating practical database clients.',
    href: '/blog/best-postgresql-gui-free',
    eyebrow: 'Database Tools',
    icon: '03',
  },
  {
    title: 'Coolify and Self-Hosting',
    description: 'Start with the Coolify guide if you want the fastest route into self-hosting and app deployment.',
    href: '/blog/coolify-complete-guide-2026',
    eyebrow: 'Self Hosting',
    icon: '04',
  },
  {
    title: 'VPS Deployment Guides',
    description: 'Open the deployment cluster for VPS setup, Nginx, Docker Compose, and production deployment guides.',
    href: `${RESOURCE_HUB_PATH}#deployment-guides`,
    eyebrow: 'Deploy',
    icon: '05',
  },
  {
    title: 'Comparison Articles',
    description: 'Browse high-intent hosting, deployment, AI, and tool comparisons from one section.',
    href: `${RESOURCE_HUB_PATH}#resources-comparisons`,
    eyebrow: 'Compare',
    icon: '06',
  },
  {
    title: 'Pillar Guides',
    description: 'Open the pillar-page layer for self-hosting, VPS, developer tools, SaaS stacks, and automation guides.',
    href: `${RESOURCE_HUB_PATH}#authority-pages`,
    eyebrow: 'Pillars',
    icon: '07',
  },
] as const

const RESOURCE_HUB_ENTRY_CARDS: CuratedCard[] = [
  {
    title: 'Start Here Guides',
    description: 'Foundational reads for new visitors who want the right first path.',
    href: `${RESOURCE_HUB_PATH}#resources-start-here`,
    eyebrow: 'Start',
    icon: '01',
  },
  {
    title: 'Learning Paths',
    description: 'Choose a goal and follow a guided sequence instead of browsing randomly.',
    href: `${RESOURCE_HUB_PATH}#learning-paths`,
    eyebrow: 'Path',
    icon: '02',
  },
  {
    title: 'Pillar Guides',
    description: 'Open the pillar-page layer that ties together the strongest guides, directories, and cluster entry points.',
    href: `${RESOURCE_HUB_PATH}#authority-pages`,
    eyebrow: 'Pillars',
    icon: '03',
  },
  {
    title: 'Explore Categories',
    description: 'Use the category grid as the main navigation layer for deep topic discovery.',
    href: `${RESOURCE_HUB_PATH}#resource-categories`,
    eyebrow: 'Categories',
    icon: '04',
  },
  {
    title: 'Comparison Hub',
    description: 'Open the comparison cluster for hosting, tools, AI, and platform decisions.',
    href: `${RESOURCE_HUB_PATH}#resources-comparisons`,
    eyebrow: 'Compare',
    icon: '05',
  },
  {
    title: 'Free Tools',
    description: 'Jump into saveable pages for free tools, PostgreSQL GUIs, and budget stacks.',
    href: `${RESOURCE_HUB_PATH}#resources-free-tools`,
    eyebrow: 'Free',
    icon: '06',
  },
  {
    title: 'Build Your Stack',
    description: 'Use practical stack blueprints to assemble a real deploy or SaaS setup.',
    href: `${RESOURCE_HUB_PATH}#build-your-stack`,
    eyebrow: 'Stack',
    icon: '07',
  },
  {
    title: 'Community',
    description: 'Open the community hub for discussions, indie hacker stories, tool recommendations, and weekly resources.',
    href: '/community',
    eyebrow: 'Community',
    icon: '08',
  },
] as const

const HOME_MISSION_POINTS: MissionPoint[] = [
  {
    title: 'Practical over theoretical',
    description: 'The site is organized around deploys, self-hosting, tooling, and decisions developers can act on quickly.',
  },
  {
    title: 'Hub-first discovery',
    description: 'Homepage and resources hub now do the navigation work so category clutter does not have to live in the navbar.',
  },
  {
    title: 'Useful topic clusters',
    description: 'Guides, categories, comparisons, free tools, and stack plans connect so readers can move deeper without friction.',
  },
] as const

const HOME_SITEMAP_GROUPS = [
  {
    title: 'Core routes',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Start Here', href: `${RESOURCE_HUB_PATH}#resources-start-here` },
      { label: 'Resources Hub', href: RESOURCE_HUB_PATH },
      { label: 'Community', href: '/community' },
      { label: 'All Guides', href: '/category/how-to' },
      { label: 'Free Tools', href: '/category/free-tools' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Browse categories',
    links: [
      { label: 'VPS & Cloud', href: '/category/vps-cloud' },
      { label: 'Self Hosting', href: '/category/self-hosting' },
      { label: 'How-To Guides', href: '/category/how-to' },
      { label: 'Automation', href: '/category/automation' },
      { label: 'AI', href: '/category/ai' },
      { label: 'Developer Tools', href: '/category/developer-tools' },
      { label: 'Web Development', href: '/category/web-dev' },
      { label: 'Indie Dev', href: '/category/indie-hacking' },
      { label: 'Free Tools', href: '/category/free-tools' },
    ],
  },
  {
    title: 'High-intent sections',
    links: [
      { label: 'Pillar Guides', href: `${RESOURCE_HUB_PATH}#authority-pages` },
      { label: 'Learning Paths', href: `${RESOURCE_HUB_PATH}#learning-paths` },
      { label: 'Comparisons', href: `${RESOURCE_HUB_PATH}#resources-comparisons` },
      { label: 'Community', href: '/community' },
      { label: 'Build Your Stack', href: `${RESOURCE_HUB_PATH}#build-your-stack` },
      { label: 'Popular Articles', href: `${RESOURCE_HUB_PATH}#popular-articles` },
      { label: 'Latest Articles', href: `${RESOURCE_HUB_PATH}#latest-articles` },
      { label: 'Blog Archive', href: '/blog' },
      { label: 'RSS Feed', href: '/feed.xml' },
    ],
  },
] as const

const RELATED_CATEGORY_MAP: Record<string, string[]> = {
  'how-to': ['self-hosting', 'vps-cloud', 'web-dev'],
  ai: ['automation', 'developer-tools', 'web-dev'],
  'developer-tools': ['free-tools', 'ai', 'vps-cloud'],
  'indie-hacking': ['free-tools', 'web-dev', 'vps-cloud'],
  'self-hosting': ['vps-cloud', 'automation', 'how-to'],
  'vps-cloud': ['self-hosting', 'how-to', 'developer-tools'],
  'web-dev': ['how-to', 'ai', 'developer-tools'],
  automation: ['ai', 'self-hosting', 'developer-tools'],
  'free-tools': ['developer-tools', 'indie-hacking', 'self-hosting'],
}

const HUB_SECTIONS: Record<string, HubSectionLink> = {
  authority: {
    id: 'authority-pages',
    title: 'Pillar Guides',
    href: `${RESOURCE_HUB_PATH}#authority-pages`,
  },
  deployment: {
    id: 'deployment-guides',
    title: 'Deployment Guides',
    href: `${RESOURCE_HUB_PATH}#deployment-guides`,
  },
  'vps-cloud': {
    id: 'vps-cloud',
    title: 'VPS & Cloud',
    href: `${RESOURCE_HUB_PATH}#vps-cloud`,
  },
  'self-hosting': {
    id: 'self-hosting',
    title: 'Self Hosting',
    href: `${RESOURCE_HUB_PATH}#self-hosting`,
  },
  automation: {
    id: 'automation',
    title: 'Automation',
    href: `${RESOURCE_HUB_PATH}#automation`,
  },
  'ai-tools': {
    id: 'ai-tools',
    title: 'AI Tools',
    href: `${RESOURCE_HUB_PATH}#ai-tools`,
  },
  'developer-tools': {
    id: 'developer-tools',
    title: 'Developer Tools',
    href: `${RESOURCE_HUB_PATH}#developer-tools`,
  },
  'postgresql-tools': {
    id: 'postgresql-tools',
    title: 'PostgreSQL Tools',
    href: `${RESOURCE_HUB_PATH}#postgresql-tools`,
  },
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    href: `${RESOURCE_HUB_PATH}#web-development`,
  },
  'indie-dev-saas': {
    id: 'indie-dev-saas',
    title: 'Indie Dev / SaaS',
    href: `${RESOURCE_HUB_PATH}#indie-dev-saas`,
  },
  comparisons: {
    id: 'resources-comparisons',
    title: 'Comparisons',
    href: `${RESOURCE_HUB_PATH}#resources-comparisons`,
  },
  'free-tools': {
    id: 'resources-free-tools',
    title: 'Free Tools',
    href: `${RESOURCE_HUB_PATH}#resources-free-tools`,
  },
}

const AUTHORITY_PAGE_DEFINITIONS: AuthorityPageDefinition[] = [
  {
    id: 'self-hosting-complete-guide',
    title: 'Self Hosting Complete Guide',
    description: 'Use this pillar page to branch into self-hosting apps, analytics, monitoring, and supporting infrastructure guides.',
    slug: 'self-hosting-resources',
    categories: ['self-hosting', 'how-to'],
    cluster: 'Self Hosting',
    hubSectionKey: 'self-hosting',
  },
  {
    id: 'deploy-apps-on-vps-guide',
    title: 'Deploy Apps on VPS Guide',
    description: 'The main deployment authority page for VPS setup, reverse proxy, production checks, and live app workflows.',
    slug: 'deploy-nextjs-coolify-hetzner',
    categories: ['how-to', 'vps-cloud', 'self-hosting'],
    cluster: 'Deployment',
    hubSectionKey: 'deployment',
  },
  {
    id: 'developer-tools-directory',
    title: 'Developer Tools Directory',
    description: 'A directory-style pillar page for the best developer tools, PostgreSQL clients, and workflow upgrades.',
    slug: 'best-free-developer-tools-2026',
    categories: ['developer-tools', 'free-tools'],
    cluster: 'Developer Tools',
    hubSectionKey: 'developer-tools',
  },
  {
    id: 'postgresql-tools-guide',
    title: 'PostgreSQL Tools Guide',
    description: 'A pillar page for PostgreSQL GUIs, database workflow choices, and developer tooling around local and production database work.',
    slug: 'best-postgresql-gui-free',
    categories: ['developer-tools', 'free-tools'],
    cluster: 'PostgreSQL Tools',
    hubSectionKey: 'postgresql-tools',
  },
  {
    id: 'free-tools-for-developers',
    title: 'Free Tools for Developers',
    description: 'Use this page as the main free-tools hub for open source replacements, free services, and budget stack picks.',
    slug: 'open-source-tools-2026',
    categories: ['free-tools', 'developer-tools', 'indie-hacking'],
    cluster: 'Free Tools',
    hubSectionKey: 'free-tools',
  },
  {
    id: 'build-saas-on-vps-guide',
    title: 'Build SaaS on VPS Guide',
    description: 'A pillar page for building and shipping a low-cost SaaS stack with self-hosted infrastructure and practical tooling.',
    slug: 'build-saas-mvp-zero-budget-2026',
    categories: ['indie-hacking', 'vps-cloud', 'self-hosting'],
    cluster: 'Indie Dev / SaaS',
    hubSectionKey: 'indie-dev-saas',
  },
  {
    id: 'developer-stack-guide',
    title: 'Developer Stack Guide',
    description: 'Use this page as the stack-planning anchor for Coolify, deploy workflows, and a lean developer platform setup.',
    slug: 'coolify-complete-guide-2026',
    categories: ['developer-tools', 'self-hosting', 'how-to'],
    cluster: 'Developer Stack',
    hubSectionKey: 'authority',
  },
  {
    id: 'docker-coolify-caprover-guide',
    title: 'Docker / Coolify / CapRover Guide',
    description: 'A central comparison and decision page for Docker-based self-hosting stacks, Coolify, and CapRover workflows.',
    slug: 'coolify-vs-caprover-2026',
    categories: ['developer-tools', 'self-hosting', 'how-to'],
    cluster: 'Deployment Stack',
    hubSectionKey: 'developer-tools',
  },
  {
    id: 'automation-guide-for-developers',
    title: 'Automation Guide for Developers',
    description: 'The main authority page for n8n workflows, automation patterns, and AI-assisted developer systems.',
    slug: 'n8n-complete-guide-2026',
    categories: ['automation', 'ai'],
    cluster: 'Automation',
    hubSectionKey: 'automation',
  },
  {
    id: 'ai-tools-for-developers',
    title: 'AI Tools for Developers',
    description: 'A pillar page for AI tools, model comparisons, developer workflows, and practical ways to use Claude and GPT tools.',
    slug: 'best-ai-tools-2026',
    categories: ['ai', 'developer-tools', 'free-tools'],
    cluster: 'AI Tools',
    hubSectionKey: 'ai-tools',
  },
  {
    id: 'vps-for-developers-guide',
    title: 'VPS for Developers Guide',
    description: 'Start here for choosing a VPS, hardening a server, and getting a developer-friendly host into production.',
    slug: 'vps-setup-guide',
    categories: ['vps-cloud', 'how-to', 'self-hosting'],
    cluster: 'VPS & Cloud',
    hubSectionKey: 'vps-cloud',
  },
  {
    id: 'docker-for-developers-guide',
    title: 'Docker for Developers Guide',
    description: 'A focused authority page for Docker Compose, VPS deployment flow, and production app packaging.',
    slug: 'docker-compose-production-vps-2026',
    categories: ['how-to', 'self-hosting', 'developer-tools'],
    cluster: 'Deployment',
    hubSectionKey: 'deployment',
  },
  {
    id: 'indie-developer-tools-guide',
    title: 'Indie Developer Tools Guide',
    description: 'Use this page to navigate low-cost tooling, payment workflows, and budget-aware software decisions for solo builders.',
    slug: 'free-tools-indian-indie-developer',
    categories: ['indie-hacking', 'free-tools', 'developer-tools'],
    cluster: 'Indie Dev',
    hubSectionKey: 'indie-dev-saas',
  },
] as const

const CATEGORY_CLUSTER_MAP: Record<string, CategoryClusterDefinition> = {
  'how-to': {
    hubSection: HUB_SECTIONS.deployment,
    guideSlugs: DEPLOYMENT_GUIDE_SLUGS,
    comparisonSlugs: [
      'coolify-vs-caprover-2026',
      'hetzner-vs-aws-lightsail-2026',
      'hetzner-vs-digitalocean-vs-vultr-india',
    ],
    toolSlugs: [
      'best-free-developer-tools-2026',
      'best-postgresql-gui-free',
      'open-source-tools-2026',
    ],
  },
  ai: {
    hubSection: HUB_SECTIONS['ai-tools'],
    guideSlugs: [
      'claude-ai-guide',
      'claude-api-content-automation-nodejs',
      'build-telegram-bot-claude-api-python',
      'whatsapp-ai-assistant-n8n-claude-api',
    ],
    comparisonSlugs: [
      'claude-api-vs-openai-gpt4-2026',
      'claude-api-vs-openai-cost-india',
      'claude-vs-chatgpt-developers',
    ],
    toolSlugs: ['best-ai-tools-2026', 'best-free-developer-tools-2026'],
  },
  'developer-tools': {
    hubSection: HUB_SECTIONS['developer-tools'],
    guideSlugs: [
      'coolify-complete-guide-2026',
      'vps-setup-guide',
      'nextjs-mdx-blog-2026',
    ],
    comparisonSlugs: [
      'coolify-vs-caprover-2026',
      'tailwind-css-vs-css-modules',
      'claude-vs-chatgpt-developers',
    ],
    toolSlugs: [
      'best-free-developer-tools-2026',
      'best-postgresql-gui-free',
      'best-vpn-for-developers-2026',
    ],
  },
  'indie-hacking': {
    hubSection: HUB_SECTIONS['indie-dev-saas'],
    guideSlugs: [
      'build-saas-mvp-zero-budget-2026',
      'razorpay-integration-nextjs-india',
      'free-tools-indian-indie-developer',
    ],
    comparisonSlugs: [
      'wise-vs-payoneer-india-freelancer',
      'oracle-cloud-free-vs-hetzner-2026',
    ],
    toolSlugs: [
      'free-tools-indian-indie-developer',
      'best-ai-tools-2026',
      'best-free-developer-tools-2026',
    ],
  },
  'self-hosting': {
    hubSection: HUB_SECTIONS['self-hosting'],
    guideSlugs: SELF_HOSTING_SLUGS,
    comparisonSlugs: [
      'coolify-vs-caprover-2026',
      'oracle-cloud-free-vs-hetzner-2026',
      'hetzner-vs-aws-lightsail-2026',
    ],
    toolSlugs: ['open-source-tools-2026', 'best-free-developer-tools-2026'],
  },
  'vps-cloud': {
    hubSection: HUB_SECTIONS['vps-cloud'],
    guideSlugs: [
      'vps-setup-guide',
      'vps-security-harden-ubuntu-2026',
      'deploy-nextjs-coolify-hetzner',
    ],
    comparisonSlugs: [
      'hetzner-vs-digitalocean-vs-vultr-india',
      'hetzner-vs-aws-2026',
      'hetzner-vs-aws-lightsail-2026',
      'hetzner-vs-vultr-vs-linode-2026',
      'oracle-cloud-free-vs-hetzner-2026',
    ],
    toolSlugs: ['free-vps-hosting-2026', 'best-free-developer-tools-2026'],
  },
  'web-dev': {
    hubSection: HUB_SECTIONS['web-development'],
    guideSlugs: [
      'getting-started-with-nextjs',
      'nextjs-mdx-blog-2026',
      'nextjs-performance-optimization-2026',
      'nextjs-mdx-remote-rsc-edge-runtime-fix',
      'tailwind-css-tips',
    ],
    comparisonSlugs: ['tailwind-css-vs-css-modules'],
    toolSlugs: ['best-free-developer-tools-2026', 'best-ai-tools-2026'],
  },
  automation: {
    hubSection: HUB_SECTIONS.automation,
    guideSlugs: AUTOMATION_SLUGS,
    comparisonSlugs: [
      'n8n-vs-make-vs-zapier-indie-dev',
      'claude-api-vs-openai-gpt4-2026',
    ],
    toolSlugs: ['best-ai-tools-2026', 'open-source-tools-2026'],
  },
  'free-tools': {
    hubSection: HUB_SECTIONS['free-tools'],
    guideSlugs: [
      'best-free-developer-tools-2026',
      'open-source-tools-2026',
      'free-tools-indian-indie-developer',
    ],
    comparisonSlugs: [
      'best-postgresql-gui-free',
      'claude-vs-chatgpt-developers',
      'tailwind-css-vs-css-modules',
    ],
    toolSlugs: FREE_TOOL_SLUGS,
  },
}

function pickPosts(posts: Post[], slugs: readonly string[]): Post[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post]))
  return slugs.map((slug) => bySlug.get(slug)).filter((post): post is Post => Boolean(post))
}

function uniquePosts(posts: Post[]): Post[] {
  const seen = new Set<string>()
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function mergeCuratedPosts(primary: Post[], fallback: Post[], limit = 3): Post[] {
  return uniquePosts([...primary, ...fallback]).slice(0, limit)
}

function pickAuthorityPages(posts: Post[], definitions: readonly AuthorityPageDefinition[]): AuthorityPage[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post]))

  return definitions
    .map((definition) => {
      const post = bySlug.get(definition.slug)
      const hubSection = HUB_SECTIONS[definition.hubSectionKey]

      if (!post || !hubSection) {
        return null
      }

      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        categories: definition.categories,
        cluster: definition.cluster,
        href: `/blog/${post.slug}`,
        hubSection,
        post,
      }
    })
    .filter((page): page is AuthorityPage => Boolean(page))
}

export function getAuthorityPages(posts: Post[]): AuthorityPage[] {
  return pickAuthorityPages(posts, AUTHORITY_PAGE_DEFINITIONS)
}

export function getRelatedCategoryLinks(category: string): RelatedCategoryLink[] {
  return (RELATED_CATEGORY_MAP[category] || [])
    .map((slug) => {
      const meta = getCategoryMeta(slug)
      return {
        slug,
        href: `/category/${slug}`,
        label: meta.label,
        description: meta.description,
        icon: meta.icon,
        color: meta.color,
      }
    })
}

export function getCategoryClusterContent(category: string, posts: Post[]): CategoryClusterContent {
  const normalizedCategory = category.toLowerCase().trim()
  const cluster = CATEGORY_CLUSTER_MAP[normalizedCategory] || {
    hubSection: HUB_SECTIONS.comparisons,
    guideSlugs: [] as readonly string[],
    comparisonSlugs: [] as readonly string[],
    toolSlugs: [] as readonly string[],
  }
  const pillarPages = getPillarsForCategory(normalizedCategory, posts)

  const sameCategoryPosts = posts.filter((post) => post.category === normalizedCategory)
  const curatedGuides = pickPosts(posts, cluster.guideSlugs)
  const curatedComparisons = pickPosts(posts, cluster.comparisonSlugs)
  const curatedTools = pickPosts(posts, cluster.toolSlugs)

  const fallbackGuides = sameCategoryPosts.filter(
    (post) => post.category === normalizedCategory && (post.schema === 'howto' || post.category === 'how-to')
  )
  const fallbackComparisons = sameCategoryPosts.filter((post) => /(^| )(vs|versus)( |$)/i.test(post.title))
  const fallbackTools = sameCategoryPosts.filter(
    (post) => /free|tool|tools|software|stack|resources/i.test(`${post.title} ${post.description}`)
  )

  return {
    hubSection: cluster.hubSection,
    pillarPages,
    guides: mergeCuratedPosts(curatedGuides, fallbackGuides, 4),
    comparisons: mergeCuratedPosts(curatedComparisons, fallbackComparisons, 4),
    tools: mergeCuratedPosts(curatedTools, fallbackTools, 4),
  }
}

export function getResourceHubContent(posts: Post[]) {
  const startHere = pickPosts(posts, START_HERE_SLUGS)
  const popularGuides = pickPosts(posts, POPULAR_GUIDE_SLUGS)
  const comparisons = pickPosts(posts, COMPARISON_SLUGS)
  const freeTools = pickPosts(posts, FREE_TOOL_SLUGS)
  const deploymentGuides = pickPosts(posts, DEPLOYMENT_GUIDE_SLUGS)
  const vpsCloud = pickPosts(posts, VPS_CLOUD_SLUGS)
  const selfHosting = pickPosts(posts, SELF_HOSTING_SLUGS)
  const automation = pickPosts(posts, AUTOMATION_SLUGS)
  const aiTools = pickPosts(posts, AI_TOOL_SLUGS)
  const developerTools = pickPosts(posts, DEVELOPER_TOOL_SLUGS)
  const postgresqlTools = pickPosts(posts, POSTGRESQL_TOOL_SLUGS)
  const webDevelopment = pickPosts(posts, WEB_DEVELOPMENT_SLUGS)
  const indieDevSaas = pickPosts(posts, INDIE_DEV_SAAS_SLUGS)
  const pillarPages = getAllPillarPages(posts)
  const popularArticles = pickPosts(posts, POPULAR_ARTICLE_SLUGS)
  const latestArticles = posts.slice(0, 6)
  const recommendedReading = pickPosts(posts, RECOMMENDED_READING_SLUGS)
  const learningPaths = LEARNING_PATHS.map((path) => ({
    ...path,
    steps: pickPosts(posts, path.slugs),
  })).filter((path) => path.steps.length > 0)

  const guideSet = new Set([
    ...startHere.map((post) => post.slug),
    ...deploymentGuides.map((post) => post.slug),
    ...selfHosting.map((post) => post.slug),
    ...automation.map((post) => post.slug),
    ...webDevelopment.map((post) => post.slug),
    ...indieDevSaas.map((post) => post.slug),
  ])

  return {
    heroPanels: HERO_PANELS,
    heroSignals: HERO_SIGNAL_LINKS,
    quickAccessCards: QUICK_ACCESS_CARDS,
    resourceHubEntryCards: RESOURCE_HUB_ENTRY_CARDS,
    missionPoints: HOME_MISSION_POINTS,
    categoryCards: CATEGORY_DISCOVERY_CARDS,
    coverageCards: COVERAGE_CARDS,
    learningPaths,
    pillarPages,
    stackBlueprints: STACK_BLUEPRINTS,
    sitemapGroups: HOME_SITEMAP_GROUPS,
    startHere,
    popularGuides,
    comparisons,
    freeTools,
    deploymentGuides,
    vpsCloud,
    selfHosting,
    automation,
    aiTools,
    developerTools,
    postgresqlTools,
    webDevelopment,
    indieDevSaas,
    popularArticles,
    latestArticles,
    recommendedReading,
    stats: {
      guides: guideSet.size,
      articles: posts.length,
      comparisons: comparisons.length,
      tools: freeTools.length,
    },
  }
}
