<script setup lang="ts">
import { Motion, useReducedMotion } from 'motion-v'
import { computed } from 'vue'

// Unified scroll-reveal: content rises + fades (+ a touch of blur) as it
// enters the viewport, so scrolling has a consistent rhythm. Respects
// prefers-reduced-motion (falls back to a plain opacity fade).
const props = withDefaults(defineProps<{
  delay?: number
  y?: number
  blur?: number
  duration?: number
  once?: boolean
}>(), {
  delay: 0,
  y: 24,
  blur: 6,
  duration: 0.6,
  once: true
})

const reduced = useReducedMotion()

const initial = computed(() =>
  reduced.value
    ? { opacity: 0 }
    : { opacity: 0, y: props.y, filter: `blur(${props.blur}px)` }
)

const inView = computed(() =>
  reduced.value
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' }
)
</script>

<template>
  <Motion
    :initial="initial"
    :while-in-view="inView"
    :transition="{ duration: reduced ? 0.3 : props.duration, delay: props.delay, ease: [0.22, 1, 0.36, 1] }"
    :in-view-options="{ once: props.once, margin: '0px 0px -12% 0px' }"
  >
    <slot />
  </Motion>
</template>
