// Single source of truth - 9 categories
export interface CategoryMeta {
  label: string
  icon: string
  symbol: string
  color: string
  gradient: string
  description: string
  longDesc: string
}

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  tutorials: 'how-to',
  tools: 'developer-tools',
  tech: 'vps-cloud',
  'indie-dev': 'vps-cloud',
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  'how-to': {
    label: 'How-To Guides',
    icon: '\u2192',
    symbol: 'CLI',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)',
    description: 'Step-by-step guides that actually work in production.',
    longDesc: 'Practical step-by-step tutorials for deployment, hosting, integrations, and real production setup work.',
  },
  ai: {
    label: 'AI Developers',
    icon: '\u2726',
    symbol: 'AI',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    description: 'Claude API, OpenAI, and AI tools for developers.',
    longDesc: 'Model comparisons, API workflows, cost tradeoffs, and practical AI tooling patterns for builders.',
  },
  'developer-tools': {
    label: 'Developer Tools',
    icon: '\u2699',
    symbol: 'DEV',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    description: 'Honest comparisons of tools developers actually use.',
    longDesc: 'Clear verdicts on platforms, utilities, and software choices that affect developer speed and reliability.',
  },
  'indie-hacking': {
    label: 'Indie Hacking',
    icon: '\u2197',
    symbol: 'BIZ',
    color: '#e11d48',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)',
    description: 'Payments, cards, and money - building and shipping solo.',
    longDesc: 'Practical guidance on payments, billing, and shipping decisions for solo developers and indie builders.',
  },
  'self-hosting': {
    label: 'Self-Hosting',
    icon: '\u25A3',
    symbol: 'OPS',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    description: 'Run your own apps on a lean VPS stack.',
    longDesc: 'Hands-on self-hosting guides for running production apps, services, and monitoring on your own infrastructure.',
  },
  'vps-cloud': {
    label: 'VPS & Cloud',
    icon: '\u2601',
    symbol: 'VPS',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    description: 'Hetzner, DigitalOcean, Oracle Cloud - real verdicts.',
    longDesc: 'Cloud and VPS comparisons, provider tradeoffs, and server setup guidance grounded in real usage.',
  },
  'web-dev': {
    label: 'Web Development',
    icon: '</>',
    symbol: 'WEB',
    color: '#ea580c',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    description: 'Next.js, MDX, Tailwind - modern web dev in production.',
    longDesc: 'Modern web development patterns for Next.js, frontend architecture, styling systems, and performance.',
  },
  automation: {
    label: 'Automation',
    icon: '\u21BB',
    symbol: 'AUT',
    color: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
    description: 'n8n, Claude API, and workflows that save hours.',
    longDesc: 'Automation guides for developer workflows, integrations, bots, and AI-assisted systems that reduce manual work.',
  },
  'free-tools': {
    label: 'Free Tools',
    icon: '\u25CE',
    symbol: 'OSS',
    color: '#0d9488',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
    description: 'The best free and open source tools for developers.',
    longDesc: 'Curated open source and free software picks that replace paid tools without sacrificing usefulness.',
  },
}

export function normalizeCategorySlug(category: string): string {
  const slug = category.toLowerCase().trim()
  return LEGACY_CATEGORY_MAP[slug] || slug
}

export function getCategoryMeta(category: string): CategoryMeta {
  const slug = normalizeCategorySlug(category)
  return CATEGORY_META[slug] || {
    label: slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    icon: '\u25C7',
    symbol: 'BLX',
    color: '#6c63ff',
    gradient: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)',
    description: `Browse all ${slug} articles on Blixamo.`,
    longDesc: `Browse all ${slug} articles on Blixamo.`,
  }
}
