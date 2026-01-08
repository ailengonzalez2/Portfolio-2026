export interface Project {
  id: string
  title: string
  description: string
  /** Path to image in /public/projects/ or external URL */
  image: string
  tags: string[]
  date: string
  links: {
    figma?: string
    github?: string
    preview?: string
  }
}

/**
 * Projects data - Update this array to add/modify your projects.
 * Images should be placed in /public/projects/ folder.
 * Supported formats: .jpg, .png, .webp, .avif
 */
export const projects: Project[] = [
  {
    id: 'defi-dashboard',
    title: 'DeFi Dashboard',
    description: 'Redesigning the data visualization experience for a leading fintech platform.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['UX Design', 'UI Design'],
    date: '2024',
    links: {
      figma: 'https://figma.com',
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools Platform',
    description: 'Building internal tools and developer experience improvements with a focus on productivity and efficiency.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['Developer Tools', 'UX Design', 'Nuxt', 'Design System'],
    date: '2024',
    links: {
      figma: 'https://figma.com',
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'ecotrack-app',
    title: 'EcoTrack Sustainability App',
    description: 'Created a mobile-first application to help users track and reduce their environmental impact. Translated complex sustainability metrics into an accessible interface.',
    image: 'https://images.unsplash.com/photo-1613858749733-3a3e456e3d9e?w=800&auto=format&fit=crop&q=80',
    tags: ['UX Research', 'UI Design', 'Mobile App'],
    date: '2023',
    links: {
      figma: 'https://figma.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'wavelength-music',
    title: 'Wavelength Music Streaming',
    description: 'Designed and developed the user interface for an indie music streaming service, focusing on discovery features and creating a unique listening experience.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    tags: ['UI Design', 'Front-End Dev', 'Animation'],
    date: '2023',
    links: {
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  },
  {
    id: 'health-tracker',
    title: 'Health & Wellness Tracker',
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
    id: 'ecommerce-redesign',
    title: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of a fashion e-commerce platform focusing on conversion optimization, improved product discovery, and seamless checkout experience.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    tags: ['E-Commerce', 'UI Design', 'Conversion Optimization'],
    date: '2022',
    links: {
      figma: 'https://figma.com',
      github: 'https://github.com',
      preview: 'https://example.com'
    }
  }
]
