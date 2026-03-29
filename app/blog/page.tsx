import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { TemplateLinkBar } from '@/components/layout/TemplateLinkBar'
import { Pagination } from '@/components/ui/Pagination'
import { getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 10

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse all tech articles, tutorials, AI guides and tool reviews on Blixamo.',
  alternates: { canonical: 'https://blixamo.com/blog' },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const hub = getResourceHubContent(posts)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const pagePosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <TemplateLinkBar relatedHref="/guides/deploy-apps-on-vps-complete-guide" relatedLabel="Deploy Apps on VPS Guide" />

      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          background: 'var(--surface)',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>All Articles</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.75 }}>
          {posts.length} articles published
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="/" className="home-hero-button home-hero-button-secondary">
            Homepage
          </Link>
          <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
            Resources Hub
          </Link>
          <Link href="/community" className="home-hero-button home-hero-button-secondary">
            Community
          </Link>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-hero-button home-hero-button-secondary">
            Pillar Guides
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Start Here</div>
            <h2 className="home-section-title">Use the main hubs before diving into the archive</h2>
          </div>
          <Link href={RESOURCE_HUB_PATH} className="home-section-link">
            Open resources hub
          </Link>
        </div>
        <div className="home-quick-grid">
          {hub.resourceHubEntryCards.slice(0, 4).map((card) => (
            <Link key={card.title} href={card.href} className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">{card.eyebrow ?? 'Explore'}</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">{card.title}</h3>
              <p className="home-curated-copy">{card.description}</p>
              <div className="home-curated-footer">
                <span>Hub path</span>
                <span>Read more</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Explore Categories</div>
            <h2 className="home-section-title">Browse the main topic clusters instead of scanning post-by-post</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#resource-categories`} className="home-section-link">
            Browse all categories
          </Link>
        </div>
        <div className="home-discovery-grid">
          {hub.categoryCards.slice(0, 6).map((card) => (
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

      <section style={{ marginBottom: '2rem' }}>
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Guides</div>
            <h2 className="home-section-title">Strong cluster articles to open from the archive layer</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
            Open pillar guides
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {hub.popularGuides.slice(0, 3).map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      </section>

      <div style={{ marginBottom: '1.25rem' }}>
        <div className="home-section-kicker">Latest Articles</div>
        <h2 className="home-section-title">Newest posts in the archive</h2>
      </div>

      {pagePosts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
          No posts yet — add <code>.mdx</code> files to <code>content/posts/</code>
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {pagePosts.map(post => <PostCard key={post.slug} post={post} />)}
        </div>
      )}

      <Pagination currentPage={1} totalPages={totalPages} basePath="/blog" />
    </div>
  )
}
