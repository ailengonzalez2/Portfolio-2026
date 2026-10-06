<script setup lang="ts">
import { projects } from '~/data/projects'

// The Lab: self-directed experiments. Client work arrives "formed"; these stay
// loose particle clouds until you touch them.
const lab = projects.filter(p => p.kind === 'lab')
const fx = useFxEnabled()
const localePath = useLocalePath()
</script>

<template>
  <section
    id="lab"
    class="bg-ink text-paper py-24 sm:py-32"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-2xl">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60">
            {{ $t('lab.eyebrow') }}
          </p>
          <ResolveText
            :text="$t('lab.title')"
            tag="h2"
            class="mt-4 font-display font-normal text-4xl sm:text-6xl leading-[0.98] tracking-[-0.02em]"
          />
          <p class="mt-6 text-lg text-paper/70">
            {{ $t('lab.intro') }}
          </p>
        </div>
        <p
          v-if="fx"
          class="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50"
        >
          {{ $t('lab.hint') }}
        </p>
      </div>

      <div class="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-20 sm:gap-y-28">
        <LandingLabExperiment
          v-for="(p, i) in lab"
          :key="p.id"
          :project="p"
          :index="i"
        />
      </div>

      <NuxtLink
        :to="localePath('/projects#lab')"
        class="mt-20 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/70 hover:text-paper transition-colors"
      >
        {{ $t('lab.seeAll') }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4"
        />
      </NuxtLink>
    </div>
  </section>
</template>
