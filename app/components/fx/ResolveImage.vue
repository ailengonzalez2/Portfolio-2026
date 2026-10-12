<script setup lang="ts">
import { crispAmount, remap } from '~/webgl/math'
import { waitForImage } from '~/webgl/dom'

// A real <img> that, on the WebGL path, first appears as particles that
// assemble as it scrolls in (or as `progress` says), then hands over to the
// crisp image. Hover / long-press shows the latent layer: only the edges, in
// ink dots — or, with `swapSrc`, the particles change into that second image.
// `stage` (0–3) drives the Process section's sketch → code modes.
// Must not live inside a clipping (overflow-hidden) or transformed ancestor.
const props = withDefaults(defineProps<{
  src: string
  alt: string
  /** 0–1; when omitted, driven by the element's scroll position */
  progress?: number
  latent?: boolean
  latentSrc?: string
  /** second image shown on hover/long-press instead of the latent layer */
  swapSrc?: string
  /** Process mode, 0 sketch → 3 color */
  stage?: number
  sizes?: string
  eager?: boolean
  /** particle columns (density) */
  cols?: number
}>(), {
  progress: undefined,
  latent: false,
  latentSrc: undefined,
  swapSrc: undefined,
  stage: undefined,
  sizes: '100vw lg:60vw',
  eager: false,
  cols: 160
})

const root = ref<HTMLElement | null>(null)
const latentOn = ref(false)
let latentValue = 0
let imgEl: HTMLImageElement | null = null
let altEl: HTMLImageElement | null = null
let pressTimer: ReturnType<typeof setTimeout> | undefined

const { ready } = useWebGLLayer(root, async () => {
  imgEl = root.value?.querySelector('img') ?? null
  altEl = root.value?.querySelector<HTMLImageElement>('img.swap-img') ?? null
  const rect = root.value?.getBoundingClientRect()
  if (!imgEl || !rect?.width || !rect.height) return null
  try {
    const src = await waitForImage(imgEl)
    const { createParticleImage } = await import('~/webgl/particles/image')
    return await createParticleImage({ src, latentSrc: props.latentSrc, altSrc: props.swapSrc, aspect: rect.width / rect.height, cols: props.cols })
  } catch {
    return null
  }
}, (layer, info) => {
  const u = layer.material.uniforms
  const progress = props.progress ?? info.progress
  latentValue += ((latentOn.value ? 1 : 0) - latentValue) * 0.12
  u.uProgress!.value = progress
  // Hover either swaps to the second image or shows the latent layer.
  u.uLatent!.value = props.swapSrc ? 0 : latentValue
  u.uSwap!.value = props.swapSrc ? latentValue : 0
  u.uStage!.value = props.stage ?? -1
  // A swap only shows particles mid-change; at rest on either side the crisp
  // image (first or second) is on top.
  const swapping = props.swapSrc ? 4 * latentValue * (1 - latentValue) : latentValue
  const crisp = props.stage !== undefined
    ? crispAmount(remap(props.stage, 2.6, 3), 0)
    : crispAmount(progress, swapping)
  u.uOpacity!.value = 1 - crisp
  const second = props.swapSrc && latentValue > 0.5 ? 1 : 0
  if (imgEl) imgEl.style.opacity = (crisp * (1 - second)).toFixed(3)
  if (altEl) altEl.style.opacity = (crisp * second).toFixed(3)
})

// Back to the plain image whenever the layer is gone (fallback, context loss).
watch(ready, (live) => {
  if (!live && imgEl) imgEl.style.opacity = ''
  if (!live && altEl) altEl.style.opacity = '0'
})

const hovers = computed(() => props.latent || !!props.swapSrc)
const onEnter = (e: PointerEvent) => {
  if (hovers.value && e.pointerType === 'mouse') latentOn.value = true
}
const onLeave = () => {
  clearTimeout(pressTimer)
  latentOn.value = false
}
const onDown = (e: PointerEvent) => {
  if (!hovers.value || e.pointerType === 'mouse') return
  pressTimer = setTimeout(() => {
    latentOn.value = true
  }, 350)
}
const onUp = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') onLeave()
}
// Android opens the image menu on long-press; the press is ours when latent.
const onContextMenu = (e: Event) => {
  if (hovers.value) e.preventDefault()
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
    <NuxtImg
      v-if="swapSrc"
      :src="swapSrc"
      alt=""
      :sizes="sizes"
      loading="lazy"
      class="swap-img absolute inset-0 size-full object-cover opacity-0"
    />
  </div>
</template>

<style scoped>
.resolve-image {
  -webkit-touch-callout: none;
}
</style>
