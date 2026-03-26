import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { PostCard } from '@/components/blog/PostCard'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { getAllPosts, type Post } from '@/lib/posts'
import { getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Blixamo | Developer Guides, VPS, Self-Hosting, Deployment, and Tools',
  description:
    'Developer guides for VPS, self-hosting, deployment, automation, AI workflows, comparisons, and practical free tools.',
  alternates: { canonical: 'https://blixamo.com' },
}

function StartHereCard({ post, index }: { post: Post; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="home-curated-card home-curated-card-strong">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">Start {index + 1}</span>
        <span className="home-curated-arrow">Read first</span>
      </div>
      <h3 className="home-curated-title">{post.title}</h3>
      <p className="home-curated-copy">{post.description}</p>
      <div className="home-curated-footer">
        <span>{post.readingTime}</span>
        <span>Open guide</span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const allPosts = getAllPosts()
  const hub = getResourceHubContent(allPosts)
  const heroLead = hub.startHere[0] || hub.popularGuides[0] || allPosts[0]

  return (
    <>
      <WebsiteJsonLd />

      <section className="home-hero-shell">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="home-hero-kicker">Developer Resource Hub</div>
            <h1 className="home-hero-title">Practical developer guides for VPS, self-hosting, deployment, automation, and tools.</h1>
            <p className="home-hero-description">
              Blixamo is built as a developer hub for shipping apps, comparing platforms, finding free tools,
              and using one central resources page to navigate the guides that actually hold up in production.
            </p>

            <div className="home-hero-signal-row" aria-label="Core topics">
              {hub.heroSignals.map((signal) => (
                <Link key={signal.title} href={signal.href} className="home-hero-signal">
                  {signal.title}
                </Link>
              ))}
            </div>

            <div className="home-hero-actions">
              <Link href="#start-here" className="home-hero-button home-hero-button-primary">
                Start Here
              </Link>
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
                Explore Resources
              </Link>
              <Link href={`${RESOURCE_HUB_PATH}#resources-comparisons`} className="home-hero-button home-hero-button-secondary">
                Compare Tools
              </Link>
              <Link href="#home-free-tools" className="home-hero-button home-hero-button-secondary">
                Free Tools
              </Link>
            </div>

            {heroLead && (
              <Link href={`/blog/${heroLead.slug}`} className="home-hero-feature-card home-hub-spotlight">
                <div className="home-hero-feature-label">Recommended First Read</div>
                <div className="home-hero-feature-title">{heroLead.title}</div>
                <p className="home-hero-feature-description">{heroLead.description}</p>
                <div className="home-hero-feature-meta">
                  <span>{heroLead.readingTime}</span>
                  <span>Use this to get oriented fast</span>
                </div>
              </Link>
            )}
          </div>

          <div className="home-hero-visual">
            <div className="home-hub-board">
              <div className="home-hub-board-head">
                <div>
                  <div className="home-side-eyebrow">Inside Blixamo</div>
                  <h2 className="home-hub-board-title">A compact map of the site</h2>
                </div>
                <Link href={RESOURCE_HUB_PATH} className="home-section-link">
                  Open hub
                </Link>
              </div>

              <div className="home-hub-panel-grid">
                {hub.heroPanels.map((panel) => (
                  <Link key={panel.title} href={panel.href} className="home-hub-panel">
                    <span className="home-hub-panel-icon" style={{ color: panel.accentColor }}>
                      {panel.icon}
                    </span>
                    <strong>{panel.title}</strong>
                    <span>{panel.description}</span>
                  </Link>
                ))}
              </div>

              <div className="home-hub-stat-row">
                <div className="home-hub-stat">
                  <strong>{hub.stats.guides}</strong>
                  <span>Guides</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.stats.articles}</strong>
                  <span>Articles</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.stats.comparisons}</strong>
                  <span>Comparisons</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.stats.tools}</strong>
                  <span>Tool pages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="home-quick-access" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Quick Access</div>
          <h2 className="home-section-title">Jump straight to the highest-value parts of the site</h2>
          <p className="home-section-description">
            Use these shortcuts to reach the pages people usually want first: the hub, the strongest tool lists,
            self-hosting guides, deployment clusters, and comparison content.
          </p>
        </div>

        <div className="home-quick-grid">
          {hub.quickAccessCards.map((card) => (
            <Link key={card.title} href={card.href} className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">{card.eyebrow}</span>
                <span className="home-curated-arrow">{card.icon}</span>
              </div>
              <h3 className="home-curated-title">{card.title}</h3>
              <p className="home-curated-copy">{card.description}</p>
              <div className="home-curated-footer">
                <span>Use now</span>
                <span>Open</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="start-here" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Start Here</div>
          <h2 className="home-section-title">New here? Read these first.</h2>
          <p className="home-section-description">
            These foundational reads explain how Blixamo approaches deploys, self-hosting, low-cost stacks, and practical developer operations.
          </p>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#resources-start-here`} className="home-section-link">
            View full start-here hub
          </Link>
        </div>

        <div className="home-curated-grid home-curated-grid-four">
          {hub.startHere.slice(0, 6).map((post, index) => (
            <StartHereCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </section>

      <section id="home-authority-pages" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Pillar Guides</div>
            <h2 className="home-section-title">Pillar guides that connect the main content clusters</h2>
            <p className="home-section-description">
              These seven pillar guides sit between the resources hub, categories, and articles so readers can enter each topic from one strong page.
            </p>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
            Open pillar hub
          </Link>
        </div>

        <div className="home-quick-grid">
          {hub.pillarPages.slice(0, 8).map((page) => (
            <Link key={page.slug} href={page.href} className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Pillar Guide</span>
                <span className="home-curated-arrow">{page.primaryCategory.label}</span>
              </div>
              <h3 className="home-curated-title">{page.title}</h3>
              <p className="home-curated-copy">{page.description}</p>
              <div className="home-curated-footer">
                <span>{page.articleCount} connected articles</span>
                <span>Open pillar guide</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="homepage-categories" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Explore Categories</div>
          <h2 className="home-section-title">Browse the site naturally instead of hunting through the navbar</h2>
          <p className="home-section-description">
            Category discovery now lives on the homepage and inside the resources hub, where the topic lanes are easier to scan and better connected.
          </p>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#resource-categories`} className="home-section-link">
            Open category hub
          </Link>
        </div>

        <div className="home-discovery-grid">
          {hub.categoryCards.map((card) => (
            <Link key={card.title} href={card.href} className="home-discovery-card">
              <div className="home-discovery-icon" style={{ color: card.accentColor }}>
                {card.icon}
              </div>
              <div className="home-discovery-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="home-popular-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Guides</div>
            <h2 className="home-section-title">Evergreen guides that do the most work for new visitors</h2>
            <p className="home-section-description">
              Practical walkthroughs for deployment, VPS operations, self-hosting, and production checks.
            </p>
          </div>
          <Link href="/category/how-to" className="home-section-link">
            Browse all guides
          </Link>
        </div>

        <div className="home-post-grid">
          {hub.popularGuides.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="home-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Comparisons</div>
            <h2 className="home-section-title">High-intent comparisons for hosting, deployment, tools, and AI workflows</h2>
            <p className="home-section-description">
              Comparison content is one of the strongest ways to guide decisions and keep readers moving deeper into the site.
            </p>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#resources-comparisons`} className="home-section-link">
            Open comparison hub
          </Link>
        </div>

        <div className="home-post-grid">
          {hub.comparisons.slice(0, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="home-free-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Free Tools</div>
            <h2 className="home-section-title">Bookmark-worthy free tools and developer resources</h2>
            <p className="home-section-description">
              This section surfaces free developer tools, PostgreSQL GUIs, free VPS options, AI tools, and budget-friendly stack ideas.
            </p>
          </div>
          <Link href="/category/free-tools" className="home-section-link">
            Browse free tools
          </Link>
        </div>

        <div className="home-post-grid">
          {hub.freeTools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="featured-resources-hub" className="home-section-shell">
        <div className="home-resource-promo">
          <div className="home-resource-promo-copy">
            <div className="home-section-kicker">Featured Resources Hub</div>
            <h2 className="home-section-title">Use the Resources Hub as the control center for the whole site</h2>
            <p className="home-section-description">
              The deployment tag page has been upgraded into the main hub for categories, learning paths, important guides, comparisons, tools, and site navigation.
            </p>
            <div className="home-resource-points">
              <span>Start here guides</span>
              <span>Learning paths</span>
              <span>Category discovery</span>
              <span>Comparisons and tools</span>
              <span>Important articles</span>
            </div>
            <div className="home-hero-actions">
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
                Open Resources Hub
              </Link>
              <Link href={`${RESOURCE_HUB_PATH}#site-map`} className="home-hero-button home-hero-button-secondary">
                Explore All Guides
              </Link>
            </div>
          </div>

          <div className="home-resource-promo-grid">
            {hub.learningPaths.slice(0, 3).map((path) => (
              <Link key={path.id} href={path.href} className="home-resource-promo-card">
                <span className="home-curated-eyebrow">Learning Path</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <div className="home-resource-promo-meta">{path.steps.length} linked reads</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="latest-articles" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Articles</div>
            <h2 className="home-section-title">Recent posts, kept in a tighter supporting role</h2>
            <p className="home-section-description">
              Latest still matters, but the homepage now leads with resource discovery and internal navigation first.
            </p>
          </div>
          <Link href="/blog" className="home-section-link">
            View archive
          </Link>
        </div>

        <div className="home-post-grid">
          {hub.latestArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="what-blixamo-covers" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">What Blixamo Covers</div>
          <h2 className="home-section-title">The site is built for practical developer decisions</h2>
          <p className="home-section-description">
            Blixamo covers the technical and operational topics that affect how developers deploy, self-host, automate, and choose their tools.
          </p>
          </div>
          <Link href={RESOURCE_HUB_PATH} className="home-section-link">
            Explore all resources
          </Link>
        </div>

        <div className="home-discovery-grid">
          {hub.coverageCards.map((card) => (
            <Link key={card.title} href={card.href} className="home-discovery-card home-discovery-card-compact">
              <div className="home-discovery-icon" style={{ color: card.accentColor }}>
                {card.icon}
              </div>
              <div className="home-discovery-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="home-mission-panel">
          <div className="home-mission-copy">
            <div className="home-section-kicker">About Blixamo</div>
            <h3 className="home-mission-title">Blixamo is designed to feel more like a developer control center than a blog archive.</h3>
            <p className="home-section-description">
              The goal is simple: help developers understand where to start, compare real options,
              and move from article to article through useful topic clusters instead of dead-end archive pages.
            </p>
            <div className="home-hero-actions">
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
                Open Developer Hub
              </Link>
              <Link href="/about" className="home-hero-button home-hero-button-secondary">
                About Blixamo
              </Link>
            </div>
          </div>

          <div className="home-mission-grid">
            {hub.missionPoints.map((point) => (
              <div key={point.title} className="home-mission-card">
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="home-newsletter" className="home-section-shell home-newsletter-shell">
        <div className="home-newsletter-panel">
          <div className="home-section-head">
            <div className="home-section-kicker">Newsletter</div>
            <h2 className="home-section-title">Developer updates, guides, tools, comparisons, and practical resources</h2>
            <p className="home-section-description">
              Get the strongest Blixamo reads in one place instead of trying to track every new deploy guide or tool comparison manually.
            </p>
          </div>
          <EmailCapture
            placement="inline"
            headline="Get the best new guides and tool picks"
            subline="One developer-focused email with guides, comparisons, free tools, and resource updates."
          />
        </div>
      </section>
    </>
  )
}
