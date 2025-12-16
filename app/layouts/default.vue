<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader :links="navLinks" />
    <main class="flex-1 pt-20">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
