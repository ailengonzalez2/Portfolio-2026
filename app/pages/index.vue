<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

// The home page carries the full branded title itself, so opt out of the
// global "%s — Ailen Gonzalez" template to avoid repeating the name.
useHead({ titleTemplate: '%s' })

useSeoMeta({
  title: () => t('seo.homeTitle'),
  ogTitle: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
  ogDescription: () => t('seo.homeDescription')
})
</script>

<template>
  <UPage>
    <LandingHero />
    <LandingHook />
    <section class="pb-20 sm:pb-28 bg-background">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingLabTeaser />
      </div>
    </section>
    <LandingServices />
    <section class="pt-10 sm:pt-14 pb-24 sm:pb-32 bg-background">
      <TechMarquee />
    </section>
    <LandingHookQuote />
    <LandingWork />
    <LandingAIquote />
    <LandingTestimonials />
  </UPage>
</template>
