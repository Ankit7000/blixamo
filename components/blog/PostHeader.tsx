import Image from 'next/image'
import Link from 'next/link'
import { ShareButtons } from './ShareButtons'
import { AuthorBio } from './AuthorBio'
import { AffiliateDisclosure } from '@/components/monetization/AffiliateDisclosure'
import type { Post } from '@/lib/posts'
import { getCategoryMeta } from '@/lib/categories'

const DEFAULT_IMAGE = '/images/default-og.jpg'

function hasRealImage(path: string) {
  return path && path !== DEFAULT_IMAGE && !path.includes('undefined')
}

export function PostHeader({ post }: { post: Post }) {
  const categoryMeta = getCategoryMeta(post.category)
  const showFeaturedImage = hasRealImage(post.featuredImage)

  return (
    <header className="article-header-wrap">
      <div className="article-header-card">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/category/${post.category}`}>{categoryMeta.label}</Link>
          <span>/</span>
          <span className="article-breadcrumb-current">{post.title}</span>
        </nav>

        <div className="article-header-grid">
          <div className="article-header-copy">
            <Link href={`/category/${post.category}`} className="article-category-chip" style={{ color: categoryMeta.color }}>
              <span>{categoryMeta.icon}</span>
              {categoryMeta.label}
            </Link>

            <h1 className="post-header-title article-header-title">{post.title}</h1>
            <p className="article-header-description">{post.description}</p>

            <div className="article-meta-row">
              <div className="article-meta-chip article-meta-chip-author">
                <AuthorBio name={post.author} compact />
              </div>
              <div className="article-meta-chip">
                <span className="article-meta-label">Published</span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              {post.updatedAt && (
                <div className="article-meta-chip">
                  <span className="article-meta-label">Updated</span>
                  <span>
                    {new Date(post.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="article-meta-chip">
                <span className="article-meta-label">Read time</span>
                <span>{post.readingTime}</span>
              </div>
            </div>

            <ShareButtons title={post.title} slug={post.slug} />
            {post.tags.includes('affiliate') && <AffiliateDisclosure />}
          </div>

          <div className="article-header-media-shell">
            {showFeaturedImage ? (
              <div className="article-header-media-frame">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="article-header-media-image"
                  priority
                />
              </div>
            ) : (
              <div className="article-header-fallback" style={{ background: categoryMeta.gradient }}>
                <div className="article-header-fallback-symbol">{categoryMeta.symbol}</div>
                <div className="article-header-fallback-icon">{categoryMeta.icon}</div>
                <p>{categoryMeta.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
