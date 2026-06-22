<script setup lang="ts">
import { Motion, useScroll, useTransform, useReducedMotion } from 'motion-v'
import { ref, computed } from 'vue'

// Scroll-linked word reveal: each word fades + unblurs as the heading
// scrolls through the viewport, so the line "writes itself in" on scroll.
// Falls back to a plain visible heading when reduced motion is requested.
const props = defineProps<{ text: string }>()

const words = computed(() => props.text.split(/\s+/).filter(Boolean))
const reduced = useReducedMotion()

const target = ref<HTMLElement | null>(null)
const { scrollYProgress } = useScroll({
  target,
  offset: ['start 0.9', 'start 0.35']
})

const total = words.value.length
// One opacity + blur MotionValue per word, each mapped to its own slice of
// the scroll progress so words light up left-to-right.
const opacities = words.value.map((_, i) =>
  useTransform(scrollYProgress, [i / total, (i + 0.85) / total], [0.12, 1])
)
const filters = words.value.map((_, i) => {
  const px = useTransform(scrollYProgress, [i / total, (i + 0.85) / total], [10, 0])
  return useTransform(px, (v: number) => `blur(${v}px)`)
})
</script>

<template>
  <h2
    ref="target"
    class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight uppercase text-heading dark:text-white"
  >
    <Motion
      v-for="(word, i) in words"
      :key="i"
      as="span"
      class="inline-block mr-[0.25em] last:mr-0"
      :style="reduced ? {} : { opacity: opacities[i], filter: filters[i] }"
    >
      {{ word }}
    </Motion>
  </h2>
</template>
