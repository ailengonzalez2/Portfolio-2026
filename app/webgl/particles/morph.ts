import * as THREE from 'three'
import { gradientAt } from '../math'
import { pointFragment } from '../shaders/image'
import { stageUniforms } from '../materials/common'
import { sampleGlyphs } from './text'

// One set of particles that spells several words in turn. Every word's glyph
// pixels are sorted left to right and particle i takes the i-th of each, so a
// change of word flows across (left stays left) and the brand gradient, keyed
// to that rank, always runs cobalt → violet along the word.
// uProgress assembles the first word from a scattered field; uFrom/uTo/uMorph
// carry the particles from one word to the next, each leaving on its own
// delay and arcing a little on the way.
const vertex = /* glsl */`
attribute vec2 aStart;
attribute vec2 aT0;
attribute vec2 aT1;
attribute vec2 aT2;
attribute vec3 aColor;
attribute float aRand;
uniform float uProgress;
uniform float uFrom;
uniform float uTo;
uniform float uMorph;
uniform float uTime;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uMouseRadius;
uniform vec2 uMouse;
varying vec3 vColor;
varying float vAlpha;

vec2 targetOf(float w) {
  return w < 0.5 ? aT0 : (w < 1.5 ? aT1 : aT2);
}

void main() {
  float p = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);

  float m = clamp((uMorph - aRand * 0.4) / 0.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec2 a = targetOf(uFrom);
  vec2 b = targetOf(uTo);
  // Arc sideways mid-flight, then settle.
  vec2 dir = normalize(b - a + 0.0001);
  vec2 side = vec2(-dir.y, dir.x) * (aRand - 0.5) * 140.0 * sin(3.14159 * m);
  vec2 word = mix(a, b, m) + side;

  vec2 drift = vec2(sin(uTime * 0.4 + aRand * 40.0), cos(uTime * 0.33 + aRand * 30.0)) * 22.0 * (1.0 - p);
  vec2 pos = mix(aStart + drift, word, p);

  vec2 d = pos - uMouse;
  pos += normalize(d + 0.0001) * smoothstep(uMouseRadius, 0.0, length(d)) * 46.0;

  vColor = aColor;
  vAlpha = mix(smoothstep(0.0, 0.15, uProgress) * 0.45, 1.0, p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
  gl_PointSize = uPointSize * uPixelRatio * mix(1.7, 1.0, p) * (1.0 + 0.5 * sin(3.14159 * m));
}`

export interface ParticleMorphOptions {
  step?: number
  pointSize?: number
  mouseRadius?: number
}

/** Particles that spell each of `words` (up to three elements stacked inside `root`) in turn. */
export async function createParticleMorph(root: HTMLElement, words: HTMLElement[], opts: ParticleMorphOptions = {}) {
  await document.fonts.ready
  const step = opts.step ?? 3
  const box = root.getBoundingClientRect()
  const cx = box.left + box.width / 2
  const cy = box.top + box.height / 2
  // Each word's pixels, moved from its own center to the root's, sorted by x.
  const sets = words.slice(0, 3).map((el) => {
    const r = el.getBoundingClientRect()
    const ox = r.left + r.width / 2 - cx
    const oy = cy - (r.top + r.height / 2)
    return sampleGlyphs(el, step)
      .map(([x, y]) => [x + ox, y + oy] as [number, number])
      .sort((u, v) => u[0] - v[0])
  })
  if (!sets.length || sets.some(s => !s.length)) return null
  while (sets.length < 3) sets.push(sets[0]!)

  const n = Math.max(...sets.map(s => s.length))
  const vw = window.innerWidth
  const vh = window.innerHeight
  const ex = cx - vw / 2
  const ey = vh / 2 - cy
  const aStart = new Float32Array(n * 2)
  const targets = sets.map(() => new Float32Array(n * 2))
  const aColor = new Float32Array(n * 3)
  const aRand = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    aStart.set([(Math.random() - 0.5) * vw * 1.1 - ex, (Math.random() - 0.5) * vh * 1.1 - ey], i * 2)
    sets.forEach((s, w) => targets[w]!.set(s[Math.floor(i * s.length / n)]!, i * 2))
    aColor.set(gradientAt(i / n), i * 3)
    aRand[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  geometry.setAttribute('aStart', new THREE.BufferAttribute(aStart, 2))
  targets.forEach((t, w) => geometry.setAttribute(`aT${w}`, new THREE.BufferAttribute(t, 2)))
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
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uMorph: { value: 0 },
      uPointSize: { value: opts.pointSize ?? 3 },
      uMouseRadius: { value: opts.mouseRadius ?? 110 },
      uOpacity: { value: 1 }
    }
  })
  return new THREE.Points(geometry, material)
}
