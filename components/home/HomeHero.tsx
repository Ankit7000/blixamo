import Link from 'next/link'
import type { HeroSection } from '@/lib/homepage'

export function HomeHero({ hero }: { hero: HeroSection }) {
  return (
    <section className="home-hero-shell">
      <div className="home-hero" style={{ alignItems: 'stretch' }}>
        <div className="home-hero-copy">
          <div className="home-hero-kicker">{hero.eyebrow}</div>
          <h1
            className="home-hero-title"
            style={{
              maxWidth: '14ch',
              fontSize: 'clamp(2.35rem, 5vw, 4.25rem)',
            }}
          >
            {hero.headline}
          </h1>
          <p
            className="home-hero-description"
            style={{
              fontSize: '1.04rem',
              maxWidth: '58ch',
            }}
          >
            {hero.subhead}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {hero.proofPoints.map((point) => (
              <div
                key={point}
                className="home-proof-card"
                style={{
                  borderRadius: '1rem',
                  padding: '0.95rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '0.6rem',
                    height: '0.6rem',
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>

          <div className="home-hero-actions">
            {hero.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`home-hero-button ${
                  action.variant === 'primary' ? 'home-hero-button-primary' : 'home-hero-button-secondary'
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="home-hero-visual">
          <div
            className="home-proof-panel"
            style={{
              gridTemplateColumns: '1fr',
              gap: '1rem',
              padding: '1.35rem',
              borderRadius: '1.4rem',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            }}
          >
            <div style={{ display: 'grid', gap: '0.55rem' }}>
              <span className="home-hero-feature-label">{hero.visual.label}</span>
              <h2
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                {hero.visual.title}
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                }}
              >
                {hero.visual.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.8rem',
                padding: '1rem',
                borderRadius: '1rem',
                border: '1px solid var(--border)',
                background: 'rgba(15, 23, 42, 0.12)',
              }}
            >
              {hero.visual.rows.map((row) => (
                <div
                  key={row.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(88px, 108px) 1fr',
                    gap: '0.85rem',
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      padding: '0.38rem 0.65rem',
                      borderRadius: '999px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {row.label}
                  </span>
                  <div style={{ display: 'grid', gap: '0.2rem' }}>
                    <strong
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {row.title}
                    </strong>
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.84rem',
                        lineHeight: 1.55,
                      }}
                    >
                      {row.copy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
