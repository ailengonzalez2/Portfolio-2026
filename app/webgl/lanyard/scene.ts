import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { LanyardSim, DEFAULT_LANYARD, strapLength } from './physics'
import type { Vec3 } from './physics'
import { BADGE_H, BADGE_W, drawBadgeBack, drawBadgeFront, drawStrap, loadBadgeFonts, loadImage } from './badge'
import type { BadgeText } from './badge'

export interface LanyardSceneOptions {
  text: BadgeText
  photo: string
  signature: string
  /** strap print */
  label: string
  /** start hanging still instead of dropping in (reduced motion) */
  still?: boolean
}

// World units: the badge is 1 wide. The view is sized so it takes ~1/3 of the
// container height.
const CARD_W = 1
const CARD_H = CARD_W * (BADGE_H / BADGE_W)
const CARD_T = 0.02
const CLIP_GAP = 0.12
const VIEW_H = 3.9
const FOV = 22
const STRAP_W = 0.13
const STRAP_SAMPLES = 72
const STEP = 1 / 120

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/** Flat face of the badge with UVs spanning the card. */
function faceGeometry(shape: THREE.Shape) {
  const g = new THREE.ShapeGeometry(shape, 8)
  const pos = g.attributes.position!
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / CARD_W + 0.5
    uv[i * 2 + 1] = pos.getY(i) / CARD_H + 0.5
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return g
}

function texture(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}

/** Badge on a lanyard, rendered into `container` with its own canvas. */
export async function createLanyardScene(container: HTMLElement, opts: LanyardSceneOptions) {
  const [photo, signature] = await Promise.all([
    loadImage(opts.photo).catch(() => null),
    loadImage(opts.signature).catch(() => null),
    loadBadgeFonts()
  ])

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envMap
  scene.environmentIntensity = 0.3
  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const key = new THREE.DirectionalLight(0xffffff, 1.1)
  key.position.set(2, 3, 5)
  scene.add(key)

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, VIEW_H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)))

  // Strap length so the badge hangs a bit above center.
  const anchorY = VIEW_H / 2 + 0.3
  const clipRestY = CARD_H * 0.5 + 0.05
  const segments = DEFAULT_LANYARD.segments
  const segmentLength = (anchorY - clipRestY) / segments
  const sim = new LanyardSim([0, anchorY, 0], { segmentLength, badgeLength: CLIP_GAP + CARD_H }, !opts.still)

  // Badge: plastic body plus printed front and back faces.
  const shape = roundedRect(CARD_W, CARD_H, 0.05)
  const badge = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: CARD_T, bevelEnabled: false, curveSegments: 8 }),
    new THREE.MeshPhysicalMaterial({ color: 0xf2efe9, roughness: 0.5 })
  )
  body.position.z = -CARD_T / 2
  const face = faceGeometry(shape)
  const printed = (map: THREE.Texture) => new THREE.MeshPhysicalMaterial({
    map,
    roughness: 0.55,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25
  })
  const frontTex = texture(drawBadgeFront(opts.text, photo), renderer)
  const backTex = texture(drawBadgeBack(opts.text, signature), renderer)
  const front = new THREE.Mesh(face, printed(frontTex))
  front.position.z = CARD_T / 2 + 0.001
  const back = new THREE.Mesh(face, printed(backTex))
  back.position.z = -CARD_T / 2 - 0.001
  back.rotation.y = Math.PI
  const card = new THREE.Group()
  card.add(body, front, back)
  card.position.y = -(CLIP_GAP + CARD_H / 2)
  badge.add(card)

  // Metal clip: ring the strap passes through, and the clamp on the card.
  const metal = new THREE.MeshStandardMaterial({ color: 0xc9c9cc, metalness: 1, roughness: 0.28 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 12, 32), metal)
  ring.position.y = 0.01
  const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.035), metal)
  clamp.position.y = -CLIP_GAP + 0.02
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 12), metal)
  pin.position.y = -0.05
  badge.add(ring, clamp, pin)
  scene.add(badge)

  // Strap: two ribbons that meet at the clip and part toward the top, like a
  // lanyard around a neck. Rebuilt along the rope every frame.
  const strapTex = texture(drawStrap(opts.label), renderer)
  strapTex.wrapS = THREE.RepeatWrapping
  strapTex.wrapT = THREE.RepeatWrapping
  const strapMat = new THREE.MeshStandardMaterial({ map: strapTex, roughness: 0.75, side: THREE.DoubleSide })
  const makeStrap = () => {
    const g = new THREE.BufferGeometry()
    const n = STRAP_SAMPLES + 1
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3))
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2 * 2), 2))
    const index: number[] = []
    for (let i = 0; i < STRAP_SAMPLES; i++) {
      const a = i * 2
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
    g.setIndex(index)
    const mesh = new THREE.Mesh(g, strapMat)
    mesh.frustumCulled = false
    scene.add(mesh)
    return mesh
  }
  const straps = [makeStrap(), makeStrap()]

  const curve = new THREE.CatmullRomCurve3(Array.from({ length: segments + 1 }, () => new THREE.Vector3()))
  const up = new THREE.Vector3()
  const right = new THREE.Vector3()
  const fwd = new THREE.Vector3()
  const basis = new THREE.Matrix4()
  const tmp = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const side = new THREE.Vector3()
  const Z = new THREE.Vector3(0, 0, 1)

  const syncBadge = () => {
    const c = sim.get(sim.clip)
    const b = sim.get(sim.bottom)
    up.set(c[0] - b[0], c[1] - b[1], c[2] - b[2]).normalize()
    const r0 = tmp.crossVectors(up, Z).normalize()
    const f0 = fwd.crossVectors(r0, up).normalize()
    const cos = Math.cos(sim.yaw)
    const sin = Math.sin(sim.yaw)
    right.copy(r0).multiplyScalar(cos).addScaledVector(f0, -sin)
    fwd.copy(f0).multiplyScalar(cos).addScaledVector(r0, sin)
    basis.makeBasis(right, up, fwd)
    badge.quaternion.setFromRotationMatrix(basis)
    badge.position.set(c[0], c[1], c[2])
  }

  const syncStraps = () => {
    curve.points.forEach((p, i) => p.set(...sim.get(i)))
    const length = curve.getLength()
    straps.forEach((mesh, k) => {
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute
      const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute
      const dir = k === 0 ? -1 : 1
      for (let i = 0; i <= STRAP_SAMPLES; i++) {
        const t = i / STRAP_SAMPLES
        curve.getPointAt(t, tmp)
        curve.getTangentAt(t, tangent)
        // Strands part toward the anchor and meet at the clip; the back
        // strand sits slightly behind.
        const spread = (1 - t) ** 1.4 * 0.42
        tmp.x += dir * spread
        tmp.z += k === 0 ? 0.004 : -0.004
        side.crossVectors(Z, tangent).normalize()
        // Near the clip the strap turns with the badge (either face out).
        const turn = THREE.MathUtils.smoothstep(t, 0.8, 1)
        side.addScaledVector(right, (side.dot(right) < 0 ? -turn : turn)).normalize()
        const half = STRAP_W / 2
        pos.setXYZ(i * 2, tmp.x - side.x * half, tmp.y - side.y * half, tmp.z - side.z * half)
        pos.setXYZ(i * 2 + 1, tmp.x + side.x * half, tmp.y + side.y * half, tmp.z + side.z * half)
        const v = (t * length) / (STRAP_W * 8)
        // u runs right → left so the print reads the right way round.
        uv.setXY(i * 2, 1, v)
        uv.setXY(i * 2 + 1, 0, v)
      }
      pos.needsUpdate = true
      uv.needsUpdate = true
      mesh.geometry.computeVertexNormals()
    })
  }

  // Layout.
  let width = 1
  let height = 1
  const resize = () => {
    width = Math.max(1, container.clientWidth)
    height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(container)

  // Pointer: grab the badge, drag it around, fling it; a click flips it.
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const plane = new THREE.Plane()
  const hit = new THREE.Vector3()
  let drag: { id: number, s: number, x: number, y: number, t: number, moved: boolean, vx: number, lastX: number, lastT: number } | null = null

  const toNdc = (e: PointerEvent | Touch) => {
    const rect = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
  }
  const hitsBadge = (e: PointerEvent | Touch) => {
    toNdc(e)
    return raycaster.intersectObject(card, true)[0]
  }
  const onTarget = (e: PointerEvent): Vec3 | null => {
    toNdc(e)
    if (!raycaster.ray.intersectPlane(plane, hit)) return null
    // Can't pull the badge further than the strap reaches.
    const a = sim.get(0)
    const reach = strapLength(sim.opts) + CLIP_GAP + CARD_H * drag!.s
    tmp.set(hit.x - a[0], hit.y - a[1], hit.z - a[2])
    if (tmp.length() > reach) tmp.setLength(reach)
    return [a[0] + tmp.x, a[1] + tmp.y, a[2] + tmp.z]
  }

  const onDown = (e: PointerEvent) => {
    const h = hitsBadge(e)
    if (!h) return
    const c = sim.get(sim.clip)
    const b = sim.get(sim.bottom)
    tmp.set(b[0] - c[0], b[1] - c[1], b[2] - c[2])
    const s = tmp.dot(hit.copy(h.point).sub(new THREE.Vector3(...c))) / tmp.lengthSq()
    plane.setFromNormalAndCoplanarPoint(Z, h.point)
    drag = { id: e.pointerId, s, x: e.clientX, y: e.clientY, t: performance.now(), moved: false, vx: 0, lastX: e.clientX, lastT: performance.now() }
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'grabbing'
    const target = onTarget(e)
    if (target) sim.drag(target, s)
  }
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) {
      if (e.pointerType === 'mouse') canvas.style.cursor = hitsBadge(e) ? 'grab' : 'default'
      return
    }
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true
    const now = performance.now()
    const dt = Math.max(1, now - drag.lastT)
    drag.vx = drag.vx * 0.6 + ((e.clientX - drag.lastX) / dt) * 0.4
    drag.lastX = e.clientX
    drag.lastT = now
    const target = onTarget(e)
    if (target) sim.drag(target, drag.s)
  }
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return
    const click = !drag.moved && performance.now() - drag.t < 400
    sim.drag(null)
    if (click) sim.flip()
    else sim.spin(THREE.MathUtils.clamp(drag.vx * 6, -14, 14))
    drag = null
    canvas.style.cursor = 'grab'
  }
  // Touching the badge must not scroll the page; elsewhere it scrolls.
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    if (t && hitsBadge(t)) e.preventDefault()
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('touchstart', onTouchStart, { passive: false })

  // Loop: fixed-step physics, render only while visible.
  let raf = 0
  let running = false
  let last = 0
  let acc = 0
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    acc += Math.min(0.1, (now - last) / 1000)
    last = now
    while (acc >= STEP) {
      sim.step(STEP)
      acc -= STEP
    }
    syncBadge()
    syncStraps()
    renderer.render(scene, camera)
  }
  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }
  const visibility = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()))
  visibility.observe(container)
  syncBadge()
  syncStraps()
  renderer.render(scene, camera)
  // Dev: inspect, and advance by hand (background tabs get no frames).
  if (import.meta.dev) {
    (window as any).__lanyard = {
      sim,
      advance(seconds: number) {
        for (let i = 0; i < seconds / STEP; i++) sim.step(STEP)
        syncBadge()
        syncStraps()
        renderer.render(scene, camera)
      }
    }
  }

  return {
    flip: () => sim.flip(),
    dispose() {
      stop()
      visibility.disconnect()
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(m) ? m : [m]).forEach(x => x.dispose())
        }
      })
      ;[frontTex, backTex, strapTex, envMap].forEach(t => t.dispose())
      pmrem.dispose()
      renderer.dispose()
      canvas.remove()
    }
  }
}

export type LanyardScene = Awaited<ReturnType<typeof createLanyardScene>>
