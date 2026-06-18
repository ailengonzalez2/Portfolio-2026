/**
 * Runs before the app mounts on the client. If the intro animation is going to
 * be skipped (reduced-motion preference or already seen this session), tag the
 * <html> element so the CSS anti-flash overlay (html::before) is suppressed too.
 */
export default defineNuxtPlugin(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const alreadySeen = sessionStorage.getItem('introSeen') === '1'

  if (prefersReducedMotion || alreadySeen) {
    document.documentElement.classList.add('intro-skip')
  }
})
