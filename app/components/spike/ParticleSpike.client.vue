<script setup lang="ts">
// THROWAWAY spike (plan Task 1, round 2): particles that assemble into the
// name. Targets are sampled from the real <h1> glyphs so the particle name
// sits exactly where the HTML text is.
import * as THREE from 'three'

const props = defineProps<{
  textEl: HTMLElement | null
  progress: number
  step: number
  size: number
  scatter: number
  mouseRadius: number
  opacity: number
}>()

let canvasEl: HTMLCanvasElement | null = null
const setCanvas = (el: unknown) => {
  canvasEl = el as HTMLCanvasElement | null
}

const vertex = /* glsl */`
attribute vec3 aStart;
attribute vec3 aTarget;
attribute vec3 aColor;
attribute float aRand;
attribute float aAmbient;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uScatter;
uniform float uMouseRadius;
uniform vec2 uMouse;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float delay = aRand * 0.35;
  float p = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  if (aAmbient > 0.5) p = 0.0;

  vec3 drift = vec3(
    sin(uTime * 0.4 + aRand * 40.0),
    cos(uTime * 0.33 + aRand * 30.0),
    0.0
  ) * 22.0 * (1.0 - p);
  vec3 pos = mix(aStart * uScatter + drift, aTarget, p);

  vec2 d = pos.xy - uMouse;
  float push = smoothstep(uMouseRadius, 0.0, length(d)) * 46.0;
  pos.xy += normalize(d + 0.0001) * push;

  vColor = aColor;
  vAlpha = aAmbient > 0.5 ? 0.35 : mix(0.45, 1.0, p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * uPixelRatio * mix(1.7, 1.0, p);
}`

const fragment = /* glsl */`
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.15, d) * vAlpha * uOpacity);
}`

const hex = (h: string) => [1, 3, 5].map(i => Number.parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
const VIOLET = hex('#b86adf')
const CORAL = hex('#ff6c63')
const ORANGE = hex('#ffb147')
const gradientAt = (t: number) => {
  const [a, b, k] = t < 0.5 ? [VIOLET, CORAL, t * 2] : [CORAL, ORANGE, (t - 0.5) * 2]
  return a.map((v, i) => v + (b[i]! - v) * k) as [number, number, number]
}

// Draw the h1's text nodes into an offscreen canvas at their on-screen
// positions and return every `step`-th opaque pixel, in centered y-up px.
function sampleText(el: HTMLElement, step: number) {
  const w = window.innerWidth
  const h = window.innerHeight
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  const cs = getComputedStyle(el)
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  ctx.fillStyle = '#000'
  const metrics = ctx.measureText('Ag')
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim()
    if (!text) continue
    range.selectNodeContents(node)
    const r = range.getBoundingClientRect()
    ctx.fillText(text, r.left, r.top + metrics.fontBoundingBoxAscent)
  }
  const data = ctx.getImageData(0, 0, w, h).data
  const points: [number, number][] = []
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3]! > 128) points.push([x - w / 2, h / 2 - y])
    }
  }
  return points
}

let renderer: THREE.WebGLRenderer | undefined
let raf = 0
let cleanup: (() => void) | undefined
const mouse = new THREE.Vector2(99999, 99999)
const onMove = (e: PointerEvent) => {
  mouse.set(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY)
}
const onLeave = () => mouse.set(99999, 99999)

// Nuxt .client wrappers run onMounted before the inner render, so wait a tick.
onMounted(() => nextTick(async () => {
  const canvas = canvasEl
  if (!canvas) return
  await document.fonts.ready

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: props.size },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uScatter: { value: props.scatter },
    uMouseRadius: { value: props.mouseRadius },
    uMouse: { value: mouse },
    uOpacity: { value: props.opacity }
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false
  })
  const points = new THREE.Points(new THREE.BufferGeometry(), material)
  points.frustumCulled = false
  scene.add(points)

  const build = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer?.setSize(w, h, false)
    camera.left = -w / 2
    camera.right = w / 2
    camera.top = h / 2
    camera.bottom = -h / 2
    camera.updateProjectionMatrix()

    const targets = props.textEl ? sampleText(props.textEl, props.step) : []
    const ambient = Math.round(targets.length * 0.25)
    const n = targets.length + ambient
    const minX = Math.min(...targets.map(t => t[0]))
    const maxX = Math.max(...targets.map(t => t[0]))
    const aStart = new Float32Array(n * 3)
    const aTarget = new Float32Array(n * 3)
    const aColor = new Float32Array(n * 3)
    const aRand = new Float32Array(n)
    const aAmbient = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const isAmbient = i >= targets.length
      const t = isAmbient ? [0, 0] : targets[i]!
      aStart.set([(Math.random() - 0.5) * w * 1.1, (Math.random() - 0.5) * h * 1.1, 0], i * 3)
      aTarget.set([t[0]!, t[1]!, 0], i * 3)
      const ct = isAmbient ? Math.random() : (t[0]! - minX) / Math.max(1, maxX - minX)
      aColor.set(gradientAt(ct), i * 3)
      aRand[i] = Math.random()
      aAmbient[i] = isAmbient ? 1 : 0
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    geo.setAttribute('aStart', new THREE.BufferAttribute(aStart, 3))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(aTarget, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1))
    geo.setAttribute('aAmbient', new THREE.BufferAttribute(aAmbient, 1))
    points.geometry.dispose()
    points.geometry = geo
  }
  build()

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(build, 150)
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  const stopStep = watch(() => props.step, build)

  const start = performance.now()
  const tick = () => {
    uniforms.uTime.value = (performance.now() - start) / 1000
    uniforms.uProgress.value = props.progress
    uniforms.uSize.value = props.size
    uniforms.uScatter.value = props.scatter
    uniforms.uMouseRadius.value = props.mouseRadius
    uniforms.uOpacity.value = props.opacity
    renderer?.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  cleanup = () => {
    cancelAnimationFrame(raf)
    stopStep()
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerleave', onLeave)
    points.geometry.dispose()
    material.dispose()
    renderer?.dispose()
  }
}))
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas
    :ref="setCanvas"
    class="fixed inset-0 size-full pointer-events-none z-40"
    aria-hidden="true"
  />
</template>
