<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section
    id="contact"
    class="pt-24 pb-40 sm:pt-32 sm:pb-52 bg-background"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ContactHeading :text="$t('contactCta.heading')" />

      <ScrollReveal
        :y="20"
        :blur="4"
      >
        <p class="mt-6 max-w-2xl mx-auto text-lg text-muted">
          {{ $t('contactCta.subtitle') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.15"
      >
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
            data-umami-event="book-call"
            data-umami-event-location="contact"
            class="btn-gradient text-white font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('contactCta.bookCall') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>

          <UButton
            :to="`mailto:${global.email}`"
            size="lg"
            variant="ghost"
            color="neutral"
            data-umami-event="email-click"
            data-umami-event-location="contact"
            class="font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('contactCta.email') }}
            <template #trailing>
              <UIcon
                name="i-lucide-mail"
                class="size-4"
              />
            </template>
          </UButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
