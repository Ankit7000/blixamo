import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Next.js MDX Hub',
  description:
    'A focused Blixamo mini hub for Next.js MDX setup, production publishing, runtime fixes, and content-architecture decisions.',
  alternates: { canonical: 'https://blixamo.com/nextjs-mdx-hub' },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOP_READ_SLUGS = [
  'nextjs-mdx-blog-2026',
  'nextjs-mdx-blog-syntax-highlighting-rss-sitemap-seo',
  'next-mdx-remote-rsc-vs-next-mdx-nextjs-15',
  'nextjs-mdx-remote-rsc-edge-runtime-fix',
] as const

const SETUP_AND_UPGRADE_PATHS: MiniHubCard[] = [
  {
    title: 'Start with the file-backed setup',
    description: 'Use this first when you still need the App Router, posts library, frontmatter, and the base MDX publishing flow.',
    href: '/blog/nextjs-mdx-blog-2026',
    eyebrow: 'Setup',
  },
  {
    title: 'Harden the publishing layer',
    description: 'Open this next when the route already works and you need syntax highlighting, RSS, sitemap, metadata, and cleaner SEO.',
    href: '/blog/nextjs-mdx-blog-syntax-highlighting-rss-sitemap-seo',
    eyebrow: 'Upgrade',
  },
] as const

const RUNTIME_AND_ARCHITECTURE_PATHS: MiniHubCard[] = [
  {
    title: 'Fix runtime inheritance first',
    description: 'Use this path when the MDX route works locally, breaks after deploy, or inherits Edge while the content path still needs Node.js.',
    href: '/blog/nextjs-mdx-remote-rsc-edge-runtime-fix',
    eyebrow: 'Runtime Fix',
  },
  {
    title: 'Choose the MDX architecture',
    description: 'Open this when you are still deciding between file-backed `next-mdx-remote/rsc` and route-level `@next/mdx`.',
    href: '/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15',
    eyebrow: 'Architecture',
  },
] as const

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'Web Development category',
    description: 'Go wider when the question moves beyond MDX into broader Next.js, Tailwind, and frontend production work.',
    href: '/category/web-dev',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Deployment Hub',
    description: 'Open this when the content stack is ready and the next problem is hosting, reverse proxying, revalidation, or shipping the site.',
    href: '/tag/deployment',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Community',
    description: 'Use Community when you want fresher reads and the next useful post in this cluster without opening the full archive.',
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

function pickFreshMdxReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()

      return (
        TOP_READ_SLUGS.includes(post.slug as (typeof TOP_READ_SLUGS)[number]) ||
        (post.category === 'web-dev' &&
          /mdx|next-mdx-remote|frontmatter|rss|sitemap|syntax highlighting|content architecture|content system/.test(text))
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

export default function NextjsMdxHubPage() {
  const allPosts = getAllPosts()
  const topReads = pickPostsBySlug(allPosts, TOP_READ_SLUGS)
  const latestUsefulReads = pickFreshMdxReads(allPosts, 4)

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
        <h1 className="home-section-title">Next.js MDX Hub</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused route for practical Next.js MDX setup, production publishing, runtime fixes, and content-system choices
          that matter once the blog needs to behave like real infrastructure.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#top-reads" className="home-hero-button home-hero-button-primary">
            Best starting reads
          </Link>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-secondary">
            Latest useful reads
          </Link>
          <Link href="#setup-upgrade-path" className="home-hero-button home-hero-button-secondary">
            Setup and upgrade path
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
            Use this page when you are building or repairing a file-backed Next.js MDX publishing setup and want the shortest
            route into setup, upgrade, runtime, and architecture reads without widening into a generic Next.js archive.
          </p>
        </div>
      </section>

      <section id="top-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Top Reads</div>
            <h2 className="home-section-title">Best starting reads for the MDX content stack</h2>
          </div>
          <Link href="/category/web-dev" className="home-section-link">
            Browse web lane
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
            <h2 className="home-section-title">Current MDX and content-infra reads worth reopening</h2>
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

      <section id="setup-upgrade-path" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical Setup / Upgrade Path</div>
            <h2 className="home-section-title">Move from working MDX route to production-ready publishing</h2>
          </div>
          <Link href="/tag/deployment" className="home-section-link">
            Open deployment hub
          </Link>
        </div>
        <div className="home-quick-grid">
          {SETUP_AND_UPGRADE_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="runtime-architecture-path" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Runtime Fix / Architecture Decision Path</div>
          <h2 className="home-section-title">Solve the breakage or choose the shape of the content system</h2>
        </div>
        <div className="home-quick-grid">
          {RUNTIME_AND_ARCHITECTURE_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Related Lanes</div>
          <h2 className="home-section-title">Move wider only when the question stops being about the MDX system</h2>
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
            Keep this hub for the MDX lane. Jump to Web Development for broader frontend work or Community for fresher reads.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/category/web-dev" className="home-hero-button home-hero-button-secondary">
              Web Development
            </Link>
            <Link href="/community" className="home-hero-button home-hero-button-secondary">
              Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
