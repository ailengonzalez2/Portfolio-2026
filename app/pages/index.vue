<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

useSeoMeta({
  title: () => `Ailen Gonzalez — ${t('hero.title')}`,
  ogTitle: () => `Ailen Gonzalez — ${t('hero.title')}`,
  description: () => t('hero.subtitle'),
  ogDescription: () => t('hero.subtitle')
})
</script>

<template>
  <UPage>
    <!-- Wrapper for Rolls split reveal effect -->
    <div class="relative isolate">
      <LandingRolls />
      <LandingHero />
    </div>
    <LandingHook />
    <LandingServices />
    <LandingAIquote />
    <section class="pt-10 sm:pt-14 pb-24 sm:pb-32 bg-background">
      <TechMarquee />
    </section>
    <LandingProjects />
    <LandingTestimonials />
  </UPage>
</template>
