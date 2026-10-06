import * as THREE from 'three'
import { enterProgress, isOnScreen, type Viewport } from './math'
import { coverSize, createAmbient } from './particles/ambient'

export type ParticleLayer = THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>

export interface FrameInfo {
  /** seconds since the stage started */
  time: number
  rect: DOMRect
  viewport: Viewport
  /** enterProgress of the element (0 entering, 1 centered) */
  progress: number
}

export type FrameCallback = (layer: ParticleLayer, info: FrameInfo) => void

interface Entry {
  el: HTMLElement
  layer: ParticleLayer
  onFrame?: FrameCallback
}

const FAR = 1e5

// One fixed transparent canvas over the page, in an orthographic camera
// measured in CSS pixels (origin at the viewport center, y up). Each layer
// is moved to its element's center every frame; shaders lay particles out
// in element-local pixels from uSize.
export class Stage {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)
  private entries = new Set<Entry>()
  private viewport: Viewport = { width: 1, height: 1 }
  private start = performance.now()
  private pointer = new THREE.Vector2(FAR, FAR)
  private ambient: ParticleLayer
  private ambientCount: number
  private wipeLevel = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setClearColor(0x000000, 0)
    this.ambientCount = window.innerWidth < 768 ? 500 : 1200
    this.ambient = createAmbient(this.ambientCount)
    this.scene.add(this.ambient)
    this.resize()
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.viewport = { width, height }
    this.renderer.setSize(width, height, false)
    this.camera.left = -width / 2
    this.camera.right = width / 2
    this.camera.top = height / 2
    this.camera.bottom = -height / 2
    this.camera.updateProjectionMatrix()
    this.ambient.material.uniforms.uCover!.value = coverSize(width, height, this.ambientCount)
  }

  setPointer(clientX: number, clientY: number) {
    this.pointer.set(clientX - this.viewport.width / 2, this.viewport.height / 2 - clientY)
  }

  clearPointer() {
    this.pointer.set(FAR, FAR)
  }

  add(el: HTMLElement, layer: ParticleLayer, onFrame?: FrameCallback) {
    layer.frustumCulled = false
    const entry: Entry = { el, layer, onFrame }
    this.entries.add(entry)
    this.scene.add(layer)
    return () => {
      this.entries.delete(entry)
      this.scene.remove(layer)
      for (const u of Object.values(layer.material.uniforms)) {
        if (u.value instanceof THREE.Texture) u.value.dispose()
      }
      layer.geometry.dispose()
      layer.material.dispose()
    }
  }

  setWipe(level: number) {
    this.wipeLevel = level
  }

  get wipe() {
    return this.wipeLevel
  }

  get layerCount() {
    return this.entries.size
  }

  private syncUniforms(material: THREE.ShaderMaterial, time: number, cx: number, cy: number, w: number, h: number) {
    const u = material.uniforms
    if (u.uTime) u.uTime.value = time
    u.uSize?.value.set(w, h)
    u.uMouse?.value.set(this.pointer.x - cx, this.pointer.y - cy)
    u.uViewport?.value.set(this.viewport.width, this.viewport.height)
    if (u.uPixelRatio) u.uPixelRatio.value = this.renderer.getPixelRatio()
  }

  render() {
    const time = (performance.now() - this.start) / 1000

    this.syncUniforms(this.ambient.material, time, 0, 0, this.viewport.width, this.viewport.height)
    this.ambient.material.uniforms.uWipe!.value = this.wipeLevel

    for (const e of this.entries) {
      const rect = e.el.getBoundingClientRect()
      const on = rect.width > 0 && rect.height > 0 && isOnScreen(rect, this.viewport, 200)
      e.layer.visible = on
      if (!on) continue
      const cx = rect.left + rect.width / 2 - this.viewport.width / 2
      const cy = this.viewport.height / 2 - (rect.top + rect.height / 2)
      e.layer.position.set(cx, cy, 0)
      this.syncUniforms(e.layer.material, time, cx, cy, rect.width, rect.height)
      e.onFrame?.(e.layer, { time, rect, viewport: this.viewport, progress: enterProgress(rect, this.viewport.height) })
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    for (const e of [...this.entries]) this.scene.remove(e.layer)
    this.entries.clear()
    this.ambient.geometry.dispose()
    this.ambient.material.dispose()
    this.renderer.dispose()
  }
}
