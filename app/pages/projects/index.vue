<script setup lang="ts">
import { projects, type ProjectKind } from '~/data/projects'

definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

const clientProjects = computed(() => projects.filter(p => p.kind === 'client'))
const labProjects = computed(() => projects.filter(p => p.kind === 'lab'))

const tabs = computed(() => [
  { value: 'client' as ProjectKind, label: t('projects.clientWork'), count: clientProjects.value.length },
  { value: 'lab' as ProjectKind, label: t('projects.lab'), count: labProjects.value.length }
])

// Client work is the default — that visitor is here to hire.
const activeTab = ref<ProjectKind>('client')

// The tab is mirrored in the URL hash so /projects#lab still opens Lab straight
// away, which is the link that goes on a CV or a job application.
const route = useRoute()

onMounted(() => {
  if (route.hash === '#lab') activeTab.value = 'lab'
})

watch(activeTab, (kind) => {
  // replaceState rather than the router: swapping tabs shouldn't add history
  // entries or make the page jump to the anchor.
  history.replaceState(history.state, '', kind === 'lab' ? '#lab' : location.pathname)
})

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

        <ProjectTabs
          v-model="activeTab"
          :tabs="tabs"
        />

        <!-- Both panels stay in the DOM (v-show) so every project is present in
             the HTML for search engines, and switching tabs is instant. -->
        <div
          v-show="activeTab === 'client'"
          id="panel-client"
          role="tabpanel"
          class="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          <ProjectCard
            v-for="project in clientProjects"
            :key="project.id"
            :project="project"
            no-animation
          />
        </div>

        <div
          v-show="activeTab === 'lab'"
          id="panel-lab"
          role="tabpanel"
          class="mt-10 sm:mt-12"
        >
          <p class="mb-10 sm:mb-12 max-w-xl text-base sm:text-lg text-muted">
            {{ $t('projects.labIntro') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ProjectCard
              v-for="project in labProjects"
              :key="project.id"
              :project="project"
              no-animation
            />
          </div>
        </div>
      </div>
    </section>
  </UPage>
</template>
