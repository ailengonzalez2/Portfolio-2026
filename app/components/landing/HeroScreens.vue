<script setup lang="ts">
// Screens from real projects drifting in three slow vertical columns beside
// the hero title. Purely decorative: the projects are linked further down.
const SHOTS = [
  'codecave', 'habito', 'docta', 'asistente', 'yogaapp',
  'codecave1', 'habito1', 'docta1', 'asistente1', 'codecave2',
  'habito2', 'docta2', 'asistente2', 'codecave3', 'docta3',
  'asistente3', 'codecave4', 'codecave5', 'codecave6', 'codecave7'
]

// Each column starts at a different point of the list and runs its own speed
// and direction, so neighbours never line up. The slice is doubled for a
// seamless translateY(-50%) loop.
const columns = [
  { up: true, duration: '48s', offset: 0 },
  { up: false, duration: '40s', offset: 7 },
  { up: true, duration: '54s', offset: 14 }
].map((c) => {
  const items = Array.from({ length: 6 }, (_, k) => `/hero/screens/${SHOTS[(c.offset + k) % SHOTS.length]}.webp`)
  return { ...c, loop: [...items, ...items] }
})
</script>

<template>
  <div
    class="hero-screens pointer-events-none absolute inset-y-0 hidden xl:grid grid-cols-3 gap-5"
    aria-hidden="true"
  >
    <div
      v-for="(col, i) in columns"
      :key="i"
      class="min-w-0 overflow-hidden"
    >
      <div
        class="column flex flex-col gap-5"
        :class="col.up ? 'is-up' : 'is-down'"
        :style="{ animationDuration: col.duration }"
      >
        <img
          v-for="(src, k) in col.loop"
          :key="k"
          :src="src"
          alt=""
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
          class="shot block w-full aspect-[4/3] object-cover rounded-[6px]"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-screens {
  /* Right edge lines up with the navbar's "Hire me" button. */
  right: calc(max(0px, (100vw - 80rem) / 2) + 2rem);
  width: min(34vw, 34rem);
  /* Fades out under the navbar and before the fold. */
  mask-image: linear-gradient(to bottom, transparent 6%, #000 26%, #000 80%, transparent 98%);
}

.shot {
  box-shadow:
    0 0 0 1px rgb(18 18 18 / 0.06),
    0 1px 2px rgb(18 18 18 / 0.04),
    0 12px 28px -8px rgb(18 18 18 / 0.14);
}

.column {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

.is-up { animation-name: screens-up; }
.is-down { animation-name: screens-down; }

@keyframes screens-up {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}

@keyframes screens-down {
  from { transform: translateY(-50%); }
  to { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .column { animation: none; }
}
</style>
