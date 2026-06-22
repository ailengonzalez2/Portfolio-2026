<template>
  <section class="py-20 sm:py-28 bg-background">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="28"
        :blur="8"
        :duration="0.7"
      >
        <p class="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white">
          {{ $t('hookQuote.pre') }}<span class="btn-gradient-text">{{ $t('hookQuote.highlight') }}</span>{{ $t('hookQuote.post') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.25"
        :duration="0.6"
      >
        <p class="mt-8 sm:mt-10 max-w-2xl text-lg sm:text-xl text-muted">
          {{ $t('hookQuote.support') }}
        </p>
      </ScrollReveal>
    </div>
  </section>
</template>
