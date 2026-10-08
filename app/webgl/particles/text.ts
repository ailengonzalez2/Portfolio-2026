import * as THREE from 'three'
import { gradientAt, swirlAxes, swirlOrbit, SWIRL_SPEED } from '../math'
import { pointFragment } from '../shaders/image'
import { stageUniforms } from '../materials/common'

const vertex = /* glsl */`
attribute vec2 aStart;
attribute vec2 aOrbit;
attribute vec2 aTarget;
attribute vec3 aColor;
attribute float aRand;
uniform float uProgress;
uniform float uTime;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uScatter;
uniform float uMouseRadius;
uniform vec2 uMouse;
uniform float uSwirl;
uniform vec2 uOrbit;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float delay = aRand * 0.35;
  float p = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);

  vec2 drift = vec2(sin(uTime * 0.4 + aRand * 40.0), cos(uTime * 0.33 + aRand * 30.0)) * 22.0 * (1.0 - p);
  // Before forming, particles either drift scattered over the viewport or
  // orbit the title (uSwirl = 1, the page-load swirl; see swirlAt in math.ts).
  float a = aOrbit.y + uTime * ${SWIRL_SPEED.toFixed(2)} / aOrbit.x;
  vec2 orbit = vec2(cos(a), sin(a)) * aOrbit.x * uOrbit;
  vec2 from = mix(aStart * uScatter + drift, orbit + drift * 0.3, uSwirl);
  vec2 pos = mix(from, aTarget, p);

  vec2 d = pos - uMouse;
  pos += normalize(d + 0.0001) * smoothstep(uMouseRadius, 0.0, length(d)) * 46.0;

  vColor = aColor;
  // Fade in as they start converging; fully dispersed text is invisible,
  // the swirl is visible from the start.
  vAlpha = mix(0.45, 1.0, p) * mix(smoothstep(0.0, 0.15, uProgress), 1.0, uSwirl);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
  gl_PointSize = uPointSize * uPixelRatio * mix(1.7, 1.0, p);
}`

export interface ParticleTextOptions {
  /** px between sampled glyph pixels (smaller = denser) */
  step?: number
  pointSize?: number
  scatter?: number
  mouseRadius?: number
}

const PAD = 48

/**
 * Draws the text nodes inside `el` into an offscreen canvas at their on-screen
 * positions and returns every `step`-th opaque pixel, relative to the
 * element's center (y up). Each node uses its parent's computed font.
 */
function sampleGlyphs(el: HTMLElement, step: number) {
  const rect = el.getBoundingClientRect()
  const w = Math.ceil(rect.width) + PAD * 2
  const h = Math.ceil(rect.height) + PAD * 2
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.fillStyle = '#000'
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim()
    const parent = node.parentElement
    if (!text || !parent || parent.closest('[aria-hidden="true"]')) continue
    const cs = getComputedStyle(parent)
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const ascent = ctx.measureText(text).fontBoundingBoxAscent
    // Draw word by word at each word's own rect, so wrapped text lands on the
    // right line.
    const content = node.textContent ?? ''
    for (const m of content.matchAll(/\S+/g)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = range.getClientRects()[0]
      if (!r) continue
      // Canvas can't apply variable-font optical sizing, so widths drift from
      // the DOM; squeeze each word to its on-screen width.
      const measured = ctx.measureText(m[0]).width
      const sx = measured > 0 ? r.width / measured : 1
      ctx.save()
      ctx.translate(r.left - rect.left + PAD, r.top - rect.top + PAD + ascent)
      ctx.scale(sx, 1)
      ctx.fillText(m[0], 0, 0)
      ctx.restore()
    }
  }
  const data = ctx.getImageData(0, 0, w, h).data
  const out: [number, number][] = []
  const cx = w / 2
  const cy = h / 2
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3]! > 128) out.push([x - cx, cy - y])
    }
  }
  return out
}

/** Particles that assemble into the glyphs of `el`'s text, colored by the brand gradient. */
export async function createParticleText(el: HTMLElement, opts: ParticleTextOptions = {}) {
  await document.fonts.ready
  const targets = sampleGlyphs(el, opts.step ?? 3)
  if (!targets.length) return null

  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Element center in viewport-centered coords: scattered starts cover the viewport.
  const ex = rect.left + rect.width / 2 - vw / 2
  const ey = vh / 2 - (rect.top + rect.height / 2)

  const n = targets.length
  const xs = targets.map(t => t[0])
  const minX = Math.min(...xs)
  const spanX = Math.max(1, Math.max(...xs) - minX)
  const aStart = new Float32Array(n * 2)
  const aTarget = new Float32Array(n * 2)
  const aOrbit = new Float32Array(n * 2)
  const aColor = new Float32Array(n * 3)
  const aRand = new Float32Array(n)
  targets.forEach(([x, y], i) => {
    aStart.set([(Math.random() - 0.5) * vw * 1.1 - ex, (Math.random() - 0.5) * vh * 1.1 - ey], i * 2)
    aTarget.set([x, y], i * 2)
    aOrbit.set(swirlOrbit(Math.random(), Math.random()), i * 2)
    aColor.set(gradientAt((x - minX) / spanX), i * 3)
    aRand[i] = Math.random()
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  geometry.setAttribute('aStart', new THREE.BufferAttribute(aStart, 2))
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(aTarget, 2))
  geometry.setAttribute('aOrbit', new THREE.BufferAttribute(aOrbit, 2))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3))
  geometry.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      ...stageUniforms(),
      uProgress: { value: 0 },
      uPointSize: { value: opts.pointSize ?? 3.6 },
      uScatter: { value: opts.scatter ?? 1 },
      uMouseRadius: { value: opts.mouseRadius ?? 110 },
      uOpacity: { value: 1 },
      uSwirl: { value: 0 },
      uOrbit: { value: new THREE.Vector2(...swirlAxes(rect.width, rect.height)) }
    }
  })
  return new THREE.Points(geometry, material)
}
