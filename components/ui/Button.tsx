interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ children, variant = 'primary', size = 'md', style, ...props }: Props) {
  const base: React.CSSProperties = { borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }
  const sizes = { sm: { padding: '0.4rem 0.9rem', fontSize: '0.82rem' }, md: { padding: '0.65rem 1.25rem', fontSize: '0.95rem' }, lg: { padding: '0.8rem 1.75rem', fontSize: '1.05rem' } }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    outline: { background: 'transparent', color: 'var(--accent)', border: '2px solid var(--accent)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
  }
  return <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...props}>{children}</button>
}
