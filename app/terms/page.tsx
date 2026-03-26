import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Review the website usage terms for Blixamo, including content ownership, external links, and limitations of liability.',
  alternates: { canonical: absoluteUrl('/terms') },
  robots: { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div className="prose">
        <h1>Terms of Use</h1>
        <p>
          By accessing and using Blixamo, you agree to these Terms of Use. If you do not agree, you should stop using
          the website.
        </p>

        <h2>Website Use</h2>
        <p>
          You may use this website for lawful personal or business reference purposes only. You must not use the site
          in a way that could damage, disable, overburden, scrape abusively, or interfere with its operation.
        </p>

        <h2>Content Ownership</h2>
        <p>
          Unless otherwise stated, all content on Blixamo, including articles, text, layout, branding, and original
          media, is owned by Blixamo or used with permission.
        </p>
        <p>
          You may quote short excerpts with proper attribution and a link back to the original page. You may not copy,
          republish, reproduce, or redistribute full articles or substantial portions of content without permission.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          Content on this website is provided for general informational and educational purposes only. It does not
          constitute legal, financial, tax, security, hosting, or professional advice.
        </p>

        <h2>External Links</h2>
        <p>
          This site may link to third-party websites and services. Those links are provided for convenience only.
          Blixamo does not control or guarantee the accuracy, availability, or policies of third-party websites.
        </p>

        <h2>No Liability</h2>
        <p>
          Blixamo provides content on an &quot;as is&quot; basis without warranties of any kind. While reasonable care is taken
          to keep information accurate and current, no guarantee is made that all content is complete, accurate, or
          suitable for your specific use case.
        </p>
        <p>
          Blixamo will not be liable for any direct, indirect, incidental, consequential, or business losses resulting
          from your use of the website, your reliance on its content, or your use of third-party products or services
          referenced on the site.
        </p>

        <h2>Changes</h2>
        <p>
          These Terms may be updated from time to time without prior notice. Continued use of the website after changes
          are posted means you accept the updated Terms.
        </p>
      </div>
    </div>
  )
}
