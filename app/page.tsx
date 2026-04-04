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

type IntentLane = HubCard & {
  routeLabel: string
  accentColor: string
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
  const intentLanes = [
    {
      title: 'Deployment',
      description: 'Go straight into VPS deploy workflows, production setup, Nginx, SSL, and repeatable launch guides.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Main lane',
      routeLabel: '/tag/deployment',
      accentColor: '#2563eb',
    },
    {
      title: 'Self-Hosting',
      description: 'Use this lane for running apps, automation, analytics, and services on infrastructure you control.',
      href: '/category/self-hosting',
      eyebrow: 'Category lane',
      routeLabel: '/category/self-hosting',
      accentColor: '#059669',
    },
    {
      title: 'Comparisons',
      description: 'Open high-intent decision pages for hosting, platforms, tools, and developer stack tradeoffs.',
      href: '/guides/comparisons-hub',
      eyebrow: 'Guide lane',
      routeLabel: '/guides/comparisons-hub',
      accentColor: '#d97706',
    },
    {
      title: 'AI for Developers',
      description: 'Open the mini hub when you want the tight AI lane: useful reads, comparisons, and workflow paths without the full archive.',
      href: '/ai-for-developers',
      eyebrow: 'Mini hub',
      routeLabel: '/ai-for-developers',
      accentColor: '#7c3aed',
    },
    {
      title: 'Web Development',
      description: 'Browse Next.js, MDX, performance, CSS, and production web development guides without extra noise.',
      href: '/category/web-dev',
      eyebrow: 'Category lane',
      routeLabel: '/category/web-dev',
      accentColor: '#ea580c',
    },
  ] satisfies IntentLane[]
  const routeCards = [
    {
      title: 'Homepage',
      description: 'Broad brand page and first router for the whole site.',
      href: '/',
      eyebrow: 'Now',
      footerPrimary: 'Current page',
      footerSecondary: 'Start here',
    },
    {
      title: 'Deployment hub',
      description: 'Deep discovery surface for deployment, lanes, and strong linked clusters.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Hub',
      footerPrimary: '/tag/deployment',
      footerSecondary: 'Operational hub',
    },
    {
      title: 'Category lane',
      description: 'Use topic pages when you know the subject and want tighter navigation.',
      href: '/category/self-hosting',
      eyebrow: 'Category',
      footerPrimary: '/category/self-hosting',
      footerSecondary: 'Topic-first',
    },
    {
      title: 'Guide page',
      description: 'Authority surface that connects articles, comparisons, and related routes.',
      href: '/guides/comparisons-hub',
      eyebrow: 'Guide',
      footerPrimary: '/guides/comparisons-hub',
      footerSecondary: 'Authority',
    },
    {
      title: 'Archive',
      description: 'Full article list when you already know what you want to browse.',
      href: '/blog',
      eyebrow: 'Archive',
      footerPrimary: '/blog',
      footerSecondary: 'Full list',
    },
  ] satisfies RouteCard[]
  const featuredPaths = hub.learningPaths.filter((path) =>
    ['deploy-apps', 'self-host-services', 'choose-vps', 'automation-workflows'].includes(path.id)
  )
  const coverageStats = [
    { value: hub.stats.articles, label: 'Articles' },
    { value: hub.categoryCards.length, label: 'Categories' },
    { value: hub.pillarPages.length, label: 'Pillar guides' },
    { value: hub.stats.comparisons, label: 'Comparisons' },
  ]
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
      <div className="home-page-root">
        <section className="home-hero-shell">
          <div className="home-hero">
            <div className="home-hero-copy">
              <div className="home-hero-kicker">Blixamo Developer Hub</div>
              <h1 className="home-hero-title">Deployment, self-hosting, comparisons, and web development for developers</h1>
              <p className="home-hero-description">
                Use Blixamo to get into deployment guides, self-hosting workflows, comparison pages, and web development articles
                without digging through a generic blog archive.
              </p>

              <div className="home-intent-grid">
                {intentLanes.map((lane) => (
                  <Link
                    key={lane.title}
                    href={lane.href}
                    className="home-intent-card"
                    style={{
                      background: `linear-gradient(180deg, ${lane.accentColor}12 0%, rgba(255, 255, 255, 0.96) 55%)`,
                      borderColor: `${lane.accentColor}26`,
                      boxShadow: `0 18px 44px ${lane.accentColor}14`,
                    }}
                  >
                    <div className="home-intent-top">
                      <span className="home-intent-eyebrow" style={{ color: lane.accentColor }}>
                        {lane.eyebrow}
                      </span>
                      <span className="home-intent-arrow">Open</span>
                    </div>
                    <h2 className="home-intent-title">{lane.title}</h2>
                    <p className="home-intent-copy">{lane.description}</p>
                    <div className="home-intent-meta">
                      <span>{lane.routeLabel}</span>
                      <span>High intent</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="home-hub-board home-role-board">
                <div className="home-hub-board-head">
                  <div>
                    <div className="home-side-eyebrow">Route Roles</div>
                    <h2 className="home-hub-board-title">One homepage. Five clear route roles.</h2>
                    <p className="home-role-description">
                      The homepage routes traffic cleanly, then hands deeper browsing to the right surface.
                    </p>
                  </div>
                  <Link href={RESOURCE_HUB_PATH} className="home-section-link">
                    Open hub
                  </Link>
                </div>

                <div className="home-role-grid">
                  {routeCards.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className={`home-hub-panel home-role-card${card.title === 'Homepage' ? ' home-role-card-active' : ''}`}
                    >
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

                <div className="home-hub-stat-row home-trust-strip">
                  {coverageStats.map((stat) => (
                    <div key={stat.label} className="home-hub-stat">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="home-section-shell home-homepage-section home-homepage-section-muted">
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

        <section id="pillar-guides" className="home-section-shell home-homepage-section">
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

        <section id="comparisons" className="home-section-shell home-homepage-section home-homepage-section-muted">
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

        <section id="learning-paths" className="home-section-shell home-homepage-section">
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

        <section id="free-tools" className="home-section-shell home-homepage-section home-homepage-section-muted">
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

        <section id="tutorials" className="home-section-shell home-homepage-section">
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

        <section id="popular-guides" className="home-section-shell home-homepage-section home-homepage-section-muted">
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

        <section id="community" className="home-section-shell home-homepage-section">
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

        <section id="latest-articles" className="home-section-shell home-homepage-section home-homepage-section-muted">
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
      </div>
    </>
  )
}


