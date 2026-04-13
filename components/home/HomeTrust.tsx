import Link from 'next/link'
import type { TrustSection } from '@/lib/homepage'

export function HomeTrust({ section }: { section: TrustSection }) {
  return (
    <section className="home-section-shell">
      <div
        className="home-proof-panel"
        style={{
          display: 'grid',
          gap: '1.25rem',
          padding: '1.35rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.2rem',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="home-section-kicker">{section.kicker}</div>
            <h2 className="home-section-title" style={{ margin: 0 }}>
              {section.title}
            </h2>
            <p className="home-section-description" style={{ margin: 0 }}>
              {section.description}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '0.8rem',
            }}
          >
            {section.points.map((point) => (
              <div
                key={point.title}
                style={{
                  display: 'grid',
                  gap: '0.3rem',
                }}
              >
                <strong
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.45,
                  }}
                >
                  {point.title}
                </strong>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {section.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="home-hero-button home-hero-button-secondary"
              style={{
                padding: '0.7rem 0.95rem',
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
