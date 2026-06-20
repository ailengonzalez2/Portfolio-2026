export interface Testimonial {
  id: string
  /** The testimonial body text */
  quote: string
  /** Author full name */
  name: string
  /** Author role, e.g. "Founder" */
  role: string
  /** Author company / context */
  company: string
}

// PLACEHOLDER testimonials — replace with real client quotes before relying on them.
// Emptying this array hides the entire Testimonials section (no fake quotes ship).
export const testimonials: Testimonial[] = [
  {
    id: 'placeholder-1',
    quote: 'Placeholder testimonial — replace with a real client quote. Ailen shipped our AI chat UI faster than we expected and the polish was outstanding.',
    name: 'Sample Client',
    role: 'Founder',
    company: 'Placeholder Co.'
  },
  {
    id: 'placeholder-2',
    quote: 'Placeholder testimonial — replace with a real client quote. Clear communication, pixel-perfect frontend, and real product thinking throughout.',
    name: 'Another Client',
    role: 'Product Lead',
    company: 'Example Studio'
  },
  {
    id: 'placeholder-3',
    quote: 'Placeholder testimonial — replace with a real client quote. The agent workflow she built just works, and the handoff was effortless.',
    name: 'Third Client',
    role: 'CTO',
    company: 'Demo Labs'
  }
]
