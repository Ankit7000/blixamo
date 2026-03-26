import Link from 'next/link'
import { AuthorBio } from './AuthorBio'
import { ShareButtons } from './ShareButtons'
import type { Post } from '@/lib/posts'
import { getCategoryMeta } from '@/lib/categories'
import { PILLAR_BASE_PATH, type PillarPage } from '@/lib/pillars'
import { RESOURCE_HUB_PATH } from '@/lib/resources'

interface PostFooterProps {
  post: Post
  prev?: Post | null
  next?: Post | null
  pillarPage?: PillarPage | null
  comparisonsHub?: PillarPage | null
  relatedComparisons?: Post[]
  freeToolLinks?: Post[]
}

export function PostFooter({
  post,
  prev,
  next,
  pillarPage = null,
  comparisonsHub = null,
  relatedComparisons = [],
  freeToolLinks = [],
}: PostFooterProps) {
  const categoryMeta = getCategoryMeta(post.category)
  const comparisonLink = relatedComparisons[0]
  const freeToolLink = freeToolLinks[0]

  return (
    <section className="article-footer-shell">
      <div className="article-footer-stack">
        <AuthorBio name={post.author} />

        <div className="article-share-panel">
          <p className="article-share-eyebrow">Keep Exploring</p>
          <h2 className="article-share-title">Use the site hub to keep the topic chain going</h2>
          <div className="article-explore-grid">
            <Link href="/" className="article-explore-link">
              <span className="article-nav-label">Homepage</span>
              <span className="article-nav-title">Return to the main developer hub</span>
            </Link>
            <Link href={`${RESOURCE_HUB_PATH}#resources-start-here`} className="article-explore-link">
              <span className="article-nav-label">Start Here</span>
              <span className="article-nav-title">Open the resources hub and learning paths</span>
            </Link>
            <Link href={`/category/${post.category}`} className="article-explore-link">
              <span className="article-nav-label">Category</span>
              <span className="article-nav-title">Browse more in {categoryMeta.label}</span>
            </Link>
            <Link href={pillarPage?.href || `${RESOURCE_HUB_PATH}#authority-pages`} className="article-explore-link">
              <span className="article-nav-label">Main Pillar</span>
              <span className="article-nav-title">
                {pillarPage ? pillarPage.title : 'Open the pillar-guide layer for the strongest cluster entry points'}
              </span>
            </Link>
            <Link href={comparisonLink ? `/blog/${comparisonLink.slug}` : `${PILLAR_BASE_PATH}/comparisons-hub`} className="article-explore-link">
              <span className="article-nav-label">Related Comparison</span>
              <span className="article-nav-title">
                {comparisonLink ? comparisonLink.title : 'Browse adjacent comparison pages'}
              </span>
            </Link>
            <Link href={freeToolLink ? `/blog/${freeToolLink.slug}` : '/category/free-tools'} className="article-explore-link">
              <span className="article-nav-label">Free Tools</span>
              <span className="article-nav-title">
                {freeToolLink ? freeToolLink.title : 'Open the free tools category and budget-friendly picks'}
              </span>
            </Link>
            <Link href={comparisonsHub?.href || `${PILLAR_BASE_PATH}/comparisons-hub`} className="article-explore-link">
              <span className="article-nav-label">Comparisons Hub</span>
              <span className="article-nav-title">
                {comparisonsHub ? comparisonsHub.title : 'Open the sitewide comparison hub'}
              </span>
            </Link>
          </div>
        </div>

        <div className="article-share-panel">
          <p className="article-share-eyebrow">Share this guide</p>
          <h2 className="article-share-title">Help another developer find it faster</h2>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {(prev || next) && (
          <div className="post-nav-grid article-nav-grid">
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="article-nav-card">
                <div className="article-nav-label">Previous article</div>
                <div className="article-nav-title">{prev.title}</div>
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="article-nav-card article-nav-card-next">
                <div className="article-nav-label">Next article</div>
                <div className="article-nav-title">{next.title}</div>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
