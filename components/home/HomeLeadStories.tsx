import Link from 'next/link'
import Image from 'next/image'
import { getCategoryMeta } from '@/lib/categories'
import type { HomepageArticle, LeadStoriesSection } from '@/lib/homepage'

const DEFAULT_IMAGE = '/images/default-og.jpg'

function hasUsableImage(src: string) {
  return src && src !== DEFAULT_IMAGE && !src.includes('undefined')
}

function StoryCard({ article }: { article: HomepageArticle }) {
  const category = getCategoryMeta(article.category)

  return (
    <Link href={`/blog/${article.slug}`} className="home-featured-mini">
      <div className="home-featured-mini-top">
        <span className="home-featured-mini-category" style={{ color: category.color }}>
          {category.label}
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

export function HomeLeadStories({ leadStories }: { leadStories: LeadStoriesSection }) {
  const category = getCategoryMeta(leadStories.featured.category)
  const hasImage = hasUsableImage(leadStories.featured.featuredImage)

  return (
    <section className="home-section-shell">
      <div className="home-section-head">
        <div className="home-section-kicker">Lead Stories</div>
        <h2 className="home-section-title">Start with the pages that define the editorial center of gravity</h2>
        <p className="home-section-description">
          These are not just the newest posts. They are the pages most likely to explain how Blixamo thinks about
          infrastructure, publishing systems, deployment, and practical operator work.
        </p>
      </div>

      <div className="home-featured-layout">
        <Link href={`/blog/${leadStories.featured.slug}`} className="home-featured-lead">
          <div className="home-featured-media">
            {hasImage ? (
              <Image
                src={leadStories.featured.featuredImage}
                alt={leadStories.featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                className="home-featured-fallback"
                style={{
                  background: category.gradient,
                }}
              >
                <span aria-hidden="true">{category.icon}</span>
              </div>
            )}
          </div>
          <div className="home-featured-content">
            <span className="home-featured-badge" style={{ color: category.color }}>
              Featured story
            </span>
            <h3 className="home-featured-title">{leadStories.featured.title}</h3>
            <p className="home-featured-copy">{leadStories.featured.description}</p>
            <div className="home-featured-meta">
              <span>{category.label}</span>
              <span>{leadStories.featured.readingTime}</span>
              <span>Read the story</span>
            </div>
          </div>
        </Link>

        <div className="home-featured-stack">
          {leadStories.supporting.map((article) => (
            <StoryCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
