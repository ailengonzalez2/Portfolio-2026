<script setup lang="ts">
const { isTransitioning, onCoverComplete, onRevealComplete } = usePageTransition()

const phase = ref<'idle' | 'covering' | 'revealing'>('idle')
const showPixels = ref(false)
const direction = ref<'in' | 'out'>('in')

watch(isTransitioning, (transitioning) => {
  if (transitioning && phase.value === 'idle') {
    // Start covering animation
    phase.value = 'covering'
    direction.value = 'in'
    showPixels.value = true
  }
})

const handleComplete = () => {
  if (phase.value === 'covering') {
    // Covering done, trigger navigation
    onCoverComplete()

    // Start reveal after small delay for page to load
    setTimeout(() => {
      phase.value = 'revealing'
      direction.value = 'out'
      showPixels.value = true
    }, 100)
  } else if (phase.value === 'revealing') {
    // Reveal complete
    phase.value = 'idle'
    showPixels.value = false
    onRevealComplete()
  }
}
</script>

<template>
  <PixelTransition
    :is-active="showPixels"
    color="#D5C8B0"
    :pixel-size="25"
    :duration="1.5"
    :direction="direction"
    pattern="vertical"
    @complete="handleComplete"
  />
</template>
