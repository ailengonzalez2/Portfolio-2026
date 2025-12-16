<script setup lang="ts">
const techStack = [
  { name: 'Wagmi', icon: 'i-simple-icons-ethereum' },
  { name: 'Viem', icon: 'i-simple-icons-ethereum' },
  { name: 'Web3Modal', icon: 'i-simple-icons-walletconnect' }
]
</script>

<template>
  <section class="py-20 sm:py-32 relative overflow-hidden">
    <!-- Background subtle gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/30 to-transparent pointer-events-none" />

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7 }"
        :in-view-options="{ once: true }"
      >
        <!-- Main quote -->
        <blockquote class="text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug text-balance">
          Lately, I've been exploring the blockchain ecosystem—focusing on
          <span class="text-primary">wallet integrations</span>,
          <span class="text-primary">decentralized UI flows</span>, and tools like
          <span class="font-serif italic">Wagmi</span>,
          <span class="font-serif italic">Viem</span>, and
          <span class="font-serif italic">Web3Modal</span>.
        </blockquote>
      </Motion>

      <!-- Tech icons -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
        :in-view-options="{ once: true }"
        class="mt-8 flex items-center justify-center gap-4"
      >
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="flex items-center justify-center size-10 rounded-lg bg-elevated/60 border border-default/50"
          :title="tech.name"
        >
          <UIcon :name="tech.icon" class="size-5 text-muted" />
        </div>
      </Motion>

      <!-- Additional context -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :in-view-options="{ once: true }"
        class="mt-8"
      >
        <p class="text-muted text-sm max-w-xl mx-auto">
          I'm always looking to collaborate on forward-thinking solutions in the Web3 space. Whether it's a DeFi dashboard, NFT marketplace, or wallet experience—let's build something great together.
        </p>
      </Motion>
    </div>
  </section>
</template>

