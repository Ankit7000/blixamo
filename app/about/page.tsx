import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { absoluteUrl } from '@/lib/site'
import { PRIMARY_AUTHOR } from '@/components/blog/AuthorBio'

const TOPIC_CARDS = [
  {
    symbol: 'VPS',
    title: 'VPS and Self-Hosting Guides',
    description: 'Practical deployment guides, server setup patterns, reverse proxies, monitoring, and low-cost infrastructure decisions.',
  },
  {
    symbol: 'DEV',
    title: 'Developer Tools',
    description: 'Tool comparisons, workflow recommendations, and direct verdicts on what actually speeds up developer work.',
  },
  {
    symbol: 'NXT',
    title: 'Next.js Deployment',
    description: 'Real-world Next.js hosting, PM2, Nginx, build performance, MDX, and App Router production setups.',
  },
  {
    symbol: 'DB',
    title: 'PostgreSQL and Databases',
    description: 'Database tooling, GUI choices, operational tradeoffs, and stack decisions around real application workloads.',
  },
  {
    symbol: 'AI',
    title: 'AI and Automation Workflows',
    description: 'Claude API, OpenAI-compatible flows, n8n, bots, and automation systems that remove repetitive work.',
  },
  {
    symbol: 'SEO',
    title: 'SEO and Blogging Experiments',
    description: 'Search Console workflows, content systems, indexing lessons, and what happens after real publishing experiments.',
  },
]

const STACK_ITEMS = [
  ['NX', 'Next.js', 'The publishing app, route system, MDX rendering, and production UI layer.'],
  ['TS', 'TypeScript', 'Strict app logic, content rendering safety, and maintainable site code.'],
  ['VPS', 'VPS / Hetzner', 'Low-cost production hosting for the site and adjacent developer experiments.'],
  ['OPS', 'Coolify / Docker', 'Application packaging, self-hosting setups, and repeatable deployment workflows.'],
  ['EDGE', 'Cloudflare', 'Caching, DNS, security layers, and public edge performance tuning.'],
  ['CI', 'GitHub Actions', 'The deploy pipeline that pushes verified changes into production.'],
  ['GSC', 'Google Search Console', 'Read-only reporting and carefully controlled indexing workflows on the VPS.'],
  ['BOT', 'Automation Scripts', 'Internal scripts and lightweight tooling for publishing, SEO checks, and system tasks.'],
]

const EXPERTISE = [
  'Self-hosting and VPS operations',
  'Next.js deployment architecture',
  'Developer tools and workflow design',
  'AI-assisted automation systems',
  'PM2, Nginx, Docker, and Linux setup',
  'Technical SEO and publishing workflows',
]

export const metadata: Metadata = {
  title: 'About Blixamo and Ankit Sorathiya',
  description:
    'Learn what Blixamo is, who runs it, what topics it covers, how the content is created, and how to contact or collaborate with Ankit Sorathiya.',
  alternates: { canonical: absoluteUrl('/about') },
}

export default function AboutPage() {
  return (
    <div className="about-page-shell">
      <section className="about-hero-shell">
        <div className="about-hero">
          <div className="about-hero-copy">
            <p className="about-section-kicker">About Blixamo</p>
            <h1 className="about-hero-title">A practical developer publication built around real infrastructure work.</h1>
            <p className="about-hero-description">
              Blixamo is where self-hosting, VPS operations, modern web development, AI workflows, and tooling decisions get
              documented from real deployments instead of generic summaries.
            </p>

            <div className="about-hero-signal-row">
              <span className="about-hero-signal">Self-hosting</span>
              <span className="about-hero-signal">Next.js deployment</span>
              <span className="about-hero-signal">Automation workflows</span>
              <span className="about-hero-signal">Tool comparisons</span>
            </div>

            <div className="about-hero-stat-grid">
              <div className="about-hero-stat-card">
                <strong>Real setups</strong>
                <span>Guides are grounded in live deployments, measured output, and repeatable configs.</span>
              </div>
              <div className="about-hero-stat-card">
                <strong>One primary author</strong>
                <span>Clear authorship, consistent responsibility, and a single technical point of view.</span>
              </div>
              <div className="about-hero-stat-card">
                <strong>Built for developers</strong>
                <span>Focused on operators, indie builders, and teams making practical stack decisions.</span>
              </div>
            </div>
          </div>

          <aside className="about-hero-card">
            <div className="about-hero-photo">
              <Image src={PRIMARY_AUTHOR.photoSrc} alt={PRIMARY_AUTHOR.displayName} width={240} height={240} priority />
            </div>
            <div className="about-hero-card-copy">
              <p className="about-section-kicker">Primary author</p>
              <h2>{PRIMARY_AUTHOR.displayName}</h2>
              <p className="about-hero-role">{PRIMARY_AUTHOR.role}</p>
              <p>{PRIMARY_AUTHOR.shortBio}</p>
              <div className="about-inline-links">
                <Link href="/contact">Contact</Link>
                <a href={`mailto:${PRIMARY_AUTHOR.email}`}>{PRIMARY_AUTHOR.email}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-section-head">
          <p className="about-section-kicker">What is Blixamo</p>
          <h2 className="about-section-title">A focused site for shipping, hosting, and operating developer projects.</h2>
        </div>
        <div className="about-two-column-grid">
          <div className="about-content-card">
            <p>
              Blixamo exists to publish practical technical guides around self-hosting, VPS infrastructure, Next.js
              deployment, developer tools, automation systems, and production-minded web development.
            </p>
            <p>
              The goal is not to cover everything. The goal is to explain the parts that matter when you are making a
              real technical decision, deploying a real system, or trying to avoid expensive mistakes.
            </p>
          </div>
          <div className="about-content-card about-content-card-accent">
            <h3>What makes it different</h3>
            <ul className="about-check-list">
              <li>Direct opinions instead of vague tool roundups</li>
              <li>Real deployments and production-oriented examples</li>
              <li>Low-cost infrastructure and indie-friendly tradeoffs</li>
              <li>Reusable workflows around hosting, automation, and publishing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-section-head">
          <p className="about-section-kicker">What you will find</p>
          <h2 className="about-section-title">Core topics presented as a developer platform, not a generic blog list.</h2>
        </div>
        <div className="about-topic-grid">
          {TOPIC_CARDS.map((card) => (
            <article key={card.title} className="about-topic-card">
              <div className="about-topic-symbol">{card.symbol}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-author-panel">
          <div className="about-author-photo-wrap">
            <Image src={PRIMARY_AUTHOR.photoSrc} alt={PRIMARY_AUTHOR.displayName} width={320} height={320} className="about-author-photo" />
          </div>
          <div className="about-author-copy">
            <p className="about-section-kicker">About the author</p>
            <h2 className="about-section-title">Ankit Sorathiya</h2>
            <p className="about-author-role">{PRIMARY_AUTHOR.role}</p>
            <p className="about-author-description">
              {PRIMARY_AUTHOR.longBio}
            </p>
            <div className="about-expertise-grid">
              {EXPERTISE.map((item) => (
                <span key={item} className="about-expertise-chip">
                  {item}
                </span>
              ))}
            </div>
            <div className="about-inline-links">
              <Link href="/contact">Contact page</Link>
              <a href={`https://twitter.com/${PRIMARY_AUTHOR.twitter}`} target="_blank" rel="noopener noreferrer">
                X @{PRIMARY_AUTHOR.twitter}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-section-head">
          <p className="about-section-kicker">Tech stack and tools</p>
          <h2 className="about-section-title">The site is built and operated with the same stack it writes about.</h2>
        </div>
        <div className="about-stack-grid">
          {STACK_ITEMS.map(([symbol, name, description]) => (
            <article key={name} className="about-stack-card">
              <div className="about-stack-symbol">{symbol}</div>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-two-column-grid">
          <article className="about-content-card">
            <p className="about-section-kicker">Mission and philosophy</p>
            <h2 className="about-section-title">Real guides, real deployments, practical tutorials.</h2>
            <p>
              Blixamo aims to be useful to developers who care about speed, clarity, and cost-awareness. If a tutorial
              cannot help someone ship faster, understand a tradeoff better, or avoid a production mistake, it is not
              good enough for the site.
            </p>
            <p>
              The editorial standard is simple: prefer tested workflows over polished theory, practical recommendations
              over generic neutrality, and honest limitations over marketing language.
            </p>
          </article>

          <article className="about-content-card">
            <p className="about-section-kicker">How content is created</p>
            <h2 className="about-section-title">Built from experiments, deployments, and measured outcomes.</h2>
            <p>
              Tutorials are based on real setups, working infrastructure, screenshots, failed attempts, and repeatable
              configurations. That is deliberate. Clear authorship and real implementation details improve trust for
              both readers and ad/SEO review systems.
            </p>
            <p>
              The site documents what worked, what cost more than expected, where the rough edges are, and when a tool
              is simply not worth using. That keeps the content grounded and easier to trust.
            </p>
          </article>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-contact-panel">
          <div>
            <p className="about-section-kicker">Contact and collaboration</p>
            <h2 className="about-section-title">Suggestions, partnerships, consulting, or useful corrections are welcome.</h2>
            <p className="about-contact-copy">
              If you want to discuss an article, share a deployment result, suggest a topic, or explore collaboration,
              the cleanest path is the contact page or direct email.
            </p>
          </div>
          <div className="about-contact-actions">
            <Link href="/contact" className="about-contact-button about-contact-button-primary">
              Go to contact page
            </Link>
            <a href={`mailto:${PRIMARY_AUTHOR.email}`} className="about-contact-button about-contact-button-secondary">
              Email {PRIMARY_AUTHOR.displayName}
            </a>
          </div>
        </div>
      </section>

      <section className="about-section-shell about-email-shell">
        <EmailCapture />
      </section>
    </div>
  )
}
