import type { Post } from '@/lib/posts'

const SITE = 'https://blixamo.com'
const SITE_NAME = 'Blixamo'
const AUTHOR_TWITTER = '@blixamo'

export function JsonLd({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${SITE}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.updatedAt || post.date).toISOString(),
        image: {
          '@type': 'ImageObject',
          url: `${SITE}${post.featuredImage}`,
          width: 1200,
          height: 630,
        },
        author: {
          '@type': 'Person',
          name: post.author,
          url: `${SITE}/about`,
          sameAs: [`https://twitter.com/${AUTHOR_TWITTER.replace('@', '')}`],
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.png`, width: 512, height: 512 },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
        keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
        articleSection: post.category,
        inLanguage: 'en-US',
        wordCount: post.content.split(/\s+/).length,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: post.category, item: `${SITE}/category/${post.category}` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
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
    url: SITE,
    description: 'Tech insights, tutorials, AI guides, and developer tools — straight to the point.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
      sameAs: [`https://twitter.com/${AUTHOR_TWITTER.replace('@', '')}`],
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
