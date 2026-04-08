import Link from 'next/link'
import { getAllCategories, getIndexablePosts, getIndexablePostsByCategory, type Post } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getCategoryMeta } from '@/lib/categories'
import { getCategoryClusterContent, getRelatedCategoryLinks, RESOURCE_HUB_PATH } from '@/lib/resources'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

type CategoryArchiveContent = {
  intro: string
  audience: string
  articleTypes: string
  importantSlugs: string[]
  startHere?: string
  metadataTitle?: string
  metadataDescription?: string
  editorialNote?: string
  evaluationNote?: string
  editorialPicks?: {
    label: string
    slug: string
    reason: string
  }[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CategoryLaneFeatureCard({
  eyebrow,
  title,
  description,
  href,
  footer,
}: {
  eyebrow: string
  title: string
  description: string
  href: string
  footer: string
}) {
  return (
    <Link
      href={href}
      className="home-curated-card"
      style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{eyebrow}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h3 className="home-curated-title">{title}</h3>
      <p className="home-curated-copy" style={{ flex: 1 }}>
        {description}
      </p>
      <div className="home-curated-footer">
        <span>{footer}</span>
        <span>Read now</span>
      </div>
    </Link>
  )
}

function LatestTopicItem({ post }: { post: Post }) {
  return (
    <article
      style={{
        padding: '1rem 1.1rem',
        borderRadius: '0.95rem',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center',
          marginBottom: '0.55rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>{formatDate(post.date)}</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', lineHeight: 1.35 }}>
        <Link href={`/blog/${post.slug}`} style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </Link>
      </h3>
      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{post.description}</p>
    </article>
  )
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
    intro: 'For developers choosing models, tools, and API workflows, this lane surfaces the clearest AI guides, comparisons, and practical implementation reads.',
    audience: 'Developers comparing models, planning AI features, or trying to turn Claude and OpenAI into practical tools for day-to-day work.',
    articleTypes: 'Model comparisons, API cost breakdowns, AI tool roundups, and production use-case guides.',
    startHere:
      'Start with a model or workflow question, not a generic AI curiosity. The best path is usually one practical guide plus one comparison before you commit to a tool or API lane.',
    editorialNote:
      'Blixamo treats AI as an operator topic, not a hype category. The useful pages here are the ones that help developers decide what to build, which model fits the work, and how to turn prompts into repeatable workflows.',
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
    startHere:
      'Use this lane when the real question is tool fit. Start with the page closest to your workflow bottleneck, then use the supporting comparisons to pressure-test the recommendation before you switch.',
    editorialNote:
      'The goal here is not to list every app in a category. It is to surface tools that materially improve a developer workflow, explain the tradeoffs, and rule out weak picks quickly.',
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
    intro: 'For developers self-hosting apps, services, or analytics on a VPS, this lane surfaces the strongest setup guides, platform choices, and operating reads worth opening first.',
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
    intro: 'For developers choosing a host or hardening a server, this lane surfaces the strongest VPS and cloud comparisons, setup guides, and security reads.',
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
    intro: 'For developers building with Next.js, MDX, and Tailwind, this lane surfaces the strongest implementation guides, performance reads, and frontend tradeoff pieces.',
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
    intro: 'For developers automating repeat work with n8n, bots, and AI workflows, this lane surfaces the clearest tutorials, comparisons, and build-first automation reads.',
    audience: 'Developers and operators building workflow automation with n8n, Node.js, Claude API, and messaging integrations.',
    articleTypes: 'Automation tutorials, platform comparisons, workflow design guides, and AI-assisted process automations.',
    startHere:
      'Read this category with a workflow in mind. The strongest path is to choose the automation layer first, then use the tutorial and comparison pages here to decide whether the stack is worth operating yourself.',
    editorialNote:
      'Automation only gets more value when it survives real constraints like hosting, observability, and maintenance. The pages in this lane prioritize workflows developers can actually run, not just clever demos.',
    importantSlugs: [
      'n8n-complete-guide-2026',
      'n8n-vs-make-vs-zapier-indie-dev',
      'claude-api-content-automation-nodejs',
    ],
  },
  'free-tools': {
    intro: 'This category is for developers who want fewer recurring tool bills without wrecking speed, team fit, or day-to-day workflow quality.',
    audience: 'Developers, indie hackers, and builders looking for free or open-source software that still earns a place in day-to-day API, docs, Git, diagram, and shipping workflows.',
    articleTypes: 'Free tool roundups, open-source replacements, focused workflow shortlists, and savings-first software guides that stay useful after the first click.',
    startHere:
      'Start with the workflow you are trying to improve, not with the word free. The useful pages here are the ones that tell you when the free tier is enough, where the limits show up, and which tools still feel fast once you use them every week.',
    importantSlugs: [
      'open-source-tools-2026',
      'best-free-api-testing-tools-2026',
      'best-free-documentation-tools-2026',
      'best-free-git-tools-2026',
      'best-free-diagram-tools-2026',
    ],
    metadataTitle: 'Free Tools for Developers',
    metadataDescription: 'Free tools for developers, open-source software, and budget-first workflow guides that help cut recurring tool spend without weakening quality.',
    editorialNote:
      'This lane is intentionally curated, not padded. A tool only belongs here if the free version is strong enough for real work, the tradeoffs are clear, and the recommendation holds up after the first week instead of only looking good on a pricing page.',
    evaluationNote:
      'I judge free tools by workflow fit first. The real questions are whether the tool stays fast, where the limits start to hurt, how much lock-in it creates, and whether free is actually enough for a serious developer workflow instead of just a trial in disguise.',
    editorialPicks: [
      {
        label: 'Best starting point for API work',
        slug: 'best-free-api-testing-tools-2026',
        reason: 'Use this when the real need is faster request testing and collaboration without paying for a heavy client too early.',
      },
      {
        label: 'Best for docs',
        slug: 'best-free-documentation-tools-2026',
        reason: 'Read this if your bottleneck is shipping docs people will actually maintain after the first sprint.',
      },
      {
        label: 'Best for Git',
        slug: 'best-free-git-tools-2026',
        reason: 'Open this when the goal is cleaner Git work without turning the workflow into a slower GUI habit.',
      },
      {
        label: 'Best for diagrams',
        slug: 'best-free-diagram-tools-2026',
        reason: 'Start here if you need diagrams that are quick enough for engineering work, not just pretty exports.',
      },
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
  const archiveContent = CATEGORY_ARCHIVE_CONTENT[canonicalSlug]

  return {
    title: archiveContent?.metadataTitle || `${meta.label} Articles`,
    description: archiveContent?.metadataDescription || meta.description,
    alternates: { canonical: `https://blixamo.com/category/${canonicalSlug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const canonicalSlug = normalizeCategorySlug(slug)
  const posts = getIndexablePostsByCategory(canonicalSlug)

  if (posts.length === 0) notFound()

  const allPosts = getIndexablePosts()
  const meta = getCategoryMeta(canonicalSlug)
  const archiveContent = CATEGORY_ARCHIVE_CONTENT[canonicalSlug]
  const relatedCategories = getRelatedCategoryLinks(canonicalSlug)
  const clusterContent = getCategoryClusterContent(canonicalSlug, allPosts)
  const editorialPicks =
    archiveContent?.editorialPicks
      ?.map((pick) => {
        const post = allPosts.find((candidate) => candidate.slug === pick.slug)
        return post ? { ...pick, post } : null
      })
      .filter((pick): pick is NonNullable<typeof pick> => Boolean(pick)) || []
  const importantPosts = (
    archiveContent?.importantSlugs
      .map(importantSlug => posts.find(post => post.slug === importantSlug))
      .filter((post): post is NonNullable<typeof post> => Boolean(post)) ||
    []
  )
  const fallbackImportantPosts = posts
    .filter(post => post.featured)
    .concat(posts.filter(post => !post.featured))
    .slice(0, 6)
  const strongestPosts = (importantPosts.length > 0 ? importantPosts : fallbackImportantPosts).slice(0, 6)
  const strongestPostSlugs = new Set(strongestPosts.map((post) => post.slug))
  const primaryPillar = clusterContent.pillarPages.find((page) => !strongestPostSlugs.has(page.slug)) || clusterContent.pillarPages[0]
  const primaryComparison = clusterContent.comparisons.find((post) => !strongestPostSlugs.has(post.slug)) || clusterContent.comparisons[0]
  const reservedSlugs = new Set(
    [primaryPillar?.slug, primaryComparison?.slug].filter((slug): slug is string => Boolean(slug))
  )
  const latestPosts = posts.filter((post) => !strongestPostSlugs.has(post.slug) && !reservedSlugs.has(post.slug))
  const supportingHub =
    canonicalSlug === 'ai'
      ? {
          label: 'Comparisons Guide',
          href: '/guides/comparisons-hub',
          description: 'Use the comparisons guide when the next step is choosing between AI tools, APIs, or workflow approaches without opening a noindexed mini hub.',
        }
      : canonicalSlug === 'developer-tools'
      ? {
          label: 'Developer Tools Guide',
          href: '/guides/developer-tools-directory',
          description: 'Use the developer tools guide when you want a broader, indexed path through software picks, database tooling, and workflow upgrades.',
        }
      : canonicalSlug === 'vps-cloud'
      ? {
          label: 'Hetzner Billing Hub',
          href: '/hetzner-billing-hub',
          description: 'Use the Hetzner Billing Hub when the real question is payment methods, invoice friction, India-specific card issues, and what to read after billing is sorted.',
        }
      : canonicalSlug === 'self-hosting'
      ? {
          label: 'Coolify Hub',
          href: '/coolify-hub',
          description: 'Use the Coolify Hub when the real question is platform fit, first deploys, multi-app VPS layout, and what to read after the initial install.',
        }
      : canonicalSlug === 'web-dev'
      ? {
          label: 'Next.js MDX Hub',
          href: '/nextjs-mdx-hub',
          description: 'Use the Next.js MDX Hub when the real question is file-backed MDX setup, content architecture, runtime fixes, and production publishing upgrades.',
        }
      : canonicalSlug === 'automation'
      ? {
          label: 'Automation Guide',
          href: '/guides/automation-guide-for-developers',
          description: 'Use the automation guide when the real question is workflow fit, hosting tradeoffs, and which automation reads to open next on indexed pages.',
        }
      : canonicalSlug === 'free-tools'
      ? {
          label: 'Free Tools Guide',
          href: '/guides/free-tools-for-developers',
          description: 'Use the free tools guide when you want the indexed cluster path through open-source replacements, workflow-specific picks, and the strongest savings-first reads.',
        }
      : {
          label: 'Deployment Hub',
          href: RESOURCE_HUB_PATH,
          description: 'Use the deployment hub when the next question moves from this topic into operations, hosting, or broader comparisons.',
        }
  const freeToolsRouteLinks =
    canonicalSlug === 'free-tools'
      ? [
          {
            title: 'Community',
            description: 'Use Community when you want the current editorial layer before you widen back into the full free-tools cluster.',
            href: '/community',
            eyebrow: 'Editorial Hub',
          },
          {
            title: 'Deployment Resources Hub',
            description: 'Open the resources hub when a free-tool choice changes how you deploy, host, or operate the stack around it.',
            href: RESOURCE_HUB_PATH,
            eyebrow: 'Resources Hub',
          },
          {
            title: 'Free Tools for Developers',
            description: 'Use the indexed free-tools guide when you want the cleanest route through open-source replacements and budget-first workflow picks.',
            href: '/guides/free-tools-for-developers',
            eyebrow: 'Pillar Guide',
          },
          {
            title: 'Developer Tools Directory',
            description: 'Move here when the next question is broader tool fit instead of one narrow free replacement.',
            href: '/guides/developer-tools-directory',
            eyebrow: 'Directory',
          },
          {
            title: 'Comparisons Hub',
            description: 'Open this only when the shortlist is real and you need a sharper tool or platform verdict before switching.',
            href: '/guides/comparisons-hub',
            eyebrow: 'Decision Lane',
          },
        ]
      : []

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <section style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Category
        </div>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{meta.label}</h1>
        <p style={{ margin: '0.7rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '760px' }}>
          {archiveContent?.intro || meta.longDesc}
        </p>
        <p style={{ margin: '0.7rem 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {posts.length} article{posts.length !== 1 ? 's' : ''} in this lane. Latest post: {formatDate(posts[0].updatedAt || posts[0].date)}.
        </p>
      </section>

      {(archiveContent?.startHere || archiveContent?.editorialNote) && (
        <section style={{ marginBottom: '2rem' }}>
          <div
            style={{
              padding: '1.15rem 1.2rem',
              borderRadius: '0.95rem',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div style={{ marginBottom: '0.95rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                How To Use This Lane
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                Read {meta.label.toLowerCase()} like an editorial path, not just a card grid
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.45rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Who this is for</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{archiveContent.audience}</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.45rem', fontSize: '1rem', color: 'var(--text-primary)' }}>What belongs here</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{archiveContent.articleTypes}</p>
              </div>
              {archiveContent.startHere && (
                <div>
                  <h3 style={{ margin: '0 0 0.45rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Start here</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{archiveContent.startHere}</p>
                </div>
              )}
            </div>
            {archiveContent.editorialNote && (
              <p style={{ margin: '1rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {archiveContent.editorialNote}
              </p>
            )}
            {archiveContent.evaluationNote && (
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <h3 style={{ margin: '0 0 0.45rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  How I judge free tools
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {archiveContent.evaluationNote}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {editorialPicks.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Editorial Picks
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Quick recommendations by workflow
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {editorialPicks.map((pick) => (
              <Link
                key={pick.slug}
                href={`/blog/${pick.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '1rem 1.05rem',
                  borderRadius: '0.95rem',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  display: 'grid',
                  gap: '0.45rem',
                }}
              >
                <span className="home-curated-eyebrow">{pick.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {pick.post.title}
                </span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{pick.reason}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {freeToolsRouteLinks.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div
            style={{
              padding: '1.15rem 1.2rem',
              borderRadius: '0.95rem',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div style={{ marginBottom: '0.9rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Use This Cluster With
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                Free tools works best when you keep one editorial route and one wider tool route open
              </h2>
            </div>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Start with the strongest article in this lane, then widen the route through <Link href="/community">Community</Link>, the{' '}
              <Link href={RESOURCE_HUB_PATH}>deployment resources hub</Link>, the{' '}
              <Link href="/guides/free-tools-for-developers">Free Tools for Developers guide</Link>, and the{' '}
              <Link href="/guides/developer-tools-directory">Developer Tools Directory</Link>. Open the{' '}
              <Link href="/guides/comparisons-hub">comparisons hub</Link> only when the next job is choosing between real alternatives instead of finding the cheapest workable default.
            </p>
            <div className="home-quick-grid">
              {freeToolsRouteLinks.map((link) => (
                <CategoryLaneFeatureCard
                  key={link.href}
                  eyebrow={link.eyebrow}
                  title={link.title}
                  description={link.description}
                  href={link.href}
                  footer="Indexed route"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Top Reads
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Start with the strongest {meta.label.toLowerCase()} articles
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {strongestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {(primaryPillar || primaryComparison) && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Best Next Clicks
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Open one guide and one comparison when you need more context
            </h2>
          </div>
          <div className="home-quick-grid">
            {primaryPillar && (
              <CategoryLaneFeatureCard
                eyebrow="Pillar Guide"
                title={primaryPillar.title}
                description={primaryPillar.description}
                href={primaryPillar.href}
                footer={`${primaryPillar.articleCount} connected articles`}
              />
            )}
            {primaryComparison && (
              <CategoryLaneFeatureCard
                eyebrow="Comparison"
                title={primaryComparison.title}
                description={primaryComparison.description}
                href={`/blog/${primaryComparison.slug}`}
                footer={`${formatDate(primaryComparison.date)} · ${primaryComparison.readingTime}`}
              />
            )}
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Latest In This Topic
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Newer reads in {meta.label.toLowerCase()}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {latestPosts.map((post) => (
              <LatestTopicItem key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <div
          style={{
            padding: '1.1rem 1.2rem',
            borderRadius: '0.95rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Related Lanes
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{supportingHub.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.9rem' }}>
            <Link href={supportingHub.href} className="home-hero-button home-hero-button-secondary">
              {supportingHub.label}
            </Link>
            {relatedCategories.slice(0, 3).map((category) => (
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
      </section>
    </div>
  )
}
