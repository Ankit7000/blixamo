import { getAllPosts, getFeaturedPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blixamo — Tech, Tips & Trends',
  description: 'Blixamo covers the latest in tech, tutorials, AI, and digital tools to help you stay ahead.',
  alternates: { canonical: 'https://blixamo.com' },
}

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  ai:        { icon: '🤖', color: '#7c3aed' },
  tech:      { icon: '⚡', color: '#059669' },
  tutorials: { icon: '📖', color: '#0891b2' },
  tools:     { icon: '🔧', color: '#d97706' },
}

export default function HomePage() {
  const allPosts  = getAllPosts()
  const featured  = getFeaturedPosts(1)
  const hero      = featured[0] || allPosts[0]
  const recent    = allPosts.filter(p => p.slug !== hero?.slug).slice(0, 6)
  const popular   = allPosts.slice(0, 5)
  const cats      = ['ai', 'tech', 'tutorials', 'tools']

  return (
    <>
      <WebsiteJsonLd />

      {/* ── HERO ── */}
      {hero && (
        <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
          <div className="hero-section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <Link href={`/category/${hero.category}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 0.85rem', borderRadius: '2rem', marginBottom: '1rem',
                  background: `${CATEGORY_META[hero.category]?.color}22`,
                  border: `1px solid ${CATEGORY_META[hero.category]?.color}44`,
                  color: CATEGORY_META[hero.category]?.color,
                  fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {CATEGORY_META[hero.category]?.icon} {hero.category}
                </Link>
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  <Link href={`/blog/${hero.slug}`} style={{ color: 'inherit' }}>{hero.title}</Link>
                </h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1.05rem' }}>{hero.description}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link href={`/blog/${hero.slug}`} style={{ padding: '0.65rem 1.5rem', background: 'var(--accent)', color: '#fff', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                    Read Article →
                  </Link>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>⏱ {hero.readingTime}</span>
                </div>
              </div>
              <Link href={`/blog/${hero.slug}`} style={{ display: 'block', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                {hero.featuredImage ? (
                  <Image src={hero.featuredImage} alt={hero.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${CATEGORY_META[hero.category]?.color ?? '#6c63ff'} 0%, #a78bfa 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                    {CATEGORY_META[hero.category]?.icon}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY PILLS ── */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="category-pills-row" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>BROWSE:</span>
          {cats.map(cat => {
            const count = allPosts.filter(p => p.category === cat).length
            const meta  = CATEGORY_META[cat]
            return (
              <Link key={cat} href={`/category/${cat}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.35rem 0.9rem', borderRadius: '2rem',
                border: '1px solid var(--border)', background: 'var(--bg)',
                fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)',
                textDecoration: 'none', textTransform: 'capitalize',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{meta?.icon}</span>
                {cat}
                <span style={{ fontSize: '0.72rem', color: meta?.color, fontWeight: 700, background: `${meta?.color}18`, padding: '0 5px', borderRadius: '1rem' }}>{count}</span>
              </Link>
            )
          })}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{allPosts.length} articles</span>
        </div>
      </section>

      {/* ── MAIN + SIDEBAR ── */}
      <div className="homepage-grid" style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '3rem' }}>
        <main>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Latest Articles</h2>
            <Link href="/blog" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {recent.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </main>
        <aside className="homepage-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>🔥 Popular Posts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {popular.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  padding: '0.75rem 0', borderBottom: i < popular.length - 1 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none',
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)', minWidth: '1.5rem', lineHeight: 1.4 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.2rem' }}>{post.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.readingTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📬</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Weekly Digest</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>Get the best dev tools, tutorials and AI picks every week.</p>
            <EmailCapture placement="inline" />
          </div>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Topics</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['Next.js','AI Tools','VPS','Tailwind','Claude','Open Source','Free Tools','ChatGPT'].map(tag => (
                <span key={tag} style={{ padding: '0.25rem 0.65rem', borderRadius: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
