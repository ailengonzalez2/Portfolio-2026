<script setup lang="ts">
import { testimonials } from '~/data/testimonials'

// One large quote at a time. Autoplays, paused on hover/focus and for
// reduced-motion users; prev/next always available.
const count = testimonials.length
const active = ref(0)
const current = computed(() => testimonials[active.value])

const go = (delta: number) => {
  active.value = (active.value + delta + count) % count
}

const AUTOPLAY_MS = 7000
let timer: ReturnType<typeof setInterval> | undefined
const paused = ref(false)
const stop = () => clearInterval(timer)
const start = () => {
  stop()
  if (count < 2 || paused.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => go(1), AUTOPLAY_MS)
}
watch(paused, start)
onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <section
    v-if="count && current"
    class="py-24 sm:py-32"
    aria-roledescription="carousel"
    :aria-label="$t('testimonials.label')"
  >
    <div
      class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
        {{ $t('testimonials.eyebrow') }} — {{ active + 1 }}/{{ count }}
      </p>

      <div
        class="mt-8 min-h-[18rem] sm:min-h-[16rem]"
        aria-live="polite"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 blur-sm"
          leave-active-class="transition duration-300 ease-in"
          leave-to-class="opacity-0 blur-sm"
        >
          <figure :key="current.id">
            <blockquote class="font-display font-normal text-3xl sm:text-5xl leading-[1.08] tracking-[-0.01em] text-ink dark:text-paper">
              “{{ current.quote }}”
            </blockquote>
            <figcaption class="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-label">
              {{ current.author ?? $t('testimonials.source') }}<template v-if="current.role">
                · {{ current.role }}
              </template>
              <a
                v-if="current.link"
                :href="current.link"
                target="_blank"
                rel="noopener"
                class="ml-2 underline underline-offset-4 hover:text-ink"
              >↗</a>
            </figcaption>
          </figure>
        </Transition>
      </div>

      <div
        v-if="count > 1"
        class="mt-10 flex gap-3"
      >
        <UButton
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral"
          class="rounded-full"
          :aria-label="$t('testimonials.prev')"
          @click="go(-1)"
        />
        <UButton
          icon="i-lucide-arrow-right"
          variant="outline"
          color="neutral"
          class="rounded-full"
          :aria-label="$t('testimonials.next')"
          @click="go(1)"
        />
      </div>
    </div>
  </section>
</template>
