<script setup lang="ts">
import { projects } from '~/data/projects'

const route = useRoute()
const id = computed(() => route.params.id as string)

const project = computed(() => projects.find(p => p.id === id.value))

// If the project doesn't exist OR has no case study, send back to the index.
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
  ogDescription: () => seo.value.description
})

const cs = computed(() => project.value!.caseStudy)
</script>

<template>
  <UPage>
    <article class="pt-24 sm:pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-2 text-sm text-[#62748e] dark:text-neutral-400 hover:text-primary transition-colors mb-8"
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
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 bg-[#f1f5f9] dark:bg-neutral-800"
          >
            {{ tag }}
          </span>
          <span class="text-xs text-[#62748e] dark:text-neutral-500">· {{ project!.date }}</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0f172b] dark:text-white tracking-tight mb-4">
          {{ project!.title }}
        </h1>

        <!-- Tagline -->
        <p class="text-lg sm:text-xl text-[#62748e] dark:text-neutral-400 leading-relaxed mb-10 max-w-3xl">
          {{ cs?.tagline || project!.description }}
        </p>

        <!-- Hero image -->
        <div class="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-16/10 mb-12 sm:mb-16">
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
            color="primary"
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
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-[#e2e8f0] dark:border-neutral-800"
        >
          <div v-if="cs?.role">
            <p class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-1.5">
              {{ $t('projects.caseStudy.role') }}
            </p>
            <p class="text-primary-custom text-base">
              {{ cs.role }}
            </p>
          </div>
          <div v-if="cs?.client">
            <p class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-1.5">
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
            <h2 class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-3">
              {{ $t('projects.caseStudy.problem') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.problem }}
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-3">
              {{ $t('projects.caseStudy.approach') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.approach }}
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-3">
              {{ $t('projects.caseStudy.result') }}
            </h2>
            <p class="text-base sm:text-lg text-primary-custom leading-relaxed">
              {{ cs.result }}
            </p>
          </section>

          <section class="mb-16">
            <h2 class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mb-3">
              {{ $t('projects.caseStudy.stack') }}
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in cs.stack"
                :key="tech"
                class="px-3 py-1.5 rounded-full bg-[#f1f5f9] dark:bg-neutral-800 text-[13px] text-[#0f172b] dark:text-neutral-200 font-medium"
              >
                {{ tech }}
              </span>
            </div>
          </section>
        </template>

        <!-- Fallback when no case study yet -->
        <section
          v-else
          class="mb-16 p-8 rounded-2xl border border-dashed border-[#e2e8f0] dark:border-neutral-800 text-center"
        >
          <UIcon
            name="i-lucide-construction"
            class="size-8 text-[#90a1b9] mx-auto mb-3"
          />
          <h2 class="text-lg font-semibold text-[#0f172b] dark:text-white mb-1">
            {{ $t('projects.caseStudy.comingSoonTitle') }}
          </h2>
          <p class="text-[#62748e] dark:text-neutral-400 max-w-md mx-auto">
            {{ $t('projects.caseStudy.comingSoonBody') }}
          </p>
        </section>

        <!-- CTA -->
        <div class="text-center">
          <p class="text-lg text-primary-custom mb-4">
            {{ $t('projects.caseStudy.ctaText') }}
          </p>
          <UButton
            to="/#contact"
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
      </div>
    </article>
  </UPage>
</template>
