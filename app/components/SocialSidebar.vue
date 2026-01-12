<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'

interface SocialLink {
  name: string
  icon: string
  url: string
  label: string
  brandColor: string
  gradientTo: string
  colorIcon?: string // Path to color version of the icon (optional)
  hideInExpanded?: boolean // Hide this link in the expanded animation
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: 'i-mdi-linkedin',
    url: 'https://linkedin.com/in/yourprofile',
    label: 'Visitar perfil de LinkedIn',
    brandColor: '#0077b5',
    gradientTo: '#00a0dc'
  },
  {
    name: 'CV',
    icon: 'i-simple-icons-readdotcv',
    url: 'https://cv.ailengonzalez.ar/',
    label: 'Leer mi cv en Read.cv',
    brandColor: '#24292e',
    gradientTo: '#4c5157',
    hideInExpanded: true
  },
  {
    name: 'GitHub',
    icon: 'i-mdi-github',
    url: 'https://github.com/yourprofile',
    label: 'Ver repositorios en GitHub',
    brandColor: '#24292e',
    gradientTo: '#4c5157'
  },
  {
    name: 'Figma',
    icon: 'i-simple-icons-figma',
    url: 'https://figma.com/@yourprofile',
    label: 'Ver diseños en Figma',
    brandColor: '#f24e1e',
    gradientTo: '#ff8f6b',
    colorIcon: '/tech-icons/figma-color.svg'
  },
  {
    name: 'Behance',
    icon: 'i-simple-icons-behance',
    url: 'https://behance.net/yourprofile',
    label: 'Ver portfolio en Behance',
    brandColor: '#1769ff',
    gradientTo: '#6094ff'
  },
  {
    name: 'Discord',
    icon: 'i-ic-twotone-discord',
    url: 'https://discord.gg/yourcommunity',
    label: 'Unirse a comunidad de Discord',
    brandColor: '#5865f2',
    gradientTo: '#949cf7'
  }
]

// Scroll detection for expansion animation
const { y } = useWindowScroll()
const { height } = useWindowSize()

const isExpanded = computed(() => {
  if (!import.meta.client) return false
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
  // Expand when within 200px of the bottom
  return scrollPosition >= scrollHeight - 200
})
</script>

<template>
  <aside
    class="social-sidebar fixed top-8 left-8 z-50 hidden lg:flex flex-col items-center gap-2"
    aria-label="Enlaces a redes sociales"
  >
    <!-- Decorative vertical line -->
    <div
      class="decorative-line w-px h-48 bg-linear-to-b from-transparent via-[#ABB2BF]/60 to-[#ABB2BF] transition-all duration-500"
      :class="isExpanded ? 'opacity-0 h-0' : 'opacity-100'"
      aria-hidden="true"
    />

    <!-- Social icons container -->
    <nav
      class="flex flex-col items-start gap-3 py-2"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="(social, index) in socialLinks"
        v-show="!(isExpanded && social.hideInExpanded)"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        :style="{
          '--brand-color': social.brandColor,
          '--gradient-to': social.gradientTo,
          '--animation-delay': `${index * 60}ms`
        } as any"
        class="social-link group relative h-14 transition-all duration-500 ease-out"
        :class="isExpanded ? 'expanded-link' : 'collapsed-link'"
      >
        <!-- Background pill (positioned behind icon, only visible when expanded) -->
        <div
          class="pill-background absolute top-1 left-5 h-12 flex items-center justify-center rounded-r-full transition-all duration-500 ease-out shadow-md"
          :class="isExpanded ? 'w-52 opacity-100 pl-10 pr-6' : 'w-0 opacity-0 pl-0 pr-0'"
          :style="{
            background: `linear-gradient(to right, var(--brand-color), var(--gradient-to))`,
            transitionDelay: isExpanded ? '0ms' : '0ms'
          }"
        >
          <!-- Text label centered in pill -->
          <span
            class="social-label text-white text-sm font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-300 text-center w-full"
            :class="isExpanded ? 'opacity-100' : 'opacity-0'"
            :style="{ 
              transitionDelay: isExpanded ? `calc(var(--animation-delay) + 150ms)` : '0ms',
              textShadow: '0px 1px 4px rgba(0,0,0,0.15)'
            }"
          >
            {{ social.name }}
          </span>
        </div>

        <!-- Icon circle (overlaps the pill) -->
        <div
          class="icon-circle relative z-10 flex items-center justify-center size-14 rounded-full shrink-0 transition-all duration-500"
          :class="isExpanded 
            ? 'shadow-[4px_0px_15px_0px_rgba(0,0,0,0.3)]' 
            : 'bg-transparent'"
          :style="isExpanded ? { backgroundColor: social.brandColor } : {}"
        >
          <!-- Default icon -->
          <UIcon
            :name="social.icon"
            class="social-icon-svg transition-all duration-300"
            :class="[
              isExpanded ? 'size-7 text-white' : 'size-8 text-[#ABB2BF] group-hover:scale-110',
              { 'group-hover:opacity-0': social.colorIcon && !isExpanded }
            ]"
          />

          <!-- Color icon (shown on hover when collapsed) -->
          <img
            v-if="social.colorIcon && !isExpanded"
            :src="social.colorIcon"
            :alt="social.name"
            class="absolute size-8 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
          >
        </div>

        <!-- Tooltip (only when collapsed) -->
        <span
          v-if="!isExpanded"
          class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20"
        >
          {{ social.name }}
        </span>
      </ULink>
    </nav>
  </aside>

  <!-- Mobile: Compact horizontal version at bottom -->
  <div
    class="social-sidebar-mobile fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
    aria-label="Enlaces a redes sociales"
  >
    <nav
      class="flex items-center gap-1 px-4 py-2 bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-700/50"
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
        <!-- Default icon (hidden on hover/active if colorIcon exists) -->
        <UIcon
          :name="social.icon"
          class="social-icon-svg size-6 text-[#ABB2BF] transition-all duration-200 group-hover:scale-110"
          :class="{ 'group-hover:opacity-0 group-active:opacity-0': social.colorIcon }"
        />

        <!-- Color icon (shown on hover/active) -->
        <img
          v-if="social.colorIcon"
          :src="social.colorIcon"
          :alt="social.name"
          class="absolute size-6 scale-75 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-hover:scale-110 group-active:scale-110 transition-all duration-200 pointer-events-none"
        >
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

/* Base link styles */
.social-link {
  display: flex;
  align-items: center;
}

/* Collapsed state */
.collapsed-link {
  width: 3.5rem;
}

.collapsed-link:hover .social-icon-svg,
.collapsed-link:active .social-icon-svg {
  color: var(--brand-color) !important;
}

/* Expanded state */
.expanded-link {
  width: auto;
}

.expanded-link .pill-background {
  animation: slideIn 0.4s ease-out backwards;
  animation-delay: var(--animation-delay);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scaleX(0.3);
    transform-origin: left center;
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* Hover effect for expanded links */
.expanded-link:hover .pill-background {
  filter: brightness(1.1);
}

.expanded-link:hover .icon-circle {
  transform: scale(1.05);
}

.expanded-link:active .icon-circle {
  transform: scale(0.95);
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

