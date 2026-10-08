<script setup lang="ts">
import { gradientAt, swirlAt, swirlAxes, swirlOrbit } from '~/webgl/math'

// Particles orbiting the hero title while the WebGL stage loads. Plain 2D
// canvas, so it runs from hydration without waiting for three. Uses the same
// orbit math as the particle text shader, so when the WebGL particles take
// over (and this fades out) the swirl carries on in place.
const COUNT = 1800
// Canvas overflow around the title box, so outer orbits are not clipped.
const BLEED = 0.2

const canvas = ref<HTMLCanvasElement | null>(null)

let raf = 0
let observer: ResizeObserver | undefined

onMounted(() => {
  const el = canvas.value
  const box = el?.parentElement
  const ctx = el?.getContext('2d')
  if (!el || !box || !ctx) return

  const dots = Array.from({ length: COUNT }, () => {
    const [radius, angle] = swirlOrbit(Math.random(), Math.random())
    const [r, g, b] = gradientAt(Math.random())
    return {
      radius,
      angle,
      size: 1.4 + Math.random() * 1.4,
      color: `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`
    }
  })

  let w = 0
  let h = 0
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = box.offsetWidth
    h = box.offsetHeight
    el.width = Math.round(w * (1 + BLEED * 2) * dpr)
    el.height = Math.round(h * (1 + BLEED * 2) * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  observer = new ResizeObserver(resize)
  observer.observe(box)

  const start = performance.now()
  const draw = (now: number) => {
    raf = requestAnimationFrame(draw)
    const t = (now - start) / 1000
    const [ax, ay] = swirlAxes(w, h)
    const cx = w * (0.5 + BLEED)
    const cy = h * (0.5 + BLEED)
    ctx.clearRect(0, 0, w * (1 + BLEED * 2), h * (1 + BLEED * 2))
    // Dots fade in over the first half second.
    ctx.globalAlpha = Math.min(1, t * 2) * 0.6
    for (const d of dots) {
      const [x, y] = swirlAt(d.radius, d.angle, t, ax, ay)
      ctx.fillStyle = d.color
      ctx.beginPath()
      ctx.arc(cx + x, cy - y, d.size, 0, Math.PI * 2)
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
    class="pointer-events-none absolute"
    :style="{
      left: `${-BLEED * 100}%`,
      top: `${-BLEED * 100}%`,
      width: `${100 + BLEED * 200}%`,
      height: `${100 + BLEED * 200}%`
    }"
  />
</template>
