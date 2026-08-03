<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const route = useRoute()
const { locale } = useI18n()
const localizedTo = useLocalizedTo()

// Content lives at /writing/<slug> regardless of the locale prefix on the route.
const slug = computed(() => route.params.slug as string)

const { data: post } = await useAsyncData(`writing-${slug.value}`, () =>
  queryCollection('writing').path(`/writing/${slug.value}`).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: () => post.value!.title,
  ogTitle: () => `${post.value!.title} — Ailen Gonzalez`,
  description: () => post.value!.description,
  ogDescription: () => post.value!.description,
  ogType: 'article'
})

// Per-post social card: dark layout with category, title and reading time.
defineOgImageComponent('BlogPost', {
  title: post.value.title,
  category: post.value.category,
  readingTime: post.value.readingTime || ''
})

useSchemaOrg([
  defineArticle({
    headline: post.value.title,
    description: post.value.description,
    datePublished: post.value.date,
    author: {
      name: 'Ailen Gonzalez',
      url: 'https://ailengonzalez.ar'
    }
  })
])

const formattedDate = computed(() =>
  new Date(post.value!.date).toLocaleDateString(locale.value === 'es' ? 'es-AR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
)
</script>

<template>
  <UPage>
    <article class="pt-24 sm:pt-32 pb-24">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          :to="localizedTo('/writing')"
          class="inline-flex items-center gap-2 text-sm text-body dark:text-neutral-400 hover:text-primary transition-colors mb-8"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-4"
          />
          {{ $t('writing.back') }}
        </NuxtLink>

        <!-- Header -->
        <header class="mb-12">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.5px] font-medium text-primary bg-primary/10 mb-5">
            {{ post!.category }}
          </span>
          <h1 class="text-3xl sm:text-5xl font-bold text-heading dark:text-white tracking-tight leading-[1.1] mb-5">
            {{ post!.title }}
          </h1>
          <p class="text-sm text-label uppercase tracking-[0.5px] font-medium">
            Ailen Gonzalez · {{ formattedDate }}<template v-if="post!.readingTime">
              · {{ post!.readingTime }}
            </template>
          </p>
        </header>

        <!-- Body -->
        <ContentRenderer
          :value="post!"
          class="prose-post"
        />

        <!-- CTA -->
        <div class="mt-16 p-8 rounded-2xl bg-linear-to-br from-violet-50 to-orange-50 dark:from-violet-950/30 dark:to-orange-950/20 border border-violet-100 dark:border-violet-900/50 text-center">
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
        </div>
      </div>
    </article>
  </UPage>
</template>

<style scoped>
/* Editorial type for the article body — spacing and rhythm tuned to the site */
.prose-post :deep(h2) {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 2.5rem 0 1rem;
  color: var(--color-heading, #0f172b);
}

.dark .prose-post :deep(h2) {
  color: #fff;
}

.prose-post :deep(p) {
  margin: 0 0 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color-body, #45556c);
}

.dark .prose-post :deep(p) {
  color: #a3a3a3;
}

.prose-post :deep(strong) {
  font-weight: 600;
  color: var(--color-heading, #0f172b);
}

.dark .prose-post :deep(strong) {
  color: #e5e5e5;
}

.prose-post :deep(a) {
  color: var(--ui-primary, #a11ee2);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Headings get automatic anchor links — keep them looking like headings */
.prose-post :deep(h2 a),
.prose-post :deep(h3 a) {
  color: inherit;
  text-decoration: none;
}

.prose-post :deep(ul),
.prose-post :deep(ol) {
  margin: 0 0 1.25rem;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prose-post :deep(li) {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--color-body, #45556c);
  list-style: disc;
}

.dark .prose-post :deep(li) {
  color: #a3a3a3;
}

.prose-post :deep(pre) {
  margin: 0 0 1.5rem;
  padding: 1.25rem;
  border-radius: 1rem;
  background: #0f172b;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}

.prose-post :deep(pre code) {
  background: none;
  padding: 0;
  color: #e2e8f0;
}

.prose-post :deep(:not(pre) > code) {
  font-size: 0.875em;
  padding: 0.15em 0.4em;
  border-radius: 0.375rem;
  background: rgba(161, 30, 226, 0.08);
  color: var(--color-heading, #0f172b);
}

.dark .prose-post :deep(:not(pre) > code) {
  background: rgba(255, 255, 255, 0.08);
  color: #e5e5e5;
}
</style>
