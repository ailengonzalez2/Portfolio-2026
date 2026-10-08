<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { easeOutCubic, heroName } from '~/webgl/math'

// Particles assemble into the name on load; scrolling disperses it back into
// the ambient field before the manifesto. The track is 160vh only on the
// WebGL path (.fx-on, set by plugins/fx.client.ts); otherwise the hero is a
// static first screen with the name already formed.
const fx = useFxEnabled()

const track = ref<HTMLElement | null>(null)
const scroll = ref(0)
const intro = ref(1)
const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
const copyOpacity = useTransform(scrollYProgress, [0.1, 0.5], [1, 0])

const nameProgress = computed(() => heroName(scroll.value, intro.value))

// The role is the headline; break before the "&" so it stacks in two lines.
const { t } = useI18n()
const roleLines = computed(() => {
  const title = t('hero.title')
  const i = title.indexOf(' & ')
  return i > 0 ? [title.slice(0, i), title.slice(i + 1)] : [title]
})

const INTRO_MS = 2400
const playIntro = () => {
  intro.value = 0
  const start = performance.now()
  const step = () => {
    const k = Math.min(1, (performance.now() - start) / INTRO_MS)
    intro.value = easeOutCubic(k)
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

let off: (() => void) | undefined
onMounted(() => {
  scroll.value = scrollYProgress.get()
  off = scrollYProgress.on('change', (v) => {
    scroll.value = v
  })
})
onBeforeUnmount(() => off?.())
</script>

<template>
  <section
    ref="track"
    class="hero-track relative -mt-20"
  >
    <div class="sticky top-0 h-svh">
      <div class="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:pl-28 lg:pr-16 pt-20">
        <Motion :style="fx ? { opacity: copyOpacity } : undefined">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
            Ailen Gonzalez
          </p>
        </Motion>

        <ParticleName
          :progress="nameProgress"
          class="mt-6 self-start"
          @ready="playIntro"
        >
          <h1 class="font-display font-normal text-[clamp(3rem,11vw,9rem)] leading-[0.88] tracking-[-0.02em] btn-gradient-text pb-[0.08em]">
            <template
              v-for="(line, i) in roleLines"
              :key="line"
            >
              <br v-if="i">{{ line }}
            </template>
          </h1>
        </ParticleName>

        <Motion :style="fx ? { opacity: copyOpacity } : undefined">
          <p class="mt-8 max-w-xl text-lg sm:text-xl text-body">
            {{ $t('hero.subtitle') }}
          </p>
        </Motion>
      </div>
    </div>
  </section>
</template>
