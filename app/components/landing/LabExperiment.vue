<script setup lang="ts">
import type { Project } from '~/data/projects'

// One Lab experiment: it idles as a loose particle cloud ("not finished yet")
// and assembles into its cover while hovered / focused. On touch the first tap
// assembles and the second opens the live experiment.
const props = defineProps<{ project: Project, index: number }>()

const fx = useFxEnabled()
const IDLE = 0.22
const target = ref(IDLE)
const progress = ref(IDLE)
let raf = 0
let lastPointer = 'mouse'

const animate = () => {
  cancelAnimationFrame(raf)
  const step = () => {
    progress.value += (target.value - progress.value) * 0.08
    if (Math.abs(target.value - progress.value) > 0.002) raf = requestAnimationFrame(step)
    else progress.value = target.value
  }
  raf = requestAnimationFrame(step)
}
const assemble = () => {
  target.value = 1
  animate()
}
const disperse = () => {
  target.value = IDLE
  animate()
}
onBeforeUnmount(() => cancelAnimationFrame(raf))

const formed = computed(() => !fx.value || progress.value > 0.9)
const label = computed(() => `EXP-${String(props.index + 1).padStart(2, '0')} · ${props.project.labTag ?? props.project.tags[0] ?? ''}`)
const name = computed(() => props.project.title.split(' — ')[0])

const onPointerDown = (e: PointerEvent) => {
  lastPointer = e.pointerType
}
const onPointerEnter = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') assemble()
}
const onPointerLeave = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') disperse()
}
const onClick = (e: MouseEvent) => {
  if (fx.value && lastPointer !== 'mouse' && target.value !== 1) {
    e.preventDefault()
    assemble()
  }
}
</script>

<template>
  <HalftoneReveal>
    <a
      :href="project.links.preview"
      target="_blank"
      rel="noopener"
      class="block focus-visible:outline-offset-8"
      @pointerdown="onPointerDown"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @focus="assemble"
      @blur="disperse"
      @click="onClick"
    >
      <ResolveImage
        :src="project.image"
        :alt="project.title"
        :progress="fx ? progress : 1"
        sizes="100vw sm:50vw"
        class="w-full aspect-[4/3]"
      />
      <p class="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
        {{ label }}
      </p>
      <p
        class="mt-2 font-display font-normal text-2xl sm:text-3xl leading-tight transition-opacity duration-500"
        :class="formed ? 'opacity-100' : 'opacity-40'"
      >
        {{ name }}
        <UIcon
          name="i-lucide-arrow-up-right"
          class="size-5 align-middle transition-opacity duration-500"
          :class="formed ? 'opacity-100' : 'opacity-0'"
        />
      </p>
      <p
        class="mt-2 max-w-md text-sm leading-relaxed text-paper/65 transition-opacity duration-500"
        :class="formed ? 'opacity-100' : 'opacity-0'"
      >
        {{ project.description }}
      </p>
    </a>
  </HalftoneReveal>
</template>
