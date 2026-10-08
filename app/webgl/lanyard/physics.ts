// Lanyard physics: a Verlet rope hanging from a fixed anchor, ending in the
// badge clip, plus one more point for the bottom of the badge. The badge also
// has a twist (yaw) around its own vertical axis, driven by a damped spring,
// so it can spin and be flipped. No three, no DOM — unit-tested with bun.

export type Vec3 = [number, number, number]

export interface LanyardOptions {
  /** rope segments between the anchor and the clip */
  segments: number
  segmentLength: number
  /** clip → bottom of the badge */
  badgeLength: number
  gravity: number
  /** velocity kept per step (1 = no air drag) */
  damping: number
  iterations: number
}

export const DEFAULT_LANYARD: LanyardOptions = {
  segments: 14,
  segmentLength: 0.13,
  badgeLength: 1.5,
  gravity: 16,
  damping: 0.992,
  iterations: 14
}

// Relative inverse masses: the badge is much heavier than the strap.
const W_ROPE = 1
const W_BADGE = 0.25
// Twist spring: stiffness, damping, and how much sideways swing twists it.
const YAW_K = 14
const YAW_C = 3.2
const YAW_SWING = 1.6

export class LanyardSim {
  readonly opts: LanyardOptions
  readonly count: number
  /** xyz per point: 0 = anchor, 1..segments = strap (last = clip), then badge bottom */
  readonly pos: Float32Array
  readonly prev: Float32Array
  yaw = 0
  yawVel = 0
  /** 0 = front facing the viewer, π = flipped to the back */
  yawTarget = 0
  private grab: { s: number, target: Vec3 } | null = null

  constructor(anchor: Vec3, opts: Partial<LanyardOptions> = {}, drop = true) {
    this.opts = { ...DEFAULT_LANYARD, ...opts }
    this.count = this.opts.segments + 2
    this.pos = new Float32Array(this.count * 3)
    this.prev = new Float32Array(this.count * 3)
    this.reset(anchor, drop)
  }

  get clip() {
    return this.opts.segments
  }

  get bottom() {
    return this.opts.segments + 1
  }

  /** Hang straight down from `anchor`, or (drop) start tilted up so it falls and swings in. */
  reset(anchor: Vec3, drop: boolean) {
    const { segments, segmentLength, badgeLength } = this.opts
    // Dropping: the strap starts pointing up and to the right of the anchor.
    const angle = drop ? Math.PI * 0.72 : 0
    const dx = Math.sin(angle)
    const dy = -Math.cos(angle)
    for (let i = 0; i <= segments; i++) {
      this.set(i, [anchor[0] + dx * i * segmentLength, anchor[1] + dy * i * segmentLength, anchor[2]])
    }
    const c = this.get(this.clip)
    this.set(this.bottom, [c[0] + dx * badgeLength, c[1] + dy * badgeLength, c[2]])
    this.prev.set(this.pos)
    this.yaw = drop ? -1.2 : 0
    this.yawVel = 0
  }

  get(i: number): Vec3 {
    return [this.pos[i * 3]!, this.pos[i * 3 + 1]!, this.pos[i * 3 + 2]!]
  }

  private set(i: number, p: Vec3) {
    this.pos.set(p, i * 3)
  }

  /** Move the anchor (layout resize); the rest follows through the constraints. */
  setAnchor(anchor: Vec3) {
    this.set(0, anchor)
    this.prev.set(anchor, 0)
  }

  /**
   * Pin the point at fraction `s` along the badge (0 = clip, 1 = bottom) to
   * `target`; null releases it, keeping its momentum.
   */
  drag(target: Vec3 | null, s = 0.5) {
    this.grab = target ? { s: Math.min(1, Math.max(0, s)), target } : null
  }

  get dragging() {
    return this.grab !== null
  }

  step(dt: number) {
    const { gravity, damping, iterations } = this.opts
    const p = this.pos
    const q = this.prev
    for (let i = 1; i < this.count; i++) {
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k
        const v = (p[j]! - q[j]!) * damping
        q[j] = p[j]!
        p[j] = p[j]! + v + (k === 1 ? -gravity * dt * dt : 0)
      }
    }

    for (let it = 0; it < iterations; it++) {
      for (let i = 0; i < this.opts.segments; i++) this.solve(i, i + 1, this.opts.segmentLength)
      this.solve(this.clip, this.bottom, this.opts.badgeLength)
      this.applyGrab()
    }

    // Twist: spring back to the target side; sideways swing adds a little spin.
    const b = this.bottom * 3
    const swing = (p[b]! - q[b]!) / dt
    const accel = -(this.yaw - this.yawTarget) * YAW_K - this.yawVel * YAW_C + swing * YAW_SWING
    this.yawVel += accel * dt
    this.yaw += this.yawVel * dt
  }

  /** Spin impulse in rad/s (e.g. from a fling). */
  spin(v: number) {
    this.yawVel += v
  }

  /** Turn the badge to its other side. */
  flip() {
    this.yawTarget = this.yawTarget === 0 ? Math.PI : 0
  }

  private weight(i: number) {
    if (i === 0) return 0
    if (this.grab && (i === this.clip || i === this.bottom)) return 0
    return i >= this.clip ? W_BADGE : W_ROPE
  }

  private solve(a: number, b: number, rest: number) {
    const wa = this.weight(a)
    const wb = this.weight(b)
    const w = wa + wb
    if (w === 0) return
    const p = this.pos
    const dx = p[b * 3]! - p[a * 3]!
    const dy = p[b * 3 + 1]! - p[a * 3 + 1]!
    const dz = p[b * 3 + 2]! - p[a * 3 + 2]!
    const d = Math.hypot(dx, dy, dz) || 1e-6
    const k = (d - rest) / d / w
    p[a * 3] = p[a * 3]! + dx * k * wa
    p[a * 3 + 1] = p[a * 3 + 1]! + dy * k * wa
    p[a * 3 + 2] = p[a * 3 + 2]! + dz * k * wa
    p[b * 3] = p[b * 3]! - dx * k * wb
    p[b * 3 + 1] = p[b * 3 + 1]! - dy * k * wb
    p[b * 3 + 2] = p[b * 3 + 2]! - dz * k * wb
  }

  /**
   * Place the badge so the grabbed point sits on the target, easing its axis
   * toward hanging straight down so it pivots around the pointer while held.
   */
  private applyGrab() {
    if (!this.grab) return
    const { s, target } = this.grab
    const L = this.opts.badgeLength
    const c = this.get(this.clip)
    const b = this.get(this.bottom)
    const len = Math.hypot(b[0] - c[0], b[1] - c[1], b[2] - c[2]) || 1
    const dir: Vec3 = [(b[0] - c[0]) / len, (b[1] - c[1]) / len, (b[2] - c[2]) / len]
    const nd: Vec3 = [dir[0] * 0.94, dir[1] * 0.94 - 0.06, dir[2] * 0.94]
    const nl = Math.hypot(...nd) || 1
    for (let k = 0; k < 3; k++) {
      const d = (nd[k]! / nl) * L
      const ck = target[k]! - d * s
      this.pos[this.clip * 3 + k] = ck
      this.pos[this.bottom * 3 + k] = ck + d
    }
  }
}

/** Maximum reach of the badge clip from the anchor (strap fully taut). */
export const strapLength = (o: LanyardOptions) => o.segments * o.segmentLength
