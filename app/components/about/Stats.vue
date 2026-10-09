<script setup lang="ts">
// Four figures that tell the arc: where she comes from, how long she has
// been at it, how much she has shipped, and what clients gain. All from the
// CV — no invented numbers.
const stats = [
  { key: 'medicine', value: '10' },
  { key: 'years', value: '5+' },
  { key: 'shipped', value: '20+' },
  { key: 'faster', value: '40–50%' }
] as const
</script>

<template>
  <section
    class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 pb-24 sm:pb-32"
    :aria-label="$t('about.stats.heading')"
  >
    <dl class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-10 border-t border-hairline pt-12 sm:pt-16">
      <Reveal
        v-for="(stat, i) in stats"
        :key="stat.key"
        :y="20"
        :duration="0.5"
        :delay="i * 0.08"
        class="flex flex-col-reverse justify-end gap-3"
      >
        <dt class="max-w-[16rem] text-sm sm:text-base leading-snug text-body">
          {{ $t(`about.stats.${stat.key}`) }}
        </dt>
        <dd class="font-display font-normal text-4xl sm:text-6xl lg:text-7xl leading-none tracking-[-0.02em] btn-gradient-text pb-[0.08em]">
          {{ stat.value }}
        </dd>
      </Reveal>
    </dl>
  </section>
</template>
