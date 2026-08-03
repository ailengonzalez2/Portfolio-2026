<script setup lang="ts">
import { testimonials } from '~/data/testimonials'

const count = testimonials.length
const active = ref(0)
const leaving = ref(false)

// Depth 0 is the front card; deeper cards sit tucked behind with uneven
// paper-like rotations alternating to each side.
const DEPTH_PRESETS = [
  { r: -1.2, x: 0, y: 0, s: 1 },
  { r: 3.2, x: 20, y: 14, s: 0.965 },
  { r: -3.8, x: -16, y: 26, s: 0.93 }
]

const depthOf = (i: number) => (i - active.value + count) % count

const cardStyle = (i: number) => {
  const d = depthOf(i)
  const p = DEPTH_PRESETS[Math.min(d, DEPTH_PRESETS.length - 1)] ?? { r: 0, x: 0, y: 0, s: 1 }
  // Mid-animation the front card lifts off the pile before tucking behind.
  const transform = leaving.value && d === 0
    ? 'translate(4%, -60%) rotate(7deg) scale(1.02)'
    : `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${p.s})`
  return {
    transform,
    zIndex: count - d,
    filter: d === 0 ? 'none' : `brightness(${1 - d * 0.03}) saturate(${1 - d * 0.06})`,
    opacity: d > 2 ? 0 : 1
  }
}

// Lift the front card off the stack, then swap indices so it glides down
// into the back slot while the next card comes forward.
const LEAVE_MS = 340
const goTo = (target: number) => {
  if (leaving.value || target === active.value || count < 2) return
  leaving.value = true
  restartAutoplay()
  setTimeout(() => {
    active.value = target
    leaving.value = false
  }, LEAVE_MS)
}

const next = () => goTo((active.value + 1) % count)

const onStackClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('a')) return
  next()
}

// Auto-advance every few seconds; paused while hovered, skipped entirely
// for users who prefer reduced motion.
const AUTOPLAY_MS = 4500
let timer: ReturnType<typeof setInterval> | undefined
let reducedMotion = false
const hovered = ref(false)

const restartAutoplay = () => {
  if (timer) clearInterval(timer)
  if (reducedMotion || count < 2) return
  timer = setInterval(() => {
    if (!hovered.value) next()
  }, AUTOPLAY_MS)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  restartAutoplay()
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Move the spotlight glow to the cursor by writing its position into CSS vars
// on the hovered card (read by the .spotlight-border gradient below).
const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section
    v-if="testimonials.length"
    class="py-20 sm:py-28 bg-background overflow-x-clip"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="20"
        :blur="4"
      >
        <SectionEyebrow
          :label="$t('testimonials.eyebrow')"
          class="mb-12"
        />
      </ScrollReveal>

      <ScrollReveal
        :y="24"
        :blur="4"
      >
        <div
          class="paper-stack relative mx-auto grid max-w-2xl"
          :class="count > 1 ? 'cursor-pointer' : ''"
          :role="count > 1 ? 'button' : undefined"
          :tabindex="count > 1 ? 0 : undefined"
          :aria-label="count > 1 ? $t('testimonials.next') : undefined"
          @click="onStackClick"
          @keydown.enter.prevent="next"
          @keydown.space.prevent="next"
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
        >
          <figure
            v-for="(t, i) in testimonials"
            :key="t.id"
            class="paper-card glass-card group/card relative flex flex-col overflow-hidden rounded-2xl p-6 sm:p-8"
            :style="cardStyle(i)"
            @mousemove="onMove"
          >
            <!-- Cursor-following colored border (front card only) -->
            <div
              v-if="depthOf(i) === 0"
              class="spotlight-border pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            />

            <div class="relative z-10 flex flex-1 flex-col">
              <UIcon
                name="i-lucide-quote"
                class="size-6 text-gray-300 mb-4 shrink-0"
              />
              <blockquote class="flex-1 text-base sm:text-lg leading-relaxed text-heading dark:text-white/90">
                {{ t.quote }}
              </blockquote>
              <figcaption class="mt-6 text-sm">
                <template v-if="t.author">
                  <span class="font-semibold text-heading dark:text-white/90">{{ t.author }}</span>
                  <span
                    v-if="t.role"
                    class="text-muted"
                  > — {{ t.role }}</span>
                  <a
                    v-if="t.link"
                    :href="t.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-2 inline-flex items-center gap-1 font-bold text-heading dark:text-white hover:underline"
                  >
                    View on Upwork
                  </a>
                </template>
                <span
                  v-else
                  class="font-medium text-muted"
                >Upwork client</span>
              </figcaption>
            </div>
          </figure>
        </div>

        <div
          v-if="count > 1"
          class="mt-10 flex justify-center gap-2.5"
        >
          <button
            v-for="(t, i) in testimonials"
            :key="`dot-${t.id}`"
            type="button"
            class="dot h-2 rounded-full transition-all duration-300"
            :class="i === active
              ? 'w-7 bg-primary'
              : 'w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40'"
            :aria-label="$t('testimonials.goTo', { name: t.author || `${i + 1}` })"
            :aria-current="i === active ? 'true' : undefined"
            @click="goTo(i)"
          />
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

<style scoped>
/* Every card occupies the same grid cell so the stack's height follows the
   tallest quote while the cards layer on top of each other. */
.paper-stack > .paper-card {
  grid-area: 1 / 1;
  transition:
    transform 0.55s cubic-bezier(0.34, 1.25, 0.45, 1),
    opacity 0.4s ease,
    filter 0.55s ease;
  will-change: transform;
}

/* Same frosted recipe as the Services cards, but near-opaque: stacked papers
   can't let the quotes behind them bleed through. */
.glass-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.paper-stack:hover .glass-card {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.dark .glass-card {
  background: rgba(38, 38, 38, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dark .paper-stack:hover .glass-card {
  background: rgba(38, 38, 38, 0.98);
}

/* Colored border that lights up at the cursor: paint the radial gradient over
   the whole card, then mask out everything except the 1.5px border ring. */
.spotlight-border {
  padding: 1.5px;
  background: radial-gradient(
    200px circle at var(--mx, 50%) var(--my, 50%),
    rgba(161, 30, 226, 0.9),
    transparent 60%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
</style>
