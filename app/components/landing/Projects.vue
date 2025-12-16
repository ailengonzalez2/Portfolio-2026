<script setup lang="ts">
const projects = [
  {
    title: 'Bloom Finance App Redesign',
    description: 'Led the complete UX/UI overhaul and front-end implementation for a personal finance platform, focusing on data visualization clarity and improving user onboarding flow. Resulted in a 32% increase in user retention.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['UX Design', 'UI Design'],
    date: '2024'
  },
  {
    title: 'Internal Developer Hub (Nuxt Team)',
    description: 'Designed and built key components for an internal documentation and tooling hub for Nuxt developers, focusing on improving developer experience and streamlining access to resources.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['Developer Tools', 'UX Design', 'Nuxt', 'Design System', 'Internal Tools'],
    date: '2024'
  },
  {
    title: 'EcoTrack Sustainability App',
    description: 'Created a mobile-first application to help users track and reduce their environmental impact. Translated complex sustainability metrics into an accessible and motivating user interface.',
    image: 'https://images.unsplash.com/photo-1613858749733-3a3e456e3d9e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    url: '#',
    tags: ['UX Research', 'UI Design', 'Mobile App'],
    date: '2023'
  },
  {
    title: 'Wavelength Music Streaming Service',
    description: 'Designed and developed the user interface for an indie music streaming service, focusing on discovery features and creating a unique, engaging listening experience using custom audio visualizations.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['UI Design', 'Front-End Dev', 'Animation'],
    date: '2023'
  }
]

// Split projects into categories
const selfProjects = computed(() => projects.slice(0, 3))
const petProjects = computed(() => projects.slice(3))
</script>

<template>
  <section class="py-16 sm:py-24 relative">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-violet-300/10 to-transparent rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-cyan-300/10 to-transparent rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Self Projects -->
      <div class="mb-16">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
          class="flex items-center gap-3 mb-8"
        >
          <span class="uppercase tracking-widest text-xs text-muted font-medium">Self Projects</span>
          <div class="flex-1 h-px bg-default" />
        </Motion>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Motion
            v-for="(project, index) in selfProjects"
            :key="project.title"
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
            :in-view-options="{ once: true }"
          >
            <NuxtLink
              :to="project.url"
              class="group block"
            >
              <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-elevated border border-default/50 transition-all duration-300 group-hover:border-default group-hover:shadow-xl group-hover:shadow-neutral-950/5">
                <NuxtImg
                  :src="project.image"
                  :alt="project.title"
                  class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <!-- Overlay gradient -->
                <div class="absolute inset-0 bg-linear-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <!-- Title overlay on hover -->
                <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white font-medium text-lg">{{ project.title }}</h3>
                  <div class="flex gap-2 mt-2 flex-wrap">
                    <span
                      v-for="tag in project.tags?.slice(0, 2)"
                      :key="tag"
                      class="text-xs px-2 py-1 rounded-full bg-white/20 text-white/90"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </Motion>
        </div>
      </div>

      <!-- Pet Projects -->
      <div v-if="petProjects.length">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
          class="flex items-center gap-3 mb-8"
        >
          <span class="font-serif italic text-muted">Pet Projects</span>
          <div class="flex-1 h-px bg-default" />
        </Motion>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Motion
            v-for="(project, index) in petProjects"
            :key="project.title"
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
            :in-view-options="{ once: true }"
          >
            <NuxtLink
              :to="project.url"
              class="group block"
            >
              <div class="relative aspect-video overflow-hidden rounded-2xl bg-elevated border border-default/50 transition-all duration-300 group-hover:border-default group-hover:shadow-xl group-hover:shadow-neutral-950/5">
                <NuxtImg
                  :src="project.image"
                  :alt="project.title"
                  class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-linear-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white font-medium">{{ project.title }}</h3>
                </div>
              </div>
            </NuxtLink>
          </Motion>
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
        <UButton
          label="View all projects"
          to="/projects"
          variant="ghost"
          color="neutral"
        >
          <template #trailing>
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </template>
        </UButton>
      </Motion>
    </div>
  </section>
</template>
