<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <SocialSidebar />
    <AppHeader :links="navLinks" />
    <main class="flex-1 pt-20 relative z-10">
      <slot />
    </main>
    <AppFooter />

    <!-- Brief generator: floating CTA available on every page + centered modal -->
    <!-- TODO: hidden for now — re-enable when we resume work on the AI brief -->
    <!-- <BriefFloatingButton /> -->
    <BriefModal />
  </div>
</template>
