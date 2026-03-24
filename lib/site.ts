const fallbackSiteUrl = 'https://blixamo.com'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/+$/, '')
export const SITE_NAME = 'Blixamo'
export const SITE_TWITTER = '@blixamo'

export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
