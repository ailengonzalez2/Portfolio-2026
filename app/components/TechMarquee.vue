<script setup lang="ts">
// Tech stack icons for the horizontal carousel
const techLogos = [
  { icon: '/tech-icons/figma-color.svg', label: 'Figma' },
  { icon: '/tech-icons/vue-color.svg', label: 'Vue' },
  { icon: '/tech-icons/nuxt.svg', label: 'Nuxt' },
  { icon: '/tech-icons/tailwind-color.svg', label: 'Tailwind' },
  { icon: '/tech-icons/javascript-color.svg', label: 'JavaScript' },
  { icon: '/tech-icons/claude-color.png', label: 'Claude' },
  { icon: '/tech-icons/copilot-color.png', label: 'GitHub Copilot' },
  { icon: '/tech-icons/n8n.svg', label: 'n8n' },
  { icon: '/tech-icons/ethereum-color.png', label: 'Ethereum' },
  { icon: '/tech-icons/github-color.svg', label: 'GitHub' }
]
</script>

<template>
  <div class="relative overflow-hidden mask-horizontal">
    <div class="flex items-center animate-marquee w-max hover:[animation-play-state:paused]">
      <!-- First set -->
      <div class="flex items-center gap-8 sm:gap-10 lg:gap-14 pr-8 sm:pr-10 lg:pr-14">
        <div
          v-for="tech in techLogos"
          :key="tech.label"
          class="flex items-center gap-2 shrink-0 grayscale opacity-40 transition duration-300 hover:grayscale-0 hover:opacity-100"
        >
          <img
            :src="tech.icon"
            :alt="tech.label"
            class="h-6 sm:h-8 w-auto object-contain"
          >
          <span class="text-base sm:text-lg font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
            {{ tech.label }}
          </span>
        </div>
      </div>
      <!-- Duplicated set for seamless loop -->
      <div
        class="flex items-center gap-8 sm:gap-10 lg:gap-14 pr-8 sm:pr-10 lg:pr-14"
        aria-hidden="true"
      >
        <div
          v-for="tech in techLogos"
          :key="`${tech.label}-dup`"
          class="flex items-center gap-2 shrink-0 grayscale opacity-40 transition duration-300 hover:grayscale-0 hover:opacity-100"
        >
          <img
            :src="tech.icon"
            :alt="tech.label"
            class="h-6 sm:h-8 w-auto object-contain"
          >
          <span class="text-base sm:text-lg font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
            {{ tech.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask-horizontal {
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}

.animate-marquee {
  animation: marquee 22s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
</style>
