'use client'
import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, placement: 'newsletter-section' }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1rem', margin: '3rem 0' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          The Blixamo Weekly
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Every week: the best in AI, developer tools, and tech tutorials — curated, no fluff. Join 1,000+ readers.
        </p>

        {status === 'success' ? (
          <div style={{ padding: '1.25rem', background: '#ebfbee', border: '1px solid #2f9e44', borderRadius: '0.75rem', color: '#2f9e44', fontWeight: 600 }}>
            ✅ You&apos;re subscribed! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email" required placeholder="Enter your email"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, minWidth: '220px', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
            />
            <button type="submit" disabled={status === 'loading'} style={{ padding: '0.75rem 1.5rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.95rem', cursor: status === 'loading' ? 'wait' : 'pointer' }}>
              {status === 'loading' ? 'Joining…' : 'Subscribe free →'}
            </button>
          </form>
        )}

        {status === 'error' && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--error)' }}>Something went wrong — please try again.</p>}

        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          No spam. Unsubscribe anytime. No credit card required.
        </p>
      </div>
    </section>
  )
}
