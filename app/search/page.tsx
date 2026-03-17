'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post { slug: string; title: string; description: string; category: string; date: string; readingTime: string }

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setAllPosts)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 10))
  }, [query, allPosts])

  return (
    <div style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Search</h1>
      <input
        type="search"
        placeholder="Search articles…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
        style={{
          width: '100%', padding: '0.8rem 1rem', fontSize: '1rem',
          background: 'var(--bg)', border: '2px solid var(--border)',
          borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none',
          marginBottom: '1.5rem',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />

      {query && results.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No results for &ldquo;{query}&rdquo;</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', padding: '1rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>{p.category}</span>
            <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{p.title}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{p.description}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{p.readingTime}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
