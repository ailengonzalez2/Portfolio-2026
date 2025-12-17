<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-8 border-t border-default/50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 text-primary-custom dark:text-primary-custom-dark">
        <!-- Product Designer -->
        <p class="font-display text-sm sm:text-base uppercase tracking-wide shrink-0 order-2 sm:order-1">
          Product designer
        </p>

        <!-- Credits -->
        <p class="font-sans text-xs sm:text-base order-1 sm:order-2 text-center">
          <span>© {{ year }} – Designed &amp; Coded by </span>
          <NuxtLink
            to="https://www.linkedin.com/in/ailengonzalez/"
            target="_blank"
            class="underline underline-offset-2 hover:text-primary transition-colors"
          >
            Ailen Gonzalez
          </NuxtLink>
        </p>

        <!-- Front-end Developer -->
        <p class="font-mono text-sm sm:text-base uppercase tracking-wide shrink-0 order-3">
          Front-end developer
        </p>
      </div>
    </div>
  </footer>
</template>
