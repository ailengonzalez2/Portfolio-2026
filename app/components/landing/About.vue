<script setup lang="ts">

const activeRole = ref('designer')

const roles = [
  {
    key: 'designer',
    label: 'product designer',
    labelStyle: 'uppercase tracking-widest text-xs',
    title: 'Product Designer',
    description: 'I focus on intuitive experiences, information architecture, and visual design. From early research to pixel-perfect mockups, I ensure every touchpoint delights users.'
  },
  {
    key: 'developer',
    label: 'frontend developer',
    labelStyle: 'font-serif italic text-lg lowercase',
    title: 'Frontend Developer',
    description: 'I bring designs to life with clean, performant code. Specializing in Vue, Nuxt, and modern CSS, I build responsive interfaces that feel native and fast.'
  }
]

const currentRole = computed(() => roles.find(r => r.key === activeRole.value) || roles[0])
</script>

<template>
  <section class="py-16 sm:py-24">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Badge -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated/60 border border-default/50 text-sm text-muted mb-8">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full rounded-full bg-success opacity-75 animate-ping" />
            <span class="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Open for work in Winter 25
        </div>
      </Motion>

      <!-- Role Tabs -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :in-view-options="{ once: true }"
        class="flex flex-wrap gap-4 mb-6"
      >
        <button
          v-for="role in roles"
          :key="role.key"
          class="group relative px-4 py-2 rounded-lg transition-all duration-300"
          :class="[
            activeRole === role.key
              ? 'bg-elevated border border-default shadow-sm'
              : 'hover:bg-elevated/50'
          ]"
          @click="activeRole = role.key"
        >
          <span
            v-if="role.key === 'designer'"
            class="uppercase tracking-[0.2em] text-xs font-medium"
            :class="activeRole === role.key ? 'text-highlighted' : 'text-muted'"
          >
            {{ role.label }}
          </span>
          <span
            v-else
            class="font-serif italic text-lg"
            :class="activeRole === role.key ? 'text-highlighted' : 'text-muted'"
          >
            {{ role.label }}
          </span>
        </button>
      </Motion>

      <!-- Role Description -->
      <Motion
        :key="currentRole.key"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }"
        class="mb-8"
      >
        <p class="text-muted text-base sm:text-lg leading-relaxed">
          {{ currentRole.description }}
        </p>
      </Motion>

      <!-- CTA Button -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
        :in-view-options="{ once: true }"
      >
        <div class="flex items-center gap-3">
          <UButton
            label="More about me"
            to="/about"
            variant="outline"
            color="neutral"
            class="rounded-full"
          >
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" class="size-4" />
            </template>
          </UButton>
          <UIcon name="i-lucide-sparkles" class="size-5 text-muted" />
        </div>
      </Motion>
    </div>
  </section>
</template>
