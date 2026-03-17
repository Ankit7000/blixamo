import Link from 'next/link'
import { ShareButtons } from './ShareButtons'
import { AuthorBio } from './AuthorBio'
import { AffiliateDisclosure } from '@/components/monetization/AffiliateDisclosure'
import type { Post } from '@/lib/posts'

export function PostHeader({ post }: { post: Post }) {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span>›</span>
        <Link href={`/category/${post.category}`} style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{post.category}</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>{post.title.length > 45 ? post.title.slice(0, 45) + '…' : post.title}</span>
      </nav>

      {/* Category badge */}
      <Link href={`/category/${post.category}`} className="category-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        {post.category}
      </Link>

      {/* Title */}
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.625rem)', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {post.title}
      </h1>

      {/* Description */}
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {post.description}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        <AuthorBio name={post.author} compact />
        <span>·</span>
        <time dateTime={post.date} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          📅 {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        {post.updatedAt && (
          <><span>·</span><span>Updated {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span></>
        )}
        <span>·</span>
        <span>⏱ {post.readingTime}</span>
      </div>

      {/* Share buttons */}
      <ShareButtons title={post.title} slug={post.slug} />

      {/* Affiliate disclosure if needed */}
      {post.tags.includes('affiliate') && <AffiliateDisclosure />}
    </div>
  )
}
