<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t, locale } = useI18n()
const localizedTo = useLocalizedTo()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('writing.title'),
  ogTitle: () => `${t('writing.title')} — Ailen Gonzalez`,
  description: () => t('writing.intro'),
  ogDescription: () => t('writing.intro')
})

const { data: posts } = await useAsyncData('writing-posts', () =>
  queryCollection('writing').order('date', 'DESC').all()
)

// Planned posts keep showing as teasers until a matching article is published.
const postKeys = ['streaming', 'ragEvals', 'figmaVue', 'defiUi'] as const
const publishedKeys = computed(() => new Set((posts.value || []).map(p => p.i18nKey)))
const comingSoonKeys = computed(() => postKeys.filter(k => !publishedKeys.value.has(k)))

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(locale.value === 'es' ? 'es-AR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
</script>

<template>
  <UPage>
    <section class="pt-24 pb-24 sm:pt-32 relative min-h-screen">
      <!-- Background decorations -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-violet-300/10 to-transparent rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-cyan-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <SectionEyebrow
            :label="$t('writing.section')"
            class="mb-8"
          />

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold text-heading dark:text-white tracking-tight mb-4">
            {{ $t('writing.title') }}
          </h1>
          <p class="text-base sm:text-lg text-body dark:text-neutral-400 leading-relaxed mb-16 max-w-2xl">
            {{ $t('writing.intro') }}
          </p>
        </Motion>

        <div class="space-y-3">
          <!-- Published posts -->
          <Motion
            v-for="(post, index) in posts"
            :key="post.path"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.4, delay: 0.1 + index * 0.05 }"
            :in-view-options="{ once: true }"
          >
            <NuxtLink
              :to="localePath(post.path)"
              class="group flex flex-col sm:flex-row gap-3 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-hairline dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div class="shrink-0">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary bg-primary/10">
                  {{ post.category }}
                </span>
              </div>
              <div class="grow">
                <h3 class="text-lg sm:text-xl font-semibold text-heading dark:text-white mb-1.5 leading-snug group-hover:text-primary transition-colors">
                  {{ post.title }}
                </h3>
                <p class="text-sm text-body dark:text-neutral-400 leading-relaxed mb-2">
                  {{ post.description }}
                </p>
                <p class="text-[11px] uppercase tracking-[0.5px] font-medium text-label">
                  {{ formatDate(post.date) }}<template v-if="post.readingTime"> · {{ post.readingTime }}</template>
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="hidden sm:block size-5 shrink-0 self-start text-label group-hover:text-primary transition-colors"
              />
            </NuxtLink>
          </Motion>

          <!-- Coming soon teasers -->
          <Motion
            v-for="(key, index) in comingSoonKeys"
            :key="key"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.4, delay: 0.1 + ((posts?.length || 0) + index) * 0.05 }"
            :in-view-options="{ once: true }"
          >
            <article class="group flex flex-col sm:flex-row gap-3 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-hairline dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm">
              <div class="shrink-0">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary-custom dark:text-neutral-300 bg-surface dark:bg-neutral-800">
                  {{ $t(`writing.posts.${key}.category`) }}
                </span>
              </div>
              <div class="grow">
                <h3 class="text-lg sm:text-xl font-semibold text-heading dark:text-white mb-1.5 leading-snug">
                  {{ $t(`writing.posts.${key}.title`) }}
                </h3>
                <p class="text-sm text-body dark:text-neutral-400 leading-relaxed mb-2">
                  {{ $t(`writing.posts.${key}.blurb`) }}
                </p>
                <p class="text-[11px] uppercase tracking-[0.5px] font-medium text-label">
                  {{ $t('writing.comingSoon') }}
                </p>
              </div>
            </article>
          </Motion>
        </div>

        <!-- CTA -->
        <Motion
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.4 }"
          :in-view-options="{ once: true }"
          class="mt-16 p-8 rounded-2xl bg-linear-to-br from-violet-50 to-orange-50 dark:from-violet-950/30 dark:to-orange-950/20 border border-violet-100 dark:border-violet-900/50 text-center"
        >
          <p class="text-base sm:text-lg text-primary-custom mb-4">
            {{ $t('writing.ctaText') }}
          </p>
          <UButton
            :to="localizedTo('/#contact')"
            size="lg"
            class="btn-gradient text-white rounded-full px-6"
          >
            {{ $t('writing.ctaButton') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>
        </Motion>
      </div>
    </section>
  </UPage>
</template>
