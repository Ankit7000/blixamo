import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts } from '@/lib/posts'
import { PILLAR_BASE_PATH, PILLAR_RESOURCE_HUB_PATH, getAllPillarPages, getPillarDefinitions, getPillarPageBySlug } from '@/lib/pillars'

type Props = { params: Promise<{ slug: string }> }

function ResourceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="home-discovery-card home-discovery-card-compact">
      <div className="home-discovery-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  )
}

export async function generateStaticParams() {
  return getPillarDefinitions().map((pillar) => ({ slug: pillar.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const posts = getAllPosts()
  const pillar = getPillarPageBySlug(slug, posts)

  if (!pillar) return {}

  return {
    title: pillar.title,
    description: pillar.description,
    alternates: { canonical: `https://blixamo.com${pillar.href}` },
  }
}

export default async function PillarPage({ params }: Props) {
  const { slug } = await params
  const posts = getAllPosts()
  const pillar = getPillarPageBySlug(slug, posts)

  if (!pillar) notFound()

  const relatedResources = [
    { title: 'Homepage', description: 'Return to the main site hub and top-level discovery paths.', href: '/' },
    { title: 'Resources Hub', description: 'Open the central resources hub for start-here paths and topic navigation.', href: PILLAR_RESOURCE_HUB_PATH },
    { title: 'Community Hub', description: 'Use the community layer to discover practical reads, comparisons, and current site entry points.', href: '/community' },
    { title: 'Blog Archive', description: 'Browse the full article archive when you want to move from this guide into the latest sitewide content.', href: '/blog' },
    { title: pillar.primaryCategory.label, description: pillar.primaryCategory.description, href: pillar.primaryCategory.href },
    ...pillar.supportingCategories.map((category) => ({
      title: category.label,
      description: category.description,
      href: category.href,
    })),
    ...(pillar.slug === 'comparisons-hub'
      ? []
      : [
          {
            title: 'Comparisons Hub',
            description: 'Open the sitewide comparison hub for hosting, tooling, automation, and platform decisions.',
            href: `${PILLAR_BASE_PATH}/comparisons-hub`,
          },
        ]),
    ...pillar.relatedResources.map((resource) => ({
      title: resource.label,
      description: resource.description,
      href: resource.href,
    })),
  ].filter((resource, index, collection) => collection.findIndex((entry) => entry.href === resource.href) === index)
  const categoryLinks = [pillar.primaryCategory, ...pillar.supportingCategories].filter(
    (category, index, collection) => collection.findIndex((entry) => entry.href === category.href) === index
  )
  const pillarCategorySlugs = new Set(categoryLinks.map((category) => category.slug))
  const relatedPillarPages = getAllPillarPages(posts)
    .filter((page) => page.slug !== pillar.slug)
    .filter((page) =>
      [page.primaryCategory.slug, ...page.supportingCategories.map((category) => category.slug)]
        .some((categorySlug) => pillarCategorySlugs.has(categorySlug))
    )
    .slice(0, 4)

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section className="home-resource-promo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="home-section-kicker">{pillar.eyebrow}</div>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.04, fontWeight: 800 }}>
            {pillar.title}
          </h1>
          <p className="home-section-description">{pillar.description}</p>
          <p className="home-section-description" style={{ margin: 0 }}>{pillar.intro}</p>
          <div className="home-resource-points">
            <span>{pillar.articleCount} primary articles</span>
            <span>{pillar.guides.length} guides</span>
            <span>{pillar.comparisons.length} comparisons</span>
            <span>{pillar.tools.length} tools</span>
          </div>
          <div className="home-hero-actions">
            <Link href="/blog" className="home-hero-button home-hero-button-secondary">
              Blog archive
            </Link>
            <Link href="/community" className="home-hero-button home-hero-button-secondary">
              Community hub
            </Link>
            <Link href={PILLAR_RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
              Open resources hub
            </Link>
            <Link href={pillar.primaryCategory.href} className="home-hero-button home-hero-button-secondary">
              Browse {pillar.primaryCategory.label}
            </Link>
          </div>
        </div>

        <div className="home-resource-promo-grid">
          <div className="home-resource-promo-card">
            <span className="home-curated-eyebrow">What is this topic</span>
            <p style={{ margin: 0 }}>{pillar.whatIs}</p>
          </div>
          <div className="home-resource-promo-card">
            <span className="home-curated-eyebrow">Why it matters</span>
            <p style={{ margin: 0 }}>{pillar.whyItMatters}</p>
          </div>
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">When to use it</div>
          <h2 className="home-section-title">Use this pillar when this is the problem in front of you</h2>
        </div>
        <ul className="resource-path-steps">
          {pillar.whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">This guide is part of</div>
          <h2 className="home-section-title">Use these hub routes to understand where this guide sits on the site</h2>
          <p className="home-section-description">
            This guide links back into the homepage, resources hub, community page, blog archive, and category structure so readers can move up and sideways through the cluster.
          </p>
        </div>
        <div className="home-discovery-grid">
          {relatedResources.map((resource) => (
            <ResourceCard key={resource.href} title={resource.title} description={resource.description} href={resource.href} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Explore Categories</div>
          <h2 className="home-section-title">Category routes connected to this guide</h2>
        </div>
        <div className="home-discovery-grid">
          {categoryLinks.map((category) => (
            <ResourceCard key={category.href} title={category.label} description={category.description} href={category.href} />
          ))}
        </div>
      </section>

      {relatedPillarPages.length > 0 && (
        <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="home-section-head">
            <div className="home-section-kicker">Related Guides</div>
            <h2 className="home-section-title">Other pillar guides in the same topic neighborhood</h2>
          </div>
          <div className="home-discovery-grid">
            {relatedPillarPages.map((page) => (
              <ResourceCard key={page.href} title={page.title} description={page.description} href={page.href} />
            ))}
          </div>
        </section>
      )}

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Recommended tools</div>
          <h2 className="home-section-title">Use the strongest supporting pages before you choose the stack</h2>
          <p className="home-section-description">{pillar.bestToolsIntro}</p>
        </div>
        <div className="home-post-grid">
          {pillar.tools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Continue Learning</div>
          <h2 className="home-section-title">Start with these implementation reads inside the cluster</h2>
        </div>
        <div className="home-post-grid">
          {pillar.guides.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Comparisons</div>
          <h2 className="home-section-title">Decision pages that connect to this cluster</h2>
        </div>
        <div className="home-post-grid">
          {pillar.comparisons.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Recommended setup</div>
          <h2 className="home-section-title">A clean way to move through this topic</h2>
          <p className="home-section-description">{pillar.recommendedSetupIntro}</p>
        </div>
        <ul className="resource-path-steps">
          {pillar.recommendedSetup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Learning path</div>
          <h2 className="home-section-title">Read these in order if you want the shortest path</h2>
          <p className="home-section-description">{pillar.learningPathIntro}</p>
        </div>
        <ol className="resource-path-steps">
          {pillar.learningPath.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Articles in this topic</div>
          <h2 className="home-section-title">All cluster articles connected to this pillar</h2>
          <p className="home-section-description">
            Use this section as the full topic map for the cluster. Every article below is part of this pillar path and links back into the same guide, category, and resource-hub structure.
          </p>
        </div>
        <div className="home-post-grid">
          {pillar.topicArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">Related articles</div>
          <h2 className="home-section-title">Core reads connected to this pillar</h2>
        </div>
        <div className="home-post-grid">
          {pillar.relatedArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-section-head">
          <div className="home-section-kicker">FAQ</div>
          <h2 className="home-section-title">Common questions around this topic cluster</h2>
        </div>
        <div className="home-resource-promo-grid">
          {pillar.faq.map((item) => (
            <div key={item.question} className="home-resource-promo-card">
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{item.question}</h3>
              <p style={{ margin: 0 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="home-newsletter-panel">
          <div className="home-section-kicker">Conclusion</div>
          <h2 className="home-section-title" style={{ marginTop: '0.75rem' }}>Use this page as the main entry point for this cluster</h2>
          <p className="home-section-description" style={{ marginTop: '0.75rem' }}>{pillar.conclusion}</p>
          <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
            <Link href="/" className="home-hero-button home-hero-button-secondary">
              Go to homepage
            </Link>
            <Link href="/community" className="home-hero-button home-hero-button-secondary">
              Open community hub
            </Link>
            <Link href={PILLAR_RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
              Return to resources hub
            </Link>
            <Link href={pillar.primaryCategory.href} className="home-hero-button home-hero-button-secondary">
              Browse {pillar.primaryCategory.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
