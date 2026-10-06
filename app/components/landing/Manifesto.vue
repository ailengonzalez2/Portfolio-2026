<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section class="py-32 sm:py-48">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ResolveText
        :text="$t('manifesto.text')"
        :highlight="$t('manifesto.highlight')"
        tag="p"
        class="font-display font-normal text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em] text-ink dark:text-paper"
      />

      <div class="mt-14 flex flex-wrap items-center gap-6">
        <NuxtLink
          :to="global.meetingLink"
          target="_blank"
          data-umami-event="book-call"
          data-umami-event-location="manifesto"
          class="btn-gradient inline-flex"
        >
          {{ $t('manifesto.bookCall') }}
        </NuxtLink>
        <NuxtLink
          to="#work"
          data-umami-event="view-work"
          data-umami-event-location="manifesto"
          class="font-mono text-xs uppercase tracking-[0.18em] text-label hover:text-ink transition-colors"
        >
          {{ $t('manifesto.viewWork') }} ↓
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
