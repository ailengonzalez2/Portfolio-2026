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
    description: 'I design digital products with a focus on clarity, usability, and pixel-perfect interfaces. Every project begins by understanding user needs and carefully planning the product structure to ensure intuitive and meaningful experiences.',
    backgroundImage: '/projects/pureskin.png'
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'I build modern, high-quality frontends using the latest web technologies. My focus is clean structure, strong performance, and accessibility—turning design into fast, reliable products that feel seamless to use.',
    backgroundImage: '/projects/defidashboard.png'
  },
  {
    id: 'ai',
    title: 'AI Integration',
    description: 'I integrate AI tools to make products smarter and more efficient—from automating workflows to enhancing user experiences. I also create custom bots that streamline repetitive tasks and improve operational performance through practical, human-centered technology.',
    backgroundImage: '/projects/ai-integration.webp'
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

// Split text into words for word-by-word animation
const splitWords = (text: string) => text.split(' ')

// Calculate delay for each word based on index and starting offset
const getWordDelay = (wordIndex: number, baseDelay: number = 0) => {
  return `${baseDelay + (wordIndex * 0.05)}s`
}
</script>

<template>
  <section
    id="services"
    class="py-16 sm:py-24 relative overflow-hidden min-h-[900px] flex items-center justify-center"
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

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Service cards grid -->
      <div class="flex flex-col md:flex-row gap-4 items-stretch w-full">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-wrapper"
          :class="[
            activeCard === service.id ? 'md:flex-[1.3]' : 'md:flex-1'
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
              <div class="relative h-full min-h-[440px]">
                <!-- Collapsed Content (Title only) -->
                <div
                  class="collapsed-content absolute inset-0 flex items-center justify-center p-6"
                  :class="[
                    activeCard === service.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  ]"
                >
                  <h3
                    class="font-sans text-[24px] tracking-tight text-center leading-tight dark:text-white"
                    :class="activeCard === 'ux-ui' ? 'text-black' : 'text-white'"
                  >
                    {{ service.title }}
                  </h3>
                </div>

                <!-- Expanded Content (Full details) -->
                <div
                  class="expanded-content absolute inset-0 flex flex-col p-8"
                  :class="[
                    activeCard === service.id ? 'is-active' : 'is-inactive'
                  ]"
                >
                  <!-- Title with word-by-word animation -->
                  <h3 class="font-sans text-[36px] text-[#2d2d2d] dark:text-white tracking-tight leading-tight mb-6 overflow-hidden">
                    <span
                      v-for="(word, index) in splitWords(service.title)"
                      :key="index"
                      class="word-animate inline-block"
                      :style="{ transitionDelay: getWordDelay(index, 0.1) }"
                    >
                      {{ word }}&nbsp;
                    </span>
                  </h3>

                  <!-- Description with word-by-word animation -->
                  <p class="text-[15px] text-[#5a5a5a] dark:text-gray-400 leading-[1.7] grow max-w-[340px] overflow-hidden">
                    <span
                      v-for="(word, index) in splitWords(service.description)"
                      :key="index"
                      class="word-animate inline-block"
                      :style="{ transitionDelay: getWordDelay(index, 0.2) }"
                    >
                      {{ word }}&nbsp;
                    </span>
                  </p>

                  <!-- Separator and Social Links -->
                  <div class="mt-auto pt-8">
                    <div class="stagger-item stagger-separator h-px w-full bg-[#d4d4d4] dark:bg-gray-600 mb-5" />
                    <div class="flex items-center justify-start gap-4">
                      <!-- LinkedIn -->
                      <a
                        href="https://www.linkedin.com/in/AilenGonzalez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        class="stagger-item stagger-icon-1 social-icon-link social-icon-linkedin"
                      >
                        <img
                          src="/tech-icons/card_linkedin.png"
                          alt="LinkedIn"
                          class="w-7 h-7 object-contain"
                        >
                      </a>
                      <!-- Upwork -->
                      <a
                        href="https://www.upwork.com/freelancers/ailengonzalez?mp_source=share"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Upwork"
                        class="stagger-item stagger-icon-2 social-icon-link social-icon-upwork"
                      >
                        <img
                          src="/tech-icons/card-upwork.png"
                          alt="Upwork"
                          class="w-7 h-7 object-contain"
                        >
                      </a>
                      <!-- Telegram -->
                      <a
                        href="https://t.me/AilenGonzalez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                        class="stagger-item stagger-icon-3 social-icon-link social-icon-telegram"
                      >
                        <img
                          src="/tech-icons/card-telegram.png"
                          alt="Telegram"
                          class="w-7 h-7 object-contain"
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
.collapsed-content {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.expanded-content {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded-content.is-inactive {
  opacity: 0;
  pointer-events: none;
}

.expanded-content.is-active {
  opacity: 1;
}

/* Delayed opacity for smoother effect */
.collapsed-content.opacity-0 {
  transition-delay: 0s;
}

.collapsed-content.opacity-100 {
  transition-delay: 0.15s;
}

/* Word-by-word animation - coming up from below */
.word-animate {
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* When parent is active, animate words up */
.expanded-content.is-active .word-animate {
  opacity: 1;
  transform: translateY(0);
}

/* Reset word animations when inactive */
.expanded-content.is-inactive .word-animate {
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.15s ease-out,
              transform 0.15s ease-out;
  transition-delay: 0s !important;
}

/* Staggered animation for separator and icons */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* When parent is active, animate children with staggered delays */
.expanded-content.is-active .stagger-item {
  opacity: 1;
  transform: translateY(0);
}

.expanded-content.is-active .stagger-separator {
  transition-delay: 0.3s;
}

.expanded-content.is-active .stagger-icon-1 {
  transition-delay: 0.4s;
}

.expanded-content.is-active .stagger-icon-2 {
  transition-delay: 0.5s;
}

.expanded-content.is-active .stagger-icon-3 {
  transition-delay: 0.6s;
}

/* Reset animations when inactive */
.expanded-content.is-inactive .stagger-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.15s ease-out,
              transform 0.15s ease-out;
  transition-delay: 0s;
}

/* Social icon links */
.social-icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-icon-link img {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.8);
}

.social-icon-link:hover img {
  transform: translateY(-2px) scale(1.15);
}

/* LinkedIn hover - #0077B5 */
.social-icon-linkedin:hover img {
  filter: brightness(0.8) sepia(1) saturate(5) hue-rotate(180deg);
}

/* Upwork hover - #108A00 */
.social-icon-upwork:hover img {
  filter: brightness(0.7) sepia(1) saturate(5) hue-rotate(80deg);
}

/* Telegram hover - #0088CC */
.social-icon-telegram:hover img {
  filter: brightness(0.9) sepia(1) saturate(4) hue-rotate(170deg);
}

/* Dark mode */
.dark .social-icon-link img {
  filter: brightness(1);
}

.dark .social-icon-linkedin:hover img {
  filter: brightness(1) sepia(1) saturate(5) hue-rotate(180deg);
}

.dark .social-icon-upwork:hover img {
  filter: brightness(0.9) sepia(1) saturate(5) hue-rotate(80deg);
}

.dark .social-icon-telegram:hover img {
  filter: brightness(1.1) sepia(1) saturate(4) hue-rotate(170deg);
}
</style>
