<script setup lang="ts">
// Wraps a heading: on the WebGL path its glyphs become particles that
// assemble with `progress` (0 scattered → 1 formed). The HTML text stays in
// place for SEO and screen readers, only visually hidden while particles draw.
const props = withDefaults(defineProps<{
  progress: number
  step?: number
  pointSize?: number
  scatter?: number
  mouseRadius?: number
  /** particle layer opacity (e.g. fading with a curtain) */
  opacity?: number
  /** 1 = page-load field: unformed particles float visibly, shown by `density` */
  field?: number
  /** 0–1, how many field particles show and how bright/big */
  density?: number
}>(), { step: 3, pointSize: 3.6, scatter: 1, mouseRadius: 110, opacity: 1, field: 0, density: 1 })
const emit = defineEmits<{ ready: [] }>()

const root = ref<HTMLElement | null>(null)

const { ready, refresh } = useWebGLLayer(root, async () => {
  if (!root.value) return null
  const { createParticleText } = await import('~/webgl/particles/text')
  return createParticleText(root.value, {
    step: props.step,
    pointSize: props.pointSize,
    scatter: props.scatter,
    mouseRadius: props.mouseRadius
  })
}, (layer) => {
  const u = layer.material.uniforms
  u.uProgress!.value = props.progress
  u.uPointSize!.value = props.pointSize
  u.uScatter!.value = props.scatter
  u.uMouseRadius!.value = props.mouseRadius
  u.uOpacity!.value = props.opacity
  u.uField!.value = props.field
  u.uDensity!.value = props.density
})

// Glyph positions depend on layout: rebuild when the element resizes.
let observer: ResizeObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined
let lastWidth = 0
onMounted(() => {
  if (!root.value) return
  lastWidth = root.value.offsetWidth
  observer = new ResizeObserver(() => {
    const width = root.value?.offsetWidth ?? 0
    if (width === lastWidth) return
    lastWidth = width
    clearTimeout(timer)
    timer = setTimeout(refresh, 200)
  })
  observer.observe(root.value)
})
watch(() => props.step, () => refresh())
// Let the parent start its intro only once particles are actually on screen.
watch(ready, (live) => {
  if (live) emit('ready')
})
onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})
</script>

<template>
  <div
    ref="root"
    class="particle-name"
    :class="{ 'particle-name--live': ready }"
  >
    <slot />
  </div>
</template>

<style scoped>
.particle-name--live > :deep(*) {
  opacity: 0;
}
</style>
