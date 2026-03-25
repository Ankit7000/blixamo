import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { JsonLd, FaqJsonLd } from '@/components/seo/JsonLd'
import { PostHeader } from '@/components/blog/PostHeader'
import { PostFooter } from '@/components/blog/PostFooter'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { getPostOgImagePath } from '@/lib/post-images'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { notFound } from 'next/navigation'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { Callout } from '@/components/blog/Callout'
import { ArticleImage, ArticleTable, ProsCons, VerdictBox, VisualBlock } from '@/components/blog/MdxVisuals'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const ogImage = `https://blixamo.com${getPostOgImagePath(post.slug)}`

  return {
    title: post.title,
    description: post.description,
    keywords: [post.keyword, ...post.tags].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
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
  const currentIndex = allPosts.findIndex((entry) => entry.slug === slug)
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const faqSectionMatch = post.content.match(/##\s*Frequently Asked Questions\s*\n([\s\S]*?)(?=\n##\s|$)/)
  const faqSection = faqSectionMatch ? faqSectionMatch[1] : ''
  const faqMatches = faqSection ? [...faqSection.matchAll(/\*\*(.+?\??)\*\*\n+([^*\n][^\n]+)/g)] : []
  const faqs = faqMatches.slice(0, 8).map((match) => ({ q: match[1].replace(/:$/, ''), a: match[2] }))

  return (
    <>
      <ReadingProgress />
      <JsonLd post={post} />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      <div className="article-page-shell">
        <PostHeader post={post} />

        <div className="post-layout article-layout-grid">
          <div />
          <article className="article-content-card">
            <div className="prose article-prose">
              <MDXRemote
                source={post.content}
                components={{
                  Callout,
                  img: ArticleImage,
                  table: ArticleTable,
                  VisualBlock,
                  ProsCons,
                  VerdictBox,
                }}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
                  },
                }}
              />
            </div>

            <div className="article-email-capture">
              <EmailCapture placement="end-of-post" />
            </div>

            {post.tags.length > 0 && (
              <section className="article-tag-section" aria-label="Article tags">
                <p className="article-tag-label">Filed under</p>
                <div className="article-tag-row">
                  {post.tags.map((tag) => (
                    <a key={tag} href={`/tag/${tag}`} className="article-tag-chip">
                      {tag}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </article>

          <TableOfContents content={post.content} />
        </div>

        <PostFooter post={post} prev={prev} next={next} />
        <RelatedPosts posts={related} category={post.category} />
      </div>
    </>
  )
}
