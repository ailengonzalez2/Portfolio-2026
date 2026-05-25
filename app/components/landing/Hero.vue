<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { ref } from 'vue'
import { projects } from '~/data/projects'

const { global } = useAppConfig()

// Reference to scroll container
const containerRef = ref<HTMLElement | null>(null)

// Track scroll progress - same timing as Rolls split
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
})

// Hero content animations - appear during the split (0.15 to 0.5)
const badgeOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])
const badgeY = useTransform(scrollYProgress, [0.15, 0.4], [-30, 0])

const showcaseOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1])
const showcaseY = useTransform(scrollYProgress, [0.2, 0.5], [40, 0])

const ctaOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1])
const ctaY = useTransform(scrollYProgress, [0.35, 0.6], [40, 0])

// Vertical project columns spanning the full width. Each column draws a
// different rotation of the project list (so adjacent columns are NOT
// aligned) and scrolls at its own speed/direction, looping infinitely.
const COLUMN_DIRECTIONS = ['up', 'down', 'up', 'down', 'up'] as const
const COLUMN_DURATIONS = ['34s', '27s', '40s', '24s', '31s']

const columns = COLUMN_DIRECTIONS.map((direction, i) => {
  const start = (i * 2) % projects.length
  const items = Array.from(
    { length: 5 },
    (_, k) => projects[(start + k) % projects.length]
  )
  return {
    direction,
    duration: COLUMN_DURATIONS[i],
    // Duplicate the slice for a seamless translateY(-50%) loop
    loop: [...items, ...items]
  }
})
</script>

<template>
  <!-- Scroll container matching Rolls height for synced animations -->
  <div
    ref="containerRef"
    class="absolute inset-0 h-[200vh] z-10"
  >
    <!-- Sticky Hero content - revealed during Rolls split -->
    <section class="sticky top-0 h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <!-- Hidden heading kept for SEO / accessibility (banner is visual-only) -->
      <h1 class="sr-only">
        Ailen Gonzalez — AI Product Engineer
      </h1>

      <!-- Available for work pill (top) -->
      <Motion
        v-if="global.available"
        :style="{ opacity: badgeOpacity, y: badgeY }"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 mb-6 sm:mb-8"
      >
        <span class="relative flex size-2">
          <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span class="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 tracking-wide">
          {{ $t('hero.available') }}
        </span>
      </Motion>

      <!-- Full-width vertical project columns -->
      <Motion
        :style="{ opacity: showcaseOpacity, y: showcaseY }"
        class="w-screen"
      >
        <div class="mask-vertical h-[46vh] sm:h-[56vh] lg:h-[64vh] overflow-hidden px-3 sm:px-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 h-full">
            <div
              v-for="(col, i) in columns"
              :key="i"
              class="overflow-hidden"
              :class="{ 'hidden sm:block': i === 2, 'hidden lg:block': i > 2 }"
            >
              <div
                class="flex flex-col gap-3 sm:gap-4 will-change-transform"
                :class="col.direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'"
                :style="{ animationDuration: col.duration }"
              >
                <div
                  v-for="(project, idx) in col.loop"
                  :key="`${i}-${idx}`"
                  class="shrink-0 aspect-4/3 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm"
                >
                  <NuxtImg
                    :src="project.image"
                    :alt="project.title"
                    class="size-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Motion>

      <!-- CTAs (under the animation) -->
      <Motion
        :style="{ opacity: ctaOpacity, y: ctaY }"
        class="mt-8 sm:mt-10 flex justify-center items-center gap-3"
      >
        <UButton
          :to="global.meetingLink"
          target="_blank"
          size="lg"
          class="btn-gradient text-white font-medium rounded-full px-6"
        >
          {{ $t('hero.bookCall') }}
          <template #trailing>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </template>
        </UButton>

        <UButton
          to="/#projects"
          variant="outline"
          color="neutral"
          size="lg"
          class="rounded-full px-6"
        >
          {{ $t('hero.seeWork') }}
        </UButton>
      </Motion>
    </section>
  </div>
</template>

<style scoped>
.mask-vertical {
  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
}

.animate-scroll-up,
.animate-scroll-down {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.animate-scroll-up {
  animation-name: scroll-up;
}

.animate-scroll-down {
  animation-name: scroll-down;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes scroll-down {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-scroll-up,
  .animate-scroll-down {
    animation: none;
  }
}
</style>
