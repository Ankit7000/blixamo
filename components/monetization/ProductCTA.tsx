interface Props { productUrl: string; price: string; name: string; description: string }

export function ProductCTA({ productUrl, price, name, description }: Props) {
  return (
    <div style={{
      border: '2px solid var(--accent)', borderRadius: '0.75rem',
      padding: '1.5rem', margin: '2rem 0', display: 'flex',
      gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{name}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>{description}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>{price}</span>
        <a href={productUrl} target="_blank" rel="noopener" style={{
          padding: '0.6rem 1.25rem', background: 'var(--accent)', color: '#fff',
          borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
        }}>Get it now →</a>
      </div>
    </div>
  )
}
