import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { JsonLd, FaqJsonLd } from '@/components/seo/JsonLd'
import { PostHeader } from '@/components/blog/PostHeader'
import { PostFooter } from '@/components/blog/PostFooter'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TemplateLinkBar } from '@/components/layout/TemplateLinkBar'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { notFound } from 'next/navigation'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { Callout } from '@/components/blog/Callout'
import { ArticleImage, ArticleTable, ProsCons, VerdictBox, VisualBlock } from '@/components/blog/MdxVisuals'
import Link from 'next/link'
import { getCategoryClusterContent, getResourceHubContent, RESOURCE_HUB_PATH } from '@/lib/resources'
import { getComparisonsHub, getPrimaryPillarForPost, getScopedPillarTopicArticlesForPost } from '@/lib/pillars'
import { getCategoryMeta } from '@/lib/categories'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
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
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author],
      images: [
        {
          url: `https://blixamo.com${post.featuredImage}`,
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
  const clusterContent = getCategoryClusterContent(post.category, allPosts)
  const hub = getResourceHubContent(allPosts)
  const categoryMeta = getCategoryMeta(post.category)
  const pillarPage = getPrimaryPillarForPost(post, allPosts)
  const comparisonsHub = getComparisonsHub(allPosts)
  const relatedComparisons = clusterContent.comparisons.filter((entry) => entry.slug !== post.slug).slice(0, 2)
  const freeToolLinks = clusterContent.tools.filter((entry) => entry.slug !== post.slug).slice(0, 2)
  const pillarClusterPosts = getScopedPillarTopicArticlesForPost(post, allPosts, pillarPage)
  const clusterRelatedPosts = [
    ...pillarClusterPosts,
    ...clusterContent.guides,
    ...clusterContent.comparisons,
    ...clusterContent.tools,
    ...related,
  ]
    .filter(
      (entry, index, collection) =>
        entry.slug !== post.slug && collection.findIndex((candidate) => candidate.slug === entry.slug) === index
    )
    .slice(0, 3)
  const sameCategoryPosts = allPosts
    .filter((entry) => entry.slug !== post.slug && entry.category === post.category)
    .slice(0, 3)
  const sameCategorySlugs = new Set(sameCategoryPosts.map((entry) => entry.slug))
  const samePillarPosts = pillarClusterPosts
    .filter((entry) => entry.slug !== post.slug && !sameCategorySlugs.has(entry.slug))
    .slice(0, 3)
  const popularGuides = hub.popularGuides
    .filter(
      (entry) => entry.slug !== post.slug && !sameCategorySlugs.has(entry.slug) && !samePillarPosts.some((candidate) => candidate.slug === entry.slug)
    )
    .slice(0, 3)
  const authorityPageLinks = [
    ...pillarClusterPosts,
    ...clusterContent.guides,
    ...clusterContent.comparisons,
    ...clusterContent.tools,
    ...related,
  ]
    .filter(
      (entry, index, collection) =>
        entry.slug !== post.slug && collection.findIndex((candidate) => candidate.slug === entry.slug) === index
    )
    .slice(0, 6)
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
        <PostHeader post={post} pillarPage={pillarPage} />
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1rem' }}>
          <TemplateLinkBar relatedHref={pillarPage?.href || `/category/${post.category}`} relatedLabel={pillarPage ? pillarPage.title : categoryMeta.label} />
        </div>

        <div className="post-layout article-layout-grid">
          <div />
          <article className="article-content-card">
            {pillarPage && (
              <section className="article-share-panel">
                <p className="article-share-eyebrow">Part of the guide</p>
                <h2 className="article-share-title">
                  Part of the <Link href={pillarPage.href}>{pillarPage.title}</Link> guide
                </h2>
                <p style={{ marginTop: '0.55rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  Use these crawlable links to move from this article back into the pillar, the broader site hub, and the next
                  related reads in this topic cluster.
                </p>
                <div className="article-explore-grid" style={{ marginTop: '1rem' }}>
                  <Link href="/" className="article-explore-link">
                    <span className="article-nav-label">Homepage</span>
                    <span className="article-nav-title">Return to the main Blixamo hub</span>
                  </Link>
                  <Link href={RESOURCE_HUB_PATH} className="article-explore-link">
                    <span className="article-nav-label">Resources Hub</span>
                    <span className="article-nav-title">Open the sitewide resources and pillar hub</span>
                  </Link>
                  <Link href={`/category/${post.category}`} className="article-explore-link">
                    <span className="article-nav-label">Category</span>
                    <span className="article-nav-title">Browse more in {categoryMeta.label}</span>
                  </Link>
                  <Link href={pillarPage.href} className="article-explore-link">
                    <span className="article-nav-label">Main Pillar</span>
                    <span className="article-nav-title">Open {pillarPage.title}</span>
                  </Link>
                </div>
              </section>
            )}

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
                    <span key={tag} className="article-tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          <TableOfContents content={post.content} />
        </div>

        {pillarPage && authorityPageLinks.length > 0 && (
          <section className="article-footer-shell">
            <div className="article-share-panel">
              <p className="article-share-eyebrow">Main Pillar</p>
              <h2 className="article-share-title">Use the pillar page to navigate this topic cluster</h2>
              <p style={{ marginTop: '0.55rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                This guide belongs to the {pillarPage.title.toLowerCase()} path. Start there if you want the full topic map,
                then use the linked articles below to move deeper.
              </p>
              <div className="home-hero-actions" style={{ marginTop: '1rem' }}>
                <Link href={pillarPage.href} className="home-hero-button home-hero-button-secondary">
                  Open {pillarPage.title}
                </Link>
                <Link href={`${RESOURCE_HUB_PATH}#authority-pages`} className="home-hero-button home-hero-button-secondary">
                  Browse all pillar guides
                </Link>
              </div>
              <div className="article-explore-grid" style={{ marginTop: '1rem' }}>
                {authorityPageLinks.map((entry) => (
                  <Link key={entry.slug} href={`/blog/${entry.slug}`} className="article-explore-link">
                    <span className="article-nav-label">Cluster Read</span>
                    <span className="article-nav-title">{entry.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <PostFooter
          post={post}
          prev={prev}
          next={next}
          pillarPage={pillarPage}
          comparisonsHub={comparisonsHub}
          relatedComparisons={relatedComparisons}
          freeToolLinks={freeToolLinks}
          sameCategoryPosts={sameCategoryPosts}
          samePillarPosts={samePillarPosts}
          popularGuides={popularGuides}
        />
        <RelatedPosts
          posts={clusterRelatedPosts}
          category={post.category}
          pillarHref={pillarPage?.href}
          pillarTitle={pillarPage?.title}
        />
      </div>
    </>
  )
}
