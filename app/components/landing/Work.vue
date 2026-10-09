<script setup lang="ts">
import type { Project } from '~/data/projects'
import { getFeaturedProjects } from '~/data/selectors'

const localePath = useLocalePath()
const allProjects = useProjects()
const featured = computed(() => getFeaturedProjects(allProjects.value))
const fx = useFxEnabled()

const linkFor = (p: Project) => p.caseStudy
  ? { to: localePath(`/projects/${p.id}`), external: false }
  : { to: p.links.preview ?? localePath('/projects'), external: true }
</script>

<template>
  <section
    id="work"
    class="relative py-24 sm:py-32"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
        {{ $t('work.eyebrow') }}
      </h2>

      <article
        v-for="(p, i) in featured"
        :key="p.id"
        class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-0 lg:pb-[16vh] lg:min-h-[120vh] items-start"
      >
        <div class="lg:col-span-7 lg:sticky lg:top-28">
          <ResolveImage
            :src="p.image"
            :alt="p.title"
            :latent-src="p.latentImage"
            latent
            sizes="100vw lg:60vw"
            class="w-full aspect-[4/3]"
          />
          <p
            v-if="fx"
            class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-label"
          >
            {{ $t('work.latentHint') }}
          </p>
        </div>

        <HalftoneReveal class="lg:col-span-5 lg:pt-[30vh]">
          <p class="font-mono text-xs text-label">
            {{ String(i + 1).padStart(2, '0') }} — {{ p.date }}
          </p>
          <h3 class="mt-4 font-display font-normal text-4xl sm:text-5xl leading-[0.95] tracking-[-0.01em] text-ink dark:text-paper">
            {{ p.title }}
          </h3>
          <p class="mt-6 text-lg text-body">
            {{ p.description }}
          </p>
          <ul class="mt-6 flex flex-wrap gap-2">
            <li
              v-for="tag in p.tags"
              :key="tag"
              class="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-hairline rounded-full text-label"
            >
              {{ tag }}
            </li>
          </ul>
          <NuxtLink
            :to="linkFor(p).to"
            :target="linkFor(p).external ? '_blank' : undefined"
            :rel="linkFor(p).external ? 'noopener' : undefined"
            class="mt-10 inline-flex items-center gap-2 font-medium text-ink dark:text-paper underline underline-offset-4 decoration-hairline hover:decoration-current transition-colors"
          >
            {{ p.caseStudy ? $t('work.caseStudy') : $t('work.visit') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </NuxtLink>
        </HalftoneReveal>
      </article>

      <div class="mt-16 lg:mt-24">
        <NuxtLink
          :to="localePath('/projects')"
          data-umami-event="view-work"
          data-umami-event-location="work"
          class="btn-gradient inline-flex"
        >
          {{ $t('work.all') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
