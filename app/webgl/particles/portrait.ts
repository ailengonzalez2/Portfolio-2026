import * as THREE from 'three'
import { gridSize } from '../math'
import { noiseChunk } from '../shaders/noise'
import { imageChunk, pointFragment } from '../shaders/image'
import { loadTexture, stageUniforms, themeColors } from '../materials/common'

// A halftone portrait made of particles: dot size follows darkness (shadows
// and hair = big ink dots, light = small gradient dots), the light background
// drops out. uMorph moves every particle onto the handwritten signature.
const vertex = /* glsl */`
attribute vec2 aUv;
attribute vec2 aStart;
attribute vec2 aSig;
attribute float aRand;
uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uSize;
uniform vec2 uMouse;
uniform float uProgress;
uniform float uMorph;
uniform float uTime;
uniform float uPixelRatio;
uniform float uCols;
uniform float uMouseRadius;
uniform vec3 uInk;
varying vec3 vColor;
varying float vAlpha;
${noiseChunk}
${imageChunk}

void main() {
  vec2 uv = coverUv(aUv, uSize, uImageSize);
  vec3 c = texture2D(uTexture, uv).rgb;
  float l = luma(c);
  float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));

  float delay = aRand * 0.4;
  float p = smoothstep(delay, delay + 0.6, uProgress);
  float m = smoothstep(aRand * 0.3, aRand * 0.3 + 0.7, uMorph);

  vec2 drift = vec2(sin(uTime * 0.4 + aRand * 40.0), cos(uTime * 0.33 + aRand * 30.0)) * 22.0;
  vec2 scattered = aStart * (uSize * 1.8 + 160.0) + drift;
  vec2 home = (aUv - 0.5) * uSize;
  vec2 sig = aSig * uSize + vec2(sin(uTime * 0.6 + aRand * 30.0), cos(uTime * 0.5 + aRand * 20.0)) * 1.5;
  vec2 pos = mix(mix(scattered, home, p), sig, m);

  vec2 d = pos - uMouse;
  pos += normalize(d + 0.0001) * smoothstep(uMouseRadius, 0.0, length(d)) * 34.0 * p * (1.0 - 0.6 * m);

  float dark = 1.0 - l;
  vec3 col = mix(uInk, brandGradient(aUv.x * 0.8 + aUv.y * 0.2), smoothstep(0.3, 0.8, l));
  col = mix(col, brandGradient(aSig.x + 0.5), m);

  // Drop the light grey wall (bright and unsaturated) but keep warm skin;
  // every particle joins the signature.
  float subject = max(1.0 - smoothstep(0.5, 0.62, l), smoothstep(0.11, 0.2, sat));
  float keep = mix(subject, 1.0, m);
  vColor = col;
  vAlpha = keep * smoothstep(0.0, 0.25, uProgress) * mix(0.5, 1.0, p);

  float cell = uSize.x / uCols;
  float size = mix(cell * mix(0.3, 1.55, dark), 2.4, m);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
  gl_PointSize = size * uPixelRatio;
}`

/** Opaque pixels of an image as points centered on 0, x in [-0.5, 0.5] of its width. */
async function sampleSignature(src: string) {
  const img = new Image()
  img.src = src
  await img.decode()
  const w = 400
  const h = Math.round(w * img.naturalHeight / img.naturalWidth)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { points: [] as [number, number][], ratio: h / w }
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  const points: [number, number][] = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3]! > 128) points.push([x / w - 0.5, 0.5 - y / h])
    }
  }
  return { points, ratio: h / w }
}

export interface ParticlePortraitOptions {
  src: string
  signatureSrc: string
  /** element width / height when built */
  aspect: number
  cols?: number
}

export async function createParticlePortrait(opts: ParticlePortraitOptions) {
  const [texture, signature] = await Promise.all([loadTexture(opts.src), sampleSignature(opts.signatureSrc)])
  const image = texture.image as HTMLImageElement
  const { cols, rows } = gridSize(opts.cols ?? 120, opts.aspect)
  const n = cols * rows

  // Signature spans 90% of the box width; keep its proportions in a box of this aspect.
  const sx = 0.9
  const sy = sx * signature.ratio * opts.aspect
  const sig = signature.points.length ? signature.points : [[0, 0] as [number, number]]

  const aUv = new Float32Array(n * 2)
  const aStart = new Float32Array(n * 2)
  const aSig = new Float32Array(n * 2)
  const aRand = new Float32Array(n)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const s = sig[Math.floor(Math.random() * sig.length)]!
      aUv.set([(x + 0.5) / cols, (y + 0.5) / rows], i * 2)
      aStart.set([Math.random() - 0.5, Math.random() - 0.5], i * 2)
      aSig.set([s[0] * sx, s[1] * sy], i * 2)
      aRand[i] = Math.random()
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  geometry.setAttribute('aUv', new THREE.BufferAttribute(aUv, 2))
  geometry.setAttribute('aStart', new THREE.BufferAttribute(aStart, 2))
  geometry.setAttribute('aSig', new THREE.BufferAttribute(aSig, 2))
  geometry.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1))

  const { ink } = themeColors()
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      ...stageUniforms(),
      uTexture: { value: texture },
      uImageSize: { value: new THREE.Vector2(image.width, image.height) },
      uProgress: { value: 0 },
      uMorph: { value: 0 },
      uCols: { value: cols },
      uMouseRadius: { value: 120 },
      uInk: { value: ink },
      uOpacity: { value: 1 }
    }
  })
  return new THREE.Points(geometry, material)
}
