import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Coolify Hub',
  description:
    'A focused Blixamo mini hub for Coolify setup, app deployment, platform comparisons, and practical self-hosting workflows on one VPS.',
  alternates: { canonical: 'https://blixamo.com/coolify-hub' },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOP_READ_SLUGS = [
  'coolify-complete-guide-2026',
  'coolify-vs-caprover-2026',
  'deploy-nextjs-coolify-hetzner',
  'multiple-projects-single-vps',
] as const

const PRACTICAL_PATHS: MiniHubCard[] = [
  {
    title: 'Start with the platform fit',
    description: 'Use this first if you still need the clean answer on what Coolify is for, when it saves time, and when a VPS platform layer is worth it.',
    href: '/blog/coolify-complete-guide-2026',
    eyebrow: 'Setup',
  },
  {
    title: 'Deploy one real app',
    description: 'Open this next when you want the concrete Coolify workflow for Git, env vars, DNS, SSL, and the first production deploy.',
    href: '/blog/deploy-nextjs-coolify-hetzner',
    eyebrow: 'Deploy',
  },
  {
    title: 'Plan the shared VPS layout',
    description: 'Use this path when Coolify is only one part of the box and you need to think through multiple apps, ports, PM2, Docker, and operating boundaries.',
    href: '/blog/multiple-projects-single-vps',
    eyebrow: 'Scale',
  },
] as const

const DECISION_PATHS: MiniHubCard[] = [
  {
    title: 'Choose between Coolify and CapRover',
    description: 'Use this when the real decision is platform direction, migration pressure, and which app layer stays easier after the first deploy.',
    href: '/blog/coolify-vs-caprover-2026',
    eyebrow: 'Compare',
  },
  {
    title: 'Choose Coolify or manual Compose control',
    description: 'Open this if you are deciding whether to keep direct Docker Compose and Nginx control or move those workflows behind a cleaner Coolify surface.',
    href: '/blog/docker-compose-production-vps-2026',
    eyebrow: 'Architecture',
  },
] as const

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'Deployment Hub',
    description: 'Go wider when the question shifts from Coolify specifically into broader VPS deploys, reverse proxies, and production operations.',
    href: '/tag/deployment',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Self-Hosting category',
    description: 'Use this lane when the next question is the wider self-hosting stack around Coolify, not the platform decision itself.',
    href: '/category/self-hosting',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Community',
    description: 'Open Community when you want fresher related reading without widening into the full archive.',
    href: '/community',
    eyebrow: 'Related Lane',
  },
] as const

function uniquePosts(posts: Post[]): Post[] {
  const seen = new Set<string>()

  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function pickPostsBySlug(posts: Post[], slugs: readonly string[]): Post[] {
  return slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is Post => Boolean(post))
}

function pickFreshCoolifyReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()

      return (
        TOP_READ_SLUGS.includes(post.slug as (typeof TOP_READ_SLUGS)[number]) ||
        ((post.category === 'self-hosting' || post.category === 'vps-cloud' || post.category === 'how-to') &&
          /coolify|caprover|self-host|deployment platform|deploy|docker compose|multi-app|multiple apps|vps/.test(text))
      )
    })
  )
    .sort((a, b) => getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime())
    .slice(0, limit)
}

function MiniHubLinkCard({ card }: { card: MiniHubCard }) {
  return (
    <Link href={card.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{card.eyebrow}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h3 className="home-curated-title">{card.title}</h3>
      <p className="home-curated-copy">{card.description}</p>
      <div className="home-curated-footer">
        <span>Use this path</span>
        <span>Read more</span>
      </div>
    </Link>
  )
}

export default function CoolifyHubPage() {
  const allPosts = getAllPosts()
  const topReads = pickPostsBySlug(allPosts, TOP_READ_SLUGS)
  const latestUsefulReads = pickFreshCoolifyReads(allPosts, 4)

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section
        style={{
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="home-section-kicker">Mini Hub</div>
        <h1 className="home-section-title">Coolify Hub</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused route for practical Coolify setup, first deploys, platform comparisons, multi-app VPS planning, and
          the self-hosting reads that matter once the box starts carrying real work.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#top-reads" className="home-hero-button home-hero-button-primary">
            Best starting reads
          </Link>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-secondary">
            Latest useful reads
          </Link>
          <Link href="#setup-deployment-path" className="home-hero-button home-hero-button-secondary">
            Setup and deployment path
          </Link>
        </div>
      </section>

      <section className="home-section-shell">
        <div
          style={{
            padding: '1.1rem 1.2rem',
            borderRadius: '0.95rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="home-section-kicker">What This Hub Is For</div>
          <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Use this page when the real question is whether Coolify fits the stack, how to deploy with it cleanly, and
            what to read next once one VPS needs to host more than one useful thing.
          </p>
        </div>
      </section>

      <section id="top-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Top Reads</div>
            <h2 className="home-section-title">Best starting reads for the Coolify lane</h2>
          </div>
          <Link href="/category/self-hosting" className="home-section-link">
            Browse self hosting
          </Link>
        </div>
        <div className="home-post-grid">
          {topReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-useful-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Useful Reads</div>
            <h2 className="home-section-title">Current Coolify and self-hosting reads worth reopening</h2>
          </div>
          <Link href="/community" className="home-section-link">
            Open community
          </Link>
        </div>
        <div className="home-post-grid">
          {latestUsefulReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="setup-deployment-path" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical Setup / Deployment Path</div>
            <h2 className="home-section-title">Go from Coolify fit to first deploy to a shared VPS that still makes sense</h2>
          </div>
          <Link href="/tag/deployment" className="home-section-link">
            Open deployment hub
          </Link>
        </div>
        <div className="home-quick-grid">
          {PRACTICAL_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="comparison-decision-path" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Comparison / Decision Path</div>
          <h2 className="home-section-title">Choose the platform layer or stay closer to raw VPS control</h2>
        </div>
        <div className="home-quick-grid">
          {DECISION_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Related Lanes</div>
          <h2 className="home-section-title">Move wider only when the question stops being about Coolify itself</h2>
        </div>
        <div className="home-quick-grid">
          {RELATED_LANES.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div
          style={{
            padding: '1.1rem 1.2rem',
            borderRadius: '0.95rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="home-section-kicker">Keep Reading</div>
          <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Keep this hub for the Coolify path. Jump to Self-Hosting for the wider stack or Deployment Hub for the full
            operational surface around it.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/category/self-hosting" className="home-hero-button home-hero-button-secondary">
              Self Hosting
            </Link>
            <Link href="/tag/deployment" className="home-hero-button home-hero-button-secondary">
              Deployment Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
