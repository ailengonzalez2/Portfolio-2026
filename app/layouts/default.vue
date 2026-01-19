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
  </div>
</template>
