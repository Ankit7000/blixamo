'use client'
import { useState, useEffect } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface EmailCaptureProps {
  placement?: 'inline' | 'end-of-post' | 'sidebar' | 'exit-intent'
  headline?: string
  subline?: string
}

function useExitIntent(enabled: boolean, onTrigger: () => void) {
  useEffect(() => {
    if (!enabled) return
    const triggered = sessionStorage.getItem('exit-intent-shown')
    if (triggered) return
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem('exit-intent-shown', '1')
        onTrigger()
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [enabled, onTrigger])
}

export function EmailCapture({ placement = 'inline', headline, subline }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [popupOpen, setPopupOpen] = useState(false)

  useExitIntent(placement === 'exit-intent', () => setPopupOpen(true))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, placement }),
      })
      setStatus('success')
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'email_signup', { event_category: 'conversion', event_label: placement })
      }
    } catch {
      setStatus('error')
    }
  }

  const successBox = (
    <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', margin: '2rem 0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
      <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>You&apos;re in!</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Check your inbox for a confirmation.</p>
    </div>
  )

  const formBox = (dark = false) => (
    <div style={{
      background: dark ? 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)' : 'var(--bg-subtle)',
      border: dark ? 'none' : '1px solid var(--border)',
      borderRadius: '0.75rem', padding: '2rem', margin: '2.5rem 0',
      color: dark ? '#fff' : 'var(--text-primary)', textAlign: 'center',
    }}>
      <p style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.4rem' }}>
        {headline || (dark ? 'Stay in the loop 🚀' : 'Get weekly tech insights')}
      </p>
      <p style={{ opacity: dark ? 0.9 : 1, color: dark ? 'inherit' : 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        {subline || 'No spam. Unsubscribe anytime.'}
      </p>
      <form onSubmit={handleSubmit} className="email-form-row" style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="email" required placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.95rem', outline: 'none', color: '#1a1a2e' }}
        />
        <button type="submit" disabled={status === 'loading'} style={{
          padding: '0.65rem 1.25rem', background: dark ? '#1a1a2e' : 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: status === 'loading' ? 'wait' : 'pointer',
          fontSize: '0.9rem', opacity: status === 'loading' ? 0.7 : 1,
        }}>{status === 'loading' ? 'Joining…' : 'Subscribe free'}</button>
      </form>
      {status === 'error' && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', opacity: 0.9 }}>Something went wrong — try again.</p>}
    </div>
  )

  // Exit-intent popup
  if (placement === 'exit-intent') {
    if (!popupOpen) return null
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={() => setPopupOpen(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', borderRadius: '1rem', padding: '2.5rem', maxWidth: '480px', width: '100%', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
          <button onClick={() => setPopupOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.5rem' }}>📬</div>
          {status === 'success' ? successBox : formBox(true)}
        </div>
      </div>
    )
  }

  if (status === 'success') return successBox
  return formBox(placement === 'end-of-post')
}
