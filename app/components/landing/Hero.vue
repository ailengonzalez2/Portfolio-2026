<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { ref } from 'vue'
import { projects } from '~/data/projects'

// Reference to scroll container
const containerRef = ref<HTMLElement | null>(null)

// Track scroll progress - same timing as Rolls split
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
})

// Hero content animations - staggered reveal during the split
const showcaseOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1])
const showcaseY = useTransform(scrollYProgress, [0.25, 0.52], [40, 0])

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
    <section class="sticky top-0 h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <!-- Hidden heading kept for SEO / accessibility (banner is visual-only) -->
      <h1 class="sr-only">
        Ailen Gonzalez — AI Product Design & Frontend
      </h1>

      <!-- Full-viewport vertical project columns -->
      <Motion
        :style="{ opacity: showcaseOpacity, y: showcaseY }"
        class="absolute inset-0 w-screen"
      >
        <div class="mask-vertical h-full overflow-hidden px-3 sm:px-4">
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
    </section>
  </div>
</template>

<style scoped>
.mask-vertical {
  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
}

/* Vertical project columns */
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
