export type AuthorProfile = {
  displayName: string
  role: string
  shortBio: string
  longBio: string
  avatarSrc: string
  photoSrc: string
  aboutHref: string
  twitter?: string
  email?: string
}

export const PRIMARY_AUTHOR: AuthorProfile = {
  displayName: 'Ankit Sorathiya',
  role: 'Full-Stack Developer, Self-Hosting Operator, and Indie Builder',
  shortBio:
    'Ankit runs Blixamo and writes practical guides about self-hosting, VPS infrastructure, AI workflows, automation, and modern web development.',
  longBio:
    'Ankit Sorathiya is the primary author behind Blixamo. He builds and operates production apps with Next.js, Flutter, Node.js, AI APIs, PM2, Nginx, Docker, and low-cost VPS infrastructure, then documents the patterns, tradeoffs, and failures that actually matter.',
  avatarSrc: '/images/author-avatar.jpg',
  photoSrc: '/images/author-photo.jpg',
  aboutHref: '/about',
  twitter: 'ankit8k',
  email: 'ankitsorathiya1991@gmail.com',
}
