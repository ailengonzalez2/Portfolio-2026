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
const pixels = ref<{
  id: number
  delay: number
  x: number
  y: number
  rotate: number
  moveX: number
  moveY: number
  scale: number
}[]>([])
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
        // Vertical wave from top to bottom with more randomness
        const normalizedRow = row / rows
        const randomOffset = Math.random() * 0.3
        delay = props.direction === 'out'
          ? normalizedRow * props.duration * 0.4 + randomOffset
          : (1 - normalizedRow) * props.duration * 0.4 + randomOffset
      } else if (props.pattern === 'diagonal') {
        // Diagonal wave from top-left to bottom-right
        const diagonalIndex = col + row
        const normalizedDiagonal = diagonalIndex / maxDiagonal
        const randomOffset = Math.random() * 0.3
        delay = props.direction === 'out'
          ? normalizedDiagonal * props.duration * 0.4 + randomOffset
          : (1 - normalizedDiagonal) * props.duration * 0.4 + randomOffset
      } else if (props.pattern === 'radial') {
        // Radial from center
        const centerX = cols / 2
        const centerY = rows / 2
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
        const distanceFromCenter = Math.sqrt(
          (col - centerX) ** 2 + (row - centerY) ** 2
        )
        const normalizedDistance = distanceFromCenter / maxDistance
        const randomOffset = Math.random() * 0.3
        delay = props.direction === 'out'
          ? normalizedDistance * props.duration * 0.4 + randomOffset
          : (1 - normalizedDistance) * props.duration * 0.4 + randomOffset
      } else {
        // Random pattern
        delay = Math.random() * props.duration * 0.7
      }

      // Random rotation for more dynamic feel
      const rotate = (Math.random() - 0.5) * 180

      // Random movement direction for each pixel
      const angle = Math.random() * Math.PI * 2
      const distance = 50 + Math.random() * 150
      const moveX = Math.cos(angle) * distance
      const moveY = Math.sin(angle) * distance

      // Random final scale
      const scale = Math.random() * 0.5

      newPixels.push({
        id: row * cols + col,
        delay,
        x: col * props.pixelSize,
        y: row * props.pixelSize,
        rotate,
        moveX,
        moveY,
        scale
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
          animationDuration: `${duration * 0.5}s`,
          '--rotate': `${pixel.rotate}deg`,
          '--move-x': `${pixel.moveX}px`,
          '--move-y': `${pixel.moveY}px`,
          '--end-scale': pixel.scale
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
}

.pixel-out {
  animation: pixel-dissolve-out cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.pixel-in {
  opacity: 0;
  animation: pixel-dissolve-in cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pixel-dissolve-out {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  0.1% {
    opacity: 0;
  }
  100% {
    transform: translate(var(--move-x), var(--move-y));
    opacity: 0;
  }
}

@keyframes pixel-dissolve-in {
  0% {
    transform: translate(var(--move-x), var(--move-y));
    opacity: 0;
  }
  99.9% {
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}
</style>
