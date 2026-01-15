<script setup lang="ts">
const { setIntroComplete } = useIntroAnimation()

const isVisible = ref(true)
const animationStarted = ref(false)
const moveToHeader = ref(false)
const hideSignature = ref(false)
const startPixelTransition = ref(false)
const hideBackground = ref(false)

// Durations in seconds
const initialDelay = 1 // Start delay
const signatureDrawDuration = 2 // Signature reveal
const holdDuration = 0.4 // Brief pause after drawing
const moveToHeaderDuration = 0.8 // Move to header animation
const pixelTransitionDuration = 2 // Pixel dissolve effect

onMounted(() => {
  // Prevent scrolling during animation
  document.body.style.overflow = 'hidden'

  // Start drawing animation after initial delay
  setTimeout(() => {
    animationStarted.value = true
  }, initialDelay * 1000)

  // After signature is drawn, start moving to header AND start pixel transition
  setTimeout(() => {
    moveToHeader.value = true
    // Start pixel transition slightly before signature starts moving
    startPixelTransition.value = true
    // Hide the solid background immediately - pixels will take over
    hideBackground.value = true
  }, (initialDelay + signatureDrawDuration + holdDuration) * 1000)

  // Hide intro signature and show header logo at end of movement
  setTimeout(() => {
    hideSignature.value = true
    setIntroComplete()
  }, (initialDelay + signatureDrawDuration + holdDuration + moveToHeaderDuration) * 1000)

  // Remove overlay completely after pixel transition finishes
  setTimeout(() => {
    isVisible.value = false
    document.body.style.overflow = ''
  }, (initialDelay + signatureDrawDuration + holdDuration + pixelTransitionDuration + 0.2) * 1000)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="intro-overlay"
    >
      <!-- Solid background - hidden instantly when pixels take over -->
      <div v-if="!hideBackground" class="intro-background" />

      <!-- Pixel transition effect - replaces the background and dissolves away -->
      <PixelTransition
        :is-active="startPixelTransition"
        color="#000000"
        :pixel-size="25"
        :duration="2"
        direction="out"
        pattern="vertical"
      />

      <!-- Signature container -->
      <div
        class="signature-container"
        :class="{ 'move-to-header': moveToHeader, 'hide': hideSignature }"
      >
        <!-- Signature image with mask animation -->
        <div class="signature-wrapper">
          <img
            src="/signature-withe.png"
            alt="Ailen"
            class="signature-image"
          >
          <!-- Animated mask overlay -->
          <div class="signature-mask" :class="{ 'animate': animationStarted }" />
        </div>
      </div>
    </div>
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
}

.intro-background {
  position: absolute;
  inset: 0;
  background: #000000;
}

.signature-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.signature-container.move-to-header {
  /* Move to header position: top-left with header padding */
  top: 20px;
  left: 80px;
  transform: translate(0, 0) scale(0.22);
  transform-origin: left top;
}

@media (max-width: 1024px) {
  .signature-container.move-to-header {
    left: 56px;
    top: 18px;
  }
}

@media (max-width: 640px) {
  .signature-container.move-to-header {
    left: 32px;
    top: 16px;
  }
}

.signature-container.hide {
  opacity: 0;
  transition: opacity 0.05s ease-out;
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
  filter: invert(0);
  opacity: 1;
}

/* The mask that reveals the signature */
.signature-mask {
  position: absolute;
  inset: 0;
  background: #000000;
}

.signature-mask.animate {
  animation: reveal-signature 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
