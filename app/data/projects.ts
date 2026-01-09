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
    image: '/projects/pureskin.png',
    tags: ['UX Design', 'UI Design'],
    date: '2024',
    links: {
      figma: 'https://figma.com',
      github: 'https://github.com',
      preview: 'https://example.com'
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
      figma: 'https://figma.com',
      github: 'https://github.com',
      preview: 'https://example.com'
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
      figma: 'https://figma.com',
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
