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
    id: 'defi-dashboard',
    title: 'DeFi Dashboard',
    description: 'Minimalist DeFi token swap app focused on simple, intuitive token exchanges.',
    image: '/projects/defidashboard.png',
    tags: ['Frontend Development', 'UI Design'],
    date: '2025',
    links: {
      github: 'https://github.com/ailengonzalez2/caveswap',
      preview: 'https://caveswap.up.railway.app'
    }
  },
  {
    id: 'pureskin-skincare',
    title: 'PureSkin - Skincare Autumn Collection',
    description: 'Clean skincare e-commerce design with intuitive product exploration.',
    image: '/projects/pureskin.png',
    tags: ['E-Commerce', 'UI Design', 'Branding'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/F3he0m70Gyvawvr5xwypT7/Pureskin?node-id=312-779&t=z7Eu4KsSdtjHDvGq-1',
      preview: 'https://www.figma.com/proto/F3he0m70Gyvawvr5xwypT7/Pureskin?page-id=241%3A190&node-id=241-198&viewport=61%2C234%2C0.17&t=sJQRFxpHgjW1wle6-1&scaling=min-zoom&content-scaling=fixed'
    }
  },
  {
    id: 'soma-fitness',
    title: 'Soma - Modern Fitness Revolution',
    description: 'A bold fitness platform designed to empower users through personalized training, on-demand workouts, and a supportive women-only community. Modern design meets real results.',
    image: '/projects/soma.png',
    tags: ['UI Design', 'Fitness', 'Mobile App'],
    date: '2023',
    links: {
      figma: 'https://www.figma.com/design/F3he0m70Gyvawvr5xwypT7/Pureskin?node-id=312-779&t=z7Eu4KsSdtjHDvGq-1',
      preview: 'https://www.figma.com/proto/F3he0m70Gyvawvr5xwypT7/Pureskin?page-id=241%3A190&node-id=241-198&viewport=61%2C234%2C0.17&t=sJQRFxpHgjW1wle6-1&scaling=min-zoom&content-scaling=fixed'
    }
  },
  {
    id: 'yoga-wellness-app',
    title: 'Yoga & Wellness App',
    description: 'A mindful mobile experience designed to guide users through yoga practices, meditation sessions, and wellness tracking with an intuitive and calming interface.',
    image: '/projects/yogaapp.png',
    tags: ['Mobile Design', 'UI Design', 'Wellness'],
    date: '2023',
    links: {
      figma: 'https://www.figma.com/design/S9bBTE8qAVUH2sYBgSAO0y/Yogapp?node-id=0-1&t=sWsqURcuHJjo9qCT-1',
    }
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    description: 'A modern personal portfolio website showcasing professional work, skills, and experience with a clean, minimalist design approach.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    tags: ['Web Design', 'UI Design'],
    date: '2023',
    links: {
      figma: 'https://www.figma.com/design/F3he0m70Gyvawvr5xwypT7/Pureskin?node-id=312-779&t=z7Eu4KsSdtjHDvGq-1',
      preview: 'https://www.figma.com/proto/F3he0m70Gyvawvr5xwypT7/Pureskin?page-id=241%3A190&node-id=241-198&viewport=61%2C234%2C0.17&t=sJQRFxpHgjW1wle6-1&scaling=min-zoom&content-scaling=fixed'
    }
  },
  {
    id: 'sports-app',
    title: 'Ernie - Sports App',
    description: 'A dynamic sports tracking mobile app designed to help athletes monitor performance, track workouts, and achieve their fitness goals with an engaging interface.',
    image: '/projects/sportapp.png',
    tags: ['Mobile App', 'UI Design'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/NrUDUZ01IIOcTc9xocvNmN/Ernie-APP?node-id=2606-59959&t=x7EujWUCTTqP2HUR-1'
    }
  },
  {
    id: 'coaching-website',
    title: 'Ann Russo - Coaching Website',
    description: 'A professional coaching website designed to showcase services, build client trust, and facilitate bookings with an elegant and approachable aesthetic.',
    image: '/projects/coaching.png',
    tags: ['Web Design', 'UI Design'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/mv9hkKYRdAOpGXnEmFwzVr/Ann-Russo?node-id=0-1&t=pd3BUh4fdEySghrj-1'
    }
  },
  {
    id: 'coff-webapp',
    title: 'Coff - Coworking Platform',
    description: 'A modern coworking space platform designed to help remote workers discover and book workspaces, connect with communities, and enhance productivity.',
    image: '/projects/coff.png',
    tags: ['UI Design', 'Web App'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/oeI3muavH7HTssmcUqljQq/COFF?node-id=0-1&t=HtgBVzNZjM9O5MAn-1',
      github: 'https://github.com/ailengonzalez2/caveswap',
    }
  },
  {
    id: 'chess-genius',
    title: 'Chess Genius - UX Analysis',
    description: 'A comprehensive UX/UI analysis of the Chess Genius platform, examining user flows, interaction patterns, and opportunities for improved user experience.',
    image: '/projects/chess-genius.png',
    tags: ['UX Design', 'UX Research'],
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
    tags: ['Web Design', 'UI Design', 'Branding'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/GpXvzSlW3YKH5eHSqyaXm5/Rally-Roar?node-id=0-1&t=sryVldjPLz2nSYk7-1'
    }
  },
  {
    id: 'cybervision',
    title: 'Cybervision',
    description: 'A data visualization dashboard for fintech with focus on real-time analytics, intuitive charts, and actionable insights for financial decision-making.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['Frontend Development', 'UI Design', 'Data Visualization'],
    date: '2024',
    links: { github: 'https://github.com/ailengonzalez2/caveswap',}
  },
  {
    id: 'cleaning-ecommerce',
    title: 'Cleaning Products E-commerce',
    description: 'A fresh e-commerce platform for eco-friendly cleaning products featuring intuitive product browsing, subscription options, and a clean, trustworthy design.',
    image: '/projects/ecommerce-cleaning.png',
    tags: ['E-Commerce', 'UI Design', 'Product Design'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/F3he0m70Gyvawvr5xwypT7/Pureskin?node-id=312-779&t=z7Eu4KsSdtjHDvGq-1',
      preview: 'https://www.figma.com/proto/F3he0m70Gyvawvr5xwypT7/Pureskin?page-id=241%3A190&node-id=241-198&viewport=61%2C234%2C0.17&t=sJQRFxpHgjW1wle6-1&scaling=min-zoom&content-scaling=fixed'
    }
  }
]
