<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section
    id="contact"
    class="pt-24 pb-40 sm:pt-32 sm:pb-52"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ResolveText
        :text="$t('contactCta.heading')"
        :highlight="$t('contactCta.heading')"
        tag="h2"
        class="font-display font-normal text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-paper"
      />

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
    </div>
  </section>
</template>
