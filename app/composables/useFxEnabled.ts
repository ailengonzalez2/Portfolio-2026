/**
 * True only after mount, when the WebGL path is active. Reading it after mount
 * keeps SSR and the first client render identical (no hydration mismatch).
 */
export function useFxEnabled() {
  const active = useState<boolean>('fx-active', () => false)
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  return computed(() => mounted.value && active.value)
}
