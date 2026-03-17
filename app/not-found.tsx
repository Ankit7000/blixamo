import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" style={{ padding: '0.65rem 1.5rem', background: 'var(--accent)', color: '#fff', borderRadius: '0.5rem', fontWeight: 600 }}>← Go Home</Link>
        <Link href="/blog" style={{ padding: '0.65rem 1.5rem', border: '2px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem', fontWeight: 600 }}>Browse Articles</Link>
      </div>
    </div>
  )
}
