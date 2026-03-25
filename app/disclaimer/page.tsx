import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the Blixamo disclaimer covering general information, affiliate relationships, advertising, and content accuracy.',
  alternates: { canonical: absoluteUrl('/disclaimer') },
}

export default function DisclaimerPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div className="prose">
        <h1>Disclaimer</h1>
        <p>
          The information published on Blixamo is provided in good faith for general informational and educational
          purposes only.
        </p>

        <h2>General Information Disclaimer</h2>
        <p>
          Articles, guides, comparisons, and opinions on this site reflect personal experience, testing, research, and
          editorial judgment at the time of writing. They are not guarantees of outcomes in your environment.
        </p>

        <h2>Accuracy Disclaimer</h2>
        <p>
          Blixamo aims to keep information accurate and current, but tools, prices, features, product policies, and
          hosting environments can change. No representation or warranty is made regarding completeness, reliability, or
          accuracy.
        </p>
        <p>
          Any action you take based on content from this site is strictly at your own risk.
        </p>

        <h2>Affiliate Disclaimer</h2>
        <p>
          Some pages may include affiliate links. If you click an affiliate link and make a purchase, Blixamo may earn
          a commission at no extra cost to you.
        </p>
        <p>
          Affiliate relationships do not change the editorial goal of publishing honest and practical content. Opinions
          remain independent.
        </p>

        <h2>Advertising Disclaimer</h2>
        <p>
          Blixamo may display advertising, including Google AdSense ads and other third-party advertising. Ads are
          provided by external networks and may be personalized based on cookies, device data, or browsing activity.
        </p>
        <p>
          The presence of an ad does not mean Blixamo personally endorses the advertiser, product, or service.
        </p>

        <h2>External Links Disclaimer</h2>
        <p>
          This website may link to external sites for reference, products, tools, or services. Blixamo is not
          responsible for the content, availability, or practices of those third-party sites.
        </p>
      </div>
    </div>
  )
}
