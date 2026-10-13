<script setup lang="ts">
// How Ailen works: four principles, each grounded in the CV (dual-skill
// ownership, AI automation, emergency medicine, remote international teams).
const principles = ['noHandoff', 'ai', 'decide', 'remote'] as const

// The about page indents its content; the home page uses the wider grid of
// the sections around it.
// `dark` sets it as an ink band (home), with large gradient numbers.
const props = withDefaults(defineProps<{ inset?: 'about' | 'home', tone?: 'light' | 'dark' }>(), { inset: 'about', tone: 'light' })
const dark = computed(() => props.tone === 'dark')
const container = computed(() => props.inset === 'home'
  ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
  : 'max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16')
</script>

<template>
  <section
    :class="dark ? 'principles-dark bg-ink text-paper py-24 sm:py-32' : 'pb-24 sm:pb-32'"
  >
    <div :class="container">
      <h2
        class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em]"
        :class="dark ? 'text-paper/60' : 'text-label'"
      >
        {{ $t('about.principles.heading') }}
      </h2>
      <ol class="principles mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
        <li
          v-for="(key, i) in principles"
          :key="key"
          class="principle relative border-t pt-6"
          :class="dark ? 'border-paper/15' : 'border-hairline'"
        >
          <HalftoneReveal>
            <p
              v-if="dark"
              class="font-display font-medium text-6xl sm:text-7xl leading-none tracking-[-0.04em] btn-gradient-text pb-[0.08em]"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </p>
            <p
              v-else
              class="principle-num font-mono text-[11px] uppercase tracking-[0.18em] text-label"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </p>
            <h3
              class="font-display font-medium text-2xl sm:text-3xl leading-tight"
              :class="dark ? 'mt-5 text-paper' : 'mt-3 text-ink dark:text-paper'"
            >
              {{ $t(`about.principles.${key}.title`) }}
            </h3>
            <p
              class="mt-3 max-w-lg leading-relaxed"
              :class="dark ? 'text-paper/70' : 'text-body'"
            >
              {{ $t(`about.principles.${key}.body`) }}
            </p>
          </HalftoneReveal>
        </li>
      </ol>
    </div>
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
  background: linear-gradient(90deg, #2B3BFF, #7643FF 50%, #C04BFF);
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
