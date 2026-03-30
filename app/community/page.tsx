import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { TemplateLinkBar } from '@/components/layout/TemplateLinkBar'
import { getAllPosts, type Post } from '@/lib/posts'
import { RESOURCE_HUB_PATH } from '@/lib/resources'
import { getResourceHubContent } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'Developer Community Hub',
  description:
    'Developer community hub for browsing categories, pillar guides, free tools, latest reads, and practical paths into Blixamo topic clusters.',
  alternates: { canonical: 'https://blixamo.com/community' },
}

type CommunityCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const COMMUNITY_SECTIONS: CommunityCard[] = [
  {
    title: 'Developer Discussions',
    description: 'Start with practical conversations around deployment, self-hosting, automation, and real tool tradeoffs.',
    href: RESOURCE_HUB_PATH,
    eyebrow: 'Discuss',
  },
  {
    title: 'Indie Hacker Stories',
    description: 'Use the indie-hacking cluster for MVP decisions, monetization tradeoffs, and shipping lessons from lean products.',
    href: '/category/indie-hacking',
    eyebrow: 'Stories',
  },
  {
    title: 'Tool Recommendations',
    description: 'Browse the strongest tool roundups, PostgreSQL clients, AI picks, and workflow upgrades in one place.',
    href: '/guides/developer-tools-directory',
    eyebrow: 'Tools',
  },
  {
    title: 'VPS Setups',
    description: 'Follow the VPS and self-hosting paths for stack setup, hardening, reverse proxy, and production checks.',
    href: '/guides/deploy-apps-on-vps-complete-guide',
    eyebrow: 'Infrastructure',
  },
  {
    title: 'Weekly Resources',
    description: 'Use the resource hub and the latest articles archive to keep up with new guides, comparisons, and checklists.',
    href: '/blog',
    eyebrow: 'Resources',
  },
  {
    title: 'Questions and Answers',
    description: 'Use this page as the Q&A entry point, then branch into category pages and pillar guides for the best next read.',
    href: '/guides/comparisons-hub',
    eyebrow: 'Q&A',
  },
]

const COMMUNITY_LINKS: CommunityCard[] = [
  {
    title: 'Resources Hub',
    description: 'The main start-here page for categories, pillar guides, comparisons, and high-intent reading paths.',
    href: RESOURCE_HUB_PATH,
    eyebrow: 'Start Here',
  },
  {
    title: 'Self Hosting Guide',
    description: 'The main authority page for self-hosting apps, analytics, automation, and supporting infrastructure.',
    href: '/guides/self-hosting-complete-guide',
    eyebrow: 'Pillar Guide',
  },
  {
    title: 'Free Tools Guide',
    description: 'Open the free-tools pillar if the current problem is cutting software spend without breaking the workflow.',
    href: '/guides/free-tools-for-developers',
    eyebrow: 'Pillar Guide',
  },
  {
    title: 'Free Tools Category',
    description: 'Browse the free-tools cluster directly when you want open source replacements, budget stacks, and lean software picks.',
    href: '/category/free-tools',
    eyebrow: 'Category',
  },
  {
    title: 'About Blixamo',
    description: 'See how the publication is organized and what topics the site focuses on across deployment, tooling, and operations.',
    href: '/about',
    eyebrow: 'About',
  },
]

const BUILDING_SHOWCASE: CommunityCard[] = [
  {
    title: 'Self-hosted app stacks',
    description: 'Coolify, Docker Compose, reverse proxy, analytics, and automation on small VPS infrastructure.',
    href: '/category/self-hosting',
    eyebrow: 'What People Build',
  },
  {
    title: 'AI-assisted workflows',
    description: 'Claude, API workflows, bots, and automation systems for developers who want faster output.',
    href: '/category/ai',
    eyebrow: 'What People Build',
  },
  {
    title: 'Low-cost SaaS setups',
    description: 'Budget-aware MVP stacks, payment setup, free tools, and early-stage product workflows.',
    href: '/blog/build-saas-mvp-zero-budget-2026',
    eyebrow: 'What People Build',
  },
]

function CommunityCard({ card }: { card: CommunityCard }) {
  return (
    <Link href={card.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{card.eyebrow}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h2 className="home-curated-title">{card.title}</h2>
      <p className="home-curated-copy">{card.description}</p>
      <div className="home-curated-footer">
        <span>Use this path</span>
        <span>Read more</span>
      </div>
    </Link>
  )
}

export default function CommunityPage() {
  const allPosts = getAllPosts()
  const hub = getResourceHubContent(allPosts)
  const communityStats = [
    {
      label: 'Indexed-ready paths',
      value: `${hub.pillarPages.length} pillar guides`,
      description: 'Authority pages that connect categories, comparisons, and practical articles.',
      href: `${RESOURCE_HUB_PATH}#authority-pages`,
    },
    {
      label: 'Main topic clusters',
      value: `${hub.categoryCards.length} categories`,
      description: 'Browsable hubs for self-hosting, free tools, web development, VPS, automation, and more.',
      href: `${RESOURCE_HUB_PATH}#resource-categories`,
    },
    {
      label: 'Current article base',
      value: `${hub.stats.articles} articles`,
      description: 'Production-focused reads that this page helps route visitors toward instead of leaving them in a dead-end archive.',
      href: '/blog',
    },
  ]
  const startHereCards: CommunityCard[] = [
    {
      title: 'Homepage',
      description: 'Use the homepage when you want the broadest overview of the site before choosing a narrower topic lane.',
      href: '/',
      eyebrow: 'Start Here',
    },
    {
      title: 'Resources Hub',
      description: 'Jump into the main start-here hub for learning paths, comparisons, category clusters, and pillar guides.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Start Here',
    },
    {
      title: 'Free Tools Category',
      description: 'Browse free tools for developers when the main goal is cutting software spend without weakening the workflow.',
      href: '/category/free-tools',
      eyebrow: 'Start Here',
    },
    {
      title: 'Developer Tools Guide',
      description: 'Open the tools directory when you want broad software picks before narrowing into a specific workflow decision.',
      href: '/guides/developer-tools-directory',
      eyebrow: 'Start Here',
    },
    {
      title: 'Self Hosting Guide',
      description: 'Use the self-hosting pillar when you want the fastest route into infrastructure, app stacks, and operations.',
      href: '/guides/self-hosting-complete-guide',
      eyebrow: 'Start Here',
    },
    {
      title: 'Blog Archive',
      description: 'Open the archive when you want the latest useful reads after you understand the main topic structure.',
      href: '/blog',
      eyebrow: 'Start Here',
    },
  ]
  const featuredPillarSlugs = [
    'deploy-apps-on-vps-complete-guide',
    'self-hosting-complete-guide',
    'developer-tools-directory',
    'free-tools-for-developers',
  ]
  const startLearningCards = featuredPillarSlugs
    .map((slug) => hub.pillarPages.find((page) => page.slug === slug))
    .filter((page): page is NonNullable<typeof page> => Boolean(page))
    .map((page) => ({
      title: page.title,
      description: page.description,
      href: page.href,
      eyebrow: 'Pillar Guide',
    }))
  const continueExploringCards: CommunityCard[] = [
    {
      title: 'Homepage',
      description: 'Return to the main site hub for top-level discovery paths and featured content clusters.',
      href: '/',
      eyebrow: 'Continue Exploring',
    },
    {
      title: 'Resources Hub',
      description: 'Use the start-here hub for categories, pillar guides, comparisons, and structured learning paths.',
      href: RESOURCE_HUB_PATH,
      eyebrow: 'Continue Exploring',
    },
    {
      title: 'Blog Archive',
      description: 'Browse the full article archive when you want the complete list of posts across all topic clusters.',
      href: '/blog',
      eyebrow: 'Continue Exploring',
    },
    {
      title: 'Comparisons Hub',
      description: 'Move into decision pages when the next question is which tool, provider, or platform should win.',
      href: '/guides/comparisons-hub',
      eyebrow: 'Continue Exploring',
    },
  ]
  const freeToolDiscoveryCards = hub.freeTools.slice(0, 6)
  const practicalReads = [
    ...hub.webDevelopment,
    ...hub.indieDevSaas,
    ...hub.popularGuides,
    ...hub.deploymentGuides,
    ...hub.selfHosting,
    ...hub.automation,
  ].filter((post, index, collection): post is Post => collection.findIndex((entry) => entry.slug === post.slug) === index).slice(0, 6)

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <TemplateLinkBar relatedHref="/guides/self-hosting-complete-guide" relatedLabel="Self Hosting Guide" />

      <section className="home-resource-promo">
        <div className="home-resource-promo-copy">
          <div className="home-section-kicker">Community Hub</div>
          <h1 className="home-section-title">The developer community hub for practical builds, free tools, and useful next reads.</h1>
          <p className="home-section-description">
            This page is the community discovery layer for Blixamo. Use it to browse major categories, find useful guides,
            discover free tools for developers, follow learning paths, and move into the latest practical reads without
            getting stuck on a flat archive page.
          </p>
          <div className="home-hero-actions">
            <Link href="/" className="home-hero-button home-hero-button-secondary">
              Homepage
            </Link>
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-primary">
              Start Here
            </Link>
            <Link href="/category/free-tools" className="home-hero-button home-hero-button-secondary">
              Free Tools
            </Link>
            <Link href="/guides/self-hosting-complete-guide" className="home-hero-button home-hero-button-secondary">
              Self Hosting Guide
            </Link>
            <Link href="/blog" className="home-hero-button home-hero-button-secondary">
              Browse Blog
            </Link>
          </div>
        </div>

        <div className="home-resource-promo-grid">
          {COMMUNITY_LINKS.map((card) => (
            <div key={card.title} className="home-resource-promo-card">
              <span className="home-curated-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="home-section-link">
                Open
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="community-start-here" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Start Here</div>
            <h2 className="home-section-title">Use these paths if this is your first stop on the site</h2>
            <p className="home-section-description">
              The goal is to give readers and crawlers a clean route into the homepage, the resources hub, the free-tools cluster,
              and the strongest guide layers without repeating the same links everywhere else.
            </p>
          </div>
          <Link href={RESOURCE_HUB_PATH} className="home-section-link">
            Open resources hub
          </Link>
        </div>
        <div className="home-quick-grid">
          {startHereCards.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="why-community" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Why This Page Exists</div>
          <h2 className="home-section-title">This is a crawlable community map, not a thin archive page</h2>
          <p className="home-section-description">
            Blixamo does not run a generic forum. The community hub exists to connect recurring developer questions to the strongest
            parts of the site: category hubs, pillar guides, comparison pages, and practical build logs. If someone lands here first,
            they should be able to move into the right topic cluster in one click instead of bouncing back to search.
          </p>
          <p className="home-section-description" style={{ marginTop: '0.85rem' }}>
            That matters for readers and for crawl depth. This route surfaces the current structure of the site, highlights the main
            build paths, and keeps discussion-oriented intent tied to real technical content such as self-hosting guides, free-tools
            roundups, VPS hardening workflows, and tool comparison pages.
          </p>
        </div>

        <div className="home-discovery-grid">
          {communityStats.map((item) => (
            <Link key={item.label} href={item.href} className="home-discovery-card">
              <div className="home-discovery-body">
                <h3>{item.label}</h3>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</p>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="discussions" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Community Topics</div>
          <h2 className="home-section-title">Use these entry points to explore the practical side of the site</h2>
          <p className="home-section-description">
            Each card points into a strong topic cluster so the page works like a community map, not a dead-end archive.
          </p>
        </div>
        <div className="home-quick-grid">
          {COMMUNITY_SECTIONS.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="continue-exploring" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Continue Exploring</div>
          <h2 className="home-section-title">Use the main site hubs to move back into the content network</h2>
        </div>
        <div className="home-quick-grid">
          {continueExploringCards.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="start-learning" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Start Learning</div>
            <h2 className="home-section-title">Use these pillar guides as the fastest way into each major cluster</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
            Browse all pillar guides
          </Link>
        </div>
        <div className="home-quick-grid">
          {startLearningCards.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="free-tools-discovery" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Free Tools</div>
            <h2 className="home-section-title">Budget-first software picks worth opening from the community hub</h2>
            <p className="home-section-description">
              If the main goal is lowering software spend, this is the cleanest branch from the community hub into the
              native free-tools cluster. Start with the category hub, then use these curated reads to narrow into API
              clients, docs tooling, Git workflow helpers, diagrams, and open-source replacements.
            </p>
          </div>
          <Link href="/category/free-tools" className="home-section-link">
            Browse free tools
          </Link>
        </div>
        <div className="home-post-grid">
          {freeToolDiscoveryCards.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="showcase" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">What People Are Building</div>
          <h2 className="home-section-title">Use the community hub to branch into real product and infrastructure paths</h2>
          <p className="home-section-description">
            These routes cover the patterns that show up most often on the site: self-hosted stacks, AI-assisted workflows,
            free-tool-driven MVP builds, and low-cost infrastructure choices that still feel production-ready.
          </p>
        </div>
        <div className="home-quick-grid">
          {BUILDING_SHOWCASE.map((card) => (
            <CommunityCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="popular-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Guides</div>
            <h2 className="home-section-title">Strong guides and articles the community layer should keep circulating</h2>
          </div>
          <Link href={`${RESOURCE_HUB_PATH}#popular-articles`} className="home-section-link">
            Open popular articles
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.popularGuides.slice(0, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="explore-categories" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Explore Categories</div>
            <h2 className="home-section-title">Browse the main content clusters directly from the community layer</h2>
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

      <section id="popular-community-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Popular Articles</div>
            <h2 className="home-section-title">High-signal reads the community hub should keep in circulation</h2>
            <p className="home-section-description">
              Use these pages to move from broad discussion into the strongest deployment, tooling, and infrastructure articles.
            </p>
          </div>
          <Link href="/blog" className="home-section-link">
            Browse all articles
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.popularArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="community-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Comparison Pages</div>
            <h2 className="home-section-title">Decision pages that help discussions turn into practical next steps</h2>
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

      <section id="practical-community-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical Reads</div>
            <h2 className="home-section-title">Hands-on articles worth surfacing from the community layer</h2>
          </div>
          <Link href={RESOURCE_HUB_PATH} className="home-section-link">
            Open resources hub
          </Link>
        </div>
        <div className="home-post-grid">
          {practicalReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-community-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Articles</div>
            <h2 className="home-section-title">Fresh guides and updates connected back into the main site hubs</h2>
          </div>
          <Link href="/blog" className="home-section-link">
            Open latest archive
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.latestArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="community-links" className="home-section-shell">
        <div className="home-newsletter-panel">
          <div className="home-section-kicker">Community Links</div>
          <h2 className="home-section-title" style={{ marginTop: '0.75rem' }}>Use this page as the handoff point into the rest of the site</h2>
          <p className="home-section-description" style={{ marginTop: '0.75rem' }}>
            Dedicated chat channels can come later. Right now the strongest community paths are the homepage, the resources hub,
            the free-tools category, the pillar guides, and the blog archive. Use those pages to keep exploring instead of
            treating the community route as a dead end.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
            <Link href="/" className="home-hero-button home-hero-button-secondary">
              Homepage
            </Link>
            <Link href={RESOURCE_HUB_PATH} className="home-hero-button home-hero-button-secondary">
              Resource Hub
            </Link>
            <Link href="/category/free-tools" className="home-hero-button home-hero-button-secondary">
              Free Tools
            </Link>
            <Link href="/category/indie-hacking" className="home-hero-button home-hero-button-secondary">
              Indie Hacking
            </Link>
            <Link href="/category/developer-tools" className="home-hero-button home-hero-button-secondary">
              Developer Tools
            </Link>
            <Link href="/blog" className="home-hero-button home-hero-button-secondary">
              Blog Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

