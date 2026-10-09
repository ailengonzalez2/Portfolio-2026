<script setup lang="ts">
import type { Project } from '~/data/projects'

// "Play with my animations": light interactive pieces embedded live, so you
// play right on the page. A piece only runs while its frame is near the
// viewport (and is unloaded when far away, to free the GPU), on desktop, and
// — when it needs it — with WebGPU. Elsewhere it's the cover/video and
// "Play" opens it in a new tab. Heavier experiments live in the Lab below.
const allProjects = useProjects()
const items = computed(() => allProjects.value.filter(p => p.playable))
const localePath = useLocalePath()
const notesKey = (p: Project) => p.id.replace(/-/g, '')

const canEmbed = ref<Record<string, boolean>>({})
const live = ref<Record<string, boolean>>({})
const loaded = ref<Record<string, boolean>>({})

let observer: IntersectionObserver | undefined
onMounted(() => {
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  for (const p of items.value) canEmbed.value[p.id] = desktop && !still && (!p.webgpu || 'gpu' in navigator)
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const id = (e.target as HTMLElement).dataset.id!
      if (!canEmbed.value[id]) continue
      live.value[id] = e.isIntersecting
      if (!e.isIntersecting) loaded.value[id] = false
    }
  }, { rootMargin: '300px 0px' })
  document.querySelectorAll<HTMLElement>('#play [data-id]').forEach(el => observer!.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section
    id="play"
    class="bg-ink text-paper py-24 sm:py-32"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <article
        v-for="p in items"
        :key="p.id"
        class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
      >
        <!-- The piece itself: live where it can run, the cover elsewhere -->
        <div
          :data-id="p.id"
          class="order-2 lg:order-1 lg:col-span-8 relative aspect-[16/10] overflow-hidden rounded-lg bg-black"
        >
          <video
            v-if="p.video"
            :src="p.video"
            :poster="p.image"
            muted
            loop
            autoplay
            playsinline
            class="absolute inset-0 size-full object-cover transition-opacity duration-500"
            :class="{ 'opacity-0': loaded[p.id] }"
          />
          <NuxtImg
            v-else
            :src="p.image"
            :alt="p.title"
            sizes="100vw lg:66vw"
            loading="lazy"
            class="absolute inset-0 size-full object-cover transition-opacity duration-500"
            :class="{ 'opacity-0': loaded[p.id] }"
          />
          <iframe
            v-if="live[p.id] && p.links.preview"
            :src="p.links.preview"
            :title="p.title"
            allow="fullscreen; gamepad"
            scrolling="no"
            class="absolute inset-0 size-full border-0 transition-opacity duration-500"
            :class="loaded[p.id] ? 'opacity-100' : 'opacity-0'"
            @load="loaded[p.id] = true"
          />
          <p
            v-if="live[p.id] && !loaded[p.id]"
            class="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-[0.18em] text-paper/80 pointer-events-none"
          >
            {{ $t('play.loading') }}
          </p>
          <!-- Where it can't run inline: a clear way to open it -->
          <a
            v-if="!canEmbed[p.id]"
            :href="p.links.preview"
            target="_blank"
            rel="noopener"
            class="absolute inset-0 grid place-items-center"
            data-umami-event="play-animation"
            :data-umami-event-project="p.id"
          >
            <span class="play-link">
              {{ $t('play.play') }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </span>
          </a>
        </div>

        <div class="order-1 lg:order-2 lg:col-span-4">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60">
            {{ $t('play.eyebrow') }}
          </p>
          <h2 class="mt-4 font-display font-normal text-4xl sm:text-5xl leading-[0.98] tracking-[-0.02em]">
            {{ $t('play.title') }}
          </h2>
          <p class="mt-6 text-lg text-paper/70">
            {{ $t('play.intro') }}
          </p>

          <div class="mt-10 border-t border-paper/15 pt-5">
            <h3 class="font-display font-normal text-2xl">
              {{ p.title.split(' — ')[0] }}
            </h3>
            <p class="mt-1 text-sm text-paper/60">
              {{ p.labTag }}
            </p>
            <details class="made mt-4">
              <summary class="flex items-center gap-2 text-sm text-paper/70 hover:text-paper cursor-pointer select-none">
                <UIcon
                  name="i-lucide-plus"
                  class="made-icon size-4"
                />
                {{ $t('play.howItsMade') }}
              </summary>
              <ul class="mt-3 space-y-2 text-sm text-paper/75 leading-relaxed">
                <li
                  v-for="n in ['a', 'b', 'c']"
                  :key="n"
                  class="flex gap-3"
                >
                  <span class="mt-2 size-1 shrink-0 rounded-full bg-paper/50" />
                  {{ $t(`play.notes.${notesKey(p)}.${n}`) }}
                </li>
              </ul>
            </details>
          </div>

          <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              v-if="p.links.preview"
              :href="p.links.preview"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper underline underline-offset-4 decoration-paper/30 hover:decoration-paper transition-colors"
            >
              {{ $t('play.newTab') }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </a>
            <NuxtLink
              :to="localePath('/projects#lab')"
              class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/70 hover:text-paper transition-colors"
            >
              {{ $t('play.seeAll') }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4"
              />
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.play-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.4rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #2B3BFF, #C04BFF);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 10px 30px -10px rgb(43 59 255 / 0.6);
}
.made summary {
  list-style: none;
}
.made summary::-webkit-details-marker {
  display: none;
}
.made-icon {
  transition: transform 0.25s ease;
}
.made[open] .made-icon {
  transform: rotate(45deg);
}
.made summary:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
  border-radius: 2px;
}
</style>
