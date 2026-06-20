<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section class="py-20 sm:py-28 bg-background">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="28"
        :blur="8"
        :duration="0.7"
      >
        <p class="mt-20 sm:mt-32 max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white">
          {{ $t('hook.pre') }}<span class="btn-gradient-text">{{ $t('hook.highlight') }}</span>{{ $t('hook.post') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.25"
        :duration="0.6"
      >
        <div class="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
          <NuxtLink
            :to="global.meetingLink"
            target="_blank"
            class="group/btn relative inline-flex items-center bg-neutral-900 hover:bg-neutral-800 rounded-full py-4 pl-8 pr-16 transition-all duration-300 hover:pl-16 hover:pr-8"
          >
            <span class="absolute right-1.5 flex items-center justify-center size-10 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-2.875rem)]">
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-gray-900"
              />
            </span>
            <span class="text-base font-medium text-white">
              {{ $t('hook.bookCall') }}
            </span>
          </NuxtLink>

          <UButton
            to="/projects"
            size="lg"
            variant="ghost"
            color="neutral"
            class="font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('hook.viewWork') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4"
              />
            </template>
          </UButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
