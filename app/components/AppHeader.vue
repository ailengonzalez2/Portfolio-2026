<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 50)
const { isIntroComplete } = useIntroAnimation()

// i18n
const { locale, setLocale, t } = useI18n()

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

// Switch to black logo when past Rolls section (approximately when Hero is visible)
const isPastRolls = computed(() => {
  if (import.meta.server) return false
  return scrollY.value > window.innerHeight * 0.65
})

// The only place the header floats over a dark background is the black Rolls
// hero on the home page. Everywhere else (other pages, and home past the hero)
// the header sits over light content / photos, so it gets the opaque light
// surface with dark text.
const route = useRoute()
const overDarkHero = computed(() => route.path === '/' && !isPastRolls.value)

// Full-width square bar only over the dark home hero; a centered pill everywhere
// else (scrolled, or any non-hero page).
const isPill = computed(() => isScrolled.value || !overDarkHero.value)

// Mobile menu state
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Translate nav labels by using the label as a key into the nav namespace
const translateLabel = (label?: string) => label ? t(`nav.${label}`) : ''
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
    :class="isPill ? 'px-4 sm:px-6 lg:px-8 pt-4' : 'px-6 sm:px-10 lg:px-16 py-4'"
  >
    <div
      class="glass-base relative mx-auto transition-all duration-500 ease-out px-6 py-3"
      :class="[
        isPill ? 'max-w-6xl rounded-full' : 'max-w-full rounded-none',
        overDarkHero ? 'glass-dark' : 'glass-light'
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
                isIntroComplete ? (overDarkHero ? 'opacity-100' : 'opacity-0') : 'opacity-0'
              ]"
            >
            <!-- Black logo -->
            <img
              src="/signature.png"
              alt="AG Signature"
              class="absolute top-0 left-0 h-10 w-auto transition-opacity duration-500 ease-in-out group-hover:scale-105"
              :class="[
                isIntroComplete ? (overDarkHero ? 'opacity-0' : 'opacity-100') : 'opacity-0'
              ]"
            >
          </div>
        </NuxtLink>

        <!-- Right side - Nav, Lang toggle, CTA Button & Mobile menu -->
        <div class="flex items-center gap-6">
          <!-- Navigation -->
          <nav class="hidden md:flex">
            <ul class="flex items-center gap-8">
              <li
                v-for="link in links"
                :key="String(link.to)"
              >
                <NuxtLink
                  :to="link.to"
                  class="text-xs tracking-wide transition-colors uppercase"
                  :class="overDarkHero ? 'text-white/75 hover:text-white' : 'text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white'"
                >
                  {{ translateLabel(link.label) }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Language toggle -->
          <button
            type="button"
            class="lang-toggle hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            :aria-label="$t('common.switchLanguage')"
            @click="toggleLocale"
          >
            <UIcon
              name="i-lucide-globe"
              class="size-3.5"
            />
            {{ locale === 'en' ? 'ES' : 'EN' }}
          </button>

          <NuxtLink
            to="/#contact"
            class="group/btn relative hidden sm:inline-flex items-center bg-neutral-900 py-3.5 pl-8 pr-14 hover:pl-14 hover:pr-8 btn-transition"
            :class="isScrolled ? 'rounded-[50px]' : 'rounded-2xl'"
          >
            <span class="absolute right-1.5 flex items-center justify-center size-9 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-2.625rem)]">
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-gray-900"
              />
            </span>
            <span class="text-sm font-semibold text-white uppercase tracking-wide">
              {{ $t('nav.hireMe') }}
            </span>
          </NuxtLink>

          <!-- Mobile menu button -->
          <UButton
            :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            variant="ghost"
            color="neutral"
            class="md:hidden"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click="toggleMobileMenu"
          />
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Panel -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-white dark:bg-[#0a0a0a] md:hidden"
    >
      <nav class="flex flex-col items-center justify-center h-full gap-8">
        <NuxtLink
          v-for="link in links"
          :key="String(link.to)"
          :to="link.to"
          class="text-2xl font-medium text-foreground hover:text-primary transition-colors uppercase"
          @click="closeMobileMenu"
        >
          {{ translateLabel(link.label) }}
        </NuxtLink>

        <!-- Mobile language toggle -->
        <button
          type="button"
          class="lang-toggle inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider cursor-pointer"
          :aria-label="$t('common.switchLanguage')"
          @click="toggleLocale"
        >
          <UIcon
            name="i-lucide-globe"
            class="size-4"
          />
          {{ locale === 'en' ? 'Español' : 'English' }}
        </button>

        <!-- Mobile CTA Button -->
        <NuxtLink
          to="/#contact"
          class="group/btn relative mt-4 inline-flex items-center bg-neutral-900 py-3.5 pl-8 pr-14 hover:pl-14 hover:pr-8 rounded-full btn-transition"
          @click="closeMobileMenu"
        >
          <span class="absolute right-1.5 flex items-center justify-center size-9 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-2.625rem)]">
            <UIcon
              name="i-lucide-arrow-down"
              class="size-4 text-gray-900"
            />
          </span>
          <span class="text-sm font-semibold text-white uppercase tracking-wide">
            {{ $t('nav.hireMe') }}
          </span>
        </NuxtLink>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
/* Shared frosted base for the header bar */
.glass-base {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition:
    max-width 500ms ease-out,
    border-radius 500ms ease-out,
    background 400ms ease,
    border-color 400ms ease,
    box-shadow 400ms ease;
}

/* Over the dark Rolls hero — subtle dark glass so the white logo + links read */
.glass-dark {
  background: rgba(10, 10, 10, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
}

/* Everywhere else — opaque light frosted surface so the varied backgrounds
   underneath (white sections, Services photos, etc.) can't bleed through and
   wash out the links. This is what keeps the nav legible at every scroll. */
.glass-light {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 10px 36px 0 rgba(0, 0, 0, 0.10),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
}

:global(.dark) .glass-light {
  background: rgba(20, 20, 20, 0.72);
  border-color: rgba(255, 255, 255, 0.10);
  box-shadow:
    0 10px 36px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
}

/* Button transition - smooth in both directions */
.btn-transition {
  transition: padding 300ms ease-out, border-radius 300ms ease-in-out;
}

/* Language toggle - tone follows the surface underneath */
.lang-toggle {
  transition: color 300ms ease, background 300ms ease, border-color 300ms ease;
}

.glass-light .lang-toggle {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2937;
  border: 1px solid rgba(0, 0, 0, 0.10);
}

.glass-light .lang-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.18);
}

:global(.dark) .glass-light .lang-toggle {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border-color: rgba(255, 255, 255, 0.12);
}

.glass-dark .lang-toggle {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.glass-dark .lang-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
