import Link from 'next/link'
import { getPostsByCategory, getAllCategories, getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getCategoryMeta } from '@/lib/categories'
import { getCategoryClusterContent, getRelatedCategoryLinks, getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

type CategoryArchiveContent = {
  intro: string
  audience: string
  articleTypes: string
  importantSlugs: string[]
}

const CATEGORY_ARCHIVE_CONTENT: Record<string, CategoryArchiveContent> = {
  'how-to': {
    intro: 'This category collects practical guides for developers who want clear steps, real commands, and production-ready outcomes instead of generic tutorials.',
    audience: 'Developers shipping apps on their own stack, especially if they need deploy, hosting, or integration walkthroughs that work end to end.',
    articleTypes: 'Step-by-step deployment guides, infrastructure setup tutorials, configuration walkthroughs, and implementation checklists.',
    importantSlugs: [
      'deploy-nextjs-coolify-hetzner',
      'how-to-self-host-nextjs-on-vps',
      'google-search-console-self-hosted-nextjs',
      'build-telegram-bot-claude-api-python',
    ],
  },
  ai: {
    intro: 'This category focuses on AI tools and API workflows that help developers write, automate, and ship faster without hand-wavy claims.',
    audience: 'Developers comparing models, planning AI features, or trying to turn Claude and OpenAI into practical tools for day-to-day work.',
    articleTypes: 'Model comparisons, API cost breakdowns, AI tool roundups, and production use-case guides.',
    importantSlugs: [
      'best-ai-tools-2026',
      'claude-ai-guide',
      'claude-vs-chatgpt-developers',
    ],
  },
  'developer-tools': {
    intro: 'This category helps developers choose the right tools by focusing on actual tradeoffs, real testing, and honest recommendations.',
    audience: 'Developers evaluating software for coding, database work, deployment, and daily workflow improvements.',
    articleTypes: 'Tool comparisons, buyer-style guides, hands-on reviews, and cost or workflow breakdowns.',
    importantSlugs: [
      'best-free-developer-tools-2026',
      'best-postgresql-gui-free',
      'coolify-vs-caprover-2026',
      'best-vpn-for-developers-2026',
    ],
  },
  'indie-hacking': {
    intro: 'This category is about the operational side of building solo: payments, costs, financial tools, and shipping decisions that affect revenue.',
    audience: 'Indie developers, freelancers, and solo founders trying to launch or run internet businesses with fewer payment and tooling headaches.',
    articleTypes: 'Payment integrations, financial tool comparisons, zero-budget launch guides, and business-side workflow posts.',
    importantSlugs: [
      'build-saas-mvp-zero-budget-2026',
      'razorpay-integration-nextjs-india',
      'wise-vs-payoneer-india-freelancer',
      'indian-debit-cards-dev-tools',
    ],
  },
  'self-hosting': {
    intro: 'This category covers running your own apps and services on inexpensive VPS infrastructure without overcomplicating the stack.',
    audience: 'Developers who want more control, lower monthly costs, and practical guidance for hosting production workloads themselves.',
    articleTypes: 'Self-hosting guides, VPS setup walkthroughs, monitoring tutorials, and platform deployment explainers.',
    importantSlugs: [
      'coolify-complete-guide-2026',
      'self-hosting-n8n-hetzner-vps',
      'vps-setup-guide',
      'self-hosting-resources',
    ],
  },
  'vps-cloud': {
    intro: 'This category helps developers pick better cloud and VPS infrastructure by comparing cost, performance, and operational tradeoffs.',
    audience: 'Developers choosing hosting providers, benchmarking infrastructure options, or tightening production server security.',
    articleTypes: 'Provider comparisons, cost breakdowns, infrastructure reviews, and VPS hardening or cloud strategy guides.',
    importantSlugs: [
      'hetzner-vs-digitalocean-vs-vultr-india',
      'hetzner-vs-aws-lightsail-2026',
      'ssh-security-hardening-vps-2026',
      'vps-security-harden-ubuntu-2026',
      'compromised-vps-recovery-2026',
      'hetzner-vs-aws-2026',
    ],
  },
  'web-dev': {
    intro: 'This category focuses on modern web development patterns that improve performance, authoring workflow, and maintainability in real projects.',
    audience: 'Developers building with Next.js, MDX, and Tailwind who want practical patterns they can reuse in production sites.',
    articleTypes: 'Framework tutorials, performance guides, styling comparisons, and implementation patterns for modern frontend stacks.',
    importantSlugs: [
      'nextjs-mdx-blog-2026',
      'nextjs-performance-optimization-2026',
      'tailwind-css-vs-css-modules',
      'nextjs-mdx-remote-rsc-edge-runtime-fix',
      'tailwind-css-tips',
    ],
  },
  automation: {
    intro: 'This category is built around automation systems that reduce repetitive work and replace expensive SaaS with workflows you control.',
    audience: 'Developers and operators building workflow automation with n8n, Node.js, Claude API, and messaging integrations.',
    articleTypes: 'Automation tutorials, platform comparisons, workflow design guides, and AI-assisted process automations.',
    importantSlugs: [
      'n8n-complete-guide-2026',
      'n8n-vs-make-vs-zapier-indie-dev',
      'claude-api-content-automation-nodejs',
    ],
  },
  'free-tools': {
    intro: 'This category highlights free and open source tools that help developers cut SaaS spend without sacrificing useful functionality.',
    audience: 'Developers looking for strong free alternatives, open source replacements, and lean stacks that still feel production-ready.',
    articleTypes: 'Free tool roundups, open source replacements, budget stack recommendations, and curated savings-focused guides.',
    importantSlugs: [
      'open-source-tools-2026',
      'free-tools-indian-indie-developer',
    ],
  },
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  tutorials: 'how-to',
  tools: 'developer-tools',
  tech: 'vps-cloud',
  'indie-dev': 'vps-cloud',
}

function normalizeCategorySlug(category: string): string {
  const normalizedCategory = category.toLowerCase().trim()
  return LEGACY_CATEGORY_MAP[normalizedCategory] || normalizedCategory
}

export async function generateStaticParams() {
  return getAllCategories().map(c => ({ slug: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = normalizeCategorySlug(slug)
  const meta = getCategoryMeta(canonicalSlug)

  return {
    title: `${meta.label} Articles`,
    description: meta.description,
    alternates: { canonical: `https://blixamo.com/category/${canonicalSlug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const canonicalSlug = normalizeCategorySlug(slug)
  const posts = getPostsByCategory(canonicalSlug)

  if (posts.length === 0) notFound()

  const allPosts = getAllPosts()
  const meta = getCategoryMeta(canonicalSlug)
  const archiveContent = CATEGORY_ARCHIVE_CONTENT[canonicalSlug]
  const relatedCategories = getRelatedCategoryLinks(canonicalSlug)
  const hub = getResourceHubContent(allPosts)
  const clusterContent = getCategoryClusterContent(canonicalSlug, allPosts)
  const importantPosts = (
    archiveContent?.importantSlugs
      .map(importantSlug => posts.find(post => post.slug === importantSlug))
      .filter((post): post is NonNullable<typeof post> => Boolean(post)) ||
    []
  )
  const fallbackImportantPosts = posts
    .filter(post => post.featured)
    .concat(posts.filter(post => !post.featured))
    .slice(0, 3)
  const archiveLinks = importantPosts.length > 0 ? importantPosts : fallbackImportantPosts
  const popularGuides = hub.popularGuides
    .filter(post => post.category === canonicalSlug && !archiveLinks.some(linkedPost => linkedPost.slug === post.slug))
    .slice(0, 3)
  const fallbackPopularGuides = posts
    .filter(post => !archiveLinks.some(linkedPost => linkedPost.slug === post.slug))
    .slice(0, 3)
  const categoryPopularGuides = popularGuides.length > 0 ? popularGuides : fallbackPopularGuides
  const relatedResources = [...clusterContent.comparisons, ...clusterContent.tools]
    .filter(
      (post, index, collection) =>
        !archiveLinks.some(linkedPost => linkedPost.slug === post.slug) &&
        !categoryPopularGuides.some(linkedPost => linkedPost.slug === post.slug) &&
        collection.findIndex((entry) => entry.slug === post.slug) === index
    )
    .slice(0, 4)

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Category</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{meta.label}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          {posts.length} article{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <section style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        background: 'var(--surface)',
      }}>
        <p style={{
          margin: 0,
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.8,
        }}>
          {archiveContent?.intro || meta.longDesc}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem',
        }}>
          <div style={{
            padding: '1rem',
            borderRadius: '0.875rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Who This Category Is For</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {archiveContent?.audience || meta.description}
            </p>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '0.875rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>What You'll Find Here</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {archiveContent?.articleTypes || meta.longDesc}
            </p>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '0.875rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Resources Hub</h2>
            <p style={{ margin: '0 0 0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Use the central resources page to jump into learning paths, comparisons, free tools, and the {clusterContent.hubSection.title.toLowerCase()} lane.
            </p>
            <Link href={clusterContent.hubSection.href} style={{ color: 'var(--accent)', fontWeight: 700 }}>
              Open {clusterContent.hubSection.title}
            </Link>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '0.875rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Navigate the Site</h2>
            <p style={{ margin: '0 0 0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Use the homepage, resources hub, and community page as the main return paths around this category.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                Homepage
              </Link>
              <Link href={RESOURCE_HUB_PATH} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                Resources Hub
              </Link>
              <Link href="/community" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                Community Hub
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Important Posts In This Category</h2>
          <ul style={{
            margin: 0,
            paddingLeft: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}>
            {archiveLinks.map(post => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {relatedCategories.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Related Categories</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {relatedCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: category.color,
                    fontWeight: 700,
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {clusterContent.pillarPages.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Pillar Guides
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Pillar pages that anchor {meta.label.toLowerCase()}
              </h2>
              <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Use these pillar guides when you want the main entry points for this category before branching into the full archive.
              </p>
            </div>
            <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-section-link">
              Open pillar hub
            </Link>
          </div>

          <div className="home-quick-grid">
            {clusterContent.pillarPages.map((page) => (
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
      )}

      {categoryPopularGuides.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Popular Guides
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Strong reads to start with in {meta.label}
              </h2>
              <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Use these guide cards if you want the best entry points before scanning the full category archive.
              </p>
            </div>
            <Link href={clusterContent.hubSection.href} className="home-section-link">
              Open {clusterContent.hubSection.title}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {categoryPopularGuides.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      )}

      {relatedResources.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Related Tools / Comparisons
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Use these pages to branch into adjacent decisions
              </h2>
              <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                These linked resources connect {meta.label.toLowerCase()} to related comparisons, free tools, and higher-intent decision pages.
              </p>
            </div>
            <Link href={RESOURCE_HUB_PATH} className="home-section-link">
              Open Blixamo Resources
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {relatedResources.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      )}

      <section>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            All Articles
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Browse the full {meta.label} archive
          </h2>
          <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Every article in this category stays linked here so readers can move from the overview into the complete list without losing context.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {posts.map(post => <PostCard key={post.slug} post={post} />)}
        </div>
      </section>
    </div>
  )
}
