import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  /** Matches the i18n key in writing.posts.* so the index can tell published from coming-soon */
  i18nKey: z.string(),
  readingTime: z.string().optional()
})

export default defineContentConfig({
  collections: {
    writing: defineCollection({
      type: 'page',
      source: 'writing/*.md',
      schema: postSchema
    }),
    // Spanish translations: same slugs and paths (/writing/<slug>), picked by
    // locale on the post page, falling back to English when missing.
    writing_es: defineCollection({
      type: 'page',
      source: { include: 'writing/es/*.md', prefix: '/writing' },
      schema: postSchema
    })
  }
})
