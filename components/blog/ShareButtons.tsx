'use client'
import { useState } from 'react'

interface Props { title: string; slug: string }

export function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `https://blixamo.com/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    track('copy_link')
  }

  function track(platform: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'share', { method: platform, content_type: 'article', item_id: slug })
    }
  }

  const btn: React.CSSProperties = {
    padding: '0.4rem 0.9rem', borderRadius: '0.375rem', fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-subtle)',
    color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    textDecoration: 'none',
  }

  return (
    <div className="share-buttons-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`} target="_blank" rel="noopener" style={{ ...btn, borderColor: '#1da1f2', color: '#1da1f2' }} onClick={() => track('twitter')}>
        𝕏 Twitter
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`} target="_blank" rel="noopener" style={{ ...btn, borderColor: '#0077b5', color: '#0077b5' }} onClick={() => track('linkedin')}>
        in LinkedIn
      </a>
      <button onClick={copyLink} style={{ ...btn, background: copied ? 'var(--accent)' : 'var(--bg-subtle)', color: copied ? '#fff' : 'var(--text-secondary)', borderColor: copied ? 'var(--accent)' : 'var(--border)' }}>
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
    </div>
  )
}
