import type { Metadata } from 'next'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { AuthorBio } from '@/components/blog/AuthorBio'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About Blixamo and Ankit Sorathiya',
  description:
    'Learn what Blixamo is, who runs it, what topics it covers, how the content is created, and how to contact or collaborate with Ankit Sorathiya.',
  alternates: { canonical: absoluteUrl('/about') },
}

export default function AboutPage() {
  return (
    <div
      className="page-container"
      style={{ maxWidth: '760px', margin: '3rem auto', padding: '0 1.25rem' }}
    >
      <AuthorBio name="Ankit Sorathiya" hero />

      <div className="prose">
        <h2>What Blixamo Is</h2>
        <p>
          Blixamo is an independent developer publication focused on practical technical work. The site
          covers self-hosting, VPS infrastructure, developer tools, automation, AI workflows, and modern
          web development with an emphasis on clear tradeoffs and real operating experience.
        </p>
        <p>
          The goal is simple: publish developer content that is useful in production, easy to verify, and
          worth trusting. That means fewer generic listicles, more tested setups, clearer failure notes,
          and direct opinions when a tool or approach is not worth the time.
        </p>

        <h2>Who Runs The Site</h2>
        <p>
          Blixamo is run by Ankit Sorathiya, the site&apos;s primary author. He is a full-stack developer and
          indie builder who works across Next.js, Flutter, TypeScript, Node.js, AI APIs, automation
          workflows, and self-hosted infrastructure.
        </p>
        <p>
          The site is intentionally built around one clear author profile rather than anonymous or generic
          bylines. Articles, the About page, and author sections across the site all point back to the same
          author identity so readers and ad reviewers can see who is responsible for the content.
        </p>

        <h2>What Topics Blixamo Covers</h2>
        <ul>
          <li>Self-hosting and low-cost VPS operations</li>
          <li>Cloud and infrastructure comparisons with real cost and performance tradeoffs</li>
          <li>Developer tools, stack choices, and software recommendations</li>
          <li>Automation with n8n, Node.js, and AI APIs</li>
          <li>Next.js, MDX, Tailwind, and modern web development patterns</li>
          <li>Indie builder workflows for shipping and operating useful products</li>
        </ul>

        <h2>Tech Stack And Areas Of Expertise</h2>
        <p>
          Blixamo itself runs on Next.js 15, MDX, TypeScript, PM2, Nginx, and VPS hosting. The content and
          technical coverage also draw from hands-on work with Flutter, Node.js, Docker, Claude API,
          OpenAI-compatible workflows, Linux server setup, monitoring, and developer productivity tooling.
        </p>
        <p>
          The strongest expertise areas on the site are self-hosting, deployment architecture, developer
          tools, AI-assisted automation, and performance-minded web development. Those are the areas where
          the site aims to be most credible and most specific.
        </p>

        <h2>How Content Is Created</h2>
        <p>
          Articles on Blixamo are based on real implementation work, not synthetic tutorials written in the
          abstract. When possible, posts are built from live deployments, real configs, measured output,
          screenshots, or direct comparisons between tools that have been used in practice.
        </p>
        <p>
          Content is written, reviewed, and updated by the primary author. The editorial standard is to be
          direct about what worked, what failed, what cost more than expected, and what should be avoided.
          That process is meant to improve both search quality and AdSense trust signals by making
          authorship, expertise, and site intent obvious.
        </p>

        <h2>The Mission</h2>
        <p>
          Blixamo exists to publish developer content that is practical, credible, and cost-aware. The site
          is especially focused on helping developers and small teams make better decisions about hosting,
          automation, tooling, and implementation without wasting time on vague advice.
        </p>
        <p>
          If a post cannot help a real developer make a better technical decision, deploy faster, or avoid a
          costly mistake, it does not meet the standard the site is aiming for.
        </p>

        <h2>Contact And Collaborate</h2>
        <p>
          For questions about the site, article feedback, consulting, collaboration, or partnerships, the
          best contact path is <a href="mailto:ankitsorathiya1991@gmail.com">ankitsorathiya1991@gmail.com</a>.
          You can also reach out through the <a href="/contact">contact page</a> or on{' '}
          <a href="https://twitter.com/ankit8k" target="_blank" rel="noopener noreferrer">
            X @ankit8k
          </a>
          .
        </p>
      </div>

      <EmailCapture />
    </div>
  )
}
