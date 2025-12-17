<script setup lang="ts">
const { global } = useAppConfig()

const { copy, copied } = useClipboard()
</script>

<template>
  <section class="py-20 sm:py-32 relative">
    <!-- Subtle background gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-elevated/20 to-transparent pointer-events-none" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Container with flex column and gap to prevent overlap -->
      <div class="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <!-- Main heading -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :in-view-options="{ once: true }"
        >
          <h2 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-medium tracking-wide leading-tight text-left">
            Got a project in mind?
          </h2>
        </Motion>

        <!-- Email with right alignment -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          :in-view-options="{ once: true }"
          class="flex flex-col items-end"
        >
          <button
            class="group relative inline-flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-mono font-light lowercase text-right hover:text-primary transition-colors"
            @click="copy(global.email)"
          >
            {{ global.email }}
            <UIcon
              :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              class="size-5 sm:size-6 lg:size-7 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>

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
              class="mt-3 text-sm text-success"
            >
              Email copied to clipboard!
            </p>
          </Transition>
        </Motion>
      </div>
    </div>
  </section>
</template>
