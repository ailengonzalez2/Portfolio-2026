<script setup lang="ts">
import { testimonials } from '~/data/testimonials'

// Move the spotlight glow to the cursor by writing its position into CSS vars
// on the hovered card (read by the .spotlight-border gradient below).
const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
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
          class="mb-12"
        />
      </ScrollReveal>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <ScrollReveal
          v-for="(t, i) in testimonials"
          :key="t.id"
          :y="20"
          :blur="4"
          :delay="i * 0.08"
        >
          <figure
            class="glass-card group/card relative h-full flex flex-col overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1"
            @mousemove="onMove"
          >
            <!-- Cursor-following colored border -->
            <div class="spotlight-border pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

            <div class="relative z-10 flex flex-1 flex-col">
              <UIcon
                name="i-lucide-quote"
                class="size-6 text-gray-300 mb-4 shrink-0"
              />
              <blockquote class="flex-1 text-base sm:text-lg leading-relaxed text-heading dark:text-white/90">
                {{ t.quote }}
              </blockquote>
              <figcaption class="mt-6 text-sm">
                <template v-if="t.author">
                  <span class="font-semibold text-heading dark:text-white/90">{{ t.author }}</span>
                  <span
                    v-if="t.role"
                    class="text-muted"
                  > — {{ t.role }}</span>
                  <a
                    v-if="t.link"
                    :href="t.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-1 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <UIcon
                      name="i-simple-icons-upwork"
                      class="size-3.5"
                    />
                    View on Upwork
                  </a>
                </template>
                <span
                  v-else
                  class="font-medium text-muted"
                >Upwork client</span>
              </figcaption>
            </div>
          </figure>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Frosted-glass card — same recipe as the Services cards. */
.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.dark .glass-card {
  background: rgba(38, 38, 38, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dark .glass-card:hover {
  background: rgba(38, 38, 38, 0.6);
}

/* Colored border that lights up at the cursor: paint the radial gradient over
   the whole card, then mask out everything except the 1.5px border ring. */
.spotlight-border {
  padding: 1.5px;
  background: radial-gradient(
    200px circle at var(--mx, 50%) var(--my, 50%),
    rgba(161, 30, 226, 0.9),
    transparent 60%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
</style>
