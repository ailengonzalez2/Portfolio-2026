<script setup lang="ts">
import { Motion, useScroll, useTransform, useReducedMotion } from 'motion-v'
import { ref, computed } from 'vue'
import type { Project } from '~/data/projects'

const props = defineProps<{
  project: Project
  /** Disable the entrance animation */
  noAnimation?: boolean
  /** Show the project description below the image */
  showDescription?: boolean
  /** Position in a grid — used to stagger the entrance */
  index?: number
}>()

// Surface the live/preview link as a single button on the top right,
// falling back to Figma so Figma-only projects still get an action.
const actionLink = computed(() => props.project.links.preview || props.project.links.figma)
const actionIsFigma = computed(() => !props.project.links.preview && !!props.project.links.figma)

const reduced = useReducedMotion()

// Staggered entrance based on grid position
const entranceDelay = computed(() => (props.index ?? 0) * 0.08)

// Scroll-linked parallax on the image. The image sits at scale-110 inside an
// overflow-hidden frame, so it can drift ±5% without ever revealing an edge.
const imageFrame = ref<HTMLElement | null>(null)
const { scrollYProgress } = useScroll({
  target: imageFrame,
  offset: ['start end', 'end start']
})
const imageY = useTransform(
  scrollYProgress,
  [0, 1],
  reduced.value ? ['0%', '0%'] : ['-5%', '5%']
)
</script>

<template>
  <Motion
    :initial="props.noAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30, filter: 'blur(6px)' }"
    :while-in-view="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
    :transition="{ duration: 0.55, delay: entranceDelay, ease: [0.22, 1, 0.36, 1] }"
    :in-view-options="{ once: true, margin: '0px 0px -12% 0px' }"
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

        <!-- Live version / Figma button (top right) -->
        <NuxtLink
          v-if="actionLink"
          :to="actionLink"
          target="_blank"
          :aria-label="actionIsFigma ? $t('projects.caseStudy.figma') : $t('projects.caseStudy.viewLive')"
          :title="actionIsFigma ? $t('projects.caseStudy.figma') : $t('projects.caseStudy.viewLive')"
          class="shrink-0 flex items-center justify-center size-8 sm:size-9 rounded-full bg-neutral-900 text-white hover:opacity-90 transition-opacity"
        >
          <UIcon
            :name="actionIsFigma ? 'i-simple-icons-figma' : 'i-lucide-arrow-up-right'"
            class="size-4"
          />
        </NuxtLink>
      </div>

      <!-- Image -->
      <NuxtLink
        :to="`/projects/${project.id}`"
        class="block relative mt-1 rounded-2xl overflow-hidden aspect-4/3 bg-white"
      >
        <div
          ref="imageFrame"
          class="absolute inset-0"
        >
          <Motion
            class="size-full"
            :style="{ y: imageY }"
          >
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="size-full object-cover scale-110 transition-transform duration-500 group-hover:scale-[1.15]"
              loading="lazy"
              placeholder
            />
          </Motion>
        </div>
      </NuxtLink>

      <!-- Description -->
      <p
        v-if="showDescription"
        class="px-1.5 pt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3"
      >
        {{ project.description }}
      </p>

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
