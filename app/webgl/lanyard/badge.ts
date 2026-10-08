// Conference badge artwork, drawn on 2D canvases and used as textures for the
// front and back of the 3D badge. Also the strap's repeating print.

export const BADGE_W = 1000
export const BADGE_H = 1420

export interface BadgeText {
  first: string
  last: string
  role: string
  /** ribbon at the bottom of the front, e.g. "Speaker" */
  pass: string
  site: string
  /** short lines on the back */
  facts: string[]
}

const PAPER = '#F7F4EE'
const INK = '#121212'
const BODY = '#47453f'
const GRADIENT = ['#b86adf', '#ff6c63', '#ffb147']

const DISPLAY = '\'Fraunces\', Georgia, serif'
const SANS = '\'Geist\', system-ui, sans-serif'
const MONO = '\'Geist Mono\', ui-monospace, monospace'

export async function loadBadgeFonts() {
  await Promise.all([
    `400 140px ${DISPLAY}`,
    `500 40px ${SANS}`,
    `400 28px ${MONO}`
  ].map(f => document.fonts.load(f).catch(() => [])))
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function brandGradient(ctx: CanvasRenderingContext2D, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0)
  GRADIENT.forEach((c, i) => g.addColorStop(i / (GRADIENT.length - 1), c))
  return g
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Lanyard slot punched near the top edge. */
function slot(ctx: CanvasRenderingContext2D) {
  roundRect(ctx, BADGE_W / 2 - 90, 46, 180, 30, 15)
  ctx.fillStyle = 'rgba(18,18,18,0.82)'
  ctx.fill()
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: 'left' | 'right' | 'center' = 'left') {
  ctx.letterSpacing = `${spacing}px`
  ctx.textAlign = align
  ctx.fillText(text, x, y)
  ctx.letterSpacing = '0px'
}

export function drawBadgeFront(text: BadgeText, photo: HTMLImageElement | null) {
  const [c, ctx] = canvas(BADGE_W, BADGE_H)
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, BADGE_W, BADGE_H)

  // Header band with the brand gradient.
  ctx.fillStyle = brandGradient(ctx, 0, BADGE_W)
  ctx.fillRect(0, 110, BADGE_W, 150)
  ctx.fillStyle = '#fff'
  ctx.font = `400 30px ${MONO}`
  ctx.textBaseline = 'middle'
  spaced(ctx, 'PORTFOLIO · 2026', 70, 185, 6)
  spaced(ctx, 'ARG', BADGE_W - 70, 185, 6, 'right')
  slot(ctx)

  // Photo, cover-cropped into a rounded square.
  const size = 540
  const px = (BADGE_W - size) / 2
  const py = 320
  ctx.save()
  roundRect(ctx, px, py, size, size, 28)
  ctx.clip()
  ctx.fillStyle = '#e7e3db'
  ctx.fillRect(px, py, size, size)
  if (photo) {
    const s = Math.max(size / photo.width, size / photo.height)
    const w = photo.width * s
    const h = photo.height * s
    ctx.drawImage(photo, px + (size - w) / 2, py + (size - h) / 2, w, h)
  }
  ctx.restore()

  // Name and role.
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = INK
  ctx.font = `400 128px ${DISPLAY}`
  ctx.textAlign = 'center'
  ctx.fillText(text.first, BADGE_W / 2, 1010)
  ctx.fillText(text.last, BADGE_W / 2, 1125)
  ctx.fillStyle = BODY
  ctx.font = `500 38px ${SANS}`
  ctx.fillText(text.role, BADGE_W / 2, 1200)

  // Pass ribbon.
  ctx.fillStyle = INK
  ctx.fillRect(0, BADGE_H - 150, BADGE_W, 150)
  ctx.fillStyle = '#fff'
  ctx.font = `400 32px ${MONO}`
  ctx.textBaseline = 'middle'
  spaced(ctx, text.pass.toUpperCase(), 70, BADGE_H - 75, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `400 26px ${MONO}`
  spaced(ctx, text.site, BADGE_W - 70, BADGE_H - 75, 3, 'right')
  return c
}

export function drawBadgeBack(text: BadgeText, signature: HTMLImageElement | null) {
  const [c, ctx] = canvas(BADGE_W, BADGE_H)
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, BADGE_W, BADGE_H)
  slot(ctx)

  if (signature) {
    const w = 640
    const h = (signature.height / signature.width) * w
    ctx.drawImage(signature, (BADGE_W - w) / 2, 260, w, h)
  }

  ctx.fillStyle = BODY
  ctx.font = `400 34px ${MONO}`
  ctx.textBaseline = 'middle'
  text.facts.forEach((line, i) => spaced(ctx, line.toUpperCase(), BADGE_W / 2, 760 + i * 80, 5, 'center'))

  ctx.fillStyle = brandGradient(ctx, 0, BADGE_W)
  ctx.fillRect(0, BADGE_H - 40, BADGE_W, 40)
  return c
}

/** Strap print: dark woven band with the name repeating along it (runs along y). */
export function drawStrap(label: string) {
  const [c, ctx] = canvas(128, 1024)
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, 0, 128, 1024)
  // Fine weave lines.
  ctx.fillStyle = 'rgba(255,255,255,0.035)'
  for (let y = 0; y < 1024; y += 6) ctx.fillRect(0, y, 128, 2)
  ctx.save()
  ctx.translate(64, 0)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = brandGradient(ctx, 0, 1024)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '10px'
  // Fit the label to exactly one tile so the repeat has no seam.
  const text = `${label.toUpperCase()}   `
  ctx.font = `500 46px ${MONO}`
  const size = Math.min(56, 46 * (1000 / ctx.measureText(text).width))
  ctx.font = `500 ${size.toFixed(1)}px ${MONO}`
  ctx.fillText(text, 512, 0)
  ctx.restore()
  return c
}
