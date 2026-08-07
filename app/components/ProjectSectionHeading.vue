<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <ScrollReveal
    :y="16"
    :blur="4"
  >
    <div class="mb-8 sm:mb-10">
      <div class="flex items-center gap-4">
        <h2 class="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-heading dark:text-white shrink-0">
          {{ title }}
        </h2>
        <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <p
        v-if="description"
        class="mt-4 max-w-xl text-base sm:text-lg text-muted"
      >
        {{ description }}
      </p>
    </div>
  </ScrollReveal>
</template>
