import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllCategories().map(c => ({ slug: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const label = slug.replace(/-/g, ' ')
  return {
    title: `${label.charAt(0).toUpperCase() + label.slice(1)} Articles | Blixamo`,
    description: `Browse all ${label} articles on Blixamo — tutorials, guides, and insights.`,
    alternates: { canonical: `https://blixamo.com/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const posts = getPostsByCategory(slug)
  if (posts.length === 0) notFound()
  const label = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Category</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{label}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          {posts.length} article{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {posts.map(post => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}
