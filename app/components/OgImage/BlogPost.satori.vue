<script setup>
// Social-share image for blog posts, in the site's identity: paper,
// Fraunces title, Geist details, the brand gradient as a thin rule.
defineProps({
  title: { type: String, required: true },
  category: { type: String, required: false, default: '' },
  readingTime: { type: String, required: false, default: '' },
  url: { type: String, required: false, default: 'ailengonzalez.ar/writing' }
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between bg-[#F2EFE9] text-[#121212] p-[72px]"
    style="font-family: 'FrauncesOG'"
  >
    <div class="w-full flex items-center justify-between">
      <span class="text-[34px] leading-none">Ailen Gonzalez</span>
      <span
        v-if="category"
        class="text-[24px] text-[#5c5951]"
        style="font-family: 'Geist'"
      >{{ category }}</span>
    </div>

    <div class="flex flex-col">
      <div
        class="w-[160px] h-[6px] mb-[36px]"
        style="background-image: linear-gradient(90deg, #2B3BFF, #C04BFF);"
      />
      <span
        class="text-[76px] leading-[1.02]"
        style="letter-spacing: -0.02em;"
      >{{ title }}</span>
    </div>

    <div
      class="w-full flex items-center justify-between text-[24px] text-[#5c5951]"
      style="font-family: 'Geist'"
    >
      <span>{{ url }}</span>
      <span>{{ readingTime }}</span>
    </div>
  </div>
</template>
