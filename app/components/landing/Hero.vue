<script setup lang="ts">
const { global } = useAppConfig()

const techLogos = [
  { icon: '/tech-icons/figma-color.svg', label: 'Figma' },
  { icon: '/tech-icons/html-color.svg', label: 'HTML5' },
  { icon: '/tech-icons/css-color.svg', label: 'CSS3' },
  { icon: '/tech-icons/vue-color.svg', label: 'Vue' },
  { icon: '/tech-icons/tailwind-color.svg', label: 'Tailwind' },
  { icon: '/tech-icons/bootstrap-color.svg', label: 'Bootstrap' },
  { icon: '/tech-icons/javascript-color.svg', label: 'JavaScript' },
  { icon: '/tech-icons/github-color.svg', label: 'GitHub' },
  { icon: '/tech-icons/xd-color.svg', label: 'Adobe XD' },
  { icon: '/tech-icons/wp-color.svg', label: 'WordPress' }
]
</script>

<template>
  <section class="relative pt-16 sm:pt-24 lg:pt-32 pb-16 lg:pb-24">
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Available Badge -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        class="mb-10 lg:mb-12"
      >
        <div
          class="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,0.3)]"
        >
          <div class="flex items-center gap-3">
            <span class="relative flex size-2.5">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75 animate-ping"
                :class="global.available ? 'bg-emerald-400' : 'bg-red-400'"
              />
              <span
                class="relative inline-flex size-2.5 rounded-full"
                :class="global.available ? 'bg-emerald-400' : 'bg-red-400'"
              />
            </span>
            <span class="text-gray-400 dark:text-gray-500 text-base">
              {{ global.available ? 'Available for projects' : 'Not available' }}
            </span>
          </div>
          <span class="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span class="text-gray-400 dark:text-gray-500 text-base">GMT-3</span>
        </div>
      </Motion>

      <!-- Main Headline -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.1 }"
      >
        <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-medium tracking-tight leading-[1.15] text-primary-custom dark:text-gray-200">
          Building modern,
          <br>
          accessible
          <span class="relative font-semibold italic">
            <!-- Gradient glow behind "digital products" -->
            <span
              class="absolute inset-0 -inset-x-2 rounded-full opacity-60 blur-lg pointer-events-none"
              style="background: linear-gradient(90deg, #ffb86a 0%, #dab2ff 50%, #c27aff 100%)"
            />
            <span class="relative"> digital products</span>
          </span>
        </h1>
      </Motion>

      <!-- Tech Stack & CTA Row -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
        class="mt-16 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <!-- Tech Stack Icons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div
            v-for="tech in techLogos"
            :key="tech.label"
            class="flex items-center justify-center size-14 rounded-2xl bg-white dark:bg-gray-900 transition-transform duration-200 hover:scale-110 p-2"
            :title="tech.label"
          >
            <img
              :src="tech.icon"
              :alt="tech.label"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- Gradient Border Button -->
        <a
          href="#projects"
          class="group relative flex items-center justify-center h-[53px] px-10 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
          style="background: linear-gradient(-89deg, rgba(255, 177, 71, 0.1) 5.74%, rgba(255, 108, 99, 0.1) 50.64%, rgba(184, 106, 223, 0.1) 92.05%)"
        >
          <!-- Gradient border -->
          <span
            class="absolute inset-0 rounded-full border-[3px] border-transparent"
            style="background: linear-gradient(white, white) padding-box, linear-gradient(-89deg, #ffb147 5.74%, #ff6c63 50.64%, #b86adf 92.05%) border-box"
          />
          <span
            class="dark:hidden absolute inset-0 rounded-full border-[3px] border-transparent"
            style="background: linear-gradient(white, white) padding-box, linear-gradient(-89deg, #ffb147 5.74%, #ff6c63 50.64%, #b86adf 92.05%) border-box"
          />
          <span
            class="hidden dark:block absolute inset-0 rounded-full border-[3px] border-transparent"
            style="background: linear-gradient(#111827, #111827) padding-box, linear-gradient(-89deg, #ffb147 5.74%, #ff6c63 50.64%, #b86adf 92.05%) border-box"
          />
          <!-- Gradient text -->
          <span
            class="relative font-semibold text-lg sm:text-xl capitalize bg-clip-text text-transparent"
            style="background-image: linear-gradient(-89deg, #ffb147 5.74%, #ff6c63 50.64%, #b86adf 92.05%)"
          >
            Explore Projects
          </span>
        </a>
      </Motion>
    </div>
  </section>
</template>
