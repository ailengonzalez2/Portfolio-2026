<script setup lang="ts">
const { footer } = useAppConfig()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-8 border-t border-default/50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Credits -->
        <div class="flex items-center gap-2 text-muted text-sm">
          <span>© {{ year }}</span>
          <span class="hidden sm:inline">•</span>
          <span class="hidden sm:inline">Designed & built with</span>
          <UIcon name="i-lucide-heart" class="size-4 text-rose-500" />
          <span class="hidden sm:inline">using</span>
          <NuxtLink
            to="https://nuxt.com"
            target="_blank"
            class="hidden sm:inline text-primary hover:underline"
          >
            Nuxt
          </NuxtLink>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-1">
          <UButton
            v-for="(link, index) of footer?.links"
            :key="index"
            v-bind="{ size: 'sm', color: 'neutral', variant: 'ghost', ...link }"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
