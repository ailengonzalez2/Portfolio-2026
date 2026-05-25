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
    }
  },
  {
    id: 'defi-dashboard',
    title: 'CaveSwap — DeFi Dashboard',
    description: 'A shipped DeFi token-swap app with a clean, minimal UI. Built end-to-end: design, Vue/Nuxt frontend, wallet integration with Wagmi/Viem/Reown, and Railway deployment.',
    image: '/projects/defidashboard.png',
    tags: ['Frontend Development', 'Web3', 'Vue/Nuxt'],
    date: '2025',
    links: {
      github: 'https://github.com/ailengonzalez2/caveswap',
      preview: 'https://caveswap.up.railway.app'
    },
    caseStudy: {
      tagline: 'Designed, built, and shipped a minimal token-swap dApp.',
      role: 'Design + Frontend Engineering',
      problem: 'Most DeFi swap UIs are noisy, dense, and intimidating to new users. CaveSwap needed a token-swap surface that felt as simple as a fintech app while still exposing the technical details power users expect — wallet status, network, slippage, gas.',
      approach: 'I owned the project end-to-end. Started in Figma with a minimal visual language and a clear hierarchy: token pair on top, swap controls in the middle, wallet/network state on the periphery. Then built it in Nuxt 4 + Tailwind, integrated wallet connection via Reown / Wagmi / Viem, and deployed to Railway. Edge cases (network mismatch, insufficient balance, pending tx) were designed as part of the main flow, not afterthoughts.',
      result: 'Shipped live at caveswap.up.railway.app. Lightweight, clear UI that works on mobile and desktop. Used as a reference implementation for other Web3 frontend conversations and as a template for client work.',
      stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Wagmi', 'Viem', 'Reown', 'Railway']
    }
  },
  {
    id: 'pureskin-skincare',
    title: 'PureSkin — Skincare E-commerce',
    description: 'Clean skincare e-commerce design with intuitive product exploration, calm visual language, and a complete brand system. Designed in Figma with a focus on conversion clarity.',
    image: '/projects/pureskin.png',
    tags: ['E-Commerce', 'Product Design', 'Branding'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/F3he0m70Gyvawvr5xwypT7/Pureskin?node-id=312-779&t=z7Eu4KsSdtjHDvGq-1',
      preview: 'https://www.figma.com/proto/F3he0m70Gyvawvr5xwypT7/Pureskin?page-id=241%3A190&node-id=241-198&viewport=61%2C234%2C0.17&t=sJQRFxpHgjW1wle6-1&scaling=min-zoom&content-scaling=fixed'
    }
  },
  {
    id: 'coff-webapp',
    title: 'Coff — Coworking Platform',
    description: 'A modern coworking platform for remote workers to discover and book workspaces. Product design + frontend implementation focused on discovery, booking, and community.',
    image: '/projects/coff.png',
    tags: ['Product Design', 'Web App'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/oeI3muavH7HTssmcUqljQq/COFF?node-id=0-1&t=HtgBVzNZjM9O5MAn-1'
    }
  },
  {
    id: 'soma-fitness',
    title: 'Soma — Modern Fitness App',
    description: 'A bold mobile fitness platform with personalized training, on-demand workouts, and a women-only community. Mobile-first design with a focus on motivation and clear progress.',
    image: '/projects/soma.png',
    tags: ['Mobile App', 'Product Design'],
    date: '2023',
    links: {}
  },
  {
    id: 'coaching-website',
    title: 'Ann Russo — Coaching Website',
    description: 'A professional coaching website designed to showcase services, build client trust, and facilitate bookings with an elegant and approachable aesthetic.',
    image: '/projects/coaching.png',
    tags: ['Web Design', 'Product Design'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/mv9hkKYRdAOpGXnEmFwzVr/Ann-Russo?node-id=0-1&t=pd3BUh4fdEySghrj-1'
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
  },
  {
    id: 'chess-genius',
    title: 'Chess Genius — UX Analysis',
    description: 'A comprehensive UX/UI analysis of the Chess Genius platform, examining user flows, interaction patterns, and opportunities for improved user experience.',
    image: '/projects/chess-genius.png',
    tags: ['UX Research', 'Product Design'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/hmtwRrKwTTuH7YjIpo3NFU/Chess-genius?node-id=0-1&t=55RKGruKSdVJ4Hwy-1'
    }
  },
  {
    id: 'rally-road',
    title: 'Rally & Road',
    description: 'An automotive enthusiast platform celebrating car culture with bold visuals, event listings, and community features for rally and road trip lovers.',
    image: '/projects/rallyandroad.png',
    tags: ['Web Design', 'Product Design', 'Branding'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/GpXvzSlW3YKH5eHSqyaXm5/Rally-Roar?node-id=0-1&t=sryVldjPLz2nSYk7-1'
    }
  },
  {
    id: 'cleaning-ecommerce',
    title: 'Eco Cleaning — E-commerce',
    description: 'A fresh e-commerce platform for eco-friendly cleaning products featuring intuitive product browsing, subscription options, and a clean, trustworthy design.',
    image: '/projects/ecommerce-cleaning.png',
    tags: ['E-Commerce', 'Product Design'],
    date: '2024',
    links: {}
  }
]
