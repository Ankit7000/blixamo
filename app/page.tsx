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
  const recentPosts = allPosts.filter((post) => post.slug !== featuredGuide?.slug).slice(0, 6)
  const popularPosts = allPosts.slice(0, 5)
  const categories = Object.keys(CATEGORY_META)
    .filter((slug) => allPosts.some((post) => post.category === slug))
    .map((slug) => ({
      slug,
      meta: getCategoryMeta(slug),
      count: allPosts.filter((post) => post.category === slug).length,
    }))

  const featuredCategory = featuredGuide ? getCategoryMeta(featuredGuide.category) : null

  return (
    <>
      <WebsiteJsonLd />

      <section className="home-hero-shell">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="home-hero-kicker">Independent Developer Publication</div>
            <h1 className="home-hero-title">
              Practical guides for self-hosting, AI workflows, deployment, and modern web apps.
            </h1>
            <p className="home-hero-description">
              Blixamo helps developers ship faster with tested tutorials, real VPS and infrastructure
              notes, honest tool comparisons, and automation workflows that hold up outside generic
              tutorials.
            </p>

            <div className="home-hero-actions">
              <Link href="/blog" className="home-hero-button home-hero-button-primary">
                Browse Articles
              </Link>
              <Link href="#homepage-categories" className="home-hero-button home-hero-button-secondary">
                Explore Categories
              </Link>
            </div>

            <div className="home-hero-trust-grid">
              <div className="home-hero-trust-card">
                <strong>{allPosts.length}+</strong>
                <span>production-focused articles</span>
              </div>
              <div className="home-hero-trust-card">
                <strong>{categories.length}</strong>
                <span>focused categories</span>
              </div>
              <div className="home-hero-trust-card">
                <strong>VPS to AI</strong>
                <span>one place for shipping and operating</span>
              </div>
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
          </div>
        </div>
      </section>

      <section id="homepage-categories" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Browse Blixamo</div>
          <h2 className="home-section-title">Explore by category</h2>
          <p className="home-section-description">
            Find focused guides on infrastructure, web development, automation, AI, and the tools that
            matter when you are building and running real projects.
          </p>
        </div>

        <div className="home-category-grid">
          {categories.map(({ slug, meta, count }) => (
            <Link key={slug} href={`/category/${slug}`} className="home-category-card">
              <div className="home-category-card-top">
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
                <div
                  className="home-category-count"
                  style={{
                    color: meta.color,
                    background: `${meta.color}10`,
                    border: `1px solid ${meta.color}24`,
                  }}
                >
                  {count} posts
                </div>
              </div>

              <h3 className="home-category-title">{meta.label}</h3>
              <p className="home-category-description">{meta.description}</p>

              <div className="home-category-footer">
                <span className="home-category-line" style={{ background: meta.gradient }} />
                <span>Browse category</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
            {recentPosts.map((post) => (
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
    </>
  )
}
