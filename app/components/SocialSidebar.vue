<script setup lang="ts">
interface SocialLink {
  name: string
  icon: string
  url: string
  label: string
  hoverColor: string
  colorIcon?: string // Path to color version of the icon (optional)
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: 'i-mdi-linkedin',
    url: 'https://linkedin.com/in/yourprofile',
    label: 'Visitar perfil de LinkedIn',
    hoverColor: '#0A66C2'
  },
  {
    name: 'CV',
    icon: 'i-simple-icons-readdotcv',
    url: 'https://cv.ailengonzalez.ar/',
    label: 'Leer mi cv en Read.cv',
    hoverColor: '#111111'
  },
  {
    name: 'GitHub',
    icon: 'i-mdi-github',
    url: 'https://github.com/yourprofile',
    label: 'Ver repositorios en GitHub',
    hoverColor: '#000000'
  },
  {
    name: 'Figma',
    icon: 'i-simple-icons-figma',
    url: 'https://figma.com/@yourprofile',
    label: 'Ver diseños en Figma',
    hoverColor: '#F24E1E',
    colorIcon: '/tech-icons/figma-color.svg'
  },
  {
    name: 'Behance',
    icon: 'i-simple-icons-behance',
    url: 'https://behance.net/yourprofile',
    label: 'Ver portfolio en Behance',
    hoverColor: '#1769FF'
  },
  {
    name: 'Discord',
    icon: 'i-ic-twotone-discord',
    url: 'https://discord.gg/yourcommunity',
    label: 'Unirse a comunidad de Discord',
    hoverColor: '#5865F2'
  }
]
</script>

<template>
  <aside
    class="social-sidebar fixed top-8 left-8 z-50 hidden lg:flex flex-col items-center gap-2"
    aria-label="Enlaces a redes sociales"
  >
    <!-- Decorative vertical line -->
    <div
      class="w-px h-48 bg-linear-to-b from-transparent via-[#ABB2BF]/60 to-[#ABB2BF]"
      aria-hidden="true"
    />

    <!-- Social icons container -->
    <nav
      class="flex flex-col items-center gap-1 py-2"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        :style="{ '--hover-color': social.hoverColor } as any"
        class="social-icon group relative flex items-center justify-center size-14 rounded-lg transition-all duration-300"
      >
        <!-- Default icon (hidden on hover if colorIcon exists) -->
        <UIcon
          :name="social.icon"
          class="social-icon-svg size-8 text-[#ABB2BF] transition-all duration-300 group-hover:scale-110"
          :class="{ 'group-hover:opacity-0': social.colorIcon }"
        />

        <!-- Color icon (shown on hover) -->
        <img
          v-if="social.colorIcon"
          :src="social.colorIcon"
          :alt="social.name"
          class="absolute size-8 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
        >

        <!-- Tooltip -->
        <span
          class="absolute left-full ml-3 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
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
        :style="{ '--hover-color': social.hoverColor } as any"
        class="social-icon group relative flex items-center justify-center size-10 rounded-full transition-all duration-200 active:scale-95"
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

/* Brand color on hover - using !important to override Tailwind text color */
.social-icon:hover .social-icon-svg,
.social-icon:active .social-icon-svg {
  color: var(--hover-color) !important;
}

/* Focus visible for accessibility */
.social-icon:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
</style>

