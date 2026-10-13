import * as THREE from 'three'
import { hexToRgb01 } from '../math'

// Mirrors --color-ink / --color-paper in main.css. Shaders need numbers, not CSS vars.
const INK = '#121212'
const PAPER = '#F2EFE9'

export function themeColors() {
  const dark = document.documentElement.classList.contains('dark')
  const ink = new THREE.Vector3(...hexToRgb01(dark ? PAPER : INK))
  const paper = new THREE.Vector3(...hexToRgb01(dark ? INK : PAPER))
  return { ink, paper }
}

export async function loadTexture(src: string) {
  const texture = await new THREE.TextureLoader().loadAsync(src)
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}

/** Uniforms the stage fills every frame on any layer that declares them. */
export function stageUniforms() {
  return {
    uTime: { value: 0 },
    uSize: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(1e5, 1e5) },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uPixelRatio: { value: 1 }
  }
}
