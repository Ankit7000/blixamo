import Link from 'next/link'
import type { PillarGuidesSection } from '@/lib/homepage'

export function HomePillarGuides({ section }: { section: PillarGuidesSection }) {
  return (
    <section className="home-section-shell">
      <div className="home-section-head home-section-head-inline">
        <div>
          <div className="home-section-kicker">{section.kicker}</div>
          <h2 className="home-section-title">{section.title}</h2>
          <p className="home-section-description">{section.description}</p>
        </div>
        {section.link ? (
          <Link href={section.link.href} className="home-section-link">
            {section.link.label}
          </Link>
        ) : null}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {section.guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="home-curated-card"
            style={{
              minHeight: '100%',
              padding: '1.2rem',
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <div className="home-curated-top">
              <span className="home-curated-eyebrow">Guide route</span>
              <span className="home-curated-arrow">Open</span>
            </div>
            <h3 className="home-curated-title" style={{ fontSize: '1.02rem', lineHeight: 1.4 }}>
              {guide.title}
            </h3>
            <p className="home-curated-copy" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
              {guide.summary}
            </p>
            {guide.bestFor ? (
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {guide.bestFor}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  )
}
