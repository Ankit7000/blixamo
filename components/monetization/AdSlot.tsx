'use client'
import { useEffect } from 'react'

type Placement = 'in-content-1' | 'in-content-2' | 'sidebar' | 'footer'

interface AdSlotProps { placement: Placement }

const SLOT_IDS: Record<Placement, string> = {
  'in-content-1': process.env.NEXT_PUBLIC_AD_SLOT_1 || '',
  'in-content-2': process.env.NEXT_PUBLIC_AD_SLOT_2 || '',
  'sidebar': process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '',
  'footer': process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '',
}

export function AdSlot({ placement }: AdSlotProps) {
  if (process.env.NODE_ENV === 'development') return null
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null

  useEffect(() => {
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}) } catch {}
  }, [])

  return (
    <div style={{ textAlign: 'center', margin: '1.5rem 0', minHeight: '90px' }} data-ad-placement={placement}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={SLOT_IDS[placement]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
