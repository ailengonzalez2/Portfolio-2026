<script setup lang="ts">
const { global } = useAppConfig()
const year = new Date().getFullYear()

const { copy, copied } = useClipboard()
</script>

<template>
  <footer>
    <!-- Contact Section -->
    <section id="contact" class="py-20 sm:py-32 relative border-b border-default/50">
      <!-- Subtle background gradient -->
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/20 to-transparent pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Container with flex column and gap to prevent overlap -->
        <div class="flex flex-col gap-8 sm:gap-10 lg:gap-12">
          <!-- Main heading -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            :in-view-options="{ once: true }"
          >
            <h2 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-medium tracking-wide leading-tight text-right">
              Happy to connect
            </h2>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Footer Credits -->
    <div class="py-8 border-t border-default/50">
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
    </div>
  </footer>
</template>
