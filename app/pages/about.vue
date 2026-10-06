<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

useSeoMeta({
  title: () => t('about.heading'),
  ogTitle: () => `${t('about.heading')} — Ailen Gonzalez`,
  description: () => t('about.designCodeBody'),
  ogDescription: () => t('about.designCodeBody')
})
</script>

<template>
  <UPage>
    <section class="relative -mt-20 pt-36 sm:pt-48 pb-16 sm:pb-24 overflow-hidden">
      <!-- Name tag: interactive lanyard (drag, flip) -->
      <div class="relative z-20 mx-auto mb-10 w-40 md:absolute md:top-20 md:right-10 lg:right-24 md:mb-0 md:w-44 lg:w-60">
        <AboutNameTag />
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
          {{ $t('about.eyebrow') }}
        </p>
        <ResolveText
          :text="$t('about.statement')"
          :highlight="$t('about.statementHighlight')"
          tag="h1"
          on="load"
          class="mt-6 max-w-[15em] md:max-w-[min(15em,calc(100%-16rem))] lg:max-w-[min(15em,calc(100%-20rem))] font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-[-0.02em] text-ink dark:text-paper"
        />
        <HalftoneReveal>
          <p class="mt-10 max-w-2xl text-lg leading-relaxed text-body">
            {{ $t('about.designCodeBody') }}
          </p>
          <NuxtLink
            to="https://cv.ailengonzalez.ar/"
            target="_blank"
            data-umami-event="view-cv"
            data-umami-event-location="about"
            class="btn-gradient inline-flex items-center gap-2 mt-10"
          >
            {{ $t('about.exploreCv') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </NuxtLink>
        </HalftoneReveal>
      </div>
    </section>
    <LandingAboutMe />
  </UPage>
</template>
