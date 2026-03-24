'use client'

import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function Analytics() {
  useEffect(() => {
    if (GA_ID) {
      if (!document.querySelector(`script[data-ga-id="${GA_ID}"]`)) {
        const gaScript = document.createElement('script')
        gaScript.async = true
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
        gaScript.dataset.gaId = GA_ID
        document.head.appendChild(gaScript)
      }

      window.dataLayer = window.dataLayer || []
      window.gtag =
        window.gtag ||
        function gtag(...args: unknown[]) {
          window.dataLayer?.push(args)
        }

      window.gtag('js', new Date())
      window.gtag('config', GA_ID, {
        page_path: window.location.pathname,
        send_page_view: true,
      })
    }

    if (CLARITY_ID && !document.querySelector(`script[data-clarity-id="${CLARITY_ID}"]`)) {
      window.clarity =
        window.clarity ||
        function clarity(...args: unknown[]) {
          ;((window.clarity as unknown as { q?: unknown[][] }).q ||= []).push(args)
        }

      const clarityScript = document.createElement('script')
      clarityScript.async = true
      clarityScript.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
      clarityScript.dataset.clarityId = CLARITY_ID
      document.head.appendChild(clarityScript)
    }
  }, [])

  return null
}
