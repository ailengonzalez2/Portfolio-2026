export interface CaseStudy {
  /** Short headline shown under the hero image on the case study page */
  tagline?: string
  /** What was the user / business problem */
  problem: string
  /** What I did, key constraints, design / engineering decisions */
  approach: string
  /** Outcome — shipped, metrics, lessons */
  result: string
  /** Tech stack used */
  stack: string[]
  /** Optional role / scope summary */
  role?: string
  /** Optional client / context */
  client?: string
  /** Optional headline metrics for the hero — only rendered when present (no invented numbers) */
  metrics?: { value: string, label: string }[]
  /** Optional bullet list of key features / solution highlights */
  highlights?: string[]
  /** Optional bullet list of quantified or concrete outcomes shown under Result */
  outcomes?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  /** Path to image in /public/projects/ or external URL */
  image: string
  tags: string[]
  /** Tech stack used in the project */
  date: string
  links: {
    figma?: string
    github?: string
    preview?: string
  }
  /** Optional case study content. When present, the project links to an internal case study page. */
  caseStudy?: CaseStudy
}

/**
 * Projects data - Update this array to add/modify your projects.
 *
 * IMAGES:
 * - Local: Place images in /public/projects/ and use '/projects/filename.webp'
 * - External: Use full URLs (e.g., Unsplash, Cloudinary, etc.)
 * - Recommended formats: .webp, .avif (better compression), .jpg, .png
 * - Recommended size: min 1200px width, < 500KB file size
 *
 * See /public/projects/README.md for detailed image guidelines
 */
export const projects: Project[] = [
  {
    id: 'codecave',
    title: 'codeCave — Studio Site',
    description: 'The site for codeCave, a Córdoba-based product studio. A distinctive terminal-inspired identity with a neon-on-dark aesthetic, built end to end in Nuxt — "from idea to production".',
    image: '/projects/codecave.png',
    tags: ['Frontend Development', 'Web Design', 'Branding'],
    date: '2025',
    links: {
      preview: 'https://codecave.ar'
    },
    caseStudy: {
      tagline: 'Designed and built the studio\'s own site — a distinctive identity that proves the work.',
      role: 'Design + Frontend',
      client: 'codeCave',
      metrics: [
        { value: '2018', label: 'Building since' },
        { value: '50+', label: 'Projects shipped' },
        { value: '6', label: 'Person team' }
      ],
      problem: 'A studio site has to do more than list services — it has to be evidence. codeCave needed a homepage that immediately signals "we build distinctive, production-grade product", not another generic agency template with stock illustrations and a contact form.',
      approach: 'I gave the site a terminal-inspired identity: a neon-on-dark palette, monospace status readouts, and a command-line hero ("$ cave new") that animates "DE LA IDEA A PRODUCCIÓN". The whole thing is bilingual (ES/EN), built on Nuxt 4 + Tailwind, with a reusable case-study system so client work can be published with consistent structure.',
      highlights: [
        'Terminal-inspired hero with animated command-line output',
        'Bilingual ES/EN with full i18n',
        'Reusable case-study layout for client work',
        'Built end to end on Nuxt 4 + Tailwind'
      ],
      result: 'Shipped live at codecave.ar. The identity reads as a product, not a brochure, and the case-study system lets the team publish new work quickly while keeping a consistent voice.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'i18n']
    }
  },
  {
    id: 'habito',
    title: 'Habito — AI Task Management',
    description: 'Task management for the AI era, where humans and AI agents share one workspace and coordinate as real teammates. Product design and frontend for a clean, focused SaaS interface.',
    image: '/projects/habito.png',
    tags: ['Product Design', 'Web App', 'AI'],
    date: '2025',
    links: {
      preview: 'https://habito.ar'
    },
    caseStudy: {
      tagline: 'A task manager built for teams where humans and AI agents work side by side.',
      role: 'Product Design + Frontend',
      client: 'codeCave',
      problem: 'Most task tools treat AI as a bolt-on chat box. But teams increasingly delegate real work to agents, and there is no shared space where people and agents — even agents from different organizations — can coordinate as actual teammates with status, ownership, and accountability.',
      approach: 'I designed a workspace where any task can be owned by a person or an agent. The interface keeps it legible: clear task states, agent labels, and real-time sync so you always know who (or what) is doing what. The product surface stays calm and focused on a dark theme, with a marketing site that explains the "humans + agents" model without jargon.',
      highlights: [
        'Shared workspace for humans and AI agents',
        'Cross-organization agent coordination',
        'Real-time task status and ownership',
        'Calm, focused dark-theme product UI'
      ],
      result: 'Live at habito.ar with a marketing site and product app. The "new era AI" positioning gives a clear, opinionated take on how agent-assisted teams actually work.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Drizzle ORM']
    }
  },
  {
    id: 'docta',
    title: 'Docta — Córdoba Culture Agenda',
    description: 'A hand-curated cultural agenda for Córdoba — concerts, theatre, festivals and nightlife, refreshed daily. An editorial, print-inspired design that makes browsing what to do feel like reading a magazine.',
    image: '/projects/docta.jpg',
    tags: ['Web Design', 'Frontend Development', 'Editorial'],
    date: '2025',
    links: {
      preview: 'https://docta.ar'
    },
    caseStudy: {
      tagline: 'A hand-curated cultural agenda for Córdoba, designed to feel like reading a magazine.',
      role: 'Design + Frontend',
      client: 'codeCave',
      problem: 'Finding out what is on in Córdoba means scrolling fragmented Instagram accounts and word of mouth. There was no single, well-designed place to discover concerts, theatre, festivals and nightlife — and culture deserves a presentation better than an event-listing spreadsheet.',
      approach: 'I leaned into an editorial, print-inspired aesthetic: serif display type, a warm paper palette, and a front-page layout that treats the week\'s picks like a magazine cover ("La docta arde esta semana"). Listings are hand-curated daily and explorable through events, map, and calendar views — Spanish-first and unmistakably local.',
      highlights: [
        'Editorial, newspaper-inspired visual language',
        'Hand-curated listings, refreshed daily',
        'Events, map and calendar views',
        'Spanish-first, Córdoba-focused'
      ],
      result: 'Live at docta.ar. The design stands out in a sea of generic event sites and makes browsing what to do feel like an experience in itself.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Nuxt Content']
    }
  },
  {
    id: 'sports-app',
    title: 'Ernie — Sports Tracking App',
    description: 'A dynamic sports tracking mobile app designed to help athletes monitor performance, track workouts, and achieve their fitness goals with an engaging interface.',
    image: '/projects/sportapp.png',
    tags: ['Mobile App', 'Product Design'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/NrUDUZ01IIOcTc9xocvNmN/Ernie-APP?node-id=2606-59959&t=x7EujWUCTTqP2HUR-1'
    }
  },
  {
    id: 'yoga-wellness-app',
    title: 'Yoga & Wellness App',
    description: 'A mindful mobile experience designed to guide users through yoga practices, meditation sessions, and wellness tracking with an intuitive and calming interface.',
    image: '/projects/yogaapp.png',
    tags: ['Mobile App', 'Product Design', 'Wellness'],
    date: '2023',
    links: {
      figma: 'https://www.figma.com/design/S9bBTE8qAVUH2sYBgSAO0y/Yogapp?node-id=0-1&t=sWsqURcuHJjo9qCT-1'
    }
  }
]
