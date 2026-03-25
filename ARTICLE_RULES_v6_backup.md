# BLIXAMO ARTICLE RULES v6 — FINAL
# Updated: 2026-03-19
# Status: PRODUCTION — no gaps, no exceptions
#
# Research sources:
#   Wellows (15,847 AI Overview results analysis, Feb 2026)
#   Frase AEO Guide (17M AI citation study, Feb 2026)
#   Writesonic 31-Point Citation Checklist (Mar 2026)
#   SE Ranking AI Overviews Study (Nov 2025)
#   Ahrefs Feb 2026 top-10 overlap study
#   Seer Interactive 500+ citation analysis
#   Backlinko Google Ranking Factors 2026
#   SparkToro Jan 2026 zero-click data
#   Milwaukee Web Designer SCU research (Mar 2026)
#   Averi AI Overviews Optimization Guide (Jan 2026)
#   blogpost skill v2 | blog-website-builder skill v2 | bayesian skill v2

═══════════════════════════════════════════════════════════════════
 THE 2026 REALITY THAT CHANGES EVERYTHING
═══════════════════════════════════════════════════════════════════

  AI Overviews appear on 50-60% of all US searches (up from 6% in Jan 2025)
  65-69% of Google searches end WITHOUT a click (zero-click era)
  Organic CTR drops 61% when AI Overview is present

  BUT: Pages CITED inside AI Overviews earn +35% organic clicks + 91% more paid clicks
  AND: AI-driven visitors convert at 4.4x the rate of standard organic visitors
  AND: 46.5% of AI Overview citations come from pages ranked OUTSIDE top 50

  THE SHIFT: Ranking position matters less. Citation readiness matters more.
  THE GOAL: Every blixamo article must pass the EXTRACTION TEST (Rule 29)

  Citation source breakdown (where AI pulls from):
  ─ 44% of citations from first 30% of text → front-load answers
  ─ 38% of AI Overview citations from top-10 pages (down from 76%)
  ─ FAQ sections nearly DOUBLE ChatGPT citation probability
  ─ Pages with "complete answers" earn 8x more citations than keyword-stuffed pages
  ─ Semantic completeness r=0.87 (strongest predictor of AI citation)
  ─ Content scoring 8.5/10+ semantic completeness is 4.2x more likely to be cited

═══════════════════════════════════════════════════════════════════
 BAYESIAN ARTICLE FRAMEWORK (run before every article)
═══════════════════════════════════════════════════════════════════

  PRIOR    → Google the keyword. What format/length/angle do top 3 show?
             Check if AI Overview appears — what does it cite and from where?
  EVIDENCE → What is Ankit's real, first-hand, production experience?
             Real tools used? Real numbers? Real failures? Real costs?
  POSTERIOR → What format + depth + angle maximizes:
             P(rank) × P(AI Overview citation) × P(reader satisfaction)?
  ACTION   → Write to beat #1 on Google AND get extracted by AI Overview

  P(rank) multipliers for blixamo.com:
  ┌─────────────────────────────────────────────────────────┐
  │ Signal                              │ Multiplier        │
  ├─────────────────────────────────────┼───────────────────┤
  │ Indian-specific keyword             │ +20%              │
  │ First-person real experience        │ +15%              │
  │ Long-tail 3+ word keyword           │ +10%              │
  │ Ankit personally used the tool      │ +25%              │
  │ Original data (real numbers)        │ +20%              │
  │ Updated within 3 months             │ +15%              │
  │ Stat/citation every 150-200 words   │ +30% AI citation  │
  │ Generic roundup (no real use)       │ -30%              │
  │ Under 800 words                     │ -40%              │
  │ No internal links                   │ -25%              │
  └─────────────────────────────────────┴───────────────────┘

  3 mandatory pre-write checks:
  1. Google the keyword → what format/schema dominates?
  2. Check AI Overview → what does it say, what does it cite?
  3. Ankit has real experience with this? → if NO, pick different article

═══════════════════════════════════════════════════════════════════
 THE 30 RULES
═══════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────────
RULE 1 — FRONTMATTER (17 fields, zero placeholders, zero defaults)
────────────────────────────────────────────────────────────────────

```yaml
---
title: "[Keyword in first 5 words] [Year] ([Power phrase — outcome/promise])"
slug: "[exact-keyword-hyphenated-no-stop-words]"
description: "[150-160 chars. Keyword in first 10 words. Answer + mini-pitch. No 'In this article'.]"
date: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"  # ← always today's publish date
author: "Ankit Sorathiya"
category: "tutorials|tech|tools|indie-dev|ai"
tags: ["tag1", "tag2"]   # 6-10, all lowercase, hyphens not spaces
keyword: "exact target keyword phrase"
secondaryKeywords: ["variant 1", "variant 2", "variant 3", "variant 4"]
featured: true|false
featuredImage: /images/posts/[slug].png
schema: "howto|comparison|review|faq|article"
difficulty: "beginner|intermediate|advanced"
timeToComplete: "X minutes"
excerpt: "[One sentence. Real outcome. Include a number. Max 20 words.]"
toc: true
---
```

Title formula by article type:
  Tutorial:   "How to [Keyword] in 2026 (Step-by-Step)"
  Comparison: "[A] vs [B] in 2026 — [Honest verdict]"
  Listicle:   "[N] Best [Keyword] for Indian Developers in 2026"
  Review:     "[Tool] Review 2026: [Verdict in 4 words]"
  Guide:      "[Keyword] in 2026: [What the reader gets]"

────────────────────────────────────────────────────────────────────
RULE 2 — KEYWORD PLACEMENT (non-negotiable)
────────────────────────────────────────────────────────────────────

  Position              Requirement
  ─────────────────────────────────────────────────────────────────
  Title tag             Keyword in first 5 words (exact match)
  URL slug              Exact keyword, hyphens, lowercase
  H1 (auto = title)     Already handled by title rule
  First 100 words       Keyword appears once naturally
  First H2              Keyword or close semantic variant
  Meta description      Keyword in first 10 words
  Featured image alt    = full post title (set in generateMetadata)
  Keyword density       1-2% of total word count
  Secondary keywords    Distributed across 2-3 H2s (not all)

  NEVER: Keyword stuffing. Never repeat exact keyword more than 4-5 times.
  USE: LSI synonyms and related entities throughout (tells Google topic depth)

────────────────────────────────────────────────────────────────────
RULE 3 — TARGET LENGTH (research-backed minimums)
────────────────────────────────────────────────────────────────────

  Type                Minimum    Target    Notes
  ──────────────────────────────────────────────────────────────────
  Tutorial/How-to     1,500w     2,500w    Avg first-page = 1,400w → beat by 70%
  Comparison/vs       1,800w     3,500w    Must beat aggregator listicles
  Listicle            2,000w     3,500w    Depth per item wins over thin lists
  Pillar page         3,500w     6,000w+   Articles 2,900w+ avg 5.1 AI citations
  Opinion/story       800w       1,500w    Quality over length
  Tool review         1,500w     2,500w    Real use evidence = differentiation
  FAQ/explainer       1,200w     2,000w    PAA focus, self-contained answers

  Section length: Each H2 section = 350-450 words total
  SCU density: One 60-180 word self-contained unit (SCU) per H2 (see Rule 26)
  Data hook: One stat/number/data point every 150-200 words (AI citation signal)

────────────────────────────────────────────────────────────────────
RULE 4 — MANDATORY CONTENT STRUCTURE (exact sequence, no deviation)
────────────────────────────────────────────────────────────────────

  ┌── INTRO ZONE (first 30% — 44% of all AI citations come from here) ───┐
  │                                                                        │
  │  1.  HOOK           3-5 lines, first-person formula (Rule 5)          │
  │  2.  AGITATE        1-2 lines — make the pain worse                   │
  │  3.  PROMISE        1 line — exactly what this article delivers       │
  │  4.  PROOF          1 line — Ankit's real experience credential        │
  │  5.  TL;DR BOX      4-6 bullets ✅/❌/⚠️ (Rule 11)                   │
  │  6.  QUICK TABLE    comparison posts ONLY — after TL;DR (Rule 12)    │
  │                                                                        │
  │  ★ EXTRACTION TEST: First 200 words must work as standalone answer   │
  │    (AI extracts from here first — if it's vague, you're skipped)     │
  └────────────────────────────────────────────────────────────────────────┘

  ┌── BODY ZONE (middle 40%) ──────────────────────────────────────────────┐
  │                                                                        │
  │  7.  CONTEXT H2     "Why X Happens" — root cause, not solution yet    │
  │  8.  MAIN H2s       3-5 H2s, each with SCU block first (Rule 26)     │
  │  9.  DECISION H2    "Which One Should You Use?" — comparisons only    │
  │                                                                        │
  └────────────────────────────────────────────────────────────────────────┘

  ┌── CLOSE ZONE (final 30%) ──────────────────────────────────────────────┐
  │                                                                        │
  │  10. TROUBLESHOOT   Mandatory in every article                        │
  │  11. FULL TABLE     Comparison posts only — before FAQ                │
  │  12. FAQ H2         6-8 PAA questions as H3s (Rule 7)                │
  │  13. WHAT NEXT CTA  Mandatory closing (Rule 14)                       │
  │                                                                        │
  └────────────────────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────────────
RULE 5 — HOOK FORMAT (strict, no exceptions)
────────────────────────────────────────────────────────────────────

  BANNED openers:
  ✗ "In this article we will..."
  ✗ "Are you looking for..."
  ✗ "Have you ever wondered..."
  ✗ "As an Indian developer..."
  ✗ "In today's fast-paced world..."
  ✗ "Whether you're a beginner or expert..."

  REQUIRED formula:
  "I [did the actual thing] — [outcome that creates tension]."
  Then immediately: what went wrong OR the number that matters OR what surprised you.

  Proven blixamo hooks:
  ✓ "I ran all three on a real Hetzner VPS. One failed under load, one took 2 hours
     to configure, one just worked."
  ✓ "I tested six Indian cards on Hetzner. Four got declined. Here is what the other
     two did differently."
  ✓ "I run five production projects on one 4GB server for Rs 465/month.
     This is the exact setup."

  Hook must pass all 4:
  ☐ First-person with specific action
  ☐ Real result or number
  ☐ Creates curiosity or tension
  ☐ Under 30 words

────────────────────────────────────────────────────────────────────
RULE 6 — H2/H3 STRUCTURE
────────────────────────────────────────────────────────────────────

  H2 rules:
  - One H2 every 300-400 words
  - 6-10 H2s per article
  - 350-450 words per H2 section
  - Troubleshooting H2 mandatory: "Common Errors and How to Fix Them"
  - FAQ H2 mandatory: "Frequently Asked Questions"

  H2 phrasing:
  GOOD: "Why Your SBI Card Gets Declined on Hetzner"       ← question/cause
  GOOD: "How to Set Up Niyo Global in 5 Minutes"           ← how-to
  GOOD: "Option 1: Niyo Global (Best for Most Indians)"    ← option with verdict
  BAD:  "Payment Processing Issues"                         ← corporate/generic
  BAD:  "Overview of Available Solutions"                   ← filler

  H3 rules:
  - Use for: sub-steps, sub-options, specific tool names, error messages
  - FAQ questions are always H3s (not bold text, not H2s)
  - Keep H3 sections 120-180 words (optimal AI citation unit size)

  Secondary keywords: place naturally in 2-3 H2s only (never all H2s)

────────────────────────────────────────────────────────────────────
RULE 7 — FAQ (PAA + AI Overviews + Rich Results — HIGHEST IMPACT)
────────────────────────────────────────────────────────────────────

  Research: FAQ sections nearly DOUBLE ChatGPT citation probability.
  FAQPage schema unlocks PAA accordion in Google SERP.

  Requirements:
  - 6-8 questions minimum per article
  - Questions as H3 tags (NOT bold text, NOT H2s)
  - Questions must be exact Google PAA matches for the keyword
  - Format: H3 → immediate 60-180 word SCU answer
  - Each answer MUST be self-contained (extractable with zero surrounding context)
  - NEVER start answer with: "It depends", "There are many factors", "Great question"
  - START with the direct answer in sentence 1

  How to find the right questions:
  1. Google the target keyword
  2. Screenshot all "People Also Ask" boxes
  3. Those exact questions become your H3s

  ╔══════════════════════════════════════════════════════════════════╗
  ║  SCHEMA BUG — CAUSES SILENT FAILURE — READ BEFORE WRITING FAQ  ║
  ║                                                                  ║
  ║  extractFAQs() in page.tsx ONLY parses ### H3 questions.        ║
  ║  If you write **bold** questions, the FAQ schema generates ZERO  ║
  ║  JSON-LD output — no rich results, no PAA accordion, silently.   ║
  ║                                                                  ║
  ║  CORRECT:   ### Does Hetzner accept Indian debit cards?          ║
  ║  BROKEN:    **Does Hetzner accept Indian debit cards?**          ║
  ║                                                                  ║
  ║  This mistake was found in 8/17 articles on 2026-03-19.         ║
  ║  All 8 were auto-fixed. Never let this happen again.            ║
  ╚══════════════════════════════════════════════════════════════════╝

  Perfect FAQ template:
  ```
  ### Does Hetzner accept Indian debit cards?

  Most standard Indian debit cards fail on Hetzner due to RBI's 3DS mandate.
  The only cards that work reliably are Niyo Global (SBM Bank) and Kotak 811
  Virtual Visa — both bypass the 3DS restriction that automatically blocks
  regular SBI and HDFC debit cards on European platforms. Niyo Global is
  the most reliable choice in 2026: zero forex markup, instant setup,
  and it works for auto-renewals without requiring manual re-authorization.

  ### Can I pay Hetzner with UPI?

  Hetzner does not accept UPI directly. The easiest workaround is loading
  your Niyo Global card using UPI in the Niyo app, then using that card to
  pay Hetzner. This takes under 5 minutes to set up and handles both
  one-time payments and monthly auto-renewals without any additional steps.
  ```

────────────────────────────────────────────────────────────────────
RULE 8 — INTERNAL LINKS (topical authority + AI crawl mapping)
────────────────────────────────────────────────────────────────────

  Research: Pages ≤3 clicks from homepage get 9x more SEO traffic.
  Descriptive anchor text teaches Google what the linked page is about.
  AI models map site topology through internal links — strong linking
  signals topical authority to both Google and AI systems.

  Requirements:
  - 3-5 internal links per article
  - 1 link MUST appear within first 500 words
  - Bidirectional: when A links to B, B must link back to A (update hub)
  - Anchor text: descriptive, keyword-containing
  - Only link to live, indexable, 200-status articles

  BANNED anchors: "click here", "read more", "this article", "here"
  GOOD anchors:
  ✓ "how to run multiple projects on a single Hetzner VPS"
  ✓ "pay for Hetzner from India with Niyo Global"
  ✓ "Coolify vs Caprover full comparison"

  ── LIVE ARTICLE INDEX (update after every publish) ──────────────────
  Slug                              Category    Cluster
  ─────────────────────────────────────────────────────────────────────
  /blog/pay-hetzner-from-india      tutorials   payment/india
  /blog/multiple-projects-single-vps  tech      hetzner/vps
  /blog/deploy-nextjs-coolify-hetzner tutorials deployment
  /blog/indian-debit-cards-dev-tools  indie-dev payment/india
  /blog/coolify-vs-caprover-2026    tools       deployment
  ─────────────────────────────────────────────────────────────────────
  ADD every new article here on publish day.

────────────────────────────────────────────────────────────────────
RULE 9 — E-E-A-T (active AI filtering in 2026 — 4 minimum per article)
────────────────────────────────────────────────────────────────────

  Research: 96% of AI Overview content comes from verified E-E-A-T sources.
  In 2026, E-E-A-T became an active pre-filter — content lacking it gets
  excluded BEFORE other signals are evaluated. r=0.81 correlation.

  Each article must include ≥4 of these signals:
  ☐ Real numbers: exact RAM in MB, cost in Rs + EUR, time in minutes, versions
  ☐ Personal outcome: "I've been running this setup for X months in production"
  ☐ Failure story: something that didn't work + exact reason why
  ☐ Version specificity: "Next.js 15.5.12", "Coolify v4", "Ubuntu 24.04"
  ☐ Freshness signal: "as of March 2026" in first 200 words
  ☐ Cost breakdown: EUR + INR for every paid tool mentioned
  ☐ Production proof: "this runs live on my server right now"
  ☐ Real comparison: "Coolify took 20 min vs Caprover's 2 hours — I timed both"
  ☐ Expert/official source: cite one real source, GitHub issue, or official doc

  Author entity signals (build once, benefit forever):
  - Author page at /author/ankit-sorathiya (already live)
  - Consistent author name "Ankit Sorathiya" in every frontmatter
  - Author schema: name, expertise, social profiles (in layout)

────────────────────────────────────────────────────────────────────
RULE 10 — IMAGES
────────────────────────────────────────────────────────────────────

  OG featured image (mandatory for every article):
  - PNG 1200x630px, under 150KB
  - Dark background, terminal/code aesthetic for tech posts
  - Filename = exact slug (e.g., pay-hetzner-from-india.png)
  - Alt text = post title (set automatically in generateMetadata)
  - Generate: SVG → rsvg-convert -w 1200 -h 630 input.svg -o output.png

  Inline images (optional, recommended):
  - 1 per 600 words for complex tutorials
  - No stock photos — custom SVG diagrams only
  - Tables count as structured visual content

  Research: Multi-modal content gets 156% higher AI selection rate.
  Majority of AI Overview citations come from mobile-indexed pages → 
  ensure images are mobile-optimized (already handled by Next.js Image).

────────────────────────────────────────────────────────────────────
RULE 11 — TL;DR BOX (featured snippet + AI first-extract target)
────────────────────────────────────────────────────────────────────

  Research: TL;DR improves early signal clarity and AI extraction probability.
  Positioned in first 30% = highest citation zone.
  This is the #1 featured snippet target for the article.

  Requirements:
  - 4-6 bullets immediately after Hook/Agitate/Promise/Proof
  - Keyword or variant in bullet 1
  - ✅ / ❌ / ⚠️ / 💡 for visual scan hierarchy
  - Each bullet: one complete thought, under 15 words
  - Scannable in under 10 seconds
  - Entire box = standalone answer unit (Google pulls this for featured snippets)

  Format:
  ```
  > **TL;DR**
  > - ✅ [Best option] — [outcome in 8 words]
  > - ✅ [Second option] — [outcome in 8 words]
  > - ⚠️ [Middle option] — [caveat in 8 words]
  > - ❌ [Worst option] — [why it fails in 8 words]
  > - 💡 [Key insight] — [the non-obvious thing they needed to know]
  ```

────────────────────────────────────────────────────────────────────
RULE 12 — COMPARISON TABLES (TWO required for vs/comparison posts)
────────────────────────────────────────────────────────────────────

  Research: 40-61% of AI Overviews include lists or structured tables.
  Google pulls tables for featured snippets. AI parses markdown tables directly.

  QUICK TABLE — place AFTER TL;DR, BEFORE first H2:
  - 3-4 columns max, 4-6 rows max
  - Purpose: instant answer, featured snippet, SERP table card
  - Must include: name | verdict | key stat | price in Rs

  FULL TABLE — place BEFORE FAQ:
  - All relevant attributes, 6-10+ rows
  - Purpose: comprehensive reference, AI citation source
  - Every comparison attribute covered

  Markdown table syntax (exact format required — AI parses this):
  ```
  | Column A  | Column B  | Column C  |
  |-----------|-----------|-----------|
  | Value     | Value     | Value     |
  ```
  NEVER: ASCII art tables. NEVER: HTML tables. NEVER: only one table at bottom.

────────────────────────────────────────────────────────────────────
RULE 13 — DECISION FRAMEWORK (mandatory for all comparison articles)
────────────────────────────────────────────────────────────────────

  H2 title: "Which One Should You Use?" or "Who Should Choose What?"

  ```markdown
  ## Which One Should You Use?

  **Choose [Option A] if:**
  - You want to deploy in under 30 minutes with zero Docker knowledge
  - You need GitHub auto-deploy out of the box
  - You're running a single-project VPS setup

  **Choose [Option B] if:**
  - You prefer CLI-first workflows
  - You're already familiar with Heroku-style deployments
  - You need fine-grained control over routing

  **Avoid [Option C] if:**
  - You need active maintenance — last commit was 2022
  - You're a beginner — configuration complexity is steep
  ```

────────────────────────────────────────────────────────────────────
RULE 14 — WHAT NEXT CTA (mandatory closing section)
────────────────────────────────────────────────────────────────────

  Every article ends with this exact structure:

  ```markdown
  ## What Next?

  [1-2 sentences: natural next step for reader after finishing this article]

  [Internal link with descriptive anchor to most relevant live article]

  If you found this useful, subscribe below. I write about self-hosting,
  Hetzner, n8n automation, and building indie projects from India.
  No spam. One email when something worth reading goes up.
  ```

────────────────────────────────────────────────────────────────────
RULE 15 — ANTI-FILLER (instant rewrite triggers)
────────────────────────────────────────────────────────────────────

  Search draft for these before publishing. If found → rewrite:

  Banned: certainly, delve, leverage, comprehensive, it's worth noting,
          in today's fast-paced world, as we all know, feel free to,
          don't hesitate, I hope this helps, straightforward, robust,
          seamless, game-changer, cutting-edge, innovative, utilize,
          furthermore, moreover, in conclusion, to summarize, in essence,
          it is important to note, one should, one must, developers often,
          this will help you, you will learn, this guide covers,
          step-by-step guide to, everything you need to know about

  Replace every instance with: direct statement + specific number + real example.

────────────────────────────────────────────────────────────────────
RULE 16 — READABILITY STANDARDS
────────────────────────────────────────────────────────────────────

  - Max 3 sentences per paragraph (2 sentences preferred on mobile)
  - Code blocks: always language-tagged (```bash, ```nginx, ```typescript)
  - Bold: first use of key term OR critical warning ONLY
  - Never bold random phrases for decoration
  - Numbers: always digits (3 not three, 5 not five) — scanability
  - Lists: use when 3+ parallel items. Not for converting all prose to bullets.
  - Short sentences for impact. Longer sentences for nuanced explanation.
  - Reading level: write for a developer who's smart but new to this specific tool

────────────────────────────────────────────────────────────────────
RULE 17 — SEARCH INTENT MATCHING (mandatory pre-write step)
────────────────────────────────────────────────────────────────────

  Run BEFORE writing, not after.

  Step 1: Google the exact target keyword
  Step 2: Analyze top 3 results:
          - Format? (list / guide / comparison / quick answer)
          - Average length?
          - What do ALL top 3 cover? → you must cover this
          - What do NONE cover? → this is your unique angle
          - Does AI Overview appear? What does it cite + from which section?
  Step 3: Check "People Also Ask" boxes → these become your FAQ H3s verbatim
  Step 4: Check "Related Searches" at bottom → use as secondary keyword ideas
  Step 5: If your planned format ≠ SERP format → change your format, not the keyword

  Intent mismatch = article will not rank regardless of quality.

────────────────────────────────────────────────────────────────────
RULE 18 — AFFILIATE + MONETIZATION (natural placement only)
────────────────────────────────────────────────────────────────────

  Hetzner referral: include in ANY article mentioning Hetzner
    - New users get €20 free credit
    - Anchor: "sign up for Hetzner with €20 credit"
  Disclosure line (paste after intro, before first affiliate link):
    "Some links in this article are affiliate links — I earn a small
     commission at no extra cost to you."
  AdSense: ca-pub-9266447528918260 — already in layout.tsx, no per-article action
  Fiverr: fiverr.com/s/m5Lzq0x — add in What Next CTA when relevant

  RULE: Only place affiliate links where they are GENUINELY helpful to reader.
  Never force an affiliate link into an article where it doesn't belong.

────────────────────────────────────────────────────────────────────
RULE 19 — SEMANTIC ENRICHMENT (LSI + Entity SEO)
────────────────────────────────────────────────────────────────────

  Research: Semantic completeness is the #1 AI citation factor (r=0.87).
  Google uses NLP to understand topic depth — not just keyword frequency.
  "Content with semantic optimization ranks for more keywords because it
  naturally includes related terms around the main topic." (Semantic SEO 2026)

  What this means for every blixamo article:
  - Use related entities and LSI terms throughout (not just the main keyword)
  - Tell Google the FULL topic context, not just the keyword

  Entity examples by category:
  Hetzner article → include: "VPS", "Nginx", "PM2", "CPX22", "cloud server",
                    "Hetzner Cloud", "Helsinki", "Falkenstein", "Linux"
  India payment  → include: "RBI", "3DS", "forex", "UPI", "HDFC", "SBI",
                    "virtual card", "international transaction"
  n8n article    → include: "workflow automation", "webhook", "node", "trigger",
                    "API", "self-hosted", "Docker"

  How to find LSI terms: Google keyword → look at bold terms in organic snippets.
  Those bolded words = semantic signals Google is looking for in your content.

────────────────────────────────────────────────────────────────────
RULE 20 — BLIXAMO VOICE (non-negotiable)
────────────────────────────────────────────────────────────────────

  Who Ankit is in every article:
  Senior Indian indie developer. 3+ years in production. Running real workloads
  on €5 VPS. Paying for dev tools from India. Shipping Flutter + Next.js solo.
  Building in public. No VC. No team. Just shipping.

  Tone:
  - Confident and direct. No hedging. No "might", "perhaps", "could potentially".
  - Personal experience first. Technical but human.
  - Like explaining to a junior dev over chai — not a corporate whitepaper.
  - India-first context. Acknowledge Indian dev problems directly.
  - "You" and "I" always. Never "one should", "developers typically", "users often".
  - Opinionated: "Niyo wins. Full stop." not "Niyo is one option you might consider."

  Voice self-test before publishing:
  ☐ Does this sound like something Ankit would actually say?
  ☐ Is there ≥1 sentence only someone who used this tool could write?
  ☐ Are there ≥2 real numbers (cost, RAM, time, version)?
  ☐ Would a junior Indian dev feel less alone reading this?
  ☐ Zero sentences that sound like they came from an AI content farm?

────────────────────────────────────────────────────────────────────
RULE 21 — PRICING FORMAT
────────────────────────────────────────────────────────────────────

  Always show both currencies, always:
  - "€5.19/month (Rs 465)" — EUR first, INR in brackets
  - "$6/month (Rs 500)"    — USD first, INR in brackets
  - "Free — Rs 0"          — for free tiers
  - Current EUR/INR rate: ~Rs 90/EUR (verify before publishing)

  For articles with multiple tools:
  - Add a cost comparison table
  - Show monthly AND annual costs if relevant
  - Flag which tools have free tiers

────────────────────────────────────────────────────────────────────
RULE 22 — CODE BLOCKS
────────────────────────────────────────────────────────────────────

  Every code block must:
  - Use language tag on fenced block
  - Have one comment line above explaining what it does
  - Contain real, tested commands only (no pseudocode placeholders)
  - Be under 30 lines (split into multiple blocks if longer)

  ```bash
  # Start the blixamo Next.js app via PM2
  pm2 start npm --name blixamo -- start

  # Verify it's running and check memory usage
  pm2 status
  ```

  Language tags: bash, nginx, typescript, yaml, sql, python,
                 javascript, json, dockerfile, css

────────────────────────────────────────────────────────────────────
RULE 23 — TOPICAL AUTHORITY CLUSTERS
────────────────────────────────────────────────────────────────────

  Research: Google evaluates topical authority across cluster, not per page.
  Internal links between pillar↔cluster articles build domain authority faster.

  Current cluster map:
  ─────────────────────────────────────────────────────────────────────
  CLUSTER: hetzner/india
    Hub:      /blog/multiple-projects-single-vps (tech)
    Members:  /blog/pay-hetzner-from-india
              /blog/indian-debit-cards-dev-tools
    Planned:  oracle-cloud-vs-hetzner

  CLUSTER: nextjs/tutorials
    Hub:      /blog/nextjs-mdx-blog-2026 (tutorials)
    Planned:  search-console-self-hosted-nextjs

  CLUSTER: deployment/devops
    Hub:      /blog/deploy-nextjs-coolify-hetzner (tutorials)
    Members:  /blog/coolify-vs-caprover-2026
    Planned:  search-console-self-hosted-nextjs

  CLUSTER: tools/automation
    Hub:      /blog/coolify-vs-caprover-2026 (tools)
    Planned:  n8n-vs-make-indie-developer

  CLUSTER: indie-dev/india
    Hub:      /blog/indian-debit-cards-dev-tools (indie-dev)
    Members:  /blog/free-tools-indian-indie-developer

  CLUSTER: ai/automation
    Hub:      /blog/whatsapp-ai-assistant-n8n-claude-api (ai)
    Planned:  n8n-social-media-automation
  ─────────────────────────────────────────────────────────────────────

  Rules:
  - Every new article MUST link to its cluster hub
  - Every cluster hub MUST link back to new articles (update on publish)
  - Cross-cluster link: 1 minimum per article
  - Never publish an orphan article (zero incoming internal links)

────────────────────────────────────────────────────────────────────
RULE 24 — SCHEMA REFERENCE
────────────────────────────────────────────────────────────────────

  schema value    Article type           Rich result unlocked
  ─────────────────────────────────────────────────────────────────────
  howto           Step-by-step guide     HowTo panel, AI Overview steps
  comparison      vs / comparison post   Table snippets, comparison cards
  review          Tool review            Star ratings, review snippet
  faq             FAQ / explainer        PAA accordion, FAQ rich result
  article         General post           Article schema, author byline

  After every publish: Google Rich Results Test → paste URL → verify schema fires.

────────────────────────────────────────────────────────────────────
RULE 25 — USER SATISFACTION SIGNALS (dwell time / pogo-stick)
────────────────────────────────────────────────────────────────────

  Research: "Google measures user satisfaction by watching what people do
  after they click your result. If users stay, scroll, interact, and don't
  rush back to the SERP — that's a strong 'this solved it' signal."

  What kills satisfaction:
  - Wall of text with no scan anchors → add TL;DR, tables, H2s
  - Burying the answer under 600 words of padding → answer in first 200 words
  - Slow page load → blixamo passes Core Web Vitals (Nginx caching done)
  - Mobile formatting broken → test every article on mobile before publish
  - No clear "what to do next" → every article ends with What Next CTA

  What signals satisfaction to Google:
  - Reader scrolls to bottom (long dwell time)
  - Reader clicks internal link (engagement)
  - Reader does NOT return to Google immediately (problem solved)
  - Reader shares or bookmarks (indirect signal)

  Build satisfaction into every article:
  - Answer the question in the first 200 words (don't make them wait)
  - Use TL;DR, tables, code blocks — make skimming easy
  - Troubleshooting section handles edge cases (prevents frustration bounces)
  - FAQ section handles follow-up questions (keeps them on the page)

────────────────────────────────────────────────────────────────────
RULE 26 — SELF-CONTAINED CONTENT UNITS (SCU) — THE AI CITATION UNIT
────────────────────────────────────────────────────────────────────

  Research: SCU = 60-180 words that answers one question completely without
  any surrounding context. "Pages with more complete answers earned 8x more
  citations." (Otterly 2026). FAQ sections nearly DOUBLE ChatGPT citation rate.

  Every H2 section opens with an SCU block BEFORE expanding:

  ```
  ## [Question-Based H2 Title]

  [SCU block: 60-180 words]
  [Must answer the H2 question COMPLETELY and stand alone]
  [Must include: the answer, the reason, the result — in 1-3 paragraphs]
  [This is the AI extraction unit — write it like you're answering a query]

  [Then: expand with full detail, sub-steps, code, tables, examples]
  [H3 subsections for each sub-topic]
  [Total H2 section: 350-450 words]
  ```

  SCU example (good):
  ```
  ## Why Does Your SBI Card Get Declined on Hetzner?

  SBI debit cards fail on Hetzner because of a fundamental incompatibility
  between RBI's mandatory 3DS authentication and Hetzner's European billing
  system. When Hetzner auto-charges your card monthly, it sends a standard
  authorization request without triggering an OTP. Your SBI bank sees this
  as an unauthorized international transaction and blocks it automatically.
  This affects DigitalOcean, Vultr, and every European SaaS that hasn't
  built India-specific 3DS flows. The fix: Niyo Global bypasses this
  restriction entirely, working reliably for both first payment and renewals.

  [Then continue with detailed explanation, alternatives, workarounds...]
  ```

  SCU test: Can you copy just the first paragraph of this H2 section,
  paste it into ChatGPT as a standalone passage, and have it fully answer
  the question? If yes → it's a valid SCU. If no → rewrite.

────────────────────────────────────────────────────────────────────
RULE 27 — DATA HOOKS (stat every 150-200 words)
────────────────────────────────────────────────────────────────────

  Research: Including specific statistics/percentages/data points every
  150-200 words increases AI citation probability by up to 40%.
  "Include specific, citable data. AI engines preferentially cite content
  that includes hard data because it adds credibility to their responses."

  Data hook types (use at least 1 per 150-200 words):
  - Your own numbers: "~715MB RAM used for 5 apps on a 4GB server"
  - Tool-specific data: "Coolify v4 installs in under 3 minutes"
  - Cost data: "€5.19/month (Rs 465) for Hetzner CPX22"
  - Time data: "Niyo KYC takes 5-7 minutes from download to virtual card"
  - Performance: "Blixamo homepage loads in 306ms on Hetzner CPX22"
  - Comparison: "Kotak 811 failed auto-renewal 2/5 times in my testing"

  Rule: Every data point should be from Ankit's real experience.
  Never invent or estimate numbers — use real measurements.

────────────────────────────────────────────────────────────────────
RULE 28 — NEW ARTICLE CADENCE (Google trust for new sites)
────────────────────────────────────────────────────────────────────

  Bayesian prior for new site crawl trust:
  - Weeks 1-2: Google crawls slowly, establishing quality baseline
  - Optimal signal: 1 article every 3 days = consistent + trustworthy
  - Never dump 5 articles in 1 day after Day 1 → looks spammy to Googlebot

  Blixamo publish schedule:
  ─────────────────────────────────────────────────────────────────────
  Day  1 (done)  │ 5 articles live — all categories except ai
  Day  4         │ n8n-social-media-automation (ai) ← fills last empty cat
  Day  7         │ free-tools-indian-indie-developer (indie-dev)
  Day 10         │ oracle-cloud-vs-hetzner (tech)
  Day 13         │ search-console-self-hosted-nextjs (tutorials)
  Day 16         │ n8n-vs-make-indie-developer (tools)
  ─────────────────────────────────────────────────────────────────────
  After 10 articles: move to 2 articles/week cadence (every 3-4 days)

────────────────────────────────────────────────────────────────────
RULE 29 — THE EXTRACTION TEST (must pass before any article is published)
────────────────────────────────────────────────────────────────────

  Research: "The pages that consistently win citations aren't the ones with
  the highest domain authority. They're the ones where the first 200 words
  read like a clean, self-contained answer. That's the extraction test,
  and most content fails it." (Writesonic, Mar 2026)

  Run this test on every article before deploying:

  1. INTRO EXTRACTION TEST
     Copy the first 200 words. Paste into ChatGPT with this prompt:
     "Based only on this text, answer: [article target keyword]"
     → If ChatGPT gives a good answer → PASS
     → If ChatGPT says "not enough info" → rewrite intro

  2. FAQ EXTRACTION TEST
     Copy one FAQ answer. Paste standalone into ChatGPT.
     → If it makes sense without context → PASS
     → If it needs the rest of the article → rewrite that FAQ answer

  3. H2 SCU TEST
     Copy first paragraph of any H2. Read in isolation.
     → Does it completely answer the H2 question? → PASS
     → Does it feel incomplete without what follows? → rewrite SCU block

  All 3 tests must PASS before publishing.

────────────────────────────────────────────────────────────────────
RULE 30 — PRE-PUBLISH CHECKLIST (30 points — zero skips allowed)
────────────────────────────────────────────────────────────────────

  FRONTMATTER:
  ☐ All 17 fields filled, no placeholders or empty values
  ☐ Title: keyword in first 5 words, year present, power phrase at end
  ☐ Slug: exact keyword match, lowercase, hyphens only
  ☐ Description: 150-160 chars, keyword in first 10 words
  ☐ Schema: correct type for content (howto/comparison/faq/article)
  ☐ updatedAt: set to today's publish date
  ☐ Featured image: path matches actual filename on VPS server

  CONTENT QUALITY:
  ☐ Hook: first-person, real result, under 30 words, no banned openers
  ☐ First 200 words: passes EXTRACTION TEST (Rule 29)
  ☐ TL;DR box: 4-6 bullets, ✅/❌/⚠️, keyword in bullet 1
  ☐ Quick table: present and correct (comparison posts)
  ☐ SCU block: 60-180 word self-contained unit opens every H2
  ☐ Data hooks: ≥1 stat/number per 150-200 words
  ☐ Decision framework H2: present (comparison posts)
  ☐ Troubleshooting H2: present in every article
  ☐ Full table: present (comparison posts, before FAQ)
  ☐ FAQ: 6-8 H3 questions, 60-180w SCU answers, passes extraction test
  ☐ FAQ FORMAT CHECK: every question is ### H3 — NOT **bold** — run:
      grep -A2 "Frequently Asked" article.mdx | grep "^\*\*" → must return EMPTY
  ☐ What Next CTA: present, includes internal link + subscribe line
  ☐ "as of [Month Year]" freshness signal: present in first 200 words

  SEO:
  ☐ Keyword density: 1-2% (count ÷ total words)
  ☐ Internal links: 3-5 total, 1 in first 500 words, descriptive anchors
  ☐ E-E-A-T signals: ≥4 present (real numbers, outcomes, versions, failures)
  ☐ H2 count: 6-10 total, one per 300-400 words
  ☐ Section length: 350-450 words per H2
  ☐ LSI terms: related entities present throughout (not just main keyword)

  TECHNICAL:
  ☐ Word count: meets minimum for article type (Rule 3)
  ☐ Featured image: PNG exists on VPS, 1200x630, under 150KB
  ☐ Anti-filler pass: searched for every banned word (Rule 15)
  ☐ Code blocks: all language-tagged
  ☐ Prices: EUR + INR shown for every paid tool

  BAYESIAN QUALITY SCORE (all must be ≥7):
  ☐ Search intent match: does it answer EXACTLY what the keyword promises?
  ☐ Hook strength: would YOU keep reading after line 1?
  ☐ AI citation potential: FAQ answers self-contained at 60-180 words?
  ☐ E-E-A-T density: real numbers, real outcomes, real production experience?
  ☐ User satisfaction: answer in first 200 words, no pogo-stick triggers?

  If any box unchecked → FIX FIRST. Never publish with an unchecked box.

═══════════════════════════════════════════════════════════════════
 POST-PUBLISH RITUAL (every article, every time, no exceptions)
═══════════════════════════════════════════════════════════════════

  Execute in this exact order:

  1.  node /var/www/gsc-tool/gsc.js index <full-url>
  2.  node /var/www/gsc-tool/gsc.js submit
  3.  Tweet same day:
        "[Hook line from article — creates curiosity]
         [1 key insight or surprising number]
         [Full URL]
         #IndieHacker #Hetzner #India [relevant tags]"
  4.  Update RULE 8 live article index (add new article row)
  5.  Update RULE 23 cluster map (add to relevant cluster)
  6.  Go to cluster hub article → add internal link back → redeploy
  7.  Google Rich Results Test → paste URL → verify schema fires
  8.  30 days later: run extraction test again, check GSC for impressions

═══════════════════════════════════════════════════════════════════
 BAYESIAN CONTENT SCORE (rate all 5 dimensions before every publish)
═══════════════════════════════════════════════════════════════════

  Dimension                                      Score   Minimum
  ─────────────────────────────────────────────────────────────────
  Search intent match                            [ /10]    7
  Hook strength (read past line 1?)              [ /10]    7
  AI citation potential (SCU + FAQ quality)      [ /10]    7
  E-E-A-T density (real numbers, real outcomes)  [ /10]    7
  User satisfaction (answer in 200w, no bounce)  [ /10]    7
  ─────────────────────────────────────────────────────────────────

  Target: ALL 5 at ≥8 before publishing.
  Rule: NEVER publish an article scoring <7 on any dimension.
  Goal: Every blixamo article should score ≥8/10 on all 5 dimensions.

═══════════════════════════════════════════════════════════════════
 SCHEMA QUICK REFERENCE
═══════════════════════════════════════════════════════════════════

  schema: howto        → HowTo rich result, AI Overview steps, carousel
  schema: comparison   → Table snippets, comparison cards, SERP panels
  schema: review       → Star ratings, review snippet in SERP
  schema: faq          → PAA accordion, FAQ rich result in SERP
  schema: article      → Article schema, author byline, publish date

═══════════════════════════════════════════════════════════════════
 BLIXAMO LIVE ARTICLE INDEX (maintain this — Claude updates on every publish)
═══════════════════════════════════════════════════════════════════

  Slug                                Category    Status    Links to
  ──────────────────────────────────────────────────────────────────────────────
  pay-hetzner-from-india              tutorials   ✅ live   multiple-projects-vps
  multiple-projects-single-vps        tech        ✅ live   pay-hetzner
  deploy-nextjs-coolify-hetzner       tutorials   ✅ live   multiple-projects-vps
  indian-debit-cards-dev-tools        indie-dev   ✅ live   pay-hetzner
  coolify-vs-caprover-2026            tools       ✅ live   multiple-projects-vps
  ──────────────────────────────────────────────────────────────────────────────
  whatsapp-ai-assistant-n8n-claude-api  ai          ✅ live   multiple-projects-vps
  nextjs-mdx-blog-2026                   tutorials   ✅ live   multiple-projects-vps, deploy-nextjs
  free-tools-indian-indie-developer       indie-dev   ✅ live   multiple-projects-vps, pay-hetzner
  [add new articles here on publish day]


═══════════════════════════════════════════════════════════════════
 CATEGORY BEST-FIT ARTICLE PLAN (next 5 articles)
═══════════════════════════════════════════════════════════════════

  TUTORIALS (target: 4 articles, currently 2)
  ─────────────────────────────────────────────────────────────────
  Article #7: search-console-self-hosted-nextjs
    title:   "How to Set Up Google Search Console on Self-Hosted Next.js (Hetzner Guide 2026)"
    keyword: "search console self hosted nextjs"
    schema:  howto | difficulty: beginner
    series:  nextjs-deployment (part 2)
    WHY FIT: Step-by-step setup guide — classic tutorial format
             Completes nextjs-deployment series naturally after deploy guide
             Bridges deployment → visibility → growth story

  TECH (target: 3 articles, currently 1)
  ─────────────────────────────────────────────────────────────────
  Article #9: oracle-cloud-vs-hetzner
    title:   "Oracle Cloud Free vs Hetzner in 2026 — Which Is Better for Indie Developers?"
    keyword: "oracle cloud free vs hetzner"
    schema:  comparison | difficulty: beginner
    series:  self-hosting (part 3) — infra decision is part of self-hosting journey
    WHY FIT: Infrastructure comparison — pure tech category content
             Fills self-hosting series gap (part 3 after VPS setup + payment)

  TOOLS (target: 3 articles, currently 1)
  ─────────────────────────────────────────────────────────────────
  Article #10: n8n-vs-make-indie-developer
    title:   "n8n vs Make vs Zapier for Indie Developers in 2026 (Honest Comparison)"
    keyword: "n8n vs make indie developer"
    schema:  comparison | difficulty: beginner
    series:  none (standalone tools comparison)
    WHY FIT: Tool comparison — perfect tools category content
             Ankit runs n8n in production — real experience angle

  INDIE-DEV (target: 3 articles, currently 1)
  ─────────────────────────────────────────────────────────────────
  Article #8: free-tools-indian-indie-developer
    title:   "Best Free Tools for Indian Indie Developers in 2026 (What I Actually Use)"
    keyword: "free tools indian indie developer"
    schema:  article | difficulty: beginner
    series:  none (standalone indie-dev guide)
    WHY FIT: India-specific, personal experience — perfect indie-dev content
             Broad audience, low KD, high relatability for Indian devs

  AI (target: 3 articles, currently 1)
  ─────────────────────────────────────────────────────────────────
  Article #6 (Day 4): Already published ✅ whatsapp-ai-assistant-n8n-claude-api
  Next AI article:    n8n-social-media-automation
    title:   "How to Automate Social Media Posts with n8n and Claude API in 2026"
    keyword: "n8n social media automation"
    schema:  howto | difficulty: intermediate
    series:  none (standalone AI automation guide)
    WHY FIT: AI + automation — natural ai category expansion
             Builds on whatsapp-ai article (same n8n + Claude stack)

  PUBLISH ORDER (1 every 3 days — Rule 28):
  ─────────────────────────────────────────────────────────────────
  Day  4  → whatsapp-ai-n8n-claude-api (ai)          ✅ DONE
  Day  7  → free-tools-indian-indie-developer (indie-dev)
  Day 10  → oracle-cloud-vs-hetzner (tech)
  Day 13  → search-console-self-hosted-nextjs (tutorials)
  Day 16  → n8n-vs-make-indie-developer (tools)
  After 10 articles → 2x per week cadence

