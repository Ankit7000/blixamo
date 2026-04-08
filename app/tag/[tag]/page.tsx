import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getIndexablePosts } from '@/lib/posts'
import { getResourceHubContent, RESOURCE_HUB_TAG } from '@/lib/resources'

type Props = { params: Promise<{ tag: string }> }

const RETIRED_TAG_REDIRECTS: Record<string, string> = {
  cloudflare: '/tag/deployment',
}

function getRetiredTagRedirect(tag: string): string | null {
  return RETIRED_TAG_REDIRECTS[tag] ?? null
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const tags = [...new Set(posts.flatMap((post) => post.tags))]
    .filter((tag) => !getRetiredTagRedirect(tag))
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const retiredTagRedirect = getRetiredTagRedirect(tag)

  if (retiredTagRedirect) {
    permanentRedirect(retiredTagRedirect)
  }

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
  const retiredTagRedirect = getRetiredTagRedirect(tag)

  if (retiredTagRedirect) {
    permanentRedirect(retiredTagRedirect)
  }

  if (tag !== RESOURCE_HUB_TAG) {
    return <GenericTagArchive tag={tag} />
  }

  const allPosts = getIndexablePosts()
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
      title: 'Compare hosting options',
      description: 'Open the comparisons guide when you need a faster verdict on hosts, deployment platforms, or stack tradeoffs before you commit.',
      href: '/guides/comparisons-hub',
    },
  ]
  const furtherExploration = [
    {
      title: 'Current reads',
      description: 'Use Community when you want the freshest practical posts and updated guides before opening deeper lanes.',
      href: '/community',
    },
    {
      title: 'Browse the full archive',
      description: 'Open Blog when you want the wider editorial archive after the main deployment decisions are already clear.',
      href: '/blog',
    },
    {
      title: 'VPS and hosting lane',
      description: 'Use the VPS and cloud category for provider comparisons, hardening reads, and hosting strategy pages.',
      href: '/category/vps-cloud',
    },
    {
      title: 'Automation next',
      description: 'Move into the automation guide when deployment is only step one and the real goal is a workflow you can operate.',
      href: '/guides/automation-guide-for-developers',
    },
  ]

  return (
    <div className="resource-hub-shell">
      <section className="resource-hub-hero">
        <div className="resource-hub-hero-copy">
          <div className="home-section-kicker">Deployment Hub</div>
          <h1 className="resource-hub-title">Deploy apps, self-host tools, compare platforms, and manage VPS workflows.</h1>
          <p className="resource-hub-description">
            Use this page when the question is operational: what to deploy on, how to self-host it, and which stack is worth choosing before you touch a server.
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
            Use these when you need the fuller reading path behind a deploy, self-hosting plan, or comparison-heavy decision.
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
            Start with the goal, then follow the smallest set of reads that gets you to a usable decision or setup.
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

      <section className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Further Exploration</div>
            <h2 className="home-section-title">Go deeper only after the main deployment decision is clear</h2>
            <p className="home-section-description">
              If you already know the operational path, these indexed pages help you widen the research without turning this hub back into a route map.
            </p>
          </div>
          <Link href="/community" className="home-section-link">
            Open Community
          </Link>
        </div>
        <div className="home-quick-grid">
          {furtherExploration.map((card) => (
            <Link key={card.title} href={card.href} className="home-curated-card">
              <div className="home-curated-top">
                <span className="home-curated-eyebrow">Next Path</span>
                <span className="home-curated-arrow">Open</span>
              </div>
              <h3 className="home-curated-title">{card.title}</h3>
              <p className="home-curated-copy">{card.description}</p>
              <div className="home-curated-footer">
                <span>Indexed destination</span>
                <span>Read next</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
