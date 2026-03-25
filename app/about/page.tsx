import type { Metadata } from 'next'
import Image from 'next/image'
import { EmailCapture } from '@/components/monetization/EmailCapture'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About — Ankit Sorathiya',
  description: 'I\'m Ankit, a full-stack developer from India. I build Flutter apps, Next.js sites, and AI integrations. Blixamo is where I document what actually works.',
  alternates: { canonical: absoluteUrl('/about') },
}

export default function AboutPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '3rem auto', padding: '0 1.25rem' }}>

      {/* Author card */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: '3px solid var(--accent)' }}>
          <Image src="/images/author-photo.svg" alt="Ankit Sorathiya" width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Ankit Sorathiya</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.4rem' }}>Full-Stack Developer &amp; Indie Builder</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="https://twitter.com/ankit8k" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>𝕏 @ankit8k</a>
            <a href="https://fiverr.com/s/m5Lzq0x" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>🛠 Fiverr</a>
            <a href="mailto:ankitsorathiya1991@gmail.com" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>✉️ Email</a>
          </div>
        </div>
      </div>

      <div className="prose">
        <p>Hey, I&apos;m Ankit — a full-stack developer based in India. I build Flutter mobile apps, Next.js web apps, and AI integrations. Blixamo is where I document what actually works.</p>
        <p>Most dev content online is written by people who haven&apos;t actually shipped the thing they&apos;re writing about. Every article here comes from real experience — things I&apos;ve personally built, broken, and fixed.</p>

        <h2>What I write about</h2>
        <ul>
          <li><strong>VPS &amp; Self-hosting</strong> — Running production apps on Hetzner from India, without breaking the bank</li>
          <li><strong>Dev Tools</strong> — The tools I actually use: n8n, Coolify, Supabase, Tailwind, Claude API</li>
          <li><strong>AI Integration</strong> — Practical guides to adding AI features to real apps</li>
          <li><strong>Indie Building</strong> — Shipping side projects solo, from idea to live</li>
        </ul>

        <h2>What I&apos;ve built</h2>
        <ul>
          <li><strong>Blixamo</strong> — This blog. Next.js 15 + MDX, self-hosted on Hetzner CPX21 (€5.19/month)</li>
          <li><strong>CricPulse</strong> — A Flutter cricket app for the India market with AI match summaries</li>
          <li><strong>AI Tools for Devs</strong> — A directory of 200+ AI tools for developers</li>
        </ul>

        <h2>Hire me</h2>
        <p>I take on freelance projects via Fiverr and Upwork — Flutter apps, Next.js sites, FastAPI backends, and AI integrations. If you need something built properly, <a href="/hire">check my services</a> or reach out directly.</p>

        <h2>Get in touch</h2>
        <p>Have a question, a project, or just want to say hi? Email me at <a href="mailto:ankitsorathiya1991@gmail.com">ankitsorathiya1991@gmail.com</a> or DM me on <a href="https://twitter.com/ankit8k" target="_blank" rel="noopener noreferrer">Twitter @ankit8k</a>.</p>
      </div>

      <EmailCapture />
    </div>
  )
}
