<script setup lang="ts">
import { projects } from '~/data/projects'
import { getProcessShowcase } from '~/data/selectors'
import { clamp01, remap, stageAt } from '~/webgl/math'

// One project's image, as particles, morphs sketch → wireframe → interface →
// code. No pinned scroll: you scrub it — move the pointer down the image,
// drag the vertical ruler, or pick a stage. On first view it plays through once so the
// idea is visible without touching anything.
const STAGES = ['sketch', 'wireframe', 'ui', 'code'] as const
const LAST = STAGES.length - 1
const showcase = getProcessShowcase(projects)
const fx = useFxEnabled()

const section = ref<HTMLElement | null>(null)
const ruler = ref<HTMLElement | null>(null)
// Where the stage is heading (pointer, ruler, buttons) and where it is (eased).
const target = ref(LAST)
const stage = ref(LAST)
const activeIndex = computed(() => Math.round(stage.value))

let raf = 0
let still = false
const ease = () => {
  stage.value += (target.value - stage.value) * 0.14
  if (Math.abs(target.value - stage.value) < 0.001) stage.value = target.value
  else raf = requestAnimationFrame(ease)
}
const go = (value: number) => {
  target.value = Math.min(LAST, Math.max(0, value))
  if (still) {
    stage.value = target.value
    return
  }
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(ease)
}

// Pointer height on the ruler → stage. The track runs from the first stop's
// dot to the last one's (row centers), so each dot is exactly a stage.
const along = (e: PointerEvent, el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  const row = r.height / STAGES.length
  return stageAt(clamp01((e.clientY - r.top - row / 2) / (r.height - row)), STAGES.length)
}
// Down the image the edges are slack, so both ends are easy to reach.
const onImageMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  go(stageAt(remap((e.clientY - r.top) / r.height, 0.06, 0.9), STAGES.length))
}

// Ruler: drag (mouse or touch) to scrub, released it snaps to the nearest stage.
let dragging = false
const onRulerDown = (e: PointerEvent) => {
  dragging = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  go(along(e, ruler.value!))
}
const onRulerMove = (e: PointerEvent) => {
  if (dragging) go(along(e, ruler.value!))
}
const onRulerUp = () => {
  if (!dragging) return
  dragging = false
  go(Math.round(target.value))
}
const onRulerKey = (e: KeyboardEvent) => {
  const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
  if (step !== undefined) {
    e.preventDefault()
    go(Math.round(target.value) + step)
  } else if (e.key === 'Home') go(0)
  else if (e.key === 'End') go(LAST)
}

// Play through once, the first time the section is mostly on screen.
let played = false
let observer: IntersectionObserver | undefined
onMounted(() => {
  still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (still || !fx.value || !section.value) return
  stage.value = 0
  target.value = 0
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || played) return
    played = true
    observer?.disconnect()
    const start = performance.now()
    const DURATION = 3200
    const play = (now: number) => {
      if (dragging) return
      const k = Math.min(1, (now - start) / DURATION)
      target.value = stage.value = k * LAST
      if (k < 1) raf = requestAnimationFrame(play)
    }
    raf = requestAnimationFrame(play)
  }, { threshold: 0.6 })
  observer.observe(section.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <section
    v-if="showcase"
    id="process"
    ref="section"
    class="py-24 sm:py-32"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      <div class="min-w-0 lg:col-span-7">
        <ResolveImage
          :src="showcase.image"
          :alt="showcase.title"
          :progress="1"
          :stage="fx ? stage : undefined"
          sizes="100vw lg:60vw"
          class="w-full aspect-[16/10] cursor-ns-resize"
          @pointermove="onImageMove"
        />
        <pre
          class="mt-4 max-h-[11rem] font-mono text-[11px] leading-relaxed p-4 border border-hairline rounded-sm overflow-auto text-ink dark:text-paper transition-opacity duration-500"
          :class="activeIndex === LAST ? 'opacity-100' : 'opacity-0'"
          :aria-hidden="activeIndex !== LAST"
        ><code>{{ showcase.processSnippet }}</code></pre>
      </div>

      <div class="min-w-0 lg:col-span-5">
        <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
          {{ $t('process.eyebrow') }}
        </p>
        <h2 class="mt-4 font-display font-normal text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-paper">
          {{ $t('process.title') }}
        </h2>
        <p class="mt-6 text-body">
          {{ $t('process.hint') }}
        </p>

        <!-- Vertical ruler: four stops top to bottom, each with its text; a
             handle slides along the line with the stage -->
        <div
          ref="ruler"
          role="slider"
          tabindex="0"
          aria-orientation="vertical"
          :aria-label="$t('process.title')"
          :aria-valuemin="0"
          :aria-valuemax="LAST"
          :aria-valuenow="activeIndex"
          :aria-valuetext="$t(`process.stages.${STAGES[activeIndex]}.label`)"
          class="ruler relative mt-10 pl-8 cursor-ns-resize select-none touch-none"
          @pointerdown="onRulerDown"
          @pointermove="onRulerMove"
          @pointerup="onRulerUp"
          @pointercancel="onRulerUp"
          @keydown="onRulerKey"
        >
          <!-- track between the first and last dot, and the part already passed -->
          <div class="absolute left-[5px] top-[2.75rem] bottom-[2.75rem] w-px bg-hairline" />
          <div
            class="absolute left-[5px] top-[2.75rem] w-px bg-ink dark:bg-paper"
            :style="{ height: `calc((100% - 5.5rem) * ${stage / LAST})` }"
          />
          <span
            class="ruler-handle absolute left-[5.5px] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            :style="{ top: `calc(2.75rem + (100% - 5.5rem) * ${stage / LAST})` }"
          />
          <ol>
            <li
              v-for="(key, i) in STAGES"
              :key="key"
              class="h-[5.5rem] flex flex-col justify-center transition-opacity duration-300"
              :class="i === activeIndex ? 'opacity-100' : 'opacity-40'"
            >
              <button
                type="button"
                tabindex="-1"
                class="self-start font-display text-2xl leading-tight text-ink dark:text-paper cursor-pointer"
                @pointerdown.stop
                @click="go(i)"
              >
                {{ $t(`process.stages.${key}.label`) }}
              </button>
              <p class="mt-1 text-sm text-body leading-snug">
                {{ $t(`process.stages.${key}.body`) }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ruler:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 6px;
  border-radius: 2px;
}
.ruler-handle {
  background: linear-gradient(90deg, #2B3BFF, #C04BFF);
  box-shadow: 0 0 0 4px var(--color-paper);
}
</style>
