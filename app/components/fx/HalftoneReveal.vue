<script setup lang="ts">
// Reveals its content through a halftone dot mask (dots grow until solid) the
// first time it scrolls into view: the DOM-only analog of the particle layers.
// SSR renders the content plain; nothing is hidden for reduced motion, without
// JS, or when the element is already on screen at mount (no flash).
const props = withDefaults(defineProps<{ tag?: string, delay?: number }>(), { tag: 'div', delay: 0 })

const root = ref<HTMLElement | null>(null)
const state = ref<'plain' | 'hidden' | 'in'>('plain')
let observer: IntersectionObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const el = root.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = el.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return
  state.value = 'hidden'
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    observer?.disconnect()
    timer = setTimeout(() => {
      state.value = 'in'
    }, props.delay * 1000)
  }, { rootMargin: '0px 0px -10% 0px' })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})

// Drop the mask once solid so it can't clip shadows or hover states.
const onEnd = (e: TransitionEvent) => {
  if (e.target === root.value && state.value === 'in') state.value = 'plain'
}
</script>

<template>
  <component
    :is="tag"
    ref="root"
    :class="{ 'halftone': state !== 'plain', 'halftone--hidden': state === 'hidden' }"
    @transitionend="onEnd"
  >
    <slot />
  </component>
</template>
