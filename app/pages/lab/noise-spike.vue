<script setup lang="ts">
// THROWAWAY spike page (plan Task 1). Deleted in Task 6.
definePageMeta({ layout: false })

useHead({
  meta: [{ name: 'robots', content: 'noindex' }],
  link: [{
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap'
  }]
})

const intro = ref(0)
const step = ref(3)
const size = ref(3.6)
const scatter = ref(1)
const mouseRadius = ref(110)
const manual = ref(false)
const manualProgress = ref(1)
const { y } = useWindowScroll()

onMounted(() => {
  const start = performance.now()
  const tick = () => {
    const k = Math.min(1, (performance.now() - start) / 2400)
    intro.value = 1 - (1 - k) ** 3
    if (k < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

const vh = () => (import.meta.client ? window.innerHeight : 800)
const progress = computed(() => manual.value
  ? manualProgress.value
  : intro.value * (1 - Math.min(1, y.value / vh())))
</script>

<template>
  <div
    class="min-h-[300vh]"
    style="background:#F2EFE9;color:#121212"
  >
    <section class="sticky top-0 h-svh flex flex-col justify-center px-6 sm:px-16">
      <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.6">
        AI product design &amp; frontend
      </p>
      <ParticleName
        :progress="progress"
        :step="step"
        :point-size="size"
        :scatter="scatter"
        :mouse-radius="mouseRadius"
        class="mt-6"
      >
        <h1
          class="leading-[0.88]"
          style="font-family:Fraunces,serif;font-size:clamp(3.5rem,13vw,12rem);font-weight:400"
        >
          Ailen<br>Gonzalez
        </h1>
      </ParticleName>
      <p
        class="mt-8 max-w-xl text-xl"
        style="opacity:.75"
      >
        I design and build AI products end to end — from Figma to production code.
      </p>
    </section>

    <div
      class="fixed bottom-4 left-4 z-50 w-72 rounded-lg p-4 text-xs space-y-2"
      style="background:#121212;color:#F2EFE9;font-family:ui-monospace,monospace"
    >
      <label class="flex items-center gap-2"><input
        v-model="manual"
        type="checkbox"
      > manual (else intro + scroll)</label>
      <label class="block">assembled {{ progress.toFixed(2) }}<input
        v-model.number="manualProgress"
        class="w-full"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :disabled="!manual"
      ></label>
      <label class="block">density (px between) {{ step }}<input
        v-model.number="step"
        class="w-full"
        type="range"
        min="2"
        max="8"
        step="1"
      ></label>
      <label class="block">particle size {{ size.toFixed(1) }}<input
        v-model.number="size"
        class="w-full"
        type="range"
        min="1"
        max="6"
        step="0.1"
      ></label>
      <label class="block">scatter {{ scatter.toFixed(2) }}<input
        v-model.number="scatter"
        class="w-full"
        type="range"
        min="0.2"
        max="2"
        step="0.05"
      ></label>
      <label class="block">mouse radius {{ mouseRadius }}<input
        v-model.number="mouseRadius"
        class="w-full"
        type="range"
        min="0"
        max="300"
        step="5"
      ></label>
    </div>
  </div>
</template>
