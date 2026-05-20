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
const ctaOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1])
const ctaY = useTransform(scrollYProgress, [0.25, 0.5], [40, 0])

const carouselOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
const carouselY = useTransform(scrollYProgress, [0.3, 0.55], [40, 0])

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
</script>

<template>
  <!-- Scroll container matching Rolls height for synced animations -->
  <div
    ref="containerRef"
    class="absolute inset-0 h-[200vh] z-10"
  >
    <!-- Sticky Hero content - revealed during Rolls split -->
    <section class="sticky top-0 h-screen flex flex-col justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <!-- Availability + Headline group -->
        <Motion
          :style="{ opacity: contentOpacity, y: contentY }"
          class="flex flex-col items-end"
        >
          <!-- Available for work pill -->
          <div
            v-if="global.available"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 mb-5 sm:mb-6"
          >
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span class="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 tracking-wide">
              {{ $t('hero.available') }}
            </span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl xl:text-[120px] font-medium tracking-tight leading-[1.05] text-primary-custom dark:text-gray-200 uppercase text-right">
            AI Product <br>
            Engineer
          </h1>

          <!-- Subtitle / positioning line -->
          <p class="mt-5 sm:mt-6 max-w-md sm:max-w-lg lg:max-w-xl text-right text-sm sm:text-base lg:text-lg text-[#5a5a5a] dark:text-gray-400 leading-relaxed">
            {{ $t('hero.subtitle') }}
          </p>
        </Motion>

        <!-- CTAs -->
        <Motion
          :style="{ opacity: ctaOpacity, y: ctaY }"
          class="mt-6 sm:mt-8 flex justify-end items-center gap-3"
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

        <!-- Tech Stack Icons Carousel -->
        <Motion
          :style="{ opacity: carouselOpacity, y: carouselY }"
          class="mt-8 sm:mt-10 lg:mt-12"
        >
          <div class="relative overflow-hidden max-w-[240px] sm:max-w-[450px] lg:max-w-[700px] ml-auto mask-gradient">
            <div class="flex items-center animate-marquee w-max">
              <div class="flex items-center gap-1.5 sm:gap-2.5 pr-1.5 sm:pr-2.5">
                <div
                  v-for="tech in techLogos"
                  :key="tech.label"
                  class="flex items-center justify-center size-10 sm:size-12 lg:size-14 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 shrink-0 p-1.5 sm:p-2"
                  :title="tech.label"
                >
                  <img
                    :src="tech.icon"
                    :alt="tech.label"
                    class="w-full h-full object-contain"
                  >
                </div>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2.5 pr-1.5 sm:pr-2.5">
                <div
                  v-for="tech in techLogos"
                  :key="`${tech.label}-dup`"
                  class="flex items-center justify-center size-10 sm:size-12 lg:size-14 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 shrink-0 p-1.5 sm:p-2"
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
