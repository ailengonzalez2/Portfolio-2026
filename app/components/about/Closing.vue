<script setup lang="ts">
// Two ways forward: clients book a call, companies read the CV. Lives inside
// the site-wide closing (ContactCta), under the "Let's work together" heading.
const { global } = useAppConfig()
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline rounded-2xl overflow-hidden">
      <HalftoneReveal class="bg-paper dark:bg-ink p-6 sm:p-12 flex flex-col">
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
          {{ $t('about.closing.clients.eyebrow') }}
        </p>
        <h2 class="mt-4 font-display font-medium text-3xl sm:text-4xl leading-tight text-ink dark:text-paper">
          {{ $t('about.closing.clients.title') }}
        </h2>
        <p class="mt-4 max-w-md text-body leading-relaxed">
          {{ $t('about.closing.clients.body') }}
        </p>
        <NuxtLink
          :to="global.meetingLink"
          target="_blank"
          data-umami-event="book-call"
          data-umami-event-location="contact"
          class="btn-gradient self-start mt-10"
        >
          {{ $t('contactCta.bookCall') }}
        </NuxtLink>
      </HalftoneReveal>
      <HalftoneReveal class="bg-paper dark:bg-ink p-6 sm:p-12 flex flex-col">
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
          {{ $t('about.closing.teams.eyebrow') }}
        </p>
        <h2 class="mt-4 font-display font-medium text-3xl sm:text-4xl leading-tight text-ink dark:text-paper">
          {{ $t('about.closing.teams.title') }}
        </h2>
        <p class="mt-4 max-w-md text-body leading-relaxed">
          {{ $t('about.closing.teams.body') }}
        </p>
        <NuxtLink
          to="https://cv.ailengonzalez.ar/"
          target="_blank"
          data-umami-event="view-cv"
          data-umami-event-location="contact"
          class="btn-outline self-start mt-10"
        >
          {{ $t('about.exploreCv') }}
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4"
          />
        </NuxtLink>
      </HalftoneReveal>
    </div>
  </div>
</template>
