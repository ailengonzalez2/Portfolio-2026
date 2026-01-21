<script setup lang="ts">
import { projects } from '~/data/projects'

// Show first 4 projects on landing page
const selfProjects = computed(() => projects.slice(0, 4))

// Refs for description elements to check truncation
const descriptionRefs = ref<(HTMLParagraphElement | null)[]>([null, null, null, null])
const isTruncated = ref<boolean[]>([false, false, false, false])

// State for mobile click-to-expand
const expandedCards = ref<boolean[]>([false, false, false, false])

const toggleExpand = (index: number) => {
  // Only toggle on mobile/tablet (below lg breakpoint)
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    if (expandedCards.value[index]) {
      // Already expanded - navigate to project link
      const project = selfProjects.value[index]
      const link = project?.links?.preview || project?.links?.figma
      if (link) {
        window.open(link, '_blank')
      }
    } else {
      // First tap - expand the text
      expandedCards.value[index] = true
    }
  }
}

const handleCardClick = (index: number) => {
  // Only navigate on desktop (lg and above)
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    const project = selfProjects.value[index]
    const link = project?.links?.preview || project?.links?.figma
    if (link) {
      window.open(link, '_blank')
    }
  }
}

const checkTruncation = () => {
  descriptionRefs.value.forEach((el, index) => {
    if (el) {
      // Add small buffer (2px) to account for rounding
      isTruncated.value[index] = el.scrollHeight > el.clientHeight + 2
    }
  })
}

onMounted(() => {
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
  <section
    id="projects"
    class="py-16 sm:py-24 relative bg-background"
  >
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-violet-300/10 to-transparent rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-cyan-300/10 to-transparent rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Latest Projects -->
      <div class="mb-16">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <h2 class="text-[#a2a2a2] text-[20px] font-medium uppercase tracking-normal mb-[10px]">
            Latest Projects
          </h2>
          <div class="h-[2px] w-[50px] bg-[#a2a2a2] mb-8" />
        </Motion>

        <!-- Grid with custom columns: left card wider (2fr), right card narrower (1fr) -->
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
          <!-- Left Card (wider) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <div
              class="group block h-full lg:cursor-pointer"
              @click="handleCardClick(0)"
            >
              <div>
                <!-- Image container with badge - Fixed height -->
                <div class="relative rounded-[30px] overflow-hidden h-[526px] w-full mb-8">
                  <NuxtImg
                    :src="selfProjects[0]?.image"
                    :alt="selfProjects[0]?.title"
                    class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <!-- Badge -->
                  <div class="absolute top-10 right-10 z-10">
                    <span class="inline-flex items-center px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[12px] uppercase tracking-[0.6px] font-medium text-primary-custom shadow-sm">
                      {{ selfProjects[0]?.tags?.[0] || 'PRODUCT DESIGN' }}
                    </span>
                  </div>
                </div>

                <!-- Content below image -->
                <div>
                  <h3 class="text-[20px] font-bold text-[#0f172b] dark:text-white leading-[28px] tracking-[-0.45px] mb-1">
                    {{ selfProjects[0]?.title }}
                  </h3>
                  <div
                    class="relative mb-4 overflow-hidden cursor-pointer lg:cursor-default pointer-events-auto"
                    @click.stop="toggleExpand(0)"
                  >
                    <p
                      :ref="(el) => descriptionRefs[0] = el as HTMLParagraphElement"
                      :class="[
                        'text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] overflow-hidden transition-[max-height] duration-300 ease-in-out',
                        expandedCards[0] ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
                        'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
                      ]"
                    >
                      {{ selfProjects[0]?.description }}
                    </p>
                    <div
                      v-if="isTruncated[0]"
                      :class="[
                        'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
                        expandedCards[0] ? 'opacity-0 duration-500' : 'opacity-100',
                        'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
                      ]"
                    />
                  </div>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap pointer-events-auto">
                    <UButton
                      v-if="selfProjects[0]?.links?.figma"
                      :to="selfProjects[0]?.links?.figma"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[0]?.links?.github"
                      :to="selfProjects[0]?.links?.github"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[0]?.links?.preview"
                      :to="selfProjects[0]?.links?.preview"
                      target="_blank"
                      variant="soft"
                      color="primary"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
              </div>
            </div>
          </Motion>

          <!-- Right Card (narrower) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.1 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <div
              class="group block lg:cursor-pointer"
              @click="handleCardClick(1)"
            >
              <div>
                <!-- Image container with badge - Same fixed height -->
                <div class="relative rounded-[30px] overflow-hidden h-[526px] w-full mb-8">
                  <NuxtImg
                    :src="selfProjects[1]?.image"
                    :alt="selfProjects[1]?.title"
                    class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <!-- Badge -->
                  <div class="absolute top-10 right-10 z-10">
                    <span class="inline-flex items-center px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[12px] uppercase tracking-[0.6px] font-medium text-primary-custom shadow-sm">
                      {{ selfProjects[1]?.tags?.[0] || 'PRODUCT DESIGN' }}
                    </span>
                  </div>
                </div>

                <!-- Content below image -->
                <div>
                  <h3 class="text-[20px] font-bold text-[#0f172b] dark:text-white leading-[28px] tracking-[-0.45px] mb-1">
                    {{ selfProjects[1]?.title }}
                  </h3>
                  <div
                    class="relative mb-4 overflow-hidden cursor-pointer lg:cursor-default pointer-events-auto"
                    @click.stop="toggleExpand(1)"
                  >
                    <p
                      :ref="(el) => descriptionRefs[1] = el as HTMLParagraphElement"
                      :class="[
                        'text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] overflow-hidden transition-[max-height] duration-300 ease-in-out',
                        expandedCards[1] ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
                        'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
                      ]"
                    >
                      {{ selfProjects[1]?.description }}
                    </p>
                    <div
                      v-if="isTruncated[1]"
                      :class="[
                        'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
                        expandedCards[1] ? 'opacity-0 duration-500' : 'opacity-100',
                        'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
                      ]"
                    />
                  </div>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap pointer-events-auto">
                    <UButton
                      v-if="selfProjects[1]?.links?.figma"
                      :to="selfProjects[1]?.links?.figma"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[1]?.links?.github"
                      :to="selfProjects[1]?.links?.github"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[1]?.links?.preview"
                      :to="selfProjects[1]?.links?.preview"
                      target="_blank"
                      variant="soft"
                      color="primary"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
              </div>
            </div>
          </Motion>
        </div>

        <!-- Second row - inverted layout [1fr_2fr] -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 mt-8 lg:mt-12">
          <!-- Left Card (narrower) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.2 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <div
              class="group block lg:cursor-pointer"
              @click="handleCardClick(2)"
            >
              <div>
                <!-- Image container with badge - Same fixed height -->
                <div class="relative rounded-[30px] overflow-hidden h-[526px] w-full mb-8">
                  <NuxtImg
                    :src="selfProjects[2]?.image"
                    :alt="selfProjects[2]?.title"
                    class="size-full object-cover object-left transition-transform duration-500 group-hover:scale-105"
                  />
                  <!-- Badge -->
                  <div class="absolute top-10 right-10 z-10">
                    <span class="inline-flex items-center px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[12px] uppercase tracking-[0.6px] font-medium text-primary-custom shadow-sm">
                      {{ selfProjects[2]?.tags?.[0] || 'PRODUCT DESIGN' }}
                    </span>
                  </div>
                </div>

                <!-- Content below image -->
                <div>
                  <h3 class="text-[20px] font-bold text-[#0f172b] dark:text-white leading-[28px] tracking-[-0.45px] mb-1">
                    {{ selfProjects[2]?.title }}
                  </h3>
                  <div
                    class="relative mb-4 overflow-hidden cursor-pointer lg:cursor-default pointer-events-auto"
                    @click.stop="toggleExpand(2)"
                  >
                    <p
                      :ref="(el) => descriptionRefs[2] = el as HTMLParagraphElement"
                      :class="[
                        'text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] overflow-hidden transition-[max-height] duration-300 ease-in-out',
                        expandedCards[2] ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
                        'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
                      ]"
                    >
                      {{ selfProjects[2]?.description }}
                    </p>
                    <div
                      v-if="isTruncated[2]"
                      :class="[
                        'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
                        expandedCards[2] ? 'opacity-0 duration-500' : 'opacity-100',
                        'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
                      ]"
                    />
                  </div>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap pointer-events-auto">
                    <UButton
                      v-if="selfProjects[2]?.links?.figma"
                      :to="selfProjects[2]?.links?.figma"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[2]?.links?.github"
                      :to="selfProjects[2]?.links?.github"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[2]?.links?.preview"
                      :to="selfProjects[2]?.links?.preview"
                      target="_blank"
                      variant="soft"
                      color="primary"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
              </div>
            </div>
          </Motion>

          <!-- Right Card (wider) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.3 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <div
              class="group block h-full lg:cursor-pointer"
              @click="handleCardClick(3)"
            >
              <div>
                <!-- Image container with badge - Fixed height -->
                <div class="relative rounded-[30px] overflow-hidden h-[526px] w-full mb-8">
                  <NuxtImg
                    :src="selfProjects[3]?.image"
                    :alt="selfProjects[3]?.title"
                    class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <!-- Badge -->
                  <div class="absolute top-10 right-10 z-10">
                    <span class="inline-flex items-center px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[12px] uppercase tracking-[0.6px] font-medium text-primary-custom shadow-sm">
                      {{ selfProjects[3]?.tags?.[0] || 'PRODUCT DESIGN' }}
                    </span>
                  </div>
                </div>

                <!-- Content below image -->
                <div>
                  <h3 class="text-[20px] font-bold text-[#0f172b] dark:text-white leading-[28px] tracking-[-0.45px] mb-1">
                    {{ selfProjects[3]?.title }}
                  </h3>
                  <div
                    class="relative mb-4 overflow-hidden cursor-pointer lg:cursor-default pointer-events-auto"
                    @click.stop="toggleExpand(3)"
                  >
                    <p
                      :ref="(el) => descriptionRefs[3] = el as HTMLParagraphElement"
                      :class="[
                        'text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] overflow-hidden transition-[max-height] duration-300 ease-in-out',
                        expandedCards[3] ? 'max-h-[10em] duration-500' : 'max-h-[4.2em]',
                        'lg:max-h-[4.2em] lg:group-hover:max-h-[10em] lg:group-hover:duration-500'
                      ]"
                    >
                      {{ selfProjects[3]?.description }}
                    </p>
                    <div
                      v-if="isTruncated[3]"
                      :class="[
                        'absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-neutral-950 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none',
                        expandedCards[3] ? 'opacity-0 duration-500' : 'opacity-100',
                        'lg:opacity-100 lg:group-hover:opacity-0 lg:group-hover:duration-500'
                      ]"
                    />
                  </div>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap pointer-events-auto">
                    <UButton
                      v-if="selfProjects[3]?.links?.figma"
                      :to="selfProjects[3]?.links?.figma"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[3]?.links?.github"
                      :to="selfProjects[3]?.links?.github"
                      target="_blank"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
                      v-if="selfProjects[3]?.links?.preview"
                      :to="selfProjects[3]?.links?.preview"
                      target="_blank"
                      variant="soft"
                      color="primary"
                      size="sm"
                      class="rounded-full"
                      @click.stop
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
              </div>
            </div>
          </Motion>
        </div>
      </div>

      <!-- View all link -->
      <Motion
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :in-view-options="{ once: true }"
        class="mt-12 text-center"
      >
        <NuxtLink
          to="/projects"
          class="group/btn relative inline-flex items-center bg-linear-to-r from-[#ffb147] via-[#ff6c63] to-[#b86adf] rounded-2xl py-4 pl-8 pr-16 transition-all duration-300 hover:pl-16 hover:pr-8"
        >
          <span class="absolute right-2 flex items-center justify-center size-12 bg-white rounded-full transition-all duration-300 ease-out group-hover/btn:right-[calc(100%-3.5rem)]">
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5 text-gray-900"
            />
          </span>
          <span class="text-lg font-medium text-white">
            Explore Projects
          </span>
        </NuxtLink>
      </Motion>
    </div>
  </section>
</template>
