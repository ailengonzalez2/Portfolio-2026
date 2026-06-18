<script setup lang="ts">
import { projects } from '~/data/projects'

// Show first 4 projects on landing page
const selfProjects = computed(() => projects.slice(0, 4))
</script>

<template>
  <section
    id="projects"
    class="py-16 sm:py-24 relative bg-background"
  >
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-violet-300/10 to-transparent rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-cyan-300/10 to-transparent rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Latest Projects -->
      <div class="mb-16">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <h2 class="text-[#64748b] text-[20px] font-medium uppercase tracking-normal mb-[10px]">
            {{ $t('projects.latestSection') }}
          </h2>
          <div class="h-[2px] w-[50px] bg-[#64748b] mb-8" />
        </Motion>

        <!-- Grid: two cards per row, matching the projects page -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ProjectCard
            v-for="project in selfProjects"
            :key="project.id"
            :project="project"
            show-description
          />
        </div>
      </div>

      <!-- View all link -->
      <Motion
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :in-view-options="{ once: true }"
        class="mt-12 text-center"
      >
        <NuxtLink
          to="/projects"
          class="group/btn relative inline-flex items-center bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] rounded-2xl py-4 pl-8 pr-16 transition-all duration-300 hover:pl-16 hover:pr-8"
        >
          <span class="absolute right-2 flex items-center justify-center size-12 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-3.5rem)]">
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5 text-gray-900"
            />
          </span>
          <span class="text-lg font-medium text-white">
            {{ $t('projects.exploreAll') }}
          </span>
        </NuxtLink>
      </Motion>
    </div>
  </section>
</template>
