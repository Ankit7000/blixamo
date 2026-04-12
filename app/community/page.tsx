import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getIndexablePosts, getPostFreshnessDate, type Post } from '@/lib/posts'
import { getResourceHubContent } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Developer Community',
  description:
    'Curated developer reads, updated guides, and strong comparison picks worth checking now on Blixamo.',
  alternates: { canonical: 'https://blixamo.com/community' },
}

type CuratedRead = {
  slug: string
  reason: string
}

const COMMUNITY_SUPPORT_PATHS = [
  {
    title: 'Need hands-on help?',
    description: 'Use Services when the next step is implementation, migration sequencing, or direct operator support rather than more reading.',
    href: '/services',
    label: 'See services',
  },
  {
    title: 'Need a lighter artifact first?',
    description: 'Use Products when a checklist, runbook, or workflow pack may solve the problem without a larger engagement.',
    href: '/products',
    label: 'Browse products',
  },
  {
    title: 'Want low-noise updates?',
    description: 'Use Subscribe if you mainly want practical publication updates and occasional builder notes instead of another social follow.',
    href: '/subscribe',
    label: 'Go to subscribe',
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

function pickFreshPosts(posts: Post[], limit = 6): Post[] {
  return uniquePosts(posts)
    .sort((a, b) => getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime())
    .slice(0, limit)
}

function formatFreshnessDate(post: Pick<Post, 'date' | 'updatedAt'>): string {
  return getPostFreshnessDate(post).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}


export default function CommunityPage() {
  const allPosts = getIndexablePosts()
  const hub = getResourceHubContent(allPosts)
  const worthYourTimeNow: Array<CuratedRead & { post: Post }> = [
    {
      slug: 'coolify-vs-caprover-2026',
      reason: 'Read this before a small-VPS platform decision. It is the fastest way into the right self-hosting tradeoff.',
    },
    {
      slug: 'vps-security-harden-ubuntu-2026',
      reason: 'Still one of the strongest operator reads on the site because it ties hardening to concrete production outcomes.',
    },
    {
      slug: 'open-source-tools-2026',
      reason: 'Worth opening when you want to cut tool spend without adopting slow or half-baked replacements.',
    },
  ]
    .map((item) => {
      const post = allPosts.find((candidate) => candidate.slug === item.slug)
      return post ? { ...item, post } : null
    })
    .filter((item): item is CuratedRead & { post: Post } => Boolean(item))

  const latestEditorialReads = hub.latestArticles.slice(0, 4)

  const recentGuideUpdates = pickFreshPosts(
    [
      ...hub.popularGuides,
      ...hub.deploymentGuides,
      ...hub.selfHosting,
      ...hub.automation,
      ...hub.webDevelopment,
    ],
    4
  )

  const latestComparisons = pickFreshPosts(hub.comparisons, 4)

  const freshnessSignals = [
    {
      label: 'Read First',
      value: `${worthYourTimeNow.length} editor picks`,
      description: 'Start with the three hand-picked reads just below.',
      href: '#worth-your-time-now',
    },
    {
      label: 'Shipping Now',
      value: `${recentGuideUpdates.length} updated guides`,
      description: 'Best for deploys, migrations, and active implementation work.',
      href: '#recent-guide-updates',
    },
    {
      label: 'Choose Carefully',
      value: `${latestComparisons.length} comparison reads`,
      description: 'Open these before changing a host, platform, or developer tool.',
      href: '#latest-comparisons',
    },
  ]

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section className="home-resource-promo">
        <div className="home-resource-promo-copy">
          <div className="home-section-kicker">Community</div>
          <h1 className="home-section-title">What matters now on Blixamo if you are actively building, shipping, or choosing your next tool.</h1>
          <p className="home-section-description">
            This page is for developers who do not want to scan everything. Start here when you want the current reads
            most likely to help with a deploy, a tooling decision, or a practical workflow change.
          </p>
          <div className="home-hero-actions">
            <Link href="#worth-your-time-now" className="home-hero-button home-hero-button-primary">
              Read First
            </Link>
            <Link href="#recent-guide-updates" className="home-hero-button home-hero-button-secondary">
              Updated Guides
            </Link>
            <Link href="#latest-comparisons" className="home-hero-button home-hero-button-secondary">
              Compare Before Choosing
            </Link>
          </div>
        </div>

        <div className="home-resource-promo-grid">
          {freshnessSignals.map((signal) => (
            <Link key={signal.label} href={signal.href} className="home-resource-promo-card">
              <span className="home-curated-eyebrow">{signal.label}</span>
              <h3>{signal.value}</h3>
              <p>{signal.description}</p>
              <span className="home-section-link" style={{ marginTop: '0.25rem' }}>
                Jump in
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="worth-your-time-now" className="home-section-shell">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.35rem',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              padding: '1.2rem 1.25rem',
              borderRadius: '1rem',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div className="home-section-kicker">Editorial Note</div>
            <h2 className="home-section-title" style={{ marginTop: '0.4rem' }}>
              This page is strongest when you need an opinionated short list, not more browsing
            </h2>
            <p className="home-section-description" style={{ marginBottom: '0.75rem' }}>
              The most useful reads on Blixamo right now are decision pages, updated implementation guides, and
              budget-aware tool picks that can change what you do this week.
            </p>
            <p className="home-section-description" style={{ marginBottom: 0 }}>
              Use Community when you are actively shipping and want a smaller editorial cut of the site. Read the
              manual picks first, then move into guides or comparisons only if they match the decision in front of you.
            </p>
          </div>

          <div
            style={{
              padding: '1.2rem 1.25rem',
              borderRadius: '1rem',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div className="home-section-kicker">Worth Your Time Now</div>
            <h2 className="home-section-title" style={{ marginTop: '0.4rem', fontSize: '1.4rem' }}>
              Three reads I would open first
            </h2>
            <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
              {worthYourTimeNow.map(({ post, reason }) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    paddingBottom: '0.9rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'grid',
                    gap: '0.25rem',
                  }}
                >
                  <span className="home-curated-eyebrow">{formatFreshnessDate(post)}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>{post.title}</span>
                  <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{reason}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="budget-first-reads" className="home-section-shell">
        <div
          style={{
            padding: '1.2rem 1.25rem',
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="home-section-kicker">Budget-First Route</div>
          <h2 className="home-section-title" style={{ marginTop: '0.4rem' }}>
            Use this section when the next decision is tool spend, not another feed refresh
          </h2>
          <p className="home-section-description" style={{ marginBottom: '0.8rem' }}>
            The strongest low-cost workflow path on Blixamo starts with the{' '}
            <Link href="/category/free-tools">free tools category</Link>, then widens into the{' '}
            <Link href="/guides/free-tools-for-developers">Free Tools for Developers guide</Link>, the{' '}
            <Link href="/guides/developer-tools-directory">Developer Tools Directory</Link>, and the{' '}
            <Link href="/tag/deployment">deployment resources hub</Link> depending on whether you need a narrower
            replacement, a broader tooling lane, or a full stack decision.
          </p>
          <div className="home-quick-grid">
            <Link href="/category/free-tools" className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Category</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">Free Tools</h3>
              <p className="home-curated-copy">
                Start here when you want the strongest budget-first articles without turning Community into another
                archive page.
              </p>
              <div className="home-curated-footer">
                <span>Workflow picks</span>
                <span>Read next</span>
              </div>
            </Link>
            <Link href="/guides/free-tools-for-developers" className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Pillar Guide</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">Free Tools for Developers</h3>
              <p className="home-curated-copy">
                Use the guide when one free-tool article is not enough and you want the indexed cluster path.
              </p>
              <div className="home-curated-footer">
                <span>Budget-first map</span>
                <span>Open guide</span>
              </div>
            </Link>
            <Link href="/guides/developer-tools-directory" className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Directory</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">Developer Tools Directory</h3>
              <p className="home-curated-copy">
                Move here when the question shifts from free replacements to the wider software stack around them.
              </p>
              <div className="home-curated-footer">
                <span>Tooling lane</span>
                <span>Open guide</span>
              </div>
            </Link>
            <Link href="/tag/deployment" className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Resources Hub</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">Deployment Resources Hub</h3>
              <p className="home-curated-copy">
                Open this when the tool decision affects hosting, self-hosting, or the stack you plan to operate.
              </p>
              <div className="home-curated-footer">
                <span>Stack context</span>
                <span>Open hub</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="latest-community-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Articles</div>
            <h2 className="home-section-title">New reads that earned a place here</h2>
            <p className="home-section-description">
              New posts matter here only when they are useful enough to be worth your attention now.
            </p>
          </div>
          <Link href="/blog" className="home-section-link">
            See all posts
          </Link>
        </div>
        <div className="home-post-grid">
          {latestEditorialReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="recent-guide-updates" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Recently Updated Guides</div>
            <h2 className="home-section-title">Updated guides worth reopening</h2>
            <p className="home-section-description">
              Reopen these when you are mid-project and need the clearest current implementation path.
            </p>
          </div>
          <Link href="/category/how-to" className="home-section-link">
            Browse guides
          </Link>
        </div>
        <div className="home-post-grid">
          {recentGuideUpdates.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Useful Comparisons</div>
            <h2 className="home-section-title">Comparison reads worth opening before you switch</h2>
            <p className="home-section-description">
              These matter most when you are about to change a host, platform, or developer tool and want a sharper call.
            </p>
          </div>
          <Link href="/guides/comparisons-hub" className="home-section-link">
            See all comparisons
          </Link>
        </div>
        <div className="home-post-grid">
          {latestComparisons.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '1.25rem',
            padding: '1.35rem',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(255,255,255,0.98) 100%)',
          }}
        >
          <div style={{ maxWidth: '760px' }}>
            <div className="home-section-kicker">Need More Than Reading?</div>
            <h2 className="home-section-title" style={{ marginTop: '0.4rem' }}>
              Community stays editorial first, but the next step should still be easy to find.
            </h2>
            <p className="home-section-description">
              If one of these reads turns into a real implementation problem, a workflow cleanup, or a pack you want to use internally, these are the clean next routes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              marginTop: '1.25rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {COMMUNITY_SUPPORT_PATHS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1rem 1.05rem',
                  background: 'var(--bg)',
                  display: 'grid',
                  gap: '0.45rem',
                }}
              >
                <span className="home-curated-eyebrow">{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>{item.title}</span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
