<script setup lang="ts">
// THROWAWAY comparison page for the Lab section (options A and B).
// Delete once the user picks one.
import { projects } from '~/data/projects'

useHead({ meta: [{ name: 'robots', content: 'noindex' }] })

const lab = projects.filter(p => p.kind === 'lab')
const tags: Record<string, string> = {
  'brand-spark': 'LLM · streaming UI',
  'loft-3d': 'Three.js · 3D',
  'contap': 'NFC · product',
  'jelly': 'WebGPU · soft-body'
}

// Option A: each experiment idles as a loose cloud and assembles on hover/tap.
const IDLE = 0.22
const target = ref<Record<string, number>>({})
const progress = ref<Record<string, number>>({})
for (const p of lab) {
  target.value[p.id] = IDLE
  progress.value[p.id] = IDLE
}
let raf = 0
onMounted(() => {
  const step = () => {
    for (const p of lab) {
      const cur = progress.value[p.id] ?? IDLE
      progress.value[p.id] = cur + ((target.value[p.id] ?? IDLE) - cur) * 0.08
    }
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
const formed = (id: string) => (progress.value[id] ?? 0) > 0.9

// Option B: tilted specimen cards on a table.
const tilts = [-4, 3, -2, 5]
</script>

<template>
  <div class="pb-32">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-label">
        Comparación (página temporal)
      </p>
    </div>

    <!-- OPTION A -->
    <section class="mt-10 bg-ink text-paper py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
          Opción A · Experimentos en estado latente
        </p>
        <h2 class="mt-4 font-display font-normal text-4xl sm:text-6xl leading-[0.95]">
          The lab
        </h2>
        <p class="mt-4 max-w-xl text-paper/70">
          Things that don't have a client yet. They stay loose until you touch them.
        </p>

        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-24">
          <a
            v-for="(p, i) in lab"
            :key="p.id"
            :href="p.links.preview"
            target="_blank"
            rel="noopener"
            class="block"
            @pointerenter="target[p.id] = 1"
            @pointerleave="target[p.id] = IDLE"
          >
            <ResolveImage
              :src="p.image"
              :alt="p.title"
              :progress="progress[p.id]"
              sizes="100vw sm:50vw"
              class="w-full aspect-[4/3]"
            />
            <p class="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
              EXP-{{ String(i + 1).padStart(2, '0') }} · {{ tags[p.id] }}
            </p>
            <p
              class="mt-2 font-display text-2xl sm:text-3xl transition-opacity duration-500"
              :class="formed(p.id) ? 'opacity-100' : 'opacity-40'"
            >
              {{ p.title.split(' — ')[0] }}
            </p>
          </a>
        </div>
      </div>
    </section>

    <!-- OPTION B -->
    <section class="mt-24 py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-label">
          Opción B · Mesa de laboratorio
        </p>
        <h2 class="mt-4 font-display font-normal text-4xl sm:text-6xl leading-[0.95] text-ink">
          The lab
        </h2>

        <div class="lab-table mt-16 rounded-sm px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <a
            v-for="(p, i) in lab"
            :key="p.id"
            :href="p.links.preview"
            target="_blank"
            rel="noopener"
            class="specimen group block bg-paper p-3 pb-5"
            :style="{ '--tilt': `${tilts[i]}deg` }"
          >
            <NuxtImg
              :src="p.image"
              :alt="p.title"
              sizes="100vw sm:50vw"
              class="w-full aspect-[4/3] object-cover"
            />
            <div class="mt-4 flex items-baseline justify-between gap-4 px-1">
              <p class="font-display text-xl text-ink">
                {{ p.title.split(' — ')[0] }}
              </p>
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-label">
                EXP-{{ String(i + 1).padStart(2, '0') }}
              </p>
            </div>
            <p class="mt-1 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-label">
              {{ tags[p.id] }}
            </p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lab-table {
  background: #e4dfd5;
  box-shadow: inset 0 2px 30px rgb(0 0 0 / 0.08);
}

.specimen {
  transform: rotate(var(--tilt));
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.06), 0 12px 24px rgb(0 0 0 / 0.08);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
}

.specimen:hover {
  transform: rotate(0deg) translateY(-10px) scale(1.03);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.08), 0 30px 50px rgb(0 0 0 / 0.16);
}
</style>
