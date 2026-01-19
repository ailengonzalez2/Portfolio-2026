<script setup lang="ts">
import { projects } from '~/data/projects'

// Show first 4 projects on landing page
const selfProjects = computed(() => projects.slice(0, 4))
</script>

<template>
  <section
    id="projects"
    class="py-16 sm:py-24 relative bg-background -mt-[100vh] z-10"
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
            <NuxtLink
              :to="selfProjects[0]?.links?.preview || '#'"
              class="group block h-full"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] mb-4">
                    {{ selfProjects[0]?.description }}
                  </p>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap">
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
            </NuxtLink>
          </Motion>

          <!-- Right Card (narrower) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.1 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <NuxtLink
              :to="selfProjects[1]?.links?.preview || '#'"
              class="group block"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] mb-4">
                    {{ selfProjects[1]?.description }}
                  </p>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap">
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
            </NuxtLink>
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
            <NuxtLink
              :to="selfProjects[2]?.links?.preview || '#'"
              class="group block"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] mb-4">
                    {{ selfProjects[2]?.description }}
                  </p>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap">
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
            </NuxtLink>
          </Motion>

          <!-- Right Card (wider) -->
          <Motion
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.3 }"
            :in-view-options="{ once: true }"
            class="w-full"
          >
            <NuxtLink
              :to="selfProjects[3]?.links?.preview || '#'"
              class="group block h-full"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px] mb-4">
                    {{ selfProjects[3]?.description }}
                  </p>
                  <!-- Action buttons -->
                  <div class="flex items-center gap-2 flex-wrap">
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
            </NuxtLink>
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
