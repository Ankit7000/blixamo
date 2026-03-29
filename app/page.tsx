import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, type Post } from '@/lib/posts'
import { getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Blixamo | Self Hosting, VPS, AI & Developer Tools',
  description:
    'Blixamo helps developers learn self-hosting, deployment, automation, cloud infrastructure, and practical developer tools through guides, categories, and resource hubs.',
  alternates: { canonical: 'https://blixamo.com' },
}

type HubCard = {
  title: string
  description: string
  href: string
  eyebrow?: string
}

function uniquePosts(posts: Post[]): Post[] {
  const seen = new Set<string>()
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function HubLinkCard({ card }: { card: HubCard }) {
  return (
    <Link href={card.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{card.eyebrow ?? 'Explore'}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h3 className="home-curated-title">{card.title}</h3>
      <p className="home-curated-copy">{card.description}</p>
      <div className="home-curated-footer">
        <span>Use this route</span>
        <span>Read more</span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const allPosts = getAllPosts()
  const hub = getResourceHubContent(allPosts)
  const tutorials = uniquePosts([...hub.startHere, ...hub.deploymentGuides, ...hub.webDevelopment]).slice(0, 6)
  const resources = [
    {
      title: 'Resource Hub',
      description: 'Start here if you want categories, pillar guides, comparisons, free tools, and popular reads connected in one place.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Start Here',
    },
    {
      title: 'Developer Tools Directory',
      description: 'Use the pillar page for software picks, workflow upgrades, and practical tool recommendations.',
      href: '/guides/developer-tools-directory',
      eyebrow: 'Pillar Guide',
    },
    {
      title: 'Free Tools for Developers',
      description: 'Open the free-tools pillar if the goal is lowering spend without wrecking the workflow.',
      href: '/guides/free-tools-for-developers',
      eyebrow: 'Resources',
    },
    {
      title: 'Blog Archive',
      description: 'Browse the full article archive when you already know the topic and want the complete list.',
      href: '/blog',
      eyebrow: 'Blog',
    },
    {
      title: 'About Blixamo',
      description: 'Read how the site is structured across categories, pillar guides, comparisons, and practical infrastructure topics.',
      href: '/about',
      eyebrow: 'About',
    },
    {
      title: 'Community Hub',
      description: 'Use the community page for discussions, build stories, tool recommendations, and weekly resources.',
      href: '/community',
      eyebrow: 'Community',
    },
  ] satisfies HubCard[]
  const communityCards = [
    {
      title: 'Developer discussions',
      description: 'Talk through deployment paths, self-hosting tradeoffs, and tool decisions from a practical developer angle.',
      href: '/community#discussions',
      eyebrow: 'Community',
    },
    {
      title: 'Indie hacker stories',
      description: 'Jump into MVP building, monetization, and lean-stack decisions tied to real solo builder problems.',
      href: '/community#showcase',
      eyebrow: 'Stories',
    },
    {
      title: 'Weekly resources',
      description: 'Use the community hub as a jumping-off point for fresh links, useful guides, and stack ideas worth saving.',
      href: '/community#community-links',
      eyebrow: 'Resources',
    },
  ] satisfies HubCard[]

  return (
    <>
      <WebsiteJsonLd />

      <section className="home-hero-shell">
        <div className="home-hero">
          <div className="home-hero-copy">
            <div className="home-hero-kicker">Developer Hub</div>
            <h1 className="home-hero-title">Blixamo Self Hosting, VPS, AI &amp; Developer Tools</h1>
            <p className="home-hero-description">
              Blixamo is organized as a developer hub for learning self-hosting, deployment, automation, cloud infrastructure,
              comparisons, and practical developer tools through categories, pillar guides, and resource paths.
            </p>

            <div className="home-hero-actions">
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
                Start Here
              </Link>
              <Link href="/blog" className="home-hero-button home-hero-button-secondary">
                Blog Archive
              </Link>
              <Link href="/guides/self-hosting-complete-guide" className="home-hero-button home-hero-button-secondary">
                Self Hosting Guide
              </Link>
              <Link href="/guides/free-tools-for-developers" className="home-hero-button home-hero-button-secondary">
                Free Tools
              </Link>
              <Link href="/guides/comparisons-hub" className="home-hero-button home-hero-button-secondary">
                Comparisons
              </Link>
              <Link href="/community" className="home-hero-button home-hero-button-secondary">
                Community
              </Link>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hub-board">
              <div className="home-hub-board-head">
                <div>
                  <div className="home-side-eyebrow">Core Structure</div>
                  <h2 className="home-hub-board-title">Home  Resource Hub  Categories  Guides  Articles</h2>
                </div>
                <Link href={RESOURCE_HUB_PATH} className="home-section-link">
                  Open hub
                </Link>
              </div>

              <div className="home-hub-panel-grid">
                {hub.heroPanels.slice(0, 6).map((panel) => (
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
                  <strong>{hub.pillarPages.length}</strong>
                  <span>Pillar guides</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.categoryCards.length}</strong>
                  <span>Categories</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.stats.comparisons}</strong>
                  <span>Comparisons</span>
                </div>
                <div className="home-hub-stat">
                  <strong>{hub.stats.articles}</strong>
                  <span>Articles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="start-here" className="home-section-shell">
        <div className="home-resource-promo">
          <div className="home-resource-promo-copy">
            <div className="home-section-kicker">Start Here / Resource Hub</div>
            <h2 className="home-section-title">Use the deployment hub as the main entry point for the entire site</h2>
            <p className="home-section-description">
              The resource hub at <strong>/tag/deployment</strong> is the best place for new visitors to start. It connects
              categories, pillar guides, comparisons, free tools, and high-value articles without forcing users to browse randomly.
            </p>
            <div className="home-hero-actions">
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
                Open Resource Hub
              </Link>
              <Link href={`${RESOURCE_HUB_PATH}#resource-categories`} className="home-hero-button home-hero-button-secondary">
                Categories
              </Link>
              <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-hero-button home-hero-button-secondary">
                Pillar Guides
              </Link>
            </div>
          </div>

          <div className="home-quick-grid">
            {hub.resourceHubEntryCards.map((card) => (
              <HubLinkCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        <div className="home-section-head" style={{ marginTop: '1.75rem' }}>
          <div className="home-section-kicker">Popular Articles</div>
          <h3 className="home-section-title">Strong pages to open right after the hub</h3>
        </div>
        <div className="home-post-grid">
          {hub.popularArticles.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="learning-paths" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Learning Paths</div>
          <h2 className="home-section-title">Choose a path instead of navigating the site one post at a time</h2>
          <p className="home-section-description">
            These paths are the fastest way to move from curiosity into a useful topic cluster.
          </p>
        </div>
        <div className="resource-path-grid">
          {hub.learningPaths.map((path) => (
            <div key={path.id} className="resource-path-card">
              <div className="resource-path-top">
                <span className="home-curated-eyebrow">Path</span>
                <Link href={path.href} className="home-section-link">
                  Jump in
                </Link>
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <ol className="resource-path-steps">
                {path.steps.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Explore Categories</div>
            <h2 className="home-section-title">Browse the main content clusters like a developer portal</h2>
            <p className="home-section-description">
              Each category is a direct lane into a topic area with stronger internal linking than a simple blog archive.
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

      <section id="pillar-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Pillar Guides</div>
            <h2 className="home-section-title">Authority pages that connect categories, guides, comparisons, and articles</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
            Browse all pillar guides
          </Link>
        </div>

        <div className="home-quick-grid">
          {hub.pillarPages.map((page) => (
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

      <section id="comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Comparisons</div>
            <h2 className="home-section-title">Comparison pages that do the SEO and decision-making work</h2>
          </div>
          <Link href="/guides/comparisons-hub" className="home-section-link">
            Open comparisons hub
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.comparisons.slice(0, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="free-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Free Tools</div>
            <h2 className="home-section-title">Free developer tools, open-source picks, and budget-friendly resources</h2>
          </div>
          <Link href="/guides/free-tools-for-developers" className="home-section-link">
            Open free tools guide
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.freeTools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="tutorials" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Tutorials</div>
            <h2 className="home-section-title">Step-by-step guides for setup, deployment, performance, and troubleshooting</h2>
          </div>
          <Link href="/category/how-to" className="home-section-link">
            Browse tutorials
          </Link>
        </div>
        <div className="home-post-grid">
          {tutorials.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="resources" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Resources</div>
          <h2 className="home-section-title">Directories, curated content, resource hubs, and important supporting pages</h2>
          <p className="home-section-description">
            These links help the homepage feel like a portal into the rest of the site instead of a flat stream of articles.
          </p>
        </div>
        <div className="home-quick-grid">
          {resources.map((card) => (
            <HubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="community" className="home-section-shell">
        <div className="home-resource-promo">
          <div className="home-resource-promo-copy">
            <div className="home-section-kicker">Community</div>
            <h2 className="home-section-title">Use the community hub for discussions, build stories, weekly resources, and what people are shipping</h2>
            <p className="home-section-description">
              The community page gives the site a social and discovery layer without changing the core content structure.
            </p>
            <div className="home-hero-actions">
              <Link href="/community" className="home-hero-button home-hero-button-primary">
                Open Community Hub
              </Link>
              <Link href="/community#showcase" className="home-hero-button home-hero-button-secondary">
                What People Build
              </Link>
            </div>
          </div>

          <div className="home-quick-grid">
            {communityCards.map((card) => (
              <HubLinkCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section id="popular-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Guides</div>
            <h2 className="home-section-title">Important articles that anchor the strongest topic clusters</h2>
          </div>
          <Link href={RESOURCE_HUB_PATH} className="home-section-link">
            Open resource hub
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.popularGuides.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-articles" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Articles</div>
            <h2 className="home-section-title">Newest additions to the article archive</h2>
          </div>
          <Link href="/blog" className="home-section-link">
            Browse blog archive
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.latestArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  )
}


