<script setup lang="ts">
interface Props {
  isActive: boolean
  color?: string
  pixelSize?: number
  duration?: number
  direction?: 'in' | 'out'
  pattern?: 'radial' | 'diagonal' | 'random' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  color: '#FFB147',
  pixelSize: 40,
  duration: 1.4,
  direction: 'out',
  pattern: 'vertical'
})

const emit = defineEmits<{
  complete: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const pixels = ref<{ id: number; delay: number; x: number; y: number; rotate: number }[]>([])
const isAnimating = ref(false)
const hasStarted = ref(false)

const generatePixels = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const cols = Math.ceil(width / props.pixelSize)
  const rows = Math.ceil(height / props.pixelSize)

  const newPixels: typeof pixels.value = []
  const maxDiagonal = cols + rows

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let delay: number

      if (props.pattern === 'vertical') {
        // Vertical wave from top to bottom
        const normalizedRow = row / rows
        const randomOffset = Math.random() * 0.06
        delay = props.direction === 'out'
          ? normalizedRow * props.duration * 0.5 + randomOffset
          : (1 - normalizedRow) * props.duration * 0.5 + randomOffset
      } else if (props.pattern === 'diagonal') {
        // Diagonal wave from top-left to bottom-right
        const diagonalIndex = col + row
        const normalizedDiagonal = diagonalIndex / maxDiagonal
        const randomOffset = Math.random() * 0.08
        delay = props.direction === 'out'
          ? normalizedDiagonal * props.duration * 0.5 + randomOffset
          : (1 - normalizedDiagonal) * props.duration * 0.5 + randomOffset
      } else if (props.pattern === 'radial') {
        // Radial from center
        const centerX = cols / 2
        const centerY = rows / 2
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
        const distanceFromCenter = Math.sqrt(
          (col - centerX) ** 2 + (row - centerY) ** 2
        )
        const normalizedDistance = distanceFromCenter / maxDistance
        const randomOffset = Math.random() * 0.1
        delay = props.direction === 'out'
          ? normalizedDistance * props.duration * 0.5 + randomOffset
          : (1 - normalizedDistance) * props.duration * 0.5 + randomOffset
      } else {
        // Random pattern
        delay = Math.random() * props.duration * 0.6
      }

      // Random rotation for more dynamic feel
      const rotate = (Math.random() - 0.5) * 30

      newPixels.push({
        id: row * cols + col,
        delay,
        x: col * props.pixelSize,
        y: row * props.pixelSize,
        rotate
      })
    }
  }

  pixels.value = newPixels
}

watch(() => props.isActive, (active) => {
  if (active && !hasStarted.value) {
    hasStarted.value = true
    isAnimating.value = true
    generatePixels()

    // Emit complete after animation finishes
    const totalDuration = props.duration * 1000 + 300
    setTimeout(() => {
      emit('complete')
      setTimeout(() => {
        isAnimating.value = false
        hasStarted.value = false
      }, 100)
    }, totalDuration)
  }
}, { immediate: true })

// Regenerate on resize
onMounted(() => {
  window.addEventListener('resize', generatePixels)
})

onUnmounted(() => {
  window.removeEventListener('resize', generatePixels)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isAnimating"
      ref="containerRef"
      class="pixel-transition-container"
    >
      <div
        v-for="pixel in pixels"
        :key="pixel.id"
        class="pixel"
        :class="{ 'pixel-out': direction === 'out', 'pixel-in': direction === 'in' }"
        :style="{
          left: `${pixel.x}px`,
          top: `${pixel.y}px`,
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          backgroundColor: color,
          animationDelay: `${pixel.delay}s`,
          animationDuration: `${duration * 0.4}s`,
          '--rotate': `${pixel.rotate}deg`
        }"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.pixel-transition-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.pixel {
  position: absolute;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.pixel-out {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: pixel-dissolve-out cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

.pixel-in {
  opacity: 0;
  transform: scale(0) rotate(var(--rotate));
  animation: pixel-dissolve-in cubic-bezier(0.3, 0, 0.7, 1) forwards;
}

@keyframes pixel-dissolve-out {
  0% {
    transform: scale(1) rotate(0deg) translateY(0);
    opacity: 1;
  }
  30% {
    transform: scale(1.05) rotate(calc(var(--rotate) * 0.3)) translateY(-2px);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(var(--rotate)) translateY(20px);
    opacity: 0;
  }
}

@keyframes pixel-dissolve-in {
  0% {
    transform: scale(0) rotate(var(--rotate)) translateY(20px);
    opacity: 0;
  }
  70% {
    transform: scale(1.05) rotate(calc(var(--rotate) * 0.3)) translateY(-2px);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg) translateY(0);
    opacity: 1;
  }
}
</style>
