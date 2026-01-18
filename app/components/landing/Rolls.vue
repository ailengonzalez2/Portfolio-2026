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
</script>

<template>
  <!-- Scroll container - provides the scroll distance for the animation -->
  <div
    ref="containerRef"
    class="relative h-[200vh] z-20"
  >
    <!-- Sticky wrapper - keeps content fixed while scrolling through container -->
    <div class="sticky top-0 h-screen pointer-events-none">
      <!-- TOP HALF - moves up on scroll, clips top 50% of content -->
      <Motion
        :style="{ y: topY, opacity: splitOpacity }"
        class="absolute inset-0 bg-[#F8F8F8] dark:bg-[#0a0a0a] z-30"
        style="clip-path: inset(0 0 50% 0)"
      >
        <div class="h-full flex items-center justify-center">
          <div class="max-w-6xl w-full px-6 sm:px-8 lg:px-12">
            <!-- Top label -->
            <p class="font-medium tracking-widest text-sm sm:text-base text-[#848484] uppercase mb-6 sm:mb-8">
              Hey!! I'm Ailen Gonzalez
            </p>

            <!-- Product -->
            <div class="pl-0 sm:pl-4 lg:pl-8">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Product
              </h2>
            </div>

            <!-- Designer -->
            <div class="pl-12 sm:pl-24 lg:pl-40 xl:pl-56">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Designer
              </h2>
            </div>

            <!-- Frontend -->
            <div class="pl-4 sm:pl-12 lg:pl-20 mt-2 sm:mt-4">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Frontend
              </h2>
            </div>

            <!-- Developer -->
            <div class="pl-20 sm:pl-32 lg:pl-48 xl:pl-64">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Developer
              </h2>
            </div>

            <!-- Bottom label -->
            <div class="mt-10 sm:mt-14 flex justify-end">
              <div class="flex items-center gap-2 text-[#848484]">
                <span class="font-medium tracking-widest text-sm sm:text-base uppercase">Based in Argentina</span>
                <UIcon name="i-lucide-map-pin" class="size-5 sm:size-6" />
              </div>
            </div>
          </div>
        </div>
      </Motion>

      <!-- BOTTOM HALF - moves down and off screen -->
      <Motion
        :style="{ y: bottomY, opacity: splitOpacity }"
        class="absolute inset-0 bg-[#F8F8F8] dark:bg-[#0a0a0a] z-30"
        style="clip-path: inset(50% 0 0 0)"
      >
        <div class="h-full flex items-center justify-center">
          <div class="max-w-6xl w-full px-6 sm:px-8 lg:px-12">
            <!-- Top label -->
            <p class="font-medium tracking-widest text-sm sm:text-base text-[#848484] uppercase mb-6 sm:mb-8">
              Hey!! I'm Ailen Gonzalez
            </p>

            <!-- Product -->
            <div class="pl-0 sm:pl-4 lg:pl-8">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Product
              </h2>
            </div>

            <!-- Designer -->
            <div class="pl-12 sm:pl-24 lg:pl-40 xl:pl-56">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Designer
              </h2>
            </div>

            <!-- Frontend -->
            <div class="pl-4 sm:pl-12 lg:pl-20 mt-2 sm:mt-4">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Frontend
              </h2>
            </div>

            <!-- Developer -->
            <div class="pl-20 sm:pl-32 lg:pl-48 xl:pl-64">
              <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
                Developer
              </h2>
            </div>

            <!-- Bottom label -->
            <div class="mt-10 sm:mt-14 flex justify-end">
              <div class="flex items-center gap-2 text-[#848484]">
                <span class="font-medium tracking-widest text-sm sm:text-base uppercase">Based in Argentina</span>
                <UIcon name="i-lucide-map-pin" class="size-5 sm:size-6" />
              </div>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>
