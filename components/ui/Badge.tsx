interface Props { children: React.ReactNode; variant?: 'default' | 'accent' | 'muted' }

export function Badge({ children, variant = 'default' }: Props) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    accent: { background: 'var(--accent)', color: '#fff' },
    muted: { background: 'var(--bg-subtle)', color: 'var(--text-muted)' },
  }
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.6rem',
      borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.04em',
      ...styles[variant],
    }}>{children}</span>
  )
}
