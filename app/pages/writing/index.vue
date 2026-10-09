<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const { t } = useI18n()
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

// "7 min read" → "7 min" (reads the same in both languages).
const minutes = (readingTime?: string) => readingTime?.match(/\d+/)?.[0]
</script>

<template>
  <UPage>
    <section class="pt-32 sm:pt-44 pb-24 sm:pb-32">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <ResolveText
          :text="$t('writing.title')"
          tag="h1"
          on="load"
          class="max-w-[14em] text-balance font-display font-normal text-5xl sm:text-7xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-paper"
        />
        <p class="mt-8 max-w-xl text-lg text-body">
          {{ $t('writing.intro') }}
        </p>

        <!-- Editorial index: one row per post. Titles and blurbs come from
             i18n so the list reads in the page's language. -->
        <ol class="posts mt-16 sm:mt-24 border-b border-hairline">
          <li
            v-for="post in posts"
            :key="post.path"
          >
            <NuxtLink
              :to="localePath(post.path)"
              class="post group"
            >
              <p class="text-sm text-label">
                {{ $t(`writing.posts.${post.i18nKey}.category`) }}
                <span
                  v-if="minutes(post.readingTime)"
                  class="block mt-1"
                >{{ minutes(post.readingTime) }} min</span>
              </p>
              <div>
                <h2 class="font-display font-normal text-2xl sm:text-3xl leading-tight text-ink dark:text-paper">
                  {{ $t(`writing.posts.${post.i18nKey}.title`) }}
                </h2>
                <p class="mt-3 max-w-xl text-body leading-relaxed">
                  {{ $t(`writing.posts.${post.i18nKey}.blurb`) }}
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="post-arrow hidden sm:block size-5 text-ink dark:text-paper"
              />
            </NuxtLink>
          </li>

          <!-- Planned posts without an article yet: same row, no link -->
          <li
            v-for="key in comingSoonKeys"
            :key="key"
          >
            <div class="post post--soon">
              <p class="text-sm text-label">
                {{ $t(`writing.posts.${key}.category`) }}
                <span class="block mt-1">{{ $t('writing.comingSoon') }}</span>
              </p>
              <div>
                <h2 class="font-display font-normal text-2xl sm:text-3xl leading-tight text-label">
                  {{ $t(`writing.posts.${key}.title`) }}
                </h2>
                <p class="mt-3 max-w-xl text-body leading-relaxed">
                  {{ $t(`writing.posts.${key}.blurb`) }}
                </p>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </UPage>
</template>

<style scoped>
.post {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 2rem 0 2.25rem;
  border-top: 1px solid var(--color-hairline);
  transition: opacity 0.3s ease;
}
@media (min-width: 640px) {
  .post {
    grid-template-columns: 10rem 1fr auto;
    gap: 2.5rem;
  }
}
.post:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 4px;
}
/* Hover, same gesture as the about page: the brand gradient draws across the
   row's top rule, the arrow comes in, the other rows step back. */
.post::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2B3BFF, #7643FF 50%, #C04BFF);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.post-arrow {
  opacity: 0;
  translate: -6px 6px;
  transition: opacity 0.3s ease, translate 0.3s ease;
}
a.post:hover::before,
a.post:focus-visible::before {
  transform: scaleX(1);
}
a.post:hover .post-arrow,
a.post:focus-visible .post-arrow {
  opacity: 1;
  translate: 0 0;
}
@media (hover: hover) {
  .posts:has(a.post:hover) li:not(:has(a.post:hover)) .post {
    opacity: 0.45;
  }
}
@media (prefers-reduced-motion: reduce) {
  .post,
  .post::before,
  .post-arrow {
    transition: none;
  }
}
</style>
