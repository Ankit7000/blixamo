import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { AuthorBio } from '@/components/blog/AuthorBio'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ author: string }> }

export async function generateStaticParams() {
  const posts = getAllPosts()
  const authors = [...new Set(posts.map(p => p.author.toLowerCase()))]
  return authors.map(author => ({ author }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params
  const name = author.charAt(0).toUpperCase() + author.slice(1)
  return {
    title: `${name} — Author at Blixamo`,
    description: `Articles written by ${name} on Blixamo — tech, AI, tutorials, and developer tools.`,
    alternates: { canonical: `https://blixamo.com/author/${author}` },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { author } = await params
  const allPosts = getAllPosts()
  const posts = allPosts.filter(p => p.author.toLowerCase() === author.toLowerCase())
  if (posts.length === 0) notFound()
  const displayName = posts[0].author

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <AuthorBio name={displayName} />
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Articles by {displayName}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{posts.length} published</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {posts.map(post => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}
