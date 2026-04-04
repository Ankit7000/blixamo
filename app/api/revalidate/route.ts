import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const { slug } = await req.json().catch(() => ({}))

  if (slug) {
    // Revalidate a specific post
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/')
    revalidatePath('/blog')
    return NextResponse.json({ revalidated: true, slug })
  }

  // Revalidate everything
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, slug: 'all' })
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const slug = req.nextUrl.searchParams.get('slug')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (slug) {
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/')
    revalidatePath('/blog')
    return NextResponse.json({ revalidated: true, slug })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, slug: 'all' })
}
