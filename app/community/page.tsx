import Link from 'next/link'
import type { Metadata } from 'next'
import { RESOURCE_HUB_PATH } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Community Hub | Blixamo',
  description:
    'Developer discussions, indie hacker stories, tool recommendations, VPS setups, weekly resources, and practical questions around self-hosting and shipping software.',
  alternates: { canonical: 'https://blixamo.com/community' },
}

type CommunityCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const COMMUNITY_SECTIONS: CommunityCard[] = [
  {
    title: 'Developer Discussions',
    description: 'Start with practical conversations around deployment, self-hosting, automation, and real tool tradeoffs.',
    href: RESOURCE_HUB_PATH,
    eyebrow: 'Discuss',
  },
  {
    title: 'Indie Hacker Stories',
    description: 'Use the indie-hacking cluster for MVP decisions, monetization tradeoffs, and shipping lessons from lean products.',
    href: '/category/indie-hacking',
    eyebrow: 'Stories',
  },
  {
    title: 'Tool Recommendations',
    description: 'Browse the strongest tool roundups, PostgreSQL clients, AI picks, and workflow upgrades in one place.',
    href: '/guides/developer-tools-directory',
    eyebrow: 'Tools',
  },
  {
    title: 'VPS Setups',
    description: 'Follow the VPS and self-hosting paths for stack setup, hardening, reverse proxy, and production checks.',
    href: '/guides/deploy-apps-on-vps-complete-guide',
    eyebrow: 'Infrastructure',
  },
  {
    title: 'Weekly Resources',
    description: 'Use the resource hub and the latest articles archive to keep up with new guides, comparisons, and checklists.',
    href: '/blog',
    eyebrow: 'Resources',
  },
  {
    title: 'Questions and Answers',
    description: 'Use this page as the Q&A entry point, then branch into category pages and pillar guides for the best next read.',
    href: '/guides/comparisons-hub',
    eyebrow: 'Q&A',
  },
]

const COMMUNITY_LINKS: CommunityCard[] = [
  {
    title: 'Resources Hub',
    description: 'The main start-here page for categories, pillar guides, comparisons, and high-intent reading paths.',
    href: RESOURCE_HUB_PATH,
    eyebrow: 'Start Here',
  },
  {
    title: 'Self Hosting Guide',
    description: 'The main authority page for self-hosting apps, analytics, automation, and supporting infrastructure.',
    href: '/guides/self-hosting-complete-guide',
    eyebrow: 'Pillar Guide',
  },
  {
    title: 'Free Tools Guide',
    description: 'Open the free-tools pillar if the current problem is cutting software spend without breaking the workflow.',
    href: '/guides/free-tools-for-developers',
    eyebrow: 'Pillar Guide',
  },
  {
    title: 'About Blixamo',
    description: 'See how the publication is organized and what topics the site focuses on across deployment, tooling, and operations.',
    href: '/about',
    eyebrow: 'About',
  },
]

const BUILDING_SHOWCASE: CommunityCard[] = [
  {
    title: 'Self-hosted app stacks',
    description: 'Coolify, Docker Compose, reverse proxy, analytics, and automation on small VPS infrastructure.',
    href: '/category/self-hosting',
    eyebrow: 'What People Build',
  },
  {
    title: 'AI-assisted workflows',
    description: 'Claude, API workflows, bots, and automation systems for developers who want faster output.',
    href: '/category/ai',
    eyebrow: 'What People Build',
  },
  {
    title: 'Low-cost SaaS setups',
    description: 'Budget-aware MVP stacks, payment setup, free tools, and early-stage product workflows.',
    href: '/blog/build-saas-mvp-zero-budget-2026',
    eyebrow: 'What People Build',
  },
]

function CommunityCard({ card }: { card: CommunityCard }) {
  return (
    <Link href={card.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{card.eyebrow}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h2 className="home-curated-title">{card.title}</h2>
      <p className="home-curated-copy">{card.description}</p>
      <div className="home-curated-footer">
        <span>Use this path</span>
        <span>Read more</span>
      </div>
    </Link>
  )
}

export default function CommunityPage() {
  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section className="home-resource-promo">
        <div className="home-resource-promo-copy">
          <div className="home-section-kicker">Community Hub</div>
          <h1 className="home-section-title">Developer discussions, build stories, VPS setups, and practical resource sharing.</h1>
          <p className="home-section-description">
            This page is the community layer for Blixamo. Use it to move between discussions, indie hacker stories,
            tool recommendations, weekly resources, and the guides that help developers ship real projects on their own infrastructure.
          </p>
          <div className="home-hero-actions">
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
              Start Here
            </Link>
            <Link href="/guides/self-hosting-complete-guide" className="home-hero-button home-hero-button-secondary">
              Self Hosting Guide
            </Link>
            <Link href="/blog" className="home-hero-button home-hero-button-secondary">
              Browse Blog
            </Link>
          </div>
        </div>

        <div className="home-resource-promo-grid">
          {COMMUNITY_LINKS.map((card) => (
            <div key={card.title} className="home-resource-promo-card">
              <span className="home-curated-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="home-section-link">
                Open
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="discussions" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Community Topics</div>
          <h2 className="home-section-title">Use these entry points to explore the practical side of the site</h2>
          <p className="home-section-description">
            Each card points into a strong topic cluster so the page works like a community map, not a dead-end archive.
          </p>
        </div>
        <div className="home-quick-grid">
          {COMMUNITY_SECTIONS.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="showcase" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">What People Are Building</div>
          <h2 className="home-section-title">Use the community hub to branch into real product and infrastructure paths</h2>
        </div>
        <div className="home-quick-grid">
          {BUILDING_SHOWCASE.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="community-links" className="home-section-shell">
        <div className="home-newsletter-panel">
          <div className="home-section-kicker">Community Links</div>
          <h2 className="home-section-title" style={{ marginTop: '0.75rem' }}>Use Blixamo as the hub until dedicated community channels expand</h2>
          <p className="home-section-description" style={{ marginTop: '0.75rem' }}>
            Dedicated Discord and Telegram spaces can be added later. For now, the strongest community paths are the
            resource hub, the pillar guides, the blog archive, and the category pages that connect the discussions back to real reads.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
              Resource Hub
            </Link>
            <Link href="/category/indie-hacking" className="home-hero-button home-hero-button-secondary">
              Indie Hacking
            </Link>
            <Link href="/category/developer-tools" className="home-hero-button home-hero-button-secondary">
              Developer Tools
            </Link>
            <Link href="/blog" className="home-hero-button home-hero-button-secondary">
              Blog Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
