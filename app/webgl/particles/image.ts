import * as THREE from 'three'
import { gridSize } from '../math'
import { noiseChunk } from '../shaders/noise'
import { imageChunk, pointFragment } from '../shaders/image'
import { loadTexture, stageUniforms, themeColors } from '../materials/common'

const vertex = /* glsl */`
attribute vec2 aUv;
attribute vec2 aStart;
attribute float aRand;
uniform sampler2D uTexture;
uniform sampler2D uLatentTexture;
uniform float uHasLatentTex;
uniform vec2 uImageSize;
uniform vec2 uSize;
uniform vec2 uViewport;
uniform vec2 uMouse;
uniform float uProgress;
uniform float uLatent;
uniform float uStage;
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
  vec3 img = texture2D(uTexture, uv).rgb;
  float edge = uHasLatentTex > 0.5
    ? 1.0 - luma(texture2D(uLatentTexture, uv).rgb)
    : smoothstep(0.12, 0.45, sobel(uTexture, uv, 1.5 / uImageSize));

  // Assembly: scattered across the viewport (brand colors) -> home cell (image colors)
  float delay = aRand * 0.4;
  float p = smoothstep(delay, delay + 0.6, uProgress);
  vec2 home = (aUv - 0.5) * uSize;
  // Scatter around the element (not the whole viewport) so several images
  // on screen never flood it.
  vec2 scattered = aStart * (uSize * 1.8 + 160.0)
    + vec2(sin(uTime * 0.4 + aRand * 40.0), cos(uTime * 0.33 + aRand * 30.0)) * 22.0;
  vec2 pos = mix(scattered, home, p);
  vec3 col = mix(brandGradient(aUv.x), img, p);
  float keep = 1.0;
  float edgeMode = uLatent;

  // Process stages: 0 sketch (sparse, jittering edges) -> 1 wireframe (edges)
  // -> 2 interface (greyscale) -> 3 full color.
  if (uStage >= 0.0) {
    float s = clamp(uStage, 0.0, 3.0);
    float sketch = 1.0 - clamp(s, 0.0, 1.0);
    float grey = 1.0 - clamp(s - 2.0, 0.0, 1.0);
    edgeMode = 1.0 - clamp(s - 1.0, 0.0, 1.0);
    pos += (vec2(vnoise(aUv * 40.0 + uTime), vnoise(aUv * 40.0 - uTime)) - 0.5) * 8.0 * sketch;
    keep *= mix(1.0, step(0.5, aRand), sketch);
    col = mix(img, vec3(luma(img)), grey);
  }

  // Latent layer: only edge particles stay, drawn in ink.
  col = mix(col, uInk, edgeMode);
  keep *= mix(1.0, edge, edgeMode);

  vec2 d = pos - uMouse;
  pos += normalize(d + 0.0001) * smoothstep(uMouseRadius, 0.0, length(d)) * 24.0 * p;

  vColor = col;
  // Invisible until the element starts entering, then fades in while converging.
  vAlpha = keep * smoothstep(0.0, 0.25, uProgress) * mix(0.45, 1.0, p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
  float cell = uSize.x / uCols;
  gl_PointSize = cell * 1.25 * uPixelRatio * mix(0.6, 1.0, p) * mix(1.0, 0.8, edgeMode);
}`

export interface ParticleImageOptions {
  src: string
  latentSrc?: string
  /** element width / height when built */
  aspect: number
  cols?: number
}

/** A grid of particles that samples an image in the vertex shader. */
export async function createParticleImage(opts: ParticleImageOptions) {
  const [texture, latentTexture] = await Promise.all([
    loadTexture(opts.src),
    opts.latentSrc ? loadTexture(opts.latentSrc) : Promise.resolve(null)
  ])
  const image = texture.image as HTMLImageElement
  const { cols, rows } = gridSize(opts.cols ?? 160, opts.aspect)
  const n = cols * rows

  const aUv = new Float32Array(n * 2)
  const aStart = new Float32Array(n * 2)
  const aRand = new Float32Array(n)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      aUv.set([(x + 0.5) / cols, (y + 0.5) / rows], i * 2)
      aStart.set([Math.random() - 0.5, Math.random() - 0.5], i * 2)
      aRand[i] = Math.random()
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  geometry.setAttribute('aUv', new THREE.BufferAttribute(aUv, 2))
  geometry.setAttribute('aStart', new THREE.BufferAttribute(aStart, 2))
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
      uLatentTexture: { value: latentTexture ?? texture },
      uHasLatentTex: { value: latentTexture ? 1 : 0 },
      uProgress: { value: 0 },
      uLatent: { value: 0 },
      uStage: { value: -1 },
      uCols: { value: cols },
      uMouseRadius: { value: 90 },
      uInk: { value: ink },
      uOpacity: { value: 1 }
    }
  })
  return new THREE.Points(geometry, material)
}
