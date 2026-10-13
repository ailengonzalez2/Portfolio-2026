<script setup lang="ts">
import { gradientAt, loadingDensity } from '~/webgl/math'

// Particles drifting across the whole hero while the WebGL stage loads, each
// on its own heading, wrapping at the edges,
// slowly getting denser, brighter and bigger. Plain 2D canvas, so it runs
// from hydration without waiting for three. When the WebGL particles take
// over at the same density, this fades out and they keep densifying.
const COUNT = 1400

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let observer: ResizeObserver | undefined

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return

  const dots = Array.from({ length: COUNT }, () => {
    const [r, g, b] = gradientAt(Math.random())
    const heading = Math.random() * Math.PI * 2
    const speed = 18 + Math.random() * 37
    return {
      x: Math.random(),
      y: Math.random(),
      vx: Math.cos(heading) * speed,
      vy: Math.sin(heading) * speed,
      rand: Math.random(),
      phase: Math.random() * Math.PI * 2,
      color: `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`
    }
  })

  let w = 0
  let h = 0
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = el.offsetWidth
    h = el.offsetHeight
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  observer = new ResizeObserver(resize)
  observer.observe(el)

  const start = performance.now()
  const draw = (now: number) => {
    raf = requestAnimationFrame(draw)
    const t = (now - start) / 1000
    const density = loadingDensity(t)
    ctx.clearRect(0, 0, w, h)
    const size = 0.8 + density * 1.6
    for (const d of dots) {
      // Same reveal as the shader: a dot shows once density passes its rand.
      const shown = Math.min(1, Math.max(0, (density - d.rand + 0.05) / 0.05))
      if (!shown) continue
      ctx.globalAlpha = shown * (0.3 + 0.55 * density)
      ctx.fillStyle = d.color
      // Travel at its own velocity, wrapping around the edges, plus a sway.
      const x = (((d.x * w + d.vx * t) % w) + w) % w + Math.sin(t * 0.4 + d.phase) * 12
      const y = (((d.y * h + d.vy * t) % h) + h) % h + Math.cos(t * 0.33 + d.phase) * 12
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 size-full"
  />
</template>
