<script setup lang="ts">
import type { Project } from '~/data/projects'

const props = defineProps<{
  project: Project
  /** Disable the entrance animation */
  noAnimation?: boolean
}>()

const descriptionRef = ref<HTMLParagraphElement | null>(null)
const isTruncated = ref(false)

// State for mobile click-to-expand
const isExpanded = ref(false)

const toggleExpand = () => {
  // Only toggle on mobile/tablet (below lg breakpoint)
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    if (isExpanded.value) {
      // Already expanded - navigate to project link
      const link = props.project.links?.preview || props.project.links?.figma
      if (link) {
        window.open(link, '_blank')
      }
    } else {
      // First tap - expand the text
      isExpanded.value = true
    }
  }
}

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
  <!-- With animation -->
  <Motion
    v-if="!props.noAnimation"
    :initial="{ opacity: 0, y: 30 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5 }"
    :in-view-options="{ once: true }"
  >
    <article class="group h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl">
      <!-- Image container -->
      <div class="relative rounded-[16px] md:rounded-[24px] overflow-hidden aspect-4/3 mb-4 md:mb-5">
        <NuxtImg
          :src="project.image"
          :alt="project.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder
        />
        <!-- Category Badge -->
        <div class="absolute top-3 right-3 md:top-5 md:right-5 z-10">
          <span class="inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full text-[10px] md:text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 shadow-sm">
            {{ project.tags?.[0] }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col grow">
        <div class="flex items-start justify-between gap-2 md:gap-3 mb-2 md:mb-3 min-h-[24px] md:min-h-[28px]">
          <h3 class="text-sm md:text-[15px] font-bold text-[#0f172b] dark:text-white leading-snug tracking-tight flex-1">
            {{ project.title }}
          </h3>
          <span class="text-xs text-[#62748e] dark:text-neutral-500 font-medium whitespace-nowrap shrink-0">
            {{ project.date }}
          </span>
        </div>

        <div
          class="relative mb-4 md:mb-6 overflow-hidden cursor-pointer lg:cursor-default"
          @click.stop="toggleExpand"
        >
          <p
            ref="descriptionRef"
            :class="[
              'text-sm text-[#62748e] dark:text-neutral-400 leading-relaxed overflow-hidden transition-[max-height] duration-300 ease-in-out',
              isExpanded ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
              'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
            ]"
          >
            {{ project.description }}
          </p>
          <!-- Gradient fade overlay - only shows when content is truncated -->
          <div
            v-if="isTruncated"
            :class="[
              'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
              isExpanded ? 'opacity-0 duration-500' : 'opacity-100',
              'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
            ]"
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

  <!-- Without animation -->
  <article v-else class="group h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl">
      <!-- Image container -->
      <div class="relative rounded-[16px] md:rounded-[24px] overflow-hidden aspect-4/3 mb-4 md:mb-5">
        <NuxtImg
          :src="project.image"
          :alt="project.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder
        />
        <!-- Category Badge -->
        <div class="absolute top-3 right-3 md:top-5 md:right-5 z-10">
          <span class="inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full text-[10px] md:text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 shadow-sm">
            {{ project.tags?.[0] }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col grow">
        <div class="flex items-start justify-between gap-2 md:gap-3 mb-2 md:mb-3 min-h-[24px] md:min-h-[28px]">
          <h3 class="text-sm md:text-[15px] font-bold text-[#0f172b] dark:text-white leading-snug tracking-tight flex-1">
            {{ project.title }}
          </h3>
          <span class="text-xs text-[#62748e] dark:text-neutral-500 font-medium whitespace-nowrap shrink-0">
            {{ project.date }}
          </span>
        </div>

        <div
          class="relative mb-4 md:mb-6 overflow-hidden cursor-pointer lg:cursor-default"
          @click.stop="toggleExpand"
        >
          <p
            ref="descriptionRef"
            :class="[
              'text-sm text-[#62748e] dark:text-neutral-400 leading-relaxed overflow-hidden transition-[max-height] duration-300 ease-in-out',
              isExpanded ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
              'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
            ]"
          >
            {{ project.description }}
          </p>
          <!-- Gradient fade overlay - only shows when content is truncated -->
          <div
            v-if="isTruncated"
            :class="[
              'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
              isExpanded ? 'opacity-0 duration-500' : 'opacity-100',
              'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
            ]"
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
</template>
