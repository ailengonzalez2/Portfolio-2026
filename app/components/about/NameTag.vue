<script setup lang="ts">
import { tween } from '~/webgl/loop'

// The name tag on its lanyard. It drops in, the portrait assembles from
// particles, then it behaves like a real badge: a damped spring pendulum that
// reacts to the cursor, can be dragged and released, and flips (click / tap)
// to a back side with quick facts. Reduced motion: a still badge that flips.
const { global } = useAppConfig()
const fx = useFxEnabled()

// Card and portrait positions inside the original 1032×1471 artwork (%).
const CARD = { left: 28.876, top: 48.131, width: 44.961, height: 48.946 }
const PHOTO = { left: 14.87, top: 19.03, width: 72.2, height: 38.6 }
const PIVOT_Y = 0.11 // where the strap loop hangs, as a fraction of height

const root = ref<HTMLElement | null>(null)
const angle = ref(0)
const flipped = ref(false)
const portrait = ref(0)
const physicsOn = ref(false)

let velocity = 0
let raf = 0
let last = 0
let dragging = false
let dragMoved = false
let dragStartX = 0
let lastDragAngle = 0
let lastDragTime = 0
let pointer = { x: 0, t: 0 }

const pivot = () => {
  const r = root.value?.getBoundingClientRect()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height * PIVOT_Y, r } : null
}

const step = (now: number) => {
  const dt = Math.min(0.05, (now - last) / 1000 || 0)
  last = now
  if (!dragging) {
    // Damped spring back to rest.
    velocity += (-38 * angle.value - 3.2 * velocity) * dt
    angle.value += velocity * dt
  }
  raf = requestAnimationFrame(step)
}

const onWindowPointer = (e: PointerEvent) => {
  const dtMs = e.timeStamp - pointer.t
  const vx = dtMs > 0 ? (e.clientX - pointer.x) / dtMs : 0
  pointer = { x: e.clientX, t: e.timeStamp }
  if (!physicsOn.value || dragging || e.pointerType !== 'mouse') return
  const p = pivot()
  if (!p) return
  const cx = p.r.left + p.r.width / 2
  const cy = p.r.top + p.r.height * 0.7
  if (Math.hypot(e.clientX - cx, e.clientY - cy) < 220) {
    // The cursor brushing past nudges the card.
    velocity += Math.max(-60, Math.min(60, vx * 40))
  }
}

const onDown = (e: PointerEvent) => {
  if ((e.target as HTMLElement).closest('a')) return
  dragging = physicsOn.value
  dragMoved = false
  dragStartX = e.clientX
  lastDragAngle = angle.value
  lastDragTime = e.timeStamp
  if (dragging) root.value?.setPointerCapture(e.pointerId)
}

const onMove = (e: PointerEvent) => {
  if (!dragging) return
  if (Math.abs(e.clientX - dragStartX) > 5) dragMoved = true
  const p = pivot()
  if (!p) return
  const deg = Math.atan2(e.clientX - p.x, Math.max(40, e.clientY - p.y)) * 180 / Math.PI
  const next = Math.max(-55, Math.min(55, -deg))
  const dt = (e.timeStamp - lastDragTime) / 1000
  if (dt > 0) velocity = (next - lastDragAngle) / dt
  lastDragAngle = next
  lastDragTime = e.timeStamp
  angle.value = next
}

const onUp = (e: PointerEvent) => {
  if (dragging) root.value?.releasePointerCapture(e.pointerId)
  const wasDrag = dragging && dragMoved
  dragging = false
  if (!wasDrag && !(e.target as HTMLElement).closest('a')) flipped.value = !flipped.value
}

onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    portrait.value = 1
    return
  }
  window.addEventListener('pointermove', onWindowPointer, { passive: true })
  // Let the drop-in finish, assemble the portrait, then hand over to physics.
  await new Promise(resolve => setTimeout(resolve, 1200))
  await tween(0, 1, fx.value ? 1800 : 0, (v) => {
    portrait.value = v
  })
  angle.value = -9
  velocity = 0
  last = performance.now()
  physicsOn.value = true
  raf = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onWindowPointer)
})
</script>

<template>
  <div class="name-tag-drop">
    <div
      ref="root"
      class="relative select-none touch-pan-y cursor-grab active:cursor-grabbing focus-visible:outline-offset-4"
      role="button"
      tabindex="0"
      :aria-label="$t('about.badge.flip')"
      :aria-pressed="flipped"
      :style="{ aspectRatio: '1032 / 1471', transform: `rotate(${angle}deg)`, transformOrigin: `50% ${PIVOT_Y * 100}%` }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @keydown.enter.prevent="flipped = !flipped"
      @keydown.space.prevent="flipped = !flipped"
    >
      <img
        src="/about/name-tag-strap.png"
        alt=""
        draggable="false"
        class="absolute inset-0 size-full pointer-events-none"
      >

      <div
        class="absolute [perspective:900px]"
        :style="{ left: `${CARD.left}%`, top: `${CARD.top}%`, width: `${CARD.width}%`, height: `${CARD.height}%` }"
      >
        <div
          class="flipper relative size-full"
          :class="{ 'is-flipped': flipped }"
        >
          <!-- Front: the card with the portrait assembling from particles -->
          <div class="face absolute inset-0">
            <img
              src="/about/name-tag-card.png"
              alt="Ailen Gonzalez"
              draggable="false"
              class="absolute inset-0 size-full pointer-events-none"
            >
            <div
              class="absolute overflow-hidden rounded-[3px]"
              :style="{ left: `${PHOTO.left}%`, top: `${PHOTO.top}%`, width: `${PHOTO.width}%`, height: `${PHOTO.height}%` }"
            >
              <ResolveImage
                src="/about/portrait.jpg"
                alt=""
                :progress="portrait"
                sizes="200px"
                eager
                class="size-full"
              />
            </div>
          </div>

          <!-- Back: quick facts -->
          <div class="face back absolute inset-0 rounded-[6px] bg-paper border border-hairline shadow-sm flex flex-col justify-between p-[10%] text-ink [container-type:inline-size]">
            <img
              src="/signature.png"
              alt=""
              draggable="false"
              class="w-1/2 h-auto pointer-events-none"
            >
            <ul class="space-y-[0.5em] font-mono text-[6.5cqw] uppercase tracking-[0.06em] leading-tight text-label">
              <li>{{ $t('about.badge.based') }}</li>
              <li>{{ $t('about.badge.remote') }}</li>
              <li>{{ $t('about.badge.languages') }}</li>
              <li
                v-if="global.available"
                class="text-ink"
              >
                ● {{ $t('about.badge.available') }}
              </li>
            </ul>
            <a
              :href="global.meetingLink"
              target="_blank"
              rel="noopener"
              data-umami-event="book-call"
              data-umami-event-location="about-badge"
              class="font-mono text-[6.5cqw] uppercase tracking-[0.06em] leading-tight underline underline-offset-2"
            >
              {{ $t('about.badge.bookCall') }} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-label">
      {{ $t('about.badge.hint') }}
    </p>
  </div>
</template>

<style scoped>
.name-tag-drop {
  animation: nameTagDrop 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

@keyframes nameTagDrop {
  from { opacity: 0; transform: translateY(-420px); }
  to { opacity: 1; transform: translateY(0); }
}

.flipper {
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.flipper.is-flipped {
  transform: rotateY(180deg);
}

.face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.face.back {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .name-tag-drop { animation: none; }
}
</style>
