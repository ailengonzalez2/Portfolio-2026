<script setup lang="ts">
import { remap } from '~/webgl/math'

const { t } = useI18n()
const year = new Date().getFullYear()

// The signature: design, code, AI — one word at a time, the particles flying
// from one to the next. The first word assembles as the footer scrolls in.
const wordsRef = ref<HTMLElement | null>(null)
const footerScroll = useScrollProgress(wordsRef, ['start end', 'end end'])
const wordsProgress = computed(() => remap(footerScroll.value, 0.2, 0.8))
const words = computed(() => [t('prefooter.design'), t('prefooter.code'), t('prefooter.ai')])

// Her local time, for clients in other time zones. Client-only, so the
// prerendered HTML never carries a stale build-time clock.
const localTime = ref('')
const tickClock = () => {
  localTime.value = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Cordoba' }).format(new Date())
}

let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  tickClock()
  clock = setInterval(tickClock, 30_000)
})
onBeforeUnmount(() => clearInterval(clock))

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="relative z-10 bg-ink text-paper">
    <div
      ref="wordsRef"
      class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 pt-20 sm:pt-28 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12"
    >
      <div>
        <p class="font-display font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-none">
          Ailen Gonzalez
        </p>
        <p class="mt-4 max-w-sm text-paper/60 leading-relaxed">
          {{ t('hero.title') }}<br>
          {{ t('footer.place') }}<template v-if="localTime">
            · <span class="tabular-nums text-paper">{{ localTime }}</span> {{ t('footer.localTime') }}
          </template>
        </p>
      </div>

      <h2 :aria-label="words.join(' + ')">
        <ParticleWords
          :words="words"
          :progress="wordsProgress"
          class="lg:justify-items-end font-display font-medium uppercase text-[clamp(3rem,7vw,7rem)] leading-[0.85] tracking-[-0.04em] text-paper pb-[0.06em]"
        />
      </h2>
    </div>

    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 mt-12 sm:mt-16">
      <div class="py-8 border-t border-paper/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
        <p>© {{ year }} · {{ t('footer.credits') }}</p>
        <button
          type="button"
          class="inline-flex items-center gap-2 uppercase hover:text-paper transition-colors cursor-pointer"
          @click="toTop"
        >
          {{ t('footer.backToTop') }}
          <UIcon
            name="i-lucide-arrow-up"
            class="size-3.5"
          />
        </button>
      </div>
    </div>
  </footer>
</template>
