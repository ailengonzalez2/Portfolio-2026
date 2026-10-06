// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'motion-v/nuxt',
    '@nuxtjs/i18n'
  ],

  // fx/ components are used by bare name (<ResolveImage>, <ParticleName>, ...)
  components: [
    { path: '~/components/fx', pathPrefix: false },
    '~/components'
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      script: [
        {
          'src': 'https://umami.codecave.ar/script.js',
          'data-website-id': '3bdc851d-7f3e-402e-9712-cdb5a201091e',
          'defer': true
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://ailengonzalez.ar',
    name: 'Ailen Gonzalez',
    description: 'Ailen Gonzalez — AI Product Engineer, frontend developer and product designer. I design and ship user-facing AI features and polished web experiences.'
  },

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    openrouter: {
      apiKey: '',
      model: 'anthropic/claude-sonnet-4.5'
    },
    public: {
      web3formsKey: ''
    }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/es'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Fraunces is loaded with all its variable axes via the stylesheet link
  // above; keep @nuxt/fonts from fetching a second copy.
  fonts: {
    families: [
      { name: 'Fraunces', provider: 'none' }
    ]
  },

  i18n: {
    defaultLocale: 'en',
    // Prefixed Spanish routes (/es/...) give each language its own indexable
    // URL; @nuxtjs/seo picks this up and emits hreflang alternates.
    strategy: 'prefix_except_default',
    baseUrl: 'https://ailengonzalez.ar',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-AR', name: 'Español', file: 'es.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    }
  },

  image: {
    quality: 80,
    format: ['webp', 'avif']
  },

  sitemap: {
    // The homepage sitemap was listing every project screenshot; keep the
    // sitemap focused on URLs.
    discoverImages: false
  }
})
