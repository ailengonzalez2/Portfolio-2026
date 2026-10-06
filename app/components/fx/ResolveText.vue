<script setup lang="ts">
import { useScroll } from 'motion-v'
import { findPhrase, splitWords, wordProgress } from '~/webgl/math'
import { tween } from '~/webgl/loop'

// Real text that resolves word by word: blur → sharp, light → firm (Fraunces
// wght/SOFT axes). DOM only. `on="scroll"` ties it to the scroll position;
// `on="load"` plays it once on mount (for headings visible at first paint).
// The highlighted phrase turns gradient once resolved.
const props = withDefaults(defineProps<{
  text: string
  highlight?: string
  tag?: string
  on?: 'scroll' | 'load'
}>(), { highlight: '', tag: 'p', on: 'scroll' })

const root = ref<HTMLElement | null>(null)
const fx = useFxEnabled()
const progress = ref(1)

const words = computed(() => splitWords(props.text))
const range = computed(() => props.highlight ? findPhrase(words.value, splitWords(props.highlight)) : null)

const { scrollYProgress } = useScroll({ target: root, offset: ['start 0.85', 'end 0.45'] })
let off: (() => void) | undefined
onMounted(() => {
  if (props.on === 'load') {
    progress.value = 0
    tween(0, 1, 1600, (v) => {
      progress.value = v
    })
    return
  }
  progress.value = scrollYProgress.get()
  off = scrollYProgress.on('change', (v) => {
    progress.value = v
  })
})
onBeforeUnmount(() => off?.())

const wp = (i: number) => fx.value ? wordProgress(progress.value, i, words.value.length) : 1

const wordStyle = (i: number) => {
  if (!fx.value) return undefined
  const w = wp(i)
  return {
    opacity: 0.12 + 0.88 * w,
    filter: `blur(${((1 - w) * 6).toFixed(2)}px)`,
    fontVariationSettings: `'wght' ${Math.round(300 + 200 * w)}, 'SOFT' ${Math.round(100 * (1 - w))}`
  }
}

const isHighlighted = (i: number) => !!range.value && i >= range.value[0] && i < range.value[1] && wp(i) > 0.95
</script>

<template>
  <component
    :is="tag"
    ref="root"
  >
    <template
      v-for="(word, i) in words"
      :key="`${i}-${word}`"
    >
      <span
        class="inline-block"
        :class="{ 'btn-gradient-text': isHighlighted(i) }"
        :style="wordStyle(i)"
      >{{ word }}</span>{{ ' ' }}
    </template>
  </component>
</template>
