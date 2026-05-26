<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

useSeoMeta({
  title: () => `${t('about.heading')} — Ailen Gonzalez`,
  ogTitle: () => `${t('about.heading')} — Ailen Gonzalez`,
  description: () => t('about.designCodeBody'),
  ogDescription: () => t('about.designCodeBody')
})
</script>

<template>
  <UPage>
    <LandingAboutMe />
  </UPage>
</template>
