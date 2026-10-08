<script setup lang="ts">
// Off screen: the personal side, in Ailen's own words — dogs, photography,
// 3D printing, and an eye for design everywhere. Hovering a block shows a
// related photo as a polaroid that trails the cursor (tap on touch).
const items = [
  { key: 'dogs', icon: 'i-lucide-dog', photo: '/about/off/dogs.jpg' },
  // Placeholder photo until the per-topic ones arrive.
  { key: 'photo', icon: 'i-lucide-camera', photo: '/about/off/dogs.jpg' },
  { key: 'print', icon: 'i-lucide-box', photo: '/about/off/dogs.jpg' },
  { key: 'design', icon: 'i-lucide-eye', photo: '/about/off/dogs.jpg' }
] as const
type Item = typeof items[number]
const photos = [...new Set(items.map(i => i.photo))]
// The polaroid sits centered above the cursor, kept inside the section.
const CARD = 216
const GAP = 20

const section = ref<HTMLElement | null>(null)
const active = ref<Item | null>(null)
// Where the pointer is (target) and where the polaroid is (eased toward it).
const target = { x: 0, y: 0 }
const pos = reactive({ x: 0, y: 0, tilt: 0 })
const width = ref(0)
const x = computed(() => Math.min(Math.max(pos.x, CARD / 2), Math.max(CARD / 2, width.value - CARD / 2)))
let raf = 0
let still = false

const local = (e: PointerEvent) => {
  const r = section.value!.getBoundingClientRect()
  width.value = r.width
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

const follow = () => {
  const dx = target.x - pos.x
  pos.x += dx * 0.16
  pos.y += (target.y - pos.y) * 0.16
  // Lean into horizontal movement, settle back to a slight resting angle.
  pos.tilt += (Math.max(-12, Math.min(12, dx * 0.08)) - 3 - pos.tilt) * 0.12
  raf = requestAnimationFrame(follow)
}

function show(item: Item, e: PointerEvent) {
  if (!('photo' in item)) return
  const p = local(e)
  target.x = p.x
  target.y = p.y
  if (!active.value) {
    pos.x = p.x
    pos.y = p.y
    pos.tilt = -3
  }
  active.value = item
  cancelAnimationFrame(raf)
  if (!still) raf = requestAnimationFrame(follow)
}

function onEnter(item: Item, e: PointerEvent) {
  if (e.pointerType === 'mouse') show(item, e)
}
function onMove(item: Item, e: PointerEvent) {
  if (e.pointerType !== 'mouse' || active.value !== item) return
  const p = local(e)
  target.x = p.x
  target.y = p.y
  if (still) Object.assign(pos, p)
}
function onLeave(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  active.value = null
  cancelAnimationFrame(raf)
}
// Touch: tap a block to show its photo, tap again (or another block) to hide.
function onTap(item: Item, e: PointerEvent) {
  if (e.pointerType === 'mouse') return
  if (active.value === item) active.value = null
  else show(item, e)
}

onMounted(() => {
  still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section
    ref="section"
    class="relative max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 pb-24 sm:pb-32"
  >
    <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
      {{ $t('about.offScreen.heading') }}
    </h2>
    <ul class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <li
        v-for="item in items"
        :key="item.key"
        class="border-t border-hairline pt-6"
        @pointerenter="onEnter(item, $event)"
        @pointermove="onMove(item, $event)"
        @pointerleave="onLeave"
        @pointerup="onTap(item, $event)"
      >
        <HalftoneReveal>
          <UIcon
            :name="item.icon"
            class="size-5 text-label"
          />
          <h3 class="mt-4 font-display font-normal text-2xl leading-tight text-ink dark:text-paper">
            {{ $t(`about.offScreen.${item.key}.title`) }}
          </h3>
          <p class="mt-3 text-body leading-relaxed">
            {{ $t(`about.offScreen.${item.key}.body`) }}
          </p>
        </HalftoneReveal>
      </li>
    </ul>

    <!-- Polaroid that trails the pointer; decorative, the text says it all -->
    <div
      class="pointer-events-none absolute left-0 top-0 z-20"
      :style="{ transform: `translate3d(${x}px, ${pos.y - GAP}px, 0)` }"
      aria-hidden="true"
    >
      <Transition name="polaroid">
        <figure
          v-if="active && 'photo' in active"
          :key="active.key"
          class="polaroid"
          :style="{ '--tilt': `${pos.tilt}deg` }"
        >
          <NuxtImg
            :src="active.photo"
            alt=""
            width="440"
            height="550"
            fit="cover"
            class="block w-full aspect-[4/5] object-cover"
          />
        </figure>
      </Transition>
    </div>
    <!-- Preload so the first hover shows the photo right away -->
    <NuxtImg
      v-for="src in photos"
      :key="src"
      :src="src"
      alt=""
      width="440"
      height="550"
      fit="cover"
      loading="eager"
      class="hidden"
    />
  </section>
</template>

<style scoped>
.polaroid {
  width: 216px;
  padding: 0.6rem 0.6rem 2.6rem;
  background: #fbfaf7;
  border-radius: 3px;
  box-shadow:
    0 1px 1px rgb(18 18 18 / 0.08),
    0 12px 28px -8px rgb(18 18 18 / 0.35);
  /* Bottom edge just above the cursor, horizontally centered on it. */
  transform: translate(-50%, -100%) rotate(var(--tilt, -3deg));
  transform-origin: 50% 100%;
}
.polaroid-enter-active,
.polaroid-leave-active {
  transition: opacity 0.25s ease, scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), translate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
/* Rises up out of the cursor. */
.polaroid-enter-from,
.polaroid-leave-to {
  opacity: 0;
  scale: 0.85;
  translate: 0 16px;
}
@media (prefers-reduced-motion: reduce) {
  .polaroid-enter-active,
  .polaroid-leave-active {
    transition: opacity 0.15s ease;
  }
  .polaroid-enter-from,
  .polaroid-leave-to {
    scale: 1;
    translate: none;
  }
}
</style>
