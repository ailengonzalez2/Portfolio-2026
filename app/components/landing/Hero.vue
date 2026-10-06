<script setup lang="ts">
import { Motion, useScroll, useTransform } from 'motion-v'
import { projects } from '~/data/projects'
import { getFeaturedProjects } from '~/data/selectors'
import { easeOutCubic, heroPhases } from '~/webgl/math'

// Particles assemble into the name on load; on scroll the name disperses and
// the lead project assembles from particles into its crisp image. The track
// is 220vh only on the WebGL path (.fx-on, set by plugins/fx.client.ts);
// otherwise the hero is a static first screen with the name already formed.
const lead = getFeaturedProjects(projects)[0]
const fx = useFxEnabled()

const track = ref<HTMLElement | null>(null)
const scroll = ref(0)
const intro = ref(1)
const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
const copyOpacity = useTransform(scrollYProgress, [0.05, 0.3], [1, 0])

const phases = computed(() => heroPhases(scroll.value, intro.value))

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
            {{ $t('hero.eyebrow') }}
          </p>
        </Motion>

        <ParticleName
          :progress="phases.name"
          class="mt-6 self-start"
          @ready="playIntro"
        >
          <h1 class="font-display font-normal text-[clamp(4rem,17vw,12rem)] leading-[0.88] tracking-[-0.02em] btn-gradient-text pb-[0.08em]">
            Ailen<br>Gonzalez
          </h1>
        </ParticleName>

        <Motion :style="fx ? { opacity: copyOpacity } : undefined">
          <p class="mt-8 max-w-xl text-lg sm:text-xl text-body">
            {{ $t('hero.subtitle') }}
          </p>
        </Motion>
      </div>

      <!-- Lead project: only on the WebGL path, hidden until its phase starts -->
      <div
        v-if="lead"
        class="hero-work absolute inset-0 items-center justify-center px-4 sm:px-10 pt-20"
        :style="{ opacity: phases.image > 0.001 ? 1 : 0 }"
      >
        <ResolveImage
          :src="lead.image"
          :alt="lead.title"
          :progress="phases.image"
          sizes="100vw lg:1200px"
          class="w-full max-w-6xl aspect-[16/10]"
        />
      </div>
    </div>
  </section>
</template>
