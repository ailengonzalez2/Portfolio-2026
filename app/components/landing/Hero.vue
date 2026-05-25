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

// Hero content animations - staggered reveal during the split
const badgeOpacity = useTransform(scrollYProgress, [0.15, 0.33], [0, 1])
const badgeY = useTransform(scrollYProgress, [0.15, 0.38], [-30, 0])

const techOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
const techY = useTransform(scrollYProgress, [0.2, 0.42], [-20, 0])

const showcaseOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1])
const showcaseY = useTransform(scrollYProgress, [0.25, 0.52], [40, 0])

const ctaOpacity = useTransform(scrollYProgress, [0.38, 0.58], [0, 1])
const ctaY = useTransform(scrollYProgress, [0.38, 0.62], [40, 0])

// Tech stack icons for the horizontal carousel
const techLogos = [
  { icon: '/tech-icons/figma-color.svg', label: 'Figma' },
  { icon: '/tech-icons/vue-color.svg', label: 'Vue' },
  { icon: '/tech-icons/nuxt.svg', label: 'Nuxt' },
  { icon: '/tech-icons/tailwind-color.svg', label: 'Tailwind' },
  { icon: '/tech-icons/javascript-color.svg', label: 'JavaScript' },
  { icon: '/tech-icons/claude-color.png', label: 'Claude' },
  { icon: '/tech-icons/copilot-color.png', label: 'GitHub Copilot' },
  { icon: '/tech-icons/n8n.svg', label: 'n8n' },
  { icon: '/tech-icons/ethereum-color.png', label: 'Ethereum' },
  { icon: '/tech-icons/github-color.svg', label: 'GitHub' }
]

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
    <section class="sticky top-0 h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden pt-24 sm:pt-28 pb-8">
      <!-- Hidden heading kept for SEO / accessibility (banner is visual-only) -->
      <h1 class="sr-only">
        Ailen Gonzalez — AI Product Engineer
      </h1>

      <!-- 1. Book-a-call pill with avatar + spots indicator (top) -->
      <Motion
        :style="{ opacity: badgeOpacity, y: badgeY }"
        class="flex flex-col items-center gap-3 mb-5 sm:mb-6"
      >
        <NuxtLink
          :to="global.meetingLink"
          target="_blank"
          class="group inline-flex items-center gap-2.5 pl-1.5 pr-5 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md ring-1 ring-black/5 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
        >
          <span class="flex items-center justify-center size-7 rounded-full bg-linear-to-br from-primary to-secondary text-white text-[11px] font-semibold ring-2 ring-white/25 dark:ring-black/10">
            AG
          </span>
          <span class="text-sm font-medium">{{ $t('hero.bookCall') }}</span>
        </NuxtLink>

        <div
          v-if="global.available"
          class="inline-flex items-center gap-2"
        >
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span class="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 tracking-wide">
            {{ $t('hero.spotsAvailable') }}
          </span>
        </div>
      </Motion>

      <!-- 2. Faded tech-logo marquee (infinite scroll) -->
      <Motion
        :style="{ opacity: techOpacity, y: techY }"
        class="w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl px-4 mb-6 sm:mb-8"
      >
        <div class="relative overflow-hidden mask-horizontal">
          <div class="flex items-center animate-marquee w-max hover:[animation-play-state:paused]">
            <!-- First set -->
            <div class="flex items-center gap-7 sm:gap-9 lg:gap-12 pr-7 sm:pr-9 lg:pr-12">
              <img
                v-for="tech in techLogos"
                :key="tech.label"
                :src="tech.icon"
                :alt="tech.label"
                :title="tech.label"
                class="h-6 sm:h-7 lg:h-8 w-auto object-contain shrink-0 grayscale opacity-40 transition duration-300 hover:grayscale-0 hover:opacity-100"
              >
            </div>
            <!-- Duplicated set for seamless loop -->
            <div
              class="flex items-center gap-7 sm:gap-9 lg:gap-12 pr-7 sm:pr-9 lg:pr-12"
              aria-hidden="true"
            >
              <img
                v-for="tech in techLogos"
                :key="`${tech.label}-dup`"
                :src="tech.icon"
                :alt="tech.label"
                class="h-6 sm:h-7 lg:h-8 w-auto object-contain shrink-0 grayscale opacity-40 transition duration-300 hover:grayscale-0 hover:opacity-100"
              >
            </div>
          </div>
        </div>
      </Motion>

      <!-- 3. Full-width vertical project columns -->
      <Motion
        :style="{ opacity: showcaseOpacity, y: showcaseY }"
        class="w-screen"
      >
        <div class="mask-vertical h-[38vh] sm:h-[48vh] lg:h-[54vh] overflow-hidden px-3 sm:px-4">
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
        class="mt-7 sm:mt-9 flex justify-center items-center gap-3"
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

.mask-horizontal {
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}

/* Horizontal tech carousel */
.animate-marquee {
  animation: marquee 22s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
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
  .animate-marquee,
  .animate-scroll-up,
  .animate-scroll-down {
    animation: none;
  }
}
</style>
