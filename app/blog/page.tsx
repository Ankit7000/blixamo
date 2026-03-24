import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/ui/Pagination'
import { absoluteUrl } from '@/lib/site'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 10

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse all tech articles, tutorials, AI guides and tool reviews on Blixamo.',
  alternates: { canonical: absoluteUrl('/blog') },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const pagePosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>All Articles</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          {posts.length} articles published
        </p>
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
