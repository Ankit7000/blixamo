import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'AI for Developers',
  description:
    'A focused Blixamo mini hub for AI changes, model comparisons, tools, and practical workflows that actually matter to developers.',
  alternates: { canonical: 'https://blixamo.com/ai-for-developers' },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOOL_AND_COMPARISON_SLUGS = [
  'best-ai-tools-2026',
  'claude-vs-chatgpt-developers',
  'claude-api-vs-openai-gpt4-2026',
  'claude-api-vs-openai-cost-india',
  'n8n-vs-make-vs-zapier-indie-dev',
] as const

const SELF_HOST_OR_SAAS_PATHS: MiniHubCard[] = [
  {
    title: 'Self-hosted AI workflows',
    description: 'Use this path when you want AI automations, bots, or agent-style workflows on infrastructure you control.',
    href: '/blog/self-hosting-n8n-hetzner-vps',
    eyebrow: 'Self Host',
  },
  {
    title: 'API-first SaaS path',
    description: 'Use this route when you care more about shipping with Claude or OpenAI quickly than operating another stack layer.',
    href: '/blog/claude-ai-guide',
    eyebrow: 'Use SaaS',
  },
]

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'AI Developers category',
    description: 'Go deeper into model, API, and developer-tool reads when you want the full AI lane.',
    href: '/category/ai',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Automation category',
    description: 'Use this lane when the real question is workflows, orchestration, bots, and repeated work.',
    href: '/category/automation',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Self-Hosting category',
    description: 'Open this if the next question is where the AI tooling should run and how much ops you want to carry.',
    href: '/category/self-hosting',
    eyebrow: 'Related Lane',
  },
]

function uniquePosts(posts: Post[]): Post[] {
  const seen = new Set<string>()

  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function pickPostsBySlug(posts: Post[], slugs: readonly string[]): Post[] {
  return slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is Post => Boolean(post))
}

function pickFreshAiReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()
      return (
        post.category === 'ai' ||
        post.category === 'automation' ||
        /ai|claude|openai|gpt|llm|model|automation|agent|n8n/.test(text)
      )
    })
  )
    .sort((a, b) => getPostFreshnessDate(b).getTime() - getPostFreshnessDate(a).getTime())
    .slice(0, limit)
}

function MiniHubLinkCard({ card }: { card: MiniHubCard }) {
  return (
    <Link href={card.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">{card.eyebrow}</span>
        <span className="home-curated-arrow">Open</span>
      </div>
      <h3 className="home-curated-title">{card.title}</h3>
      <p className="home-curated-copy">{card.description}</p>
      <div className="home-curated-footer">
        <span>Use this path</span>
        <span>Read more</span>
      </div>
    </Link>
  )
}

export default function AiForDevelopersPage() {
  const allPosts = getAllPosts()
  const latestUsefulReads = pickFreshAiReads(allPosts, 4)
  const toolAndComparisonReads = pickPostsBySlug(allPosts, TOOL_AND_COMPARISON_SLUGS)

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 1rem 3rem' }}>
      <section
        style={{
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="home-section-kicker">Mini Hub</div>
        <h1 className="home-section-title">AI for Developers</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused Blixamo landing page for AI updates, tools, comparisons, and workflows that change how developers
          build, ship, or automate real work.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-primary">
            Latest useful reads
          </Link>
          <Link href="#tools-and-comparisons" className="home-hero-button home-hero-button-secondary">
            Tools and comparisons
          </Link>
          <Link href="#self-host-or-saas" className="home-hero-button home-hero-button-secondary">
            Self-host or SaaS
          </Link>
        </div>
      </section>

      <section className="home-section-shell">
        <div
          style={{
            padding: '1.1rem 1.2rem',
            borderRadius: '0.95rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="home-section-kicker">What This Hub Is For</div>
          <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Use this page when you want the AI topics that actually affect developer work now: model or API changes,
            tools worth testing, practical comparisons, and deployable workflows instead of generic AI hype.
          </p>
        </div>
      </section>

      <section id="latest-useful-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Useful Reads</div>
            <h2 className="home-section-title">Fresh AI reads worth checking now</h2>
          </div>
          <Link href="/community" className="home-section-link">
            Open community
          </Link>
        </div>
        <div className="home-post-grid">
          {latestUsefulReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="tools-and-comparisons" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical AI Tools / Comparisons</div>
            <h2 className="home-section-title">Model, API, and workflow decisions that matter</h2>
          </div>
          <Link href="/category/ai" className="home-section-link">
            Browse AI lane
          </Link>
        </div>
        <div className="home-post-grid">
          {toolAndComparisonReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="self-host-or-saas" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Self-Host Or Use SaaS</div>
          <h2 className="home-section-title">Choose the operational path that matches the workload</h2>
        </div>
        <div className="home-quick-grid">
          {SELF_HOST_OR_SAAS_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Related Lanes</div>
          <h2 className="home-section-title">Move into the next lane only when the question changes</h2>
        </div>
        <div className="home-quick-grid">
          {RELATED_LANES.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div
          style={{
            padding: '1.1rem 1.2rem',
            borderRadius: '0.95rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="home-section-kicker">Keep Reading</div>
          <p style={{ margin: '0.55rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Use this page as the focused AI/dev mini hub. When the topic widens into broader freshness or operational
            questions, go to Community or the Deployment Hub next.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/community" className="home-hero-button home-hero-button-secondary">
              Community
            </Link>
            <Link href="/tag/deployment" className="home-hero-button home-hero-button-secondary">
              Deployment Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
