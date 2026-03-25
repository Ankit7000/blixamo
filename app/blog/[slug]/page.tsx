import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { JsonLd, FaqJsonLd } from '@/components/seo/JsonLd'
import { PostHeader } from '@/components/blog/PostHeader'
import { PostFooter } from '@/components/blog/PostFooter'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { notFound } from 'next/navigation'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { Metadata } from 'next'
import { Callout } from '@/components/blog/Callout'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: [post.keyword, ...post.tags].filter(Boolean),
    openGraph: {
      title: post.title, description: post.description, type: 'article',
      publishedTime: post.date, modifiedTime: post.updatedAt || post.date,
      authors: [post.author],
      images: [{ url: `https://blixamo.com${post.featuredImage}`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    alternates: { canonical: post.canonical || `https://blixamo.com/blog/${slug}` },
    robots: post.noindex ? 'noindex' : 'index,follow',
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const allPosts = getAllPosts()
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const related = getRelatedPosts(post)

  const idx = allPosts.findIndex(p => p.slug === slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  // Extract FAQs only from the FAQ section (after ## Frequently Asked Questions heading)
  const faqSectionMatch = post.content.match(/##\s*Frequently Asked Questions\s*\n([\s\S]*?)(?=\n##\s|$)/)
  const faqSection = faqSectionMatch ? faqSectionMatch[1] : ''
  const faqMatches = faqSection ? [...faqSection.matchAll(/\*\*(.+?\??)\*\*\n+([^*\n][^\n]+)/g)] : []
  const faqs = faqMatches.slice(0, 8).map(m => ({ q: m[1].replace(/:$/, ''), a: m[2] }))

  return (
    <>
      <ReadingProgress />
      <JsonLd post={post} />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}
      <PostHeader post={post} />
      <div className="post-layout">
        <div />
        <div className="prose" style={{ maxWidth: '720px', padding: '1.5rem 1rem' }}>
          <MDXRemote
            source={post.content}
            components={{ Callout }}
            options={{ mdxOptions: { rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]] } }}
          />
          <EmailCapture placement="end-of-post" />
          {post.tags.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Tags:</span>
              {post.tags.map(tag => (
                <a key={tag} href={`/tag/${tag}`} style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: 'var(--surface)', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.4rem', marginBottom: '0.4rem' }}>{tag}</a>
              ))}
            </div>
          )}
        </div>
        <TableOfContents content={post.content} />
      </div>
      <PostFooter post={post} prev={prev} next={next} />
      <RelatedPosts posts={related} />
    </>
  )
}
