<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { tween } from '~/webgl/loop'

// Shows `words` one at a time in the same spot. On the WebGL path the first
// one assembles from particles with `progress`, then the same particles fly
// from word to word. Without WebGL the words cross-fade. All words stay in the
// DOM (stacked in one grid cell) for SEO and screen readers.
const props = withDefaults(defineProps<{
  words: string[]
  progress: number
  holdMs?: number
  morphMs?: number
  pointSize?: number
}>(), { holdMs: 2200, morphMs: 1500, pointSize: 3 })

const root = ref<HTMLElement | null>(null)
const current = ref(0)
const from = ref(0)
const to = ref(0)
const morph = ref(0)

const { ready, refresh } = useWebGLLayer(root, async () => {
  if (!root.value) return null
  const els = Array.from(root.value.querySelectorAll<HTMLElement>('.pw-word'))
  const { createParticleMorph } = await import('~/webgl/particles/morph')
  return createParticleMorph(root.value, els, { pointSize: props.pointSize })
}, (layer) => {
  const u = layer.material.uniforms
  u.uProgress!.value = props.progress
  u.uFrom!.value = from.value
  u.uTo!.value = to.value
  u.uMorph!.value = morph.value
  u.uPointSize!.value = props.pointSize
})

// Cycle only once the first word has formed; the particle path waits for the
// flight to land before holding the next word.
let timer: ReturnType<typeof setTimeout> | undefined
let alive = true
const reduced = usePreferredReducedMotion()
const next = async () => {
  if (!alive) return
  const n = props.words.length
  const target = (current.value + 1) % n
  if (ready.value) {
    from.value = current.value
    to.value = target
    morph.value = 0
    current.value = target
    await tween(0, 1, props.morphMs, (v) => {
      morph.value = v
    }, v => v)
    // Settle: from and to are the same word now.
    from.value = target
    morph.value = 0
  } else {
    current.value = target
  }
  timer = setTimeout(next, props.holdMs)
}
const formed = computed(() => props.progress >= 0.98)
watch(formed, (on) => {
  if (on && !timer && reduced.value !== 'reduce') timer = setTimeout(next, props.holdMs)
}, { immediate: true })

let observer: ResizeObserver | undefined
let lastWidth = 0
let resizeTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  if (!root.value) return
  lastWidth = root.value.offsetWidth
  observer = new ResizeObserver(() => {
    const width = root.value?.offsetWidth ?? 0
    if (width === lastWidth) return
    lastWidth = width
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(refresh, 200)
  })
  observer.observe(root.value)
})
onBeforeUnmount(() => {
  alive = false
  clearTimeout(timer)
  clearTimeout(resizeTimer)
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    class="pw grid"
    :class="{ 'pw--live': ready }"
  >
    <span
      v-for="(word, i) in words"
      :key="word"
      class="pw-word"
      :class="{ 'is-on': i === current }"
    >{{ word }}</span>
  </div>
</template>

<style scoped>
.pw-word {
  grid-area: 1 / 1;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.pw-word.is-on {
  opacity: 1;
}

/* Particles draw every word; the DOM text only stays for SEO / readers. */
.pw--live .pw-word {
  opacity: 0;
  transition: none;
}
</style>
