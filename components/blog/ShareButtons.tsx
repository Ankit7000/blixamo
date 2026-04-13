'use client'

import { useState } from 'react'

interface Props {
  title: string
  slug: string
  compact?: boolean
}

export function ShareButtons({ title, slug, compact = false }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `https://blixamo.com/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  function track(platform: string) {
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'share', {
        method: platform,
        content_type: 'article',
        item_id: slug,
      })
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    track('copy_link')
  }

  return (
    <div className={`share-buttons-row${compact ? ' share-buttons-row-compact' : ''}`}>
      <span className="share-buttons-label">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank"
        rel="noopener"
        className="share-button share-button-twitter"
        onClick={() => track('twitter')}
      >
        X / Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener"
        className="share-button share-button-linkedin"
        onClick={() => track('linkedin')}
      >
        LinkedIn
      </a>
      <button onClick={copyLink} className={`share-button share-button-copy${copied ? ' is-copied' : ''}`}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
