import type { Metadata } from 'next'
import Link from 'next/link'
import { PRIMARY_AUTHOR } from '@/lib/author'
import { absoluteUrl } from '@/lib/site'

const SERVICES = [
  {
    title: 'Next.js websites and app builds',
    helpsWith: 'Marketing sites, dashboards, custom app shells, and production-ready Next.js work.',
    deliverables: ['App Router build or rebuild', 'content and admin setup', 'auth, forms, and dashboard basics', 'deployment wiring and handoff notes'],
    bestFor: 'Founders and small teams who need a practical v1 or a cleaner production build.',
    outcomes: 'Ship faster, reduce rebuild risk, and keep the app maintainable after launch.',
    proofs: [
      { title: 'How to Self Host Next.js on VPS', href: '/blog/how-to-self-host-nextjs-on-vps' },
      { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
    ],
  },
  {
    title: 'SaaS MVP builds',
    helpsWith: 'Custom v1 products for founders who need a working version, not a giant spec document.',
    deliverables: ['auth and app shell', 'dashboard and account basics', 'billing basics where needed', 'deployment and handoff docs'],
    bestFor: 'Founders with a clear use case and a willingness to ship a constrained first version.',
    outcomes: 'Get a usable product in front of users without overbuilding before traction.',
    proofs: [
      { title: 'Getting Started with Next.js', href: '/blog/getting-started-with-nextjs' },
      { title: 'Webhook Automation Architecture for Developers', href: '/blog/webhook-automation-architecture-developers-2026' },
    ],
  },
  {
    title: 'VPS deployment and migration',
    helpsWith: 'Moving apps onto a VPS, cleaning up fragile setups, or standardizing risky deploy flows.',
    deliverables: ['server setup plan', 'Nginx, SSL, PM2, Docker, or process wiring', 'migration and rollback notes', 'production verification steps'],
    bestFor: 'Teams leaving shared hosting, Vercel-only assumptions, or undocumented low-cost VPS setups.',
    outcomes: 'A calmer deploy path with fewer avoidable production mistakes.',
    proofs: [
      { title: 'VPS Setup Guide', href: '/blog/vps-setup-guide' },
      { title: 'Ubuntu VPS Hardening Guide', href: '/blog/vps-security-harden-ubuntu-2026' },
    ],
  },
  {
    title: 'Coolify and self-hosting setup',
    helpsWith: 'Setting up a cleaner self-hosted deployment path for apps and internal systems.',
    deliverables: ['Coolify or Docker setup plan', 'service and environment wiring', 'backup and restore guidance', 'ops notes for handoff'],
    bestFor: 'Developers who want more control over hosting without turning every release into an incident.',
    outcomes: 'Lower platform dependence and better operational visibility.',
    proofs: [
      { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
      { title: 'Coolify Backup and Restore Runbook', href: '/blog/coolify-backup-restore-runbook-2026' },
    ],
  },
  {
    title: 'n8n automation workflows',
    helpsWith: 'Designing and shipping practical automations without creating a brittle workflow maze.',
    deliverables: ['workflow mapping', 'n8n starter workflows or cleanup passes', 'testing notes', 'maintenance handoff guidance'],
    bestFor: 'Teams with repetitive internal tasks, content operations, or integration glue work.',
    outcomes: 'Less manual work and automation that survives beyond the first demo.',
    proofs: [
      { title: 'Self Hosting n8n on Hetzner VPS', href: '/blog/self-hosting-n8n-hetzner-vps' },
      { title: 'n8n Workflow Testing Checklist', href: '/blog/n8n-workflow-testing-checklist-2026' },
    ],
  },
  {
    title: 'Ongoing maintenance and ops support',
    helpsWith: 'Cleaning up recurring deployment problems, backup gaps, health checks, and small-server drift.',
    deliverables: ['ops review and issue list', 'health, backup, and restore verification', 'maintenance notes', 'targeted implementation help'],
    bestFor: 'Small apps and founder-led products that need steadier operations without enterprise overhead.',
    outcomes: 'Fewer silent failures and better recovery confidence.',
    proofs: [
      { title: 'Docker Compose Health Checks in Production', href: '/blog/docker-compose-health-checks-production-2026' },
      { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
    ],
  },
]

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
              Technical help for founders and teams that need a working stack.
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '64ch' }}>
              Blixamo is run by {PRIMARY_AUTHOR.displayName}. The same person writing the deployment, self-hosting, and workflow guides is available for practical build work,
              migration help, audits, and targeted implementation support.
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/contact" className="home-hero-button home-hero-button-primary">Start with contact</Link>
              <Link href="/products" className="home-hero-button home-hero-button-secondary">See productized offers</Link>
              <Link href="/subscribe" className="home-hero-button home-hero-button-secondary">Subscribe for updates</Link>
            </div>
          </div>

          <aside style={{ background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0.98) 100%)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Founder and operator credibility</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {PRIMARY_AUTHOR.shortBio} Work here is intentionally small-business and operator-led, not agency-bloated.
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
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>Service areas, deliverables, and proof routes</h2>
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
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Related proof and reading</p>
                    <div style={{ display: 'grid', gap: '0.85rem' }}>
                      {service.proofs.map((proof) => (
                        <Link key={proof.href} href={proof.href} style={{ border: '1px solid var(--border)', borderRadius: '0.95rem', padding: '0.9rem 1rem', textDecoration: 'none', color: 'inherit', background: 'var(--bg-subtle)' }}>
                          {proof.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Real deliverables</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Working implementation notes, not just advice</li>
              <li>Reusable deployment and workflow checklists</li>
              <li>Clear best-fit and not-fit framing before work starts</li>
              <li>Practical handoff notes so the stack is maintainable after delivery</li>
            </ul>
          </article>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Best fit and not-fit</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Best for practical v1 shipping, migrations, audits, and cleanup passes.</li>
              <li>Not a fit for enterprise procurement, 24/7 support, or vague build-everything requests.</li>
              <li>Projects start with a clear message about the goal, current stack, and timeline.</li>
            </ul>
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
            Use the contact page to describe the goal, current setup, timeline, and where the stack is getting stuck. If a productized pack is enough, that will usually be
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
