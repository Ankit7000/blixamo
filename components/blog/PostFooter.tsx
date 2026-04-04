import Link from 'next/link'
import { AuthorBio } from './AuthorBio'
import type { Post } from '@/lib/posts'

interface PostFooterProps {
  post: Post
  prev?: Post | null
  next?: Post | null
}

export function PostFooter({
  post,
  prev,
  next,
}: PostFooterProps) {
  return (
    <section className="article-footer-shell">
      <div className="article-footer-stack">
        <AuthorBio name={post.author} />

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
