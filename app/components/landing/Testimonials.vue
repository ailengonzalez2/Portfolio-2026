<script setup lang="ts">
import { testimonials } from '~/data/testimonials'

// Initials from the author name for the avatar (no image asset needed)
const initials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
</script>

<template>
  <section
    v-if="testimonials.length"
    class="py-20 sm:py-28 bg-background"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="20"
        :blur="4"
      >
        <SectionEyebrow
          :label="$t('testimonials.eyebrow')"
          class="mb-8"
        />
        <h2 class="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white mb-12">
          {{ $t('testimonials.heading') }}
        </h2>
      </ScrollReveal>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <ScrollReveal
          v-for="(t, i) in testimonials"
          :key="t.id"
          :y="20"
          :blur="4"
          :delay="i * 0.08"
        >
          <figure class="h-full flex flex-col bg-white dark:bg-white/5 rounded-2xl ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
            <UIcon
              name="i-lucide-quote"
              class="size-6 text-primary mb-4 shrink-0"
            />
            <blockquote class="flex-1 text-base sm:text-lg leading-relaxed text-heading dark:text-white/90">
              {{ t.quote }}
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-3">
              <span class="flex items-center justify-center size-11 shrink-0 rounded-full btn-gradient text-white font-semibold text-sm">
                {{ initials(t.name) }}
              </span>
              <span class="flex flex-col">
                <span class="font-semibold text-heading dark:text-white">{{ t.name }}</span>
                <span class="text-sm text-muted">{{ t.role }} · {{ t.company }}</span>
              </span>
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
