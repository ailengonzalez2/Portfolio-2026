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
    <ol class="principles mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
      <li
        v-for="(key, i) in principles"
        :key="key"
        class="principle relative border-t border-hairline pt-6"
      >
        <HalftoneReveal>
          <p class="principle-num font-mono text-[11px] uppercase tracking-[0.18em] text-label">
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

<style scoped>
/* Hover: the brand gradient draws across the item's top rule, its number
   darkens, and the other principles step back. */
.principle {
  transition: opacity 0.3s ease;
}
.principle::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2B3BFF, #4453FF 50%, #5B6BFF);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.principle:hover::before {
  transform: scaleX(1);
}
.principle-num {
  transition: color 0.3s ease;
}
.principle:hover .principle-num {
  color: var(--color-ink);
}
@media (hover: hover) {
  .principles:has(.principle:hover) .principle:not(:hover) {
    opacity: 0.45;
  }
}
@media (prefers-reduced-motion: reduce) {
  .principle,
  .principle::before,
  .principle-num {
    transition: none;
  }
}
</style>
