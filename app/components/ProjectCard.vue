<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{
  project: Project
}>()
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 30 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5 }"
    :in-view-options="{ once: true }"
  >
    <article class="group h-full flex flex-col">
      <!-- Image container -->
      <div class="relative rounded-[24px] overflow-hidden aspect-4/3 mb-5">
        <NuxtImg
          :src="project.image"
          :alt="project.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder
        />
        <!-- Badge -->
        <div class="absolute top-5 right-5 z-10">
          <span class="inline-flex items-center px-3 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 shadow-sm">
            {{ project.tags?.[0] }}
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex flex-col grow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-bold text-[#0f172b] dark:text-white leading-tight tracking-tight">
            {{ project.title }}
          </h3>
          <span class="text-xs text-[#62748e] dark:text-neutral-500 font-medium">
            {{ project.date }}
          </span>
        </div>
        
        <p class="text-sm text-[#62748e] dark:text-neutral-400 leading-relaxed line-clamp-3 mb-5 grow">
          {{ project.description }}
        </p>

        <!-- Action buttons -->
        <div class="flex items-center gap-2 flex-wrap">
          <UButton
            v-if="project.links.figma"
            :to="project.links.figma"
            target="_blank"
            variant="soft"
            color="neutral"
            size="sm"
            class="rounded-full"
          >
            <template #leading>
              <UIcon name="i-simple-icons-figma" class="size-4" />
            </template>
            Figma
          </UButton>

          <UButton
            v-if="project.links.github"
            :to="project.links.github"
            target="_blank"
            variant="soft"
            color="neutral"
            size="sm"
            class="rounded-full"
          >
            <template #leading>
              <UIcon name="i-simple-icons-github" class="size-4" />
            </template>
            GitHub
          </UButton>

          <UButton
            v-if="project.links.preview"
            :to="project.links.preview"
            target="_blank"
            variant="soft"
            color="primary"
            size="sm"
            class="rounded-full"
          >
            <template #leading>
              <UIcon name="i-lucide-external-link" class="size-4" />
            </template>
            Preview
          </UButton>
        </div>
      </div>
    </article>
  </Motion>
</template>
