import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, placement } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const CK_API_SECRET = process.env.CONVERTKIT_API_KEY
    const CK_FORM_ID = process.env.CONVERTKIT_FORM_ID

    if (CK_API_SECRET && CK_FORM_ID) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${CK_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: CK_API_SECRET,
            email,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        console.error('[subscribe] ConvertKit error:', data)
        throw new Error('ConvertKit error')
      }
      console.log(`[subscribe] Subscribed: ${email} via ${placement}`)
    } else {
      console.log(`[subscribe] No provider — subscriber: ${email} via ${placement}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe] error:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
