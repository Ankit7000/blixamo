import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/posts'
import { getCategoryMeta } from '@/lib/categories'

const DEFAULT_IMG = '/images/default-og.jpg'

function isRealImage(path: string) {
  return path && path !== DEFAULT_IMG && !path.includes('undefined')
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const hasImage = isRealImage(post.featuredImage)
  const categoryMeta = getCategoryMeta(post.category)
  const gradient = categoryMeta.gradient
  const icon = categoryMeta.icon
  const displayDate = post.updatedAt || post.date
  const formattedDate = new Date(displayDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const dateLabel = post.updatedAt ? `Updated ${formattedDate}` : formattedDate

  return (
    <article className="article-card" style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '0.875rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`} style={{
        display: 'block',
        aspectRatio: featured ? '16/7' : '16/9',
        position: 'relative',
        overflow: 'hidden',
        background: gradient,
      }}>
        {hasImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: featured ? '3.5rem' : '2.5rem', opacity: 0.9 }}>{icon}</span>
          </div>
        )}
      </Link>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Category */}
        <Link href={`/category/${post.category}`} className="category-badge" style={{ width: 'fit-content' }}>
          {categoryMeta.label}
        </Link>

        {/* Title */}
        <h2 style={{
          fontSize: featured ? '1.4rem' : '1.05rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
        }}>
          <Link href={`/blog/${post.slug}`} style={{ color: 'inherit' }}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{post.description}</p>

        {/* Meta row */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem',
        }}>
          <time dateTime={displayDate}>
            {dateLabel}
          </time>
          <span>|</span>
          <span>{post.readingTime}</span>
          {post.featured && (
            <>
              <span>|</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Featured</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
