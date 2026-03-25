'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PRIMARY_AUTHOR, type AuthorProfile } from '@/lib/author'

interface AuthorBioProps {
  name: string
  compact?: boolean
  hero?: boolean
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
      <div className="author-bio author-bio-compact">
        <div className="author-bio-avatar author-bio-avatar-compact">
          <Image src={author.avatarSrc} alt={author.displayName} width={32} height={32} className="author-bio-image" />
        </div>
        <div className="author-bio-copy author-bio-copy-compact">
          <Link href={author.aboutHref} className="author-bio-name">
            {author.displayName}
          </Link>
          <div className="author-bio-role">{author.role}</div>
        </div>
      </div>
    )
  }

  if (hero) {
    return (
      <section className="author-bio author-bio-hero">
        <div className="author-bio-avatar author-bio-avatar-hero">
          <Image
            src={author.photoSrc}
            alt={author.displayName}
            width={112}
            height={112}
            className="author-bio-image"
            priority
          />
        </div>
        <div className="author-bio-copy author-bio-copy-hero">
          <p className="author-bio-eyebrow">Primary Author</p>
          <h1 className="author-bio-hero-title">{author.displayName}</h1>
          <p className="author-bio-role author-bio-role-hero">{author.role}</p>
          <p className="author-bio-description author-bio-description-hero">{author.longBio}</p>
          <div className="author-bio-links">
            <Link href={author.aboutHref} className="author-bio-link author-bio-link-accent">
              About Blixamo
            </Link>
            {author.email && (
              <a href={`mailto:${author.email}`} className="author-bio-link">
                {author.email}
              </a>
            )}
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="author-bio-link"
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
    <div className="author-bio author-bio-full">
      <div className="author-bio-avatar author-bio-avatar-full">
        <Image src={author.photoSrc} alt={author.displayName} width={56} height={56} className="author-bio-image" />
      </div>
      <div className="author-bio-copy author-bio-copy-full">
        <div className="author-bio-eyebrow">About the author</div>
        <Link href={author.aboutHref} className="author-bio-name author-bio-name-full">
          {author.displayName}
        </Link>
        <div className="author-bio-role author-bio-role-full">{author.role}</div>
        <p className="author-bio-description">{author.shortBio}</p>
        <div className="author-bio-links">
          <Link href={author.aboutHref} className="author-bio-link author-bio-link-accent">
            Read the full About page
          </Link>
          {author.twitter && (
            <a
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="author-bio-link"
            >
              X @{author.twitter}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

