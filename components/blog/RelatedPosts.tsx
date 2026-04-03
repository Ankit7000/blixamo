import Link from 'next/link'
import { getCategoryMeta } from '@/lib/categories'
import { PostCard } from './PostCard'
import type { Post } from '@/lib/posts'

type RelatedPostsProps = {
  posts: Post[]
  category: string
}

export function RelatedPosts({ posts, category }: RelatedPostsProps) {
  if (!posts.length) return null
  const categoryMeta = getCategoryMeta(category)

  return (
    <section className="related-posts-shell">
      <div className="related-posts-head">
        <p className="related-posts-kicker">Related reads</p>
        <h2 className="related-posts-title">More in {categoryMeta.label}</h2>
        <p className="related-posts-description">
          Keep the next reads close to the same deployment and self-hosting path.
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
