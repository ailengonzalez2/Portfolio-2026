/**
 * Fire a custom Umami event from code (for outcomes that aren't plain clicks,
 * e.g. "brief generated", "lead email sent"). Click-only CTAs use the
 * declarative `data-umami-event` attribute instead.
 */
export const trackEvent = (event: string, data?: Record<string, string | number>) => {
  if (import.meta.server) return
  ;(window as unknown as { umami?: { track: (e: string, d?: object) => void } }).umami?.track(event, data)
}
