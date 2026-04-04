import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/ui/Pagination'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 10
type Props = { params: Promise<{ page: string }> }

function parseArchivePage(page: string): number | null {
  if (!/^\d+$/.test(page)) {
    return null
  }

  const parsedPage = Number(page)
  return Number.isSafeInteger(parsedPage) ? parsedPage : null
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params
  return {
    title: `Articles — Page ${page} | Blixamo`,
    description: `Browse Blixamo articles — page ${page}.`,
    alternates: { canonical: `https://blixamo.com/blog/page/${page}` },
    robots: 'noindex',
  }
}

export default async function BlogPage({ params }: Props) {
  const { page: pageStr } = await params
  const page = parseArchivePage(pageStr)
  const posts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  if (page === null || page < 2 || page > totalPages) notFound()
  const start = (page - 1) * POSTS_PER_PAGE
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE)

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>All Articles</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Page {page} of {totalPages} · {posts.length} total articles
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {pagePosts.map(post => <PostCard key={post.slug} post={post} />)}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
    </div>
  )
}
