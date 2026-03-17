'use client'
import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

function extractHeadings(content: string): Heading[] {
  const regex = /^#{2,3}\s+(.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[0].indexOf(' ')
    const text = match[1].replace(/[*`]/g, '')
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ id, text, level })
  }
  return headings
}

export function TableOfContents({ content }: { content: string }) {
  const [active, setActive] = useState('')
  const headings = extractHeadings(content)

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach(h => { const el = document.getElementById(h.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [content])

  if (headings.length < 3) return null

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc-title">In this article</p>
      <ul>
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
            <a href={`#${h.id}`} className={active === h.id ? 'active' : ''}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
