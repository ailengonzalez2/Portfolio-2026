<script setup lang="ts">
const colorMode = useColorMode()
const { locale } = useI18n()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: locale
  }
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Ailen Gonzalez',
  twitterCard: 'summary_large_image'
})

// Default social-share image, auto-generated. Individual pages can override.
defineOgImageComponent('NuxtSeo', {
  title: 'Ailen Gonzalez',
  description: 'AI Product Engineer · Designer & Frontend Developer'
})

// Structured data for search engines and rich results
useSchemaOrg([
  definePerson({
    name: 'Ailen Gonzalez',
    jobTitle: 'AI Product Engineer',
    url: 'https://ailengonzalez.ar',
    sameAs: [
      'https://www.linkedin.com/in/ailengonzalez/',
      'https://github.com/ailengonzalez2',
      'https://www.upwork.com/freelancers/ailengonzalez'
    ]
  }),
  defineWebSite({
    name: 'Ailen Gonzalez'
  })
])
</script>

<template>
  <UApp>
    <!-- Intro animation overlay -->
    <ClientOnly>
      <IntroAnimation />
    </ClientOnly>

    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
