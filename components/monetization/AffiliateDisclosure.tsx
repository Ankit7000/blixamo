export function AffiliateDisclosure() {
  return (
    <div role="note" style={{
      background: 'var(--bg-subtle)', border: '1px solid var(--border)',
      borderLeft: '4px solid var(--accent)', borderRadius: '0.375rem',
      padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)',
      margin: '1.5rem 0',
    }}>
      <strong>Disclosure:</strong> This post contains affiliate links. If you purchase through them,
      we earn a small commission at no extra cost to you. We only recommend tools we personally use and trust.
    </div>
  )
}
