<script setup lang="ts">
const route = useRoute()
// The About page has its own ending, so skip the global contact prompt there.
const showContact = computed(() => route.path !== '/about')
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <SocialSidebar />
    <AppHeader :links="navLinks" />
    <main class="flex-1 pt-20 relative z-10">
      <slot />
    </main>

    <!-- Contact prompt: heading + booking/email CTAs, sits above the dark footer -->
    <LandingContactCta v-if="showContact" class="relative z-10" />

    <AppFooter />

    <!-- Brief generator: floating CTA available on every page + centered modal -->
    <!-- TODO: hidden for now — re-enable when we resume work on the AI brief -->
    <!-- <BriefFloatingButton /> -->
    <BriefModal />
  </div>
</template>
