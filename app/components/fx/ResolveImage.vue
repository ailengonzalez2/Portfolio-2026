<script setup lang="ts">
import { crispAmount, remap } from '~/webgl/math'
import { waitForImage } from '~/webgl/dom'

// A real <img> that, on the WebGL path, first appears as particles that
// assemble as it scrolls in (or as `progress` says), then hands over to the
// crisp image. Hover / long-press shows the latent layer: only the edges, in
// ink dots. `stage` (0–3) drives the Process section's sketch → code modes.
// Must not live inside a clipping (overflow-hidden) or transformed ancestor.
const props = withDefaults(defineProps<{
  src: string
  alt: string
  /** 0–1; when omitted, driven by the element's scroll position */
  progress?: number
  latent?: boolean
  latentSrc?: string
  /** Process mode, 0 sketch → 3 color */
  stage?: number
  sizes?: string
  eager?: boolean
}>(), {
  progress: undefined,
  latent: false,
  latentSrc: undefined,
  stage: undefined,
  sizes: '100vw lg:60vw',
  eager: false
})

const root = ref<HTMLElement | null>(null)
const latentOn = ref(false)
let latentValue = 0
let imgEl: HTMLImageElement | null = null
let pressTimer: ReturnType<typeof setTimeout> | undefined

const { ready } = useWebGLLayer(root, async () => {
  imgEl = root.value?.querySelector('img') ?? null
  const rect = root.value?.getBoundingClientRect()
  if (!imgEl || !rect?.width || !rect.height) return null
  try {
    const src = await waitForImage(imgEl)
    const { createParticleImage } = await import('~/webgl/particles/image')
    return await createParticleImage({ src, latentSrc: props.latentSrc, aspect: rect.width / rect.height })
  } catch {
    return null
  }
}, (layer, info) => {
  const u = layer.material.uniforms
  const progress = props.progress ?? info.progress
  latentValue += ((latentOn.value ? 1 : 0) - latentValue) * 0.12
  u.uProgress!.value = progress
  u.uLatent!.value = latentValue
  u.uStage!.value = props.stage ?? -1
  const crisp = props.stage !== undefined
    ? crispAmount(remap(props.stage, 2.6, 3), 0)
    : crispAmount(progress, latentValue)
  u.uOpacity!.value = 1 - crisp
  if (imgEl) imgEl.style.opacity = crisp.toFixed(3)
})

// Back to the plain image whenever the layer is gone (fallback, context loss).
watch(ready, (live) => {
  if (!live && imgEl) imgEl.style.opacity = ''
})

const onEnter = (e: PointerEvent) => {
  if (props.latent && e.pointerType === 'mouse') latentOn.value = true
}
const onLeave = () => {
  clearTimeout(pressTimer)
  latentOn.value = false
}
const onDown = (e: PointerEvent) => {
  if (!props.latent || e.pointerType === 'mouse') return
  pressTimer = setTimeout(() => {
    latentOn.value = true
  }, 350)
}
const onUp = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') onLeave()
}
// Android opens the image menu on long-press; the press is ours when latent.
const onContextMenu = (e: Event) => {
  if (props.latent) e.preventDefault()
}
onBeforeUnmount(() => clearTimeout(pressTimer))
</script>

<template>
  <div
    ref="root"
    class="resolve-image relative"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @pointerdown="onDown"
    @pointerup="onUp"
    @pointercancel="onLeave"
    @contextmenu="onContextMenu"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      class="size-full object-cover"
    />
  </div>
</template>

<style scoped>
.resolve-image {
  -webkit-touch-callout: none;
}
</style>
