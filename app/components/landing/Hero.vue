<script setup lang="ts">
const { global } = useAppConfig()

const socialLinks = [
  { icon: 'i-simple-icons-github', to: 'https://github.com', label: 'GitHub' },
  { icon: 'i-simple-icons-linkedin', to: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: 'i-simple-icons-x', to: 'https://x.com', label: 'X' },
  { icon: 'i-simple-icons-dribbble', to: 'https://dribbble.com', label: 'Dribbble' },
  { icon: 'i-simple-icons-codepen', to: 'https://codepen.io', label: 'CodePen' },
  { icon: 'i-simple-icons-behance', to: 'https://behance.net', label: 'Behance' }
]

const techLogos = [
  { icon: 'i-simple-icons-nuxtdotjs', label: 'Nuxt', color: '#00DC82' },
  { icon: 'i-simple-icons-vuedotjs', label: 'Vue', color: '#4FC08D' },
  { icon: 'i-simple-icons-react', label: 'React', color: '#61DAFB' },
  { icon: 'i-simple-icons-tailwindcss', label: 'Tailwind', color: '#06B6D4' },
  { icon: 'i-simple-icons-figma', label: 'Figma', color: '#F24E1E' },
  { icon: 'i-simple-icons-framer', label: 'Framer', color: '#0055FF' },
  { icon: 'i-simple-icons-typescript', label: 'TypeScript', color: '#3178C6' },
  { icon: 'i-simple-icons-vercel', label: 'Vercel', color: 'currentColor' }
]
</script>

<template>
  <section class="relative pt-16 sm:pt-24 lg:pt-32 pb-8">
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Logo/Branding small at top -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        class="mb-8"
      >
        <div class="inline-flex items-center gap-2 text-sm text-muted">
          <div class="size-6 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
            AG
          </div>
          <span class="font-medium">Ailen Gonzalez</span>
        </div>
      </Motion>

      <!-- Main Headline -->
      <Motion
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.1 }"
      >
        <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight leading-[1.1]">
          Building modern,
          <br>
          accessible
          <span class="relative inline-block">
            <span class="font-serif italic bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              digital products
            </span>
            <!-- Gradient underline decoration -->
            <svg
              class="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3"
              viewBox="0 0 200 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8C50 2 150 2 198 8"
                stroke="url(#underline-gradient)"
                stroke-width="4"
                stroke-linecap="round"
              />
              <defs>
                <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#8B5CF6" />
                  <stop offset="50%" stop-color="#D946EF" />
                  <stop offset="100%" stop-color="#FB923C" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
      </Motion>

      <!-- Social Links -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
        class="mt-8 flex items-center justify-center gap-1 sm:gap-2"
      >
        <UButton
          v-for="link in socialLinks"
          :key="link.label"
          :icon="link.icon"
          :to="link.to"
          target="_blank"
          color="neutral"
          variant="ghost"
          size="xs"
          :aria-label="link.label"
          class="text-muted hover:text-highlighted"
        />
      </Motion>

      <!-- Tech Logos -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }"
        class="mt-6 flex items-center justify-center gap-3 flex-wrap"
      >
        <div
          v-for="tech in techLogos"
          :key="tech.label"
          class="flex items-center justify-center size-9 sm:size-10 rounded-xl bg-elevated/60 backdrop-blur-sm border border-default/50 transition-all duration-200 hover:border-default hover:scale-105"
          :title="tech.label"
        >
          <UIcon
            :name="tech.icon"
            class="size-4 sm:size-5"
            :style="{ color: tech.color }"
          />
        </div>
      </Motion>

      <!-- CTA Buttons -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.5 }"
        class="mt-10 flex items-center justify-center gap-3 flex-wrap"
      >
        <UButton
          label="View my work"
          to="/projects"
          size="lg"
          class="rounded-full px-6"
        />
        <UButton
          :color="global.available ? 'success' : 'error'"
          variant="soft"
          size="lg"
          class="gap-2 rounded-full"
          :to="global.available ? global.meetingLink : undefined"
          :label="global.available ? 'Available for new projects' : 'Not available'"
        >
          <template #leading>
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75"
                :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
              />
              <span
                class="relative inline-flex size-2 scale-90 rounded-full"
                :class="global.available ? 'bg-success' : 'bg-error'"
              />
            </span>
          </template>
        </UButton>
      </Motion>
    </div>

    <!-- Wavy gradient divider at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      <svg
        class="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="wave-hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgb(221 214 254 / 0.3)" />
            <stop offset="50%" stop-color="rgb(251 207 232 / 0.3)" />
            <stop offset="100%" stop-color="rgb(254 215 170 / 0.3)" />
          </linearGradient>
        </defs>
        <path
          d="M0,64 C360,128 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,128 L0,128 Z"
          fill="url(#wave-hero-gradient)"
        />
      </svg>
    </div>
  </section>
</template>
