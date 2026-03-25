'use client'
import { useState } from 'react'

interface Props { title: string; slug: string }

export function StickyShare({ title, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `https://blixamo.com/blog/${slug}`

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const btnBase: React.CSSProperties = {
    width: '40px', height: '40px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '1rem',
  }

  return (
    <div
      className="sticky-share"
      style={{
        position: 'sticky',
        top: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        paddingTop: '0.5rem',
        justifySelf: 'end',
        marginRight: '1.5rem',
      }}
    >

      {/* Twitter/X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X / Twitter"
        style={{ ...btnBase }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#1da1f215'
          el.style.borderColor = '#1da1f2'
          el.style.color = '#1da1f2'
          el.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg)'
          el.style.borderColor = 'var(--border)'
          el.style.color = 'var(--text-muted)'
          el.style.transform = 'scale(1)'
        }}
      >
        𝕏
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        style={{ ...btnBase, fontSize: '0.85rem', fontWeight: 700 }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#0077b515'
          el.style.borderColor = '#0077b5'
          el.style.color = '#0077b5'
          el.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg)'
          el.style.borderColor = 'var(--border)'
          el.style.color = 'var(--text-muted)'
          el.style.transform = 'scale(1)'
        }}
      >
        in
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        title={copied ? 'Copied!' : 'Copy link'}
        style={{
          ...btnBase,
          fontSize: copied ? '0.7rem' : '1rem',
          background: copied ? '#6c63ff15' : 'var(--bg)',
          borderColor: copied ? '#6c63ff' : 'var(--border)',
          color: copied ? '#6c63ff' : 'var(--text-muted)',
        }}
        onMouseEnter={e => {
          if (!copied) {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#6c63ff15'
            el.style.borderColor = '#6c63ff'
            el.style.color = '#6c63ff'
            el.style.transform = 'scale(1.1)'
          }
        }}
        onMouseLeave={e => {
          if (!copied) {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--bg)'
            el.style.borderColor = 'var(--border)'
            el.style.color = 'var(--text-muted)'
            el.style.transform = 'scale(1)'
          }
        }}
      >
        {copied ? '✓' : '🔗'}
      </button>

      {/* Divider line */}
      <div style={{ width: '1px', height: '40px', background: 'var(--border)', marginTop: '0.25rem' }} />
    </div>
  )
}

