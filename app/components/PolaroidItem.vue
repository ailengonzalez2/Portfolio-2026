<script setup lang="ts">
interface ImageData {
  src: string
  alt: string
}

defineProps<{
  image: ImageData
  index: number
}>()
</script>

<template>
  <div
    class="relative bg-white dark:bg-neutral-800 p-2 rounded shadow-lg transition-transform duration-300 hover:scale-105 hover:z-10"
    :class="index % 2 === 0 ? '-rotate-3' : 'rotate-3'"
  >
    <img
      :src="image.src"
      :alt="image.alt"
      class="w-32 h-32 object-cover rounded"
    >
  </div>
</template>

