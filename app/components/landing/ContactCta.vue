<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section
    id="contact"
    class="py-24 sm:py-32 bg-background"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ScrollReveal
        :y="24"
        :blur="6"
      >
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-heading dark:text-white">
          {{ $t('contactCta.heading') }}
        </h2>
        <p class="mt-6 max-w-2xl mx-auto text-lg text-muted">
          {{ $t('contactCta.subtitle') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.2"
      >
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
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
