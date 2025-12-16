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
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-default/80 backdrop-blur-lg border-b border-default/50' : ''"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 group"
        >
          <div class="size-10 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
            AG
          </div>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden sm:block">
          <UNavigationMenu
            :items="links"
            variant="link"
            color="neutral"
            class="bg-elevated/80 backdrop-blur-md rounded-full px-2 border border-default/50 shadow-lg shadow-neutral-950/5"
            :ui="{
              link: 'px-4 py-2 text-sm',
              linkLeadingIcon: 'hidden'
            }"
          >
            <template #list-trailing>
              <ColorModeButton />
            </template>
          </UNavigationMenu>
        </nav>

        <!-- CTA -->
        <div class="flex items-center gap-3">
          <UButton
            label="Get in touch"
            :to="`mailto:${global.email}`"
            class="hidden sm:flex rounded-full"
            size="sm"
          />

          <!-- Mobile menu button -->
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            class="sm:hidden"
            aria-label="Open menu"
          />
        </div>
      </div>
    </div>
  </header>
</template>
