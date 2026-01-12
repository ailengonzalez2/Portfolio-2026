<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { global } = useAppConfig()

defineProps<{
  links: NavigationMenuItem[]
}>()

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 20)
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
    <div
      class="glass-header relative max-w-6xl mx-auto rounded-full transition-all duration-500 px-6 py-3"
      :class="isScrolled ? 'glass-header-scrolled' : ''"
    >
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="relative flex items-center justify-center group h-10"
        >
          <!-- Decorative dot -->
          <div class="absolute -top-0.5 left-1 size-2 rounded-full bg-violet-500" />
          <div class="text-3xl font-semibold text-foreground tracking-tight transition-transform group-hover:scale-105 leading-none">
            AG
          </div>
        </NuxtLink>

        <!-- Navigation - Centered -->
        <nav class="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <ul class="flex items-center gap-8">
            <li
              v-for="link in links"
              :key="String(link.to)"
            >
              <NuxtLink
                :to="link.to"
                class="text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Right side - CTA Button & Color Mode -->
        <div class="flex items-center gap-3">
          <ColorModeButton class="hidden sm:flex" />

          <UButton
            label="HIRE ME"
            :to="`mailto:${global.email}`"
            class="hidden sm:flex rounded-full font-semibold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 hover:opacity-90 transition-opacity px-7 py-3 text-base"
            size="md"
          />

          <!-- Mobile menu button -->
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            class="md:hidden"
            aria-label="Open menu"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.glass-header {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}

.glass-header::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
}

.glass-header-scrolled {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow:
    0 12px 40px 0 rgba(0, 0, 0, 0.12),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}

:global(.dark) .glass-header {
  background: rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
}

:global(.dark) .glass-header::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02));
  opacity: 0.4;
}

:global(.dark) .glass-header-scrolled {
  background: rgba(0, 0, 0, 0.45);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 12px 40px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
}
</style>
