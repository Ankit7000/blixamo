import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search articles on Blixamo.',
  alternates: { canonical: absoluteUrl('/search') },
  robots: { index: false, follow: false },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
