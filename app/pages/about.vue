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
      <!-- Name tag dropping in on its lanyard -->
      <div class="pointer-events-none absolute top-20 right-4 sm:right-10 lg:right-24 z-20 hidden md:block">
        <NuxtImg
          src="/name-tag.png"
          alt="Ailen Gonzalez name tag"
          width="320"
          height="456"
          class="name-tag w-44 lg:w-64 h-auto select-none"
        />
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
          {{ $t('about.eyebrow') }}
        </p>
        <ResolveText
          :text="$t('about.statement')"
          :highlight="$t('about.statementHighlight')"
          tag="h1"
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
