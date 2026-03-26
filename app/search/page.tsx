import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'
import { SearchPageClient } from '@/components/search/SearchPageClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Blixamo articles by topic, category, and keyword.',
  alternates: { canonical: absoluteUrl('/search') },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return <SearchPageClient />
}
