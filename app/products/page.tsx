import type { Metadata } from 'next'
import Link from 'next/link'
import { PRIMARY_AUTHOR } from '@/lib/author'
import { absoluteUrl } from '@/lib/site'

const PRODUCT_GROUPS = [
  {
    title: 'Operations and deployment packs',
    description: 'For teams that need cleaner launches, repeatable runbooks, and less fragile small-server operations.',
    products: [
      {
        title: 'VPS Launch Checklist + Deployment SOP Pack',
        audience: 'Founders and developers preparing a first serious VPS launch.',
        problem: 'Too many launches depend on memory, scattered notes, and missing rollback or verification steps.',
        includes: ['prelaunch checklist', 'deployment SOP outline', 'verification and rollback checkpoints', 'handoff notes for recurring deploys'],
        delivery: 'Editable docs and checklists you can adapt to your own stack.',
        preview: 'Built around the same launch, VPS, and deployment logic documented across Blixamo articles.',
        proofLinks: [
          { title: 'VPS Setup Guide', href: '/blog/vps-setup-guide' },
          { title: 'How to Self Host Next.js on VPS', href: '/blog/how-to-self-host-nextjs-on-vps' },
        ],
      },
      {
        title: 'Coolify Deployment Runbook Pack',
        audience: 'Teams or solo operators moving app deploys into a calmer Coolify workflow.',
        problem: 'Coolify setups often work just enough to launch, then stay under-documented and risky to recover.',
        includes: ['deployment runbook', 'environment and service notes', 'backup and restore checklist', 'operator handoff prompts'],
        delivery: 'Annotated runbook and checklist templates with room for project-specific details.',
        preview: 'Grounded in public Coolify deployment and backup material already published on Blixamo.',
        proofLinks: [
          { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
          { title: 'Coolify Backup and Restore Runbook', href: '/blog/coolify-backup-restore-runbook-2026' },
        ],
      },
      {
        title: 'Self-Hosting Ops Checklist Bundle',
        audience: 'Operators who need a repeatable baseline for health checks, backups, restores, and small-server hygiene.',
        problem: 'Self-hosting becomes stressful when the stack has no shared operating checklist and no recovery discipline.',
        includes: ['health and monitoring checklist', 'backup artifact checklist', 'restore drill worksheet', 'maintenance review notes'],
        delivery: 'Checklist bundle with short operator notes and clear verification prompts.',
        preview: 'Preview logic comes directly from Blixamo content about health checks, backups, and operational readiness.',
        proofLinks: [
          { title: 'Docker Compose Health Checks in Production', href: '/blog/docker-compose-health-checks-production-2026' },
          { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
        ],
      },
    ],
  },
  {
    title: 'AI workflow packs',
    description: 'For teams that want practical workflow templates and repo-operating kits, not vague AI gimmicks.',
    products: [
      {
        title: 'GPT Workflow Pack for Technical Content Ops',
        audience: 'Technical publishers and lean content teams who want clearer workflow templates for drafting, review, and publishing.',
        problem: 'Most AI content workflows stay vague, inconsistent, and hard to reuse across a real publication.',
        includes: ['workflow template set', 'content QA checklist', 'prompt structure examples', 'handoff notes for editorial operations'],
        delivery: 'Template pack with editable workflow docs and example operating patterns.',
        preview: 'Positioned as a workflow kit derived from the publication system Blixamo already operates.',
        proofLinks: [
          { title: 'Claude API Prompt Patterns for Structured JSON', href: '/blog/claude-api-prompt-patterns-structured-json-2026' },
          { title: 'Best Free Developer Tools', href: '/blog/best-free-developer-tools-2026' },
        ],
      },
      {
        title: 'Claude Skill / Claude Code Workflow Pack for Repo Audits and Runbooks',
        audience: 'Technical teams using Claude tooling for repo reviews, audits, and operating documentation.',
        problem: 'Repo-audit and runbook flows often exist as one-off chats instead of repeatable internal assets.',
        includes: ['repo audit workflow outline', 'runbook template structure', 'review and remediation checklist', 'handoff format examples'],
        delivery: 'Editable workflow pack with operator notes for adaptation to your repositories and processes.',
        preview: 'Best for teams that already know the problem and want a structured way to reuse review workflows.',
        proofLinks: [
          { title: 'Webhook Automation Architecture for Developers', href: '/blog/webhook-automation-architecture-developers-2026' },
          { title: 'Getting Started with Next.js', href: '/blog/getting-started-with-nextjs' },
        ],
      },
    ],
  },
  {
    title: 'n8n workflow packs',
    description: 'For teams that want starter materials and workflow discipline before they expand automation scope.',
    products: [
      {
        title: 'n8n Workflow Starter Pack',
        audience: 'Small teams building their first useful internal automations.',
        problem: 'n8n is easy to start and easy to overcomplicate. Teams need a cleaner first workflow system.',
        includes: ['starter workflow planning sheet', 'testing checklist', 'basic failure-handling prompts', 'maintenance handoff notes'],
        delivery: 'Workflow starter templates and checklists designed for small practical automations.',
        preview: 'Backed by Blixamo articles on self-hosted n8n and workflow testing.',
        proofLinks: [
          { title: 'Self Hosting n8n on Hetzner VPS', href: '/blog/self-hosting-n8n-hetzner-vps' },
          { title: 'n8n Workflow Testing Checklist', href: '/blog/n8n-workflow-testing-checklist-2026' },
        ],
      },
    ],
  },
]

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Honest productized offers from Blixamo: deployment packs, self-hosting runbooks, AI workflow kits, and n8n starter materials available by request.',
  alternates: { canonical: absoluteUrl('/products') },
}

export default function ProductsPage() {
  return (
    <div>
      <section style={{ padding: '3.5rem 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Products</p>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, marginTop: '0.5rem', maxWidth: '12ch' }}>
              Productized packs for operators who need structure before they need a bigger service engagement.
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '66ch' }}>
              These offers are intentionally simple. No fake checkout, no invented pricing, and no filler catalog. If a pack is enough, it should save time without
              turning into a full consulting project. If it is not enough, the better route is the services page.
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/contact" className="home-hero-button home-hero-button-primary">Ask about availability</Link>
              <Link href="/services" className="home-hero-button home-hero-button-secondary">When services are better</Link>
            </div>
          </div>

          <aside style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(5, 150, 105, 0.08) 0%, rgba(255,255,255,0.98) 100%)', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}>
            <p style={{ fontWeight: 700 }}>Why these offers exist</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {PRIMARY_AUTHOR.displayName} already publishes the deployment, workflow, and runbook logic behind these offers. The product layer simply packages the most
              reusable parts into requestable formats.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.1rem' }}>
              {[
                'Request details through contact instead of pretending checkout is ready.',
                'Use proof and related reads as provenance signals.',
                'Keep the page honest: if a pack is not enough, say so and move the fit to services.',
              ].map((item) => (
                <div key={item} style={{ border: '1px solid var(--border)', borderRadius: '0.95rem', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.92)' }}>{item}</div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {PRODUCT_GROUPS.map((group, groupIndex) => (
        <section key={group.title} style={{ padding: '3rem 1.25rem', background: groupIndex % 2 === 0 ? 'var(--bg-subtle)' : 'transparent', borderTop: groupIndex % 2 === 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ maxWidth: '760px' }}>
              <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{group.title}</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>{group.description}</h2>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.75rem' }}>
              {group.products.map((product) => (
                <article key={product.title} style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
                  <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{product.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.problem}</p>
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}><strong style={{ color: 'var(--text-primary)' }}>Who it is for:</strong> {product.audience}</p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>What is included</p>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                        {product.includes.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}><strong style={{ color: 'var(--text-primary)' }}>Delivery format:</strong> {product.delivery}</p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Proof and preview</p>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.preview}</p>
                      <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                        {product.proofLinks.map((link) => (
                          <Link key={link.href} href={link.href} style={{ border: '1px solid var(--border)', borderRadius: '0.9rem', padding: '0.85rem 1rem', background: 'var(--bg-subtle)', textDecoration: 'none', color: 'inherit' }}>
                            {link.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.35rem' }}>
                    <Link href="/contact" className="home-hero-button home-hero-button-primary">Request details</Link>
                    <Link href="/contact" className="home-hero-button home-hero-button-secondary">Get this via contact</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>When a product is enough</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>You already know the problem and mainly need structure, checklists, or a runbook.</li>
              <li>Your team can implement the pack internally once the format is clear.</li>
              <li>The main blocker is repeatability, not custom engineering.</li>
            </ul>
          </article>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>When services are better</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>You need implementation help, migration sequencing, or stack cleanup instead of templates alone.</li>
              <li>The system is already fragile and the risk is in the execution, not just in the documentation.</li>
              <li>The work needs custom build or ops support, not a reusable pack.</li>
            </ul>
          </article>
        </div>
      </section>

      <section style={{ padding: '0 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '2rem', background: 'linear-gradient(180deg, rgba(5, 150, 105, 0.07) 0%, rgba(255,255,255,0.98) 100%)' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Need the right path first?</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.45rem' }}>The honest default is to match the route to the scope.</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '68ch' }}>
            If a pack can solve the problem cleanly, that is usually the lighter option. If the project needs custom build work, migration handling, or deeper ops help,
            the services page is the better fit.
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.4rem' }}>
            <Link href="/contact" className="home-hero-button home-hero-button-primary">Contact Blixamo</Link>
            <Link href="/services" className="home-hero-button home-hero-button-secondary">See services</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
