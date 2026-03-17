import { getAllPosts } from '@/lib/posts'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = getAllPosts().map(({ slug, title, description, category, date, readingTime }) => ({
    slug, title, description, category, date, readingTime,
  }))
  return NextResponse.json(posts)
}
