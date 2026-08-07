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

/**
 * Which section of the projects page a project belongs to.
 * `client` — paid client and studio work. `lab` — self-directed projects.
 * Required so a new project can't silently land in the wrong section.
 */
export type ProjectKind = 'client' | 'lab'

export interface Project {
  id: string
  kind: ProjectKind
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
    kind: 'client',
    title: 'codeCave — Studio Site',
    description: 'The site for codeCave, a Córdoba-based product studio. A distinctive terminal-inspired identity with a neon-on-dark aesthetic, built end to end in Nuxt — "from idea to production".',
    image: '/projects/covers/codecave.jpg',
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
    id: 'enter',
    kind: 'client',
    title: 'Enter — Sell Tickets Online',
    description: 'A ticketing platform made in Argentina: signed QR codes, a web scanner that works on any phone, and a flat 2% fee via Mercado Pago. A bold, retro ticket-stub identity that stands out from corporate ticketing.',
    image: '/projects/covers/enter.jpg',
    tags: ['SaaS', 'Web App', 'Product Design'],
    date: '2026',
    links: {
      preview: 'https://enter.ar'
    },
    caseStudy: {
      tagline: 'Ticketing without the friction — sell entradas in minutes, with a 2% fee and zero cost for free events.',
      role: 'Product Design + Frontend',
      client: 'codeCave',
      metrics: [
        { value: '2%', label: 'Fee per paid sale' },
        { value: 'ARS 0', label: 'For free events' },
        { value: '5 min', label: 'To start selling' }
      ],
      problem: 'Selling tickets in Argentina means choosing between big platforms with high fees and rigid contracts, or improvising with bank transfers and guest lists in WhatsApp. Organizers of parties, festivals and community events needed something simple, cheap and trustworthy — without hardware, paperwork or upfront costs.',
      approach: 'I designed Enter around a retro ticket-stub identity — perforated edges, stamp-style type and a warm paper palette that feels like a physical entrada, not a corporate checkout. Under that skin sits a serious product: signed QR codes unique per ticket, a web scanner that runs on any phone camera, numbered seating, discount codes, team roles and one-click refunds. Payments flow through Mercado Pago with installments, and free events cost nothing.',
      highlights: [
        'Signed QR codes, unique per ticket, to stop counterfeits',
        'Web-based scanner — any smartphone, no hardware',
        'Flat 2% fee via Mercado Pago; free events pay ARS 0',
        'Numbered seating, discount codes, team roles and refunds',
        'Retro ticket-stub visual identity, Spanish-first'
      ],
      result: 'Live at enter.ar. Organizers go from signup to selling in about five minutes, and the "hecho en Argentina" identity gives the product a personality the incumbent platforms don\'t have.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Mercado Pago API']
    }
  },
  {
    id: 'docta',
    kind: 'client',
    title: 'Docta — Córdoba Culture Agenda',
    description: 'A hand-curated cultural agenda for Córdoba — concerts, theatre, festivals and nightlife, refreshed daily. An editorial, print-inspired design that makes browsing what to do feel like reading a magazine.',
    image: '/projects/covers/docta.jpg',
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
    id: 'ef1',
    kind: 'client',
    title: 'eF1 — Eficiencia Constructiva',
    description: 'The site for a Córdoba construction company specialized in BIM and Lean Construction. A confident editorial hero over real obra photography, built to signal order, clarity and results.',
    image: '/projects/covers/ef1.jpg',
    tags: ['Web Design', 'Frontend Development', 'Branding'],
    date: '2026',
    links: {
      preview: 'https://ef1.up.railway.app/'
    },
    caseStudy: {
      tagline: 'A construction company that innovates deserves a site that shows it — not a template with stock photos.',
      role: 'Design + Frontend',
      client: 'eF1 — Eficiencia Constructiva',
      problem: 'eF1 manages construction projects with BIM modeling and Lean methodologies — a genuinely modern way of building. But most construction company sites look interchangeable: stock helmets, generic blue, a list of services. eF1 needed a web presence that matches how they actually work: precise, technological and trustworthy for investors who value order and results.',
      approach: 'I built the identity around their own material: full-bleed obra photography with a bold editorial headline — "Eficiencia constructiva." in mixed sans and script type — and a restrained yellow accent. The site walks through their six services, from Obra Digital (3D BIM models that resolve interferences before they cost money on site) to post-delivery support, with a recent-projects portfolio spanning residential, commercial and healthcare work.',
      highlights: [
        'Editorial hero over real construction photography',
        'Clear service architecture: BIM, cost control, dirección técnica',
        'Recent-projects portfolio across sectors',
        'Restrained palette with a single yellow accent'
      ],
      result: 'Shipped as the company\'s web presence. The site presents BIM and Lean Construction in plain language and gives eF1 a visual identity that separates it from template-built competitors.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS']
    }
  },
  {
    id: 'habito',
    kind: 'client',
    title: 'Habito — AI Task Management',
    description: 'Task management for the AI era, where humans and AI agents share one workspace and coordinate as real teammates. Product design and frontend for a clean, focused SaaS interface.',
    image: '/projects/covers/habito.jpg',
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
    id: 'asistente',
    kind: 'client',
    title: 'Asistente — Tu agenda trabaja sola',
    description: 'A booking SaaS for independent professionals in Argentina: a shareable reservations page, deposit collection, and automatic reminders — so the calendar runs itself.',
    image: '/projects/covers/asistente.jpg',
    tags: ['SaaS', 'Web App', 'Product Design'],
    date: '2026',
    links: {
      preview: 'https://asistente.ar/'
    },
    caseStudy: {
      tagline: 'A booking page that collects deposits and sends reminders on its own — so independent pros stop chasing no-shows.',
      role: 'Product Design + Frontend',
      problem: 'Independent professionals in Argentina — instructors, therapists, stylists, consultants — lose hours to DM back-and-forth and money to no-shows. The available options are either heavy international SaaS that ignore local payment habits, or a fragile mix of WhatsApp, a spreadsheet, and manual reminders.',
      approach: 'I designed and built a focused booking product around one promise: "tu agenda trabaja sola". Clients open a shareable page, pick a slot, and pay a deposit (seña) up front; the system then sends automatic reminders so appointments actually happen. The experience is Spanish-first, Argentina-specific, and friction-light — no credit card required to get started.',
      highlights: [
        'Shareable reservations page per professional',
        'Up-front deposit (seña) collection to cut no-shows',
        'Automatic appointment reminders',
        'Spanish-first, built for the Argentine market'
      ],
      result: 'Live at asistente.ar. The product turns a scattered WhatsApp-and-spreadsheet workflow into a single page that books, charges, and reminds — without manual chasing.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Drizzle ORM']
    }
  },
  {
    id: 'yoga-wellness-app',
    kind: 'client',
    title: 'Yoga & Wellness App',
    description: 'A mindful mobile experience designed to guide users through yoga practices, meditation sessions, and wellness tracking with an intuitive and calming interface.',
    image: '/projects/yogaapp.png',
    tags: ['Mobile App', 'Product Design', 'Wellness'],
    date: '2023',
    links: {
      figma: 'https://www.figma.com/design/S9bBTE8qAVUH2sYBgSAO0y/Yogapp?node-id=0-1&t=sWsqURcuHJjo9qCT-1'
    },
    caseStudy: {
      tagline: 'A calm, guided mobile experience for yoga, meditation, and wellness tracking.',
      role: 'Product Design',
      problem: 'Wellness apps often feel as noisy and demanding as the stress they claim to relieve — cluttered dashboards, aggressive streaks, and busy color. A yoga and meditation experience needs to feel like the practice itself: calm, focused, and unhurried.',
      approach: 'I designed a mobile experience around a soft, breathable visual language — generous spacing, gentle gradients, and quiet typography. The flows guide users through yoga sessions, meditation, and simple wellness tracking without overwhelming them, keeping each screen focused on a single clear next step.',
      highlights: [
        'Guided yoga and meditation session flows',
        'Lightweight wellness and progress tracking',
        'Calm, spacious visual language',
        'Mobile-first interaction and prototyping'
      ],
      result: 'Delivered as a complete mobile product design in Figma — a cohesive system of screens, components, and flows ready for development.',
      stack: ['Figma', 'Prototyping', 'Design System', 'iOS / Android']
    }
  },
  {
    id: 'brand-spark',
    kind: 'lab',
    title: 'Brand Spark — Live Brand Identity',
    description: 'Describe a brand in two or three sentences and watch a full identity generate live — name, palette, type pairings, voice and moodboard — restyling the page itself as it streams in.',
    image: '/projects/covers/brand-spark.jpg',
    tags: ['AI Product', 'LLM Integration', 'Product Design'],
    date: '2026',
    links: {
      preview: 'https://brand-spark.up.railway.app/'
    },
    caseStudy: {
      tagline: 'An AI brand generator that proves its own output by wearing it — the page adopts each identity as it streams in.',
      role: 'AI Product Design + Frontend',
      problem: 'Most AI branding tools hand back a static PDF or a grid of logos with no context. You see swatches, not a brand — nothing shows how the palette, typography and voice actually hold together in a real interface, which is the only thing that matters when you have to decide whether an identity works.',
      approach: 'I built the demo so the output has to prove itself: as the model streams a brand back, the page restyles itself with the generated palette and typefaces in real time. Each identity comes as structured data — named color tokens, primary and body type pairings with rationale, a voice statement with do and don\'t lists, and a moodboard whose imagery is generated to match. Every section can be regenerated on its own without discarding the rest, and the whole identity exports as JSON so it can go straight into design tokens.',
      highlights: [
        'Live theming — the page adopts the generated identity as it streams',
        'Structured output: color tokens, type pairings, voice, copy',
        'Per-section regeneration without losing the rest',
        'Generated moodboard imagery, plus mock site and social previews',
        'Export to JSON for handoff into design tokens'
      ],
      result: 'Live and open to try. It doubles as a working demo of the pieces a production AI feature needs — streaming, structured outputs, generated imagery and a UI that responds to model output rather than just printing it.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'LLM streaming', 'fal.ai']
    }
  },
  {
    id: 'loft-3d',
    kind: 'lab',
    title: 'Interactive Loft — 3D Scene',
    description: 'A loft you can orbit around in the browser. Everything that lights up on hover is clickable: furniture opens panels, objects on the table do their own thing, and a Shiba wanders through.',
    image: '/projects/covers/loft-3d.jpg',
    tags: ['3D / WebGL', 'Frontend Development', 'Interaction Design'],
    date: '2026',
    links: {
      preview: 'https://livingroom-3d-production.up.railway.app/'
    },
    caseStudy: {
      tagline: 'A hand-built 3D room where hovering teaches you what to click — no tutorial, no instructions overlay.',
      role: 'Design + Frontend',
      problem: 'Interactive 3D on the web usually fails in one of two ways: it looks good but you can\'t tell what you\'re allowed to touch, or it explains itself with an instructions overlay nobody reads. I wanted to see whether a scene could teach its own affordances through nothing but light.',
      approach: 'I assembled a loft from CC-licensed models and made hover the entire tutorial — anything interactive lights up when the cursor crosses it, so exploration teaches the rules. Clicking furniture opens a detail panel; small objects on the table each have their own behaviour; a Shiba moves around the space. Orbit and wheel-zoom handle navigation, and zooming out backs you out of any object, so there is no dead end. Geometry is DRACO-compressed to keep the scene loadable over a normal connection.',
      highlights: [
        'Hover highlighting as the only tutorial',
        'Clickable furniture with detail panels',
        'Individually scripted objects and a wandering Shiba',
        'Orbit + wheel navigation with zoom-out as universal escape',
        'DRACO-compressed geometry for reasonable load times'
      ],
      result: 'Live in the browser, no plugin or install. The scene is a testbed for interaction patterns in 3D — how to signal affordance, how to let someone leave a state without a back button, and how to keep an asset-heavy scene loading fast.',
      stack: ['Nuxt 4', 'Three.js', 'WebGL', 'GLTF / DRACO', 'TypeScript']
    }
  },
  {
    id: 'contap',
    kind: 'lab',
    title: 'Contap — NFC Nails',
    description: 'Nails with an NFC chip: someone holds a phone near your hand and whatever link you chose opens. A self-initiated product with a store, pricing and an editable destination per chip.',
    image: '/projects/covers/contap.jpg',
    tags: ['Product Design', 'E-commerce', 'Frontend Development'],
    date: '2026',
    links: {
      preview: 'https://nfc-website-production.up.railway.app/'
    },
    caseStudy: {
      tagline: 'Turning a physical object into a link you can change whenever you want.',
      role: 'Product Design + Frontend',
      problem: 'NFC products are usually sold as cards or keychains and explained in technical language that assumes you already know what NFC is. The interesting version — wearing the chip, so sharing a contact takes no object and no typing — needed a product story that made the idea obvious to someone who has never heard of the technology.',
      approach: 'I built the product site around the gesture rather than the technology: oversized type stating the promise ("tu contacto en tu mano"), a plain-language explainer for anyone asking what an NFC even is, and a shop where the chip and its destination are separate things — you buy the nail once and can point it anywhere afterwards. Accounts let each owner edit their own link.',
      highlights: [
        'Product story led by the gesture, not the technology',
        'Plain-language "what is an NFC?" explainer',
        'Store with product range and pricing',
        'Per-user account to edit the chip\'s destination link'
      ],
      result: 'Live with the storefront, explainer and account flow in place. The project is where I work through commerce and product-narrative problems end to end without a client brief shaping the answer.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']
    }
  }
]
