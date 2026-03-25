const POST_IMAGE_BASE = '/images/posts'

export function getPostFeaturedImagePath(slug: string) {
  return `${POST_IMAGE_BASE}/${slug}/featured.png`
}

export function getPostOgImagePath(slug: string) {
  return `${POST_IMAGE_BASE}/${slug}/og.png`
}
