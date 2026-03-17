import Link from 'next/link'
import type { Post } from '@/lib/posts'

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null
  return (
    <section style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Related Articles</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {posts.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{
            display: 'block', padding: '1rem',
            background: 'var(--bg-subtle)', border: '1px solid var(--border)',
            borderRadius: '0.5rem', color: 'var(--text-primary)',
            transition: 'border-color 0.15s',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>{p.category}</span>
            <p style={{ fontWeight: 600, marginTop: '0.3rem', lineHeight: 1.4, fontSize: '0.95rem' }}>{p.title}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{p.readingTime}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
