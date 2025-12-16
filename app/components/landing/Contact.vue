<script setup lang="ts">
const { global } = useAppConfig()

const { copy, copied } = useClipboard()
</script>

<template>
  <section class="py-20 sm:py-32 relative">
    <!-- Subtle background gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/20 to-transparent pointer-events-none" />

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Main heading -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        :in-view-options="{ once: true }"
      >
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif italic tracking-tight uppercase">
          Got a project in mind?
        </h2>
      </Motion>

      <!-- Email -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :in-view-options="{ once: true }"
        class="mt-4"
      >
        <button
          class="group inline-flex items-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-medium bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          @click="copy(global.email)"
        >
          {{ global.email }}
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-5 sm:size-6 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </Motion>

      <!-- Copied feedback -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <p
          v-if="copied"
          class="mt-2 text-sm text-success"
        >
          Email copied to clipboard!
        </p>
      </Transition>
    </div>
  </section>
</template>
