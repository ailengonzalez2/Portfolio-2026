import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    writing: defineCollection({
      type: 'page',
      source: 'writing/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category: z.string(),
        /** Matches the i18n key in writing.posts.* so the index can tell published from coming-soon */
        i18nKey: z.string(),
        readingTime: z.string().optional()
      })
    })
  }
})
