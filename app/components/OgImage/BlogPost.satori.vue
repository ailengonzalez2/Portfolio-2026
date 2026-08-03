<script setup>
defineProps({
  title: { type: String, required: true },
  category: { type: String, required: false, default: '' },
  readingTime: { type: String, required: false, default: '' },
  url: { type: String, required: false, default: 'ailengonzalez.ar/writing' }
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between bg-[#0a0a0a] text-white p-[70px]"
    style="font-family: 'Inter'"
  >
    <!-- Top row: wordmark + category pill -->
    <div class="w-full flex items-center justify-between">
      <img
        src="/signature-withe.png"
        height="46"
        style="height: 46px;"
      >
      <div
        v-if="category"
        class="flex items-center rounded-full border border-[#a11ee2] px-5 py-2"
      >
        <span class="text-[20px] tracking-[0.2em] uppercase text-[#c77df0]">{{ category }}</span>
      </div>
    </div>

    <!-- Title -->
    <div class="flex flex-col">
      <span class="text-[64px] font-bold leading-[1.08] tracking-tight">{{ title }}</span>
    </div>

    <!-- Bottom row: url + byline -->
    <div class="w-full flex items-center justify-between">
      <span class="text-[26px] text-white/60">{{ url }}</span>
      <span class="text-[26px] text-white/60">Ailen Gonzalez{{ readingTime ? ` · ${readingTime}` : '' }}</span>
    </div>
  </div>
</template>
