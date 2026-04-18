import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
        previewAsset: {
          src: '/images/products/vps-launch-pack-preview.png',
          alt: 'Preview of a VPS launch checklist and deployment SOP pack',
          caption: 'Preview of the VPS launch pack with checklist, SOP, rollback, and backup verification notes.',
          width: 1200,
          height: 1120,
        },
        proofReadyAssets: ['redacted prelaunch checklist preview', 'sample rollback decision page', 'verification worksheet screenshot'],
        proofLinks: [
          { title: 'VPS Setup Guide', href: '/blog/vps-setup-guide' },
          { title: 'How to Self Host Next.js on VPS', href: '/blog/how-to-self-host-nextjs-on-vps' },
          { title: 'Next.js VPS Prelaunch Checklist', href: '/blog/nextjs-vps-prelaunch-checklist-2026' },
        ],
      },
      {
        title: 'Coolify Deployment Runbook Pack',
        audience: 'Teams or solo operators moving app deploys into a calmer Coolify workflow.',
        problem: 'Coolify setups often work just enough to launch, then stay under-documented and risky to recover.',
        includes: ['deployment runbook', 'environment and service notes', 'backup and restore checklist', 'operator handoff prompts'],
        delivery: 'Annotated runbook and checklist templates with room for project-specific details.',
        preview: 'Grounded in public Coolify deployment and backup material already published on Blixamo.',
        previewAsset: {
          src: '/images/products/coolify-runbook-pack-preview.png',
          alt: 'Preview of a Coolify deployment runbook pack',
          caption: 'Preview of the Coolify runbook pack with deploy checks, failure triage, and rollback guidance.',
          width: 980,
          height: 1180,
        },
        proofReadyAssets: ['service map or env inventory screenshot', 'runbook page preview', 'restore drill checklist preview'],
        proofLinks: [
          { title: 'Deploy Next.js with Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
          { title: 'Coolify Backup and Restore Runbook', href: '/blog/coolify-backup-restore-runbook-2026' },
          { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
        ],
      },
      {
        title: 'Self-Hosting Ops Checklist Bundle',
        audience: 'Operators who need a repeatable baseline for health checks, backups, restores, and small-server hygiene.',
        problem: 'Self-hosting becomes stressful when the stack has no shared operating checklist and no recovery discipline.',
        includes: ['health and monitoring checklist', 'backup artifact checklist', 'restore drill worksheet', 'maintenance review notes'],
        delivery: 'Checklist bundle with short operator notes and clear verification prompts.',
        preview: 'Preview logic comes directly from Blixamo content about health checks, backups, and operational readiness.',
        previewAsset: null,
        proofReadyAssets: ['health-check checklist page', 'backup artifact log example', 'restore worksheet screenshot'],
        proofLinks: [
          { title: 'Docker Compose Health Checks in Production', href: '/blog/docker-compose-health-checks-production-2026' },
          { title: 'Docker Volume Backup Strategy on VPS', href: '/blog/docker-volume-backup-strategy-vps-2026' },
          { title: 'How I Verify a VPS Backup Before I Trust It', href: '/blog/verify-vps-backup-before-trusting-it-2026' },
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
        previewAsset: null,
        proofReadyAssets: ['redacted workflow diagram', 'QA checklist page preview', 'prompt block sample screenshot'],
        proofLinks: [
          { title: 'Claude API Prompt Patterns for Structured JSON', href: '/blog/claude-api-prompt-patterns-structured-json-2026' },
          { title: 'Best Free Developer Tools', href: '/blog/best-free-developer-tools-2026' },
          { title: 'Human Review Patterns for AI Workflows', href: '/blog/human-review-patterns-ai-workflows-2026' },
        ],
      },
      {
        title: 'Claude Skill / Claude Code Workflow Pack for Repo Audits and Runbooks',
        audience: 'Technical teams using Claude tooling for repo reviews, audits, and operating documentation.',
        problem: 'Repo-audit and runbook flows often exist as one-off chats instead of repeatable internal assets.',
        includes: ['repo audit workflow outline', 'runbook template structure', 'review and remediation checklist', 'handoff format examples'],
        delivery: 'Editable workflow pack with operator notes for adaptation to your repositories and processes.',
        preview: 'Best for teams that already know the problem and want a structured way to reuse review workflows.',
        previewAsset: null,
        proofReadyAssets: ['repo audit worksheet preview', 'remediation checklist sample', 'runbook section screenshot'],
        proofLinks: [
          { title: 'Webhook Automation Architecture for Developers', href: '/blog/webhook-automation-architecture-developers-2026' },
          { title: 'Getting Started with Next.js', href: '/blog/getting-started-with-nextjs' },
          { title: 'How I Validate AI JSON Output in 2026', href: '/blog/validate-ai-json-output-2026' },
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
        previewAsset: {
          src: '/images/products/n8n-workflow-pack-preview.png',
          alt: 'Preview of an n8n workflow starter pack',
          caption: 'Preview of the n8n starter pack with workflow templates, retry checks, and QA notes for live runs.',
          width: 760,
          height: 1260,
        },
        proofReadyAssets: ['workflow planning board preview', 'testing checklist page', 'failure-handling note screenshot'],
        proofLinks: [
          { title: 'Self Hosting n8n on Hetzner VPS', href: '/blog/self-hosting-n8n-hetzner-vps' },
          { title: 'n8n Workflow Testing Checklist', href: '/blog/n8n-workflow-testing-checklist-2026' },
          { title: 'Debug Slow or Fragile n8n Workflows', href: '/blog/debug-slow-fragile-n8n-workflows-2026' },
        ],
      },
    ],
  },
]

const PACK_FORMATS = [
  {
    title: 'Checklist pages',
    description: 'Short operational checklists that can later be shown as one or two real preview pages without turning the page into fake storefront proof.',
  },
  {
    title: 'Annotated runbooks',
    description: 'Editable SOP or runbook sections with notes about order, dependencies, and verification so the deliverable feels usable, not decorative.',
  },
  {
    title: 'Redacted screenshots',
    description: 'Screenshots of real checklist, worksheet, or operator pages with sensitive details removed once those assets actually exist.',
  },
  {
    title: 'Sample worksheets',
    description: 'Migration sheets, workflow maps, or verification tables that show the format of the pack without inventing client stories or fake results.',
  },
] as const

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Practical Blixamo packs for deployment, self-hosting, AI workflows, and n8n work that are requested directly instead of pushed through a generic storefront.',
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
              Practical packs for operators who need structure before they need hands-on implementation.
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '66ch' }}>
              These are lightweight, documentation-first offers for teams that need a checklist, runbook, or workflow pack before they need custom build work. Requests go
              through contact so the fit stays clear and the scope stays honest.
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
              reusable parts into compact formats a small team can actually use.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.1rem' }}>
              {[
                'Request through contact so the fit and scope stay clear before anything is promised.',
                'Use the previews and published guides as provenance for how the packs are built.',
                'Move to services when the real need is implementation, migration handling, or stack cleanup.',
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
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.problem}</p>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}><strong style={{ color: 'var(--text-primary)' }}>Who it is for:</strong> {product.audience}</p>
                  </div>

                  <div style={{ display: 'grid', gap: '1rem', marginTop: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>What&apos;s inside</p>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                        {product.includes.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Delivery format</p>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.delivery}</p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Preview and published support</p>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.preview}</p>
                      {product.previewAsset && (
                        <figure
                          style={{
                            margin: '1rem 0 0',
                            border: '1px solid var(--border)',
                            borderRadius: '0.95rem',
                            overflow: 'hidden',
                            background: 'var(--bg)',
                          }}
                        >
                          <Image
                            src={product.previewAsset.src}
                            alt={product.previewAsset.alt}
                            width={product.previewAsset.width}
                            height={product.previewAsset.height}
                            sizes="(max-width: 767px) 100vw, (max-width: 1120px) 50vw, 30vw"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                          <figcaption style={{ padding: '0.85rem 0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {product.previewAsset.caption}
                          </figcaption>
                        </figure>
                      )}
                      <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Built from published workflows:</strong> the related reads below show the operating logic behind this pack format.
                      </p>
                      <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
                        {product.proofLinks.map((link) => (
                          <Link key={link.href} href={link.href} style={{ border: '1px solid var(--border)', borderRadius: '0.9rem', padding: '0.85rem 1rem', background: 'var(--bg-subtle)', textDecoration: 'none', color: 'inherit' }}>
                            {link.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Typical support assets</p>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                        {product.proofReadyAssets.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.35rem' }}>
                    <Link href="/contact" className="home-hero-button home-hero-button-primary">Request details</Link>
                    <Link href="/services" className="home-hero-button home-hero-button-secondary">Need implementation instead?</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>What a delivered pack can look like</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>How these packs are typically structured</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PACK_FORMATS.map((item) => (
              <article key={item.title} style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.1rem', background: 'var(--bg-subtle)' }}>
                <strong style={{ display: 'block', marginBottom: '0.55rem' }}>{item.title}</strong>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{item.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
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

      <section style={{ padding: '0 1.25rem 3rem', background: 'var(--bg-subtle)' }}>
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
