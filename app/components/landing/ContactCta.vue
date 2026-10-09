<script setup lang="ts">
import { remap } from '~/webgl/math'

const { global } = useAppConfig()

// The heading assembles from particles as the section scrolls in, fully
// formed before it reaches the middle of the screen (same language as the
// hero and the footer). Without WebGL it is the plain gradient heading.
const section = ref<HTMLElement | null>(null)
const scrolled = useScrollProgress(section, ['start end', 'center center'])
const headingProgress = computed(() => remap(scrolled.value, 0.15, 0.85))
</script>

<template>
  <section
    id="contact"
    ref="section"
    class="pt-24 pb-40 sm:pt-32 sm:pb-52"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ParticleName
        :progress="headingProgress"
        class="inline-block"
      >
        <h2 class="font-display font-normal text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.02em] btn-gradient-text pb-[0.08em]">
          {{ $t('contactCta.heading') }}
        </h2>
      </ParticleName>

      <HalftoneReveal>
        <p class="mt-8 max-w-2xl text-lg sm:text-xl text-body">
          {{ $t('contactCta.subtitle') }}
        </p>

        <div class="mt-12 flex flex-wrap items-center gap-6">
          <NuxtLink
            :to="global.meetingLink"
            target="_blank"
            data-umami-event="book-call"
            data-umami-event-location="contact"
            class="btn-gradient inline-flex"
          >
            {{ $t('contactCta.bookCall') }}
          </NuxtLink>
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
