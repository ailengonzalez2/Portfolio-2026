<script setup lang="ts">
// Paper curtain + the destination page's name assembling from particles.
// Sits above page content and below the WebGL canvas (z-40) and the header.
const { state, markReady } = usePageCurtain()
</script>

<template>
  <div
    v-if="state.label"
    class="fixed inset-0 z-[39] flex items-center justify-center px-6 bg-paper dark:bg-ink pointer-events-none"
    :style="{ opacity: state.opacity }"
    aria-hidden="true"
  >
    <ParticleName
      :key="state.label"
      :progress="state.progress"
      :opacity="state.opacity"
      :point-size="3.2"
      @ready="markReady"
    >
      <p class="font-display font-normal text-[clamp(3rem,11vw,10rem)] leading-[0.9] tracking-[-0.02em] text-center btn-gradient-text pb-[0.08em]">
        {{ state.label }}
      </p>
    </ParticleName>
  </div>
</template>
