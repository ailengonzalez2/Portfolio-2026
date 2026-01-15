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
    description: 'Redesigning the data visualization experience for a leading fintech platform.',
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
    description: 'A minimalist e-commerce experience for a natural skincare brand. Featuring product categories, eco-friendly ingredients, and a clean aesthetic that lets the products shine.',
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
      figma: 'https://figma.com',
      preview: 'https://example.com'
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
    id: 'health-tracker',
    title: 'Personal website',
    description: 'A comprehensive health tracking application with personalized insights, goal setting, and progress visualization for users to monitor their wellness journey.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    tags: ['Product Design', 'Mobile App', 'UX Research'],
    date: '2023',
    links: {
      figma: 'https://figma.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'mobile-app',
    title: 'Sports App',
    description: 'Complete redesign of a fashion e-commerce platform focusing on conversion optimization, improved product discovery, and seamless checkout experience.',
    image: '/projects/sportapp.png',
    tags: ['Mobile App', 'UI Design',],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/NrUDUZ01IIOcTc9xocvNmN/Ernie-APP?node-id=2606-59959&t=x7EujWUCTTqP2HUR-1',
    }
  },
  {
    id: 'web-design',
    title: 'Coaching website',
    description: 'A comprehensive health tracking application with personalized insights, goal setting, and progress visualization for users to monitor their wellness journey.',
    image: '/projects/coaching.png',
    tags: ['Product Design', 'Web Design'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/mv9hkKYRdAOpGXnEmFwzVr/Ann-Russo?node-id=0-1&t=pd3BUh4fdEySghrj-1',
    }
  },
  {
    id: 'web-design',
    title: 'Coff',
    description: 'A bold fitness platform designed to empower users through personalized training, on-demand workouts, and a supportive community. Modern design meets real results.',
    image: '/projects/coff.png',
    tags: ['UI Design', 'Web App'],
    date: '2025',
    links: {
      figma: 'https://www.figma.com/design/oeI3muavH7HTssmcUqljQq/COFF?node-id=0-1&t=HtgBVzNZjM9O5MAn-1',
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'UX/UI analysis',
    title: 'Chess-genius',
    description: 'I did a full analysis of the site, understanding it as a whole — focusing on the user flows and the overall user experience they create.',
    image: '/projects/chess-genius.png',
    tags: ['Mobile Design', 'UX Design'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/hmtwRrKwTTuH7YjIpo3NFU/Chess-genius?node-id=0-1&t=55RKGruKSdVJ4Hwy-1',
    }
  },
  {
    id: 'web-design',
    title: 'Rally & Road',
    description: 'A minimalist e-commerce experience for a natural skincare brand. Featuring product categories, eco-friendly ingredients, and a clean aesthetic that lets the products shine.',
    image: '/projects/rallyandroad.png',
    tags: ['Web Design', 'UI Design', 'Branding'],
    date: '2024',
    links: {
      figma: 'https://www.figma.com/design/GpXvzSlW3YKH5eHSqyaXm5/Rally-Roar?node-id=0-1&t=sryVldjPLz2nSYk7-1',
    }
  },
  {
    id: 'frontend-development',
    title: 'Cybervision',
    description: 'Redesigning the data visualization experience for a leading fintech platform with focus on real-time analytics and user engagement.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['Frontend Development', 'UX Design', 'UI Design'],
    date: '2024',
    links: {
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'product-design',
    title: 'Ecommerce cleaning product',
    description: 'Complete redesign of a fashion e-commerce platform focusing on conversion optimization, improved product discovery, and seamless checkout experience.',
    image: '/projects/ecommerce-cleaning.png',
    tags: ['Product Design', 'E-Commerce', 'UI Design',],
    date: '2024',
    links: {
      figma: 'https://figma.com',
    }
  }
]
