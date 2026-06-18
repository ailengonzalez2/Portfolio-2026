<script setup lang="ts">
import { projects } from '~/data/projects'

definePageMeta({ colorMode: 'light' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const project = computed(() => projects.find(p => p.id === id.value))

// If the project doesn't exist, send back to the index.
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const seo = computed(() => ({
  title: `${project.value!.title} — Ailen Gonzalez`,
  description: project.value!.caseStudy?.tagline || project.value!.description
}))

useSeoMeta({
  title: () => seo.value.title,
  ogTitle: () => seo.value.title,
  description: () => seo.value.description,
  ogDescription: () => seo.value.description,
  ogImage: () => project.value!.image
})

const cs = computed(() => project.value!.caseStudy)

// Three other projects to surface at the bottom
const related = computed(() =>
  projects.filter(p => p.id !== id.value).slice(0, 3)
)
</script>

<template>
  <UPage>
    <article class="pt-24 sm:pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-2 text-sm text-body dark:text-neutral-400 hover:text-primary transition-colors mb-8"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-4"
          />
          {{ $t('projects.caseStudy.back') }}
        </NuxtLink>

        <!-- Tags + date -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span
            v-for="tag in project!.tags"
            :key="tag"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 bg-surface dark:bg-neutral-800"
          >
            {{ tag }}
          </span>
          <span class="text-xs text-body dark:text-neutral-500">· {{ project!.date }}</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold text-heading dark:text-white tracking-tight mb-4">
          {{ project!.title }}
        </h1>

        <!-- Tagline -->
        <p class="text-lg sm:text-xl text-body dark:text-neutral-400 leading-relaxed mb-8 max-w-3xl">
          {{ cs?.tagline || project!.description }}
        </p>

        <!-- Metric callouts (only when real numbers exist) -->
        <div
          v-if="cs?.metrics?.length"
          class="grid gap-3 sm:gap-4 mb-10"
          :class="cs.metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3'"
        >
          <div
            v-for="metric in cs.metrics"
            :key="metric.label"
            class="rounded-2xl bg-[#f8fafc] dark:bg-neutral-900 border border-hairline dark:border-neutral-800 px-3 py-5 sm:px-5 sm:py-6 text-center"
          >
            <p class="btn-gradient-text text-2xl sm:text-4xl font-bold leading-none mb-1.5">
              {{ metric.value }}
            </p>
            <p class="text-[11px] sm:text-xs uppercase tracking-[0.5px] text-body dark:text-neutral-500 font-medium">
              {{ metric.label }}
            </p>
          </div>
        </div>

        <!-- Hero image -->
        <div class="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-16/10 mb-10 sm:mb-12">
          <NuxtImg
            :src="project!.image"
            :alt="project!.title"
            class="size-full object-cover"
          />
        </div>

        <!-- Action links -->
        <div class="flex flex-wrap items-center gap-3 mb-12 sm:mb-16">
          <UButton
            v-if="project!.links.preview"
            :to="project!.links.preview"
            target="_blank"
            color="neutral"
            size="lg"
            class="rounded-full"
          >
            <template #leading>
              <UIcon
                name="i-lucide-external-link"
                class="size-4"
              />
            </template>
            {{ $t('projects.caseStudy.viewLive') }}
          </UButton>
          <UButton
            v-if="project!.links.github"
            :to="project!.links.github"
            target="_blank"
            variant="outline"
            color="neutral"
            size="lg"
            class="rounded-full"
          >
            <template #leading>
              <UIcon
                name="i-simple-icons-github"
                class="size-4"
              />
            </template>
            {{ $t('projects.caseStudy.viewCode') }}
          </UButton>
          <UButton
            v-if="project!.links.figma"
            :to="project!.links.figma"
            target="_blank"
            variant="outline"
            color="neutral"
            size="lg"
            class="rounded-full"
          >
            <template #leading>
              <UIcon
                name="i-simple-icons-figma"
                class="size-4"
              />
            </template>
            {{ $t('projects.caseStudy.figma') }}
          </UButton>
        </div>

        <!-- Meta strip (role + client) -->
        <div
          v-if="cs?.role || cs?.client"
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-hairline dark:border-neutral-800"
        >
          <div v-if="cs?.role">
            <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-1.5">
              {{ $t('projects.caseStudy.role') }}
            </p>
            <p class="text-primary-custom text-base">
              {{ cs.role }}
            </p>
          </div>
          <div v-if="cs?.client">
            <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-1.5">
              {{ $t('projects.caseStudy.client') }}
            </p>
            <p class="text-primary-custom text-base">
              {{ cs.client }}
            </p>
          </div>
        </div>

        <!-- Case study sections -->
        <template v-if="cs">
          <section class="mb-12">
            <h2 class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
              {{ $t('projects.caseStudy.problem') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.problem }}
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
              {{ $t('projects.caseStudy.approach') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.approach }}
            </p>
            <ul
              v-if="cs.highlights?.length"
              class="mt-5 space-y-2.5"
            >
              <li
                v-for="point in cs.highlights"
                :key="point"
                class="flex items-start gap-3 text-base text-primary-custom"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-5 shrink-0 mt-0.5 text-primary"
                />
                <span>{{ point }}</span>
              </li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
              {{ $t('projects.caseStudy.result') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.result }}
            </p>
            <ul
              v-if="cs.outcomes?.length"
              class="mt-5 space-y-2.5"
            >
              <li
                v-for="point in cs.outcomes"
                :key="point"
                class="flex items-start gap-3 text-base text-primary-custom"
              >
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-5 shrink-0 mt-0.5 text-primary"
                />
                <span>{{ point }}</span>
              </li>
            </ul>
          </section>

          <section class="mb-16">
            <h2 class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
              {{ $t('projects.caseStudy.stack') }}
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in cs.stack"
                :key="tech"
                class="px-3 py-1.5 rounded-full bg-surface dark:bg-neutral-800 text-[13px] text-heading dark:text-neutral-200 font-medium"
              >
                {{ tech }}
              </span>
            </div>
          </section>
        </template>

        <!-- Clean overview when there's no full case study yet -->
        <section
          v-else
          class="mb-16"
        >
          <h2 class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
            {{ $t('projects.caseStudy.overview') }}
          </h2>
          <p class="text-base sm:text-lg text-primary-custom leading-relaxed mb-4">
            {{ project!.description }}
          </p>
          <p class="text-sm text-label leading-relaxed mb-6">
            {{ $t('projects.caseStudy.comingSoonBody') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project!.tags"
              :key="tag"
              class="px-3 py-1.5 rounded-full bg-surface dark:bg-neutral-800 text-[13px] text-heading dark:text-neutral-200 font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </section>

        <!-- CTA -->
        <div class="text-center pb-16 sm:pb-20 mb-16 sm:mb-20 border-b border-hairline dark:border-neutral-800">
          <p class="text-lg text-primary-custom mb-4">
            {{ $t('projects.caseStudy.ctaText') }}
          </p>
          <UButton
            to="/#brief"
            size="lg"
            class="btn-gradient text-white rounded-full px-6"
          >
            {{ $t('projects.caseStudy.ctaButton') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>
        </div>

        <!-- Related projects -->
        <section>
          <h2 class="text-xl sm:text-2xl font-bold text-heading dark:text-white tracking-tight mb-6">
            {{ $t('projects.caseStudy.relatedProjects') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <ProjectCard
              v-for="item in related"
              :key="item.id"
              :project="item"
              no-animation
            />
          </div>
        </section>
      </div>
    </article>
  </UPage>
</template>
