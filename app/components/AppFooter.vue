<script setup lang="ts">
import { useWindowScroll, useWindowSize, useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

const { global } = useAppConfig()
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

// Word-by-word animation for "Happy to connect"
const headingText = 'Happy to connect'
const headingWords = headingText.split(' ')
const headingRef = ref<HTMLElement | null>(null)
const isHeadingVisible = ref(false)

// Trigger animation when heading comes into view
useIntersectionObserver(
  headingRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isHeadingVisible.value = true
    }
  },
  { threshold: 0.3 }
)

// Calculate delay for each word based on index
const getWordDelay = (wordIndex: number, baseDelay: number = 0) => {
  return `${baseDelay + (wordIndex * 0.15)}s`
}
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
        <div class="flex flex-col lg:flex-row items-center lg:items-end justify-end gap-4 sm:gap-6 lg:gap-12 xl:gap-16">
          <!-- Arrow pointing to social sidebar - animates with sidebar expansion -->
          <div class="flex justify-center lg:justify-end -mb-4 lg:mb-0 h-[7.5rem] lg:h-auto">
            <img
              src="/arrow-footer.png"
              alt=""
              aria-hidden="true"
              class="arrow-reveal w-3/5 h-auto object-contain -rotate-90 lg:rotate-0 transition-transform"
              :class="isExpanded ? 'revealed' : ''"
            >
          </div>

          <!-- Main heading with badge -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            :in-view-options="{ once: true }"
            class="flex flex-col items-center lg:items-end gap-12"
          >
            <!-- Available Badge -->
            <div
              class="hidden lg:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap"
            >
              <div class="flex items-center gap-2">
                <span class="relative flex size-2">
                  <span
                    class="absolute inline-flex size-full rounded-full opacity-75 animate-ping"
                    :class="global.available ? 'bg-emerald-400' : 'bg-red-400'"
                  />
                  <span
                    class="relative inline-flex size-2 rounded-full"
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

            <h2
              ref="headingRef"
              class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-medium tracking-wide leading-tight text-center lg:text-right overflow-hidden"
            >
              <span
                v-for="(word, index) in headingWords"
                :key="index"
                class="word-animate inline-block"
                :class="{ 'is-visible': isHeadingVisible }"
                :style="{ transitionDelay: getWordDelay(index, 0.1) }"
              >
                {{ word }}&nbsp;
              </span>
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

/* Word-by-word animation - coming up from below */
.word-animate {
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* When visible, animate words up */
.word-animate.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
