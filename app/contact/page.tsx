import type { Metadata } from 'next'
import Link from 'next/link'
import { PRIMARY_AUTHOR } from '@/lib/author'
import { absoluteUrl } from '@/lib/site'

const INQUIRY_TYPES = [
  'project work',
  'SaaS MVP build',
  'consulting or help request',
  'automation or self-hosting setup',
  'partnerships',
  'corrections or content issues',
]

const MESSAGE_PROMPTS = [
  'the goal or problem',
  'your current setup or stack',
  'timeline',
  'budget range if relevant',
]

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Blixamo and Ankit Sorathiya for project work, SaaS MVP builds, self-hosting help, partnerships, and corrections.',
  alternates: { canonical: absoluteUrl('/contact') },
}

export default function ContactPage() {
  return (
    <div>
      <section style={{ padding: '3.5rem 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact</p>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, marginTop: '0.5rem', maxWidth: '12ch' }}>
              Direct contact for project work, technical help, and useful corrections.
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '64ch' }}>
              Blixamo is run by {PRIMARY_AUTHOR.displayName}. If you want to discuss a project, MVP build, deployment issue, self-hosting setup, partnership, or a correction on
              the publication, email is the cleanest route.
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <a href={`mailto:${PRIMARY_AUTHOR.email}`} className="home-hero-button home-hero-button-primary">Email directly</a>
              <Link href="/services" className="home-hero-button home-hero-button-secondary">See services</Link>
              <Link href="/products" className="home-hero-button home-hero-button-secondary">See products</Link>
            </div>
          </div>

          <aside style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0.98) 100%)' }}>
            <p style={{ fontWeight: 700, marginTop: 0 }}>Founder and operator intro</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {PRIMARY_AUTHOR.shortBio} If the request is technical, specific, and grounded in a real stack or business need, it is much easier to help quickly.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 0 }}>Expected response time: usually within 2 to 5 business days.</p>
          </aside>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inquiry types</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem' }}>The contact page works best when the request is clearly framed.</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {INQUIRY_TYPES.map((type) => (
              <div key={type} style={{ border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.1rem', background: 'var(--bg)' }}>{type}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>What to include</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {MESSAGE_PROMPTS.map((prompt) => <li key={prompt}>{prompt}</li>)}
            </ul>
          </article>

          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Best fit</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Project work tied to a real site, app, deploy, or workflow.</li>
              <li>Requests with enough technical detail for a useful first reply.</li>
              <li>Corrections and article issues with the exact URL or problem included.</li>
            </ul>
          </article>

          <article style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', background: 'var(--bg)' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Not a fit</p>
            <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Mass outreach, generic pitches, or repeated follow-up without useful context.</li>
              <li>Requests that expect enterprise-scale support from a solo operator setup.</li>
              <li>Messages with no clear goal, stack, or desired outcome.</li>
            </ul>
          </article>
        </div>
      </section>

      <section style={{ padding: '0 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '2rem', background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.07) 0%, rgba(255,255,255,0.98) 100%)' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Direct contact path</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.45rem' }}>{PRIMARY_AUTHOR.email}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '68ch' }}>
            If the request looks like a services fit, read <Link href="/services">Services</Link> first. If a productized pack may be enough, check <Link href="/products">Products</Link>.
            If you mainly want publication updates, use <Link href="/subscribe">Subscribe</Link>.
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.4rem' }}>
            <a href={`mailto:${PRIMARY_AUTHOR.email}`} className="home-hero-button home-hero-button-primary">Email {PRIMARY_AUTHOR.displayName}</a>
            <Link href="/services" className="home-hero-button home-hero-button-secondary">Services</Link>
            <Link href="/products" className="home-hero-button home-hero-button-secondary">Products</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
