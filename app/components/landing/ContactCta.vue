<script setup lang="ts">
import { remap } from '~/webgl/math'

const { global } = useAppConfig()

// The two ways forward (clients / companies) come first; the heading under
// them assembles from particles as it scrolls in, fully formed before it
// reaches the middle of the screen. Without WebGL it is the plain gradient
// heading.
const heading = ref<HTMLElement | null>(null)
const scrolled = useScrollProgress(heading, ['start end', 'center center'])
const headingProgress = computed(() => remap(scrolled.value, 0.15, 0.85))
</script>

<template>
  <section
    id="contact"
    class="pt-24 pb-24 sm:pt-32 sm:pb-32"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- One close for every page: the two ways forward (clients / companies) -->
      <AboutClosing />

      <div
        ref="heading"
        class="mt-20 sm:mt-28"
      >
        <ParticleName
          :progress="headingProgress"
          class="inline-block"
        >
          <h2 class="font-display font-medium text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.04em] btn-gradient-text pb-[0.08em]">
            {{ $t('contactCta.heading') }}
          </h2>
        </ParticleName>
      </div>

      <HalftoneReveal>
        <div class="mt-8 flex flex-wrap items-center gap-6">
          <NuxtLink
            :to="`mailto:${global.email}`"
            data-umami-event="email-click"
            data-umami-event-location="contact"
            class="font-mono text-xs uppercase tracking-[0.18em] text-label hover:text-ink transition-colors"
          >
            {{ global.email }}
          </NuxtLink>
        </div>
      </HalftoneReveal>
    </div>
  </section>
</template>
