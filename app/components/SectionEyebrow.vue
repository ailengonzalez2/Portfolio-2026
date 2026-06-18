<script setup lang="ts">
defineProps<{
  /** The eyebrow label text */
  label: string
}>()
</script>

<template>
  <div>
    <h2 class="text-label text-[20px] font-medium uppercase tracking-normal mb-[10px]">
      {{ label }}
    </h2>
    <div class="h-[2px] w-[50px] bg-label" />
  </div>
</template>
