<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <SocialSidebar />
    <AppHeader :links="navLinks" />
    <main class="flex-1 pt-20 relative z-10">
      <slot />
    </main>

    <!-- Contact prompt: white background, sits above the dark footer -->
    <section
      id="contact"
      class="relative z-10 bg-background px-4 sm:px-6 lg:px-8 pt-24 pb-40 sm:pt-32 sm:pb-56 text-center"
    >
      <ContactHeading :text="$t('contactCta.heading')" />
    </section>

    <AppFooter />

    <!-- Brief generator: floating CTA available on every page + centered modal -->
    <!-- TODO: hidden for now — re-enable when we resume work on the AI brief -->
    <!-- <BriefFloatingButton /> -->
    <BriefModal />
  </div>
</template>
