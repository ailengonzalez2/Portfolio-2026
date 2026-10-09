import type { Ref } from 'vue'
import { scrollProgress } from '~/webgl/math'

/**
 * Scroll progress (0–1) of `target`, with motion-style offsets
 * (see scrollProgress in webgl/math). Updates once per frame while scrolling
 * and on resize; a lightweight stand-in for motion-v's useScroll.
 */
export function useScrollProgress(target: Ref<HTMLElement | null>, offset: [string, string]) {
  const progress = ref(0)
  let raf = 0
  const measure = () => {
    raf = 0
    const el = target.value
    if (!el) return
    const r = el.getBoundingClientRect()
    progress.value = scrollProgress(window.scrollY, r.top + window.scrollY, r.height, window.innerHeight, offset)
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(measure)
  }
  onMounted(() => {
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })
  return progress
}
