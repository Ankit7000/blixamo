import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Blixamo for questions, corrections, partnerships, or technical discussions by email, with response expectations and site details.',
  alternates: { canonical: absoluteUrl('/contact') },
}

export default function ContactPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div className="prose">
        <h1>Contact</h1>
        <p>
          Blixamo is a developer-focused website covering self-hosting, VPS infrastructure, automation, AI tools, web
          development, and practical technical guides.
        </p>
        <p>
          If you want to ask a question, report an issue, suggest a correction, discuss a partnership, or reach out
          about the site, email is the best way to contact us.
        </p>

        <h2>Email</h2>
        <p>
          Contact email:
          <a href="mailto:ankitsorathiya1991@gmail.com"> ankitsorathiya1991@gmail.com</a>
        </p>

        <h2>How to Reach Out</h2>
        <p>
          Please include a short subject line and enough detail for a useful reply. If your message is about a specific
          article, include the article URL and the exact issue or question.
        </p>
        <p>
          For business or collaboration requests, include your name, company or project, and the purpose of the
          inquiry.
        </p>

        <h2>Response Expectations</h2>
        <p>
          Most messages are answered within 2 to 5 business days. Response times may be longer during publishing
          periods or when workload is high.
        </p>
        <p>
          Not every unsolicited pitch, promotional request, or repeated follow-up will receive a response.
        </p>
      </div>
    </div>
  )
}
