<script setup lang="ts">
</script>

<template>
  <section class="relative py-20 sm:py-28 lg:py-36">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col gap-24 sm:gap-28 lg:gap-32">
      <!-- Top Container - Left aligned -->
      <Motion
        :initial="{ opacity: 0, x: -40 }"
        :while-in-view="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8 }"
        :in-view-options="{ once: true }"
        class="flex flex-col gap-20 sm:gap-24 text-left w-full"
      >
        <p class="font-medium italic text-xl sm:text-2xl text-primary-custom dark:text-primary-custom-dark">
          Hey!! I'm Ailen Gonzalez
        </p>
        <div class="flex flex-col gap-10 sm:gap-8">
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
        class="flex flex-col gap-20 sm:gap-24 items-end text-right w-full"
      >
        <div class="flex flex-col gap-10 sm:gap-8 w-full items-end">
          <h2 class="font-mono font-light lowercase text-5xl sm:text-7xl lg:text-8xl xl:text-[80px] text-primary-custom dark:text-primary-custom-dark tracking-wide leading-[0.95] w-full text-right">
            frontend developer
          </h2>
          <p class="font-medium text-xl sm:text-xl text-[#848484] max-w-3xl">
            Focus in user experience, modern and clean designs.
          </p>
        </div>
        <div class="flex items-center gap-2 text-primary-custom dark:text-primary-custom-dark">
          <UIcon name="i-lucide-map-pin" class="size-6 sm:size-7" />
          <span class="text-lg sm:text-xl">Based in Argentina</span>
        </div>
      </Motion>
    </div>
  </section>
</template>
