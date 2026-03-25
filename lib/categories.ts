// Single source of truth — 9 categories
export interface CategoryMeta {
  label:       string
  icon:        string
  color:       string
  gradient:    string
  description: string
  longDesc:    string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  'how-to': {
    label:       'How-To Guides',
    icon:        '📖',
    color:       '#0891b2',
    gradient:    'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)',
    description: 'Step-by-step guides that actually work in production.',
    longDesc:    'Practical step-by-step tutorials — deploying Next.js, setting up GSC, building Telegram bots, integrating payments. Every guide is tested on a real VPS.',
  },
  'ai': {
    label:       'AI Developers',
    icon:        '🤖',
    color:       '#7c3aed',
    gradient:    'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    description: 'Claude API, OpenAI, and AI tools for developers.',
    longDesc:    'Building with AI APIs — Claude vs OpenAI cost breakdowns, model comparisons, production patterns, and real rupee pricing for indie developers.',
  },
  'developer-tools': {
    label:       'Developer Tools',
    icon:        '🛠',
    color:       '#d97706',
    gradient:    'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    description: 'Honest comparisons of tools developers actually use.',
    longDesc:    'Head-to-head tool comparisons with real production data — PostgreSQL GUIs, deploy platforms (Coolify vs Caprover vs Dokku), and everything tested before recommending.',
  },
  'indie-hacking': {
    label:       'Indie Hacking',
    icon:        '🚀',
    color:       '#e11d48',
    gradient:    'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)',
    description: 'Payments, cards, and money — building and shipping solo.',
    longDesc:    'Everything for indie developers getting paid: Razorpay integration, Niyo vs Kotak debit cards, Wise vs Payoneer fees, and paying for international dev tools from India.',
  },
  'self-hosting': {
    label:       'Self-Hosting',
    icon:        '🖥',
    color:       '#059669',
    gradient:    'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    description: 'Run your own apps on a ₹465/month VPS.',
    longDesc:    'Self-hosting guides for running multiple production apps on a single cheap VPS — n8n, Next.js, Redis, PM2, and self-healing monitors. Real configs, not theory.',
  },
  'vps-cloud': {
    label:       'VPS & Cloud',
    icon:        '☁️',
    color:       '#2563eb',
    gradient:    'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    description: 'Hetzner, DigitalOcean, Oracle Cloud — real verdicts.',
    longDesc:    'VPS comparisons, cloud provider reviews, and server security guides with real latency and cost data. Hetzner vs DigitalOcean vs Vultr, Oracle Cloud Free vs Hetzner, Ubuntu hardening.',
  },
  'web-dev': {
    label:       'Web Development',
    icon:        '💻',
    color:       '#ea580c',
    gradient:    'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    description: 'Next.js, MDX, Tailwind — modern web dev in production.',
    longDesc:    'Modern web development guides — Next.js MDX blog setup, Tailwind CSS vs CSS Modules, App Router patterns, and building fast sites that load in under 400ms.',
  },
  'automation': {
    label:       'Automation',
    icon:        '⚡',
    color:       '#db2777',
    gradient:    'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
    description: 'n8n, Claude API, and automation workflows that save hours.',
    longDesc:    'Build automation workflows that replace paid tools — n8n vs Zapier vs Make, WhatsApp AI bots, content quality automation with Claude API and Node.js.',
  },
  'free-tools': {
    label:       'Free Tools',
    icon:        '🆓',
    color:       '#0d9488',
    gradient:    'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
    description: 'The best free and open source tools for indie developers.',
    longDesc:    'Curated free and open source tools that replace expensive SaaS — 12 open source tools replacing ₹28K/month, and the complete free infra stack for Indian indie developers.',
  },
}

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] || {
    label:       category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon:        '📄',
    color:       '#6c63ff',
    gradient:    'linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)',
    description: `Browse all ${category} articles on Blixamo.`,
    longDesc:    `Browse all ${category} articles on Blixamo.`,
  }
}
