<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <section class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
    <!-- Background Image - positioned right and bottom -->
    <div class="absolute right-0 bottom-0 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px] pointer-events-none">
      <img
        src="/background-rolls.png"
        alt=""
        class="w-full h-full object-contain opacity-40"
      >
    </div>

    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col gap-24 sm:gap-28 lg:gap-32 relative z-10">
      <!-- Top Container - Left aligned -->
      <Motion
        :initial="{ opacity: 0, x: -40 }"
        :while-in-view="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8 }"
        :in-view-options="{ once: true }"
        class="flex flex-col gap-20 sm:gap-16 text-left w-full"
      >
        <p class="font-medium italic text-xl sm:text-2xl text-primary-custom dark:text-primary-custom-dark">
          Hey!! I'm Ailen Gonzalez
        </p>
        <div class="flex flex-col gap-2 sm:gap-2">
          <h2 class="font-display lowercase text-6xl sm:text-8xl lg:text-9xl xl:text-[90px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-wide leading-[0.95]">
            product designer
          </h2>
          <p class="font-medium text-xl sm:text-xl text-[#848484] max-w-3xl">
            Focus in user experience, modern and clean designs.
          </p>
        </div>
      </Motion>

      <!-- Bottom Container - Right aligned -->
      <Motion
        :initial="{ opacity: 0, x: 40 }"
        :while-in-view="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8, delay: 0.15 }"
        :in-view-options="{ once: true }"
        class="flex flex-col gap-20 sm:gap-16 items-end text-right w-full"
      >
        <div class="flex flex-col gap-2 sm:gap-2 w-full items-end">
          <h2 class="font-mono font-light lowercase text-5xl sm:text-7xl lg:text-8xl xl:text-[80px] text-primary-custom dark:text-primary-custom-dark tracking-wide leading-[0.95] w-full text-right">
            frontend developer
          </h2>
          <p class="font-medium text-xl sm:text-xl text-[#848484] max-w-3xl">
            Focus in user experience, modern and clean designs.
          </p>
        </div>
        <div class="flex items-center gap-2 text-primary-custom dark:text-primary-custom-dark">
          <UIcon
            name="i-lucide-map-pin"
            class="size-6 sm:size-7"
          />
          <span class="text-lg sm:text-xl">Based in Argentina</span>
        </div>
      </Motion>
    </div>
  </section>
</template>
