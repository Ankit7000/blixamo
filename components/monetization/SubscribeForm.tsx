'use client'

import { useState } from 'react'

type SubscribeFormProps = {
  source: string
  page?: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function SubscribeForm({ source, page }: SubscribeFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source, page }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setStatus('error')
        setMessage(typeof data?.error === 'string' ? data.error : 'Subscription failed. Please try again.')
        return
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage(data?.duplicate ? 'You are already subscribed. No duplicate entry was created.' : 'Subscription saved successfully.')
    } catch {
      setStatus('error')
      setMessage('Subscription failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem', maxWidth: '520px' }}>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name (optional)"
        autoComplete="name"
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '0.8rem',
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
        }}
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        autoComplete="email"
        required
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '0.8rem',
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
        }}
      />
      <button type="submit" disabled={status === 'loading'} className="home-hero-button home-hero-button-primary" style={{ width: 'fit-content' }}>
        {status === 'loading' ? 'Saving...' : 'Subscribe'}
      </button>
      {message ? (
        <p style={{ margin: 0, color: status === 'error' ? 'var(--error)' : 'var(--text-secondary)', lineHeight: 1.7 }}>{message}</p>
      ) : null}
    </form>
  )
}
