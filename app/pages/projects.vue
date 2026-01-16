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

// Group projects into rows of 3 for sticky effect
const projectRows = computed(() => {
  const rows = []
  for (let i = 0; i < projects.length; i += 3) {
    rows.push(projects.slice(i, i + 3))
  }
  return rows
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

        <!-- Sticky Scroll Projects -->
        <div class="flex flex-col">
          <template v-for="(row, rowIndex) in projectRows" :key="rowIndex">
            <div
              class="sticky"
              :style="{
                top: '160px',
                zIndex: rowIndex + 1,
                marginBottom: rowIndex < projectRows.length - 1 ? '25vh' : '0'
              }"
            >
              <Motion
                :initial="{ opacity: 0, y: 40 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.6, delay: 0.1 }"
                :in-view-options="{ once: true, amount: 0.2 }"
                class="pt-8 pb-12"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  <template v-for="project in row" :key="project.id">
                    <ProjectCard :project="project" no-animation />
                  </template>
                </div>
              </Motion>
            </div>
          </template>
        </div>

              </div>
    </section>
  </UPage>
</template>
