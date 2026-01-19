<script setup lang="ts">
const workExperience = [
  {
    title: 'Product Design',
    company: 'Codecave',
    period: 'August 2023 - Present (REMOTE)',
    description: 'Lead product design as advisor at Codecave, guiding projects from client planning and strategy through to delivery by collaborating closely with development teams to ensure high-standard outcomes. Utilize Figma, AI tools, Vue.js, Nuxt UI, TailwindCSS, and HTML/CSS to design and prototype user-centered solutions while maintaining accessibility and performance optimization across all deliverables.'
  },
  {
    title: 'UI Developer',
    company: 'Freelance',
    period: 'August 2023 - Present (REMOTE)',
    description: 'Led end-to-end design processes from research to high-fidelity prototypes using Figma and AI tools, then developed performance-optimized interfaces with Vue.js, Nuxt UI, TailwindCSS, and HTML/CSS. Leveraged AI workflows (ChatGPT, N8N) to accelerate development for international DeFi, blockchain, and cryptocurrency clients while ensuring accessibility and cross-browser compatibility.'
  },
  {
    title: 'Web Designer',
    company: 'Freelance',
    period: 'August 2019 - Present (REMOTE)',
  description: 'Designed and developed responsive websites using Figma, HTML, CSS, JavaScript, and Bootstrap for multiple concurrent projects with international teams, ensuring accessibility and optimal user experience through continuous testing and reviews.'
  },
  {
    title: 'Web Developer',
    company: 'Agency',
    period: 'August 2018 - Present (REMOTE)',
    description: 'Built e-commerce platforms, landing pages, and corporate websites using WordPress, WooCommerce, and Elementor with custom features and styling, while managing maintenance, content updates, and security optimizations.'
  }
]

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

const certifications = [
  {
    title: 'Motion Design in Figma',
    organization: 'Memorisely',
    type: 'On-line',
    year: '2025',
    logo: '/certifications/memorisely-logo.png'
  },
  {
    title: 'JavaScript Algorithms and Data Structures',
    organization: 'Free Code Camp',
    type: 'On-line',
    year: '2025',
    logo: '/certifications/freecodecamp-logo.png'
  },
  {
    title: 'Intro to Vue 3',
    organization: 'Vue Mastery',
    type: 'On-line',
    status: 'Ongoing',
    logo: '/certifications/vuemastery-logo.png'
  },
  {
    title: 'Programación con JavaScript- Meta',
    organization: 'Coursera',
    type: 'On-line',
    status: 'Ongoing',
    logo: '/certifications/coursera-logo.png'
  }
]
</script>

<template>
  <section
    id="about"
    class="py-10 sm:py-14 bg-[#f8fafc] dark:bg-[#0a0a0a]"
  >
    <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[155px]">
      <!-- Section Header -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <div class="mb-[66px] flex items-center justify-between">
          <div>
            <h2 class="text-[#a2a2a2] text-[20px] font-medium uppercase tracking-normal mb-[10px]">
              About
            </h2>
            <div class="h-[2px] w-[50px] bg-[#a2a2a2]" />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-row gap-3">
            <button class="h-[41px] px-3 py-1.5 bg-gradient-to-r from-[#09090b] to-[#09090b] border-[0.75px] border-[rgba(255,255,255,0.3)] rounded-lg shadow-[0px_0px_0px_1px_#121212] flex items-center justify-center gap-2.5 text-white text-base font-normal whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity">
              <UIcon
                name="i-lucide-download"
                class="size-3.5"
              />
              <span>Download CV</span>
            </button>

            <a
              href="https://cv.ailengonzalez.ar/"
              target="_blank"
              rel="noopener noreferrer"
              class="h-[41px] px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg shadow-[0px_0px_0px_1px_#121212] dark:shadow-[0px_0px_0px_1px_#404040] flex items-center justify-center gap-1 text-black dark:text-white text-base font-normal hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-[22px]"
              />
              <span>Explore all CV</span>
            </a>
          </div>
        </div>
      </Motion>

      <!-- Main Content -->
      <div class="relative mb-[121px]">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <!-- Left Column -->
          <div class="space-y-[41px]">
            <!-- Design + Code Section -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.1 }"
              :in-view-options="{ once: true }"
              class="space-y-5"
            >
              <h3 class="text-[#90a1b9] text-[14px] font-bold uppercase tracking-[1.25px]">
                Design + Code
              </h3>
              <p class="text-primary-custom text-[16px] leading-[26px] tracking-[-0.31px]">
                I mix solid design principles with practical, efficient development to create clean, responsive, and pixel-perfect interfaces. I take care of the whole process—from early research to prototypes to bringing everything to life with smooth, modern code.
              </p>
            </Motion>

            <!-- Work Experience -->
            <Motion
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.2 }"
              :in-view-options="{ once: true }"
              class="space-y-8"
            >
              <h3 class="text-[#90a1b9] text-[14px] font-bold uppercase tracking-[1.25px]">
                Work Experience
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
                  </div>
                </div>
              </div>
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
              <h3 class="text-[#90a1b9] text-[14px] font-bold uppercase tracking-[1.25px]">
                Skills
              </h3>

              <!-- Technical Skills -->
              <div class="space-y-[15px]">
                <h4 class="text-[#0f172b] dark:text-white text-[14px] font-semibold leading-[20px] tracking-[-0.15px]">
                  Technica
                </h4>
                <div class="space-y-5">
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
                  Soft
                </h4>
                <p class="text-primary-custom text-[16px] leading-[26px] tracking-[-0.31px]">
                  Autonomous work, active listening, attention to detail, clear communication, collaborative mindset, adaptability
                </p>
              </div>

              <!-- Languages -->
              <div class="space-y-4">
                <h4 class="text-[#0f172b] dark:text-white text-[14px] font-semibold leading-[20px] tracking-[-0.15px]">
                  Languages
                </h4>
                <div class="space-y-2">
                  <p class="text-primary-custom text-[14px] leading-[20px] tracking-[-0.15px]">
                    <span class="font-bold text-[#0f172b] dark:text-white">English:</span> C1 Advanced • Fluent communication
                  </p>
                  <p class="text-primary-custom text-[14px] leading-[20px] tracking-[-0.15px]">
                    <span class="font-bold text-[#0f172b] dark:text-white">Spanish:</span> Native
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
              <h3 class="text-[#90a1b9] text-[14px] font-bold uppercase tracking-[1.25px]">
                Latest Certifications
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
          </div>
        </div>
      </div>

      <!-- Fun Fact Card -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.4 }"
        :in-view-options="{ once: true }"
        class="max-w-[620px] mx-auto relative"
      >
        <div class="relative">
          <!-- Stethoscope Left -->
          <img
            src="/esteto-1.png"
            alt="stethoscope"
            class="absolute -left-26 -top-16 w-50 h-50 object-contain pointer-events-none z-10"
          >

          <div class="relative bg-white dark:bg-neutral-900 border border-[#f1f5f9] dark:border-neutral-700 rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-8 px-12 min-h-[229px]">
            <div class="space-y-2">
              <h3 class="text-[#0f172b] dark:text-white text-[18px] font-bold leading-[28px] tracking-[-0.44px]">
                My #funfact
              </h3>
              <p class="text-primary-custom text-[14px] leading-[22.75px] tracking-[-0.15px]">
                Before moving into tech I worked as a medical doctor from 2011 to 2021 in emergency departments across Argentina, after graduating from the Universidad Nacional de Córdoba — one of the country's leading universities. That experience shaped my analytical mindset and problem‑solving approach in design and development.
              </p>
            </div>
          </div>

          <!-- Stethoscope Right -->
          <img
            src="/esteto-2.png"
            alt="stethoscope"
            class="absolute right-40 -bottom-10 w-28 h-28 object-contain pointer-events-none z-10"
          >
        </div>
      </Motion>
    </div>
  </section>
</template>
