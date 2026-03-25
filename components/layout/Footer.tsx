import Link from 'next/link'

export function Footer() {
  const linkStyle = {
    display: 'block',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    marginBottom: '0.4rem',
  } as const

  const sectionTitleStyle = {
    fontWeight: 600,
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
  } as const

  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '4rem', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            blix<span style={{ color: 'var(--text-primary)' }}>amo</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Tech insights, tutorials, and digital trends — straight to the point.
          </p>
        </div>
        <div>
          <p style={sectionTitleStyle}>Categories</p>
          {['tech', 'tutorials', 'ai', 'tools'].map(c => (
            <Link key={c} href={`/category/${c}`} style={{ ...linkStyle, textTransform: 'capitalize' }}>{c}</Link>
          ))}
        </div>
        <div>
          <p style={sectionTitleStyle}>Company</p>
          {[
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Sitemap', href: '/sitemap.xml' },
            { label: 'RSS Feed', href: '/feed.xml' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={linkStyle}>{l.label}</Link>
          ))}
        </div>
        <div>
          <p style={sectionTitleStyle}>Legal</p>
          {[
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Disclaimer', href: '/disclaimer' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={linkStyle}>{l.label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} Blixamo. All rights reserved.
      </div>
    </footer>
  )
}
