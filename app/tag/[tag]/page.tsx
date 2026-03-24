import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { absoluteUrl } from '@/lib/site'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ tag: string }> }

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = [...new Set(posts.flatMap(p => p.tags))]
  return tags.map(tag => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `#${tag} — Articles on Blixamo`,
    description: `Browse all Blixamo articles tagged with "${tag}" — tutorials, guides, and insights.`,
    alternates: { canonical: absoluteUrl(`/tag/${tag}`) },
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const posts = getAllPosts().filter(p => p.tags.includes(tag))
  if (posts.length === 0) notFound()

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Tag</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ color: 'var(--accent)' }}>#</span>{tag}
        </h1>
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
