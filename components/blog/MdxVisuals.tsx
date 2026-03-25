import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type VisualTone = 'default' | 'info' | 'success' | 'warning' | 'accent'

function getToneClass(tone: VisualTone) {
  return `article-visual-tone-${tone}`
}

export function ArticleImage({
  className,
  alt = '',
  src,
  loading,
  decoding,
  title,
  ...rest
}: ComponentPropsWithoutRef<'img'>) {
  if (!src) return null

  return (
    <span className="article-image-shell">
      <img
        src={typeof src === 'string' ? src : ''}
        alt={alt}
        loading={loading ?? 'lazy'}
        decoding={decoding ?? 'async'}
        className={['article-inline-image', className].filter(Boolean).join(' ')}
        {...rest}
      />
      {title ? <span className="article-inline-figcaption">{title}</span> : null}
    </span>
  )
}

export function ArticleTable({ className, children, ...rest }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="article-table-shell">
      <div className="article-table-scroll">
        <table className={['article-mdx-table', className].filter(Boolean).join(' ')} {...rest}>
          {children}
        </table>
      </div>
    </div>
  )
}

export function VisualBlock({
  title,
  eyebrow,
  tone = 'default',
  children,
}: {
  title: string
  eyebrow?: string
  tone?: VisualTone
  children: ReactNode
}) {
  return (
    <section className={`article-visual-block ${getToneClass(tone)}`}>
      {eyebrow ? <p className="article-visual-eyebrow">{eyebrow}</p> : null}
      <h3 className="article-visual-title">{title}</h3>
      <div className="article-visual-body">{children}</div>
    </section>
  )
}

export function ProsCons({
  pros,
  cons,
  title = 'Pros and cons',
}: {
  pros: string[]
  cons: string[]
  title?: string
}) {
  return (
    <section className="article-pros-cons">
      <div className="article-pros-cons-head">
        <p className="article-visual-eyebrow">Comparison snapshot</p>
        <h3 className="article-visual-title">{title}</h3>
      </div>
      <div className="article-pros-cons-grid">
        <div className="article-pros-card">
          <h4>Pros</h4>
          <ul>
            {pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="article-cons-card">
          <h4>Cons</h4>
          <ul>
            {cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function VerdictBox({
  winner,
  summary,
  bullets = [],
}: {
  winner: string
  summary: string
  bullets?: string[]
}) {
  return (
    <section className="article-verdict-box">
      <p className="article-visual-eyebrow">Bottom line</p>
      <h3 className="article-verdict-title">{winner}</h3>
      <p className="article-verdict-summary">{summary}</p>
      {bullets.length > 0 ? (
        <ul className="article-verdict-list">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
