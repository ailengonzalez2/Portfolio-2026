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
    <section class="relative pt-28 sm:pt-36 pb-2 bg-[#f8fafc] dark:bg-[#0a0a0a] overflow-hidden">
      <!-- Name tag dropping in on its lanyard -->
      <div class="pointer-events-none absolute top-0 right-4 sm:right-10 lg:right-20 z-20 hidden sm:block">
        <NuxtImg
          src="/name-tag.png"
          alt="Ailen Gonzalez name tag"
          width="320"
          height="456"
          class="name-tag w-44 sm:w-56 lg:w-72 h-auto select-none"
        />
      </div>

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

<style scoped>
/* Drops in on its lanyard, then keeps a gentle idle sway */
.name-tag {
  transform-origin: top center;
  animation:
    nameTagDrop 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both,
    nameTagSway 6s ease-in-out 1.7s infinite;
}

@keyframes nameTagDrop {
  0%   { opacity: 0; transform: translateY(-460px) rotate(-12deg); }
  60%  { opacity: 1; transform: translateY(0) rotate(7deg); }
  78%  { transform: translateY(0) rotate(-4deg); }
  90%  { transform: translateY(0) rotate(2deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}

@keyframes nameTagSway {
  0%, 100% { transform: rotate(-1.5deg); }
  50%      { transform: rotate(1.5deg); }
}

@media (prefers-reduced-motion: reduce) {
  .name-tag { animation: none; }
}
</style>
