<script setup lang="ts">
const { t } = useI18n()

const cvHover = ref(false)

const workExperience = computed(() => [
  {
    key: 'productDesign',
    company: 'Codecave',
    badges: ['Figma', 'AI Tools', 'Vue.js', 'Nuxt UI', 'TailwindCSS', 'HTML/CSS']
  },
  {
    key: 'uiDeveloper',
    company: 'Freelance',
    badges: ['Figma', 'Vue.js', 'Nuxt UI', 'TailwindCSS', 'ChatGPT', 'N8N']
  },
  {
    key: 'webDesigner',
    company: 'Loymar S.A.',
    badges: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Bootstrap']
  },
  {
    key: 'webDeveloper',
    company: 'CodeCave',
    badges: ['WordPress', 'WooCommerce', 'Elementor']
  }
].map(job => ({
  ...job,
  title: t(`about.work.${job.key}.title`),
  period: t(`about.work.${job.key}.period`),
  description: t(`about.work.${job.key}.description`)
})))

const technicalSkills = [
  { icon: '/tech-icons/figma.svg', name: 'Figma' },
  { icon: '/tech-icons/xd.svg', name: 'Adobe XD' },
  { icon: '/tech-icons/html5.svg', name: 'HTML5' },
  { icon: '/tech-icons/css3.svg', name: 'CSS3' },
  { icon: '/tech-icons/bootstrap.svg', name: 'Bootstrap' },
  { icon: '/tech-icons/javascript.svg', name: 'JavaScript' },
  { icon: '/tech-icons/vue.svg', name: 'Vue.js' },
  { icon: '/tech-icons/nuxt.svg', name: 'Nuxt' },
  { icon: '/tech-icons/tailwind.svg', name: 'Tailwind CSS' },
  { icon: '/tech-icons/vuetify.svg', name: 'Vuetify' },
  { icon: '/tech-icons/github.svg', name: 'GitHub' },
  { icon: '/tech-icons/n8n.svg', name: 'n8n' },
  { icon: '/tech-icons/claude.svg', name: 'Claude AI' },
  { icon: '/tech-icons/copilot.svg', name: 'GitHub Copilot' },
  { icon: '/tech-icons/ethereum.svg', name: 'Ethereum' },
  { icon: '/tech-icons/blockchain.svg', name: 'Blockchain' }
]

const certifications = computed(() => [
  {
    title: 'Motion Design in Figma',
    organization: 'Memorisely',
    type: t('about.cert.online'),
    year: '2025',
    logo: '/certifications/memorisely-logo.png'
  },
  {
    title: 'JavaScript Algorithms and Data Structures',
    organization: 'Free Code Camp',
    type: t('about.cert.online'),
    year: '2025',
    logo: '/certifications/freecodecamp-logo.png'
  },
  {
    title: 'Intro to Vue 3',
    organization: 'Vue Mastery',
    type: t('about.cert.online'),
    status: t('about.cert.ongoing'),
    logo: '/certifications/vuemastery-logo.png'
  },
  {
    title: 'Programación con JavaScript- Meta',
    organization: 'Coursera',
    type: t('about.cert.online'),
    status: t('about.cert.ongoing'),
    logo: '/certifications/coursera-logo.png'
  }
])
</script>

<template>
  <section
    id="about"
    class="pt-16 sm:pt-24 pb-10 sm:pb-14 bg-[#f8fafc] dark:bg-[#0a0a0a]"
  >
    <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[155px]">
      <!-- Main Content -->
      <div class="relative mb-[121px]">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <!-- Left Column -->
          <div class="space-y-[41px]">
            <!-- Work Experience -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.2 }"
              :in-view-options="{ once: true }"
              class="space-y-8"
            >
              <h3 class="text-[#64748b] text-[14px] font-bold uppercase tracking-[1.25px]">
                {{ $t('about.workExperience') }}
              </h3>

              <div class="space-y-10">
                <div
                  v-for="(job, index) in workExperience"
                  :key="index"
                  class="relative border-l-2 border-[#e2e8f0] dark:border-gray-700 pl-8 min-h-[120px]"
                >
                  <!-- Timeline Dot -->
                  <div class="absolute -left-2 top-0 size-4 rounded-full bg-[#ad46ff] border-4 border-white dark:border-[#0a0a0a] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />

                  <!-- Job Content -->
                  <div class="space-y-2">
                    <h4 class="text-[#0f172b] dark:text-white text-[20px] font-bold leading-[28px] tracking-[-0.45px]">
                      {{ job.title }}
                    </h4>
                    <p class="text-[#62748e] text-[12px] leading-[16px] uppercase tracking-[0.3px]">
                      {{ job.company }} | {{ job.period }}
                    </p>
                    <p class="text-primary-custom text-[16px] leading-[26px] tracking-[-0.31px]">
                      {{ job.description }}
                    </p>
                    <!-- Tech Badges -->
                    <div class="flex flex-wrap gap-1.5 pt-2">
                      <span
                        v-for="badge in job.badges"
                        :key="badge"
                        class="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#f1f5f9] dark:bg-neutral-800 text-[#64748b] dark:text-neutral-300"
                      >
                        {{ badge }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View Full CV -->
              <a
                href="https://cv.ailengonzalez.ar/"
                target="_blank"
                rel="noopener noreferrer"
                class="group mt-10 ml-8 inline-flex h-[41px] px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg shadow-[0px_0px_0px_1px_#121212] dark:shadow-[0px_0px_0px_1px_#404040] items-center justify-center gap-1 text-black dark:text-white text-base font-normal hover:bg-black hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                @mouseenter="cvHover = true"
                @mouseleave="cvHover = false"
              >
                <Motion
                  :layout="true"
                  :transition="{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }"
                  :style="{ order: cvHover ? 2 : 1 }"
                  class="inline-flex"
                >
                  <UIcon
                    name="i-lucide-arrow-up-right"
                    class="size-[22px]"
                  />
                </Motion>
                <Motion
                  :layout="true"
                  :transition="{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }"
                  :style="{ order: cvHover ? 1 : 2 }"
                  class="inline-flex"
                >
                  <span>{{ $t('about.exploreCv') }}</span>
                </Motion>
              </a>
            </Motion>
          </div>

          <!-- Right Column -->
          <div class="space-y-10">
            <!-- Skills Section -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.2 }"
              :in-view-options="{ once: true }"
              class="space-y-[25px]"
            >
              <h3 class="text-[#64748b] text-[14px] font-bold uppercase tracking-[1.25px]">
                {{ $t('about.skills') }}
              </h3>

              <!-- Technical Skills -->
              <div class="space-y-[15px]">
                <h4 class="text-[#0f172b] dark:text-white text-[14px] font-semibold leading-[20px] tracking-[-0.15px]">
                  {{ $t('about.technical') }}
                </h4>
                <!-- Mobile: 3 rows with flex-wrap -->
                <div class="flex flex-wrap gap-3 sm:hidden">
                  <img
                    v-for="skill in technicalSkills"
                    :key="skill.name"
                    :src="skill.icon"
                    :alt="skill.name"
                    :title="skill.name"
                    class="size-[32px] object-contain"
                  >
                </div>
                <!-- Desktop: 2 rows -->
                <div class="hidden sm:block space-y-5">
                  <div class="flex gap-[15px] items-center">
                    <img
                      v-for="skill in technicalSkills.slice(0, 8)"
                      :key="skill.name"
                      :src="skill.icon"
                      :alt="skill.name"
                      :title="skill.name"
                      class="size-[38px] object-contain"
                    >
                  </div>
                  <div class="flex gap-[15px] items-center">
                    <img
                      v-for="skill in technicalSkills.slice(8)"
                      :key="skill.name"
                      :src="skill.icon"
                      :alt="skill.name"
                      :title="skill.name"
                      class="size-[38px] object-contain"
                    >
                  </div>
                </div>
              </div>

              <!-- Soft Skills -->
              <div class="space-y-[15px]">
                <h4 class="text-[#0f172b] dark:text-white text-[14px] font-semibold leading-[20px] tracking-[-0.15px]">
                  {{ $t('about.soft') }}
                </h4>
                <p class="text-primary-custom text-[16px] leading-[26px] tracking-[-0.31px]">
                  {{ $t('about.softBody') }}
                </p>
              </div>

              <!-- Languages -->
              <div class="space-y-4">
                <h4 class="text-[#0f172b] dark:text-white text-[14px] font-semibold leading-[20px] tracking-[-0.15px]">
                  {{ $t('about.languages') }}
                </h4>
                <div class="space-y-2">
                  <p class="text-primary-custom text-[14px] leading-[20px] tracking-[-0.15px]">
                    <span class="font-bold text-[#0f172b] dark:text-white">{{ $t('about.english') }}:</span> {{ $t('about.englishLevel') }}
                  </p>
                  <p class="text-primary-custom text-[14px] leading-[20px] tracking-[-0.15px]">
                    <span class="font-bold text-[#0f172b] dark:text-white">{{ $t('about.spanish') }}:</span> {{ $t('about.spanishLevel') }}
                  </p>
                </div>
              </div>
            </Motion>

            <!-- Latest Certifications -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.3 }"
              :in-view-options="{ once: true }"
              class="space-y-[15px]"
            >
              <h3 class="text-[#64748b] text-[14px] font-bold uppercase tracking-[1.25px]">
                {{ $t('about.certifications') }}
              </h3>

              <div class="space-y-[10px]">
                <div
                  v-for="(cert, index) in certifications"
                  :key="index"
                  class="flex gap-2 items-center"
                >
                  <img
                    :src="cert.logo"
                    :alt="cert.organization"
                    class="size-[30px] rounded object-cover flex-shrink-0"
                  >
                  <div class="min-w-0">
                    <p class="text-primary-custom text-[16px] font-medium leading-[26px] tracking-[-0.31px]">
                      {{ cert.title }}
                    </p>
                    <p class="text-[#62748e] text-[12px] leading-[16px] tracking-[0.3px]">
                      {{ cert.organization }} | {{ cert.type }} | {{ cert.year || cert.status }}
                    </p>
                  </div>
                </div>
              </div>
            </Motion>

            <!-- Fun Fact Card -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.4 }"
              :in-view-options="{ once: true }"
              class="relative mt-32 ml-16"
            >
              <div class="relative">
                <!-- Stethoscope Left -->
                <img
                  src="/esteto-1.png"
                  alt="stethoscope"
                  class="absolute -left-20 -top-12 w-40 h-40 object-contain pointer-events-none z-10"
                >

                <div class="relative bg-white dark:bg-neutral-900 border border-[#f1f5f9] dark:border-neutral-700 rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 px-8">
                  <div class="space-y-2">
                    <h3 class="text-[#0f172b] dark:text-white text-[18px] font-bold leading-[28px] tracking-[-0.44px]">
                      {{ $t('about.funfactLabel') }}
                    </h3>
                    <p class="text-primary-custom text-[14px] leading-[22.75px] tracking-[-0.15px]">
                      {{ $t('about.funfactBody') }}
                    </p>
                  </div>
                </div>

                <!-- Stethoscope Right -->
                <img
                  src="/esteto-2.png"
                  alt="stethoscope"
                  class="absolute right-20 -bottom-8 w-24 h-24 object-contain pointer-events-none z-10"
                >
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
