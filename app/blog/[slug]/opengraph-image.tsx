import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'
import { SITE_NAME } from '@/lib/site'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'
export const runtime = 'nodejs'

type Props = { params: Promise<{ slug: string }> }

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#0f172a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>Blixamo</div>, size)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1a1a2e 45%, #6c63ff 100%)',
          color: '#f8fafc',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: '#c7d2fe',
          }}
        >
          {post.category}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', fontSize: 74, fontWeight: 800, lineHeight: 1.08 }}>
            {post.title}
          </div>
          <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.4, color: '#dbe4ff' }}>
            {post.description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', fontWeight: 700 }}>{SITE_NAME}</div>
          <div style={{ display: 'flex' }}>{post.readingTime}</div>
        </div>
      </div>
    ),
    size
  )
}
