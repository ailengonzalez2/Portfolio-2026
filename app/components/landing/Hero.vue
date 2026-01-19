<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { ref } from 'vue'

const { global } = useAppConfig()

// Reference to scroll container
const containerRef = ref<HTMLElement | null>(null)

// Track scroll progress - same timing as Rolls split
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
})

// Hero content animations - appear during the split (0.15 to 0.5)
const contentOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])
const contentY = useTransform(scrollYProgress, [0.15, 0.4], [60, 0])

// Staggered elements
const badgeOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
const badgeY = useTransform(scrollYProgress, [0.2, 0.4], [40, 0])

const carouselOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1])
const carouselY = useTransform(scrollYProgress, [0.3, 0.5], [40, 0])

const techLogos = [
  { icon: '/tech-icons/figma-color.svg', label: 'Figma' },
  { icon: '/tech-icons/html-color.svg', label: 'HTML5' },
  { icon: '/tech-icons/css-color.svg', label: 'CSS3' },
  { icon: '/tech-icons/vue-color.svg', label: 'Vue' },
  { icon: '/tech-icons/tailwind-color.svg', label: 'Tailwind' },
  { icon: '/tech-icons/bootstrap-color.svg', label: 'Bootstrap' },
  { icon: '/tech-icons/javascript-color.svg', label: 'JavaScript' },
  { icon: '/tech-icons/github-color.svg', label: 'GitHub' },
  { icon: '/tech-icons/xd-color.svg', label: 'Adobe XD' },
  { icon: '/tech-icons/wp-color.svg', label: 'WordPress' },
  { icon: '/tech-icons/claude-color.png', label: 'Claude' },
  { icon: '/tech-icons/copilot-color.png', label: 'Copilot' },
  { icon: '/tech-icons/ethereum-color.png', label: 'Ethereum' }
]
</script>

<template>
  <!-- Scroll container matching Rolls height for synced animations -->
  <div
    ref="containerRef"
    class="absolute inset-0 h-[200vh] z-10"
  >
    <!-- Sticky Hero content - revealed during Rolls split -->
    <section class="sticky top-0 h-screen flex flex-col justify-end pb-4 lg:pb-6 bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Available Badge -->
      <Motion
        :style="{ opacity: badgeOpacity, y: badgeY }"
        class="mb-10 lg:mb-12"
      >
        <div
          class="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,0.3)]"
        >
          <div class="flex items-center gap-3">
            <span class="relative flex size-2.5">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75 animate-ping"
                :class="global.available ? 'bg-emerald-400' : 'bg-red-400'"
              />
              <span
                class="relative inline-flex size-2.5 rounded-full"
                :class="global.available ? 'bg-emerald-400' : 'bg-red-400'"
              />
            </span>
            <span class="text-gray-400 dark:text-gray-500 text-base">
              {{ global.available ? 'Available for projects' : 'Not available' }}
            </span>
          </div>
          <span class="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span class="text-gray-400 dark:text-gray-500 text-base">GMT-3</span>
        </div>
      </Motion>

      <!-- Main Headline -->
      <Motion
        :style="{ opacity: contentOpacity, y: contentY }"
      >
        <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-[120px] font-medium tracking-tight leading-[1.15] text-primary-custom dark:text-gray-200 uppercase text-right">
          <span class="pr-8 sm:pr-12 lg:pr-16 xl:pr-20 whitespace-nowrap">Creating digital</span> <br>
          experiences
        </h1>
      </Motion>

      <!-- Tech Stack Icons Carousel -->
      <Motion
        :style="{ opacity: carouselOpacity, y: carouselY }"
        class="mt-8 sm:mt-10 lg:mt-12"
      >
        <div class="relative overflow-hidden max-w-[500px] mask-gradient">
          <div class="flex items-center animate-marquee w-max">
            <div class="flex items-center gap-2.5 pr-2.5">
              <div
                v-for="tech in techLogos"
                :key="tech.label"
                class="flex items-center justify-center size-14 rounded-2xl bg-white dark:bg-gray-900 shrink-0 p-2"
                :title="tech.label"
              >
                <img
                  :src="tech.icon"
                  :alt="tech.label"
                  class="w-full h-full object-contain"
                >
              </div>
            </div>
            <div class="flex items-center gap-2.5 pr-2.5">
              <div
                v-for="tech in techLogos"
                :key="`${tech.label}-dup`"
                class="flex items-center justify-center size-14 rounded-2xl bg-white dark:bg-gray-900 shrink-0 p-2"
                :title="tech.label"
              >
                <img
                  :src="tech.icon"
                  :alt="tech.label"
                  class="w-full h-full object-contain"
                >
              </div>
            </div>
          </div>
        </div>
      </Motion>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mask-gradient {
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.animate-marquee {
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
