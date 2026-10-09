<script setup lang="ts">
import { projects } from '~/data/projects'

definePageMeta({ colorMode: 'light' })

const route = useRoute()
const localizedTo = useLocalizedTo()
const id = computed(() => route.params.id as string)

const project = computed(() => projects.find(p => p.id === id.value))

// If the project doesn't exist, send back to the index.
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const seo = computed(() => ({
  title: project.value!.title,
  description: project.value!.caseStudy?.tagline || project.value!.description
}))

useSeoMeta({
  title: () => seo.value.title,
  ogTitle: () => `${seo.value.title} — Ailen Gonzalez`,
  description: () => seo.value.description,
  ogDescription: () => seo.value.description,
  ogImage: () => project.value!.image
})

const cs = computed(() => project.value!.caseStudy)
const localePath = useLocalePath()
const linkFor = (p: typeof projects[number]) => p.caseStudy
  ? { to: localePath(`/projects/${p.id}`), external: false }
  : { to: p.links.preview ?? localePath('/projects'), external: true }

// The story as numbered chapters: it is a sequence, so the numbers are real.
const chapters = computed(() => cs.value
  ? [
      { key: 'problem', body: cs.value.problem, points: [] as string[] },
      { key: 'approach', body: cs.value.approach, points: cs.value.highlights ?? [] },
      { key: 'result', body: cs.value.result, points: cs.value.outcomes ?? [] }
    ]
  : [])

// Three other projects at the bottom, of the same kind, so each audience
// stays on its own track.
const related = computed(() =>
  projects
    .filter(p => p.id !== id.value && p.kind === project.value?.kind)
    .slice(0, 3)
)
</script>

<template>
  <UPage>
    <article class="pt-32 sm:pt-44 pb-24 sm:pb-32">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <NuxtLink
          :to="localizedTo('/projects')"
          class="inline-flex items-center gap-2 text-sm text-label hover:text-ink transition-colors"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-4"
          />
          {{ $t('projects.caseStudy.back') }}
        </NuxtLink>

        <!-- Header -->
        <ResolveText
          :text="project!.title"
          tag="h1"
          on="load"
          class="mt-10 max-w-[16em] text-balance font-display font-normal text-5xl sm:text-7xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-paper"
        />
        <p class="mt-8 max-w-2xl text-lg sm:text-xl text-body leading-relaxed">
          {{ cs?.tagline || project!.description }}
        </p>

        <!-- Facts strip -->
        <dl class="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-y border-hairline py-6">
          <div v-if="cs?.role">
            <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
              {{ $t('projects.caseStudy.role') }}
            </dt>
            <dd class="mt-2 text-ink dark:text-paper">
              {{ cs.role }}
            </dd>
          </div>
          <div v-if="cs?.client">
            <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
              {{ $t('projects.caseStudy.client') }}
            </dt>
            <dd class="mt-2 text-ink dark:text-paper">
              {{ cs.client }}
            </dd>
          </div>
          <div>
            <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
              {{ $t('projects.caseStudy.year') }}
            </dt>
            <dd class="mt-2 text-ink dark:text-paper">
              {{ project!.date }}
            </dd>
          </div>
          <div>
            <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
              {{ $t('projects.caseStudy.disciplines') }}
            </dt>
            <dd class="mt-2 text-ink dark:text-paper">
              {{ project!.tags.join(', ') }}
            </dd>
          </div>
        </dl>

        <!-- Real numbers, when the project has them -->
        <dl
          v-if="cs?.metrics?.length"
          class="mt-12 flex flex-wrap gap-x-16 gap-y-8"
        >
          <div
            v-for="metric in cs.metrics"
            :key="metric.label"
            class="flex flex-col-reverse gap-2"
          >
            <dt class="text-sm text-body">
              {{ metric.label }}
            </dt>
            <dd class="font-display font-normal text-5xl sm:text-6xl leading-none tracking-[-0.02em] btn-gradient-text pb-[0.08em]">
              {{ metric.value }}
            </dd>
          </div>
        </dl>

        <!-- Cover -->
        <div class="mt-14 overflow-hidden rounded-md aspect-[16/10] bg-surface">
          <NuxtImg
            :src="project!.image"
            :alt="project!.title"
            sizes="100vw lg:80vw"
            loading="eager"
            class="size-full object-cover"
          />
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <NuxtLink
            v-if="project!.links.preview"
            :to="project!.links.preview"
            target="_blank"
            class="btn-gradient inline-flex items-center gap-2"
          >
            {{ $t('projects.caseStudy.viewLive') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </NuxtLink>
          <NuxtLink
            v-if="project!.links.github"
            :to="project!.links.github"
            target="_blank"
            class="quiet-link"
          >
            <UIcon
              name="i-simple-icons-github"
              class="size-4"
            />
            {{ $t('projects.caseStudy.viewCode') }}
          </NuxtLink>
          <NuxtLink
            v-if="project!.links.figma"
            :to="project!.links.figma"
            target="_blank"
            class="quiet-link"
          >
            <UIcon
              name="i-simple-icons-figma"
              class="size-4"
            />
            {{ $t('projects.caseStudy.figma') }}
          </NuxtLink>
        </div>

        <!-- The story: problem → approach → result -->
        <template v-if="cs">
          <section
            v-for="(ch, i) in chapters"
            :key="ch.key"
            class="mt-20 sm:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 border-t border-hairline pt-8"
          >
            <div class="lg:col-span-4">
              <div class="lg:sticky lg:top-28">
                <p class="font-mono text-xs text-label">
                  {{ String(i + 1).padStart(2, '0') }}
                </p>
                <h2 class="mt-2 font-display font-normal text-3xl sm:text-4xl leading-tight text-ink dark:text-paper">
                  {{ $t(`projects.caseStudy.${ch.key}`) }}
                </h2>
              </div>
            </div>
            <div class="lg:col-span-8 max-w-2xl">
              <p class="text-lg sm:text-xl text-ink/85 dark:text-paper/85 leading-relaxed">
                {{ ch.body }}
              </p>
              <ul
                v-if="ch.points.length"
                class="mt-8 border-b border-hairline"
              >
                <li
                  v-for="point in ch.points"
                  :key="point"
                  class="border-t border-hairline py-4 text-body leading-relaxed"
                >
                  {{ point }}
                </li>
              </ul>
            </div>
          </section>

          <section class="mt-20 sm:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 border-t border-hairline pt-8">
            <h2 class="lg:col-span-4 font-mono text-xs uppercase tracking-[0.18em] text-label">
              {{ $t('projects.caseStudy.stack') }}
            </h2>
            <p class="lg:col-span-8 max-w-2xl text-lg text-ink dark:text-paper leading-relaxed">
              {{ cs.stack.join(' · ') }}
            </p>
          </section>
        </template>

        <!-- No full case study yet: a clean overview -->
        <section
          v-else
          class="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 border-t border-hairline pt-8"
        >
          <h2 class="lg:col-span-4 font-display font-normal text-3xl text-ink dark:text-paper">
            {{ $t('projects.caseStudy.overview') }}
          </h2>
          <div class="lg:col-span-8 max-w-2xl">
            <p class="text-lg sm:text-xl text-ink/85 leading-relaxed">
              {{ project!.description }}
            </p>
            <p class="mt-4 text-sm text-label leading-relaxed">
              {{ $t('projects.caseStudy.comingSoonBody') }}
            </p>
          </div>
        </section>

        <!-- Close -->
        <section class="mt-24 sm:mt-32 border-t border-hairline pt-12 flex flex-wrap items-end justify-between gap-8">
          <p class="max-w-xl font-display font-normal text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em] text-ink dark:text-paper">
            {{ $t('projects.caseStudy.ctaText') }}
          </p>
          <NuxtLink
            :to="localizedTo('/#contact')"
            class="btn-gradient inline-flex items-center gap-2"
          >
            {{ $t('projects.caseStudy.ctaButton') }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </NuxtLink>
        </section>

        <!-- More projects: same rows and hover as the blog index -->
        <section
          v-if="related.length"
          class="mt-24 sm:mt-32"
        >
          <h2 class="font-mono text-xs uppercase tracking-[0.18em] text-label">
            {{ $t('projects.caseStudy.relatedProjects') }}
          </h2>
          <ol class="rows mt-8 border-b border-hairline">
            <li
              v-for="item in related"
              :key="item.id"
            >
              <NuxtLink
                :to="linkFor(item).to"
                :target="linkFor(item).external ? '_blank' : undefined"
                class="row group"
              >
                <p class="text-sm text-label">
                  {{ item.date }}
                </p>
                <div>
                  <h3 class="font-display font-normal text-2xl sm:text-3xl leading-tight text-ink dark:text-paper">
                    {{ item.title }}
                  </h3>
                  <p class="mt-2 max-w-xl text-body leading-relaxed line-clamp-2">
                    {{ item.description }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="row-arrow hidden sm:block size-5 text-ink dark:text-paper"
                />
              </NuxtLink>
            </li>
          </ol>
        </section>
      </div>
    </article>
  </UPage>
</template>

<style scoped>
.quiet-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-ink);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--color-hairline);
  transition: text-decoration-color 0.2s;
}
.quiet-link:hover {
  text-decoration-color: currentColor;
}
.row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 2rem 0 2.25rem;
  border-top: 1px solid var(--color-hairline);
  transition: opacity 0.3s ease;
}
@media (min-width: 640px) {
  .row {
    grid-template-columns: 10rem 1fr auto;
    gap: 2.5rem;
  }
}
.row:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 4px;
}
.row::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2B3BFF, #7643FF 50%, #C04BFF);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.row-arrow {
  opacity: 0;
  translate: -6px 6px;
  transition: opacity 0.3s ease, translate 0.3s ease;
}
.row:hover::before,
.row:focus-visible::before {
  transform: scaleX(1);
}
.row:hover .row-arrow,
.row:focus-visible .row-arrow {
  opacity: 1;
  translate: 0 0;
}
@media (hover: hover) {
  .rows:has(.row:hover) li:not(:has(.row:hover)) .row {
    opacity: 0.45;
  }
}
@media (prefers-reduced-motion: reduce) {
  .row,
  .row::before,
  .row-arrow {
    transition: none;
  }
}
</style>
