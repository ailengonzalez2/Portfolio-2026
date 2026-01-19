<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 50)
const { isIntroComplete } = useIntroAnimation()

// Switch to black logo when past Rolls section (approximately when Hero is visible)
const isPastRolls = computed(() => {
  if (import.meta.server) return false
  return scrollY.value > window.innerHeight * 0.65
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
    :class="isScrolled ? 'px-4 sm:px-6 lg:px-8 pt-4' : 'px-6 sm:px-10 lg:px-16 py-4'"
  >
    <div
      class="relative mx-auto transition-all duration-500 ease-out px-6 py-3"
      :class="[
        isScrolled
          ? 'glass-header glass-header-scrolled max-w-6xl rounded-full'
          : 'glass-header-top max-w-full rounded-none'
      ]"
    >
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="relative flex items-center justify-center group"
        >
          <div class="relative h-10">
            <!-- White logo -->
            <img
              src="/signature-withe.png"
              alt="AG Signature"
              class="h-10 w-auto transition-opacity duration-500 ease-in-out group-hover:scale-105"
              :class="[
                isIntroComplete ? (isPastRolls ? 'opacity-0' : 'opacity-100') : 'opacity-0'
              ]"
            >
            <!-- Black logo -->
            <img
              src="/signature.png"
              alt="AG Signature"
              class="absolute top-0 left-0 h-10 w-auto transition-opacity duration-500 ease-in-out group-hover:scale-105"
              :class="[
                isIntroComplete ? (isPastRolls ? 'opacity-100' : 'opacity-0') : 'opacity-0'
              ]"
            >
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
                class="text-base text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Right side - CTA Button & Color Mode -->
        <div class="flex items-center gap-3">
          <!-- <ColorModeButton class="hidden sm:flex" /> -->

          <NuxtLink
            to="#contact"
            class="group/btn relative hidden sm:inline-flex items-center bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] py-3.5 pl-8 pr-14 hover:pl-14 hover:pr-8 btn-transition"
            :class="isScrolled ? 'rounded-[50px]' : 'rounded-2xl'"
          >
            <span class="absolute right-1.5 flex items-center justify-center size-9 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-2.625rem)]">
              <UIcon
                name="i-lucide-arrow-down"
                class="size-4 text-gray-900"
              />
            </span>
            <span class="text-sm font-semibold text-white uppercase tracking-wide">
              Hire Me
            </span>
          </NuxtLink>

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
/* Top state - full width, minimal styling */
.glass-header-top {
  background: transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:global(.dark) .glass-header-top {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

/* Scrolled state - glass pill */
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

/* Button transition - smooth in both directions */
.btn-transition {
  transition: padding 300ms ease-out, border-radius 300ms ease-in-out;
}
</style>
