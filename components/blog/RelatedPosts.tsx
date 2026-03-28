import Link from 'next/link'
import { getCategoryMeta } from '@/lib/categories'
import { PostCard } from './PostCard'
import type { Post } from '@/lib/posts'
import { RESOURCE_HUB_PATH } from '@/lib/resources'

type RelatedPostsProps = {
  posts: Post[]
  category: string
  pillarHref?: string
  pillarTitle?: string
}

export function RelatedPosts({ posts, category, pillarHref, pillarTitle }: RelatedPostsProps) {
  if (!posts.length) return null
  const categoryMeta = getCategoryMeta(category)

  return (
    <section className="related-posts-shell">
      <div className="related-posts-head">
        <p className="related-posts-kicker">Related cluster articles</p>
        <h2 className="related-posts-title">Keep moving through the same topic cluster</h2>
        <p className="related-posts-description">
          These links stay inside the same pillar cluster so the next reads reinforce the topic instead of sending the reader into unrelated archive pages.
        </p>
        {pillarHref && pillarTitle && (
          <Link
            href={pillarHref}
            className="home-section-link"
            style={{ alignSelf: 'flex-start', marginTop: '0.9rem' }}
          >
            Open {pillarTitle}
          </Link>
        )}
        <Link
          href={`/category/${category}`}
          className="home-section-link"
          style={{ alignSelf: 'flex-start', marginTop: pillarHref && pillarTitle ? '0.25rem' : '0.9rem' }}
        >
          Browse more in {categoryMeta.label}
        </Link>
        <Link
          href={`${RESOURCE_HUB_PATH}#resources-start-here`}
          className="home-section-link"
          style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
        >
          Open Start Here
        </Link>
      </div>

      <div className="related-posts-grid">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
