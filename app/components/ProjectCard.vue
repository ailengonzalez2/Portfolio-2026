<script setup lang="ts">
import { Motion } from 'motion-v'
import type { Project } from '~/data/projects'

const props = defineProps<{
  project: Project
  /** Disable the entrance animation */
  noAnimation?: boolean
}>()

// External link buttons rendered as cyan circles next to the tag pill
const actions = computed(() => {
  const links = props.project.links
  const list: { icon: string, to: string, label: string }[] = []
  if (links.figma) list.push({ icon: 'i-simple-icons-figma', to: links.figma, label: 'Figma' })
  if (links.github) list.push({ icon: 'i-simple-icons-github', to: links.github, label: 'GitHub' })
  if (links.preview) list.push({ icon: 'i-lucide-arrow-up-right', to: links.preview, label: 'Preview' })
  return list
})
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

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <!-- Tag pill -->
          <span
            v-if="project.tags?.[0]"
            class="inline-flex items-center gap-1.5 max-w-[8rem] sm:max-w-[10rem] pl-2.5 pr-3 py-1.5 rounded-full bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] text-white text-xs sm:text-sm font-medium"
          >
            <UIcon
              name="i-lucide-diamond"
              class="size-3.5 shrink-0"
            />
            <span class="truncate">{{ project.tags[0] }}</span>
          </span>

          <!-- Circular action buttons -->
          <NuxtLink
            v-for="action in actions"
            :key="action.label"
            :to="action.to"
            target="_blank"
            :aria-label="action.label"
            :title="action.label"
            class="flex items-center justify-center size-8 sm:size-9 rounded-full bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] text-white hover:opacity-90 transition-opacity"
          >
            <UIcon
              :name="action.icon"
              class="size-4"
            />
          </NuxtLink>
        </div>
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
    </article>
  </Motion>
</template>
