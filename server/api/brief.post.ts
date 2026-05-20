import { BRIEF_SYSTEM_PROMPT } from '../utils/brief-prompt'

// In-memory rate limit: 3 briefs per IP per 24h.
// Resets on server restart. Swap to Redis when we need persistence.
const RATE_LIMIT = 3
const WINDOW_MS = 24 * 60 * 60 * 1000

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function checkRateLimit(ip: string): { ok: boolean, remaining: number, resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, remaining: RATE_LIMIT - 1, resetAt: now + WINDOW_MS }
  }

  if (entry.count >= RATE_LIMIT) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  return { ok: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.openrouter?.apiKey
  const model = config.openrouter?.model || 'anthropic/claude-sonnet-4.5'

  const body = await readBody<{ description?: string }>(event)
  const description = (body?.description || '').trim()

  if (description.length < 20) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Description must be at least 20 characters.'
    })
  }
  if (description.length > 500) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Description must be 500 characters or fewer.'
    })
  }

  // Rate limit by IP (proxy-aware via x-forwarded-for, fallback to remoteAddress)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const limit = checkRateLimit(ip)
  if (!limit.ok) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Daily limit reached. Try again tomorrow, or reach out by email.'
    })
  }

  setHeader(event, 'x-ratelimit-remaining', String(limit.remaining))

  // Dev fallback: if no API key, stream a deterministic mock so the UI is testable.
  if (!apiKey) {
    setHeader(event, 'content-type', 'text/plain; charset=utf-8')
    setHeader(event, 'cache-control', 'no-cache')
    return streamMockBrief(description)
  }

  // Call OpenRouter and stream the response back to the client.
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ailengonzalez.ar',
      'X-Title': 'Ailen Gonzalez Portfolio — Brief Generator'
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.4,
      max_tokens: 900,
      messages: [
        { role: 'system', content: BRIEF_SYSTEM_PROMPT },
        { role: 'user', content: description }
      ]
    })
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    throw createError({
      statusCode: 502,
      statusMessage: `Upstream error: ${upstream.status} ${errText.slice(0, 200)}`
    })
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'no-cache')

  // Transform OpenRouter SSE chunks into plain text content tokens.
  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        controller.close()
        return
      }
      buffer += decoder.decode(value, { stream: true })

      // SSE: lines starting with "data: ", terminated by blank lines.
      const parts = buffer.split('\n')
      buffer = parts.pop() || ''
      for (const line of parts) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') {
          controller.close()
          return
        }
        try {
          const json = JSON.parse(payload)
          const content = json?.choices?.[0]?.delta?.content
          if (content) controller.enqueue(encoder.encode(content))
        } catch {
          // ignore non-JSON lines (keep-alive comments, etc.)
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {})
    }
  })

  return sendStream(event, stream as unknown as ReadableStream)
})

/**
 * Returns a deterministic streamed mock brief when no API key is configured.
 * Lets us develop and demo the UI without burning OpenRouter credits.
 */
function streamMockBrief(description: string): ReadableStream<Uint8Array> {
  const mock = `## SERVICE
LLM Integration

## PRICE_RANGE
USD 3,000 – USD 5,500

## TIMELINE
2–3 weeks

## WHAT_I_HEARD
You described: "${description.slice(0, 140)}${description.length > 140 ? '…' : ''}". I'm reading this as a focused LLM feature that wraps an existing product, not a from-scratch build.

## PHASES
- Week 1: Discovery + system prompt design + streaming chat scaffold
- Week 2: Tool-call integrations + structured outputs + eval harness
- Week 3: Polish, rate limits, deploy

## STACK
Nuxt 4, TypeScript, Anthropic Claude, Vercel AI SDK, Tailwind CSS, pgvector

## BUILD_FIRST
The streaming chat surface with structured outputs — it de-risks both the LLM contract and the UI shape before we wire up tools or RAG.

## WHY_FIT
I shipped CaveSwap end-to-end (design + Nuxt + on-chain integration). Same shape of work — well-scoped product surface, real backend wiring, deployed.`

  const encoder = new TextEncoder()
  const tokens = mock.split(/(\s+)/) // keep whitespace tokens
  let i = 0
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i >= tokens.length) {
        controller.close()
        return
      }
      controller.enqueue(encoder.encode(tokens[i] || ''))
      i += 1
      // Small delay between tokens to mimic streaming.
      await new Promise(r => setTimeout(r, 22))
    }
  })
}
