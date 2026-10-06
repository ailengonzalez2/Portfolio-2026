<script setup lang="ts">
import { useScroll } from 'motion-v'
import { projects } from '~/data/projects'
import { getProcessShowcase } from '~/data/selectors'
import { remap, stageAt } from '~/webgl/math'

// One project's image, as particles, walks sketch → wireframe → interface →
// code while the section is pinned. The track is 400vh only on the WebGL
// path (.fx-on); otherwise every stage is listed and the image is static.
const STAGES = ['sketch', 'wireframe', 'ui', 'code'] as const
const showcase = getProcessShowcase(projects)
const fx = useFxEnabled()

const track = ref<HTMLElement | null>(null)
const progress = ref(0)
const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
let off: (() => void) | undefined
onMounted(() => {
  progress.value = scrollYProgress.get()
  off = scrollYProgress.on('change', (v) => {
    progress.value = v
  })
})
onBeforeUnmount(() => off?.())

// Hold a beat at both ends of the pinned scroll.
const stage = computed(() => stageAt(remap(progress.value, 0.05, 0.85), STAGES.length))
const activeIndex = computed(() => fx.value ? Math.round(stage.value) : STAGES.length - 1)
</script>

<template>
  <section
    v-if="showcase"
    id="process"
    ref="track"
    class="process-track relative"
  >
    <div class="lg:sticky lg:top-0 lg:h-svh lg:pt-20 flex items-center">
      <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 py-24 lg:py-0">
        <div class="min-w-0 lg:col-span-4">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
            {{ $t('process.eyebrow') }}
          </p>
          <h2 class="mt-4 font-display font-normal text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-paper">
            {{ $t('process.title') }}
          </h2>
          <ol class="mt-8 space-y-5">
            <li
              v-for="(key, i) in STAGES"
              :key="key"
              class="transition-opacity duration-300"
              :class="!fx || i === activeIndex ? 'opacity-100' : 'opacity-35'"
              :aria-current="fx && i === activeIndex ? 'step' : undefined"
            >
              <p class="font-mono text-xs uppercase tracking-[0.2em] text-ink dark:text-paper">
                {{ String(i + 1).padStart(2, '0') }} · {{ $t(`process.stages.${key}.label`) }}
              </p>
              <p class="mt-1 text-body">
                {{ $t(`process.stages.${key}.body`) }}
              </p>
            </li>
          </ol>
        </div>

        <div class="min-w-0 lg:col-span-8">
          <ResolveImage
            :src="showcase.image"
            :alt="showcase.title"
            :progress="1"
            :stage="fx ? stage : undefined"
            sizes="100vw lg:66vw"
            class="w-full lg:max-w-[min(100%,88svh)] aspect-[16/10]"
          />
          <pre
            class="mt-4 lg:max-h-[22svh] lg:max-w-[min(100%,88svh)] font-mono text-[11px] leading-relaxed p-4 border border-hairline rounded-sm overflow-auto text-ink dark:text-paper transition-opacity duration-500"
            :class="activeIndex === STAGES.length - 1 ? 'opacity-100' : 'opacity-0'"
          ><code>{{ showcase.processSnippet }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
