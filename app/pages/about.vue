<script setup lang="ts">
import { useScroll } from 'motion-v'
import { remap } from '~/webgl/math'

definePageMeta({ colorMode: 'light' })

const { t } = useI18n()

useSeoMeta({
  title: () => t('about.heading'),
  ogTitle: () => `${t('about.heading')} — Ailen Gonzalez`,
  description: () => t('about.designCodeBody'),
  ogDescription: () => t('about.designCodeBody')
})

// As the hero scrolls away the portrait becomes the signature, then dissolves.
const hero = ref<HTMLElement | null>(null)
const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
const heroScroll = ref(0)
let off: (() => void) | undefined
onMounted(() => {
  heroScroll.value = scrollYProgress.get()
  off = scrollYProgress.on('change', (v) => {
    heroScroll.value = v
  })
})
onBeforeUnmount(() => off?.())
const morph = computed(() => remap(heroScroll.value, 0.12, 0.5))
const fade = computed(() => remap(heroScroll.value, 0.6, 0.95))
</script>

<template>
  <UPage>
    <section
      ref="hero"
      class="relative -mt-20 pt-32 sm:pt-40 pb-20 sm:pb-28"
    >
      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <div class="lg:col-span-7 min-w-0 order-2 lg:order-1">
          <p class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-label">
            {{ $t('about.eyebrow') }}
          </p>
          <ResolveText
            :text="$t('about.statement')"
            :highlight="$t('about.statementHighlight')"
            tag="h1"
            on="load"
            class="mt-6 max-w-[15em] font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-[-0.02em] text-ink dark:text-paper"
          />
          <HalftoneReveal>
            <p class="mt-10 max-w-2xl text-lg leading-relaxed text-body">
              {{ $t('about.designCodeBody') }}
            </p>
            <NuxtLink
              to="https://cv.ailengonzalez.ar/"
              target="_blank"
              data-umami-event="view-cv"
              data-umami-event-location="about"
              class="btn-gradient inline-flex items-center gap-2 mt-10"
            >
              {{ $t('about.exploreCv') }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </NuxtLink>
          </HalftoneReveal>
        </div>

        <figure class="lg:col-span-5 order-1 lg:order-2 w-full max-w-[18rem] sm:max-w-sm lg:max-w-none mx-auto">
          <AboutParticlePortrait
            :morph="morph"
            :fade="fade"
            class="aspect-[4/5] w-full"
          />
          <figcaption class="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-label text-center lg:text-left">
            {{ $t('about.portraitCaption') }}
          </figcaption>
        </figure>
      </div>
    </section>
    <LandingAboutMe />
  </UPage>
</template>
