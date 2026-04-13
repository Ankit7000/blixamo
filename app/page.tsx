import type { Metadata } from 'next'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeStartHere } from '@/components/home/HomeStartHere'
import { HomeTopicLanes } from '@/components/home/HomeTopicLanes'
import { HomeLeadStories } from '@/components/home/HomeLeadStories'
import { HomePillarGuides } from '@/components/home/HomePillarGuides'
import { HomeCuratedPaths } from '@/components/home/HomeCuratedPaths'
import { HomeTrust } from '@/components/home/HomeTrust'
import { getIndexablePosts } from '@/lib/posts'
import { getHomepageContent } from '@/lib/homepage'

export const metadata: Metadata = {
  title: 'Blixamo | Self-Hosting, VPS, Automation and Developer Guides',
  description:
    'Practical self-hosting, VPS, automation, and developer workflow guides for people shipping real systems.',
  alternates: { canonical: 'https://blixamo.com' },
}

export default function HomePage() {
  const homepage = getHomepageContent(getIndexablePosts())

  return (
    <>
      <WebsiteJsonLd />
      <div className="home-page-root">
        <HomeHero hero={homepage.hero} />
        <HomeLeadStories section={homepage.featuredNow} />
        <HomeStartHere section={homepage.startHere} />
        <HomeTopicLanes section={homepage.topicLanes} />
        <HomePillarGuides section={homepage.pillarGuides} />
        <HomeCuratedPaths section={homepage.curatedPaths} />
        <HomeTrust section={homepage.trust} />
      </div>
    </>
  )
}
