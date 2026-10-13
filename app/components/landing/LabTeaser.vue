<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'

// A single dark "playground" band on the landing page, placed between the
// hook and the services banner. Client work keeps its own grid further down;
// the lab gets one wide teaser so the fun side of the portfolio is visible
// without competing with it.
const localePath = useLocalePath()
const motion = usePreferredReducedMotion()
const reduced = computed(() => motion.value === 'reduce')
const projects = useProjects()

const loft = computed(() => projects.value.find(p => p.id === 'loft-3d'))
const jelly = computed(() => projects.value.find(p => p.id === 'jelly'))

const loftLink = computed(() => loft.value?.links.preview ?? localePath('/projects#lab'))
const jellyLink = computed(() => jelly.value?.links.preview ?? localePath('/projects#lab'))

// Served straight from /public — bound at runtime so Vite doesn't try to
// resolve them as imports.
const loftVideo = {
  poster: '/projects/lab/loft-poster.jpg',
  webm: '/projects/lab/loft.webm',
  mp4: '/projects/lab/loft.mp4'
}

// Second row: two more experiments, each a muted looping screen recording.
// The cube gets the wide tile, mirroring the loft above.
const clips = computed(() => [
  { id: 'vinyl-room', key: 'vinyl', video: 'vinyl', wide: false },
  { id: 'project-cube', key: 'cube', video: 'cube', wide: true }
].map(c => ({
  ...c,
  link: projects.value.find(p => p.id === c.id)?.links.preview ?? localePath('/projects#lab'),
  poster: `/projects/lab/${c.video}-poster.jpg`,
  webm: `/projects/lab/${c.video}.webm`,
  mp4: `/projects/lab/${c.video}.mp4`
})))

// The clips sit far below the fold: nothing downloads until one comes into
// view, and each one only plays while it's on screen.
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
onMounted(() => {
  if (!root.value || reduced.value || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const video = target as HTMLVideoElement
      if (isIntersecting) video.play().catch(() => {})
      else video.pause()
    }
  }, { rootMargin: '200px 0px' })
  root.value.querySelectorAll('video').forEach(v => observer!.observe(v))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <Reveal
    :y="24"
    :delay="0.1"
  >
    <div
      ref="root"
      class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 rounded-3xl bg-neutral-950 p-3 sm:p-4 text-white"
    >
      <!-- Loft: the hero of the band. Muted looping video, whole tile is the link. -->
      <NuxtLink
        :to="loftLink"
        target="_blank"
        rel="noopener"
        :aria-label="$t('projects.labTeaser.cta')"
        class="group relative md:col-span-2 block overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3] md:aspect-auto md:min-h-[400px]"
      >
        <video
          class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          muted
          loop
          playsinline
          preload="none"
          :poster="loftVideo.poster"
        >
          <source
            :src="loftVideo.webm"
            type="video/webm"
          >
          <source
            :src="loftVideo.mp4"
            type="video/mp4"
          >
        </video>

        <!-- Legibility scrim -->
        <div class="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col items-start gap-4">
          <span class="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-300">
            {{ $t('projects.labTeaser.eyebrow') }}
          </span>
          <h3 class="max-w-md font-display font-medium text-3xl sm:text-4xl lg:text-5xl leading-[0.98] tracking-[-0.04em]">
            {{ $t('projects.labTeaser.title') }}
          </h3>
          <span class="inline-flex items-center gap-2 rounded-(--radius-btn) bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors group-hover:bg-secondary">
            {{ $t('projects.labTeaser.cta') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </span>
        </div>
      </NuxtLink>

      <!-- Right column: Jelly tile + link to the full lab -->
      <div class="flex flex-col gap-3 sm:gap-4">
        <NuxtLink
          :to="jellyLink"
          target="_blank"
          rel="noopener"
          :aria-label="jelly?.title"
          class="group relative flex-1 block overflow-hidden rounded-2xl bg-[#071120] aspect-[4/3] md:aspect-auto md:min-h-[280px]"
        >
          <img
            src="/projects/lab/jelly-tile.jpg"
            alt=""
            class="lab-jelly absolute inset-0 size-full object-cover"
          >
          <div class="absolute inset-0 bg-linear-to-t from-[#071120]/90 via-transparent to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1">
            <span class="font-display font-medium text-2xl sm:text-3xl leading-none tracking-[-0.03em] text-pink-200">
              {{ $t('projects.labTeaser.jellyCaption') }}
            </span>
            <span class="text-xs text-neutral-400">
              {{ $t('projects.labTeaser.jellyName') }}
            </span>
          </div>
        </NuxtLink>

        <NuxtLink
          :to="localePath('/projects#lab')"
          class="group/lab hidden md:flex items-center justify-between rounded-2xl border border-neutral-800 px-5 py-4 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:text-white"
        >
          {{ $t('projects.labTeaser.seeLab') }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover/lab:translate-x-1"
          />
        </NuxtLink>
      </div>

      <NuxtLink
        v-for="c in clips"
        :key="c.id"
        :to="c.link"
        target="_blank"
        rel="noopener"
        :aria-label="$t(`projects.labTeaser.${c.key}Name`)"
        class="group relative block overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3] md:aspect-auto md:min-h-[300px]"
        :class="c.wide ? 'md:col-span-2' : ''"
      >
        <video
          class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          muted
          loop
          playsinline
          preload="none"
          :poster="c.poster"
        >
          <source
            :src="c.webm"
            type="video/webm"
          >
          <source
            :src="c.mp4"
            type="video/mp4"
          >
        </video>
        <div class="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-transparent to-transparent" />
        <div class="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1">
          <span class="font-display font-medium text-2xl sm:text-3xl leading-none tracking-[-0.03em] text-white">
            {{ $t(`projects.labTeaser.${c.key}Caption`) }}
          </span>
          <span class="text-xs text-neutral-300">
            {{ $t(`projects.labTeaser.${c.key}Name`) }}
          </span>
        </div>
      </NuxtLink>

      <!-- Phones: the link to the whole lab comes after every tile -->
      <NuxtLink
        :to="localePath('/projects#lab')"
        class="group/lab flex md:hidden items-center justify-between rounded-2xl border border-neutral-800 px-5 py-4 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:text-white"
      >
        {{ $t('projects.labTeaser.seeLab') }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 transition-transform group-hover/lab:translate-x-1"
        />
      </NuxtLink>
    </div>
  </Reveal>
</template>

<style scoped>
/* The starfish "squishes" on hover — a nod to the real thing, without
   loading WebGPU on the landing page. */
@keyframes lab-squish {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.08, 0.94); }
  55% { transform: scale(0.96, 1.05); }
  75% { transform: scale(1.03, 0.98); }
  100% { transform: scale(1, 1); }
}

.lab-jelly {
  transform-origin: 50% 60%;
}

@media (prefers-reduced-motion: no-preference) {
  .group:hover .lab-jelly {
    animation: lab-squish 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
}
</style>
