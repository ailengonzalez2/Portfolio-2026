<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'

interface SocialLink {
  name: string
  icon: string
  url: string
  label: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: 'i-mdi-linkedin',
    url: 'https://www.linkedin.com/in/ailengonzalez/',
    label: 'Visitar perfil de LinkedIn'
  },
  {
    name: 'CV',
    icon: 'i-simple-icons-readdotcv',
    url: 'https://cv.ailengonzalez.ar/',
    label: 'Leer mi cv en Read.cv'
  },
  {
    name: 'GitHub',
    icon: 'i-mdi-github',
    url: 'https://github.com/ailengonzalez2',
    label: 'Ver repositorios en GitHub'
  },
  {
    name: 'Upwork',
    icon: 'i-simple-icons-upwork',
    url: 'https://www.upwork.com/freelancers/ailengonzalez?mp_source=share',
    label: 'Contratar en Upwork'
  }
]

// Near the bottom the sidebar sits over the ink footer: switch to paper.
const { y } = useWindowScroll()
const { height } = useWindowSize()

const isExpanded = computed(() => {
  if (!import.meta.client) return false
  const scrollHeight = document.documentElement.scrollHeight
  const scrollPosition = y.value + height.value
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
    class="fixed bottom-8 left-8 z-50 hidden lg:flex flex-col items-center gap-5"
    aria-label="Enlaces a redes sociales"
  >
    <nav
      class="flex flex-col items-center gap-4"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        class="group relative flex items-center justify-center size-8 transition-colors duration-300"
        :class="isExpanded ? 'text-paper/60 hover:text-paper' : 'text-label hover:text-ink'"
      >
        <UIcon
          :name="social.icon"
          class="size-[18px]"
        />
        <span
          class="absolute left-full top-1/2 -translate-y-1/2 ml-3 font-mono text-[10px] uppercase tracking-[0.18em] whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none"
          :class="isExpanded ? 'text-paper' : 'text-ink'"
        >
          {{ social.name }}
        </span>
      </ULink>
    </nav>
    <div
      class="w-px h-16 transition-colors duration-300"
      :class="isExpanded ? 'bg-paper/30' : 'bg-hairline'"
      aria-hidden="true"
    />
  </aside>

  <!-- Mobile: compact horizontal pill at the bottom -->
  <div
    class="fixed left-1/2 -translate-x-1/2 z-50 lg:hidden transition-[bottom] duration-300 ease-out"
    :style="{ bottom: `${mobileBottom}px` }"
  >
    <nav
      class="flex items-center gap-1 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-300"
      :class="isMobileExpanded ? 'bg-ink/90 border-paper/15' : 'bg-paper/90 border-hairline'"
      aria-label="Redes sociales"
    >
      <ULink
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.label"
        class="flex items-center justify-center size-9 rounded-full transition-colors active:scale-95"
        :class="isMobileExpanded ? 'text-paper/70' : 'text-label'"
      >
        <UIcon
          :name="social.icon"
          class="size-[18px]"
        />
      </ULink>
    </nav>
  </div>
</template>
