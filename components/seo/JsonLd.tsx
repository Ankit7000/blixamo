import type { Post } from '@/lib/posts'
import { absoluteUrl, SITE_NAME, SITE_TWITTER, SITE_URL } from '@/lib/site'

export function JsonLd({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${absoluteUrl(`/blog/${post.slug}`)}#article`,
        headline: post.title,
        description: post.description,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.updatedAt || post.date).toISOString(),
        image: {
          '@type': 'ImageObject',
          url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
          width: 1200,
          height: 630,
        },
        author: {
          '@type': 'Person',
          name: post.author,
          url: absoluteUrl('/about'),
          sameAs: [`https://twitter.com/${SITE_TWITTER.replace('@', '')}`],
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: absoluteUrl('/images/logo.svg'), width: 512, height: 512 },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${post.slug}`) },
        keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
        articleSection: post.category,
        inLanguage: 'en-US',
        wordCount: post.content.split(/\s+/).length,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: post.category, item: absoluteUrl(`/category/${post.category}`) },
          { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
        ],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Tech insights, tutorials, AI guides, and developer tools — straight to the point.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/images/logo.svg') },
      sameAs: [`https://twitter.com/${SITE_TWITTER.replace('@', '')}`],
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
