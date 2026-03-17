import Link from 'next/link'
import { AuthorBio } from './AuthorBio'
import { ShareButtons } from './ShareButtons'
import type { Post } from '@/lib/posts'

interface PostFooterProps {
  post: Post
  prev?: Post | null
  next?: Post | null
}

export function PostFooter({ post, prev, next }: PostFooterProps) {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Author bio — full version */}
      <AuthorBio name={post.author} />

      {/* Share row */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Found this useful? Share it.
        </p>
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <div className="post-nav-grid" style={{
          display: 'grid',
          gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          marginBottom: '2rem',
        }}>
          {prev && (
            <Link href={`/blog/${prev.slug}`} style={{
              display: 'block', padding: '1rem', background: 'var(--bg-subtle)',
              border: '1px solid var(--border)', borderRadius: '0.5rem',
              textDecoration: 'none', transition: 'border-color 0.15s',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>← Previous</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{prev.title}</div>
            </Link>
          )}
          {next && (
            <Link href={`/blog/${next.slug}`} style={{
              display: 'block', padding: '1rem', background: 'var(--bg-subtle)',
              border: '1px solid var(--border)', borderRadius: '0.5rem',
              textDecoration: 'none', textAlign: 'right', transition: 'border-color 0.15s',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>Next →</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{next.title}</div>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
