import { getAllPosts, getFeaturedPosts } from '@/lib/posts'
import { CATEGORY_META, getCategoryMeta } from '@/lib/categories'
import { PostCard } from '@/components/blog/PostCard'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blixamo | VPS, AI, Developer Tools, and Web Development',
  description:
    'Blixamo is an independent developer publication covering self-hosting, VPS infrastructure, AI workflows, automation, and modern web development.',
  alternates: { canonical: 'https://blixamo.com' },
}

export default function HomePage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts(1)
  const featuredGuide = featuredPosts[0] || allPosts[0]
  const recentPosts = allPosts.filter((post) => post.slug !== featuredGuide?.slug)
  const latestPosts = recentPosts.slice(0, 6)
  const featuredReads = recentPosts
    .filter((post) => !latestPosts.some((latestPost) => latestPost.slug === post.slug))
    .slice(0, 3)
  const popularPosts = allPosts.slice(0, 5)
  const categories = Object.keys(CATEGORY_META)
    .filter((slug) => allPosts.some((post) => post.category === slug))
    .map((slug) => ({
      slug,
      meta: getCategoryMeta(slug),
      count: allPosts.filter((post) => post.category === slug).length,
    }))

  const featuredCategory = featuredGuide ? getCategoryMeta(featuredGuide.category) : null
  const heroSignals = [
    'Developer Guides',
    'Hosting Tutorials',
    'Tool Comparisons',
    'Self-Hosting Workflows',
  ]
  const platformLanes = [
    {
      title: 'Deploy on real infrastructure',
      description: 'Practical VPS, PM2, Docker, Nginx, and deployment playbooks tested outside toy setups.',
    },
    {
      title: 'Choose tools with clarity',
      description: 'Head-to-head breakdowns for platforms, developer tools, and stacks that actually matter in production.',
    },
    {
      title: 'Automate repetitive work',
      description: 'AI workflows, n8n automations, and self-hosted systems that save time without adding fluff.',
    },
  ]
  const trustBlocks = [
    {
      title: 'What Blixamo covers',
      description: 'Self-hosting, VPS operations, developer tools, automation, AI APIs, and modern web development.',
    },
    {
      title: 'How the content is built',
      description: 'Articles are shaped by real implementations, deploys, comparisons, and failure notes rather than generic summaries.',
    },
    {
      title: 'Who it is for',
      description: 'Developers, indie builders, and small teams who need practical guidance for shipping and operating projects.',
    },
  ]

  return (
    <>
      <WebsiteJsonLd />

      <section className="home-hero-shell">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="home-hero-kicker">Independent Developer Publication</div>
            <h1 className="home-hero-title">
              Blixamo helps developers ship, self-host, automate, and choose the right stack with confidence.
            </h1>
            <p className="home-hero-description">
              Practical guides for developers who want sharper deployment workflows, better tool choices,
              credible self-hosting tutorials, and modern web infrastructure advice that holds up in
              production.
            </p>

            <div className="home-hero-signal-row">
              {heroSignals.map((signal) => (
                <span key={signal} className="home-hero-signal">
                  {signal}
                </span>
              ))}
            </div>

            <div className="home-hero-actions">
              <Link href="/blog" className="home-hero-button home-hero-button-primary">
                Browse Articles
              </Link>
              <Link href="#homepage-categories" className="home-hero-button home-hero-button-secondary">
                Explore Categories
              </Link>
            </div>

            <div className="home-platform-grid">
              {platformLanes.map((lane) => (
                <div key={lane.title} className="home-platform-card">
                  <strong>{lane.title}</strong>
                  <span>{lane.description}</span>
                </div>
              ))}
            </div>

            {featuredGuide && featuredCategory && (
              <Link href={`/blog/${featuredGuide.slug}`} className="home-hero-feature-card">
                <div className="home-hero-feature-label">Featured Guide</div>
                <div className="home-hero-feature-title">{featuredGuide.title}</div>
                <p className="home-hero-feature-description">{featuredGuide.description}</p>
                <div className="home-hero-feature-meta">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: featuredCategory.color,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{featuredCategory.icon}</span>
                    {featuredCategory.label}
                  </span>
                  <span>{featuredGuide.readingTime}</span>
                </div>
              </Link>
            )}
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-image-wrap">
              <Image
                src="/images/home-hero.svg"
                alt="Blixamo branded illustration showing code, servers, deployment pipelines, and AI workflows"
                width={720}
                height={540}
                priority
                className="home-hero-image"
                unoptimized
              />
            </div>
            <div className="home-hero-stat-strip">
              <div className="home-hero-stat-card">
                <strong>{allPosts.length}+</strong>
                <span>production-focused guides</span>
              </div>
              <div className="home-hero-stat-card">
                <strong>{categories.length}</strong>
                <span>canonical topic lanes</span>
              </div>
              <div className="home-hero-stat-card">
                <strong>VPS to AI</strong>
                <span>one platform for shipping and operating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="homepage-categories" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Browse Blixamo</div>
          <h2 className="home-section-title">Explore the core category lanes</h2>
          <p className="home-section-description">
            Every category maps to a clear technical area so visitors can go straight to deployment,
            self-hosting, automation, AI, or tool decisions without wading through generic blog noise.
          </p>
        </div>

        <div className="home-category-grid">
          {categories.map(({ slug, meta, count }) => (
            <Link key={slug} href={`/category/${slug}`} className="home-category-card">
              <div className="home-category-card-top">
                <div className="home-category-symbol" style={{ color: meta.color, borderColor: `${meta.color}40` }}>
                  {meta.symbol}
                </div>
                <div
                  className="home-category-icon"
                  style={{
                    color: meta.color,
                    background: `${meta.color}12`,
                    border: `1px solid ${meta.color}2e`,
                  }}
                >
                  {meta.icon}
                </div>
              </div>

              <div className="home-category-count" style={{ color: meta.color, background: `${meta.color}10` }}>
                {count} posts
              </div>
              <h3 className="home-category-title">{meta.label}</h3>
              <p className="home-category-description">{meta.longDesc}</p>

              <div className="home-category-footer">
                <span className="home-category-line" style={{ background: meta.gradient }} />
                <span>Browse category</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredGuide && featuredCategory && (
        <section className="home-section-shell">
          <div className="home-section-head">
            <div className="home-section-kicker">Featured Content</div>
            <h2 className="home-section-title">Start with the strongest reads</h2>
            <p className="home-section-description">
              A curated set of practical guides and comparisons to help new visitors understand what
              Blixamo does best before they dive into the full archive.
            </p>
          </div>

          <div className="home-featured-layout">
            <Link href={`/blog/${featuredGuide.slug}`} className="home-featured-lead">
              <div className="home-featured-media">
                {featuredGuide.featuredImage ? (
                  <Image
                    src={featuredGuide.featuredImage}
                    alt={featuredGuide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="home-featured-fallback" style={{ background: featuredCategory.gradient }}>
                    <span>{featuredCategory.icon}</span>
                  </div>
                )}
              </div>
              <div className="home-featured-content">
                <div className="home-featured-badge" style={{ color: featuredCategory.color }}>
                  {featuredCategory.icon} {featuredCategory.label}
                </div>
                <h3 className="home-featured-title">{featuredGuide.title}</h3>
                <p className="home-featured-copy">{featuredGuide.description}</p>
                <div className="home-featured-meta">
                  <span>{featuredGuide.readingTime}</span>
                  <span>Featured guide</span>
                </div>
              </div>
            </Link>

            <div className="home-featured-stack">
              {featuredReads.map((post) => {
                const meta = getCategoryMeta(post.category)
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="home-featured-mini">
                    <div className="home-featured-mini-top">
                      <span className="home-featured-mini-symbol" style={{ color: meta.color }}>
                        {meta.symbol}
                      </span>
                      <span className="home-featured-mini-category" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="home-featured-mini-title">{post.title}</h3>
                    <p className="home-featured-mini-copy">{post.description}</p>
                    <div className="home-featured-mini-meta">{post.readingTime}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <div
        className="homepage-grid"
        style={{
          maxWidth: '1120px',
          margin: '2.5rem auto',
          padding: '0 1rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 320px',
          gap: '3rem',
        }}
      >
        <main>
          <div className="home-section-head home-section-head-inline">
            <div>
              <div className="home-section-kicker">Fresh On Blixamo</div>
              <h2 className="home-section-title">Latest articles</h2>
              <p className="home-section-description">
                New tutorials, infrastructure notes, tool comparisons, and practical developer workflows.
              </p>
            </div>
            <Link href="/blog" className="home-section-link">
              View all articles
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </main>

        <aside className="homepage-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="home-side-card">
            <h3 className="home-side-title">Popular Posts</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {popularPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'flex',
                    gap: '0.9rem',
                    alignItems: 'flex-start',
                    padding: '0.85rem 0',
                    borderBottom: index < popularPosts.length - 1 ? '1px solid var(--border)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      minWidth: '2rem',
                      fontSize: '1rem',
                      lineHeight: 1.3,
                      color: 'var(--accent)',
                      fontWeight: 800,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {post.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.readingTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="home-side-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>Newsletter</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Weekly digest for developers
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
              Get the strongest Blixamo guides on hosting, automation, AI tools, and web development in one email.
            </p>
            <EmailCapture placement="inline" />
          </div>

          <div className="home-side-card">
            <h3 className="home-side-title">What Blixamo Covers</h3>
            <div className="home-topic-cloud">
              {['Next.js', 'VPS', 'AI APIs', 'n8n', 'Self-Hosting', 'Tailwind', 'Developer Tools', 'Automation'].map((topic) => (
                <span key={topic} className="home-topic-chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="home-proof-shell">
        <div className="home-proof-panel">
          <div className="home-proof-copy">
            <div className="home-section-kicker">Why Blixamo</div>
            <h2 className="home-section-title">Built for developers who care about real implementation details</h2>
            <p className="home-section-description">
              Blixamo is designed to feel more like a practical operating manual than a generic content
              site. The goal is clarity, trustworthy technical guidance, and faster decision-making.
            </p>
            <Link href="/about" className="home-section-link">
              Learn more about Blixamo
            </Link>
          </div>
          <div className="home-proof-grid">
            {trustBlocks.map((block) => (
              <div key={block.title} className="home-proof-card">
                <h3>{block.title}</h3>
                <p>{block.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
