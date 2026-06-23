export interface Testimonial {
  id: string
  /** The testimonial body text */
  quote: string
  /** Named attribution. When omitted, a neutral source label is shown instead. */
  author?: string
  /** Role / company line shown under the author name. */
  role?: string
  /** Optional link to the original public review (e.g. Upwork). */
  link?: string
}

// Real client testimonials, shown anonymized (no names) with a neutral source
// label in the component. Emptying this array hides the entire Testimonials
// section (no fake quotes ship).
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'Ailen is great - understands the projects quickly and puts together excellent work. She’s a great communicator and is quick to get things done. Will definitely continue to work with her on this and future projects!',
    author: 'Tim Keough',
    role: 'Upwork client',
    link: 'https://www.upwork.com/freelancers/ailengonzalez?mp_source=share'
  },
  {
    id: 'testimonial-2',
    quote: 'Ailen is a jewel here, her work is flawless and she’s highly communicative.',
    author: 'Rafael Rosas',
    role: 'Upwork client',
    link: 'https://www.upwork.com/freelancers/ailengonzalez?mp_source=share'
  },
  {
    id: 'testimonial-3',
    quote: 'Ailen brings rare range to the team — she thinks like a designer and builds like an engineer. She turns fuzzy ideas into polished, shippable AI features.',
    author: 'Nahuel Salto',
    role: 'codeCave Founder'
  }
]
