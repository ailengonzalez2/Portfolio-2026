// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
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
        // Mirrors the cheap checks of shouldUseWebGL before first paint, so the
        // hero title starts hidden behind the loading swirl (see main.css).
        {
          innerHTML: 'try{var m=navigator.deviceMemory;if(!/[?&]fx=off/.test(location.search)&&!matchMedia(\'(prefers-reduced-motion: reduce)\').matches&&!(m<4))document.documentElement.classList.add(\'fx-boot\')}catch(e){}',
          tagPosition: 'head'
        },
        {
          'src': 'https://umami.codecave.ar/script.js',
          'data-website-id': '3bdc851d-7f3e-402e-9712-cdb5a201091e',
          'defer': true
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://ailengonzalez.ar',
    name: 'Ailen Gonzalez',
    description: 'Ailen Gonzalez — AI product design and frontend. I design and build AI products end to end, from Figma to production code.'
  },

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    openrouter: {
      apiKey: '',
      model: 'anthropic/claude-sonnet-4.5'
    },
    // The brief generator (/api/brief, /api/lead) stays off until it ships:
    // set NUXT_BRIEF_ENABLED=true with the brief components back in the layout.
    briefEnabled: false,
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
      crawlLinks: true,
      // Nuxt's default (4 per core) runs ~30 renders at once. OG images are
      // CPU-bound on one thread and their 15s timeout starts on arrival, so
      // the tail of that queue timed out whenever the machine was busy.
      concurrency: 8
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

  // Self-hosted variable Red Hat Display for display type (no render-blocking
  // third-party stylesheet); the wght axis drives the resolve effect.
  fonts: {
    families: [
      { name: 'Red Hat Display', provider: 'google', weights: ['300 900'], styles: ['normal'] },
      // Static Fraunces for the social-share images only: their renderer
      // (Satori) can't use variable fonts. Local file in public/fonts.
      { name: 'FrauncesOG', provider: 'local', weights: [400], global: true }
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
