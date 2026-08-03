<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)

const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
})

// Split animation - smooth synchronized movement
const topY = useTransform(scrollYProgress, [0, 0.15, 0.6], ['0%', '0%', '-100%'])
const bottomY = useTransform(scrollYProgress, [0, 0.15, 0.6], ['0%', '0%', '100%'])

// Opacity - disappear only after going off screen
const splitOpacity = useTransform(scrollYProgress, [0, 0.55, 0.65], [1, 1, 0])

// Intro CTA bar (badge + subtitle + buttons) - fades out as the split begins
// so it doesn't linger over the showcase columns.
const ctaOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0])
const ctaPointerEvents = useTransform(scrollYProgress, v => (v < 0.18 ? 'auto' : 'none'))

const { global } = useAppConfig()
const localePath = useLocalePath()
</script>

<template>
  <!-- Scroll container - provides the scroll distance for the animation -->
  <div
    ref="containerRef"
    class="relative h-[200vh] z-20 -mt-20"
  >
    <!-- Sticky wrapper - keeps content fixed while scrolling through container -->
    <div class="sticky top-0 h-[calc(100vh+5rem)] pointer-events-none overflow-hidden">
      <!-- TOP HALF - moves up on scroll, clips top 50% of content -->
      <Motion
        :style="{ y: topY, opacity: splitOpacity }"
        class="absolute inset-0 bg-black z-30"
        style="clip-path: inset(0 0 50% 0)"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="max-w-6xl w-full px-6 sm:px-8 lg:px-12 mx-auto">
            <!-- AI Product -->
            <div class="pl-0 sm:pl-4 lg:pl-8">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold whitespace-nowrap">
                AI Product
              </h2>
            </div>

            <!-- Design -->
            <div class="pl-4 sm:pl-12 lg:pl-20 mt-2 sm:mt-4">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                Design
              </h2>
            </div>

            <!-- & -->
            <div class="pl-16 sm:pl-32 lg:pl-52 xl:pl-72">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                &
              </h2>
            </div>

            <!-- Frontend -->
            <div class="pl-20 sm:pl-32 lg:pl-48 xl:pl-64">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                Frontend
              </h2>
            </div>
          </div>
        </div>
      </Motion>

      <!-- BOTTOM HALF - moves down and off screen -->
      <Motion
        :style="{ y: bottomY, opacity: splitOpacity }"
        class="absolute inset-0 bg-black z-30"
        style="clip-path: inset(50% 0 0 0)"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="max-w-6xl w-full px-6 sm:px-8 lg:px-12 mx-auto">
            <!-- AI Product -->
            <div class="pl-0 sm:pl-4 lg:pl-8">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold whitespace-nowrap">
                AI Product
              </h2>
            </div>

            <!-- Design -->
            <div class="pl-4 sm:pl-12 lg:pl-20 mt-2 sm:mt-4">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                Design
              </h2>
            </div>

            <!-- & -->
            <div class="pl-16 sm:pl-32 lg:pl-52 xl:pl-72">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                &
              </h2>
            </div>

            <!-- Frontend -->
            <div class="pl-20 sm:pl-32 lg:pl-48 xl:pl-64">
              <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-white tracking-tight leading-[0.85] font-bold">
                Frontend
              </h2>
            </div>
          </div>
        </div>
      </Motion>

      <!-- CTA bar: value prop + availability + primary actions, above the fold -->
      <Motion
        :style="{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents }"
        class="absolute inset-x-0 bottom-0 z-40 pb-6 sm:pb-8"
      >
        <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div class="max-w-md">
            <p class="flex items-center gap-2 text-sm font-medium text-white">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {{ $t('hero.available') }}
              <span class="text-neutral-500">·</span>
              <span class="text-neutral-400">{{ $t('hero.spotsAvailable') }}</span>
            </p>
            <p class="mt-2 hidden sm:block text-sm text-neutral-400 leading-relaxed">
              {{ $t('hero.subtitle') }}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <UButton
              :to="global.meetingLink"
              target="_blank"
              size="lg"
              class="bg-white hover:bg-neutral-200 text-neutral-900 font-semibold rounded-full px-7 py-3 text-base"
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
              :to="localePath('/projects')"
              size="lg"
              variant="ghost"
              class="text-white hover:bg-white/10 font-semibold rounded-full px-6 py-3 text-base"
            >
              {{ $t('hero.seeWork') }}
              <template #trailing>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4"
                />
              </template>
            </UButton>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
