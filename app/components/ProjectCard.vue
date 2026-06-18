<script setup lang="ts">
import { Motion } from 'motion-v'
import type { Project } from '~/data/projects'

const props = defineProps<{
  project: Project
  /** Disable the entrance animation */
  noAnimation?: boolean
}>()

// Only surface the live/preview link as a single button on the top right
const liveLink = computed(() => props.project.links.preview)
</script>

<template>
  <Motion
    :initial="props.noAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5 }"
    :in-view-options="{ once: true }"
    class="h-full"
  >
    <article class="group h-full flex flex-col bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-3 sm:p-4">
      <!-- Header row: title + tag pill + action buttons -->
      <div class="flex items-center justify-between gap-2 sm:gap-3 px-1.5 py-2 sm:py-2.5">
        <NuxtLink
          :to="`/projects/${project.id}`"
          class="min-w-0 truncate text-sm sm:text-base font-semibold tracking-tight text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          {{ project.title }}
        </NuxtLink>

        <!-- Live version button (top right) -->
        <NuxtLink
          v-if="liveLink"
          :to="liveLink"
          target="_blank"
          aria-label="Live version"
          title="Live version"
          class="shrink-0 flex items-center justify-center size-8 sm:size-9 rounded-full bg-neutral-900 text-white hover:opacity-90 transition-opacity"
        >
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4"
          />
        </NuxtLink>
      </div>

      <!-- Image -->
      <NuxtLink
        :to="`/projects/${project.id}`"
        class="block relative mt-1 rounded-2xl overflow-hidden aspect-4/3 bg-white"
      >
        <NuxtImg
          :src="project.image"
          :alt="project.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          placeholder
        />
      </NuxtLink>

      <!-- Tech stack -->
      <div
        v-if="project.caseStudy?.stack?.length"
        class="flex items-center gap-1.5 flex-wrap px-1.5 pt-3 pb-1"
      >
        <span
          v-for="tech in project.caseStudy.stack"
          :key="tech"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
        >
          {{ tech }}
        </span>
      </div>
    </article>
  </Motion>
</template>
