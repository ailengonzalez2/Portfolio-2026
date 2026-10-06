<script setup lang="ts">
import type { NuxtError } from '#app'
import { resetWipe } from '~/webgl/runtime'

defineProps<{
  error: NuxtError
}>()

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
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <UToaster />
  </div>
</template>
