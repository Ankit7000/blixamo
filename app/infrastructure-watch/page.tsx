import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Infrastructure Watch',
  description:
    'A focused Blixamo mini hub for VPS changes, hosting comparisons, deployment platform shifts, and infrastructure decisions developers should track.',
  alternates: { canonical: 'https://blixamo.com/infrastructure-watch' },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOP_READ_SLUGS = [
  'vps-setup-guide',
  'coolify-complete-guide-2026',
  'self-hosting-resources',
  'hetzner-vs-aws-lightsail-2026',
] as const

const PRACTICAL_COMPARISON_SLUGS = [
  'coolify-vs-caprover-2026',
  'hetzner-vs-aws-2026',
  'hetzner-vs-aws-lightsail-2026',
  'hetzner-vs-digitalocean-vs-vultr-india',
  'hetzner-vs-vultr-vs-linode-2026',
  'oracle-cloud-free-vs-hetzner-2026',
] as const

const INFRA_PATHS: MiniHubCard[] = [
  {
    title: 'Self-hosting infrastructure path',
    description: 'Use this path when the real question is what stack to own yourself and how much ops you want to carry.',
    href: '/blog/self-hosting-resources',
    eyebrow: 'Self Host',
  },
  {
    title: 'Managed-ish deployment path',
    description: 'Open this when you still want VPS control but want a cleaner app-deploy layer instead of raw server work everywhere.',
    href: '/blog/coolify-complete-guide-2026',
    eyebrow: 'Managed Layer',
  },
  {
    title: 'Provider choice path',
    description: 'Use this route when the open decision is cost, host quality, and price-to-performance rather than deploy tooling.',
    href: '/blog/hetzner-vs-aws-lightsail-2026',
    eyebrow: 'Provider',
  },
] as const

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'Deployment Hub',
    description: 'Go wider when you want the full operational hub for deploy guides, self-hosting reads, and comparison surfaces.',
    href: '/tag/deployment',
    eyebrow: 'Related Lane',
  },
  {
    title: 'VPS & Cloud category',
    description: 'Use this lane when you want the full infrastructure category instead of this tighter watch layer.',
    href: '/category/vps-cloud',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Self-Hosting category',
    description: 'Open this when the decision shifts from infrastructure choice into what services should live on the server.',
    href: '/category/self-hosting',
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

function pickFreshInfrastructureReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()
      return (
        post.category === 'vps-cloud' ||
        post.category === 'self-hosting' ||
        post.category === 'how-to' ||
        /vps|cloud|provider|hosting|host|server|infra|infrastructure|deploy|deployment|coolify|caprover|docker|nginx|self-host/.test(
          text
        )
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

export default function InfrastructureWatchPage() {
  const allPosts = getAllPosts()
  const topReads = pickPostsBySlug(allPosts, TOP_READ_SLUGS)
  const latestUsefulReads = pickFreshInfrastructureReads(allPosts, 4)
  const practicalComparisons = pickPostsBySlug(allPosts, PRACTICAL_COMPARISON_SLUGS)

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
        <h1 className="home-section-title">Infrastructure Watch</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused Blixamo mini hub for infrastructure changes, provider tradeoffs, deployment-platform shifts, and
          self-hosting decisions that developers should actually track.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#top-reads" className="home-hero-button home-hero-button-primary">
            Best starting reads
          </Link>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-secondary">
            Latest useful reads
          </Link>
          <Link href="#practical-comparisons" className="home-hero-button home-hero-button-secondary">
            Infrastructure decisions
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
            Use this page when you want the infrastructure reads that change real developer decisions now: provider
            comparisons, deployment-platform tradeoffs, self-hosting stack choices, and cost or performance shifts worth reopening.
          </p>
        </div>
      </section>

      <section id="top-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Top Reads</div>
            <h2 className="home-section-title">Best starting reads for the infrastructure lane</h2>
          </div>
          <Link href="/category/vps-cloud" className="home-section-link">
            Browse VPS lane
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
            <h2 className="home-section-title">Current infrastructure reads worth checking now</h2>
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

      <section id="practical-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical Comparisons / Infrastructure Decisions</div>
            <h2 className="home-section-title">Provider and platform choices with real tradeoffs behind them</h2>
          </div>
          <Link href="/guides/comparisons-hub" className="home-section-link">
            Open comparisons hub
          </Link>
        </div>
        <div className="home-post-grid">
          {practicalComparisons.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Self-Host / Managed / Provider Choice</div>
          <h2 className="home-section-title">Open the path that matches the actual infrastructure decision</h2>
        </div>
        <div className="home-quick-grid">
          {INFRA_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Related Lanes</div>
          <h2 className="home-section-title">Move wider only when the question changes</h2>
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
            Use this page as the infrastructure watch layer. When you want the full operational surface, go to the
            Deployment Hub. When you want the full host-selection lane, open VPS &amp; Cloud next.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/tag/deployment" className="home-hero-button home-hero-button-secondary">
              Deployment Hub
            </Link>
            <Link href="/category/vps-cloud" className="home-hero-button home-hero-button-secondary">
              VPS &amp; Cloud
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
