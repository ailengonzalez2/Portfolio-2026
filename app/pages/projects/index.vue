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
    <section class="pt-32 sm:pt-44 pb-24 sm:pb-32">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <ResolveText
          :text="$t('projects.pageTitle')"
          tag="h1"
          on="load"
          class="font-display font-normal text-6xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-[-0.03em] text-ink dark:text-paper"
        />
        <p class="mt-8 max-w-xl text-lg text-body">
          {{ $t('projects.pageIntro') }}
        </p>

        <ProjectTabs
          v-model="activeTab"
          :tabs="tabs"
          class="mt-16 sm:mt-20"
        />

        <!-- Both panels stay in the DOM (v-show) so every project is present in
             the HTML for search engines, and switching tabs is instant. -->
        <div
          v-show="activeTab === 'client'"
          id="panel-client"
          role="tabpanel"
          class="mt-10 sm:mt-12"
        >
          <ProjectsList :projects="clientProjects" />
        </div>

        <div
          v-show="activeTab === 'lab'"
          id="panel-lab"
          role="tabpanel"
          class="mt-10 sm:mt-12"
        >
          <p class="mb-10 sm:mb-12 max-w-xl text-lg text-body">
            {{ $t('projects.labIntro') }}
          </p>
          <ProjectsLabTable :projects="labProjects" />
        </div>
      </div>
    </section>
  </UPage>
</template>
