<script setup lang="ts">
const pathRef = ref<SVGPathElement | null>(null)
const pathLength = ref(0)
const scrollProgress = ref(0)
const pathEndPosition = ref(0)

// Path starts above viewport, flows with a loop, ends off screen to the right
const svgPath = `M 120 -50
  C 100 0, 90 50, 90 100
  C 90 180, 70 220, 50 280
  S 10 380, 15 450
  C 20 500, 60 520, 70 480
  C 80 440, 50 420, 35 460
  C 20 500, 30 550, 50 600
  S 85 680, 85 750
  C 85 850, 40 900, 30 950
  C 20 1000, 60 1040, 100 1060
  C 150 1085, 200 1090, 300 1095`

onMounted(() => {
  // Calculate the position where the path should end (at the Services section)
  const updatePathEnd = () => {
    const servicesSection = document.getElementById('services')
    pathEndPosition.value = servicesSection?.offsetTop || document.documentElement.scrollHeight
  }

  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength()
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY
    // Path completes when entering the services section (with a small offset to enter smoothly)
    const targetScroll = Math.max(pathEndPosition.value - window.innerHeight * 0.5, 1)
    const progress = targetScroll > 0 ? scrollTop / targetScroll : 0
    scrollProgress.value = Math.min(Math.max(progress, 0), 1)
  }

  // Initial setup
  updatePathEnd()

  // Watch for resize and content changes
  const resizeObserver = new ResizeObserver(() => {
    updatePathEnd()
    if (pathRef.value) {
      pathLength.value = pathRef.value.getTotalLength()
    }
  })
  resizeObserver.observe(document.body)

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    resizeObserver.disconnect()
  })
})

const dashOffset = computed(() => {
  return pathLength.value * (1 - scrollProgress.value)
})
</script>

<template>
  <div class="scroll-path-container hidden lg:block">
    <svg
      class="scroll-path-svg"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Gradient definitions -->
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAC789" />
          <stop offset="50%" stop-color="#c27aff" />
          <stop offset="100%" stop-color="#A11EE2" />
        </linearGradient>
      </defs>

      <!-- Animated path -->
      <path
        ref="pathRef"
        :d="svgPath"
        stroke="url(#pathGradient)"
        stroke-width="32"
        stroke-linecap="round"
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
  </div>
</template>

<style scoped>
.scroll-path-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

.scroll-path-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: v-bind('pathEndPosition + "px"');
  min-height: 100vh;
  overflow: visible;
}

</style>
