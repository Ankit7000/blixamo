import type { Metadata } from 'next'
import Link from 'next/link'
import { SubscribeForm } from '@/components/monetization/SubscribeForm'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Subscribe',
  description:
    'Subscribe to Blixamo updates for practical developer reads on self-hosting, VPS operations, automation, and technical workflows.',
  alternates: { canonical: absoluteUrl('/subscribe') },
  robots: { index: false, follow: true },
}

export default function SubscribePage() {
  return (
    <div>
      <section style={{ padding: '3.5rem 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subscribe</p>
            <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', lineHeight: 1.05, marginTop: '0.5rem', maxWidth: '12ch' }}>
              Subscribe to the practical side of Blixamo.
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '64ch' }}>
              This is an owned subscribe flow. It is meant for readers who want useful updates from the publication and occasional notes from the builder behind it,
              not high-frequency marketing mail.
            </p>
            <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1.4rem' }}>
              {[
                'New proof-heavy guides on deployment, self-hosting, automation, and developer tooling',
                'Occasional notes when new service or workflow material is worth sharing',
                'A lower-noise path back into the strongest Blixamo reads',
              ].map((item) => (
                <div key={item} style={{ border: '1px solid var(--border)', borderRadius: '0.9rem', padding: '0.85rem 1rem', background: 'var(--bg-subtle)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside
            style={{
              border: '1px solid var(--border)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.07) 0%, rgba(255,255,255,0.98) 100%)',
            }}
          >
            <p style={{ fontWeight: 700, marginTop: 0 }}>What to expect</p>
            <ul style={{ margin: '0.9rem 0 0', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Updates about technical guides, deployment notes, and workflow improvements.</li>
              <li>No fake urgency, no forced sales funnel, and no endless email volume.</li>
              <li>You can ask to be removed later by replying directly.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section style={{ padding: '0 1.25rem 3rem' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              background: 'var(--bg)',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
            }}
          >
            <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subscribe form</p>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>Simple and direct.</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Enter an email address and, optionally, a name. The submission is stored through the server-side subscribe route.
            </p>
            <SubscribeForm source="subscribe-page" page="/subscribe" />
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <article style={{ border: '1px solid var(--border)', borderRadius: '1.1rem', padding: '1.25rem', background: 'var(--bg)' }}>
              <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Privacy note</p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                The subscribe flow is intended to store only the submitted name, email, timestamp, and source context needed to manage the list. It is not a public page
                meant for search visibility.
              </p>
            </article>

            <article style={{ border: '1px solid var(--border)', borderRadius: '1.1rem', padding: '1.25rem', background: 'var(--bg)' }}>
              <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Useful next routes</p>
              <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
                <Link href="/blog" className="home-hero-button home-hero-button-secondary">
                  Browse the blog
                </Link>
                <Link href="/services" className="home-hero-button home-hero-button-secondary">
                  See services
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
