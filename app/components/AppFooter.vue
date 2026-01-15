<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const year = new Date().getFullYear()

// Scroll detection - same logic as SocialSidebar for synchronized animation
const { y } = useWindowScroll()
const { height } = useWindowSize()

const isExpanded = computed(() => {
  if (!import.meta.client) return false
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
  // Expand when within 200px of the bottom (matches SocialSidebar)
  return scrollPosition >= scrollHeight - 200
})
</script>

<template>
  <footer class="relative z-10 bg-background">
    <!-- Contact Section -->
    <section
      id="contact"
      class="py-20 sm:py-32 relative border-b border-default/50"
    >
      <!-- Subtle background gradient -->
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/20 to-transparent pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Container with flex row for arrow and text -->
        <div class="flex flex-col lg:flex-row items-center lg:items-end justify-end gap-8 lg:gap-12 xl:gap-16">
          <!-- Arrow pointing to social sidebar - animates with sidebar expansion -->
          <div class="flex justify-end">
            <img
              src="/arrow-footer.png"
              alt=""
              aria-hidden="true"
              class="arrow-reveal w-2/4 h-auto object-contain"
              :class="isExpanded ? 'revealed' : ''"
            >
          </div>

          <!-- Main heading -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            :in-view-options="{ once: true }"
          >
            <h2 class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-medium tracking-wide leading-tight text-right">
              Happy to connect
            </h2>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Footer Credits -->
    <div class="py-8 border-t border-default/50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center text-primary-custom dark:text-primary-custom-dark">
          <!-- Credits -->
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

<style scoped>
.arrow-reveal {
  clip-path: inset(0 0 0 100%);
  transition: clip-path 1.2s ease-out;
}

.arrow-reveal.revealed {
  clip-path: inset(0 0 0 0);
}
</style>
