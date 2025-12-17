<script setup lang="ts">
const projects = [
  {
    title: 'DeFi Dashboard',
    description: 'Redesigning the data visualization experience for a leading fintech platform.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['UX Design', 'UI Design'],
    date: '2024'
  },
  {
    title: 'DeFi Dashboard',
    description: 'Redesigning the data visualization experience for a leading fintech platform.',    
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['Developer Tools', 'UX Design', 'Nuxt', 'Design System', 'Internal Tools'],
    date: '2024'
  },
  {
    title: 'EcoTrack Sustainability App',
    description: 'Created a mobile-first application to help users track and reduce their environmental impact. Translated complex sustainability metrics into an accessible and motivating user interface.',
    image: 'https://images.unsplash.com/photo-1613858749733-3a3e456e3d9e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    url: '#',
    tags: ['UX Research', 'UI Design', 'Mobile App'],
    date: '2023'
  },
  {
    title: 'Wavelength Music Streaming Service',
    description: 'Designed and developed the user interface for an indie music streaming service, focusing on discovery features and creating a unique, engaging listening experience using custom audio visualizations.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    url: '#',
    tags: ['UI Design', 'Front-End Dev', 'Animation'],
    date: '2023'
  }
]

// Split projects into categories
const selfProjects = computed(() => projects.slice(0, 4))
</script>

<template>
  <section class="py-16 sm:py-24 relative">
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
              :to="selfProjects[0]?.url"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px]">
                    {{ selfProjects[0]?.description }}
                  </p>
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
              :to="selfProjects[1]?.url"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px]">
                    {{ selfProjects[1]?.description }}
                  </p>
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
              :to="selfProjects[2]?.url"
              class="group block"
            >
              <div>
                <!-- Image container with badge - Same fixed height -->
                <div class="relative rounded-[30px] overflow-hidden h-[526px] w-full mb-8">
                  <NuxtImg
                    :src="selfProjects[2]?.image"
                    :alt="selfProjects[2]?.title"
                    class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px]">
                    {{ selfProjects[2]?.description }}
                  </p>
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
              :to="selfProjects[3]?.url"
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
                  <p class="text-[14px] text-[#62748e] dark:text-neutral-400 leading-[22.75px] tracking-[-0.15px]">
                    {{ selfProjects[3]?.description }}
                  </p>
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
          class="btn-gradient inline-block"
        >
          <span class="btn-gradient-text relative z-10">
            Explore Projects
          </span>
        </NuxtLink>
      </Motion>
    </div>
  </section>
</template>
