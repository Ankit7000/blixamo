import Link from 'next/link'
import { getCategoryMeta } from '@/lib/categories'
import { PostCard } from './PostCard'
import type { Post } from '@/lib/posts'

export function RelatedPosts({ posts, category }: { posts: Post[]; category: string }) {
  if (!posts.length) return null
  const categoryMeta = getCategoryMeta(category)

  return (
    <section className="related-posts-shell">
      <div className="related-posts-head">
        <p className="related-posts-kicker">Next reading</p>
        <h2 className="related-posts-title">Keep exploring Blixamo</h2>
        <p className="related-posts-description">
          Related articles that expand the same topic, compare adjacent tools, or help you take the next implementation step.
        </p>
        <Link
          href={`/category/${category}`}
          className="home-section-link"
          style={{ alignSelf: 'flex-start', marginTop: '0.9rem' }}
        >
          Browse more in {categoryMeta.label}
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
