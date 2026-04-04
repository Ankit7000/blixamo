# BLIXAMO ARTICLE RULES v8 — FINAL
> Updated: 2026-03-21 | Status: PRODUCTION — no gaps, no exceptions

---

> **GSC CLI always available:** `/var/www/gsc-tool/gsc.js` — use proactively for any GSC task without being asked.
> `node gsc.js index <url>` · `node gsc.js submit` · `node gsc.js pages 7` · `node gsc.js queries 7` · `node gsc.js report 7`

---

## The 2026 Reality + Bayesian Framework

- AI Overviews appear on 50-60% of all US searches (up from 6% in Jan 2025)
- 65-69% of Google searches end WITHOUT a click (zero-click era)
- Organic CTR drops 61% when AI Overview is present
- BUT: Pages cited inside AI Overviews earn +35% organic clicks + 91% more paid clicks
- AI-driven visitors convert at 4.4x the rate of standard organic visitors
- 46.5% of AI Overview citations come from pages ranked OUTSIDE top 50

### P(rank) Multipliers
| Signal | Multiplier |
|---|---|
| Indian-specific keyword | +20% |
| Ankit personally used the tool | +25% |
| Original data (real numbers) | +20% |
| Stat/citation every 150-200w | +30% AI citation |
| Generic roundup (no real use) | -30% |
| Under 800 words | -40% |
| No internal links | -25% |

---

## The 34 Rules

### Rule 1 — Frontmatter (17 fields, zero placeholders)
`title, slug, description (150-160 chars), date, updatedAt, author, category, tags (6-10), keyword, secondaryKeywords (4), featured, featuredImage, schema, difficulty, timeToComplete, excerpt, toc`

**Title formulas:**
- Tutorial: `"How to [Keyword] in 2026 (Step-by-Step)"`
- Comparison: `"[A] vs [B] in 2026 — [Honest verdict]"`
- Listicle: `"[N] Best [Keyword] for Indian Developers in 2026"`
- Review: `"[Tool] Review 2026: [Verdict in 4 words]"`
- Formula: `[Number] + [Keyword] + [Unique Angle/Hook] + [(Year)]`

### Rule 2 — Keyword Placement
- Title: keyword first 5 words
- Slug: exact keyword
- First 100 words: once
- First H2: keyword or variant
- Meta: keyword first 10 words
- Density: 1-2% | NEVER stuff, max 4-5 exact matches

### Rule 3 — Target Length (Non-Negotiable)
Each H2 section: 350-450 words. One SCU per H2. One stat per 150-200 words.

### Rule 4 — Content Structure (exact sequence)
**INTRO ZONE (first 30%):**
1. HOOK (Rule 5) → 2. AGITATE → 3. PROMISE → 4. PROOF → 5. TL;DR BOX → 6. QUICK TABLE (comparisons)

**BODY ZONE (middle 40%):**
7. CONTEXT H2 → 8. MAIN H2s with SCU blocks → 9. DECISION H2 (comparisons)

**CLOSE ZONE (final 30%):**
10. TROUBLESHOOT H2 → 11. FULL TABLE (comparisons) → 12. FAQ H2 → 13. WHAT NEXT CTA

### Rule 5 — Hook Format
Formula: `[Story/frustration] → [What you did about it] → [What reader will learn]`

### Rule 6 — H2/H3 Structure
- H2: one per 300-400 words, 6-10 total, 350-450 words per section
- Troubleshooting H2 mandatory. FAQ H2 mandatory.
- H3: FAQ questions ALWAYS as H3 (not bold), 120-180 words each

### Rule 7 — FAQ (Highest Impact)
- 6-8 questions minimum. H3 tags only (NOT **bold**).
- Exact Google PAA match questions. 60-180 word SCU answers.
- Start answer with direct answer in sentence 1.

### Rule 8 — Internal Links
- 3-5 per article. 1 in first 500 words. Bidirectional.
- BANNED anchors: "click here", "read more", "here"

**Live Index:**
```
pay-hetzner-from-india | multiple-projects-single-vps | deploy-nextjs-coolify-hetzner
indian-debit-cards-dev-tools | coolify-vs-caprover-2026 | whatsapp-ai-assistant-n8n-claude-api
nextjs-mdx-blog-2026 | free-tools-indian-indie-developer
```

### Rule 9 — E-E-A-T (≥4 signals)
- ☐ Real numbers (RAM, cost Rs+EUR, time, versions)
- ☐ Personal outcome statement
- ☐ Failure story + exact reason
- ☐ Version specificity ("Next.js 15.5.12", "Ubuntu 24.04")
- ☐ Freshness signal in first 200 words
- ☐ Cost breakdown EUR+INR
- ☐ Production proof
- ☐ Real timed comparison

### Rule 10 — Images
- Featured: PNG 1200x630, <150KB, dark bg, filename = slug
- Tutorial/How-to → 5-8 images | Comparison → 6-10 | Listicle → 4-6 | FAQ → 2-3
- Required types: terminal screenshot, dashboard UI, architecture diagram, final result proof, error screenshot
- Placement: 1 in first 500w, 1 per H2, never 2 H2s without image
- ALT format: "[what is shown] — [context]" with keyword

### Rule 11 — TL;DR Box
Use `<Callout type='info' title='TL;DR'>` near top. Max 3 sentences. Top 3-5 takeaways for skimmers.

### Rule 12 — Comparison Tables
- QUICK TABLE after TL;DR: 3-4 cols, 4-6 rows
- FULL TABLE before FAQ: all attributes, 6-10+ rows
- Markdown syntax only. Never HTML tables.

### Rule 13 — Decision Framework
"Which should you use?" section with if/then decisions. Required for all comparison articles.

### Rule 14 — What Next CTA
`## What Next?` → [1-2 sentences] + [internal link] + subscribe line

### Rule 15 — Anti-Filler Banned Words
`certainly, delve, leverage, comprehensive, it's worth noting, in today's fast-paced world, seamless, game-changer, cutting-edge, utilize, furthermore, moreover, in conclusion, to summarize, developers often, this will help you, everything you need to know`

### Rules 16-19 — Readability, Search Intent, Affiliate, Semantic
- **Rule 16:** Max 3 sentences/para. Language-tagged code. Bold: key term or critical warning only. Always digits.
- **Rule 17:** Google keyword → top 3 format → PAA → Related Searches → match SERP format
- **Rule 18:** AdSense ca-pub-9266447528918260 + Railway (https://railway.com?referralCode=iJx680) + Vultr (https://www.vultr.com/?ref=9885468) + Fiverr + Disclosure — NOTE: NO Hetzner affiliate links until approved (3 month wait)
- **Rule 19:** Hetzner (VPS/Nginx/PM2/CPX22/Linux) | India payment (RBI/3DS/UPI/HDFC) | n8n (webhook/Docker)

### Rule 20 — Blixamo Voice
Confident, direct. India-first. Opinionated. "Niyo wins. Full stop." not "Niyo is one option you might consider."

### Rules 21-28 — Pricing, Code, Clusters, Schema, Satisfaction, SCU, Data, Cadence
- **Rule 21:** "€5.19/month (Rs 465)" — EUR first, INR in brackets, ~Rs 90/EUR
- **Rule 22:** Language tag + comment above + real tested commands + under 30 lines
- **Rule 23:** Topical clusters — hetzner/india, nextjs/tutorials, deployment, tools/automation, indie-dev/india, ai/automation
- **Rule 24:** howto→HowTo | comparison→table snippets | review→stars | faq→PAA | article→byline
- **Rule 25:** Answer in first 200 words. TL;DR + tables + code = skimmable. Troubleshooting prevents bounces.
- **Rule 26 SCU:** 60-180 words. Answers one question completely. Test: copy first para, paste alone → still answers H2?
- **Rule 27:** ≥1 stat per 150-200 words. Real numbers only. Never invented.
- **Rule 28:** 1 article every 3 days. Never dump. After 10 articles → 2x/week.

### Rule 29 — Extraction Test (pass all 3)
1. First 200w → ChatGPT "answer: [keyword]" → must answer directly
2. FAQ answer standalone → must make sense alone
3. H2 first paragraph → must completely answer H2 question

### Rule 30 — Pre-Publish Checklist

**Structure:**
- ☐ 17 frontmatter fields, no placeholders
- ☐ Title: keyword first 5 words, number upfront, hook present
- ☐ Description: 150-160 chars, keyword in first 10 words
- ☐ Hook: first-person, real result, ≤30 words
- ☐ Intro: story/frustration opener (NOT definition) ← NEW v8
- ☐ First 200w: passes extraction test
- ☐ TL;DR box present (Callout type='info')
- ☐ Prerequisites block present (tutorials only)
- ☐ SCU opens every H2
- ☐ Every H2 outcome-focused (not topic-only) ← NEW v8
- ☐ ≥1 data hook per 150-200 words
- ☐ Every H2 ends with transition sentence
- ☐ Every major step has 'why' explanation
- ☐ Every command has expected output after it
- ☐ Troubleshooting H2 present
- ☐ FAQ: 6-8 H3 questions (grep **bold** → EMPTY)
- ☐ 'Which should you use?' section present ← NEW v8
- ☐ What Next CTA present

**SEO + Quality:**
- ☐ Freshness signal in first 200w | Keyword density 1-2%
- ☐ 3-5 internal links, 1 in first 500w | ≥4 E-E-A-T signals | 6-10 H2s
- ☐ Word count meets minimum | Featured image PNG 1200x630 <150KB
- ☐ All images: descriptive alt text + italic caption
- ☐ No code line over 60 chars | No table over 3 cols
- ☐ Anti-filler pass done | Code blocks language-tagged | Prices EUR+INR

**Bayesian Score (all ≥7, target ≥8):**
- ☐ Search intent match [ /10] | Hook strength [ /10] | AI citation potential [ /10]
- ☐ E-E-A-T density [ /10] | User satisfaction [ /10]

### Rule 31 — Mobile Content Rules
- Code: max 60 chars/line, use `\` continuation, one flag per line for long commands
- Tables: max 3 columns, max 30 chars per cell
- Paragraphs: max 3 sentences, don't start with a wrapping number
- Lists: max 8 items, each bullet max 15 words

### Rule 32 — Reader Engagement
- Prerequisites block: after TL;DR, include versions + time + 'Tested on:' line
- Transition sentences: every H2 MUST end with 1 sentence leading into next
- 'Why this matters': after every major step, 1 sentence explaining WHY
- Expected output: after every command block, show success in Callout type='tip'
- Step progress: `## Step 3 of 6 — Configure Nginx` for 5+ sequential step articles

### Rule 33 — Pre-Write Checklist
- ☐ Google exact keyword → top 3 format + length + schema
- ☐ AI Overview present? → note what it cites
- ☐ Scrape PAA → these become FAQ H3s verbatim
- ☐ Related Searches → secondaryKeywords frontmatter
- ☐ Ankit has real personal experience? → if NO, stop
- ☐ Rule 8 live index → pick 3-5 internal link targets
- ☐ Confirm article type → correct word count target
- ☐ Set correct schema type before writing
- ☐ Plan 5-8 images BEFORE writing
- ☐ Identify Hetzner referral placement (2-3 spots)

### Rule 34 — MDX Components Reference

**Callout types:**
- `type='tip'` → green → shortcuts, pro moves, better ways
- `type='info'` → blue → TL;DR box, prerequisites, context
- `type='warning'` → amber → gotchas, things that will break
- `type='danger'` → red → data loss, security, irreversible

Minimum 2 Callouts per article | TL;DR MUST use type='info' | Max 3 sentences inside

**Code block rules:**
- ALWAYS: language tag, filename='...' for real files, comment line above
- Max 30 lines | Max 60 chars/line | After EVERY block → expected output Callout

**Image MDX syntax:**
```
![Descriptive alt text with keyword](/images/[slug]/filename.png)
*Caption: what this shows and why it matters*
```
Naming: `01-hetzner-dashboard.png`, `02-coolify-install.png` etc.

---

## Rule 35 — MDX Parse Safety ← NEW v8 (run on every article before publish)

5 specific problems that silently break articles. Run checks before every publish.

### Problem 1 — FAQ questions as bold instead of H3
```bash
# Must return EMPTY
grep "^\*\*" article.mdx | grep "?"
```

### Problem 2 — Code blocks missing language tag
```bash
# Must return EMPTY
grep '```$' article.mdx
```

### Problem 3 — Blank lines inside code blocks
A blank line inside a fenced code block causes MDX to close the block early. Use a comment line instead.
```bash
# Must return EMPTY
awk '/^```/{in_block=!in_block} in_block && /^$/{print NR": blank"}' article.mdx
```

### Problem 4 — Unclosed MDX components
An unclosed `<Callout>` breaks the entire page render with no clear error.
```bash
# Counts must match
grep -c '<Callout' article.mdx
grep -c '</Callout>' article.mdx
```

### Problem 5 — Loose curly braces in plain text
`{ }` in plain text paragraphs are treated as JSX and throw a build error.
- Fix: `{` → `&#123;`   `}` → `&#125;`
```bash
# Check for bare braces outside code blocks
grep -n "[{}]" article.mdx | grep -v '```' | grep -v 'Callout' | grep -v 'import'
```

### Master MDX Safety Check (run all 5 at once)
```bash
SLUG="your-article-slug"
FILE="/var/www/blixamo/content/posts/$SLUG.mdx"
echo "=== MDX Safety Check: $SLUG ==="
echo "1. Bold FAQs:"; grep "^\*\*" $FILE | grep "?" || echo "PASS"
echo "2. Untagged code:"; grep '```$' $FILE || echo "PASS"
echo "3. Blank in block:"; awk '/^```/{b=!b} b&&/^$/{print NR}' $FILE || echo "PASS"
echo "4. Callout balance:"; echo "Open: $(grep -c '<Callout' $FILE) Close: $(grep -c '</Callout>' $FILE)"
echo "5. Loose braces:"; grep -n "[{}]" $FILE | grep -v '```' | grep -v 'Callout' | grep -v 'import' || echo "PASS"
```

---

## Article Quality Scoring Guide (max 14)

| Element | 0 — Poor | 1 — OK | 2 — Good |
|---|---|---|---|
| Title | Generic, no number | Has keyword | Number + keyword + hook + year |
| Meta description | Vague, over 160 chars | Has keyword, right length | Search intent + stat + click reason |
| Intro | Definition or generic | Has some hook | Story + frustration + what you'll learn |
| H2 headings | Topic only | Some specificity | Outcome-focused, numbered, specific |
| Body structure | Wall of text | Some sections | TL;DR + table + verdicts + FAQ |
| Engagement | Passive, filler phrases | Mostly active | Direct, data-rich, personal voice |
| SEO | Keyword missing | Keyword present | Keyword in right places + FAQ + links |

**Scoring: 10-14 = Good | 6-9 = Needs rewriting | 0-5 = Full rewrite**

---

*blixamo.com — ARTICLE_RULES v8 FINAL — 2026-03-21*

---

## Rule 36 — Ideogram Featured Image (Every Article, No Exceptions)

After every article batch is written and deployed, Claude MUST provide:

### Style Pattern (fixed — never change)
- Background: dark charcoal (`#1a1a2e` style)
- Left side: category pill (rounded badge, accent color) + bold white title text
- Right side: 3D floating app/tool icons with ✅ and ❌ overlays
- Bottom left: `read time · difficulty · keyword`
- Bottom right: avatar photo + "Ankit Sorathiya · blixamo.com"
- Accent color by category:
  - ai → `#7c3aed` (purple)
  - tools → `#d97706` (amber)
  - tutorials → `#0891b2` (blue)
  - tech → `#059669` (green)
  - indie-dev → `#e11d48` (red)
  - self-hosting → `#d97706` (amber)
  - vps-cloud → `#059669` (green)

### Ideogram Settings (fixed)
- Model: Ideogram v2
- Style: Render 3D
- Aspect: 16:9
- Negative prompt: `text errors, blurry, low quality, watermark`

### Prompt Format (one per article)
> Dark charcoal background, left side category pill "[CATEGORY]" in [COLOR], bold white text "[FULL TITLE]", right side [3D ICON DESCRIPTION relevant to article topic] with ✅ and ❌ overlays, [COLOR] accent color, bottom left "[TIME] · [DIFFICULTY] · [KEYWORD]", bottom right avatar + "Ankit Sorathiya · blixamo.com", Render 3D, 16:9

### Workflow
1. Write articles → deploy → GSC auto-submits
2. Claude outputs style pattern + one prompt per article
3. Ankit generates on Ideogram, saves to Desktop as `[slug].jpeg`
4. Drop on Desktop → Claude compresses + uploads → deploy

*This rule is mandatory. No article goes live without a featured image prompt provided.*

---

*blixamo.com — ARTICLE_RULES v8 FINAL — updated 2026-03-22*

---

## Rule 37 — Human Touch & CTR Overhaul (Every Article, No Exceptions)

**Goal:** Every article on blixamo.com must read like a real developer wrote it — specific, opinionated, technically accurate, and worth clicking from Google.

### Per-Article Checklist (8 Points)

| # | Check | What to do |
|---|---|---|
| **1** | **Robotic/AI tone** | Rewrite sentences that sound like ChatGPT wrote them. Use first person, contractions, and developer voice. |
| **2** | **Weak intro** | First 2 sentences must hook the reader. State the problem or outcome immediately — no "In this article we will..." |
| **3** | **Missing opinion** | Add real developer take — what you actually think, what worked, what surprised you. |
| **4** | **Generic conclusion** | Replace "In conclusion..." endings with a specific takeaway or next step the reader can act on. |
| **5** | **Thin sections** | Any section under 100 words — either expand with real detail or merge with adjacent section. |
| **6** | **Keyword stuffing** | If any keyword appears unnaturally more than 3x in a paragraph, rewrite for flow. |
| **7** | **Title tag** | Under 60 chars. Specific, benefit-driven, include year 2026 where natural. |
| **8** | **Meta description** | Under 155 chars. Answers: what will I learn? Sounds human, not AI-generated. |

### Rules for Each Point

**1. Robotic/AI tone** — rewrite to sound like a real developer. First person, contractions, honest voice. If it reads like a blog post template, it needs rewriting.

**2. Weak intro** — hook in first 2 sentences. State problem or outcome immediately. No "In this article..." or "In this guide we will cover...". Start with the pain point or the result.

**3. Missing opinion** — add real take. What actually worked, what surprised you, what you recommend and why. Not "it depends" — pick a side.

**4. Generic conclusion** — replace with a specific takeaway or next step the reader can act on today. Link to the next logical article.

**5. Thin sections** — any H2/H3 section under 100 words must either be expanded with real technical detail or merged into an adjacent section. No filler padding — real information or nothing.

**6. Keyword stuffing** — if the target keyword appears unnaturally 3+ times in a single paragraph, rewrite for flow. Density check: keyword should appear once per 150–200 words naturally.

**7. Title tag** — under 60 chars. Specific, benefit-driven, year 2026 where it adds freshness signal. Name the tool, the outcome, or the number. Avoid: "A guide to...", "How to learn...", "Everything about..."

**8. Meta description** — under 155 chars. Answers: what will I learn? Sounds human, not AI. Use specific outcomes: "Deploy in 10 mins", "Works with Indian debit cards", "Step-by-step with real numbers". No generic "In this article we explore..."

### Enforcement

- Rules 7 and 8 are enforced automatically by **mdx-check P6 and P8** — build fails if violated
- Rules 1–6 are checked manually when polishing articles or before any batch publish
- When writing a new article: apply all 8 checks before committing the MDX file
- Summary table after any batch polish: `Article | Issues Found | Changes Made`

### Priority Order (when doing a batch polish)

1. High impression / low CTR articles first (check GSC → Performance → Pages, sort by impressions desc)
2. Featured articles (featured: true in frontmatter)
3. Remaining articles by date desc

*This rule applies to all new articles and all existing articles during any polish pass.*

---

*blixamo.com — ARTICLE_RULES v9 — updated 2026-03-22*

---

## Rule 38 — Opinionated Conclusion (Every Article, No Exceptions)

**Enforcement:** Manual checklist — check before every publish and every batch rewrite.

### The 4-Step Conclusion Formula

Every conclusion must follow this structure in order:

1. **Personal experience** — state how long you used it and in what real project
2. **Clear recommendation** — pick a side. No fence-sitting.
3. **One honest exception** — acknowledge specifically where the other option wins
4. **Who should use what** — specific, not vague

### Good vs Bad

| ❌ BAD — Never Write This | ✅ GOOD — Write Like This |
|---|---|
| Both X and Y are excellent. The choice depends on your use case. Ultimately it's up to you. | I've used X in production for [time] on [project]. I'm not switching. Y wins only if [specific condition]. For [use case], X is the better choice. |

### Banned Phrases in Conclusions

Never use any of these in any conclusion section:

- "it depends"
- "both are great" / "both are excellent"
- "ultimately it's your choice"
- "in conclusion"
- "to summarize"
- "at the end of the day"
- "the choice is yours"

### Enforcement Checklist

Before every publish, scan the final section of the article and confirm:

- [ ] Opens with personal experience (time + project name)
- [ ] Makes a clear recommendation — one option wins
- [ ] Acknowledges exactly one exception where the other option is better
- [ ] Ends with a specific "use X if..." / "use Y if..." statement
- [ ] Contains none of the banned phrases above

### Applies To

- All new articles — check before first publish
- All batch rewrites — check every article in the batch
- Comparison articles especially — "X vs Y" titles are highest risk for fence-sitting conclusions

*This rule applies retroactively. Any conclusion that doesn't follow the formula should be rewritten on the next edit pass.*

---

*blixamo.com — ARTICLE_RULES v10 — updated 2026-03-22*

---

## Rule 39 — Image Alt Text (Every Image, No Exceptions)

**Enforcement:** P10 in mdx-check — build fails on empty or generic alt text.

### Rules

- Every image must have descriptive alt text — no empty `![]` attributes
- Under 125 chars — screen readers truncate beyond this
- Describe what is IN the image — not just the type
- Include numbers/data visible in the image (impressions, costs, percentages)
- Include relevant keywords naturally — don't stuff
- No "image of" or "screenshot of" — start directly with what it shows

### Good vs Bad

| ❌ BAD | ✅ GOOD |
|---|---|
| `![]` | `![GSC showing 847 impressions after 14 days for blixamo.com]` |
| `![screenshot]` | `![Claude API vs GPT-4o response comparison on a coding task]` |
| `![terminal]` | `![Node.js GSC CLI output showing sitemap submitted on Hetzner VPS]` |
| `![ram usage — coolify vs caprover 2026]` | `![RAM usage — Coolify 400MB vs Caprover 250MB vs Dokku 75MB on 4GB VPS]` |

### What P10 Blocks

- Empty alt: `![]` → build fails
- Generic alt: `![image]`, `![screenshot]`, `![terminal]`, `![img]` → build fails
- Alt over 125 chars → build fails

### For New Articles

When adding images, write the alt text at the same time. Use the image filename as a hint — `05-ram-usage.png` tells you to describe the RAM numbers visible in the image.

---
---

## Rule 40 — Post-Publish Indexing Ritual (Every Publish, No Exceptions)

**Enforcement:** Manual — run after every new article publish or significant update.

### Steps (in order)

1. **Request indexing immediately**
   ```bash
   node /var/www/gsc-tool/gsc.js index https://blixamo.com/blog/<slug>
   ```

2. **Resubmit sitemap**
   ```bash
   node /var/www/gsc-tool/gsc.js submit
   ```

3. **Check after 48 hours** — GSC → URL Inspection → paste URL → confirm "URL is on Google"

4. **If still not indexed after 7 days** — re-request indexing once more (not more than once)

### Hard Limits

- **Max 10 indexing requests per day** — Google API allows 200/day but batching too many triggers spam detection
- Never request indexing for tag, category, or series pages — blog posts only
- Don't re-request the same URL more than twice in a 7-day period

### GSC CLI Quick Reference

| Command | What it does |
|---|---|
| `node gsc.js index <url>` | Request indexing for one URL |
| `node gsc.js submit` | Resubmit sitemap.xml |
| `node gsc.js pages 7` | Top pages by clicks last 7 days |
| `node gsc.js queries 7` | Top queries last 7 days |
| `node gsc.js report 7` | Full performance report |
| `node gsc.js sitemaps` | Sitemap status + indexed count |

### For Batch Indexing (50 unindexed backlog)

Do 10/day over 5 days. Track which ones were submitted:

- **Day 1 (done):** best-postgresql-gui-free, build-saas-mvp-zero-budget-2026, build-telegram-bot-claude-api-python, claude-ai-guide, claude-api-content-automation-nodejs, claude-api-vs-openai-cost-india, claude-api-vs-openai-gpt4-2026, coolify-complete-guide-2026, coolify-vs-caprover-2026, deploy-nextjs-coolify-hetzner
- **Day 2:** docker-compose-production-vps-2026, free-tools-indian-indie-developer, free-vps-hosting-2026, google-search-console-self-hosted-nextjs, hetzner-vs-aws-2026, hetzner-vs-aws-lightsail-2026, hetzner-vs-digitalocean-vs-vultr-india, hetzner-vs-vultr-vs-linode-2026, indian-debit-cards-dev-tools, multiple-projects-single-vps
- **Day 3:** n8n-complete-guide-2026, n8n-vs-make-vs-zapier-indie-dev, nextjs-mdx-blog-2026, nextjs-performance-optimization-2026, nginx-reverse-proxy-guide-2026, open-source-tools-2026, oracle-cloud-free-vs-hetzner-2026, pay-hetzner-from-india, razorpay-integration-nextjs-india, self-healing-vps-monitor-nodejs
- **Day 4:** self-host-plausible-analytics-2026, self-hosting-n8n-hetzner-vps, tailwind-css-vs-css-modules, vps-security-harden-ubuntu-2026, whatsapp-ai-assistant-n8n-claude-api, wise-vs-payoneer-india-freelancer

---

*blixamo.com — ARTICLE_RULES v12 — updated 2026-03-22*
