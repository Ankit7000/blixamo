import Link from 'next/link'
import type { AuthorityPage } from '@/lib/resources'

export function AuthorityCard({ page }: { page: AuthorityPage }) {
  return (
    <Link href={page.href} className="home-curated-card">
      <div className="home-curated-top">
        <span className="home-curated-eyebrow">Authority Page</span>
        <span className="home-curated-arrow">{page.cluster}</span>
      </div>
      <h3 className="home-curated-title">{page.title}</h3>
      <p className="home-curated-copy">{page.description}</p>
      <div className="home-curated-footer">
        <span>{page.post.title}</span>
        <span>Open pillar guide</span>
      </div>
    </Link>
  )
}
