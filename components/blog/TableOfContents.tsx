'use client'
import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

function extractHeadings(content: string): Heading[] {
  const regex = /^##\s+(.+)$/gm
  const headings: Heading[] = []
  const excludedPatterns = [
    /^related cluster articles$/i,
    /^what this comparison is actually deciding$/i,
    /^where .+ benchmark$/i,
    /^which should you use\??$/i,
    /^quick chooser$/i,
    /^troubleshooting the wrong choice$/i,
    /^full comparison table$/i,
  ]
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].replace(/[*`]/g, '')
    if (excludedPatterns.some((pattern) => pattern.test(text))) continue
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ id, text, level: 2 })
  }
  return headings.slice(0, 9)
}

export function TableOfContents({ content, className = '' }: { content: string; className?: string }) {
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
    <nav className={`toc ${className}`.trim()} aria-label="Table of contents">
      <p className="toc-title">In this article</p>
      <ul>
        {headings.map(h => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={active === h.id ? 'active' : ''}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
