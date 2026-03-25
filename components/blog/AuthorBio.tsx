'use client'

import Image from 'next/image'
import Link from 'next/link'

interface AuthorBioProps {
  name: string
  compact?: boolean
  hero?: boolean
}

type AuthorProfile = {
  displayName: string
  role: string
  shortBio: string
  longBio: string
  avatarSrc: string
  photoSrc: string
  aboutHref: string
  twitter?: string
  email?: string
}

export const PRIMARY_AUTHOR: AuthorProfile = {
  displayName: 'Ankit Sorathiya',
  role: 'Full-Stack Developer, Self-Hosting Operator, and Indie Builder',
  shortBio:
    'Ankit runs Blixamo and writes practical guides about self-hosting, VPS infrastructure, AI workflows, automation, and modern web development.',
  longBio:
    'Ankit Sorathiya is the primary author behind Blixamo. He builds and operates production apps with Next.js, Flutter, Node.js, AI APIs, PM2, Nginx, Docker, and low-cost VPS infrastructure, then documents the patterns, tradeoffs, and failures that actually matter.',
  avatarSrc: '/images/author-avatar.svg',
  photoSrc: '/images/author-photo.svg',
  aboutHref: '/about',
  twitter: 'ankit8k',
  email: 'ankitsorathiya1991@gmail.com',
}

function getAuthorProfile(name: string): AuthorProfile {
  const normalizedName = name.trim().toLowerCase()

  if (normalizedName === 'ankit sorathiya' || normalizedName === 'blixamo') {
    return PRIMARY_AUTHOR
  }

  return {
    ...PRIMARY_AUTHOR,
    displayName: name,
  }
}

export function AuthorBio({ name, compact = false, hero = false }: AuthorBioProps) {
  const author = getAuthorProfile(name)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid var(--accent)',
          }}
        >
          <Image
            src={author.avatarSrc}
            alt={author.displayName}
            width={32}
            height={32}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <div>
          <Link
            href={author.aboutHref}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}
          >
            {author.displayName}
          </Link>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{author.role}</div>
        </div>
      </div>
    )
  }

  if (hero) {
    return (
      <section
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
        }}
      >
        <div
          style={{
            width: '112px',
            height: '112px',
            borderRadius: '24px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid var(--accent)',
          }}
        >
          <Image
            src={author.photoSrc}
            alt={author.displayName}
            width={112}
            height={112}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            priority
          />
        </div>
        <div style={{ flex: '1 1 320px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}
          >
            Primary Author
          </p>
          <h1
            style={{
              margin: '0.35rem 0 0.4rem',
              fontSize: 'clamp(1.9rem, 5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
            }}
          >
            {author.displayName}
          </h1>
          <p style={{ margin: '0 0 0.65rem', fontSize: '1rem', color: 'var(--accent)', fontWeight: 600 }}>
            {author.role}
          </p>
          <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {author.longBio}
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link
              href={author.aboutHref}
              style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
            >
              About Blixamo
            </Link>
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}
              >
                {author.email}
              </a>
            )}
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}
              >
                X @{author.twitter}
              </a>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        padding: '1.5rem',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        margin: '2.5rem 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid var(--accent)',
        }}
      >
        <Image
          src={author.photoSrc}
          alt={author.displayName}
          width={56}
          height={56}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ flex: '1 1 260px' }}>
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '0.3rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 700,
          }}
        >
          About the author
        </div>
        <Link
          href={author.aboutHref}
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            marginBottom: '0.2rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {author.displayName}
        </Link>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 500 }}>
          {author.role}
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {author.shortBio}
        </p>
        <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <Link
            href={author.aboutHref}
            style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
          >
            Read the full About page
          </Link>
          {author.twitter && (
            <a
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none' }}
            >
              X @{author.twitter}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
