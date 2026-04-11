'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Start Here', href: '/tag/deployment' },
  { label: 'Categories', href: '/tag/deployment#resource-categories' },
  { label: 'Guides', href: '/tag/deployment#authority-pages' },
  { label: 'Community', href: '/community' },
  { label: 'Blog', href: '/blog' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light'|'dark') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(saved)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--bg)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.2s',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', height: '60px', gap: '1.5rem' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)', letterSpacing: '-0.03em', flexShrink: 0 }}>
          blix<span style={{ color: 'var(--text-primary)' }}>amo</span>
        </Link>

        <nav style={{ display: 'flex', gap: '0.15rem', flex: 1, minWidth: 0 }} className="hidden-mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--accent)'
                ;(e.target as HTMLElement).style.background = 'var(--surface)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--text-secondary)'
                ;(e.target as HTMLElement).style.background = 'transparent'
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/search" aria-label="Search" style={{ padding: '0.4rem', borderRadius: '0.375rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{ padding: '0.4rem', borderRadius: '0.375rem', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" className="show-mobile" style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.6rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 980px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 981px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  )
}

