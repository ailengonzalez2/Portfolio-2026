<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const blockquoteRef = ref<HTMLElement | null>(null)
const charRefs = ref<HTMLElement[]>([])
const charColors = ref<string[]>([])
const quoteComplete = ref(false)

const text = "Recently, I've been diving deeper into the blockchain ecosystem, building wallet integrations and decentralized UI flows."

// Phrases to highlight with gradient
const highlightPhrases = ['wallet integrations and decentralized UI flows']

// Gradient colors: orange → pink → purple
const gradientColors = [
  { r: 255, g: 177, b: 71 },  // #ffb147 - orange
  { r: 255, g: 108, b: 99 },  // #ff6c63 - pink/red
  { r: 184, g: 106, b: 223 }  // #b86adf - purple
]

// Calculate highlighted ranges with position info for gradient
interface HighlightInfo {
  position: number // 0 to 1 within the phrase
}

const getHighlightedInfo = (): Map<number, HighlightInfo> => {
  const info = new Map<number, HighlightInfo>()
  highlightPhrases.forEach(phrase => {
    const startIndex = text.indexOf(phrase)
    if (startIndex !== -1) {
      for (let i = 0; i < phrase.length; i++) {
        const charIndex = startIndex + i
        const position = i / (phrase.length - 1) // 0 to 1
        info.set(charIndex, { position })
      }
    }
  })
  return info
}

const highlightedInfo = getHighlightedInfo()

// Interpolate between gradient colors based on position (0 to 1)
const getGradientColor = (position: number): { r: number, g: number, b: number } => {
  if (position <= 0.5) {
    // Interpolate between orange and pink
    const t = position * 2
    return {
      r: Math.round(gradientColors[0].r + t * (gradientColors[1].r - gradientColors[0].r)),
      g: Math.round(gradientColors[0].g + t * (gradientColors[1].g - gradientColors[0].g)),
      b: Math.round(gradientColors[0].b + t * (gradientColors[1].b - gradientColors[0].b))
    }
  } else {
    // Interpolate between pink and purple
    const t = (position - 0.5) * 2
    return {
      r: Math.round(gradientColors[1].r + t * (gradientColors[2].r - gradientColors[1].r)),
      g: Math.round(gradientColors[1].g + t * (gradientColors[2].g - gradientColors[1].g)),
      b: Math.round(gradientColors[1].b + t * (gradientColors[2].b - gradientColors[1].b))
    }
  }
}

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
  const scrollProgress = Math.max(0, Math.min(1, 1 - (blockquoteTop / (windowHeight * 1.1))))

  // Update each character's color based on its index in the text (linear flow)
  const newColors = text.split('').map((char, index) => {
    // Calculate position threshold based on character index (0 to 1)
    const charPosition = index / text.length

    // Character becomes dark when scroll progress reaches its position
    const threshold = charPosition

    // Snap to full color when threshold is reached
    const charProgress = scrollProgress > threshold ? 1 : 0

    // Check if this character should be highlighted with gradient
    const highlightInfo = highlightedInfo.get(index)

    if (highlightInfo) {
      // Get the target gradient color based on position in phrase
      const targetColor = getGradientColor(highlightInfo.position)
      // Interpolate from light gray (200, 210, 220) to gradient color
      const r = Math.round(200 - (charProgress * (200 - targetColor.r)))
      const g = Math.round(210 - (charProgress * (210 - targetColor.g)))
      const b = Math.round(220 - (charProgress * (220 - targetColor.b)))
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // Interpolate color from light gray (200, 210, 220) to very dark (15, 23, 42)
      const r = Math.round(200 - (charProgress * 185))
      const g = Math.round(210 - (charProgress * 187))
      const b = Math.round(220 - (charProgress * 178))
      return `rgb(${r}, ${g}, ${b})`
    }
  })

  charColors.value = newColors

  // Mark quote as complete when mostly colored (triggers earlier)
  if (scrollProgress >= 0.7 && !quoteComplete.value) {
    quoteComplete.value = true
  }
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
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="py-20 sm:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
    <!-- Subtle gradient background -->
    <div class="absolute inset-0 bg-linear-to-br from-purple-50/50 via-transparent to-orange-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-orange-950/10" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-right">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7 }"
          :in-view-options="{ once: true }"
        >
          <!-- Main quote with letter animation -->
          <blockquote
            ref="blockquoteRef"
            class="text-3xl sm:text-4xl lg:text-5xl font-normal leading-snug text-balance"
          >
            <span
              v-for="(char, index) in text.split('')"
              :key="index"
              :ref="(el) => registerCharRef(el as HTMLElement | null, index)"
              :style="{ color: charColors[index] || 'rgb(200, 210, 220)', fontWeight: highlightedInfo.has(index) ? 500 : 400, fontStyle: highlightedInfo.has(index) ? 'italic' : 'normal' }"
              class="transition-colors duration-50"
            >
              {{ char }}
            </span>
          </blockquote>
        </Motion>

        <!-- Additional context - appears after quote is fully colored -->
        <Motion
          :initial="{ opacity: 0, y: 50 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1.2, delay: 0.3 }"
          :in-view-options="{ once: true, margin: '-100px' }"
          class="mt-10"
        >
          <div class="flex items-start justify-end gap-4">
            <p class="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
              I focus on crafting clear, intuitive Web3 experiences with tools like Wagmi, Viem, and Web3Modal. From DeFi dashboards to NFT marketplaces and wallet applications, I'm always excited to collaborate on innovative ideas and projects.
            </p>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
