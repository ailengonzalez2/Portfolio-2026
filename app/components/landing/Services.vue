<script setup lang="ts">
import { ref } from 'vue'

interface Service {
  id: string
  title: string
  description: string
  textPosition: 'top-right' | 'bottom-left' | 'bottom-right'
  waveImage: string
  waveStyles: Record<string, string>
  detailedDescription: string
}

const services: Service[] = [
  {
    id: 'ux-ui',
    title: 'UX/UI DESIGN',
    description: 'Sitios web optimizados que convierten visitantes en clientes',
    textPosition: 'bottom-left',
    waveImage: '/services/service-1-waves.svg',
    waveStyles: {
      width: '150%',
      height: '150%',
      top: '-35%',
      left: '-55%',
      transform: 'rotate(0deg)'
    },
    detailedDescription: 'User-centered design that creates intuitive and beautiful interfaces, optimized for conversion and exceptional user experience.'
  },
  {
    id: 'frontend',
    title: 'FRONTEND DEVELOPMENT',
    description: 'To enhance workflows and create smarter digital products',
    textPosition: 'top-right',
    waveImage: '/services/service-2-waves.svg',
    waveStyles: {
      width: '160%',
      height: '160%',
      bottom: '-45%',
      left: '-65%',
      transform: 'scaleY(-1)'
    },
    detailedDescription: 'Frontend development with modern technologies, focused on performance, accessibility, and world-class user experience.'
  },
  {
    id: 'ai',
    title: 'AI INTEGRATION',
    description: 'To enhance workflows and create smarter digital products',
    textPosition: 'bottom-right',
    waveImage: '/services/service-3-waves.svg',
    waveStyles: {
      width: '150%',
      height: '150%',
      top: '-30%',
      right: '-55%',
      transform: 'scaleX(-1)'
    },
    detailedDescription: 'Artificial intelligence integration to automate processes, improve decisions, and create smarter and more efficient products.'
  }
]

const flippedCards = ref<Set<string>>(new Set())

const toggleFlip = (cardId: string) => {
  if (flippedCards.value.has(cardId)) {
    flippedCards.value.delete(cardId)
  } else {
    flippedCards.value.add(cardId)
  }
  flippedCards.value = new Set(flippedCards.value)
}

const isCardFlipped = (cardId: string) => {
  return flippedCards.value.has(cardId)
}

const handleCardMouseEnter = (cardId: string) => {
  if (!isCardFlipped(cardId)) {
    toggleFlip(cardId)
  }
}

const handleCardMouseLeave = (cardId: string) => {
  if (isCardFlipped(cardId)) {
    toggleFlip(cardId)
  }
}

// Text position classes based on Figma design
const getTextPositionClasses = (position: Service['textPosition']) => {
  const positions = {
    'top-right': 'top-[52px] right-[15px] left-[44px] items-end text-right',
    'bottom-left': 'bottom-[37px] right-[36px] left-[23px] items-start text-left',
    'bottom-right': 'bottom-[37px] right-[9px] left-[36px] items-end text-right'
  }
  return positions[position]
}
</script>

<template>
  <section
    id="services"
    class="py-16 sm:py-24 relative overflow-hidden"
  >
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <div class="mb-[66px]">
          <h2 class="text-[#a2a2a2] text-[20px] font-medium uppercase tracking-normal mb-[10px]">
            Services
          </h2>
          <div class="h-[2px] w-[50px] bg-[#a2a2a2]" />
        </div>
      </Motion>

      <!-- Service cards grid - gap matches Figma (96px) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[96px]">
        <Motion
          v-for="(service, index) in services"
          :key="service.id"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.15 }"
          :in-view-options="{ once: true }"
        >
          <!-- 3D Flip Container -->
          <div
            class="service-card-flipper group relative cursor-pointer transition-all duration-500"
            style="aspect-ratio: 340/341; perspective: 1000px;"
            @click="toggleFlip(service.id)"
            @mouseenter="handleCardMouseEnter(service.id)"
            @mouseleave="handleCardMouseLeave(service.id)"
          >
            <!-- Card Inner - Will rotate -->
            <div
              class="service-card-inner relative w-full h-full transition-transform duration-500 ease-out"
              :style="{
                transformStyle: 'preserve-3d',
                transform: isCardFlipped(service.id) ? 'rotateX(180deg) scale(1.05)' : 'rotateX(0deg) scale(1)'
              }"
            >
              <!-- Front Face -->
              <div
                class="service-card-front absolute inset-0 rounded-[10px] border border-[#f1f5f9] dark:border-gray-700/50 bg-[#fcfcfc] dark:bg-neutral-900 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden"
                :style="{ backfaceVisibility: 'hidden' }"
              >
                <!-- Wave Background Image -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    class="service-wave absolute transition-transform duration-700 ease-out"
                    :style="service.waveStyles"
                  >
                    <img
                      :src="service.waveImage"
                      :alt="`${service.title} decoration`"
                      class="w-full h-full object-contain dark:opacity-70"
                      loading="lazy"
                    >
                  </div>
                </div>

                <!-- Front Content -->
                <div
                  class="absolute flex flex-col gap-[11px] z-10"
                  :class="getTextPositionClasses(service.textPosition)"
                >
                  <h3 class="font-bold text-[18px] text-[#45556c] dark:text-white uppercase tracking-tight font-sans">
                    {{ service.title }}
                  </h3>
                  <p class="text-[16px] text-[rgba(138,138,138,0.99)] dark:text-gray-400 leading-relaxed">
                    {{ service.description }}
                  </p>
                </div>
              </div>

              <!-- Back Face -->
              <div
                class="service-card-back absolute inset-0 rounded-[10px] border border-[#f1f5f9] dark:border-gray-700/50 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden p-6"
                :style="{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  backgroundImage: 'linear-gradient(-89.845deg, rgba(255, 177, 71, 0.2) 5.7398%, rgba(255, 108, 99, 0.2) 50.642%, rgba(184, 106, 223, 0.2) 92.046%)',
                  backgroundColor: '#fcfcfc'
                }"
              >
                <!-- Back Content - Top section -->
                <div class="flex flex-col gap-4 h-full">
                  <div>
                    <h3 class="font-bold text-[18px] text-[#45556c] uppercase tracking-tight font-sans">
                      {{ service.title }}
                    </h3>
                    <p class="text-[14px] text-[rgba(138,138,138,0.99)] leading-relaxed mt-3">
                      {{ service.detailedDescription }}
                    </p>
                  </div>

                  <!-- Social Links - Bottom Right -->
                  <div class="flex items-end justify-end gap-4 mt-auto">
                    <!-- Upwork Link -->
                    <a
                      href="https://www.upwork.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center justify-center transition-all duration-300 hover:scale-125"
                      aria-label="Contact on Upwork"
                    >
                      <UIcon
                        name="i-simple-icons-upwork"
                        class="w-8 h-8 text-[#45556c] hover:text-[#14a800] transition-colors duration-300"
                      />
                    </a>

                    <!-- LinkedIn Link -->
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center justify-center transition-all duration-300 hover:scale-125"
                      aria-label="Contact on LinkedIn"
                    >
                      <UIcon
                        name="i-mdi-linkedin"
                        class="w-8 h-8 text-[#45556c] hover:text-[#0077b5] transition-colors duration-300"
                      />
                    </a>

                    <!-- Telegram Link -->
                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center justify-center transition-all duration-300 hover:scale-125"
                      aria-label="Contact on Telegram"
                    >
                      <UIcon
                        name="i-mdi-telegram"
                        class="w-8 h-8 text-[#45556c] hover:text-[#0088cc] transition-colors duration-300"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Base wave animation setup */
.service-wave {
  will-change: transform;
}

/* 3D Flip Container */
.service-card-flipper {
  perspective: 1000px;
}

/* Inner card with 3D transforms */
.service-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 500ms ease-out;
  transform-style: preserve-3d;
}

/* Front and back faces */
.service-card-front,
.service-card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Back face is rotated 180 degrees initially */
.service-card-back {
  transform: rotateX(180deg);
}

/* Animation keyframes */
@keyframes wave-float {
  0%, 100% {
    transform: var(--wave-base-transform) translateY(0);
  }
  50% {
    transform: var(--wave-base-transform) translateY(-8px);
  }
}

/* Store base transform for animation */
:nth-child(1) .service-wave {
  --wave-base-transform: rotate(0deg);
}

:nth-child(2) .service-wave {
  --wave-base-transform: scaleY(-1);
}

:nth-child(3) .service-wave {
  --wave-base-transform: scaleX(-1);
}

/* Continuous animation class */
.animate-waves .service-wave {
  animation: wave-float 6s ease-in-out infinite;
}

/* Dark mode adjustments */
.dark .service-card-front {
  background: linear-gradient(135deg, rgba(23, 23, 23, 1) 0%, rgba(38, 38, 38, 0.8) 100%);
}
</style>
