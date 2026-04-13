'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TopicLanesSection } from '@/lib/homepage'

export function HomeTopicLanes({ section }: { section: TopicLanesSection }) {
  const [activeLaneId, setActiveLaneId] = useState(section.lanes[0]?.id ?? '')
  const activeLane = section.lanes.find((lane) => lane.id === activeLaneId) ?? section.lanes[0]

  if (!activeLane) {
    return null
  }

  return (
    <section id="topic-lanes" className="home-section-shell">
      <div className="home-section-head">
        <div className="home-section-kicker">{section.kicker}</div>
        <h2 className="home-section-title">{section.title}</h2>
        <p className="home-section-description">{section.description}</p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.7rem',
          marginBottom: '1.2rem',
        }}
      >
        {section.lanes.map((lane) => {
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
        <div
          className="home-proof-panel"
          style={{
            display: 'grid',
            gap: '1rem',
            padding: '1.2rem',
          }}
        >
          <div style={{ display: 'grid', gap: '0.7rem' }}>
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
              {activeLane.articleCountLabel ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{activeLane.articleCountLabel}</span>
              ) : null}
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {activeLane.description}
            </p>
            <Link href={activeLane.categoryLink.href} className="home-section-link" style={{ width: 'fit-content' }}>
              {activeLane.categoryLink.label}
            </Link>
          </div>
        </div>

        <Link
          href={`/blog/${activeLane.featuredArticle.slug}`}
          className="home-featured-lead"
          style={{
            gridTemplateColumns: '1fr',
            padding: '1.35rem',
          }}
        >
          <div className="home-featured-content" style={{ padding: 0 }}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <h3 className="home-featured-title" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)' }}>
                {activeLane.featuredArticle.title}
              </h3>
              <p className="home-featured-copy">{activeLane.featuredArticle.description}</p>
            </div>

            <div className="home-featured-meta">
              <span>{activeLane.featuredArticle.categoryLabel}</span>
              <span>{activeLane.featuredArticle.readingTime}</span>
              <span>Featured article</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
