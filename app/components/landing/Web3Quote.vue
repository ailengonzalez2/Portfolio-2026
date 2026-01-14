<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const blockquoteRef = ref<HTMLElement | null>(null)
const charRefs = ref<HTMLElement[]>([])
const charColors = ref<string[]>([])

const text = "Lately, I've been exploring the blockchain ecosystem—focusing on wallet integrations, decentralized UI flows, and tools like Wagmi, Viem, and Web3Modal."

// Initialize character colors
const initializeColors = () => {
  charColors.value = Array(text.length).fill('rgb(200, 210, 220)')
}

const handleScroll = () => {
  if (!blockquoteRef.value || charRefs.value.length === 0) return

  const blockquoteRect = blockquoteRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const blockquoteTop = blockquoteRect.top

  // Start animation after text enters viewport
  const scrollProgress = Math.max(0, Math.min(1, 1 - (blockquoteTop / (windowHeight * 0.8))))

  // Update each character's color based on its index in the text (linear flow)
  const newColors = text.split('').map((char, index) => {
    // Calculate position threshold based on character index (0 to 1)
    const charPosition = index / text.length

    // Character becomes dark when scroll progress reaches its position
    const threshold = charPosition

    // Snap to full color when threshold is reached
    const charProgress = scrollProgress > threshold ? 1 : 0

    // Interpolate color from light gray (200, 210, 220) to very dark (15, 23, 42)
    const r = Math.round(200 - (charProgress * 185))
    const g = Math.round(210 - (charProgress * 187))
    const b = Math.round(220 - (charProgress * 178))

    return `rgb(${r}, ${g}, ${b})`
  })

  charColors.value = newColors
}

const registerCharRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    charRefs.value[index] = el
  }
}

onMounted(async () => {
  initializeColors()
  await nextTick()
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Call once on mount
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="py-20 sm:py-32 relative overflow-hidden">
    <!-- Background Image - full width horizontal -->
    <div class="absolute left-0 bottom-0 w-full h-auto pointer-events-none">
      <img
        src="/background-lines-lila.png"
        alt=""
        class="w-full h-auto object-cover opacity-40"
      >
    </div>

    <!-- Background subtle gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/30 to-transparent pointer-events-none" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7 }"
        :in-view-options="{ once: true }"
      >
        <!-- Main quote -->
        <blockquote
          ref="blockquoteRef"
          class="text-3xl sm:text-4xl lg:text-5xl font-normal leading-snug text-balance"
        >
          <span
            v-for="(char, index) in text.split('')"
            :key="index"
            :ref="(el) => registerCharRef(el as HTMLElement | null, index)"
            :style="{ color: charColors[index] || 'rgb(200, 210, 220)' }"
            class="transition-colors duration-50"
          >
            {{ char }}
          </span>
        </blockquote>
      </Motion>

      <!-- Additional context -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :in-view-options="{ once: true }"
        class="mt-8"
      >
        <p class="text-muted text-base sm:text-lg max-w-xl ml-auto">
          I'm always looking to collaborate on forward-thinking solutions in the Web3 space. Whether it's a DeFi dashboard, NFT marketplace, or wallet experience—let's build something great together.
        </p>
      </Motion>
    </div>
  </section>
</template>
