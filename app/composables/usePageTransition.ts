export const usePageTransition = () => {
  const isTransitioning = useState('pageTransitioning', () => false)
  const pendingNavigation = useState<string | null>('pendingNavigation', () => null)
  const allowNavigation = useState('allowNavigation', () => false)

  const navigateWithTransition = async (to: string) => {
    if (isTransitioning.value) return

    pendingNavigation.value = to
    isTransitioning.value = true
  }

  const onCoverComplete = () => {
    // Called when pixels have covered the screen
    if (pendingNavigation.value) {
      // Allow this specific navigation to proceed
      allowNavigation.value = true
      navigateTo(pendingNavigation.value)
    }
  }

  const onRevealComplete = () => {
    // Called when pixels have revealed the new page
    isTransitioning.value = false
    pendingNavigation.value = null
    allowNavigation.value = false
  }

  return {
    isTransitioning: readonly(isTransitioning),
    pendingNavigation: readonly(pendingNavigation),
    allowNavigation,
    navigateWithTransition,
    onCoverComplete,
    onRevealComplete
  }
}
