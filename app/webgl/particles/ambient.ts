import * as THREE from 'three'
import { gradientAt } from '../math'
import { pointFragment } from '../shaders/image'
import { stageUniforms } from '../materials/common'

const vertex = /* glsl */`
attribute vec2 aPos;
attribute float aRand;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uWipe;
uniform float uCover;
uniform vec2 uViewport;
uniform vec2 uMouse;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 p = aPos * uViewport * 1.1;
  p += vec2(sin(uTime * 0.15 + aRand * 40.0), cos(uTime * 0.12 + aRand * 25.0)) * 30.0;
  vec2 d = p - uMouse;
  p += normalize(d + 0.0001) * smoothstep(110.0, 0.0, length(d)) * 30.0;
  vColor = aColor;
  vAlpha = mix(0.22, 1.0, uWipe);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  float base = 2.4 + aRand * 1.6;
  gl_PointSize = mix(base, uCover, uWipe * uWipe) * uPixelRatio;
}`

// Viewport-wide drifting gradient particles: the site's texture, and the page
// transition wipe (uWipe swells them until they cover the screen).
export function createAmbient(count: number) {
  const aPos = new Float32Array(count * 2)
  const aRand = new Float32Array(count)
  const aColor = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    aPos.set([Math.random() - 0.5, Math.random() - 0.5], i * 2)
    aRand[i] = Math.random()
    aColor.set(gradientAt(Math.random()), i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('aPos', new THREE.BufferAttribute(aPos, 2))
  geometry.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3))

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      ...stageUniforms(),
      uWipe: { value: 0 },
      uCover: { value: 60 },
      uOpacity: { value: 1 }
    }
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  points.renderOrder = -1
  return points
}

/** Point size (px) at which `count` points cover a viewport with little overlap gap. */
export const coverSize = (width: number, height: number, count: number) =>
  Math.sqrt((width * height) / count) * 2.4
