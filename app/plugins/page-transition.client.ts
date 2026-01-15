export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { navigateWithTransition, isTransitioning, allowNavigation } = usePageTransition()

  // Intercept navigation to add pixel transition
  router.beforeEach((to, from, next) => {
    // Skip if it's the same page or a hash navigation
    if (to.path === from.path || to.hash) {
      next()
      return
    }

    // Allow navigation that was triggered after cover animation
    if (allowNavigation.value) {
      next()
      return
    }

    // Skip if already transitioning
    if (isTransitioning.value) {
      next(false)
      return
    }

    // Skip initial page load
    if (!from.name) {
      next()
      return
    }

    // Trigger transition
    navigateWithTransition(to.fullPath)

    // Prevent immediate navigation - it will happen after cover animation
    next(false)
  })
})
