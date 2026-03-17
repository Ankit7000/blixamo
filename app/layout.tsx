import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@/components/seo/Analytics'
import { WebVitals } from '@/components/seo/WebVitals'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

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
      <head>
        {/* Inline theme script — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})()` }} />
        <link rel="alternate" type="application/rss+xml" title="Blixamo RSS" href="/feed.xml" />
      </head>
      <body className={inter.className}>
        <WebVitals />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        {/* Microsoft Clarity — free heatmaps + session recordings */}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">{`
            (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}</Script>
        )}
      </body>
    </html>
  )
}
