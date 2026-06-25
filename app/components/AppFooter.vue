<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const { global } = useAppConfig()
const year = new Date().getFullYear()

// Segments shared by the base (white) layer and the glow overlay so both align
const segments = computed(() => [
  { text: t('prefooter.design'), plus: false },
  { text: '+', plus: true },
  { text: t('prefooter.code'), plus: false },
  { text: '+', plus: true },
  { text: t('prefooter.ai'), plus: false }
])

// --- Cursor light-trail -------------------------------------------------
// A radial glow follows the pointer and leaves a fading trail. The glow is
// painted as the overlay's background and clipped to the text, so it is only
// visible over the white letters — never over the black background.
const sectionRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const trailBg = ref('none')

interface TrailPoint { x: number, y: number, life: number }
let points: TrailPoint[] = []
let raf = 0
let running = false

// Brand gradient stops: orange → pink → purple (brightened / more saturated)
const stops: [number, number, number][] = [
  [255, 196, 84],
  [255, 96, 120],
  [205, 120, 255]
]

const mix = (a: number[], b: number[], k: number) => [
  Math.round(a[0] + k * (b[0] - a[0])),
  Math.round(a[1] + k * (b[1] - a[1])),
  Math.round(a[2] + k * (b[2] - a[2]))
]

// pos 0 (newest/at cursor) = orange, pos 1 (tail) = purple
const colorAt = (pos: number) => {
  const p = Math.max(0, Math.min(1, pos))
  return p <= 0.5 ? mix(stops[0], stops[1], p * 2) : mix(stops[1], stops[2], (p - 0.5) * 2)
}

const tick = () => {
  points = points.filter(pt => (pt.life -= 0.045) > 0)
  if (!points.length) {
    trailBg.value = 'none'
    running = false
    return
  }
  const layers = points.map((pt) => {
    const a = pt.life
    const [r, g, b] = colorAt(1 - a)
    const radius = 70 * (0.45 + a * 0.55)
    return `radial-gradient(circle ${radius.toFixed(1)}px at ${pt.x.toFixed(1)}px ${pt.y.toFixed(1)}px, rgba(${r},${g},${b},${Math.min(1, 1.15 * a).toFixed(3)}) 0%, rgba(${r},${g},${b},${(0.55 * a).toFixed(3)}) 45%, rgba(${r},${g},${b},0) 72%)`
  })
  trailBg.value = layers.join(', ')
  raf = requestAnimationFrame(tick)
}

const onMove = (e: MouseEvent) => {
  const el = overlayRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  points.push({ x: e.clientX - r.left, y: e.clientY - r.top, life: 1 })
  if (points.length > 24) points.shift()
  if (!running) {
    running = true
    raf = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  if (!import.meta.client) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (reduce || !fine) return
  sectionRef.value?.addEventListener('mousemove', onMove)
})

onUnmounted(() => {
  sectionRef.value?.removeEventListener('mousemove', onMove)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <footer class="relative z-10 min-h-screen flex flex-col bg-[#0a0a0a] text-white">
    <section
      ref="sectionRef"
      class="flex-1 flex flex-col items-center justify-center pt-14 sm:pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div class="w-full max-w-6xl mx-auto">
        <!-- Brand statement: Design + Code + AI -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
          class="text-center"
        >
          <div class="relative inline-block">
            <!-- Base layer: solid white words, gray + -->
            <h2 class="magic-heading flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-1 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] pb-[0.18em]">
              <span
                v-for="(seg, i) in segments"
                :key="`b${i}`"
                :class="seg.plus ? 'text-white/30 font-light' : 'magic-word'"
              >{{ seg.text }}</span>
            </h2>

            <!-- Glow overlay: same words, gradient trail clipped to the letters -->
            <h2
              ref="overlayRef"
              aria-hidden="true"
              class="magic-overlay absolute inset-0 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-1 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] pb-[0.18em]"
              :style="{ backgroundImage: trailBg }"
            >
              <span
                v-for="(seg, i) in segments"
                :key="`o${i}`"
                :class="seg.plus ? 'invisible font-light' : 'magic-word'"
              >{{ seg.text }}</span>
            </h2>
          </div>
        </Motion>

        <!-- Book a call -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.15 }"
          :in-view-options="{ once: true }"
          class="mt-8 sm:mt-10 flex items-center justify-center"
        >
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
            class="btn-gradient text-white font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ t('contactCta.bookCall') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>
        </Motion>
      </div>
    </section>

    <!-- Footer Credits -->
    <div class="py-8 border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center text-white/50">
          <p class="font-sans text-xs sm:text-base text-center">
            <span>© {{ year }} – Designed &amp; Coded by </span>
            <NuxtLink
              to="https://www.linkedin.com/in/ailengonzalez/"
              target="_blank"
              class="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Ailen Gonzalez
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.magic-word {
  white-space: nowrap;
}

/* Glow overlay sits exactly on top of the white base. Its background (the
   cursor trail) is clipped to the text, so the colored light only shows on the
   letters — transparent everywhere else, revealing the white base beneath. */
.magic-overlay {
  pointer-events: none;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
</style>
