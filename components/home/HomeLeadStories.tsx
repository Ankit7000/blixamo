import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedNowSection, HomepageArticle } from '@/lib/homepage'

const DEFAULT_IMAGE = '/images/default-og.jpg'

function hasUsableImage(src: string) {
  return src && src !== DEFAULT_IMAGE && !src.includes('undefined')
}

function StoryCard({ article }: { article: HomepageArticle }) {
  return (
    <Link href={`/blog/${article.slug}`} className="home-featured-mini">
      <div className="home-featured-mini-top">
        <span className="home-featured-mini-category" style={{ color: article.categoryColor }}>
          {article.eyebrow || article.categoryLabel}
        </span>
        <span className="home-featured-mini-meta" style={{ marginTop: 0 }}>
          {article.readingTime}
        </span>
      </div>
      <h3 className="home-featured-mini-title">{article.title}</h3>
      <p className="home-featured-mini-copy">{article.description}</p>
    </Link>
  )
}

export function HomeLeadStories({ section }: { section: FeaturedNowSection }) {
  const hasImage = hasUsableImage(section.lead.featuredImage)

  return (
    <section className="home-section-shell">
      <div className="home-section-head home-section-head-inline">
        <div>
          <div className="home-section-kicker">{section.kicker}</div>
          <h2 className="home-section-title">{section.title}</h2>
          <p className="home-section-description">{section.description}</p>
        </div>
        <Link href="/blog" className="home-section-link">
          Browse archive
        </Link>
      </div>

      <div className="home-featured-layout">
        <Link href={`/blog/${section.lead.slug}`} className="home-featured-lead">
          <div className="home-featured-media">
            {hasImage ? (
              <Image
                src={section.lead.featuredImage}
                alt={section.lead.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                className="home-featured-fallback"
                style={{
                  background: `linear-gradient(135deg, ${section.lead.categoryColor} 0%, rgba(15, 23, 42, 0.78) 100%)`,
                }}
              >
                <span aria-hidden="true">{section.lead.categoryLabel}</span>
              </div>
            )}
          </div>
          <div className="home-featured-content">
            <span className="home-featured-badge" style={{ color: section.lead.categoryColor }}>
              {section.lead.eyebrow || 'Lead feature'}
            </span>
            <h3 className="home-featured-title">{section.lead.title}</h3>
            <p className="home-featured-copy">{section.lead.description}</p>
            <div className="home-featured-meta">
              <span>{section.lead.categoryLabel}</span>
              <span>{section.lead.readingTime}</span>
              <span>{section.lead.freshnessLabel}</span>
            </div>
          </div>
        </Link>

        <div className="home-featured-stack">
          {section.secondary.map((article) => (
            <StoryCard key={article.slug} article={article} />
          ))}
          <div
            className="home-featured-mini"
            style={{
              display: 'grid',
              gap: '0.8rem',
            }}
          >
            <div className="home-featured-mini-top">
              <span className="home-featured-mini-category">{section.recentlyUpdatedTitle}</span>
              <span className="home-featured-mini-meta" style={{ marginTop: 0 }}>
                Reopen these
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gap: '0.7rem',
              }}
            >
              {section.recentlyUpdated.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  style={{
                    display: 'grid',
                    gap: '0.2rem',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      lineHeight: 1.45,
                    }}
                  >
                    {article.title}
                  </span>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {article.eyebrow || article.categoryLabel} - {article.freshnessLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
