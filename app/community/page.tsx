import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'
import { RESOURCE_HUB_PATH, getResourceHubContent } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Developer Community',
  description:
    'Fresh developer reads, updated guides, comparison picks, and practical topic lanes worth revisiting on Blixamo.',
  alternates: { canonical: 'https://blixamo.com/community' },
}

type CommunityCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

type TopicLane = {
  title: string
  href: string
  posts: Post[]
}

const BUILDING_SHOWCASE: CommunityCard[] = [
  {
    title: 'Self-hosted app stacks',
    description: 'Coolify, Docker Compose, reverse proxy, analytics, and automation on small VPS infrastructure.',
    href: '/category/self-hosting',
    eyebrow: 'What People Are Building',
  },
  {
    title: 'AI-assisted workflows',
    description: 'Claude, API workflows, bots, and automation systems for developers who want faster output.',
    href: '/category/ai',
    eyebrow: 'What People Are Building',
  },
  {
    title: 'Low-cost SaaS setups',
    description: 'Budget-aware MVP stacks, payment setup, free tools, and early-stage product workflows.',
    href: '/blog/build-saas-mvp-zero-budget-2026',
    eyebrow: 'What People Are Building',
  },
]

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

function TopicLaneCard({ lane }: { lane: TopicLane }) {
  return (
    <article
      style={{
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        background: 'var(--surface)',
        padding: '1.15rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
      }}
    >
      <div>
        <Link href={lane.href} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="home-curated-eyebrow" style={{ marginBottom: '0.55rem' }}>
            Topic Scan
          </div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{lane.title}</h3>
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {lane.posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: 'grid',
              gap: '0.2rem',
              textDecoration: 'none',
              color: 'inherit',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {formatFreshnessDate(post)}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>{post.title}</span>
          </Link>
        ))}
      </div>

      <Link href={lane.href} className="home-section-link">
        View topic lane
      </Link>
    </article>
  )
}

export default function CommunityPage() {
  const allPosts = getAllPosts()
  const hub = getResourceHubContent(allPosts)

  const recentGuideUpdates = pickFreshPosts(
    [
      ...hub.popularGuides,
      ...hub.deploymentGuides,
      ...hub.selfHosting,
      ...hub.automation,
      ...hub.webDevelopment,
    ],
    6
  )

  const featuredPracticalReads = uniquePosts([
    ...hub.popularArticles,
    ...hub.deploymentGuides,
    ...hub.freeTools,
    ...hub.indieDevSaas,
  ]).slice(0, 6)

  const latestComparisons = pickFreshPosts(hub.comparisons, 6)

  const latestByTopic: TopicLane[] = [
    {
      title: 'AI & Automation',
      href: '/category/ai',
      posts: pickFreshPosts(allPosts.filter((post) => post.category === 'ai' || post.category === 'automation'), 3),
    },
    {
      title: 'Self Hosting',
      href: '/category/self-hosting',
      posts: pickFreshPosts(allPosts.filter((post) => post.category === 'self-hosting'), 3),
    },
    {
      title: 'Web Development',
      href: '/category/web-dev',
      posts: pickFreshPosts(allPosts.filter((post) => post.category === 'web-dev'), 3),
    },
    {
      title: 'VPS & Deployment',
      href: '/category/vps-cloud',
      posts: pickFreshPosts(
        allPosts.filter((post) => post.category === 'vps-cloud' || post.category === 'how-to'),
        3
      ),
    },
  ].filter((lane) => lane.posts.length > 0)

  const freshnessSignals = [
    {
      label: 'Latest drop',
      value: hub.latestArticles[0] ? formatFreshnessDate(hub.latestArticles[0]) : 'Fresh reads',
      description: 'Newest post live on the site.',
      href: '#latest-community-reads',
    },
    {
      label: 'Guide updates',
      value: `${recentGuideUpdates.length} current reads`,
      description: 'Fresh guides and tutorials surfaced early.',
      href: '#recent-guide-updates',
    },
    {
      label: 'Compare now',
      value: `${latestComparisons.length} decision pages`,
      description: 'Useful verdicts worth checking before you choose a tool or host.',
      href: '#latest-comparisons',
    },
    {
      label: 'Topic lanes',
      value: `${latestByTopic.length} fast scans`,
      description: 'Latest by topic without opening the full archive first.',
      href: '#latest-by-topic',
    },
  ]

  const popularGuideSlugs = [
    'deploy-apps-on-vps-complete-guide',
    'self-hosting-complete-guide',
    'developer-tools-directory',
    'automation-guide-for-developers',
    'free-tools-for-developers',
    'comparisons-hub',
  ]

  const popularGuideCards = popularGuideSlugs
    .map((slug) => hub.pillarPages.find((page) => page.slug === slug))
    .filter((page): page is NonNullable<typeof page> => Boolean(page))
    .map((page) => ({
      title: page.title,
      description: page.description,
      href: page.href,
      eyebrow: 'Guide',
    }))

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section className="home-resource-promo">
        <div className="home-resource-promo-copy">
          <div className="home-section-kicker">Community</div>
          <h1 className="home-section-title">Latest useful reads, updated guides, and practical comparisons for developers.</h1>
          <p className="home-section-description">
            Come back here for what is new on Blixamo: fresh articles, current guide updates, strong comparison pages,
            and the next topic lane worth following.
          </p>
          <div className="home-hero-actions">
            <Link href="#latest-community-reads" className="home-hero-button home-hero-button-primary">
              Latest Articles
            </Link>
            <Link href="#recent-guide-updates" className="home-hero-button home-hero-button-secondary">
              Updated Guides
            </Link>
            <Link href="#featured-practical-reads" className="home-hero-button home-hero-button-secondary">
              Practical Reads
            </Link>
            <Link href="#latest-comparisons" className="home-hero-button home-hero-button-secondary">
              Latest Comparisons
            </Link>
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
              Resources Hub
            </Link>
            <Link href="/" className="home-hero-button home-hero-button-secondary">
              Homepage
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

      <section id="latest-community-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Articles</div>
            <h2 className="home-section-title">Fresh reads worth checking now</h2>
            <p className="home-section-description">
              The newest useful posts land first here so the page feels current instead of acting like another route map.
            </p>
          </div>
          <Link href="/blog" className="home-section-link">
            Open full archive
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.latestArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="recent-guide-updates" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Recently Updated Guides</div>
            <h2 className="home-section-title">Current tutorials and guide-driven reads</h2>
            <p className="home-section-description">
              These are the guides and how-to style reads that still feel timely for developers shipping now.
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

      <section id="featured-practical-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Featured Practical Reads</div>
            <h2 className="home-section-title">Strong articles worth reopening right now</h2>
            <p className="home-section-description">
              A small editorial layer for practical reads with lasting utility, not just the newest publish date.
            </p>
          </div>
          <Link href="/blog" className="home-section-link">
            Browse all articles
          </Link>
        </div>
        <div className="home-post-grid">
          {featuredPracticalReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Useful Comparisons</div>
            <h2 className="home-section-title">Decision pages that are still worth reading now</h2>
            <p className="home-section-description">
              Hosting, deployment, AI, and tooling comparisons should surface early here because they age faster than static hub copy.
            </p>
          </div>
          <Link href="/guides/comparisons-hub" className="home-section-link">
            Open comparisons hub
          </Link>
        </div>
        <div className="home-post-grid">
          {latestComparisons.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-by-topic" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest by Topic</div>
            <h2 className="home-section-title">Quick scans for the main developer lanes</h2>
            <p className="home-section-description">
              A lighter way to scan what is fresh in each lane without turning this page into another hub.
            </p>
          </div>
        </div>
        <div className="home-discovery-grid">
          {latestByTopic.map((lane) => (
            <TopicLaneCard key={lane.title} lane={lane} />
          ))}
        </div>
      </section>

      <section id="showcase" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">What People Are Building</div>
          <h2 className="home-section-title">Projects and stacks developers keep circling back to</h2>
          <p className="home-section-description">
            Useful ideas for where to go next, without pulling the page back into broad site navigation.
          </p>
        </div>
        <div className="home-quick-grid">
          {BUILDING_SHOWCASE.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="popular-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Guides</div>
            <h2 className="home-section-title">Guides worth keeping close</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
            Browse all guides
          </Link>
        </div>
        <div className="home-quick-grid">
          {popularGuideCards.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="explore-categories" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Explore Categories</div>
            <h2 className="home-section-title">Topic lanes stay within reach</h2>
            <p className="home-section-description">
              Categories still help with depth, but they now sit behind the fresher reads instead of leading the page.
            </p>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#resource-categories`} className="home-section-link">
            Open category hub
          </Link>
        </div>
        <div className="home-discovery-grid">
          {hub.categoryCards.map((card) => (
            <Link key={card.title} href={card.href} className="home-discovery-card">
              <div className="home-discovery-icon" style={{ color: card.accentColor }}>
                {card.icon}
              </div>
              <div className="home-discovery-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="community-next-paths" className="home-section-shell">
        <div className="home-newsletter-panel">
          <div className="home-section-kicker">Keep Reading</div>
          <h2 className="home-section-title" style={{ marginTop: '0.75rem' }}>Freshness first, deeper paths when you need them</h2>
          <p className="home-section-description" style={{ marginTop: '0.75rem' }}>
            Community stays the return page for current reads. When you want more structure, jump into the archive, comparisons,
            resources hub, or the main site overview.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
            <Link href="/blog" className="home-hero-button home-hero-button-primary">
              Browse Blog
            </Link>
            <Link href="/guides/comparisons-hub" className="home-hero-button home-hero-button-secondary">
              Comparisons Hub
            </Link>
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
              Resources Hub
            </Link>
            <Link href="/" className="home-hero-button home-hero-button-secondary">
              Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
