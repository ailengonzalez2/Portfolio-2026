<script setup lang="ts">
const services = [
  {
    icon: 'i-lucide-palette',
    title: 'UI Designer',
    description: 'Creating beautiful, cohesive visual systems that elevate brands and delight users with every interaction.',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    icon: 'i-lucide-code-2',
    title: 'UI Developer',
    description: 'Translating designs into performant, accessible code using modern frameworks and best practices.',
    gradient: 'from-sky-500 to-cyan-600'
  },
  {
    icon: 'i-lucide-users',
    title: 'UX Designer',
    description: 'Crafting intuitive experiences through research, testing, and a deep understanding of user needs.',
    gradient: 'from-orange-500 to-rose-600'
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
      <!-- Section header -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
        class="text-center mb-12"
      >
        <h2 class="text-2xl sm:text-3xl font-medium mb-4">What I do</h2>
        <p class="text-muted max-w-xl mx-auto">
          Bridging the gap between design and development to create exceptional digital experiences.
        </p>
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
          <div class="group relative p-6 rounded-2xl bg-default/90 dark:bg-elevated/90 backdrop-blur-sm border border-default/50 transition-all duration-300 hover:border-default hover:shadow-xl hover:shadow-neutral-950/5 h-full">
            <!-- Icon -->
            <div
              class="inline-flex items-center justify-center size-12 rounded-xl mb-4 bg-linear-to-br text-white"
              :class="service.gradient"
            >
              <UIcon :name="service.icon" class="size-6" />
            </div>

            <!-- Content -->
            <h3 class="text-lg font-medium mb-2">{{ service.title }}</h3>
            <p class="text-muted text-sm leading-relaxed">{{ service.description }}</p>

            <!-- Decorative corner -->
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UIcon name="i-lucide-arrow-up-right" class="size-4 text-muted" />
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
