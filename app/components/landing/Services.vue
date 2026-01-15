<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  id: string
  title: string
  description: string
  backgroundImage: string
}

const services: Service[] = [
  {
    id: 'ux-ui',
    title: 'Product Design',
    description: 'User-centered design that creates intuitive and beautiful interfaces, optimized for conversion and exceptional user experience.',
    backgroundImage: '/projects/pureskin.png'
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Frontend development with modern technologies, focused on performance, accessibility, and world-class user experience.',
    backgroundImage: '/projects/defidashboard.png'
  },
  {
    id: 'ai',
    title: 'AI Integration',
    description: 'Artificial intelligence integration to automate processes, improve decisions, and create smarter and more efficient products.',
    backgroundImage: '/projects/coaching.png'
  }
]

const activeCard = ref<string>('ux-ui')

const setActiveCard = (id: string) => {
  activeCard.value = id
}

const activeBackground = computed(() => {
  const service = services.find(s => s.id === activeCard.value)
  return service?.backgroundImage || services[0].backgroundImage
})
</script>

<template>
  <section
    id="services"
    class="py-16 sm:py-24 relative overflow-hidden min-h-[800px]"
  >
    <!-- Background Images with crossfade -->
    <div class="absolute inset-0">
      <div
        v-for="service in services"
        :key="service.id"
        class="absolute inset-0 bg-image-layer"
        :class="[
          activeCard === service.id ? 'opacity-100' : 'opacity-0'
        ]"
      >
        <img
          :src="service.backgroundImage"
          :alt="`${service.title} background`"
          class="w-full h-full object-cover"
        >
      </div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Service cards grid -->
      <div class="flex flex-col md:flex-row gap-4 items-stretch">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-wrapper"
          :class="[
            activeCard === service.id ? 'md:flex-2' : 'md:flex-1'
          ]"
        >
          <div class="h-full">
            <!-- Glass Card -->
            <div
              class="service-card relative rounded-xl cursor-pointer h-full overflow-hidden"
              :class="[
                activeCard === service.id
                  ? 'active-card'
                  : 'glass-card'
              ]"
              @mouseenter="setActiveCard(service.id)"
            >
              <!-- Card Inner Container -->
              <div class="relative h-full min-h-[380px]">
                <!-- Collapsed Content (Title only) -->
                <div
                  class="collapsed-content absolute inset-0 flex items-center justify-center p-6"
                  :class="[
                    activeCard === service.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  ]"
                >
                  <h3 class="font-sans text-[24px] text-[#6b6b6b] dark:text-gray-300 tracking-tight text-center leading-tight">
                    {{ service.title }}
                  </h3>
                </div>

                <!-- Expanded Content (Full details) -->
                <div
                  class="expanded-content absolute inset-0 flex flex-col p-8"
                  :class="[
                    activeCard === service.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  ]"
                >
                  <h3 class="font-sans text-[36px] text-[#2d2d2d] dark:text-white tracking-tight leading-tight mb-6">
                    {{ service.title }}
                  </h3>
                  <p class="text-[15px] text-[#5a5a5a] dark:text-gray-400 leading-[1.7] grow max-w-[340px]">
                    {{ service.description }}
                  </p>

                  <!-- Separator and Social Links -->
                  <div class="mt-auto pt-8">
                    <div class="h-px w-full bg-[#d4d4d4] dark:bg-gray-600 mb-5" />
                    <div class="flex items-center justify-start gap-3">
                      <!-- LinkedIn -->
                      <a
                        href="https://www.linkedin.com/in/AilenGonzalez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <img
                          src="/tech-icons/card_linkedin.png"
                          alt="LinkedIn"
                          class="w-7 h-7 object-contain transition-transform duration-300 hover:scale-110"
                        >
                      </a>
                      <!-- Upwork -->
                      <a
                        href="https://www.upwork.com/freelancers/~AilenGonzalez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Upwork"
                      >
                        <img
                          src="/tech-icons/card-upwork.png"
                          alt="Upwork"
                          class="w-7 h-7 object-contain transition-transform duration-300 hover:scale-110"
                        >
                      </a>
                      <!-- Telegram -->
                      <a
                        href="https://t.me/AilenGonzalez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                      >
                        <img
                          src="/tech-icons/card-telegram.png"
                          alt="Telegram"
                          class="w-7 h-7 object-contain transition-transform duration-300 hover:scale-110"
                        >
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Background image crossfade */
.bg-image-layer {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Wrapper for flex animation */
.service-wrapper {
  transition: flex 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base card styles */
.service-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active card - solid background */
.active-card {
  background: #faf8f5;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.dark .active-card {
  background: rgb(23, 23, 23);
}

/* Glass card - frosted effect */
.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.4);
}

.dark .glass-card {
  background: rgba(38, 38, 38, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dark .glass-card:hover {
  background: rgba(38, 38, 38, 0.6);
}

/* Content transitions */
.collapsed-content,
.expanded-content {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

/* Delayed opacity for smoother effect */
.collapsed-content.opacity-0 {
  transition-delay: 0s;
}

.expanded-content.opacity-100 {
  transition-delay: 0.15s;
}

.expanded-content.opacity-0 {
  transition-delay: 0s;
}

.collapsed-content.opacity-100 {
  transition-delay: 0.15s;
}

/* Social links */
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  color: #2d2d2d;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #a11ee2;
  color: white;
  transform: translateY(-2px);
}

.dark .social-link {
  background: rgba(255, 255, 255, 0.1);
  color: #e5e5e5;
}

.dark .social-link:hover {
  background: #a11ee2;
  color: white;
}
</style>
