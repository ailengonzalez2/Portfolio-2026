<script setup lang="ts">
import { tween } from '~/webgl/loop'

// Ailen's portrait as a living halftone of particles. It assembles once the
// layer is live, the cursor pushes dots away, and `morph` (0–1, driven by the
// page scroll) turns it into her signature; `fade` dissolves it. Without
// WebGL it is the photo, revealed in halftone.
const props = withDefaults(defineProps<{ morph?: number, fade?: number }>(), { morph: 0, fade: 0 })

const root = ref<HTMLElement | null>(null)
const progress = ref(0)

const { ready } = useWebGLLayer(root, async () => {
  const rect = root.value?.getBoundingClientRect()
  if (!rect?.width || !rect.height) return null
  const { createParticlePortrait } = await import('~/webgl/particles/portrait')
  return createParticlePortrait({
    src: '/about/portrait.jpg',
    signatureSrc: '/signature.png',
    aspect: rect.width / rect.height
  })
}, (layer) => {
  const u = layer.material.uniforms
  u.uProgress!.value = progress.value
  u.uMorph!.value = props.morph
  u.uOpacity!.value = 1 - props.fade
})

watch(ready, (live) => {
  if (!live) return
  tween(0, 1, 2400, (v) => {
    progress.value = v
  })
})
</script>

<template>
  <div
    ref="root"
    class="relative"
  >
    <HalftoneReveal class="size-full">
      <NuxtImg
        src="/about/portrait.jpg"
        alt="Ailen Gonzalez"
        sizes="(max-width: 1024px) 80vw, 480px"
        eager
        class="size-full object-cover transition-opacity duration-500"
        :class="ready ? 'opacity-0' : 'opacity-100'"
      />
    </HalftoneReveal>
  </div>
</template>
