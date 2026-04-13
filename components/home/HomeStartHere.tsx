import Link from 'next/link'
import type { StartHereSection } from '@/lib/homepage'

export function HomeStartHere({ section }: { section: StartHereSection }) {
  return (
    <section id="start-here" className="home-section-shell">
      <div className="home-section-head">
        <div className="home-section-kicker">{section.kicker}</div>
        <h2 className="home-section-title">{section.title}</h2>
        <p className="home-section-description">{section.description}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {section.items.map((item, index) => (
          <article
            key={item.title}
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
              <span className="home-curated-eyebrow">Goal {index + 1}</span>
              <span className="home-curated-arrow">Choose</span>
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
              {item.description}
            </p>
            <div
              style={{
                display: 'grid',
                gap: '0.6rem',
              }}
            >
              <Link
                href={item.primaryLink.href}
                className="home-hero-button home-hero-button-secondary"
                style={{
                  width: 'fit-content',
                  padding: '0.65rem 0.9rem',
                }}
              >
                {item.primaryLink.label}
              </Link>
              {item.secondaryLink ? (
                <Link
                  href={item.secondaryLink.href}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    textDecoration: 'none',
                  }}
                >
                  {item.secondaryLink.label}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
