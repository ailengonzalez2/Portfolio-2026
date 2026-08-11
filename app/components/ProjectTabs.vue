<script setup lang="ts">
import type { ProjectKind } from '~/data/projects'

// Tabs sit next to each other so proximity reads them as one set of options
// rather than two section headings, and each carries its project count. The
// long rule after the pair keeps the label-plus-line look of the page.
defineProps<{
  tabs: { value: ProjectKind, label: string, count: number }[]
}>()

const active = defineModel<ProjectKind>({ required: true })

const tabRefs = ref<HTMLElement[]>([])

// Left/right arrows move between tabs, per the WAI-ARIA tabs pattern.
function onArrow(event: KeyboardEvent, index: number, count: number) {
  const next = event.key === 'ArrowRight'
    ? (index + 1) % count
    : (index - 1 + count) % count

  tabRefs.value[next]?.focus()
  tabRefs.value[next]?.click()
}
</script>

<template>
  <div
    role="tablist"
    class="flex items-center gap-7 sm:gap-9"
  >
    <button
      v-for="(tab, i) in tabs"
      :key="tab.value"
      :ref="el => { if (el) tabRefs[i] = el as HTMLElement }"
      role="tab"
      type="button"
      :aria-selected="active === tab.value"
      :aria-controls="`panel-${tab.value}`"
      :tabindex="active === tab.value ? 0 : -1"
      class="group relative shrink-0 pb-2.5 cursor-pointer focus-visible:outline-none"
      @click="active = tab.value"
      @keydown.left.prevent="onArrow($event, i, tabs.length)"
      @keydown.right.prevent="onArrow($event, i, tabs.length)"
    >
      <span
        class="flex items-baseline gap-1.5 text-sm sm:text-base font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
        :class="active === tab.value
          ? 'text-heading dark:text-white'
          : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'"
      >
        {{ tab.label }}
        <span
          class="text-[0.8em] font-medium tracking-normal tabular-nums transition-colors duration-300"
          :class="active === tab.value
            ? 'text-neutral-600 dark:text-neutral-300'
            : 'text-neutral-400 dark:text-neutral-500'"
        >
          {{ tab.count }}
        </span>
      </span>

      <!-- Thick underline marks the active tab; a faint one appears on hover so
           the control announces itself as clickable. -->
      <span
        class="absolute inset-x-0 bottom-0 h-0.5 rounded-full transition-colors duration-300"
        :class="active === tab.value
          ? 'bg-neutral-900 dark:bg-white'
          : 'bg-transparent group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700'"
      />
    </button>

    <!-- Trailing rule: carries the page's label-plus-line language. -->
    <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800 mb-2.5" />
  </div>
</template>
