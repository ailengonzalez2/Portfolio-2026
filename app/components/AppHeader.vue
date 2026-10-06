<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 24)

const { locale, setLocale, t } = useI18n()
const localizedTo = useLocalizedTo()

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const translateLabel = (label?: string) => label ? t(`nav.${label}`) : ''
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300"
    :class="isScrolled ? 'bg-paper/85 backdrop-blur-md border-b border-hairline dark:bg-ink/85' : 'bg-transparent border-b border-transparent'"
  >
    <div class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <NuxtLink
        :to="localizedTo('/')"
        class="flex items-center"
        aria-label="Ailen Gonzalez — home"
      >
        <img
          src="/signature.png"
          alt=""
          class="h-9 w-auto dark:invert"
        >
      </NuxtLink>

      <div class="flex items-center gap-6">
        <nav class="hidden md:block">
          <ul class="flex items-center gap-7">
            <li
              v-for="link in links"
              :key="String(link.to)"
            >
              <NuxtLink
                :to="localizedTo(String(link.to))"
                class="font-mono text-[11px] uppercase tracking-[0.18em] text-label hover:text-ink dark:hover:text-paper transition-colors"
              >
                {{ translateLabel(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          class="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-label hover:text-ink transition-colors cursor-pointer"
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
          :to="localizedTo('/#contact')"
          data-umami-event="cta-hire-me"
          data-umami-event-location="header"
          class="btn-gradient hidden sm:inline-flex px-5! py-2! text-sm!"
        >
          {{ $t('nav.hireMe') }}
        </NuxtLink>

        <UButton
          :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          variant="ghost"
          color="neutral"
          class="md:hidden"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        />
      </div>
    </div>
  </header>

  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-paper dark:bg-ink md:hidden"
    >
      <nav class="flex flex-col items-start justify-center h-full gap-6 px-8">
        <NuxtLink
          v-for="link in links"
          :key="String(link.to)"
          :to="localizedTo(String(link.to))"
          class="font-display text-5xl text-ink dark:text-paper"
          @click="closeMobileMenu"
        >
          {{ translateLabel(link.label) }}
        </NuxtLink>

        <button
          type="button"
          class="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-label cursor-pointer"
          :aria-label="$t('common.switchLanguage')"
          @click="toggleLocale"
        >
          <UIcon
            name="i-lucide-globe"
            class="size-4"
          />
          {{ locale === 'en' ? 'Español' : 'English' }}
        </button>

        <NuxtLink
          :to="localizedTo('/#contact')"
          data-umami-event="cta-hire-me"
          data-umami-event-location="mobile-menu"
          class="btn-gradient mt-4"
          @click="closeMobileMenu"
        >
          {{ $t('nav.hireMe') }}
        </NuxtLink>
      </nav>
    </div>
  </Transition>
</template>
