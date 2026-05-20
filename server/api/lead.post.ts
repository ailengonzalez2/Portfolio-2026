interface LeadPayload {
  email?: string
  description?: string
  brief?: string
  locale?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const web3formsKey = config.public?.web3formsKey

  const body = await readBody<LeadPayload>(event)
  const email = (body?.email || '').trim()
  const description = (body?.description || '').trim()
  const brief = (body?.brief || '').trim()
  const locale = body?.locale || 'en'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid email is required.'
    })
  }

  // Dev fallback: log to server console so the flow is testable.
  if (!web3formsKey) {
    console.log('[lead] (no Web3Forms key) lead captured:', { email, locale, description: description.slice(0, 80) })
    return { ok: true, mock: true }
  }

  const payload = {
    access_key: web3formsKey,
    subject: `New brief lead from ${email}`,
    from_name: 'Portfolio Brief Generator',
    email,
    locale,
    description,
    brief
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw createError({
      statusCode: 502,
      statusMessage: `Web3Forms error: ${res.status} ${text.slice(0, 200)}`
    })
  }

  return { ok: true }
})
