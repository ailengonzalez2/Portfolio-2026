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
    <LandingManifesto />
    <LandingPlayground />
    <LandingWork />
    <LandingProcess />
    <LandingTestimonials />
  </UPage>
</template>
