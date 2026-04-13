'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TopicLane } from '@/lib/homepage'

export function HomeTopicLanes({ lanes }: { lanes: TopicLane[] }) {
  const [activeLaneId, setActiveLaneId] = useState(lanes[0]?.id ?? '')
  const activeLane = lanes.find((lane) => lane.id === activeLaneId) ?? lanes[0]

  if (!activeLane) {
    return null
  }

  return (
    <section id="topic-lanes" className="home-section-shell">
      <div className="home-section-head">
        <div className="home-section-kicker">Topic Lanes</div>
        <h2 className="home-section-title">Read Blixamo like a technical publication, not a generic blog archive</h2>
        <p className="home-section-description">
          Each lane has one lead read and two supporting reads so you can go deeper without widening into the full
          site too early.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.7rem',
          marginBottom: '1.2rem',
        }}
      >
        {lanes.map((lane) => {
          const isActive = lane.id === activeLane.id

          return (
            <button
              key={lane.id}
              type="button"
              onClick={() => setActiveLaneId(lane.id)}
              style={{
                cursor: 'pointer',
                borderRadius: '999px',
                border: `1px solid ${isActive ? lane.color : 'var(--border)'}`,
                background: isActive ? `${lane.color}20` : 'var(--surface)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.65rem 0.95rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
              }}
            >
              {lane.label}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        <Link
          href={`/blog/${activeLane.leadArticle.slug}`}
          className="home-featured-lead"
          style={{
            gridTemplateColumns: '1fr',
            padding: '1.35rem',
          }}
        >
          <div className="home-featured-content" style={{ padding: 0 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <span className="home-featured-badge" style={{ color: activeLane.color }}>
                {activeLane.label}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{activeLane.routeLabel}</span>
            </div>

            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <h3 className="home-featured-title" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)' }}>
                {activeLane.leadArticle.title}
              </h3>
              <p className="home-featured-copy">{activeLane.description}</p>
              <p className="home-featured-copy" style={{ fontSize: '0.9rem' }}>
                {activeLane.leadArticle.description}
              </p>
            </div>

            <div className="home-featured-meta">
              <span>{activeLane.leadArticle.categoryLabel}</span>
              <span>{activeLane.leadArticle.readingTime}</span>
              <span>Lead read</span>
            </div>
          </div>
        </Link>

        <div className="home-featured-stack">
          {activeLane.supportArticles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="home-featured-mini">
              <div className="home-featured-mini-top">
                <span className="home-featured-mini-category" style={{ color: activeLane.color }}>
                  Support read
                </span>
                <span className="home-featured-mini-meta" style={{ marginTop: 0 }}>
                  {article.readingTime}
                </span>
              </div>
              <h3 className="home-featured-mini-title">{article.title}</h3>
              <p className="home-featured-mini-copy">{article.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
