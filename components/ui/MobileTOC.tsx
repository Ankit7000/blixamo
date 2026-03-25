'use client'
import { useState } from 'react'

interface Props { content: string }

function extractHeadings(content: string) {
  const lines = content.split('\n')
  const headings: { level: number; text: string; id: string }[] = []
  for (const line of lines) {
    const m2 = line.match(/^## (.+)/)
    const m3 = line.match(/^### (.+)/)
    if (m2) {
      const text = m2[1].trim()
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      headings.push({ level: 2, text, id })
    } else if (m3) {
      const text = m3[1].trim()
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      headings.push({ level: 3, text, id })
    }
  }
  return headings.slice(0, 20)
}

export function MobileTOC({ content }: Props) {
  const [open, setOpen] = useState(false)
  const headings = extractHeadings(content)
  if (headings.length < 3) return null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        className="toc-mobile-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem' }}>📋</span>
          Table of Contents
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ({headings.length} sections)
          </span>
        </span>
        <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </button>
      <div className={`toc-mobile-drawer ${open ? 'open' : ''}`}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {headings.map((h, i) => (
            <li key={i} style={{ paddingLeft: h.level === 3 ? '1rem' : '0' }}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '0.3rem 0.5rem',
                  fontSize: h.level === 2 ? '0.875rem' : '0.82rem',
                  fontWeight: h.level === 2 ? 600 : 400,
                  color: 'var(--text-secondary)',
                  borderRadius: '0.25rem',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.color = 'var(--accent)'
                  el.style.background = 'var(--accent-soft)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.color = 'var(--text-secondary)'
                  el.style.background = 'transparent'
                }}
              >
                {h.level === 3 && <span style={{ color: 'var(--text-muted)', marginRight: '0.3rem' }}>↳</span>}
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
