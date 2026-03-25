import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { PRIMARY_AUTHOR } from '@/lib/author'
import { getCategoryMeta } from '@/lib/categories'
import { getAllPosts } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

const TOPIC_LANES = ['self-hosting', 'vps-cloud', 'how-to', 'web-dev', 'automation', 'developer-tools'] as const

const STACK_ITEMS = [
  ['NX', 'Next.js', 'App Router, metadata, MDX rendering, and the UI layer for the publication.'],
  ['TS', 'TypeScript', 'Typed post data, safer rendering logic, and maintainable publication code.'],
  ['HX', 'Hetzner VPS', 'Low-cost infrastructure for production hosting, experiments, and self-hosted systems.'],
  ['DK', 'Docker + Coolify', 'Packaging and repeatable deployment workflows for operational consistency.'],
  ['CF', 'Cloudflare', 'DNS, caching, edge protection, and performance shaping around public pages.'],
  ['CI', 'GitHub Actions', 'The Git-driven deployment pipeline that moves reviewed changes into production.'],
  ['GS', 'Search Console', 'Measured search feedback and controlled indexing checks using the VPS workflow.'],
  ['AT', 'Automation Scripts', 'Internal helpers for publishing, reporting, audits, and lightweight ops tasks.'],
] as const

const EXPERTISE = [
  'VPS operations and self-hosting',
  'Next.js deployment architecture',
  'PM2, Nginx, Docker, and Linux setup',
  'Automation systems and AI workflows',
  'Developer tooling and stack tradeoffs',
  'Technical SEO for real publications',
]

const EDITORIAL_PILLARS = [
  'Real deploys beat polished theory.',
  'Measured tradeoffs beat tool hype.',
  'Single-author accountability beats anonymous content farms.',
]

const HERO_SIGNALS = ['Practical infrastructure', 'Measured tradeoffs', 'Self-hosted workflows', 'Developer publication']

const VISUAL_NOTES = [
  'Deploys documented from live systems',
  'Comparisons grounded in real tradeoffs',
  'Editorial tone stays technical and direct',
]

export const metadata: Metadata = {
  title: 'About Blixamo and Ankit Sorathiya',
  description:
    'Learn what Blixamo is, who runs it, what topics it covers, how the content is created, and how to contact or collaborate with Ankit Sorathiya.',
  alternates: { canonical: absoluteUrl('/about') },
}

export default function AboutPage() {
  const posts = getAllPosts()
  const activeCategories = [...new Set(posts.map((post) => post.category))]
  const deploymentCount = posts.filter((post) => ['self-hosting', 'vps-cloud', 'how-to'].includes(post.category)).length
  const workflowCount = posts.filter((post) => ['automation', 'ai'].includes(post.category)).length

  const stats = [
    {
      value: `${posts.length}+`,
      label: 'Published guides',
      note: 'Production-minded articles across infrastructure, tooling, and publishing systems.',
    },
    {
      value: `${activeCategories.length}`,
      label: 'Active topic lanes',
      note: 'Canonical editorial categories that keep the publication structured and easy to browse.',
    },
    {
      value: `${deploymentCount}+`,
      label: 'Deployment and hosting notes',
      note: 'VPS, self-hosting, reverse proxy, and operational guides grounded in real setups.',
    },
    {
      value: `${workflowCount}+`,
      label: 'Automation and AI workflows',
      note: 'Practical systems for reducing repetitive work without overcomplicating the stack.',
    },
  ]

  const topicCards = TOPIC_LANES.map((slug) => ({ slug, meta: getCategoryMeta(slug) }))

  return (
    <div className="about-page-shell">
      <section className="about-hero-shell">
        <div className="about-hero">
          <div className="about-hero-copy">
            <p className="about-section-kicker">About Blixamo</p>
            <h1 className="about-hero-title">A practical developer infrastructure publication with an editorial point of view.</h1>
            <p className="about-hero-description">
              Blixamo documents how modern developer systems are actually shipped and operated: VPS hosting,
              self-hosting, Next.js deployment, automation workflows, tool decisions, and the tradeoffs that show up
              once a project moves past tutorial mode.
            </p>

            <div className="about-hero-signal-row">
              {HERO_SIGNALS.map((signal) => (
                <span key={signal} className="about-hero-signal">
                  {signal}
                </span>
              ))}
            </div>

            <div className="about-hero-actions">
              <Link href="/blog" className="about-hero-button about-hero-button-primary">
                Read the latest guides
              </Link>
              <Link href="#about-topics" className="about-hero-button about-hero-button-secondary">
                Explore topic lanes
              </Link>
            </div>

            <div className="about-hero-editorial-grid">
              {EDITORIAL_PILLARS.map((pillar) => (
                <div key={pillar} className="about-hero-editorial-card">
                  <span className="about-hero-editorial-marker" />
                  <p>{pillar}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="about-hero-visual-card">
            <div className="about-hero-visual-head">
              <p className="about-section-kicker">Editorial operating model</p>
              <h2 className="about-visual-title">Where deployment work, tooling decisions, and publishing discipline overlap.</h2>
            </div>

            <div className="about-hero-visual-stage">
              <div className="about-hero-orbit" aria-hidden="true">
                <span className="about-hero-orbit-ring about-hero-orbit-ring-one" />
                <span className="about-hero-orbit-ring about-hero-orbit-ring-two" />
                <div className="about-hero-orbit-core">BLX</div>
                <div className="about-hero-orbit-node about-hero-orbit-node-top">VPS</div>
                <div className="about-hero-orbit-node about-hero-orbit-node-right">Next.js</div>
                <div className="about-hero-orbit-node about-hero-orbit-node-bottom">Automation</div>
                <div className="about-hero-orbit-node about-hero-orbit-node-left">Tooling</div>
              </div>

              <div className="about-hero-visual-stack">
                <div className="about-hero-visual-chip">Deploy notes</div>
                <div className="about-hero-visual-chip">Ops checks</div>
                <div className="about-hero-visual-chip">Stack verdicts</div>
                <div className="about-hero-visual-chip">Search feedback</div>
              </div>
            </div>

            <div className="about-hero-visual-grid">
              {VISUAL_NOTES.map((note) => (
                <div key={note} className="about-hero-visual-note">
                  {note}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="about-section-shell about-stats-shell">
        <div className="about-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="about-stat-card">
              <strong>{stat.value}</strong>
              <h2>{stat.label}</h2>
              <p>{stat.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-two-column-grid about-two-column-grid-wide">
          <article className="about-content-card about-content-card-story">
            <p className="about-section-kicker">What is Blixamo</p>
            <h2 className="about-section-title">An editorial site for developers making real infrastructure and tooling decisions.</h2>
            <p>
              Blixamo is not trying to be a generic tech blog. It focuses on the parts of developer work that become
              expensive, confusing, or brittle once a project reaches production: hosting, deployments, tooling,
              automation, publishing, and the tradeoffs between low cost and low drama.
            </p>
            <p>
              The publication is built around one clear standard: if a guide cannot help someone ship faster,
              understand a tradeoff better, or avoid an operational mistake, it is not strong enough to publish.
            </p>
          </article>

          <article className="about-content-card about-content-card-accent">
            <p className="about-section-kicker">Why it feels different</p>
            <h2 className="about-section-title">Practical publishing with an operator mindset.</h2>
            <ul className="about-check-list">
              <li>Real deployments, not abstract platform summaries</li>
              <li>Direct recommendations instead of neutral filler</li>
              <li>Clear authorship and editorial responsibility</li>
              <li>Measured tradeoffs across cost, complexity, and reliability</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="about-topics" className="about-section-shell">
        <div className="about-section-head">
          <p className="about-section-kicker">Topic lanes</p>
          <h2 className="about-section-title">Core topics are presented like an editorial system, not a loose archive.</h2>
          <p className="about-section-description">
            Each lane represents a clear decision space: infrastructure, workflows, tools, or technical publishing.
            The goal is fast scanning and immediate relevance for developers who already know what problem they are trying to solve.
          </p>
        </div>

        <div className="about-topic-grid">
          {topicCards.map(({ slug, meta }) => (
            <Link key={slug} href={`/category/${slug}`} className="about-topic-card">
              <div className="about-topic-top">
                <div className="about-topic-symbol" style={{ color: meta.color, borderColor: `${meta.color}32` }}>
                  {meta.symbol}
                </div>
                <div
                  className="about-topic-icon"
                  style={{ color: meta.color, background: `${meta.color}12`, borderColor: `${meta.color}2a` }}
                >
                  {meta.icon}
                </div>
              </div>
              <h3>{meta.label}</h3>
              <p>{meta.longDesc}</p>
              <span className="about-topic-link">Browse topic</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-author-panel">
          <div className="about-author-photo-column">
            <div className="about-author-photo-wrap">
              <Image
                src={PRIMARY_AUTHOR.photoSrc}
                alt={PRIMARY_AUTHOR.displayName}
                width={520}
                height={620}
                className="about-author-photo"
                priority
              />
            </div>
            <div className="about-author-proof-card">
              <p className="about-section-kicker">Founder and editor</p>
              <h3>{PRIMARY_AUTHOR.displayName}</h3>
              <p>
                Blixamo is a single-primary-author publication. The same person testing the deployment, workflow, or tool is the one writing the verdict.
              </p>
            </div>
          </div>

          <div className="about-author-copy">
            <p className="about-section-kicker">Author profile</p>
            <h2 className="about-section-title">A founder-style profile with real implementation bias.</h2>
            <p className="about-author-role">{PRIMARY_AUTHOR.role}</p>
            <p className="about-author-description">{PRIMARY_AUTHOR.longBio}</p>

            <div className="about-expertise-grid">
              {EXPERTISE.map((item) => (
                <span key={item} className="about-expertise-chip">
                  {item}
                </span>
              ))}
            </div>

            <div className="about-author-notes">
              <div className="about-author-note">
                <strong>Editorial stance</strong>
                <span>Practical, technical, and specific. If a stack is not worth the complexity, the page should say so clearly.</span>
              </div>
              <div className="about-author-note">
                <strong>Content source</strong>
                <span>Production apps, experiments, benchmark-style comparisons, deployment notes, and failure logs.</span>
              </div>
            </div>

            <div className="about-inline-links">
              <Link href="/contact">Contact page</Link>
              <a href={`mailto:${PRIMARY_AUTHOR.email}`}>{PRIMARY_AUTHOR.email}</a>
              <a href={`https://twitter.com/${PRIMARY_AUTHOR.twitter}`} target="_blank" rel="noopener noreferrer">
                X @{PRIMARY_AUTHOR.twitter}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-section-head">
          <p className="about-section-kicker">Tech stack and tooling</p>
          <h2 className="about-section-title">The publication runs on the same stack it writes about.</h2>
          <p className="about-section-description">
            The point is not to look impressive on a stack diagram. The point is to keep the site fast, maintainable,
            and close to the real infrastructure decisions it covers editorially.
          </p>
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
            <p className="about-section-kicker">Mission and positioning</p>
            <h2 className="about-section-title">Blixamo is for developers who want clear answers, not vague platform content.</h2>
            <p>
              The publication exists to make infrastructure and tooling decisions easier to evaluate. That means clear
              tradeoffs, real costs, operational constraints, and direct recommendations whenever the evidence points in one direction.
            </p>
            <p>
              Blixamo should feel closer to a practical field manual than a personal journal. Calm tone, useful specifics,
              and a bias toward things that survive production use.
            </p>
          </article>

          <article className="about-content-card">
            <p className="about-section-kicker">How content gets made</p>
            <h2 className="about-section-title">Publishing is tied to experiments, deployments, and measurable outcomes.</h2>
            <p>
              Tutorials are built from real infrastructure work, screenshots, configuration notes, and implementation
              details that can be repeated. Comparisons are written around real tradeoffs, not generic feature list recycling.
            </p>
            <p>
              That approach matters for readers, but it also strengthens trust signals for search systems, ad review,
              and anyone trying to judge whether the page was written from experience or from a template.
            </p>
          </article>
        </div>
      </section>

      <section className="about-section-shell">
        <div className="about-contact-panel">
          <div>
            <p className="about-section-kicker">Contact and collaboration</p>
            <h2 className="about-section-title">Useful corrections, partnerships, consulting, and technical suggestions are all welcome.</h2>
            <p className="about-contact-copy">
              If you want to discuss an article, suggest a topic, share a deployment result, or explore collaboration,
              the cleanest route is the contact page or direct email. Clear, technically useful messages get priority.
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