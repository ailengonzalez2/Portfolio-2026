<script setup lang="ts">
import type { Project } from '~/data/projects'

// Client work as an editorial index. On fine pointers a preview follows the
// cursor and the hovered project's cover assembles from particles inside it;
// on touch each row carries its own thumbnail.
const props = defineProps<{ projects: Project[] }>()

const localePath = useLocalePath()
const fx = useFxEnabled()
const fine = ref(false)
const hovered = ref<string | null>(null)
const pos = reactive({ x: 0, y: 0 })
const target = { x: 0, y: 0 }
const progress = ref<Record<string, number>>({})

const PREVIEW_W = 352
const PREVIEW_H = 264

const linkFor = (p: Project) => p.caseStudy
  ? { to: localePath(`/projects/${p.id}`), external: false }
  : { to: p.links.preview ?? localePath('/projects'), external: true }
const nameOf = (p: Project) => p.title.split(' — ')[0]
const subtitleOf = (p: Project) => p.title.split(' — ')[1] ?? ''

const onMove = (e: PointerEvent) => {
  target.x = Math.min(window.innerWidth - PREVIEW_W - 16, e.clientX + 32)
  target.y = Math.max(16, Math.min(window.innerHeight - PREVIEW_H - 16, e.clientY - PREVIEW_H / 2))
}

let raf = 0
let last = 0
// Frame-rate independent easing: `rate` is the per-frame factor at 60fps.
const ease = (rate: number, dt: number) => 1 - (1 - rate) ** (dt * 60)
const tick = (now: number) => {
  const dt = Math.min(0.1, (now - last) / 1000 || 0)
  last = now
  const follow = ease(0.18, dt)
  pos.x += (target.x - pos.x) * follow
  pos.y += (target.y - pos.y) * follow
  for (const p of props.projects) {
    const cur = progress.value[p.id] ?? 0
    const goal = hovered.value === p.id ? 1 : 0
    // Assemble steadily, scatter a little faster.
    progress.value[p.id] = cur + (goal - cur) * ease(goal > cur ? 0.06 : 0.12, dt)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  fine.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!fine.value) return
  window.addEventListener('pointermove', onMove, { passive: true })
  raf = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div>
    <ol class="project-index border-t border-hairline">
      <li
        v-for="(p, i) in projects"
        :key="p.id"
        class="transition-opacity duration-300"
      >
        <HalftoneReveal>
          <NuxtLink
            :to="linkFor(p).to"
            :target="linkFor(p).external ? '_blank' : undefined"
            :rel="linkFor(p).external ? 'noopener' : undefined"
            class="group grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[4rem_1fr_13rem_5rem] items-baseline gap-x-4 py-7 sm:py-9 border-b border-hairline"
            @pointerenter="hovered = p.id"
            @pointerleave="hovered = null"
            @focus="hovered = p.id"
            @blur="hovered = null"
          >
            <span class="font-mono text-[11px] text-label tabular-nums">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="min-w-0">
              <span class="block font-display font-normal text-3xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-paper transition-transform duration-500 ease-out group-hover:translate-x-3">
                {{ nameOf(p) }}
              </span>
              <span class="block mt-2 text-sm sm:text-base text-body">
                {{ subtitleOf(p) }}
              </span>
              <NuxtImg
                v-if="!fine"
                :src="p.image"
                :alt="p.title"
                sizes="100vw"
                loading="lazy"
                class="mt-5 w-full aspect-[4/3] object-cover"
              />
            </span>
            <span class="hidden sm:block font-mono text-[11px] uppercase tracking-[0.18em] text-label">
              {{ p.tags.slice(0, 2).join(' · ') }}
            </span>
            <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-label text-right">
              {{ p.date }}
              <UIcon
                :name="linkFor(p).external ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-right'"
                class="size-3.5 align-middle ml-1 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </NuxtLink>
        </HalftoneReveal>
      </li>
    </ol>

    <!-- Cursor-following preview (fine pointers only) -->
    <div
      v-if="fine"
      class="pointer-events-none fixed left-0 top-0 z-30 transition-opacity duration-300"
      :style="{ width: `${PREVIEW_W}px`, height: `${PREVIEW_H}px`, transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, opacity: hovered ? 1 : 0 }"
      aria-hidden="true"
    >
      <ResolveImage
        v-for="p in projects"
        v-show="fx || hovered === p.id"
        :key="p.id"
        :src="p.image"
        alt=""
        :progress="progress[p.id] ?? 0"
        :cols="90"
        sizes="360px"
        eager
        class="absolute inset-0"
      />
    </div>
  </div>
</template>

<style scoped>
/* Hovering the list dims every row but the one under the cursor */
.project-index:hover > li {
  opacity: 0.35;
}

.project-index:hover > li:hover {
  opacity: 1;
}
</style>
