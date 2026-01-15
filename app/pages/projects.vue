<script setup lang="ts">
import { projects } from '~/data/projects'

const seo = {
  title: 'Projects - Ailen Gonzalez',
  description: 'Explore my portfolio of product design and frontend development projects. From DeFi dashboards to mobile apps, discover the work that defines my craft.'
}

useSeoMeta({
  title: seo.title,
  ogTitle: seo.title,
  description: seo.description,
  ogDescription: seo.description
})
</script>

<template>
  <UPage>
    <section class="pt-32 pb-16 sm:pt-40 sm:pb-24 relative min-h-screen">
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
          class="mb-12 sm:mb-16"
        >
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f172b] dark:text-white tracking-tight mb-4">
            Featured Projects
          </h1>
          <p class="text-lg text-[#62748e] dark:text-neutral-400 max-w-2xl">
            A curated collection of my design and development work. Each project represents a unique challenge and a creative solution.
          </p>
        </Motion>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
      </div>
    </section>
  </UPage>
</template>
