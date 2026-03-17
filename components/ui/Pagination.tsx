import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string // e.g. "/blog" or "/category/ai"
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const prev = currentPage > 1 ? currentPage - 1 : null
  const next = currentPage < totalPages ? currentPage + 1 : null

  // Build page number array with ellipsis
  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const linkStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px', borderRadius: '0.5rem',
    fontSize: '0.875rem', fontWeight: active ? 700 : 500,
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent)' : 'var(--bg)',
    color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    pointerEvents: disabled ? 'none' : 'auto',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
    transition: 'all 0.15s',
  })

  function pageHref(p: number) {
    return p === 1 ? basePath : `${basePath}/page/${p}`
  }

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '3rem', flexWrap: 'wrap' }}>
      {prev ? (
        <Link href={pageHref(prev)} style={linkStyle(false)} aria-label="Previous page">←</Link>
      ) : (
        <span style={linkStyle(false, true)}>←</span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ ...linkStyle(false, true), border: 'none' }}>…</span>
        ) : (
          <Link key={p} href={pageHref(p)} style={linkStyle(p === currentPage)} aria-current={p === currentPage ? 'page' : undefined}>
            {p}
          </Link>
        )
      )}

      {next ? (
        <Link href={pageHref(next)} style={linkStyle(false)} aria-label="Next page">→</Link>
      ) : (
        <span style={linkStyle(false, true)}>→</span>
      )}
    </nav>
  )
}
