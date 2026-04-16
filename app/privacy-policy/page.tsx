import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how Blixamo collects, uses, and protects data, including analytics, cookies, Google AdSense advertising, and user consent information.',
  alternates: { canonical: absoluteUrl('/privacy-policy') },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy explains how Blixamo collects, uses, and protects information when you visit
          <a href="https://blixamo.com"> blixamo.com</a>.
        </p>
        <p>
          By using this website, you agree to the practices described below. If you do not agree, you should stop
          using the site.
        </p>

        <h2>Information We Collect</h2>
        <p>
          Blixamo may collect limited technical information such as your IP address, browser type, device type,
          operating system, referring page, pages visited, and approximate usage activity on the site.
        </p>
        <p>
          If you contact us directly or subscribe to updates, you may also provide personal information such as your
          email address.
        </p>

        <h2>Cookies and Similar Technologies</h2>
        <p>
          This site may use cookies, local storage, web beacons, and similar technologies to improve performance,
          remember preferences, measure traffic, and support advertising.
        </p>
        <p>
          Cookies may be set by Blixamo directly or by third-party services that help operate the site.
        </p>

        <h2>Analytics</h2>
        <p>
          Blixamo uses analytics tools such as Google Analytics and Microsoft Clarity to understand how visitors use
          the site. These services may collect information such as page views, session behavior, device information,
          approximate location, and traffic sources.
        </p>
        <p>
          Analytics data is used to improve content quality, site performance, navigation, and user experience.
        </p>

        <h2>Google AdSense Advertising</h2>
        <p>
          Blixamo may use Google AdSense to display ads. Google and its partners may use cookies and similar
          technologies to serve personalized or non-personalized ads, limit ad frequency, and measure ad performance
          based on your visit to this site and other websites.
        </p>
        <p>
          Third-party vendors, including Google, may use the DoubleClick cookie to serve ads based on a user&apos;s prior
          visits to this website or other websites on the internet.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to this
          site and other sites. You can learn more about how Google uses information here:
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            {' '}How Google uses information from sites or apps that use its services
          </a>.
        </p>

        <h2>Third-Party Vendors</h2>
        <p>
          Third-party vendors and service providers used by Blixamo may include analytics providers, email tools,
          embedded services, affiliate partners, and advertising networks. These providers may collect and process data
          according to their own privacy policies.
        </p>
        <p>
          Blixamo does not control how third-party services use data once you interact with them directly.
        </p>

        <h2>How Data Is Used</h2>
        <p>
          Data collected through this website may be used to operate the site, analyze traffic, improve content,
          respond to messages, maintain security, and support advertising and monetization.
        </p>
        <p>
          We do not sell personal information directly. However, third-party tools used on the site may process data
          for analytics, measurement, advertising, fraud prevention, or service delivery.
        </p>

        <h2>User Consent</h2>
        <p>
          Where required by law, including for users in the EEA, UK, and Switzerland, Blixamo will request consent
          before using advertising or analytics cookies that require consent. If a consent prompt appears, you can
          accept, reject, or manage your choices there.
        </p>
        <p>
          You can also manage cookies through your browser settings and, where available, through controls provided by
          third-party services.
        </p>

        <h2>Data Security</h2>
        <p>
          Reasonable steps are taken to protect this website and any information processed through it. However, no
          method of transmission or storage is completely secure, and no absolute guarantee can be made.
        </p>

        <h2>External Links</h2>
        <p>
          This site may link to external websites. Blixamo is not responsible for the privacy practices, content, or
          policies of third-party websites.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, contact:
          <a href="mailto:ankitsorathiya1991@gmail.com"> ankitsorathiya1991@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
