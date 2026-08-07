<script setup lang="ts">
import type { ProjectKind } from '~/data/projects'

// Tab bar styled as "LABEL ————": each tab is its own label plus a rule that
// fills the remaining space. The active tab's rule goes solid dark.
defineProps<{
  tabs: { value: ProjectKind, label: string }[]
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
    class="flex items-center gap-6 sm:gap-10"
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
      class="group flex flex-1 items-center gap-4 cursor-pointer focus:outline-none"
      @click="active = tab.value"
      @keydown.left.prevent="onArrow($event, i, tabs.length)"
      @keydown.right.prevent="onArrow($event, i, tabs.length)"
    >
      <span
        class="shrink-0 text-sm sm:text-base font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
        :class="active === tab.value
          ? 'text-heading dark:text-white'
          : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'"
      >
        {{ tab.label }}
      </span>

      <span
        class="h-px flex-1 transition-colors duration-300"
        :class="active === tab.value
          ? 'bg-neutral-900 dark:bg-white'
          : 'bg-neutral-200 dark:bg-neutral-800 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700'"
      />
    </button>
  </div>
</template>
