<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const { t } = useI18n()

const blockquoteRef = ref<HTMLElement | null>(null)
const charRefs = ref<HTMLElement[]>([])
const charColors = ref<string[]>([])
const quoteComplete = ref(false)

const text = computed(() => t('web3Quote.quote'))

// Phrases to highlight with gradient (locale-aware)
const highlightPhrases = computed(() => [t('web3Quote.highlight')])

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
  highlightPhrases.value.forEach(phrase => {
    const startIndex = text.value.indexOf(phrase)
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

const highlightedInfo = computed(() => getHighlightedInfo())

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
  charColors.value = Array(text.value.length).fill('rgb(90, 100, 116)')
}

const handleScroll = () => {
  if (!blockquoteRef.value || charRefs.value.length === 0) return

  const blockquoteRect = blockquoteRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const blockquoteTop = blockquoteRect.top

  // Start animation after text enters viewport
  const scrollProgress = Math.max(0, Math.min(1, 1 - (blockquoteTop / (windowHeight * 1.1))))

  // Update each character's color based on its index in the text (linear flow)
  const newColors = text.value.split('').map((char, index) => {
    // Calculate position threshold based on character index (0 to 1)
    const charPosition = index / text.value.length

    // Character becomes dark when scroll progress reaches its position
    const threshold = charPosition

    // Snap to full color when threshold is reached
    const charProgress = scrollProgress > threshold ? 1 : 0

    // Check if this character should be highlighted with gradient
    const highlightInfo = highlightedInfo.value.get(index)

    if (highlightInfo) {
      // Get the target gradient color based on position in phrase
      const targetColor = getGradientColor(highlightInfo.position)
      // Interpolate from dim slate (90, 100, 116) to gradient color
      const r = Math.round(90 + (charProgress * (targetColor.r - 90)))
      const g = Math.round(100 + (charProgress * (targetColor.g - 100)))
      const b = Math.round(116 + (charProgress * (targetColor.b - 116)))
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // Interpolate from dim slate (90, 100, 116) to near-white (241, 245, 249)
      const r = Math.round(90 + (charProgress * 151))
      const g = Math.round(100 + (charProgress * 145))
      const b = Math.round(116 + (charProgress * 133))
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

// Re-initialize when locale changes (text length / highlight indices may change)
watch(text, async () => {
  initializeColors()
  await nextTick()
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="py-20 sm:py-28 relative overflow-hidden bg-[#0a0a0a]">
    <!-- Subtle brand glow -->
    <div class="absolute inset-0 bg-linear-to-br from-[#b86adf]/10 via-transparent to-[#ffb147]/10" />

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              :key="`${index}-${char}`"
              :ref="(el) => registerCharRef(el as HTMLElement | null, index)"
              :style="{ color: charColors[index] || 'rgb(90, 100, 116)', fontWeight: highlightedInfo.has(index) ? 500 : 400, fontStyle: highlightedInfo.has(index) ? 'italic' : 'normal' }"
              class="transition-colors duration-50"
            >
              {{ char }}
            </span>
          </blockquote>
        </Motion>
      </div>
    </div>
  </section>
</template>
