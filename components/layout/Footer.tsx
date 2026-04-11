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
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '2.5rem 1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            blix<span style={{ color: 'var(--text-primary)' }}>amo</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Developer guides, self-hosting resources, comparisons, and practical tools for shipping on your own stack.
          </p>
        </div>

        <div>
          <p style={sectionTitleStyle}>Start Here</p>
          {[
            { label: 'Home', href: '/' },
            { label: 'Resources Hub', href: '/tag/deployment' },
            { label: 'Community', href: '/community' },
            { label: 'Blog', href: '/blog' },
            { label: 'Start Here', href: '/tag/deployment#resources-start-here' },
            { label: 'Comparisons', href: '/tag/deployment#resources-comparisons' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={sectionTitleStyle}>Categories</p>
          {[
            { label: 'VPS & Cloud', href: '/category/vps-cloud' },
            { label: 'Self Hosting', href: '/category/self-hosting' },
            { label: 'How To', href: '/category/how-to' },
            { label: 'Automation', href: '/category/automation' },
            { label: 'AI', href: '/category/ai' },
            { label: 'Developer Tools', href: '/category/developer-tools' },
            { label: 'Free Tools', href: '/category/free-tools' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={sectionTitleStyle}>Guides</p>
          {[
            { label: 'Deploy Apps on VPS', href: '/guides/deploy-apps-on-vps-complete-guide' },
            { label: 'Self Hosting Guide', href: '/guides/self-hosting-complete-guide' },
            { label: 'VPS & Cloud Guide', href: '/guides/vps-cloud-for-developers-guide' },
            { label: 'Automation Guide', href: '/guides/automation-guide-for-developers' },
            { label: 'Comparisons Hub', href: '/guides/comparisons-hub' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={sectionTitleStyle}>Popular Articles</p>
          {[
            { label: 'Deploy Next.js on VPS', href: '/blog/how-to-self-host-nextjs-on-vps' },
            { label: 'Coolify on Hetzner', href: '/blog/deploy-nextjs-coolify-hetzner' },
            { label: 'n8n on Hetzner', href: '/blog/self-hosting-n8n-hetzner-vps' },
            { label: 'VPS Hardening Guide', href: '/blog/vps-security-harden-ubuntu-2026' },
            { label: 'Best Free Dev Tools', href: '/blog/best-free-developer-tools-2026' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={sectionTitleStyle}>Company</p>
          {[
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Products', href: '/products' },
            { label: 'Contact', href: '/contact' },
            { label: 'Subscribe', href: '/subscribe' },
            { label: 'Sitemap', href: '/sitemap.xml' },
            { label: 'RSS Feed', href: '/feed.xml' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p style={sectionTitleStyle}>Legal</p>
          {[
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Disclaimer', href: '/disclaimer' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        (c) {new Date().getFullYear()} Blixamo. All rights reserved.
      </div>
    </footer>
  )
}
