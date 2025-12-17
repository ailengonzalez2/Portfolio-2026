<script setup lang="ts">
const services = [
  {
    title: 'UI Designer',
    description: 'Creating beautiful, cohesive visual systems that elevate brands and delight users with every interaction.',
    colorFilter: 'hue-rotate-[280deg] saturate-[1.4] brightness-[1.1]', // Violet/Purple tones
    bgColor: 'bg-[#fcfcfc] dark:bg-neutral-900'
  },
  {
    title: 'UI Developer',
    description: 'Translating designs into performant, accessible code using modern frameworks and best practices.',
    colorFilter: 'hue-rotate-[190deg] saturate-[1.3] brightness-[1.05]', // Cyan/Blue tones
    bgColor: 'bg-[#fcfcfc] dark:bg-neutral-900'
  },
  {
    title: 'UX Designer',
    description: 'Crafting intuitive experiences through research, testing, and a deep understanding of user needs.',
    colorFilter: 'hue-rotate-[10deg] saturate-[1.5] brightness-[1.1]', // Orange/Rose tones
    bgColor: 'bg-[#fcfcfc] dark:bg-neutral-900'
  }
]
</script>

<template>
  <section class="py-16 sm:py-24 relative overflow-hidden">
    <!-- Wavy gradient background -->
    <div class="absolute inset-0 pointer-events-none">
      <svg
        class="absolute w-full h-full opacity-50 dark:opacity-30"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="services-wave-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="rgb(221 214 254 / 0.6)" />
            <stop offset="25%" stop-color="rgb(233 213 255 / 0.5)" />
            <stop offset="50%" stop-color="rgb(251 207 232 / 0.5)" />
            <stop offset="75%" stop-color="rgb(254 215 170 / 0.4)" />
            <stop offset="100%" stop-color="rgb(254 226 226 / 0.3)" />
          </linearGradient>
        </defs>
        <!-- Top wave -->
        <path
          d="M0,100 C240,50 480,150 720,100 C960,50 1200,120 1440,80 L1440,0 L0,0 Z"
          fill="url(#services-wave-gradient)"
          opacity="0.5"
        />
        <!-- Main fill -->
        <path
          d="M0,100 C240,50 480,150 720,100 C960,50 1200,120 1440,80 L1440,720 C1200,680 960,750 720,700 C480,650 240,750 0,700 Z"
          fill="url(#services-wave-gradient)"
        />
        <!-- Bottom wave -->
        <path
          d="M0,700 C240,750 480,650 720,700 C960,750 1200,680 1440,720 L1440,800 L0,800 Z"
          fill="url(#services-wave-gradient)"
          opacity="0.5"
        />
      </svg>
    </div>

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

      <!-- Service cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Motion
          v-for="(service, index) in services"
          :key="service.title"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.1 }"
          :in-view-options="{ once: true }"
        >
          <div 
            class="group relative overflow-hidden rounded-[10px] border border-[#f1f5f9] dark:border-gray-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 aspect-square"
            :class="service.bgColor"
          >
            <!-- Mesh gradient background with mask -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                class="absolute -left-[50%] -top-[10%] w-[200%] h-[120%] transition-transform duration-700 group-hover:scale-105"
                :class="service.colorFilter"
              >
                <div 
                  class="w-full h-full"
                  style="
                    background-image: url('/services/mesh-gradient.png');
                    background-size: cover;
                    background-position: center;
                    -webkit-mask-image: url('/services/mesh-mask.png');
                    mask-image: url('/services/mesh-mask.png');
                    -webkit-mask-size: 50%;
                    mask-size: 50%;
                    -webkit-mask-position: 25% 20%;
                    mask-position: 25% 20%;
                    -webkit-mask-repeat: no-repeat;
                    mask-repeat: no-repeat;
                    opacity: 0.85;
                  "
                />
              </div>
            </div>

            <!-- Content positioned at bottom -->
            <div class="absolute bottom-6 right-4 left-4 flex flex-col gap-3 z-10">
              <h3 class="font-bold text-[18px] text-primary-custom dark:text-white uppercase tracking-tight">
                {{ service.title }}
              </h3>
              <p class="text-[16px] text-[rgba(138,138,138,0.99)] dark:text-gray-400 leading-relaxed text-center">
                {{ service.description }}
              </p>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
