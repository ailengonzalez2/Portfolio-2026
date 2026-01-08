<script setup lang="ts">
interface Service {
  id: string
  title: string
  description: string
  textPosition: 'top-right' | 'bottom-left' | 'bottom-right'
  waveImage: string
  waveStyles: Record<string, string>
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
    }
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
    }
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
    }
  }
]

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
  <section class="py-16 sm:py-24 relative overflow-hidden">
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
          <!-- Card container - 340x341 like Figma -->
          <div 
            class="service-card group relative overflow-hidden rounded-[10px] border border-[#f1f5f9] dark:border-gray-700/50 bg-[#fcfcfc] dark:bg-neutral-900 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-500"
            style="aspect-ratio: 340/341;"
          >
            <!-- Wave Background Image -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                class="service-wave absolute transition-transform duration-700 ease-out group-hover:scale-105"
                :style="service.waveStyles"
              >
                <img 
                  :src="service.waveImage" 
                  :alt="`${service.title} decoration`"
                  class="w-full h-full object-contain dark:opacity-70"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Content -->
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
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Base wave animation setup - ready for future animation */
.service-wave {
  will-change: transform;
}

/* Hover animation */
.service-card:hover .service-wave {
  animation: wave-float 4s ease-in-out infinite;
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
.service-card:nth-child(1) .service-wave {
  --wave-base-transform: rotate(0deg);
}

.service-card:nth-child(2) .service-wave {
  --wave-base-transform: scaleY(-1);
}

.service-card:nth-child(3) .service-wave {
  --wave-base-transform: scaleX(-1);
}

/* Continuous animation class - add to parent to activate permanent animation */
.animate-waves .service-wave {
  animation: wave-float 6s ease-in-out infinite;
}

/* Dark mode adjustments */
.dark .service-card {
  background: linear-gradient(135deg, rgba(23, 23, 23, 1) 0%, rgba(38, 38, 38, 0.8) 100%);
}
</style>
