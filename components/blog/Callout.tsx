import type { CSSProperties, ReactNode } from 'react'

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
      className={`article-callout article-callout-${type}`}
      style={
        {
          ['--callout-bg' as string]: style.bg,
          ['--callout-border' as string]: style.border,
        } as CSSProperties
      }
    >
      {title && (
        <div className="article-callout-title">
          <span className="article-callout-icon">{style.icon}</span>
          {title}
        </div>
      )}
      <div className="article-callout-body">{children}</div>
    </div>
  )
}
