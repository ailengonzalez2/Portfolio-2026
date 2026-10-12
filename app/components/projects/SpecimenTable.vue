<script setup lang="ts">
import type { Project } from '~/data/projects'
import { tween } from '~/webgl/loop'

// Projects as specimen cards on a table (the "mesa de laboratorio" layout):
// each card rests slightly rotated; hovering straightens and lifts it while its
// image re-assembles from particles. At rest the image is the crisp DOM one,
// so the rotation never misaligns the particle layer. A card opens the live
// product (or the case study when there's no site); a separate button opens
// the case study.
const props = defineProps<{ projects: Project[], kind: 'client' | 'lab' }>()

const localePath = useLocalePath()
const linkFor = (p: Project) => p.links.preview
  ? { to: p.links.preview, external: true }
  : { to: localePath(p.caseStudy ? `/projects/${p.id}` : '/projects'), external: false }
// Only needed when the card itself goes to the live site.
const hasCaseButton = (p: Project) => !!(p.caseStudy && p.links.preview)
const codeOf = (i: number) => `${props.kind === 'lab' ? 'EXP-' : ''}${String(i + 1).padStart(2, '0')}`
const metaOf = (p: Project) => props.kind === 'lab' ? (p.labTag ?? p.tags[0] ?? '') : `${p.tags.slice(0, 2).join(' · ')} · ${p.date}`

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
      <div
        class="specimen group relative bg-paper p-3 pb-5"
        :style="{ '--tilt': `${TILTS[i % TILTS.length]}deg` }"
        @pointerenter="enter(p.id)"
        @pointerleave="leave(p.id)"
        @focusin="enter(p.id)"
        @focusout="leave(p.id)"
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
          <p class="font-display font-medium text-xl sm:text-2xl text-ink">
            <!-- The whole card is this link (its ::after covers the card) -->
            <NuxtLink
              :to="linkFor(p).to"
              :target="linkFor(p).external ? '_blank' : undefined"
              :rel="linkFor(p).external ? 'noopener' : undefined"
              class="card-link focus-visible:outline-none"
            >
              {{ nameOf(p) }}
            </NuxtLink>
            <UIcon
              :name="linkFor(p).external ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-right'"
              class="size-4 align-middle opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-label shrink-0">
            {{ codeOf(i) }}
          </p>
        </div>
        <p class="mt-1 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-label">
          {{ metaOf(p) }}
        </p>
        <p class="mt-3 px-1 text-sm leading-relaxed text-body">
          {{ p.description }}
        </p>
        <NuxtLink
          v-if="hasCaseButton(p)"
          :to="localePath(`/projects/${p.id}`)"
          class="relative z-10 mt-5 mx-1 inline-flex items-center gap-2 rounded-(--radius-btn) border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          {{ $t('work.caseStudy') }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4"
          />
        </NuxtLink>
      </div>
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

.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.specimen:has(.card-link:focus-visible) {
  outline: 2px solid var(--ui-color-primary-600);
  outline-offset: 4px;
}

.specimen:hover,
.specimen:focus-within {
  transform: rotate(0deg) translateY(-10px) scale(1.03);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.08), 0 30px 50px rgb(0 0 0 / 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .specimen { transform: none; }
}
</style>
