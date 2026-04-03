import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, type Post } from '@/lib/posts'
import { getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Blixamo | Self Hosting, VPS, AI & Developer Tools',
  description:
    'Blixamo helps developers deploy apps, self-host services, compare tools, and improve web development workflows through practical guides, categories, and hub pages.',
  alternates: { canonical: 'https://blixamo.com' },
}

type HubCard = {
  title: string
  description: string
  href: string
  eyebrow?: string
}

type RouteCard = HubCard & {
  footerPrimary: string
  footerSecondary: string
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
  const routeCards = [
    {
      title: 'Deployment hub',
      description: 'Use /tag/deployment as the main operational hub when you want the clearest route into deployment guides, categories, and strong article clusters.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Hub',
      footerPrimary: '/tag/deployment',
      footerSecondary: 'Main entry point',
    },
    {
      title: 'Category lanes',
      description: 'Open category pages when you already know the topic lane and want a tighter cluster than the homepage can provide.',
      href: '/category/self-hosting',
      eyebrow: 'Category',
      footerPrimary: '/category/self-hosting',
      footerSecondary: 'Topic-first browsing',
    },
    {
      title: 'Pillar guides',
      description: 'Use guide pages when you want authority-style navigation that connects articles, comparisons, and related surfaces inside one cluster.',
      href: '/guides/comparisons-hub',
      eyebrow: 'Guide',
      footerPrimary: '/guides/comparisons-hub',
      footerSecondary: 'Authority pages',
    },
    {
      title: 'Blog archive',
      description: 'Jump into the archive only when you already know the article you want or need the full list of recent posts.',
      href: '/blog',
      eyebrow: 'Archive',
      footerPrimary: '/blog',
      footerSecondary: 'Everything in one place',
    },
  ] satisfies RouteCard[]
  const featuredPaths = hub.learningPaths.filter((path) =>
    ['deploy-apps', 'self-host-services', 'choose-vps', 'automation-workflows'].includes(path.id)
  )
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
            <div className="home-hero-kicker">Blixamo Developer Hub</div>
            <h1 className="home-hero-title">Deployment, self-hosting, comparisons, and web development for developers</h1>
            <p className="home-hero-description">
              Use Blixamo to get into deployment guides, self-hosting workflows, comparison pages, and web development articles
              without digging through a generic blog archive.
            </p>

            <div className="home-hero-actions">
              <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
                Deployment Hub
              </Link>
              <Link href="/category/self-hosting" className="home-hero-button home-hero-button-secondary">
                Self-Hosting
              </Link>
              <Link href="/guides/comparisons-hub" className="home-hero-button home-hero-button-secondary">
                Comparisons
              </Link>
              <Link href="/category/web-dev" className="home-hero-button home-hero-button-secondary">
                Web Development
              </Link>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hub-board">
              <div className="home-hub-board-head">
                <div>
                  <div className="home-side-eyebrow">Route Roles</div>
                  <h2 className="home-hub-board-title">Homepage routes traffic. The deployment hub handles deeper discovery.</h2>
                </div>
                <Link href={RESOURCE_HUB_PATH} className="home-section-link">
                  Open hub
                </Link>
              </div>

              <div className="home-hub-panel-grid">
                {routeCards.map((card) => (
                  <Link key={card.title} href={card.href} className="home-hub-panel">
                    <span className="home-hub-panel-icon">{card.eyebrow}</span>
                    <strong>{card.title}</strong>
                    <span>{card.description}</span>
                    <span className="home-curated-footer" style={{ marginTop: '0.2rem' }}>
                      <span>{card.footerPrimary}</span>
                      <span>{card.footerSecondary}</span>
                    </span>
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

      <section id="categories" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Topic Lanes</div>
            <h2 className="home-section-title">Use categories when you know the topic and want the shortest route into that cluster</h2>
            <p className="home-section-description">
              Categories are narrower than the homepage and broader than a single guide, which makes them the cleanest next click
              after the hero lanes.
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
            <h2 className="home-section-title">Guide pages that connect categories, comparisons, and articles inside one authority surface</h2>
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
            <h2 className="home-section-title">Comparison pages for hosting, tooling, and platform decisions with real developer intent</h2>
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

      <section id="learning-paths" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Featured Paths</div>
            <h2 className="home-section-title">Follow a path when you want a curated sequence instead of picking pages one by one</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#learning-paths`} className="home-section-link">
            View all paths
          </Link>
        </div>
        <div className="resource-path-grid">
          {featuredPaths.map((path) => (
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


