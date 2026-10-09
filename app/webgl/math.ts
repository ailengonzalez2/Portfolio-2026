// Pure helpers for the WebGL stage and scroll choreography. No DOM, no three —
// unit-tested with `bun test`.

export interface Viewport { width: number, height: number }
export interface Rect { top: number, left: number, width: number, height: number }
export interface CapabilityEnv {
  reducedMotion: boolean
  webgl: boolean
  /** navigator.deviceMemory — undefined outside Chromium */
  deviceMemory?: number
  /** `?fx=off` escape hatch, also used to test the fallback */
  forcedOff?: boolean
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export const remap = (v: number, a: number, b: number) =>
  a === b ? (v >= b ? 1 : 0) : clamp01((v - a) / (b - a))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const easeOutCubic = (t: number) => 1 - (1 - clamp01(t)) ** 3

/**
 * 0 when the element's top touches the viewport bottom, 1 once it is centered
 * — or, for tall elements that never center (e.g. pinned with sticky near the
 * top), once their top reaches a quarter of the viewport.
 */
export function enterProgress(rect: Rect, viewportHeight: number) {
  const start = viewportHeight
  const end = Math.max(viewportHeight / 2 - rect.height / 2, viewportHeight * 0.25)
  return remap(start - rect.top, 0, start - end)
}

/** DOM rect → center/size in an orthographic pixel camera centered on the viewport, y up. */
export function rectToPlane(rect: Rect, vp: Viewport) {
  return {
    x: rect.left + rect.width / 2 - vp.width / 2,
    y: vp.height / 2 - (rect.top + rect.height / 2),
    width: rect.width,
    height: rect.height
  }
}

export function isOnScreen(rect: Rect, vp: Viewport, margin = 0) {
  return rect.top < vp.height + margin
    && rect.top + rect.height > -margin
    && rect.left < vp.width + margin
    && rect.left + rect.width > -margin
}

export function shouldUseWebGL(env: CapabilityEnv) {
  if (env.forcedOff || env.reducedMotion || !env.webgl) return false
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return false
  return true
}

export const splitWords = (text: string) => text.trim().split(/\s+/).filter(Boolean)

/** Progress of word i of n for an overall progress p; neighbouring words overlap. */
export function wordProgress(p: number, i: number, n: number, overlap = 2) {
  if (n <= 0) return 1
  const span = Math.min(1, overlap / n)
  const start = (i / n) * (1 - span)
  return remap(p, start, start + span)
}

const normalize = (w: string) => w.toLowerCase().replace(/[.,;:!?¿¡"“”'’()]/g, '')

/** [start, end) word indices of `phrase` inside `words`, or null. */
export function findPhrase(words: string[], phrase: string[]): [number, number] | null {
  if (!phrase.length) return null
  const target = phrase.map(normalize)
  const hay = words.map(normalize)
  for (let i = 0; i + target.length <= hay.length; i++) {
    if (target.every((w, k) => hay[i + k] === w)) return [i, i + target.length]
  }
  return null
}

/**
 * Hero name assembly for scroll progress p (0–1 over the pinned hero track):
 * follows the intro at the top, then disperses between 0.15 and 0.85.
 */
export const heroName = (p: number, intro: number) => intro * (1 - remap(p, 0.15, 0.85))

/** Angular speed of the loading swirl, in radians per second at radius 1. */
export const SWIRL_SPEED = 0.9

/** Semi-axes of the loading swirl ellipse around a title box. */
export const swirlAxes = (width: number, height: number): [number, number] => [width * 0.5, height * 0.6]

/** Random orbit for one swirl particle: radius (denser toward the core) and start angle. */
export const swirlOrbit = (u: number, v: number): [number, number] =>
  [0.12 + 0.78 * u ** 0.85, v * Math.PI * 2]

/**
 * Position at time t (s) of a particle orbiting the title center on an ellipse
 * with semi-axes (ax, ay). Inner orbits turn faster, like a vortex. The text
 * shader mirrors this so the 2D loader hands off to WebGL in place.
 */
export function swirlAt(radius: number, angle: number, t: number, ax: number, ay: number): [number, number] {
  const a = angle + (t * SWIRL_SPEED) / radius
  return [Math.cos(a) * radius * ax, Math.sin(a) * radius * ay]
}

/** Continuous stage index in [0, stages - 1] for progress p. */
export const stageAt = (p: number, stages: number) => clamp01(p) * (stages - 1)

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map(i => Number.parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
}

const VIOLET = hexToRgb01('#2B3BFF')
const CORAL = hexToRgb01('#7643FF')
const ORANGE = hexToRgb01('#C04BFF')

/** Brand gradient as particles use it: violet (left, 0) → coral → orange (right, 1). */
export function gradientAt(t: number): [number, number, number] {
  const c = clamp01(t)
  const [a, b, k] = c < 0.5 ? [VIOLET, CORAL, c * 2] : [CORAL, ORANGE, (c - 0.5) * 2]
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]
}

/** Particle grid for an image box: fixed columns, rows from the aspect ratio. */
export const gridSize = (cols: number, aspect: number) => ({ cols, rows: Math.max(1, Math.round(cols / aspect)) })

/** Opacity of the crisp DOM image over its particle layer (particles get 1 - this). */
export const crispAmount = (progress: number, latent: number) => remap(progress, 0.92, 1) * (1 - clamp01(latent))
