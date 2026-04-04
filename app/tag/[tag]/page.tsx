import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/blog/PostCard'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { getAllPosts } from '@/lib/posts'
import { getResourceHubContent, RESOURCE_HUB_TAG } from '@/lib/resources'

type Props = { params: Promise<{ tag: string }> }

function SummaryIcon({ kind }: { kind: 'guides' | 'articles' | 'comparisons' | 'tools' }) {
  if (kind === 'guides') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="10" y="12" width="18" height="40" rx="6" />
        <rect x="36" y="12" width="18" height="40" rx="6" />
        <path d="M18 22h8M18 30h8M18 38h8M44 22h8M44 30h8M44 38h8" />
      </svg>
    )
  }

  if (kind === 'articles') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="10" width="48" height="44" rx="10" />
        <path d="M18 22h28M18 30h20M18 38h28M18 46h14" />
        <circle cx="48" cy="46" r="4" />
      </svg>
    )
  }

  if (kind === 'comparisons') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 14v34" />
        <path d="M18 18h28" />
        <path d="M16 24l8 10 8-10" />
        <path d="M32 24l8 10 8-10" />
        <path d="M12 48h40" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M38 12l14 14-8 8-14-14z" />
      <path d="M14 42l18-18 8 8-18 18H14z" />
      <path d="M42 40l8 8" />
      <circle cx="18" cy="18" r="4" />
    </svg>
  )
}

function ResourceSummaryCard({
  count,
  label,
  detail,
  kind,
  imageSrc,
  imageAlt,
}: {
  count: number
  label: string
  detail: string
  kind: 'guides' | 'articles' | 'comparisons' | 'tools'
  imageSrc: string
  imageAlt: string
}) {
  return (
    <div className={`resource-hub-summary-card resource-hub-summary-card-${kind}`}>
      <div className="resource-hub-summary-top">
        <div>
          <strong>{count}</strong>
          <span>{label}</span>
        </div>
        <div className="resource-hub-summary-badge">
          <SummaryIcon kind={kind} />
        </div>
      </div>

      <div className="resource-hub-summary-media">
        <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
        <div className="resource-hub-summary-media-overlay" />
      </div>

      <p className="resource-hub-summary-detail">{detail}</p>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = [...new Set(posts.flatMap((post) => post.tags))]
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params

  if (tag === RESOURCE_HUB_TAG) {
    return {
      title: 'Deployment Resources Hub | Next.js, VPS, Coolify, Self-Hosting',
      description:
        'Start here for Blixamo deployment guides: Next.js on VPS, Coolify, self-hosting, server hardening, comparisons, and practical setup paths.',
      alternates: { canonical: `https://blixamo.com/tag/${tag}` },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: `#${tag}`,
    description: `Browse all Blixamo articles tagged with "${tag}".`,
    alternates: { canonical: `https://blixamo.com/tag/${tag}` },
    robots: { index: false, follow: true },
  }
}

function GenericTagArchive({ tag }: { tag: string }) {
  const posts = getAllPosts().filter((post) => post.tags.includes(tag))
  if (posts.length === 0) notFound()

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Tag
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          #{tag}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          {posts.length} article{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params

  if (tag !== RESOURCE_HUB_TAG) {
    return <GenericTagArchive tag={tag} />
  }

  const allPosts = getAllPosts()
  const hub = getResourceHubContent(allPosts)
  const topHubPaths = [
    {
      title: 'Deploy an app',
      description: 'Go straight to deployment guides for Next.js, Docker, Coolify, and production checks.',
      href: '#deployment-guides',
    },
    {
      title: 'Self-host tools',
      description: 'Open the self-hosting cluster for app stacks, analytics, automation, and recovery workflows.',
      href: '#self-hosting',
    },
    {
      title: 'Compare platforms',
      description: 'Jump into hosting, deployment, and tool comparisons when you need a decision fast.',
      href: '#resources-comparisons',
    },
    {
      title: 'Manage / harden a VPS',
      description: 'Use the VPS section for setup, hardening, recovery, pricing tradeoffs, and operational upkeep.',
      href: '#vps-cloud',
    },
    {
      title: 'Infrastructure watch',
      description: 'Open the mini hub for provider shifts, platform comparisons, and fresh infrastructure reads without scanning the whole hub.',
      href: '/infrastructure-watch',
    },
  ]

  return (
    <div className="resource-hub-shell">
      <section className="resource-hub-hero">
        <div className="resource-hub-hero-copy">
          <div className="home-section-kicker">Deployment Hub</div>
          <h1 className="resource-hub-title">Deploy apps, self-host tools, compare platforms, and manage VPS workflows.</h1>
          <p className="resource-hub-description">
            The main operational hub for practical deployment guides, self-hosting paths, comparison pages, and VPS management reads.
          </p>

          <div className="resource-hub-link-grid">
            {topHubPaths.map((card) => (
              <Link key={card.title} href={card.href} className="resource-hub-link-card">
                <div className="home-curated-top">
                  <span className="home-curated-eyebrow">Operational Entry</span>
                </div>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="resources-start-here" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Foundational Reads</div>
          <h2 className="home-section-title">Best first reads for deployment and self-hosted setups</h2>
          <p className="home-section-description">
            Start here if you want the quickest route into the right operational workflow.
          </p>
        </div>
        <div className="home-post-grid">
          {hub.startHere.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="authority-pages" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Pillar Guides</div>
          <h2 className="home-section-title">Pillar guides for the main operational clusters</h2>
          <p className="home-section-description">
            Use these when you want the broader guide layer behind deployment, self-hosting, VPS, automation, and comparisons.
          </p>
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

      <section id="learning-paths" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Learning Paths</div>
          <h2 className="home-section-title">Choose a goal and follow the reading path</h2>
          <p className="home-section-description">
            Pick the goal first, then follow the right sequence of reads.
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

      <section id="deployment-guides" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Deployment Guides</div>
            <h2 className="home-section-title">Deployment workflows, setup paths, and production checks</h2>
          </div>
          <Link href="/category/how-to" className="home-section-link">
            Browse all guides
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.deploymentGuides.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="self-hosting" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Self Hosting</div>
            <h2 className="home-section-title">Self-hosting guides for apps, services, analytics, and recovery</h2>
          </div>
          <Link href="/category/self-hosting" className="home-section-link">
            Browse self hosting
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.selfHosting.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="resources-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Comparisons</div>
            <h2 className="home-section-title">Hosting, tool, and platform comparisons collected in one place</h2>
          </div>
          <Link href="/guides/comparisons-hub" className="home-section-link">
            Open comparisons hub
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.comparisons.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="vps-cloud" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">VPS &amp; Cloud</div>
            <h2 className="home-section-title">Setup, hardening, recovery, and hosting tradeoffs</h2>
          </div>
          <Link href="/category/vps-cloud" className="home-section-link">
            Browse VPS &amp; Cloud
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.vpsCloud.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="resource-categories" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Explore Categories</div>
          <h2 className="home-section-title">Browse deeper by topic when you need it</h2>
          <p className="home-section-description">
            Use categories for deeper browsing after you pick the main operational path.
          </p>
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

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Hub Inventory</div>
          <h2 className="home-section-title">Quick count of guides, comparisons, and supporting resources</h2>
          <p className="home-section-description">
            Useful once you are orienting inside the hub, but not necessary before the first operational click.
          </p>
        </div>
        <div className="resource-hub-summary-grid">
          <ResourceSummaryCard
            count={hub.stats.guides}
            label="Guides and walkthroughs"
            detail="Core reading paths for deploys, self-hosting, setup, and implementation."
            kind="guides"
            imageSrc="/images/resources/guides-and-walkthroughs.webp"
            imageAlt="Guides and walkthroughs visual board for deploys, self-hosting, setup, and implementation"
          />
          <ResourceSummaryCard
            count={hub.stats.articles}
            label="Total articles available"
            detail="The full site inventory connected through this hub."
            kind="articles"
            imageSrc="/images/resources/full-site-inventory.webp"
            imageAlt="Content hub visual showing the full site inventory connected through the resources hub"
          />
          <ResourceSummaryCard
            count={hub.stats.comparisons}
            label="Comparison pages"
            detail="High-intent tool, hosting, and platform decisions in one place."
            kind="comparisons"
            imageSrc="/images/resources/comparison-pages.webp"
            imageAlt="Comparison hub visual for hosting, platform, and tool decisions"
          />
          <ResourceSummaryCard
            count={hub.stats.tools}
            label="Free tool/resource pages"
            detail="Free software, open-source tools, and practical budget-conscious workflow picks."
            kind="tools"
            imageSrc="/images/resources/free-tools-resources.webp"
            imageAlt="Free tools and resource pages visual with open-source software and budget-conscious workflow picks"
          />
        </div>
      </section>

      <section id="automation" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Automation</div>
          <h2 className="home-section-title">Automation workflows for n8n, bots, and AI-assisted systems</h2>
          </div>
          <Link href="/category/automation" className="home-section-link">
            Browse automation
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.automation.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="ai-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">AI Tools</div>
          <h2 className="home-section-title">Model guides, AI workflows, and developer-focused tool choices</h2>
          </div>
          <Link href="/category/ai" className="home-section-link">
            Browse AI tools
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.aiTools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="developer-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Developer Tools</div>
          <h2 className="home-section-title">Developer tool picks and directory-style workflow upgrades</h2>
          </div>
          <Link href="/category/developer-tools" className="home-section-link">
            Browse developer tools
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.developerTools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="postgresql-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">PostgreSQL Tools</div>
          <h2 className="home-section-title">Database GUI picks, PostgreSQL tooling, and related developer workflow reads</h2>
          </div>
          <Link href="/blog/best-postgresql-gui-free" className="home-section-link">
            Open PostgreSQL pillar
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.postgresqlTools.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="web-development" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Web Development</div>
          <h2 className="home-section-title">Next.js, MDX, performance, and frontend implementation guides</h2>
          </div>
          <Link href="/category/web-dev" className="home-section-link">
            Browse web development
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.webDevelopment.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="indie-dev-saas" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Indie Dev / SaaS</div>
          <h2 className="home-section-title">Budget-aware stack decisions, payments, and solo-builder workflows</h2>
          </div>
          <Link href="/category/indie-hacking" className="home-section-link">
            Browse indie dev
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.indieDevSaas.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="resources-free-tools" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Free Tools</div>
          <h2 className="home-section-title">Free and open source tools worth keeping in your developer stack</h2>
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

      <section id="build-your-stack" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Build Your Stack</div>
          <h2 className="home-section-title">Practical stack blueprints for common developer goals</h2>
          <p className="home-section-description">
            These stack suggestions help turn the site into a memorable planning tool instead of just a list of articles.
          </p>
        </div>
        <div className="resource-stack-grid">
          {hub.stackBlueprints.map((stack) => (
            <div key={stack.title} className="resource-stack-card">
              <div className="resource-path-top">
                <span className="home-curated-eyebrow">Stack</span>
                <Link href={stack.href} className="home-section-link">
                  View hub section
                </Link>
              </div>
              <h3>{stack.title}</h3>
              <p>{stack.description}</p>
              <div className="resource-stack-items">
                {stack.items.map((item) => (
                  <Link key={item.href} href={item.href} className="resource-stack-item">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="popular-articles" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Popular Articles</div>
          <h2 className="home-section-title">Strong pages worth using as anchors into the rest of the site</h2>
          </div>
          <Link href="/blog" className="home-section-link">
            Open blog archive
          </Link>
        </div>
        <div className="home-post-grid">
          {hub.popularArticles.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-articles" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
          <div className="home-section-kicker">Latest Articles</div>
          <h2 className="home-section-title">Recent additions to the site</h2>
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

      <section id="recommended-reading" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Recommended Reading</div>
          <h2 className="home-section-title">Useful supporting reads around the main hubs</h2>
        </div>
        <div className="home-post-grid">
          {hub.recommendedReading.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="site-map" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Site Map / Explore More</div>
          <h2 className="home-section-title">Use this page as a human-friendly site map</h2>
          <p className="home-section-description">
            The goal is to help people and crawlers understand how the homepage, resources hub, categories,
            comparisons, tools pages, and articles connect.
          </p>
        </div>
        <div className="resource-sitemap-grid">
          {hub.sitemapGroups.map((group) => (
            <div key={group.title} className="resource-sitemap-card">
              <h3>{group.title}</h3>
              <div className="resource-sitemap-links">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section-shell home-newsletter-shell">
        <div className="home-newsletter-panel">
          <div className="home-section-head">
            <div className="home-section-kicker">Newsletter</div>
            <h2 className="home-section-title">Get new guides, comparisons, and resource updates</h2>
            <p className="home-section-description">
              Use the newsletter if you want new deployment guides, tool comparisons, and free resource pages without checking the site manually.
            </p>
          </div>
          <EmailCapture
            placement="inline"
            headline="Get the best Blixamo resources by email"
            subline="Developer updates, practical guides, tools, comparisons, and resource hub updates."
          />
        </div>
      </section>

      <section id="about-blixamo" className="home-section-shell">
        <div className="home-mission-panel">
          <div className="home-mission-copy">
            <div className="home-section-kicker">About</div>
            <h2 className="home-section-title">Blixamo is organized as a developer hub, not a loose archive.</h2>
            <p className="home-section-description">
              The goal of this page is to make the site easier to navigate by connecting start-here guides,
              categories, comparisons, free tools, and practical stack decisions in one place.
            </p>
            <div className="home-hero-actions">
              <Link href="/" className="home-hero-button home-hero-button-primary">
                Back to homepage
              </Link>
              <Link href="/community" className="home-hero-button home-hero-button-secondary">
                Community
              </Link>
              <Link href="/blog" className="home-hero-button home-hero-button-secondary">
                Blog archive
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
    </div>
  )
}
