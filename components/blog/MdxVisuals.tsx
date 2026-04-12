import fs from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type VisualTone = 'default' | 'info' | 'success' | 'warning' | 'accent'

const ARTICLE_IMAGE_SIZES =
  '(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) min(100vw - 4rem, 760px), 760px'

const LOCAL_PUBLIC_ROOT = path.join(process.cwd(), 'public')
const OPTIMIZABLE_RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const imageMetadataCache = new Map<string, { width: number; height: number } | null>()

function getToneClass(tone: VisualTone) {
  return `article-visual-tone-${tone}`
}

function normalizeImageSrc(src: string) {
  return src.split('#', 1)[0].split('?', 1)[0]
}

function isOptimizableLocalRaster(src: string) {
  if (!src.startsWith('/images/')) return false
  return OPTIMIZABLE_RASTER_EXTENSIONS.has(path.extname(normalizeImageSrc(src)).toLowerCase())
}

function parsePngDimensions(buffer: Buffer) {
  const pngSignature = '89504e470d0a1a0a'
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) return null
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function parseJpegDimensions(buffer: Buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null

  let offset = 2
  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3,
    0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb,
    0xcd, 0xce, 0xcf,
  ])

  while (offset + 3 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    let marker = buffer[offset + 1]
    offset += 2

    while (marker === 0xff && offset < buffer.length) {
      marker = buffer[offset]
      offset += 1
    }

    if (marker === 0xd8 || marker === 0xd9) continue
    if (marker === 0xda) break
    if (offset + 1 >= buffer.length) break

    const segmentLength = buffer.readUInt16BE(offset)
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break

    if (startOfFrameMarkers.has(marker)) {
      if (offset + 7 >= buffer.length) break
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }

    offset += segmentLength
  }

  return null
}

function parseWebpDimensions(buffer: Buffer) {
  if (buffer.length < 30) return null
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null

  const chunkType = buffer.toString('ascii', 12, 16)

  if (chunkType === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    }
  }

  if (chunkType === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    }
  }

  if (chunkType === 'VP8L') {
    const packed = buffer.readUInt32LE(21)
    return {
      width: (packed & 0x3fff) + 1,
      height: ((packed >> 14) & 0x3fff) + 1,
    }
  }

  return null
}

function getLocalImageMetadata(src: string) {
  if (imageMetadataCache.has(src)) return imageMetadataCache.get(src) ?? null

  const normalizedSrc = normalizeImageSrc(src)
  const localPath = path.resolve(LOCAL_PUBLIC_ROOT, normalizedSrc.replace(/^\//, ''))

  if (!localPath.startsWith(LOCAL_PUBLIC_ROOT)) {
    imageMetadataCache.set(src, null)
    return null
  }

  try {
    const buffer = fs.readFileSync(localPath)
    const ext = path.extname(normalizedSrc).toLowerCase()

    const metadata =
      ext === '.png' ? parsePngDimensions(buffer)
      : ext === '.jpg' || ext === '.jpeg' ? parseJpegDimensions(buffer)
      : ext === '.webp' ? parseWebpDimensions(buffer)
      : null

    imageMetadataCache.set(src, metadata)
    return metadata
  } catch {
    imageMetadataCache.set(src, null)
    return null
  }
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

  const srcValue = typeof src === 'string' ? src : ''
  const shouldOptimize = srcValue ? isOptimizableLocalRaster(srcValue) : false
  const metadata = shouldOptimize ? getLocalImageMetadata(srcValue) : null

  if (srcValue && metadata) {
    return (
      <span className="article-image-shell">
        <Image
          src={srcValue}
          alt={alt}
          width={metadata.width}
          height={metadata.height}
          loading={loading ?? 'lazy'}
          priority={loading === 'eager'}
          quality={85}
          sizes={ARTICLE_IMAGE_SIZES}
          className={['article-inline-image', className].filter(Boolean).join(' ')}
          style={{ width: '100%', height: 'auto' }}
          title={typeof title === 'string' ? title : undefined}
        />
        {title ? <span className="article-inline-figcaption">{title}</span> : null}
      </span>
    )
  }

  return (
    <span className="article-image-shell">
      <img
        src={srcValue}
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
