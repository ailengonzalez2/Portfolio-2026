<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <section class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <!-- Top label -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
        class="mb-6 sm:mb-8"
      >
        <p class="font-medium tracking-widest text-sm sm:text-base text-[#848484] uppercase">
          Hey!! I'm Ailen Gonzalez
        </p>
      </Motion>

      <!-- Staggered Typography -->
      <div class="flex flex-col gap-0 leading-none">
        <!-- Product Designer - Left aligned -->
        <Motion
          :initial="{ opacity: 0, x: -60 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7 }"
          :in-view-options="{ once: true }"
          class="pl-0 sm:pl-4 lg:pl-8"
        >
          <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
            Product
          </h2>
        </Motion>

        <Motion
          :initial="{ opacity: 0, x: 60 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7, delay: 0.1 }"
          :in-view-options="{ once: true }"
          class="pl-12 sm:pl-24 lg:pl-40 xl:pl-56"
        >
          <h2 class="font-sans uppercase text-6xl sm:text-8xl lg:text-9xl xl:text-[160px] text-[#3c4b5f] dark:text-[#7a8fa8] tracking-tight leading-[0.85] font-bold">
            Designer
          </h2>
        </Motion>

        <!-- Frontend Developer - Staggered right -->
        <Motion
          :initial="{ opacity: 0, x: -60 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7, delay: 0.2 }"
          :in-view-options="{ once: true }"
          class="pl-4 sm:pl-12 lg:pl-20 mt-2 sm:mt-4"
        >
          <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-primary-custom dark:text-primary-custom-dark tracking-tight leading-[0.85] font-bold italic">
            Frontend
          </h2>
        </Motion>

        <Motion
          :initial="{ opacity: 0, x: 60 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7, delay: 0.3 }"
          :in-view-options="{ once: true }"
          class="pl-20 sm:pl-32 lg:pl-48 xl:pl-64"
        >
          <h2 class="font-sans uppercase text-5xl sm:text-7xl lg:text-8xl xl:text-[140px] text-primary-custom dark:text-primary-custom-dark tracking-tight leading-[0.85] font-bold italic">
            Developer
          </h2>
        </Motion>
      </div>

      <!-- Bottom label -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }"
        :in-view-options="{ once: true }"
        class="mt-10 sm:mt-14 flex justify-end"
      >
        <div class="flex items-center gap-2 text-[#848484]">
          <span class="font-medium tracking-widest text-sm sm:text-base uppercase">Based in Argentina</span>
          <UIcon
            name="i-lucide-map-pin"
            class="size-5 sm:size-6"
          />
        </div>
      </Motion>
    </div>
  </section>
</template>
