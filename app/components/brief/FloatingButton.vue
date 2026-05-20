<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const { isOpen, open } = useBriefModal()

// Reveal the button only after the user scrolls past the hero.
const { y } = useWindowScroll()
const { height } = useWindowSize()
const isPastHero = computed(() => y.value > height.value * 0.6)

// Initial "pulse to invite attention" — fires once when the button first appears,
// then disables itself so it never becomes annoying.
const hasPulsed = ref(false)
const pulseActive = ref(false)
let pulseTimer: ReturnType<typeof setTimeout> | null = null

watch(isPastHero, (val) => {
  if (val && !hasPulsed.value) {
    hasPulsed.value = true
    pulseActive.value = true
    pulseTimer = setTimeout(() => { pulseActive.value = false }, 3500)
  }
})

onUnmounted(() => {
  if (pulseTimer) clearTimeout(pulseTimer)
})

// Hide entirely while the modal is open — no point showing "open" twice.
const visible = computed(() => isPastHero.value && !isOpen.value)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="visible"
      class="floating-brief fixed z-40"
    >
      <!-- Pulse ring (one-shot on first appearance) -->
      <span
        v-if="pulseActive"
        class="absolute inset-0 rounded-full bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] opacity-50 animate-ping-once"
        aria-hidden="true"
      />

      <button
        type="button"
        class="brief-fab group relative inline-flex items-center gap-2 bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] text-white font-semibold rounded-full pl-3 pr-4 sm:pl-4 sm:pr-5 py-3 shadow-[0_8px_30px_rgba(184,106,223,0.35)] hover:shadow-[0_12px_40px_rgba(184,106,223,0.45)] transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
        :aria-label="$t('brief.floatingCta')"
        @click="open()"
      >
        <span class="flex items-center justify-center size-7 sm:size-8 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
          <UIcon
            name="i-lucide-sparkles"
            class="size-3.5 sm:size-4 transition-transform group-hover:rotate-12"
          />
        </span>
        <span class="hidden sm:inline text-sm tracking-wide">
          {{ $t('brief.floatingCta') }}
        </span>
        <span class="sm:hidden text-sm tracking-wide">
          {{ $t('brief.floatingCtaShort') }}
        </span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.floating-brief {
  bottom: 1.25rem;
  right: 1.25rem;
}

@media (min-width: 640px) {
  .floating-brief {
    bottom: 1.75rem;
    right: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .floating-brief {
    bottom: 2rem;
    right: 2rem;
  }
}

.brief-fab {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* One-shot ping (not infinite like Tailwind's animate-ping) */
.animate-ping-once {
  animation: ping-once 1.5s cubic-bezier(0, 0, 0.2, 1) 2;
}

@keyframes ping-once {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  75%, 100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
