<template>
  <section class="py-20 sm:py-28 bg-background">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
      >
        <p class="mt-20 sm:mt-32 max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white">
          {{ $t('hook.pre') }}<span class="btn-gradient-text">{{ $t('hook.highlight') }}</span>{{ $t('hook.post') }}
        </p>
      </Motion>
    </div>
  </section>
</template>
