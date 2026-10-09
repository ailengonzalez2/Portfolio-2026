<script setup lang="ts">
import type { LanyardScene } from '~/webgl/lanyard/scene'

// Conference badge with Ailen's photo hanging from a lanyard (three.js, own
// canvas). It drops in, swings, can be dragged and flung, and a click flips
// it. Without WebGL it is a static badge.
//
// The component is the badge's slot in the layout; the canvas fills the
// nearest positioned ancestor (the page section), so the swing passes over
// the text next to it instead of being clipped.
const { t, locale } = useI18n()

const slot = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const fallback = ref(false)
let scene: LanyardScene | null = null
let generation = 0

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

async function mount() {
  const gen = ++generation
  scene?.dispose()
  scene = null
  if (!stage.value) return
  try {
    const { createLanyardScene } = await import('~/webgl/lanyard/scene')
    const created = await createLanyardScene(stage.value, {
      text: {
        first: 'Ailen',
        last: 'Gonzalez',
        role: t('hero.title'),
        site: 'ailengonzalez.ar',
        facts: ['Córdoba, Argentina', t('about.badge.remote'), t('about.badge.languages')]
      },
      photo: '/about/badge-photo.jpg',
      signature: '/signature.png',
      label: t('about.badge.roles'),
      frame: () => {
        const s = slot.value!.getBoundingClientRect()
        const c = stage.value!.getBoundingClientRect()
        return { x: s.left + s.width / 2 - c.left, height: s.height }
      },
      still: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    })
    // Unmounted or remounted (locale change) while loading.
    if (gen !== generation) created.dispose()
    else scene = created
  } catch (error) {
    console.error('[lanyard]', error)
    fallback.value = true
  }
}

onMounted(() => {
  if (!hasWebGL()) fallback.value = true
  else mount()
})
watch(locale, () => {
  if (!fallback.value) mount()
})
onBeforeUnmount(() => {
  generation++
  scene?.dispose()
  scene = null
})
</script>

<template>
  <figure
    ref="slot"
    class="flex flex-col justify-end"
  >
    <div
      v-if="!fallback"
      ref="stage"
      class="absolute inset-0 z-10 pointer-events-none"
    />
    <div
      v-else
      class="flex flex-1 items-center justify-center"
    >
      <div class="w-56 rounded-2xl bg-white shadow-xl overflow-hidden">
        <NuxtImg
          src="/about/badge-photo.jpg"
          alt="Ailen Gonzalez"
          width="224"
          height="224"
          class="w-full aspect-square object-cover"
        />
        <p class="px-4 pt-3 font-display text-3xl text-ink">
          Ailen Gonzalez
        </p>
        <p class="px-4 pb-4 text-sm text-body">
          {{ $t('hero.title') }}
        </p>
      </div>
    </div>
    <figcaption
      v-if="fallback"
      class="pb-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-label"
    >
      {{ $t('about.portraitCaption') }}
    </figcaption>
  </figure>
</template>
