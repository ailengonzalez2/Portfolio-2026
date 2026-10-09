<script setup lang="ts">
definePageMeta({ colorMode: 'light' })

const route = useRoute()
const { locale } = useI18n()
const localizedTo = useLocalizedTo()

// Content lives at /writing/<slug> regardless of the locale prefix on the route.
const slug = computed(() => route.params.slug as string)

// Spanish when a translation exists, English otherwise.
const { data: post } = await useAsyncData(`writing-${locale.value}-${slug.value}`, async () => {
  const path = `/writing/${slug.value}`
  const translated = locale.value === 'es' ? await queryCollection('writing_es').path(path).first() : null
  return translated ?? await queryCollection('writing').path(path).first()
}, { watch: [locale] })

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
defineOgImage('BlogPostSatori', {
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
    <article class="pt-32 sm:pt-44 pb-24 sm:pb-32">
      <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:pl-28 lg:pr-16">
        <div class="max-w-2xl">
          <!-- Back link -->
          <NuxtLink
            :to="localizedTo('/writing')"
            class="inline-flex items-center gap-2 text-sm text-label hover:text-ink transition-colors mb-10"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4"
            />
            {{ $t('writing.back') }}
          </NuxtLink>

          <!-- Header -->
          <header class="mb-12">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-5">
              {{ post!.category }}
            </p>
            <h1 class="text-balance font-display font-normal text-4xl sm:text-6xl leading-[1.02] tracking-[-0.02em] text-ink dark:text-paper mb-6">
              {{ post!.title }}
            </h1>
            <p class="text-sm text-label">
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
        </div>
      </div>
    </article>
  </UPage>
</template>

<style scoped>
/* Editorial type for the article body — spacing and rhythm tuned to the site */
.prose-post :deep(h2) {
  font-family: var(--font-display);
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 3rem 0 1rem;
  color: var(--color-ink);
}

.dark .prose-post :deep(h2) {
  color: #fff;
}

.prose-post :deep(p) {
  margin: 0 0 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color-body);
}

.dark .prose-post :deep(p) {
  color: #a3a3a3;
}

.prose-post :deep(strong) {
  font-weight: 600;
  color: var(--color-ink);
}

.dark .prose-post :deep(strong) {
  color: #e5e5e5;
}

.prose-post :deep(a) {
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-color: #7643FF;
  text-underline-offset: 4px;
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
  color: var(--color-body);
  list-style: disc;
}

.dark .prose-post :deep(li) {
  color: #a3a3a3;
}

.prose-post :deep(pre) {
  margin: 0 0 1.5rem;
  padding: 1.25rem;
  border-radius: 6px;
  background: #121212;
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
  border-radius: 4px;
  background: rgba(43, 59, 255, 0.08);
  color: var(--color-ink);
}

.dark .prose-post :deep(:not(pre) > code) {
  background: rgba(255, 255, 255, 0.08);
  color: #e5e5e5;
}
</style>
