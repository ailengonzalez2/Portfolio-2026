<script setup>
defineProps({
  // Headline rendered one span per line, matching the hero on the site
  headline: { type: Array, required: false, default: () => ['AI PRODUCT', 'DESIGN &', 'FRONTEND'] },
  tagline: { type: String, required: false, default: 'Designer & Frontend Developer' },
  url: { type: String, required: false, default: 'ailengonzalez.ar' }
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between bg-[#0a0a0a] text-white p-[70px]"
    style="font-family: 'Inter'"
  >
    <!-- Top row: wordmark + available pill -->
    <div class="w-full flex items-center justify-between">
      <img
        src="/signature-withe.png"
        height="46"
        style="height: 46px;"
      >
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-[#4ade80]" />
        <span class="text-[22px] tracking-[0.2em] uppercase text-white/50">Available for work</span>
      </div>
    </div>

    <!-- Headline -->
    <div class="flex flex-col">
      <span
        v-for="(line, i) in headline"
        :key="i"
        class="text-[100px] font-bold leading-[0.92] tracking-tight uppercase"
      >{{ line }}</span>
    </div>

    <!-- Bottom row: url + tagline -->
    <div class="w-full flex items-center justify-between">
      <span class="text-[26px] text-white/60">{{ url }}</span>
      <span class="text-[26px] text-white/60">{{ tagline }}</span>
    </div>
  </div>
</template>
