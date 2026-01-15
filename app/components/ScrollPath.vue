<script setup lang="ts">
const pathRef = ref<SVGPathElement | null>(null)
const pathLength = ref(0)
const scrollProgress = ref(0)
const documentHeight = ref(0)

// Path that flows from right to left with a loop, ending off screen to the right
const svgPath = `M 90 0
  C 90 80, 70 120, 50 180
  S 10 280, 15 350
  C 20 400, 60 420, 70 380
  C 80 340, 50 320, 35 360
  C 20 400, 30 450, 50 500
  S 85 580, 85 650
  C 85 750, 40 800, 30 850
  C 20 900, 60 940, 100 960
  C 150 985, 200 990, 300 995`

onMounted(() => {
  // Calculate document height for proper scaling
  const updateDocHeight = () => {
    documentHeight.value = document.documentElement.scrollHeight
  }

  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength()
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight
    // Calculate progress based on how far down the viewport center is
    const viewportCenter = scrollTop + (window.innerHeight * 0.5)
    const progress = viewportCenter / docHeight
    scrollProgress.value = Math.min(Math.max(progress, 0), 1)
  }

  // Initial setup
  updateDocHeight()

  // Watch for resize and content changes
  const resizeObserver = new ResizeObserver(() => {
    updateDocHeight()
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
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Animated path -->
      <path
        ref="pathRef"
        :d="svgPath"
        stroke="url(#pathGradient)"
        stroke-width="24"
        stroke-linecap="round"
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="dashOffset"
        filter="url(#glow)"
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
  height: v-bind('documentHeight + "px"');
  min-height: 100vh;
  overflow: visible;
}

</style>
