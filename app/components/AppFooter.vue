<script setup lang="ts">
const { global } = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-10 min-h-screen flex flex-col bg-[#0a0a0a] text-white">
    <section
      id="contact"
      class="flex-1 flex flex-col items-center justify-center py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div class="w-full max-w-6xl mx-auto">
        <!-- Brand statement: Design + Code + AI -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
          class="text-center"
        >
          <h2 class="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-1 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
            <span>{{ $t('prefooter.design') }}</span>
            <span class="text-white/30 font-light">+</span>
            <span>{{ $t('prefooter.code') }}</span>
            <span class="text-white/30 font-light">+</span>
            <span class="btn-gradient-text">{{ $t('prefooter.ai') }}</span>
          </h2>
        </Motion>

        <!-- Divider -->
        <div class="my-8 sm:my-12 h-px w-full max-w-xs mx-auto bg-white/10" />

        <!-- Contact -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
          class="flex flex-col items-center gap-10"
        >
          <!-- Book a call CTA -->
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
            class="bg-white text-[#0a0a0a] hover:bg-white/90 font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('hero.bookCall') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>
        </Motion>
      </div>
    </section>

    <!-- Footer Credits -->
    <div class="py-8 border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center text-white/50">
          <p class="font-sans text-xs sm:text-base text-center">
            <span>© {{ year }} – Designed &amp; Coded by </span>
            <NuxtLink
              to="https://www.linkedin.com/in/ailengonzalez/"
              target="_blank"
              class="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Ailen Gonzalez
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
