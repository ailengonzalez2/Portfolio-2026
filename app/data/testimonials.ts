export interface Testimonial {
  id: string
  /** The testimonial body text */
  quote: string
}

// Real client testimonials, shown anonymized (no names) with a neutral source
// label in the component. Emptying this array hides the entire Testimonials
// section (no fake quotes ship).
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'Ailen is great - understands the projects quickly and puts together excellent work. She’s a great communicator and is quick to get things done. Will definitely continue to work with her on this and future projects!'
  },
  {
    id: 'testimonial-2',
    quote: 'Ailen is a jewel here, her work is flawless and she’s highly communicative.'
  },
  {
    // Placeholder — a third real quote is coming.
    id: 'placeholder-3',
    quote: 'Placeholder testimonial — replace with a real client quote. The agent workflow she built just works, and the handoff was effortless.'
  }
]
