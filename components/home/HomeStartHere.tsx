import Link from 'next/link'
import type { StartHereItem } from '@/lib/homepage'

export function HomeStartHere({ items }: { items: StartHereItem[] }) {
  return (
    <section id="start-here" className="home-section-shell">
      <div className="home-section-head">
        <div className="home-section-kicker">Start Here</div>
        <h2 className="home-section-title">Choose the shortest path into the problem you are trying to solve</h2>
        <p className="home-section-description">
          Blixamo works best when you start with the job in front of you, not by opening the archive and guessing where
          to click next.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="home-curated-card"
            style={{
              minHeight: '100%',
              padding: '1.2rem',
              borderRadius: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <div className="home-curated-top">
              <span className="home-curated-eyebrow">Path {index + 1}</span>
              <span className="home-curated-arrow">Open</span>
            </div>
            <h3
              className="home-curated-title"
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.35,
              }}
            >
              {item.title}
            </h3>
            <p
              className="home-curated-copy"
              style={{
                flex: 1,
                fontSize: '0.9rem',
                lineHeight: 1.65,
              }}
            >
              {item.outcome}
            </p>
            <div className="home-curated-footer">
              <span>{item.linkLabel}</span>
              <span>Read now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
