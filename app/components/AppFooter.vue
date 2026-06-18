<script setup lang="ts">
import { useIntersectionObserver, useClipboard } from '@vueuse/core'
import { ref, computed } from 'vue'

const { global } = useAppConfig()
const { t } = useI18n()
const year = new Date().getFullYear()

const { copy, copied } = useClipboard()

// Word-by-word animation for the contact heading
const headingWords = computed(() => t('contact.title').split(' '))
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
      class="py-20 sm:py-28 relative border-b border-default/50"
    >
      <!-- Subtle background gradient -->
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/20 to-transparent pointer-events-none" />

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Centered heading + badge -->
        <div class="flex flex-col items-center justify-center">
          <!-- Main heading with badge -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            :in-view-options="{ once: true }"
            class="flex flex-col items-center gap-12"
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
                <span class="text-gray-500 dark:text-gray-400 text-base">
                  {{ global.available ? $t('footer.availableForProjects') : $t('footer.notAvailable') }}
                </span>
              </div>
              <span class="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span class="text-gray-500 dark:text-gray-400 text-base">{{ $t('footer.timezone') }}</span>
            </div>

            <h2
              ref="headingRef"
              class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-medium tracking-wide leading-tight text-center overflow-hidden"
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

            <!-- Email (copy to clipboard) -->
            <div class="flex flex-col items-center gap-2">
              <button
                type="button"
                class="group relative inline-flex items-center gap-2.5 text-xl sm:text-2xl lg:text-3xl font-mono font-light lowercase hover:text-primary transition-colors"
                :aria-label="`${$t('contact.copyAria')} ${global.email}`"
                @click="copy(global.email)"
              >
                {{ global.email }}
                <UIcon
                  :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                  class="size-4 sm:size-5 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                />
              </button>
              <p
                role="status"
                aria-live="polite"
                class="text-sm text-success h-5"
              >
                <span v-if="copied">{{ $t('contact.copied') }}</span>
              </p>
            </div>

            <!-- Book a call CTA -->
            <div class="flex flex-col items-center gap-3">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('footer.orBookCall') }}</span>
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
            </div>
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
