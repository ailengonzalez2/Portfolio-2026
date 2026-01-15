<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{
  project: Project
}>()

const descriptionRef = ref<HTMLParagraphElement | null>(null)
const isTruncated = ref(false)

const checkTruncation = () => {
  if (descriptionRef.value) {
    // Add small buffer (2px) to account for rounding
    isTruncated.value = descriptionRef.value.scrollHeight > descriptionRef.value.clientHeight + 2
  }
}

onMounted(() => {
  // Wait for next tick to ensure DOM is fully rendered
  nextTick(() => {
    checkTruncation()
    // Also check after a short delay in case fonts are still loading
    setTimeout(checkTruncation, 100)
  })
  window.addEventListener('resize', checkTruncation)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkTruncation)
})
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
        <!-- Category Badge -->
        <div class="absolute top-5 right-5 z-10">
          <span class="inline-flex items-center px-3 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 shadow-sm">
            {{ project.tags?.[0] }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col grow">
        <div class="flex items-start justify-between gap-3 mb-3 min-h-[28px]">
          <h3 class="text-[15px] font-bold text-[#0f172b] dark:text-white leading-snug tracking-tight flex-1">
            {{ project.title }}
          </h3>
          <span class="text-xs text-[#62748e] dark:text-neutral-500 font-medium whitespace-nowrap shrink-0">
            {{ project.date }}
          </span>
        </div>

        <div class="relative mb-6 overflow-hidden">
          <p
            ref="descriptionRef"
            class="text-sm text-[#62748e] dark:text-neutral-400 leading-relaxed overflow-hidden max-h-[4.2em] group-hover:max-h-[10em] transition-[max-height] duration-300 group-hover:duration-500 ease-in-out"
          >
            {{ project.description }}
          </p>
          <!-- Gradient fade overlay - only shows when content is truncated -->
          <div
            v-if="isTruncated"
            class="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300 group-hover:duration-500 ease-in-out pointer-events-none"
          />
        </div>

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
              <UIcon
                name="i-simple-icons-figma"
                class="size-4"
              />
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
              <UIcon
                name="i-simple-icons-github"
                class="size-4"
              />
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
              <UIcon
                name="i-lucide-external-link"
                class="size-4"
              />
            </template>
            Preview
          </UButton>
        </div>
      </div>
    </article>
  </Motion>
</template>
