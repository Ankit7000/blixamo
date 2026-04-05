import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Dev Tools Watch',
  description:
    'A focused Blixamo mini hub for new developer tools, useful updates, alternatives, and practical reads worth testing now.',
  alternates: { canonical: 'https://blixamo.com/dev-tools-watch' },
  robots: { index: false, follow: true },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOP_READ_SLUGS = [
  'best-free-developer-tools-2026',
  'best-postgresql-gui-free',
  'open-source-tools-2026',
  'best-vpn-for-developers-2026',
] as const

const WORTH_TESTING_SLUGS = [
  'coolify-vs-caprover-2026',
  'claude-vs-chatgpt-developers',
  'best-free-api-testing-tools-2026',
  'best-free-documentation-tools-2026',
  'best-free-git-tools-2026',
  'best-free-diagram-tools-2026',
] as const

const USE_IT_PATHS: MiniHubCard[] = [
  {
    title: 'Free-first tools path',
    description: 'Start here when you want the fastest shortlist of useful tools without opening five separate roundups first.',
    href: '/blog/best-free-developer-tools-2026',
    eyebrow: 'Use It',
  },
  {
    title: 'Database workflow path',
    description: 'Open this when the real tool question is local or production database work, not general developer software.',
    href: '/blog/best-postgresql-gui-free',
    eyebrow: 'Database',
  },
  {
    title: 'Platform-tool decisions',
    description: 'Use this path when the tool choice is really about how you ship and operate apps, not just what app you install.',
    href: '/blog/coolify-vs-caprover-2026',
    eyebrow: 'Platform',
  },
] as const

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'Developer Tools category',
    description: 'Go deeper when you want the full tool lane instead of this tighter current-watch layer.',
    href: '/category/developer-tools',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Free Tools category',
    description: 'Use this lane when the main question is free or open-source replacements, not general tool quality.',
    href: '/category/free-tools',
    eyebrow: 'Related Lane',
  },
  {
    title: 'AI for Developers',
    description: 'Open the AI mini hub when the tool question turns into model choices, AI workflows, or developer-facing AI updates.',
    href: '/ai-for-developers',
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

function pickFreshToolReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()
      return (
        post.category === 'developer-tools' ||
        post.category === 'free-tools' ||
        /tool|tools|software|api testing|documentation|git|database|postgres|vpn|open source|open-source|developer workflow/.test(
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

export default function DevToolsWatchPage() {
  const allPosts = getAllPosts()
  const topReads = pickPostsBySlug(allPosts, TOP_READ_SLUGS)
  const latestUsefulReads = pickFreshToolReads(allPosts, 4)
  const worthTestingReads = pickPostsBySlug(allPosts, WORTH_TESTING_SLUGS)

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
        <h1 className="home-section-title">Dev Tools Watch</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused Blixamo mini hub for developer tools worth testing, useful updates, honest alternatives, and current
          reads that help you decide faster.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#top-reads" className="home-hero-button home-hero-button-primary">
            Best starting reads
          </Link>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-secondary">
            Latest useful reads
          </Link>
          <Link href="#worth-testing" className="home-hero-button home-hero-button-secondary">
            Worth testing now
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
            Use this page when you want tool picks and updates that actually affect developer work: practical software,
            honest replacements, comparison reads, and narrow tool decisions worth reopening now.
          </p>
        </div>
      </section>

      <section id="top-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Top Reads</div>
            <h2 className="home-section-title">Best starting reads for this tool lane</h2>
          </div>
          <Link href="/category/developer-tools" className="home-section-link">
            Browse tool lane
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
            <h2 className="home-section-title">Current tool reads worth checking now</h2>
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

      <section id="worth-testing" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Worth Testing / Alternatives / Comparisons</div>
            <h2 className="home-section-title">Tool decisions with a real tradeoff behind them</h2>
          </div>
          <Link href="/category/free-tools" className="home-section-link">
            Browse free tools
          </Link>
        </div>
        <div className="home-post-grid">
          {worthTestingReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Use-It Paths</div>
          <h2 className="home-section-title">Open the path that matches the real tool decision</h2>
        </div>
        <div className="home-quick-grid">
          {USE_IT_PATHS.map((card) => (
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
            Use this page as the focused tool-watch layer. When you want broader freshness, go to Community. When you want
            the full tool lane, open the Developer Tools category next.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/community" className="home-hero-button home-hero-button-secondary">
              Community
            </Link>
            <Link href="/category/developer-tools" className="home-hero-button home-hero-button-secondary">
              Developer Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
