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
    <section class="pt-28 sm:pt-36 pb-2 bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[155px]">
          <h1 class="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.05] text-[#0f172b] dark:text-white">
            {{ $t('about.pageTitle') }}
          </h1>
          <p class="mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-[#62748e] dark:text-neutral-400">
            {{ $t('about.designCodeBody') }}
          </p>
        </div>
      </Motion>
    </section>
    <LandingAboutMe />
  </UPage>
</template>
