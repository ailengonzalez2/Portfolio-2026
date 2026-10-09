<script setup lang="ts">
import type { NuxtError } from '#app'
import { resetWipe } from '~/webgl/runtime'

defineProps<{
  error: NuxtError
}>()

const localizedTo = useLocalizedTo()

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

// The page transition that led here may have left the curtain or the particle
// wipe covering the screen.
const curtain = usePageCurtain()
onMounted(() => {
  resetWipe()
  curtain.reveal()
})
</script>

<template>
  <div>
    <AppHeader :links="navLinks" />

    <UMain>
      <section class="min-h-[80svh] flex items-center pt-32 pb-24">
        <div class="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:pl-28 lg:pr-16">
          <p class="font-mono text-xs text-label">
            {{ error.statusCode }}
          </p>
          <h1 class="mt-4 max-w-[14em] text-balance font-display font-normal text-5xl sm:text-7xl leading-[0.95] tracking-[-0.03em] btn-gradient-text pb-[0.08em]">
            {{ error.statusCode === 404 ? $t('error.notFound') : $t('error.generic') }}
          </h1>
          <p class="mt-8 max-w-xl text-lg text-body">
            {{ $t('error.body') }}
          </p>
          <NuxtLink
            :to="localizedTo('/')"
            class="btn-gradient inline-flex items-center gap-2 mt-10"
          >
            {{ $t('error.home') }}
          </NuxtLink>
        </div>
      </section>
    </UMain>

    <AppFooter />

    <UToaster />
  </div>
</template>
