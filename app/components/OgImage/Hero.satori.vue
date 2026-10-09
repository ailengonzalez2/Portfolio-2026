<script setup>
// Default social-share image, in the site's identity: paper, Fraunces, the
// cobalt → violet gradient on the role.
defineProps({
  headline: { type: Array, required: false, default: () => ['AI Product Design', '& Frontend'] },
  url: { type: String, required: false, default: 'ailengonzalez.ar' },
  place: { type: String, required: false, default: 'Córdoba, Argentina' }
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between bg-[#F2EFE9] text-[#121212] p-[72px]"
    style="font-family: 'FrauncesOG'"
  >
    <span class="text-[40px] leading-none">Ailen Gonzalez</span>

    <div class="flex flex-col">
      <span
        v-for="(line, i) in headline"
        :key="i"
        class="text-[112px] leading-[0.95]"
        style="background-image: linear-gradient(90deg, #2B3BFF, #C04BFF); background-clip: text; color: transparent; letter-spacing: -0.02em;"
      >{{ line }}</span>
    </div>

    <div
      class="w-full flex items-center justify-between text-[24px] text-[#5c5951]"
      style="font-family: 'Geist'"
    >
      <span>{{ url }}</span>
      <span>{{ place }}</span>
    </div>
  </div>
</template>
