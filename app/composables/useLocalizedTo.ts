/**
 * Locale-aware wrapper around useLocalePath that also handles anchor links
 * like "/#contact", which plain localePath would drop the hash from.
 * Returns e.g. "/#contact" for the default locale and "/es#contact" for es.
 */
export const useLocalizedTo = () => {
  const localePath = useLocalePath()
  return (to: string) => {
    const [path, hash] = to.split('#')
    const localized = localePath(path || '/')
    return hash ? `${localized}#${hash}` : localized
  }
}
