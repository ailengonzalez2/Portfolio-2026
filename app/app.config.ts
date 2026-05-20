export default defineAppConfig({
  global: {
    // TODO: drop a real profile image at /public/profile.png (square, min 800px)
    picture: {
      dark: '/profile.png',
      light: '/profile.png',
      alt: 'Ailen Gonzalez'
    },
    // TODO: replace with your real PUBLIC Calendly event link (not the admin URL).
    // Find it at: Calendly → Event Types → click an event → "Copy link"
    // Format: https://calendly.com/<handle>/<event-slug>
    meetingLink: 'https://calendly.com/ailengonzalez',
    email: 'hey@ailengonzalez.ar',
    available: true
  },
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      neutral: 'neutral'
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      }
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()} Ailen Gonzalez`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/AilenGonzalez',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ailengonzalez2',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'icon': 'i-simple-icons-upwork',
      'to': 'https://www.upwork.com/freelancers/ailengonzalez?mp_source=share',
      'target': '_blank',
      'aria-label': 'Upwork'
    }, {
      'icon': 'i-simple-icons-telegram',
      'to': 'https://t.me/AilenGonzalez',
      'target': '_blank',
      'aria-label': 'Telegram'
    }]
  }
})
