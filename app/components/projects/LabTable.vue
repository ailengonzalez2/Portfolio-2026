<script setup lang="ts">
import type { Project } from '~/data/projects'
import { tween } from '~/webgl/loop'

// The lab as specimen cards on a table (the "mesa de laboratorio" layout):
// each card rests slightly rotated; hovering straightens and lifts it while its
// image re-assembles from particles. At rest the image is the crisp DOM one,
// so the rotation never misaligns the particle layer.
defineProps<{ projects: Project[] }>()

const TILTS = [-4, 3, -2, 5, -3, 4]
const progress = ref<Record<string, number>>({})
const fx = useFxEnabled()

const enter = async (id: string) => {
  if (!fx.value) return
  progress.value[id] = 0
  await new Promise(resolve => setTimeout(resolve, 180))
  await tween(0, 1, 1000, (v) => {
    progress.value[id] = v
  })
}
const leave = (id: string) => {
  progress.value[id] = 1
}
const nameOf = (p: Project) => p.title.split(' — ')[0]
</script>

<template>
  <div class="lab-table rounded-sm bg-surface px-5 sm:px-12 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14">
    <HalftoneReveal
      v-for="(p, i) in projects"
      :key="p.id"
    >
      <a
        :href="p.links.preview"
        target="_blank"
        rel="noopener"
        class="specimen group block bg-paper p-3 pb-5"
        :style="{ '--tilt': `${TILTS[i % TILTS.length]}deg` }"
        @pointerenter="enter(p.id)"
        @pointerleave="leave(p.id)"
        @focus="enter(p.id)"
        @blur="leave(p.id)"
      >
        <ResolveImage
          :src="p.image"
          :alt="p.title"
          :progress="progress[p.id] ?? 1"
          :cols="110"
          sizes="100vw sm:45vw"
          class="w-full aspect-[4/3]"
        />
        <div class="mt-4 flex items-baseline justify-between gap-4 px-1">
          <p class="font-display font-normal text-xl sm:text-2xl text-ink">
            {{ nameOf(p) }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4 align-middle opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-label shrink-0">
            EXP-{{ String(i + 1).padStart(2, '0') }}
          </p>
        </div>
        <p class="mt-1 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-label">
          {{ p.labTag ?? p.tags[0] }}
        </p>
        <p class="mt-3 px-1 text-sm leading-relaxed text-body">
          {{ p.description }}
        </p>
      </a>
    </HalftoneReveal>
  </div>
</template>

<style scoped>
.lab-table {
  box-shadow: inset 0 2px 30px rgb(0 0 0 / 0.08);
}

.specimen {
  transform: rotate(var(--tilt));
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.06), 0 12px 24px rgb(0 0 0 / 0.08);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
}

.specimen:hover,
.specimen:focus-visible {
  transform: rotate(0deg) translateY(-10px) scale(1.03);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.08), 0 30px 50px rgb(0 0 0 / 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .specimen { transform: none; }
}
</style>
