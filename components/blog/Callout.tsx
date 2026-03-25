import type { ReactNode } from 'react'

const STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  info: { bg: 'var(--surface)', border: '#3b82f6', icon: 'i' },
  warning: { bg: 'rgba(234,179,8,0.08)', border: '#eab308', icon: '!' },
  error: { bg: 'rgba(239,68,68,0.08)', border: '#ef4444', icon: 'x' },
  success: { bg: 'rgba(34,197,94,0.08)', border: '#22c55e', icon: 'ok' },
  tip: { bg: 'rgba(168,85,247,0.08)', border: '#a855f7', icon: 'tip' },
}

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip'
  title?: string
  children: ReactNode
}) {
  const style = STYLES[type] ?? STYLES.info

  return (
    <div
      style={{
        background: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: '0.5rem',
        padding: '1rem 1.25rem',
        margin: '1.5rem 0',
        fontSize: '0.92rem',
        lineHeight: 1.6,
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 700,
            marginBottom: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>{style.icon}</span>
          {title}
        </div>
      )}
      <div style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </div>
  )
}
