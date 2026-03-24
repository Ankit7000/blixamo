import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ClientLayoutChrome } from '@/components/layout/ClientLayoutChrome'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@/components/seo/Analytics'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { default: 'Blixamo — Tech, Tips & Trends', template: '%s | Blixamo' },
  description: 'Blixamo covers the latest in tech, tutorials, AI, and digital tools to help you stay ahead.',
  metadataBase: new URL('https://blixamo.com'),
  openGraph: { siteName: 'Blixamo', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', site: '@blixamo' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://blixamo.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayoutChrome />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
