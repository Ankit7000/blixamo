'use client'
import Link from 'next/link'
import Image from 'next/image'

interface AuthorBioProps {
  name: string
  compact?: boolean
}

// Extend this map as you add real authors
const AUTHORS: Record<string, { bio: string; avatar: string; twitter?: string; github?: string; role: string }> = {
  'Ankit Sorathiya': {
    role: 'Full-Stack Developer & Indie Builder',
    bio: 'I build Flutter apps, Next.js sites, and AI integrations. I run this blog to document what actually works — VPS setups, dev tools, and indie hacking on a budget from India.',
    avatar: '⚡',
    twitter: 'ankit8k',
  },
  // Fallback
  Blixamo: {
    role: 'Full-Stack Developer & Indie Builder',
    bio: 'I build Flutter apps, Next.js sites, and AI integrations. I run this blog to document what actually works — VPS setups, dev tools, and indie hacking on a budget from India.',
    avatar: '⚡',
    twitter: 'ankit8k',
  },
}

export function AuthorBio({ name, compact = false }: AuthorBioProps) {
  const author = AUTHORS[name] || AUTHORS['Blixamo']

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--accent)' }}>
          <Image src="/images/ankit-avatar.jpg" alt={name} width={32} height={32} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{author.role}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
      padding: '1.5rem', background: 'var(--bg-subtle)',
      border: '1px solid var(--border)', borderRadius: '0.75rem',
      margin: '2.5rem 0',
    }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--accent)' }}>
        <Image src="/images/ankit-avatar.jpg" alt={name} width={56} height={56} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 500 }}>{author.role}</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{author.bio}</p>
        {author.twitter && (
          <a
            href={`https://twitter.com/${author.twitter}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}
          >
            𝕏 @{author.twitter}
          </a>
        )}
      </div>
    </div>
  )
}
