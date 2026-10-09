<script setup lang="ts">
import { projects } from '~/data/projects'
import { pageLabel } from '~/webgl/pageLabel'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// hreflang alternates, og:locale and the html lang attribute for the
// current route, generated from the i18n config.
const i18nHead = useLocaleHead({ lang: true, seo: true, dir: false })

useHead({
  // Pages set short titles ("About", project names); the home page overrides
  // the template with its full branded title.
  titleTemplate: (chunk?: string) => chunk ? `${chunk} — Ailen Gonzalez` : 'Ailen Gonzalez',
  meta: () => [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color.value },
    ...(i18nHead.value.meta || [])
  ],
  link: () => [
    { rel: 'icon', href: '/favicon.ico' },
    ...(i18nHead.value.link || [])
  ],
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs?.lang
  }
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Ailen Gonzalez',
  twitterCard: 'summary_large_image'
})

const fx = useFxEnabled()
const router = useRouter()
const { t } = useI18n()
const curtain = usePageCurtain()

// WebGL path: a paper curtain covers the page while particles assemble the
// destination's name, the route swaps underneath, then they disperse and the
// curtain lifts. Fallback: a plain cross-fade.
const pageTransition = computed(() => fx.value
  ? {
      name: 'curtain',
      mode: 'out-in' as const,
      css: false,
      onLeave: (_el: Element, done: () => void) => {
        const label = pageLabel(router.currentRoute.value.path, {
          t,
          projectTitle: id => projects.find(p => p.id === id)?.title
        })
        curtain.cover(label).then(done)
      },
      onAfterEnter: () => {
        curtain.reveal()
      }
    }
  : { name: 'fade', mode: 'out-in' as const })

// Default social-share image, auto-generated. Individual pages can override.
defineOgImageComponent('Hero')

// Structured data for search engines and rich results
useSchemaOrg([
  definePerson({
    name: 'Ailen Gonzalez',
    jobTitle: ['AI Product Designer', 'Frontend Developer'],
    description: 'AI product designer and frontend developer from Argentina. Designs and ships user-facing AI products end to end — from Figma to production Vue/Nuxt code.',
    url: 'https://ailengonzalez.ar',
    knowsAbout: [
      'Frontend Development',
      'Product Design',
      'AI Product Engineering',
      'LLM Integration',
      'RAG',
      'Vue.js',
      'Nuxt',
      'TypeScript',
      'Tailwind CSS',
      'Figma',
      'UX/UI Design',
      'Web3 Frontend'
    ],
    worksFor: {
      '@type': 'Organization',
      'name': 'codeCave',
      'url': 'https://codecave.ar'
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      'name': 'Universidad Nacional de Córdoba'
    },
    sameAs: [
      'https://www.linkedin.com/in/ailengonzalez/',
      'https://github.com/ailengonzalez2',
      'https://www.upwork.com/freelancers/ailengonzalez'
    ]
  }),
  defineWebSite({
    name: 'Ailen Gonzalez'
  })
])
</script>

<template>
  <UApp>
    <PageCurtain v-if="fx" />
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage :transition="pageTransition" />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
