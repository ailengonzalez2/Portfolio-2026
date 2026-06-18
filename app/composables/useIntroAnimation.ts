export const useIntroAnimation = () => {
  const isIntroComplete = useState('introComplete', () => false)

  const setIntroComplete = () => {
    isIntroComplete.value = true
  }

  /**
   * Whether the full intro animation should play.
   * Skips when the user prefers reduced motion or has already seen it this session.
   * Client-only — returns false during SSR so nothing renders until hydration.
   */
  const shouldPlayIntro = () => {
    if (!import.meta.client) return false
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadySeen = sessionStorage.getItem('introSeen') === '1'
    return !prefersReducedMotion && !alreadySeen
  }

  const markIntroSeen = () => {
    if (import.meta.client) sessionStorage.setItem('introSeen', '1')
  }

  return {
    isIntroComplete,
    setIntroComplete,
    shouldPlayIntro,
    markIntroSeen
  }
}
