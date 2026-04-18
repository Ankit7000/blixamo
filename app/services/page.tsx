import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PRIMARY_AUTHOR } from '@/lib/author'
import { absoluteUrl } from '@/lib/site'

const SERVICES = [
  {
    title: 'Next.js websites and app builds',
    helpsWith: 'Marketing sites, dashboards, custom app shells, and production-ready Next.js work.',
    deliverables: ['App Router build or rebuild', 'content and admin setup', 'auth, forms, and dashboard basics', 'deployment wiring and handoff notes'],
    artifacts: ['scope summary with route decisions', 'build and launch checklist', 'handoff notes for future edits'],
    bestFor: 'Founders and small teams who need a practical v1 or a cleaner production build.',
    outcomes: 'Ship faster, reduce rebuild risk, and keep the app maintainable after launch.',
    proofNote: 'Best suited to teams that want a working app plus the boring implementation notes that keep the next release calm.',
    proofs: [
      { title: 'How to Self Host Next.js on VPS', href: '/blog/how-to-self-host-nextjs-on-vps' },
      { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
      { title: 'Next.js VPS Prelaunch Checklist', href: '/blog/nextjs-vps-prelaunch-checklist-2026' },
    ],
  },
  {
    title: 'SaaS MVP builds',
    helpsWith: 'Custom v1 products for founders who need a working version, not a giant spec document.',
    deliverables: ['auth and app shell', 'dashboard and account basics', 'billing basics where needed', 'deployment and handoff docs'],
    artifacts: ['MVP scope output and cut list', 'core user-flow notes', 'launch-ready handoff checklist'],
    bestFor: 'Founders with a clear use case and a willingness to ship a constrained first version.',
    outcomes: 'Get a usable product in front of users without overbuilding before traction.',
    proofNote: 'The useful proof here is usually a sharper scope, cleaner core flow, and fewer unnecessary features before launch.',
    proofs: [
      { title: 'Getting Started with Next.js', href: '/blog/getting-started-with-nextjs' },
      { title: 'Webhook Automation Architecture for Developers', href: '/blog/webhook-automation-architecture-developers-2026' },
      { title: 'Build a SaaS MVP for $5/Month', href: '/blog/build-saas-mvp-zero-budget-2026' },
    ],
  },
  {
    title: 'VPS deployment and migration',
    helpsWith: 'Moving apps onto a VPS, cleaning up fragile setups, or standardizing risky deploy flows.',
    deliverables: ['server setup plan', 'Nginx, SSL, PM2, Docker, or process wiring', 'migration and rollback notes', 'production verification steps'],
    artifacts: ['cutover checklist with owner steps', 'rollback SOP', 'post-deploy verification sheet'],
    bestFor: 'Teams leaving shared hosting, Vercel-only assumptions, or undocumented low-cost VPS setups.',
    outcomes: 'A calmer deploy path with fewer avoidable production mistakes.',
    proofNote: 'This work is strongest when the result is not only a live server, but also a rollback path somebody can actually follow.',
    proofs: [
      { title: 'VPS Setup Guide', href: '/blog/vps-setup-guide' },
      { title: 'Ubuntu VPS Hardening Guide', href: '/blog/vps-security-harden-ubuntu-2026' },
      { title: 'Migrate Next.js from Vercel to a VPS', href: '/blog/migrate-nextjs-vercel-to-vps-2026' },
    ],
  },
  {
    title: 'Coolify and self-hosting setup',
    helpsWith: 'Setting up a cleaner self-hosted deployment path for apps and internal systems.',
    deliverables: ['Coolify or Docker setup plan', 'service and environment wiring', 'backup and restore guidance', 'ops notes for handoff'],
    artifacts: ['service map and env inventory', 'backup and restore runbook', 'operator notes for routine changes'],
    bestFor: 'Developers who want more control over hosting without turning every release into an incident.',
    outcomes: 'Lower platform dependence and better operational visibility.',
    proofNote: 'The real signal is a setup someone can maintain, recover, and explain after the first production change.',
    proofs: [
      { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
      { title: 'Coolify Backup and Restore Runbook', href: '/blog/coolify-backup-restore-runbook-2026' },
      { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
    ],
  },
  {
    title: 'n8n automation workflows',
    helpsWith: 'Designing and shipping practical automations without creating a brittle workflow maze.',
    deliverables: ['workflow mapping', 'n8n starter workflows or cleanup passes', 'testing notes', 'maintenance handoff guidance'],
    artifacts: ['workflow map and trigger notes', 'failure-handling checklist', 'maintenance handoff doc'],
    bestFor: 'Teams with repetitive internal tasks, content operations, or integration glue work.',
    outcomes: 'Less manual work and automation that survives beyond the first demo.',
    proofNote: 'The useful output is not just a workflow export. It is a workflow someone else can test, understand, and keep alive.',
    proofs: [
      { title: 'Self Hosting n8n on Hetzner VPS', href: '/blog/self-hosting-n8n-hetzner-vps' },
      { title: 'n8n Workflow Testing Checklist', href: '/blog/n8n-workflow-testing-checklist-2026' },
      { title: 'Debug Slow or Fragile n8n Workflows', href: '/blog/debug-slow-fragile-n8n-workflows-2026' },
    ],
  },
  {
    title: 'Ongoing maintenance and ops support',
    helpsWith: 'Cleaning up recurring deployment problems, backup gaps, health checks, and small-server drift.',
    deliverables: ['ops review and issue list', 'health, backup, and restore verification', 'maintenance notes', 'targeted implementation help'],
    artifacts: ['ops review with issue priorities', 'monitoring and health-check checklist', 'restore drill notes'],
    bestFor: 'Small apps and founder-led products that need steadier operations without enterprise overhead.',
    outcomes: 'Fewer silent failures and better recovery confidence.',
    proofNote: 'The proof is usually in the maintenance artifact set: checks, restore notes, and fewer hidden failure modes.',
    proofs: [
      { title: 'Docker Compose Health Checks in Production', href: '/blog/docker-compose-health-checks-production-2026' },
      { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
      { title: 'How I Verify a VPS Backup Before I Trust It', href: '/blog/verify-vps-backup-before-trusting-it-2026' },
    ],
  },
]

const EXAMPLE_DELIVERABLES = [
  {
    title: 'Deployment checklist',
    description: 'Cutover order, environment checks, DNS or proxy notes, and post-launch verification steps that reduce guesswork during release.',
  },
  {
    title: 'Rollback SOP',
    description: 'A short, explicit path for reversing a broken deploy or migration without inventing the recovery sequence mid-incident.',
  },
  {
    title: 'Automation handoff doc',
    description: 'Trigger logic, failure conditions, retry rules, and ownership notes so one workflow does not become tribal knowledge.',
  },
  {
    title: 'MVP scope output',
    description: 'A practical v1 cut list showing what ships now, what waits, and what is required for launch confidence.',
  },
] as const

const SERVICE_PROOF_PREVIEWS = [
  {
    title: 'Deployment checklist preview',
    src: '/images/services/deployment-checklist-preview.png',
    alt: 'Preview of a deployment checklist for VPS and app releases',
    caption: 'Example deployment checklist used to reduce avoidable release mistakes.',
    width: 1200,
    height: 1280,
  },
  {
    title: 'Rollback SOP preview',
    src: '/images/services/rollback-sop-preview.png',
    alt: 'Preview of a rollback standard operating procedure for failed deployments',
    caption: 'Rollback SOP preview showing how recovery is handled when a deploy goes wrong.',
    width: 1200,
    height: 1280,
  },
  {
    title: 'Coolify runbook preview',
    src: '/images/services/coolify-runbook-preview.png',
    alt: 'Preview of a Coolify deployment and verification runbook',
    caption: 'Runbook-style deployment notes for repeatable Coolify and self-hosted release work.',
    width: 980,
    height: 1400,
  },
] as const

const WORKFLOW_STEPS = [
  {
    title: '1. Clarify the stack and failure points',
    description: 'Work starts with the current setup, constraints, and where the risk actually lives instead of generic recommendations.',
  },
  {
    title: '2. Define the artifact before the risky step',
    description: 'Before a migration, deploy, or automation cleanup, the page or project gets a checklist, runbook, or scope note that somebody can review.',
  },
  {
    title: '3. Implement with verification, not optimism',
    description: 'The useful path includes health checks, restore checks, launch checks, and a concrete way to tell whether the work is actually ready.',
  },
  {
    title: '4. Hand off something reusable',
    description: 'The end state should leave behind notes, checklists, or operator docs that survive beyond one chat thread or one deploy.',
  },
] as const

const OUTCOME_CARDS = [
  'A launch path with verification and rollback instead of last-minute improvisation.',
  'A smaller, more shippable MVP scope that avoids expensive rebuild loops.',
  'Automation that comes with testing notes and handoff context, not just exported JSON.',
  'Ops and self-hosting changes that leave the stack easier to maintain after delivery.',
] as const

const FAQS = [
  ['Do you work like an agency?', 'No. This is intentionally a solo operator service layer, not an agency pitch.'],
  ['Do you list fixed pricing here?', 'No. The public page stays honest and scoped before any quote depends on stack complexity or migration risk.'],
  ['Can I ask for a smaller review first?', 'Yes. Several of these offers work well as focused reviews or cleanup passes before larger implementation work.'],
] as const

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Operator-led technical services from Blixamo covering Next.js builds, SaaS MVP work, VPS deployment, self-hosting, n8n workflows, and ongoing ops support.',
  alternates: { canonical: absoluteUrl('/services') },
}

export default function ServicesPage() {
  return (
    <div>
      <section style={{ padding: '3.5rem 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Services</p>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, marginTop: '0.5rem', maxWidth: '12ch' }}>
              Technical help for teams that need a working build, deploy, or cleanup path.
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '64ch' }}>
              Blixamo is run by {PRIMARY_AUTHOR.displayName}. The same person writing the deployment, self-hosting, and workflow guides is available for practical build work,
              migration help, audits, and targeted implementation support when the stack and the problem are already real.
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/contact" className="home-hero-button home-hero-button-primary">Start with contact</Link>
              <Link href="/products" className="home-hero-button home-hero-button-secondary">See practical packs</Link>
              <Link href="/subscribe" className="home-hero-button home-hero-button-secondary">Subscribe for updates</Link>
            </div>
          </div>

          <aside style={{ background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0.98) 100%)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Founder and operator credibility</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {PRIMARY_AUTHOR.shortBio} Work here is intentionally operator-led and hands-on, with direct ownership of the implementation and the supporting notes.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                'Next.js, VPS, Docker, Coolify, PM2, Nginx, automation, and technical publishing systems',
                'Public proof base through Blixamo articles and operational guides',
                'Best for practical v1 shipping, migrations, cleanups, and ops hardening',
              ].map((item) => (
                <div key={item} style={{ padding: '0.9rem 1rem', borderRadius: '0.9rem', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border)' }}>{item}</div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Who this is for</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>Best for small teams, founders, and technical operators who want a practical next step.</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              'Founder-led SaaS teams shipping a first serious version',
              'Developers moving an app onto a VPS or self-hosted stack',
              'Teams with workflow or deployment mess that needs a cleanup pass',
              'Operators who want direct technical help instead of generic strategy decks',
            ].map((item) => (
              <div key={item} style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.1rem', background: 'var(--bg)' }}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>What I help with</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>Service areas, deliverables, and published support</h2>
          </div>
          <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.75rem' }}>
            {SERVICES.map((service) => (
              <article key={service.title} style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)' }}>
                <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{service.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{service.helpsWith}</p>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}><strong style={{ color: 'var(--text-primary)' }}>Best for:</strong> {service.bestFor}</p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}><strong style={{ color: 'var(--text-primary)' }}>Outcome:</strong> {service.outcomes}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Typical deliverables</p>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {service.deliverables.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Example artifacts</p>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {service.artifacts.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <p style={{ fontWeight: 700, margin: '1rem 0 0.75rem' }}>Published support</p>
                    <div style={{ display: 'grid', gap: '0.85rem' }}>
                      {service.proofs.map((proof) => (
                        <Link key={proof.href} href={proof.href} style={{ border: '1px solid var(--border)', borderRadius: '0.95rem', padding: '0.9rem 1rem', textDecoration: 'none', color: 'inherit', background: 'var(--bg-subtle)' }}>
                          {proof.title}
                        </Link>
                      ))}
                    </div>
                    <p style={{ marginTop: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{service.proofNote}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Example deliverables</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>The proof usually lives in the working artifacts, not in polished claims.</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {EXAMPLE_DELIVERABLES.map((item) => (
              <article key={item.title} style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.1rem', background: 'var(--bg)' }}>
                <strong style={{ display: 'block', marginBottom: '0.55rem' }}>{item.title}</strong>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{item.description}</span>
              </article>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.85rem' }}>Proof previews</p>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {SERVICE_PROOF_PREVIEWS.map((preview) => (
                <figure
                  key={preview.src}
                  style={{
                    margin: 0,
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    background: 'var(--bg)',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    width={preview.width}
                    height={preview.height}
                    sizes="(max-width: 767px) 100vw, (max-width: 1120px) 50vw, 33vw"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <figcaption style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {preview.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>What real work looks like</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>Operator work is usually a sequence of decisions, checks, and handoff notes.</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {WORKFLOW_STEPS.map((step) => (
              <article key={step.title} style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.15rem', background: 'var(--bg-subtle)' }}>
                <strong style={{ display: 'block', marginBottom: '0.55rem' }}>{step.title}</strong>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{step.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Best-fit outcomes</p>
            <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
              {OUTCOME_CARDS.map((item) => (
                <div key={item} style={{ border: '1px solid var(--border)', borderRadius: '0.95rem', padding: '0.95rem', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {item}
                </div>
              ))}
            </div>
          </article>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>FAQ</p>
            <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
              {FAQS.map(([question, answer]) => (
                <div key={question} style={{ border: '1px solid var(--border)', borderRadius: '0.95rem', padding: '0.95rem', background: 'var(--bg-subtle)' }}>
                  <strong style={{ display: 'block', marginBottom: '0.4rem' }}>{question}</strong>
                  <span style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{answer}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section style={{ padding: '0 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '2rem', background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.07) 0%, rgba(255,255,255,0.98) 100%)' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Next step</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.45rem' }}>If the project is real, the fastest route is still a clear message.</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '68ch' }}>
            Use the contact page to describe the goal, current setup, timeline, and where the stack is getting stuck. If a smaller pack or checklist is enough, that will usually be
            the cleaner recommendation. If not, the conversation can move into scoped implementation help.
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.4rem' }}>
            <Link href="/contact" className="home-hero-button home-hero-button-primary">Contact Blixamo</Link>
            <Link href="/products" className="home-hero-button home-hero-button-secondary">Browse products</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
