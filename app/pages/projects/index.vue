<script setup lang="ts">
import { projects } from '~/data/projects'

definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

// Client work first (that visitor is here to hire), Lab below (recruiters scroll).
// A section renders nothing when empty.
const clientProjects = computed(() => projects.filter(p => p.kind === 'client'))
const labProjects = computed(() => projects.filter(p => p.kind === 'lab'))

useSeoMeta({
  title: () => t('projects.pageTitle'),
  ogTitle: () => `${t('projects.pageTitle')} — Ailen Gonzalez`,
  description: () => t('projects.pageIntro'),
  ogDescription: () => t('projects.pageIntro')
})
</script>

<template>
  <UPage>
    <section class="pt-24 pb-12 sm:pt-40 sm:pb-24 relative min-h-screen">
      <!-- Background decorations -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-violet-300/10 to-transparent rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-cyan-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
          class="mb-8 sm:mb-16"
        >
          <h1 class="text-5xl sm:text-7xl lg:text-8xl font-medium uppercase leading-[0.95] text-heading dark:text-white tracking-tight mb-3 sm:mb-4">
            <span
              v-for="(word, i) in $t('projects.pageTitle').split(' ')"
              :key="word"
              class="block"
              :class="i > 0 ? 'pl-12 sm:pl-24 lg:pl-32' : ''"
            >
              {{ word }}
            </span>
          </h1>
        </Motion>

        <!-- Client work -->
        <section
          v-if="clientProjects.length"
          id="client-work"
          class="scroll-mt-60"
        >
          <ProjectSectionHeading :title="$t('projects.clientWork')" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ProjectCard
              v-for="project in clientProjects"
              :key="project.id"
              :project="project"
              no-animation
            />
          </div>
        </section>

        <!-- Lab: self-directed work. Deep-linkable via /projects#lab -->
        <section
          v-if="labProjects.length"
          id="lab"
          class="scroll-mt-60 mt-20 sm:mt-28"
        >
          <ProjectSectionHeading
            :title="$t('projects.lab')"
            :description="$t('projects.labIntro')"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ProjectCard
              v-for="project in labProjects"
              :key="project.id"
              :project="project"
              no-animation
            />
          </div>
        </section>
      </div>
    </section>
  </UPage>
</template>
