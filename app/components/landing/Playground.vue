<script setup lang="ts">
import { projects } from '~/data/projects'

// "Play with my animations": the interactive experiments on a horizontal
// shelf. Each frame loops its preview video while on screen (the cover image
// stands in until a video exists); "Play" opens the live piece.
const items = projects.filter(p => p.playable)
const localePath = useLocalePath()

const rail = ref<HTMLElement | null>(null)
const canPrev = ref(false)
const canNext = ref(true)
// Arrows only when the shelf actually overflows (two pieces fit side by side).
const scrollable = ref(false)
const updateArrows = () => {
  const el = rail.value
  if (!el) return
  scrollable.value = el.scrollWidth - el.clientWidth > 4
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
// One card per click, so the arrows step through the shelf.
const page = (dir: 1 | -1) => {
  const el = rail.value
  const card = el?.querySelector('li')
  if (!el || !card) return
  el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 32), behavior: 'smooth' })
}

// Videos play only while visible (and never with reduced motion).
let observer: IntersectionObserver | undefined
onMounted(() => {
  updateArrows()
  window.addEventListener('resize', updateArrows)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }
  }, { threshold: 0.4 })
  rail.value?.querySelectorAll('video').forEach(v => observer!.observe(v))
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateArrows)
})
</script>

<template>
  <section
    id="lab"
    class="bg-ink text-paper py-24 sm:py-32 overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-2xl">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60">
            {{ $t('lab.eyebrow') }}
          </p>
          <h2 class="mt-4 font-display font-normal text-4xl sm:text-6xl leading-[0.98] tracking-[-0.02em]">
            {{ $t('lab.title') }}
          </h2>
          <p class="mt-6 text-lg text-paper/70">
            {{ $t('lab.intro') }}
          </p>
        </div>
        <div
          v-if="scrollable"
          class="flex gap-2"
        >
          <button
            type="button"
            class="rail-arrow"
            :disabled="!canPrev"
            :aria-label="$t('lab.prev')"
            @click="page(-1)"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="size-5"
            />
          </button>
          <button
            type="button"
            class="rail-arrow"
            :disabled="!canNext"
            :aria-label="$t('lab.next')"
            @click="page(1)"
          >
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- The shelf: scrolls sideways, snaps to each piece, bleeds off the right edge -->
    <ul
      ref="rail"
      class="rail mt-14 sm:mt-16 flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4"
      @scroll.passive="updateArrows"
    >
      <li
        v-for="p in items"
        :key="p.id"
        class="snap-start shrink-0 w-[82vw] sm:w-[60vw] lg:w-[calc((min(100vw,80rem)-6rem)/2)]"
      >
        <a
          :href="p.links.preview"
          target="_blank"
          rel="noopener"
          class="group block"
          data-umami-event="play-animation"
          :data-umami-event-project="p.id"
        >
          <div class="relative aspect-[16/10] overflow-hidden rounded-md bg-paper/5">
            <video
              v-if="p.video"
              :src="p.video"
              :poster="p.image"
              muted
              loop
              playsinline
              preload="metadata"
              class="size-full object-cover"
            />
            <NuxtImg
              v-else
              :src="p.image"
              :alt="p.title"
              sizes="82vw sm:60vw lg:44vw"
              loading="lazy"
              class="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </a>
        <div class="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 class="font-display font-normal text-2xl sm:text-3xl leading-tight">
              {{ p.title.split(' — ')[0] }}
            </h3>
            <p class="mt-1 text-sm text-paper/60">
              {{ p.labTag }}
            </p>
          </div>
          <a
            :href="p.links.preview"
            target="_blank"
            rel="noopener"
            class="play-link shrink-0"
            data-umami-event="play-animation"
            :data-umami-event-project="p.id"
          >
            {{ $t('lab.play') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </a>
        </div>
      </li>
    </ul>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink
        :to="localePath('/projects#lab')"
        class="mt-14 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/70 hover:text-paper transition-colors"
      >
        {{ $t('lab.seeAll') }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
/* Shelf starts aligned with the page content and runs off the right edge. */
.rail {
  padding-left: max(1rem, calc((100vw - 80rem) / 2 + 2rem));
  scroll-padding-left: max(1rem, calc((100vw - 80rem) / 2 + 2rem));
  padding-right: 2rem;
  scrollbar-width: none;
}
.rail::-webkit-scrollbar {
  display: none;
}
.rail-arrow {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  border: 1px solid rgb(242 239 233 / 0.25);
  transition: background-color 0.2s, opacity 0.2s, border-color 0.2s;
  cursor: pointer;
}
.rail-arrow:hover:not(:disabled) {
  background: rgb(242 239 233 / 0.1);
  border-color: rgb(242 239 233 / 0.5);
}
.rail-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}
.play-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #2B3BFF, #C04BFF);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  transition: filter 0.2s;
}
.play-link:hover {
  filter: brightness(1.12);
}
.play-link:focus-visible,
.rail-arrow:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}
</style>
