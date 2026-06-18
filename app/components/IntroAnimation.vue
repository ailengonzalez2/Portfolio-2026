<script setup lang="ts">
const { setIntroComplete, shouldPlayIntro, markIntroSeen } = useIntroAnimation()

const isVisible = ref(false)
const animationStarted = ref(false)
const moveToHeader = ref(false)
const hideSignature = ref(false)
const fadeBackground = ref(false)

// Durations in seconds
const initialDelay = 1 // Start delay
const signatureDrawDuration = 2 // Signature reveal
const holdDuration = 0.4 // Brief pause after drawing
const moveToHeaderDuration = 0.8 // Move to header animation
const backgroundFadeDuration = 1 // Background fade out

const timers: ReturnType<typeof setTimeout>[] = []

const unlockScroll = () => {
  document.body.style.overflow = ''
}

// Tear down the overlay and restore the page. Idempotent — safe to call from
// the timeline, the skip handler, or unmount.
const finishIntro = () => {
  timers.forEach(clearTimeout)
  timers.length = 0
  window.removeEventListener('keydown', onKeydown)
  hideSignature.value = true
  isVisible.value = false
  setIntroComplete()
  markIntroSeen()
  unlockScroll()
  if (import.meta.client) window.scrollTo(0, 0)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') finishIntro()
}

onMounted(() => {
  // Skip entirely for reduced-motion users or repeat visits this session
  if (!shouldPlayIntro()) {
    setIntroComplete()
    markIntroSeen()
    return
  }

  isVisible.value = true
  // Prevent scrolling during animation
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)

  // Start drawing animation after initial delay
  timers.push(setTimeout(() => {
    animationStarted.value = true
  }, initialDelay * 1000))

  // After signature is drawn, start moving to header AND fade background
  timers.push(setTimeout(() => {
    moveToHeader.value = true
    fadeBackground.value = true
  }, (initialDelay + signatureDrawDuration + holdDuration) * 1000))

  // Hide intro signature and show header logo at end of movement
  timers.push(setTimeout(() => {
    hideSignature.value = true
    setIntroComplete()
  }, (initialDelay + signatureDrawDuration + holdDuration + moveToHeaderDuration) * 1000))

  // Remove overlay completely after background fade finishes
  timers.push(setTimeout(() => {
    finishIntro()
  }, (initialDelay + signatureDrawDuration + holdDuration + backgroundFadeDuration + 0.2) * 1000))
})

// Safety: never leave the page scroll-locked if the component is torn down
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="intro-overlay"
      role="dialog"
      aria-label="Intro animation"
      @click="finishIntro"
    >
      <!-- Skip control -->
      <button
        type="button"
        class="intro-skip-button"
        @click.stop="finishIntro"
      >
        Skip
      </button>

      <!-- Solid background with fade transition -->
      <div
        class="intro-background"
        :class="{ 'fade-out': fadeBackground }"
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
          <div
            class="signature-mask"
            :class="{ animate: animationStarted }"
          />
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

.intro-skip-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10001;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.intro-skip-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.intro-skip-button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.intro-background {
  position: absolute;
  inset: 0;
  background: #000000;
  transition: opacity 1s ease-out;
}

.intro-background.fade-out {
  opacity: 0;
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
