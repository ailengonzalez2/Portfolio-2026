<script setup lang="ts">
import { remap } from '~/webgl/math'

const { t } = useI18n()

// Most recent first; medicine closes the list as a quieter "before tech" entry.
const jobs = computed(() => [
  { key: 'productDesign', company: 'Codecave', current: true },
  { key: 'uiDeveloper', company: 'Freelance', current: true },
  { key: 'webDesigner', company: 'Loymark S.A.', current: false },
  { key: 'webDeveloper', company: 'CodeCave', current: false }
].map(job => ({
  ...job,
  title: t(`about.work.${job.key}.title`),
  period: t(`about.work.${job.key}.period`),
  description: t(`about.work.${job.key}.description`)
})))

const toolGroups = [
  { key: 'design', tools: [['figma', 'Figma'], ['xd', 'Adobe XD']] },
  { key: 'frontend', tools: [['vue', 'Vue.js'], ['nuxt', 'Nuxt'], ['javascript', 'JavaScript'], ['tailwind', 'Tailwind CSS'], ['html5', 'HTML5'], ['css3', 'CSS3'], ['vuetify', 'Vuetify'], ['bootstrap', 'Bootstrap'], ['github', 'GitHub']] },
  { key: 'ai', tools: [['claude', 'Claude AI'], ['copilot', 'GitHub Copilot'], ['n8n', 'n8n']] },
  { key: 'web3', tools: [['ethereum', 'Ethereum'], ['blockchain', 'Blockchain']] }
] as const

const certifications = computed(() => [
  { title: 'Claude Code in Action', organization: 'Anthropic', when: '2026' },
  { title: 'Introduction to Agent Skills', organization: 'Anthropic', when: '2026' },
  { title: 'AI Prototyping', organization: 'Memorisely', when: '2025' },
  { title: 'Vue Mastery', organization: 'Vue Mastery', when: t('about.cert.ongoing') }
])

// The trajectory line draws itself as the list scrolls through the viewport.
const timeline = ref<HTMLElement | null>(null)
const scrolled = useScrollProgress(timeline, ['start 0.75', 'end 0.6'])
const drawn = ref(1)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  watch(scrolled, (v) => {
    drawn.value = remap(v, 0, 1)
  }, { immediate: true })
})
</script>

<template>
  <section
    id="about"
    class="pb-24 sm:pb-32"
  >
    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
      <!-- Trajectory -->
      <div class="lg:col-span-7 min-w-0">
        <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
          {{ $t('about.trajectory') }}
        </h2>

        <ol
          ref="timeline"
          class="relative mt-10 pl-8"
        >
          <!-- hairline track + the part already drawn -->
          <div
            class="absolute left-[3px] top-2 bottom-2 w-px bg-hairline"
            aria-hidden="true"
          />
          <div
            class="absolute left-[3px] top-2 bottom-2 w-px bg-ink dark:bg-paper origin-top"
            :style="{ transform: `scaleY(${drawn})` }"
            aria-hidden="true"
          />

          <li
            v-for="job in jobs"
            :key="job.key"
            class="relative pb-14"
          >
            <span
              class="absolute -left-8 top-2 size-[7px] rounded-full"
              :class="job.current ? 'bg-linear-to-r from-[#2B3BFF] to-[#C04BFF]' : 'bg-ink dark:bg-paper'"
              aria-hidden="true"
            />
            <HalftoneReveal>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
                {{ job.period }}<template v-if="job.current">
                  · {{ $t('about.now') }}
                </template>
              </p>
              <h3 class="mt-2 font-display font-normal text-3xl sm:text-4xl leading-tight text-ink dark:text-paper">
                {{ job.title }}
                <span class="text-label"> — {{ job.company }}</span>
              </h3>
              <p class="mt-3 max-w-xl text-body leading-relaxed">
                {{ job.description }}
              </p>
            </HalftoneReveal>
          </li>

          <!-- Before tech: deliberately quieter -->
          <li class="relative">
            <span
              class="absolute -left-8 top-2 size-[7px] rounded-full border border-label bg-paper dark:bg-ink"
              aria-hidden="true"
            />
            <HalftoneReveal>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
                {{ $t('about.before') }} · {{ $t('about.medicine.period') }}
              </p>
              <h3 class="mt-2 font-display font-normal text-xl sm:text-2xl leading-tight text-label">
                {{ $t('about.medicine.title') }} — {{ $t('about.medicine.place') }}
              </h3>
              <p class="mt-2 max-w-lg text-sm text-label leading-relaxed">
                {{ $t('about.medicine.description') }}
              </p>
            </HalftoneReveal>
          </li>
        </ol>
      </div>

      <!-- Tools and certifications -->
      <div class="lg:col-span-5 min-w-0 space-y-16">
        <HalftoneReveal>
          <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
            {{ $t('about.tools') }}
          </h2>
          <dl class="mt-8 space-y-6">
            <div
              v-for="group in toolGroups"
              :key="group.key"
              class="grid grid-cols-[7rem_1fr] gap-4 items-baseline border-t border-hairline pt-4"
            >
              <dt class="font-mono text-[11px] uppercase tracking-[0.18em] text-label">
                {{ $t(`about.toolGroups.${group.key}`) }}
              </dt>
              <dd class="flex flex-wrap gap-x-4 gap-y-2">
                <span
                  v-for="[icon, name] in group.tools"
                  :key="name"
                  class="inline-flex items-center gap-1.5 text-ink dark:text-paper"
                >
                  <img
                    :src="`/tech-icons/${icon}.svg`"
                    alt=""
                    class="size-3.5 opacity-70 brightness-0 dark:invert"
                  >
                  {{ name }}
                </span>
              </dd>
            </div>
          </dl>
        </HalftoneReveal>

        <HalftoneReveal>
          <h2 class="font-mono font-normal text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
            {{ $t('about.certifications') }}
          </h2>
          <ul class="mt-8">
            <li
              v-for="cert in certifications"
              :key="cert.title"
              class="grid grid-cols-[5rem_1fr] gap-4 border-t border-hairline py-3"
            >
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-label pt-1">
                {{ cert.when }}
              </span>
              <span>
                <span class="block text-ink dark:text-paper">{{ cert.title }}</span>
                <span class="block font-mono text-[11px] uppercase tracking-[0.18em] text-label mt-1">{{ cert.organization }}</span>
              </span>
            </li>
          </ul>
        </HalftoneReveal>
      </div>
    </div>
  </section>
</template>
