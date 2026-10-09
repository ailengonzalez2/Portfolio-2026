<script setup lang="ts">
// Off screen: the personal side, in Ailen's own words — dogs, photography,
// 3D printing, and an eye for design everywhere. Each block has its own
// polaroid pinned above it, half over the title; hover (or focus, or a tap on
// touch) sets it down. Angle, offset and size differ per block so they read
// as photos dropped on a table, not copies.
const items = [
  { key: 'dogs', icon: 'i-lucide-dog', photo: '/about/off/dogs.jpg', rot: -6, x: '4%', w: '11.5rem' },
  // Placeholder photos until the per-topic ones arrive.
  { key: 'photo', icon: 'i-lucide-camera', photo: '/about/off/dogs.jpg', rot: 4, x: '34%', w: '10rem' },
  { key: 'print', icon: 'i-lucide-box', photo: '/about/off/dogs.jpg', rot: -2.5, x: '18%', w: '12rem' },
  { key: 'design', icon: 'i-lucide-eye', photo: '/about/off/dogs.jpg', rot: 7, x: '26%', w: '10.5rem' }
] as const

// Touch has no hover: a tap opens a block's photo, another tap closes it.
const open = ref<string | null>(null)
function onTap(key: string, e: PointerEvent) {
  if (e.pointerType === 'mouse') return
  open.value = open.value === key ? null : key
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 pb-24 sm:pb-32">
    <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
      {{ $t('about.offScreen.heading') }}
    </h2>
    <ul class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <li
        v-for="item in items"
        :key="item.key"
        class="off-item relative border-t border-hairline pt-6 outline-none"
        :class="{ 'is-open': open === item.key }"
        :style="{ '--rot': `${item.rot}deg`, '--x': item.x, '--w': item.w }"
        tabindex="0"
        @pointerup="onTap(item.key, $event)"
      >
        <!-- Decorative: the text below says what the photo shows -->
        <figure
          class="polaroid"
          aria-hidden="true"
        >
          <NuxtImg
            :src="item.photo"
            alt=""
            width="400"
            height="500"
            fit="cover"
            loading="lazy"
            class="block w-full aspect-[4/5] object-cover"
          />
        </figure>
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
  </section>
</template>

<style scoped>
.off-item:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 6px;
  border-radius: 2px;
}

/* Bottom edge sits about halfway down the title. */
.polaroid {
  position: absolute;
  z-index: 20;
  left: var(--x);
  bottom: calc(100% - 5.25rem);
  width: var(--w);
  padding: 0.55rem 0.55rem 2.4rem;
  background: #fbfaf7;
  border-radius: 3px;
  box-shadow:
    0 1px 1px rgb(18 18 18 / 0.08),
    0 14px 30px -10px rgb(18 18 18 / 0.4);
  pointer-events: none;
  opacity: 0;
  transform: translateY(14px) rotate(calc(var(--rot) + 5deg)) scale(0.9);
  transform-origin: 50% 100%;
  transition:
    opacity 0.2s ease,
    transform 0.4s cubic-bezier(0.2, 0.9, 0.25, 1.15);
}
.off-item:hover .polaroid,
.off-item:focus-visible .polaroid,
.off-item.is-open .polaroid {
  opacity: 1;
  transform: translateY(0) rotate(var(--rot)) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .polaroid {
    transform: rotate(var(--rot));
    transition: opacity 0.15s ease;
  }
}
</style>
