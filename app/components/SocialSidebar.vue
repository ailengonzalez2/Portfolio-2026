<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'

interface SocialLink {
  name: string
  icon: string
  url: string
  label: string
  brandColor: string
  colorIcon?: string // Path to color version of the icon (optional)
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: 'i-mdi-linkedin',
    url: 'https://www.linkedin.com/in/ailengonzalez/',
    label: 'Visitar perfil de LinkedIn',
    brandColor: '#0077b5'
  },
  {
    name: 'CV',
    icon: 'i-simple-icons-readdotcv',
    url: 'https://cv.ailengonzalez.ar/',
    label: 'Leer mi cv en Read.cv',
    brandColor: '#24292e'
  },
  {
    name: 'GitHub',
    icon: 'i-mdi-github',
    url: 'https://github.com/ailengonzalez2',
    label: 'Ver repositorios en GitHub',
    brandColor: '#24292e'
  },
  {
    name: 'Upwork',
    icon: 'i-simple-icons-upwork',
    url: 'https://www.upwork.com/freelancers/ailengonzalez?mp_source=share',
    label: 'Contratar en Upwork',
    brandColor: '#14a800'
  }
]

// Scroll detection for the bottom-of-page colored state
const { y } = useWindowScroll()
const { height } = useWindowSize()

const isExpanded = computed(() => {
  if (!import.meta.client) return false
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
  // Color the icons when within 200px of the bottom
  return scrollPosition >= scrollHeight - 200
})

// Mobile: color later (closer to bottom)
const isMobileExpanded = computed(() => {
  if (!import.meta.client) return false
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
  // Color when within 100px of the bottom (later than desktop)
  return scrollPosition >= scrollHeight - 100
})

// Mobile: Calculate bottom offset to stop before footer
const mobileBottom = computed(() => {
  if (!import.meta.client) return 16
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
  const distanceFromBottom = scrollHeight - scrollPosition
  const footerCreditsHeight = 80

  if (distanceFromBottom < footerCreditsHeight + 60) {
    return footerCreditsHeight + 16
  }
  return 16
})
</script>

<template>
  <aside
    class="social-sidebar fixed top-8 left-8 z-50 hidden lg:flex flex-col items-center"
    aria-label="Enlaces a redes sociales"
  >
    <!-- Decorative vertical line -->
    <div
      class="decorative-line w-px h-40 bg-linear-to-b from-transparent via-[#6b7280]/60 to-[#6b7280] transition-all duration-500"
      :class="isExpanded ? 'opacity-0 h-0' : 'opacity-100'"
      aria-hidden="true"
    />

    <!-- Social icons container -->
    <nav
      class="flex flex-col items-start gap-3 py-2"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        :style="{ '--brand-color': social.brandColor } as any"
        class="social-link group relative flex items-center justify-center size-14 transition-all duration-300"
      >
        <UIcon
          :name="social.icon"
          class="social-icon-svg size-8 transition-all duration-300 group-hover:scale-110"
          :style="{ color: isExpanded ? social.brandColor : '#6b7280' }"
        />
        <!-- Name on hover -->
        <span
          class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20"
        >
          {{ social.name }}
        </span>
      </ULink>
    </nav>
  </aside>

  <!-- Mobile: Compact horizontal version at bottom -->
  <div
    class="social-sidebar-mobile fixed left-1/2 -translate-x-1/2 z-50 lg:hidden transition-[bottom] duration-300 ease-out"
    :style="{ bottom: `${mobileBottom}px` }"
    aria-label="Enlaces a redes sociales"
  >
    <nav
      class="flex items-center px-4 py-2 backdrop-blur-sm rounded-full border transition-all duration-500"
      :class="isMobileExpanded ? 'border-slate-300/50 scale-110 gap-2' : 'border-slate-700/50 gap-0'"
      :style="{ backgroundColor: isMobileExpanded ? 'rgba(226, 232, 240, 0.95)' : 'rgba(30, 41, 59, 0.9)' }"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        :style="{ '--brand-color': social.brandColor } as any"
        class="social-icon-mobile group relative flex items-center justify-center size-10 rounded-full transition-all duration-200 active:scale-95"
      >
        <UIcon
          :name="social.icon"
          class="social-icon-svg size-6 transition-all duration-500 group-hover:scale-110"
          :class="isMobileExpanded ? 'scale-125' : ''"
          :style="{ color: isMobileExpanded ? social.brandColor : '#6b7280' }"
        />
      </ULink>
    </nav>
  </div>
</template>

<style scoped>
.social-sidebar {
  /* Ensure visibility over other elements */
  pointer-events: auto;
}

/* Subtle animation on load */
.social-sidebar nav {
  animation: fadeSlideIn 0.6s ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile version animation */
.social-sidebar-mobile nav {
  animation: fadeSlideUp 0.4s ease-out;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Brand-color the icon on hover */
.social-link:hover .social-icon-svg,
.social-link:active .social-icon-svg {
  color: var(--brand-color) !important;
}

/* Focus visible for accessibility */
.social-link:focus-visible,
.social-icon-mobile:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Mobile hover effects */
.social-icon-mobile:hover .social-icon-svg,
.social-icon-mobile:active .social-icon-svg {
  color: var(--brand-color) !important;
}
</style>
