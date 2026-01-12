<script setup lang="ts">
</script>

<template>
  <section class="py-20 sm:py-32 relative overflow-hidden">
    <!-- Background Image - full width horizontal -->
    <div class="absolute left-0 bottom-0 w-full h-auto pointer-events-none">
      <img
        src="/background-lines-lila.png"
        alt=""
        class="w-full h-auto object-cover opacity-40"
      >
    </div>

    <!-- Background subtle gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/30 to-transparent pointer-events-none" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7 }"
        :in-view-options="{ once: true }"
      >
        <!-- Main quote -->
        <blockquote class="text-3xl sm:text-4xl lg:text-5xl font-normal leading-snug text-balance">
          Lately, I've been exploring the blockchain ecosystem—focusing on wallet integrations, decentralized UI flows, and tools like Wagmi, Viem, and Web3Modal.
        </blockquote>
      </Motion>

      <!-- Additional context -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :in-view-options="{ once: true }"
        class="mt-8"
      >
        <p class="text-muted text-base sm:text-lg max-w-xl ml-auto">
          I'm always looking to collaborate on forward-thinking solutions in the Web3 space. Whether it's a DeFi dashboard, NFT marketplace, or wallet experience—let's build something great together.
        </p>
      </Motion>
    </div>
  </section>
</template>
