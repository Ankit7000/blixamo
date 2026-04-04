import Link from 'next/link'
import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts, getPostFreshnessDate, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'n8n Automation Hub',
  description:
    'A focused Blixamo mini hub for practical n8n setup, self-hosting, workflow decisions, platform comparisons, and useful automation reads for developers.',
  alternates: { canonical: 'https://blixamo.com/n8n-automation-hub' },
}

type MiniHubCard = {
  title: string
  description: string
  href: string
  eyebrow: string
}

const TOP_READ_SLUGS = [
  'n8n-complete-guide-2026',
  'n8n-vs-make-vs-zapier-indie-dev',
  'self-hosting-n8n-hetzner-vps',
  'whatsapp-ai-assistant-n8n-claude-api',
] as const

const PRACTICAL_PATHS: MiniHubCard[] = [
  {
    title: 'Start with what n8n is actually for',
    description: 'Use this first when the real question is whether n8n fits your workflow, how much of the stack to self-host, and which first automations are worth building.',
    href: '/blog/n8n-complete-guide-2026',
    eyebrow: 'Start',
  },
  {
    title: 'Self-host it on a VPS without overcomplicating the stack',
    description: 'Open this when you already know n8n is the right workflow layer and need the practical Hetzner deployment path with Docker, SSL, Redis, and steady operations.',
    href: '/blog/self-hosting-n8n-hetzner-vps',
    eyebrow: 'Self-Host',
  },
  {
    title: 'Build a webhook or assistant workflow next',
    description: 'Use this path when you want a real bot-style workflow that connects messaging, webhooks, and model output instead of staying at setup level.',
    href: '/blog/whatsapp-ai-assistant-n8n-claude-api',
    eyebrow: 'Workflow',
  },
  {
    title: 'Pair n8n with a real API backend',
    description: 'Open this when the automation needs FastAPI, queueing, shared infra, and cleaner boundaries between orchestration and application logic.',
    href: '/blog/n8n-fastapi-hetzner-vps',
    eyebrow: 'API Stack',
  },
] as const

const DECISION_PATHS: MiniHubCard[] = [
  {
    title: 'Choose n8n or stay on Zapier or Make',
    description: 'Use this when the main decision is platform fit: control and cost versus the faster hosted defaults and easier onboarding.',
    href: '/blog/n8n-vs-make-vs-zapier-indie-dev',
    eyebrow: 'Compare',
  },
  {
    title: 'Use self-hosted n8n only when the workflow is worth operating',
    description: 'Open this if you need the practical answer on when self-hosting is sensible and when one more server process is just extra maintenance.',
    href: '/blog/self-hosting-n8n-hetzner-vps',
    eyebrow: 'Decision',
  },
  {
    title: 'Keep code and workflow responsibilities separate',
    description: 'Use this when the real architecture question is whether n8n should orchestrate the flow while FastAPI or another service owns the core business logic.',
    href: '/blog/n8n-fastapi-hetzner-vps',
    eyebrow: 'Architecture',
  },
] as const

const RELATED_LANES: MiniHubCard[] = [
  {
    title: 'Automation category',
    description: 'Go wider when you want the broader automation cluster instead of only the n8n and workflow-engine lane.',
    href: '/category/automation',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Automation Guide for Developers',
    description: 'Use the guide when the next question is the overall workflow strategy across scripts, n8n, bots, and AI-assisted systems.',
    href: '/guides/automation-guide-for-developers',
    eyebrow: 'Related Lane',
  },
  {
    title: 'Community',
    description: 'Open Community when you want fresher adjacent reads without widening into the full archive.',
    href: '/community',
    eyebrow: 'Related Lane',
  },
] as const

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

function pickFreshN8nReads(posts: Post[], limit = 4): Post[] {
  return uniquePosts(
    posts.filter((post) => {
      const text = `${post.title} ${post.description} ${post.keyword} ${post.tags.join(' ')}`.toLowerCase()

      return (
        TOP_READ_SLUGS.includes(post.slug as (typeof TOP_READ_SLUGS)[number]) ||
        ((post.category === 'automation' || post.category === 'ai' || post.category === 'self-hosting') &&
          /n8n|automation|workflow|zapier|make|webhook|bot|claude|fastapi|waha/.test(text))
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

export default function N8nAutomationHubPage() {
  const allPosts = getAllPosts()
  const topReads = pickPostsBySlug(allPosts, TOP_READ_SLUGS)
  const latestUsefulReads = pickFreshN8nReads(allPosts, 4)

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
        <h1 className="home-section-title">n8n Automation Hub</h1>
        <p className="home-section-description" style={{ maxWidth: '780px' }}>
          A focused route for practical n8n decisions: what it is for, when to self-host it, how it compares against
          Zapier and Make, where webhook and bot workflows fit, and which reads matter once the automation stack
          becomes real.
        </p>
        <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
          <Link href="#top-reads" className="home-hero-button home-hero-button-primary">
            Best starting reads
          </Link>
          <Link href="#latest-useful-reads" className="home-hero-button home-hero-button-secondary">
            Latest useful reads
          </Link>
          <Link href="#workflow-path" className="home-hero-button home-hero-button-secondary">
            Workflow path
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
            Use this page when the real question is not automation in general, but whether n8n fits the workflow, when
            to self-host it, how to connect it to bots or APIs, and what to read next after the first useful workflow
            is clear.
          </p>
        </div>
      </section>

      <section id="top-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Top Reads</div>
            <h2 className="home-section-title">Best starting reads for the n8n and workflow lane</h2>
          </div>
          <Link href="/category/automation" className="home-section-link">
            Browse automation
          </Link>
        </div>
        <div className="home-post-grid">
          {topReads.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="latest-useful-reads" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Latest Useful Reads</div>
            <h2 className="home-section-title">Current n8n, webhook, bot, and automation reads worth reopening</h2>
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

      <section id="workflow-path" className="home-section-shell">
        <div className="home-section-head home-section-head-inline">
          <div>
            <div className="home-section-kicker">Practical Setup / Workflow Path</div>
            <h2 className="home-section-title">Go from platform fit to self-hosting to a working webhook or API workflow</h2>
          </div>
          <Link href="/guides/automation-guide-for-developers" className="home-section-link">
            Open automation guide
          </Link>
        </div>
        <div className="home-quick-grid">
          {PRACTICAL_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section id="decision-path" className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Comparison / Decision Path</div>
          <h2 className="home-section-title">Choose the workflow tool, hosting model, and architecture before the stack grows sideways</h2>
        </div>
        <div className="home-quick-grid">
          {DECISION_PATHS.map((card) => (
            <MiniHubLinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="home-section-shell">
        <div className="home-section-head">
          <div className="home-section-kicker">Related Lanes</div>
          <h2 className="home-section-title">Move wider only when the question stops being mainly about n8n and workflow design</h2>
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
            Keep this hub for the n8n lane. Jump to the automation category for the broader cluster or the automation
            guide when the next decision is scripts versus workflows versus AI-assisted systems.
          </p>
          <div className="home-hero-actions" style={{ marginTop: '0.9rem' }}>
            <Link href="/category/automation" className="home-hero-button home-hero-button-secondary">
              Automation category
            </Link>
            <Link href="/guides/automation-guide-for-developers" className="home-hero-button home-hero-button-secondary">
              Automation guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
