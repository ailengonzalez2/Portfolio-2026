<script setup lang="ts">
// Fades and rises its content in the first time it scrolls into view. A
// lightweight stand-in for motion-v's <Motion initial / while-in-view>.
const props = withDefaults(defineProps<{
  /** px to rise from */
  y?: number
  /** seconds */
  duration?: number
  /** seconds */
  delay?: number
}>(), { y: 20, duration: 0.5, delay: 0 })

const root = ref<HTMLElement | null>(null)
const shown = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    shown.value = true
    return
  }
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    shown.value = true
    observer?.disconnect()
  }, { rootMargin: '0px 0px -8% 0px' })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="root"
    class="reveal"
    :class="{ 'is-shown': shown }"
    :style="{ '--y': `${props.y}px`, '--duration': `${props.duration}s`, '--delay': `${props.delay}s` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(var(--y));
  transition:
    opacity var(--duration) cubic-bezier(0.22, 1, 0.36, 1) var(--delay),
    transform var(--duration) cubic-bezier(0.22, 1, 0.36, 1) var(--delay);
}
.reveal.is-shown {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transform: none;
    transition: opacity 0.2s ease;
  }
}
/* No JavaScript: never hide content. */
@media (scripting: none) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>
