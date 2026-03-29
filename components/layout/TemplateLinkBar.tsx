import Link from 'next/link'

type TemplateLinkBarProps = {
  relatedHref: string
  relatedLabel: string
}

export function TemplateLinkBar({ relatedHref, relatedLabel }: TemplateLinkBarProps) {
  const links = [
    { href: '/', label: 'Homepage' },
    { href: '/tag/deployment', label: 'Resources Hub' },
    { href: '/blog', label: 'Blog' },
    { href: relatedHref, label: relatedLabel },
  ].filter((link, index, collection) => collection.findIndex((entry) => entry.href === link.href) === index)

  return (
    <section
      style={{
        marginBottom: '1.5rem',
        padding: '1rem 1.1rem',
        border: '1px solid var(--border)',
        borderRadius: '0.9rem',
        background: 'var(--surface)',
      }}
    >
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        Core Site Links
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="home-hero-button home-hero-button-secondary">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
