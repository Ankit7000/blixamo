import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { NextResponse } from 'next/server'

type SubscribePayload = {
  email?: string
  name?: string
  source?: string
  page?: string
  placement?: string
}

type SubscriberRecord = {
  email: string
  name: string | null
  source: string | null
  page: string | null
  createdAt: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return EMAIL_RE.test(email) ? email : null
}

async function loadExistingEmails(filePath: string): Promise<Set<string>> {
  try {
    const raw = await readFile(filePath, 'utf8')
    const emails = new Set<string>()

    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue

      try {
        const parsed = JSON.parse(trimmed) as Partial<SubscriberRecord>
        if (typeof parsed.email === 'string') {
          emails.add(parsed.email.trim().toLowerCase())
        }
      } catch {
        // Ignore malformed historical lines and keep processing the rest.
      }
    }

    return emails
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('ENOENT')) return new Set<string>()
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as SubscribePayload
    const email = normalizeEmail(payload.email)

    if (!email) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const subscribersFile = process.env.SUBSCRIBERS_FILE?.trim()

    if (!subscribersFile) {
      return NextResponse.json(
        { error: 'Subscriber storage is not configured on this environment yet.' },
        { status: 500 }
      )
    }

    const record: SubscriberRecord = {
      email,
      name: normalizeText(payload.name, 120),
      source: normalizeText(payload.source ?? payload.placement, 120),
      page: normalizeText(payload.page, 240),
      createdAt: new Date().toISOString(),
    }

    await mkdir(dirname(subscribersFile), { recursive: true })

    const existingEmails = await loadExistingEmails(subscribersFile)
    if (existingEmails.has(email)) {
      return NextResponse.json({ success: true, duplicate: true })
    }

    await appendFile(subscribersFile, `${JSON.stringify(record)}\n`, 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[subscribe] error:', error)
    return NextResponse.json({ error: 'Subscription failed while saving your request.' }, { status: 500 })
  }
}
