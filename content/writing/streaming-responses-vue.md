---
title: Designing streaming responses in Vue
description: A no-flicker streaming chat UI in Nuxt — chunk parsing, smooth typing, graceful tool-call rendering, and the small decisions that make streamed AI output feel calm instead of jittery.
date: 2026-08-03
category: AI Product
i18nKey: streaming
readingTime: 9 min read
---

Streaming is the single highest-leverage UX decision in an AI product. The same model, the same latency, the same answer — but if the first token shows up in 400ms instead of the full answer showing up in 9 seconds, the product *feels* an order of magnitude faster.

It's also where most chat UIs quietly fall apart: flickering markdown, layouts that jump, a scroll position that fights the user, and tool calls that render as raw JSON. None of these are model problems. They're frontend problems, and they're all fixable.

This is the setup I use in Nuxt 4 for Claude-powered chat features — from the server route to the last CSS detail.

## The transport: a Nitro route that re-streams

Never call the model API from the browser. The key stays on the server, and a Nitro route re-streams the response to the client:

```ts
// server/api/chat.post.ts
export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)
  const { apiKey } = useRuntimeConfig().anthropic

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      stream: true,
      messages
    })
  })

  setHeader(event, 'content-type', 'text/event-stream')
  setHeader(event, 'cache-control', 'no-cache')
  return sendStream(event, upstream.body!)
})
```

That's it on the server. The interesting work is on the client.

## Parsing the stream without tears

Server-sent events arrive as text chunks, and a chunk boundary can land *in the middle of a line*. If you split each chunk on `\n` independently, you'll eventually parse half a JSON object and crash mid-answer. The fix is a persistent buffer: append every chunk, only consume complete lines.

```ts
// app/composables/useChatStream.ts
export const useChatStream = () => {
  const text = ref('')
  const status = ref<'idle' | 'streaming' | 'done' | 'error'>('idle')
  let controller: AbortController | undefined

  const send = async (messages: ChatMessage[]) => {
    controller = new AbortController()
    status.value = 'streaming'
    text.value = ''

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      signal: controller.signal
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? '' // keep the incomplete tail for the next chunk

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const event = JSON.parse(line.slice(6))
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          text.value += event.delta.text
        }
      }
    }
    status.value = 'done'
  }

  const stop = () => {
    controller?.abort()
    status.value = 'done'
  }

  return { text, status, send, stop }
}
```

Two details that matter here:

- **`decoder.decode(value, { stream: true })`** — without the flag, a multi-byte character (an emoji, an accented á) split across chunks becomes garbage.
- **`buffer = lines.pop()`** — the incomplete last line waits for the rest of itself. This is the line that separates a demo from a product.

## Rendering: why streamed markdown flickers

The naive approach re-parses the whole markdown string on every token:

```
token arrives → text.value += token → markdown-it re-parses everything → v-html swaps the DOM
```

At 60–100 tokens per second this means the entire answer's DOM is torn down and rebuilt dozens of times a second. Code blocks lose their syntax highlighting for a frame, images re-request, and the page visibly shimmers.

Three fixes, in order of effort:

**1. Throttle renders to animation frames.** Tokens can arrive faster than the screen refreshes. Accumulate them and flush once per frame:

```ts
let pending = ''
let scheduled = false

const push = (token: string) => {
  pending += token
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    text.value += pending
    pending = ''
    scheduled = false
  })
}
```

The stream reads identically to the user, but you've cut renders from ~100/s to at most 60/s — and in practice far fewer.

**2. Only re-parse the tail.** Completed markdown blocks (separated by `\n\n`) never change once closed. Parse them once, cache the HTML, and only re-parse the still-open final block. This drops re-parse cost from O(whole answer) to O(current paragraph).

**3. Never animate layout.** The blinking caret at the end of streamed text should be a CSS pseudo-element (`&::after` with an opacity keyframe), not a character you append and remove — appending a real `▍` character to the string means every flush also shifts text.

## Tool calls are part of the conversation

When Claude decides to call a tool mid-answer, the stream switches from text deltas to `tool_use` blocks. The worst thing you can do is print raw JSON; the second worst is hiding it entirely, leaving a mysterious 3-second silence.

Treat the tool call as a first-class message segment with its own component:

```vue
<ToolCallChip
  :name="segment.toolName"
  :status="segment.status"
/>
```

A small chip — spinner while running, checkmark when done, expandable if the user wants the details. The mental model you're building for the user: *the assistant is doing something, here's what, it's under control.* In my segments array, text blocks and tool blocks interleave in order, so the transcript reads like what actually happened.

## The details that make it feel calm

- **Auto-scroll with an escape hatch.** Follow the bottom while the user is at the bottom; the moment they scroll up, stop following and show a "jump to latest" pill. Fighting the user's scroll is the fastest way to make streaming feel hostile.
- **`aria-live="polite"` on the transcript** — screen readers announce streamed content when the user is idle, instead of on every token.
- **Respect `prefers-reduced-motion`.** Skip the caret blink and any typing embellishments; the text simply appears.
- **Design the stop button in from day one.** An `AbortController` on the fetch, a visible "Stop" affordance, and a state that renders the partial answer as valid — because a half-answer the user chose to keep is a feature, not an error.
- **Errors mid-stream keep the partial text.** Append a retry affordance under what already arrived. Throwing away 400 streamed words because the connection hiccuped at word 401 is rage-inducing.

## Takeaways

Streaming UIs live or die on four things: a chunk parser that survives arbitrary split points, renders throttled to frames, markdown parsed incrementally instead of wholesale, and tool activity shown as status instead of silence. None of it is glamorous — and that's exactly why getting it right is a competitive advantage. Most teams ship the naive version.

If you're building a streamed AI feature in Vue or Nuxt and want it to feel like a product instead of a demo, [that's exactly the work I do](/#contact).
