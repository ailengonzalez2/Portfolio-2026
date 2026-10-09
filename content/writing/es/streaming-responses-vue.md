---
title: Diseñar respuestas con streaming en Vue
description: Una UI de chat con streaming sin parpadeos en Nuxt — parseo de chunks, tipeo suave, tool calls bien renderizadas y las pequeñas decisiones que hacen que la respuesta de una IA se sienta tranquila en vez de nerviosa.
date: 2026-08-03
category: AI Product
i18nKey: streaming
readingTime: 9 min de lectura
---

El streaming es la decisión de UX con más impacto en un producto de IA. El mismo modelo, la misma latencia, la misma respuesta — pero si el primer token aparece a los 400ms en vez de que la respuesta completa aparezca a los 9 segundos, el producto *se siente* diez veces más rápido.

También es donde la mayoría de las UIs de chat se rompen en silencio: markdown que parpadea, layouts que saltan, un scroll que se pelea con el usuario y tool calls que se renderizan como JSON crudo. Nada de esto es un problema del modelo. Son problemas de frontend, y todos tienen arreglo.

Este es el setup que uso en Nuxt 4 para features de chat con Claude — desde la ruta del server hasta el último detalle de CSS.

## El transporte: una ruta de Nitro que re-streamea

Nunca llames a la API del modelo desde el browser. La key se queda en el server, y una ruta de Nitro re-streamea la respuesta al cliente:

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

Eso es todo del lado del server. Lo interesante pasa en el cliente.

## Parsear el stream sin sufrir

Los server-sent events llegan como chunks de texto, y el corte entre un chunk y otro puede caer *en el medio de una línea*. Si partís cada chunk por `\n` de forma independiente, tarde o temprano vas a parsear medio objeto JSON y la respuesta se va a romper a la mitad. La solución es un buffer persistente: agregás cada chunk y solo consumís líneas completas.

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
      buffer = lines.pop() ?? '' // guardamos la cola incompleta para el próximo chunk

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

Dos detalles que importan acá:

- **`decoder.decode(value, { stream: true })`** — sin ese flag, un carácter multi-byte (un emoji, una á con tilde) que queda partido entre dos chunks se convierte en basura.
- **`buffer = lines.pop()`** — la última línea incompleta espera al resto de sí misma. Esta es la línea que separa una demo de un producto.

## Renderizado: por qué parpadea el markdown en streaming

El enfoque ingenuo re-parsea todo el string de markdown con cada token:

```
token arrives → text.value += token → markdown-it re-parses everything → v-html swaps the DOM
```

A 60–100 tokens por segundo, eso significa que todo el DOM de la respuesta se destruye y se reconstruye decenas de veces por segundo. Los bloques de código pierden el syntax highlighting por un frame, las imágenes se vuelven a pedir y la página tiembla a la vista.

Tres soluciones, de menor a mayor esfuerzo:

**1. Limitá los renders a los frames de animación.** Los tokens pueden llegar más rápido de lo que se refresca la pantalla. Acumulalos y hacé un flush una vez por frame:

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

Para el usuario el stream se lee exactamente igual, pero bajaste los renders de ~100/s a 60/s como máximo — y en la práctica, muchos menos.

**2. Re-parseá solo la cola.** Los bloques de markdown que ya se cerraron (separados por `\n\n`) no cambian nunca más. Parsealos una vez, cacheá el HTML y re-parseá solo el último bloque, el que sigue abierto. Así el costo de re-parseo baja de O(toda la respuesta) a O(párrafo actual).

**3. Nunca animes el layout.** El cursor que parpadea al final del texto tiene que ser un pseudo-elemento de CSS (`&::after` con un keyframe de opacidad), no un carácter que agregás y sacás — si agregás un `▍` real al string, cada flush también corre el texto.

## Las tool calls son parte de la conversación

Cuando Claude decide llamar a una tool en el medio de una respuesta, el stream pasa de deltas de texto a bloques `tool_use`. Lo peor que podés hacer es imprimir el JSON crudo; lo segundo peor es esconderlo del todo y dejar un silencio misterioso de 3 segundos.

Tratá la tool call como un segmento del mensaje de primera clase, con su propio componente:

```vue
<ToolCallChip
  :name="segment.toolName"
  :status="segment.status"
/>
```

Un chip chiquito — spinner mientras corre, check cuando termina, expandible si el usuario quiere ver los detalles. El modelo mental que le estás armando al usuario: *el asistente está haciendo algo, esto es lo que hace, está bajo control.* En mi array de segmentos, los bloques de texto y los de tools se intercalan en orden, así que la transcripción se lee como lo que realmente pasó.

## Los detalles que lo hacen sentir tranquilo

- **Auto-scroll con salida de emergencia.** Seguí el final mientras el usuario está abajo de todo; en cuanto scrollea para arriba, dejá de seguir y mostrá una pastilla de "ir a lo último". Pelearte con el scroll del usuario es la forma más rápida de que el streaming se sienta hostil.
- **`aria-live="polite"` en la transcripción** — los lectores de pantalla anuncian el contenido cuando el usuario está inactivo, en vez de con cada token.
- **Respetá `prefers-reduced-motion`.** Sacá el parpadeo del cursor y cualquier adorno de tipeo; el texto simplemente aparece.
- **Diseñá el botón de stop desde el día uno.** Un `AbortController` en el fetch, un "Stop" visible y un estado que renderiza la respuesta parcial como válida — porque una media respuesta que el usuario eligió quedarse es una feature, no un error.
- **Los errores en el medio del stream conservan el texto parcial.** Agregá la opción de reintentar debajo de lo que ya llegó. Tirar 400 palabras streameadas porque la conexión tuvo un hipo en la palabra 401 da muchísima bronca.

## Conclusiones

Las UIs con streaming se juegan todo en cuatro cosas: un parser de chunks que aguante cortes en cualquier punto, renders limitados a frames, markdown parseado de forma incremental en vez de todo de nuevo, y la actividad de las tools mostrada como estado en vez de silencio. Nada de esto es glamoroso — y justamente por eso hacerlo bien es una ventaja competitiva. La mayoría de los equipos lanza la versión ingenua.

Si estás armando una feature de IA con streaming en Vue o Nuxt y querés que se sienta como un producto y no como una demo, [ese es exactamente el trabajo que hago](/#contact).
