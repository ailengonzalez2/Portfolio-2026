<script setup lang="ts">
// How Ailen works: four principles, each grounded in the CV (dual-skill
// ownership, AI automation, emergency medicine, remote international teams).
const principles = ['noHandoff', 'ai', 'decide', 'remote'] as const
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 pb-24 sm:pb-32">
    <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
      {{ $t('about.principles.heading') }}
    </h2>
    <ol class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
      <li
        v-for="(key, i) in principles"
        :key="key"
        class="border-t border-hairline pt-6"
      >
        <HalftoneReveal>
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
            {{ String(i + 1).padStart(2, '0') }}
          </p>
          <h3 class="mt-3 font-display font-normal text-2xl sm:text-3xl leading-tight text-ink dark:text-paper">
            {{ $t(`about.principles.${key}.title`) }}
          </h3>
          <p class="mt-3 max-w-lg text-body leading-relaxed">
            {{ $t(`about.principles.${key}.body`) }}
          </p>
        </HalftoneReveal>
      </li>
    </ol>
  </section>
</template>
