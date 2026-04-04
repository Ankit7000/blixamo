# IMAGE_RULES.md - Blixamo Post Image System

Last updated: 2026-03-25

## Goal

All article covers and OG images use one static title-image system so Blixamo looks like a single developer publication instead of a mix of unrelated blog graphics.

## Canonical Paths

Each article slug owns one image folder under `public/images/posts/[slug]/`.

Required files:
- `featured.png` - on-site article cover used in cards, homepage, category pages, and article headers
- `og.png` - social / metadata image used in Open Graph, Twitter cards, and JSON-LD

Path helpers:
- `featured`: `/images/posts/[slug]/featured.png`
- `og`: `/images/posts/[slug]/og.png`

## Dimensions

- Featured image: `1200 x 630`
- OG image: `1200 x 630`
- Format: PNG
- Background: dark editorial / technical

## Fixed Template Structure

Every image follows the same layout system:
1. Top-left Blixamo brand mark
2. Category pill and category symbol pill
3. Large left-column title block
4. Short keyword / subtitle line under the title
5. Bottom-left metadata chips
6. Right-side intent panel
7. Bottom-right author / brand signature

Only these elements change per article:
- title text
- category color
- category label / symbol
- right-side intent visual
- keyword / metadata text

## Category Visual Tokens

| Category | Label | Symbol | Color | Accent |
| --- | --- | --- | --- | --- |
| `how-to` | HOW-TO | CLI | `#0891b2` | `#0ea5e9` |
| `ai` | AI | AI | `#7c3aed` | `#a78bfa` |
| `developer-tools` | DEV TOOLS | DEV | `#d97706` | `#f59e0b` |
| `indie-hacking` | INDIE | BIZ | `#e11d48` | `#fb7185` |
| `self-hosting` | SELF HOST | OPS | `#059669` | `#34d399` |
| `vps-cloud` | VPS | VPS | `#2563eb` | `#60a5fa` |
| `web-dev` | WEB DEV | WEB | `#ea580c` | `#fb923c` |
| `automation` | AUTOMATION | AUT | `#db2777` | `#f472b6` |
| `free-tools` | FREE TOOLS | OSS | `#0d9488` | `#2dd4bf` |

## Intent Visual System

The right-side panel changes by article intent.

| Intent | Trigger pattern | Visual motif |
| --- | --- | --- |
| `comparison` | title contains `vs`, `comparison`, `compare` | split nodes with `VS` connector |
| `guide` | title contains `how to`, `guide`, `setup`, `deploy`, `install`, `integration`, `complete` | three-step flow with numbered nodes |
| `tool-grid` | title starts with a number or contains `best`, `open source`, `free tools` | 2x2 stack card grid |
| `infrastructure` | `self-hosting` / `vps-cloud` without a stronger signal | server rack blocks plus live node |
| `database` | title contains `postgres`, `database`, `sql` | stacked database cylinders |
| `automation` | title contains `automation`, `n8n`, `claude`, `chatgpt`, `openai`, `bot`, `assistant`, `ai` | connected workflow graph |
| `seo` | title contains `search console`, `seo`, `index`, `query` | chart / analytics panel |
| `performance` | title contains `performance`, `speed`, `optimization`, `306ms` | speed gauge |
| `security` | title contains `security`, `harden`, `ssh`, `firewall`, `lock`, `shield` | shield / lock panel |
| `business` | `indie-hacking` or payment / billing keywords | payment / money panel |

## Typography Rules

- Brand: compact uppercase sans-serif
- Title: bold publication-style sans-serif, left aligned, 3 lines max
- Subtitle: subdued keyword line
- Chips: small uppercase / semibold labels
- Signature: author name + `blixamo.com`

## Branding Rules

- Dark technical background with subtle grid
- One left accent bar using the category color
- Subtle glow only; no stock-photo imagery
- Real author avatar in the footer signature
- Safe margins for card cropping on the site

## Generator

Canonical generator:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-post-images.ps1
```

Generate one slug only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-post-images.ps1 -Slugs getting-started-with-nextjs
```

What the generator does:
- reads all `content/posts/*.mdx`
- infers category tokens and visual intent
- writes `featured.png` and `og.png` into each slug folder
- normalizes frontmatter `featuredImage` to `/images/posts/[slug]/featured.png`

## Runtime Usage

- on-site cards and article headers use `featuredImage` from post frontmatter
- social metadata and JSON-LD use `/images/posts/[slug]/og.png`
- the helper module is `lib/post-images.ts`

## Naming Rules

- Never rename article folders after publish; folder name must match the post slug
- Keep output file names fixed as `featured.png` and `og.png`
- Inline article screenshots / diagrams can still live beside the title images in the same slug folder
