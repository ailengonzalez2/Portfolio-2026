<template>
  <section class="py-16 sm:py-24 bg-background">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
      >
        <h2 class="text-[#64748b] text-[20px] font-medium uppercase tracking-normal mb-[10px]">
          {{ $t('hook.eyebrow') }}
        </h2>
        <div class="h-[2px] w-[50px] bg-[#64748b] mb-8" />

        <p class="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#0f172b] dark:text-white">
          {{ $t('hook.pre') }}<span class="btn-gradient-text">{{ $t('hook.highlight') }}</span>{{ $t('hook.post') }}
        </p>
      </Motion>
    </div>
  </section>
</template>
