'use client'
interface Props { href: string; children: React.ReactNode; label?: string }

function track(label: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'affiliate_click', { link_label: label })
  }
}

export function AffiliateLink({ href, children, label }: Props) {
  return (
    <a
      href={href}
      rel="nofollow noopener noreferrer sponsored"
      target="_blank"
      data-affiliate={label}
      onClick={() => track(label || href)}
      style={{ color: 'var(--accent)', borderBottom: '1px dashed var(--accent)' }}
    >
      {children}
    </a>
  )
}
