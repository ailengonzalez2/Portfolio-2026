<script setup lang="ts">
const isVisible = ref(true)
const isAnimationComplete = ref(false)
const animationStarted = ref(false)

// Durations in seconds
const initialDelay = 1 // Start delay
const signatureDrawDuration = 1.2 // Signature reveal
const holdDuration = 0.6 // Pause after signature
const fadeOutDuration = 0.6 // Fade out

onMounted(() => {
  // Prevent scrolling during animation
  document.body.style.overflow = 'hidden'

  // Start animation after initial delay
  setTimeout(() => {
    animationStarted.value = true
  }, initialDelay * 1000)

  // After signature is drawn and held, fade out
  setTimeout(() => {
    isAnimationComplete.value = true
  }, (initialDelay + signatureDrawDuration + holdDuration) * 1000)

  // Remove overlay completely
  setTimeout(() => {
    isVisible.value = false
    document.body.style.overflow = ''
  }, (initialDelay + signatureDrawDuration + holdDuration + fadeOutDuration) * 1000)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      leave-active-class="transition-opacity duration-400 ease-out"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="intro-overlay"
        :class="{ 'fade-out': isAnimationComplete }"
      >
        <!-- Background -->
        <div class="intro-background" />

        <!-- Signature container -->
        <div class="signature-container">
          <!-- Signature image with mask animation -->
          <div class="signature-wrapper">
            <img
              src="/signature.png"
              alt="Ailen"
              class="signature-image"
            >
            <!-- Animated mask overlay -->
            <div class="signature-mask" :class="{ 'animate': animationStarted }" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.intro-overlay.fade-out {
  opacity: 0;
}

.intro-background {
  position: absolute;
  inset: 0;
  background: #0a0a0a;
}

:root.light .intro-background {
  background: #fafafa;
}

.signature-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signature-wrapper {
  position: relative;
  width: clamp(250px, 40vw, 400px);
  height: auto;
  overflow: hidden;
}

.signature-image {
  width: 100%;
  height: auto;
  filter: invert(1);
  opacity: 0.9;
}

:root.light .signature-image {
  filter: invert(0);
  opacity: 1;
}

/* The mask that reveals the signature */
.signature-mask {
  position: absolute;
  inset: 0;
  background: #0a0a0a;
}

.signature-mask.animate {
  animation: reveal-signature 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

:root.light .signature-mask {
  background: #fafafa;
}

@keyframes reveal-signature {
  0% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 100%);
  }
}
</style>
