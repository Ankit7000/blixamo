import Link from 'next/link'

interface AffiliateBoxProps {
  provider: 'hetzner' | 'railway' | 'vercel' | 'coolify' | 'niyo' | 'digitalocean' | 'vultr' | 'wise'
  ctaText?: string
}

const AFFILIATE_DATA: Record<string, {
  name: string; url: string; description: string; badge: string
  badgeColor: string; badgeBg: string
}> = {
  hetzner: {
    name: 'Hetzner Cloud',
    url: 'https://www.hetzner.com/cloud',
    description: 'The VPS used in this guide. CPX22 costs €5.19/month (Rs 465) — the cheapest reliable VPS for Indian indie developers.',
    badge: 'Rs 465/month',
    badgeColor: '#059669',
    badgeBg: '#05906918',
  },
  digitalocean: {
    name: 'DigitalOcean',
    url: 'https://digitalocean.com',
    description: 'Popular alternative to Hetzner. $200 free credit for new accounts. Simple UI, good documentation for beginners.',
    badge: '$200 free credit',
    badgeColor: '#0080ff',
    badgeBg: '#0080ff18',
  },
  vultr: {
    name: 'Vultr',
    url: 'https://vultr.com',
    description: 'VPS provider with 32 locations worldwide including Mumbai. Good option if you need low latency from India.',
    badge: 'Mumbai datacenter',
    badgeColor: '#007bfc',
    badgeBg: '#007bfc18',
  },
  wise: {
    name: 'Wise (TransferWise)',
    url: 'https://wise.com',
    description: 'Best way to receive USD as an Indian freelancer. Real exchange rate, no hidden fees. I use it to receive client payments.',
    badge: 'Best rates for India',
    badgeColor: '#9fe870',
    badgeBg: '#9fe87018',
  },
  railway: {
    name: 'Railway',
    url: 'https://railway.com?referralCode=iJx680',
    description: 'Zero-config deployment. Free tier available. Great for quick deploys.',
    badge: 'Free tier',
    badgeColor: '#0891b2',
    badgeBg: '#0891b218',
  },
  vercel: {
    name: 'Vercel',
    url: 'https://vercel.com',
    description: 'Best platform for Next.js. Hobby tier is free. Zero config deploys.',
    badge: 'Free tier',
    badgeColor: '#6c63ff',
    badgeBg: '#6c63ff18',
  },
  coolify: {
    name: 'Coolify',
    url: 'https://coolify.io',
    description: 'Self-hosted Heroku alternative. Deploy apps, databases, and services on your own VPS.',
    badge: 'Open source',
    badgeColor: '#7c3aed',
    badgeBg: '#7c3aed18',
  },
  niyo: {
    name: 'Niyo Global Card',
    url: 'https://niyo.co/global',
    description: 'Best card for paying international dev tools from India. Zero forex markup, works on Hetzner.',
    badge: 'Zero forex',
    badgeColor: '#d97806',
    badgeBg: '#d9780618',
  },
}

export function AffiliateBox({ provider, ctaText }: AffiliateBoxProps) {
  const data = AFFILIATE_DATA[provider]
  if (!data) return null

  return (
    <div className="affiliate-box-inner" style={{
      display: 'flex', alignItems: 'flex-start', gap: '1rem',
      padding: '1.1rem 1.25rem',
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${data.badgeColor}`,
      borderRadius: '0 0.625rem 0.625rem 0',
      margin: '1.75rem 0',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{data.name}</span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.55rem',
            borderRadius: '2rem', letterSpacing: '0.03em',
            color: data.badgeColor, background: data.badgeBg,
          }}>
            {data.badge}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>affiliate link</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {data.description}
        </p>
      </div>
      <Link
        href={data.url}
        target="_blank"
        rel="noopener sponsored"
        style={{
          flexShrink: 0, padding: '0.55rem 1.1rem',
          background: data.badgeColor, color: '#fff',
          borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700,
          textDecoration: 'none', whiteSpace: 'nowrap',
          alignSelf: 'center',
        }}
      >
        {ctaText || 'Get Started →'}
      </Link>
    </div>
  )
}
