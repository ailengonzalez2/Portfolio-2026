import { expect, test } from 'bun:test'
import { LanyardSim, strapLength, DEFAULT_LANYARD } from '../../app/webgl/lanyard/physics'
import type { Vec3 } from '../../app/webgl/lanyard/physics'

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const run = (sim: LanyardSim, seconds: number) => {
  for (let i = 0; i < seconds * 120; i++) sim.step(1 / 120)
}

test('a dropped lanyard settles hanging under the anchor, facing front', () => {
  const sim = new LanyardSim([0, 2, 0])
  run(sim, 12)
  const clip = sim.get(sim.clip)
  const bottom = sim.get(sim.bottom)
  expect(Math.abs(clip[0])).toBeLessThan(0.05)
  expect(clip[1]).toBeCloseTo(2 - strapLength(DEFAULT_LANYARD), 1)
  expect(bottom[1]).toBeLessThan(clip[1])
  expect(dist(clip, bottom)).toBeCloseTo(DEFAULT_LANYARD.badgeLength, 2)
  expect(Math.abs(sim.yaw)).toBeLessThan(0.05)
})

test('the anchor never moves and segments keep their length', () => {
  const sim = new LanyardSim([0.5, 1, 0])
  run(sim, 2)
  expect(sim.get(0)).toEqual([0.5, 1, 0])
  for (let i = 0; i < sim.opts.segments; i++) {
    expect(dist(sim.get(i), sim.get(i + 1))).toBeCloseTo(sim.opts.segmentLength, 1)
  }
})

test('dragging pins the grabbed point to the pointer; releasing keeps momentum', () => {
  const sim = new LanyardSim([0, 2, 0], {}, false)
  const target: Vec3 = [0.6, 0, 0]
  sim.drag(target, 0.5)
  run(sim, 1)
  const c = sim.get(sim.clip)
  const b = sim.get(sim.bottom)
  const mid: Vec3 = [(c[0] + b[0]) / 2, (c[1] + b[1]) / 2, (c[2] + b[2]) / 2]
  expect(dist(mid, target)).toBeLessThan(1e-3)
  // Fling right, then let go: it keeps moving right for a moment.
  for (let i = 1; i <= 6; i++) {
    sim.drag([0.6 + i * 0.03, 0, 0], 0.5)
    sim.step(1 / 120)
  }
  sim.drag(null)
  const before = sim.get(sim.bottom)[0]
  sim.step(1 / 120)
  expect(sim.get(sim.bottom)[0]).toBeGreaterThan(before)
})

test('flip turns the badge to its back, and again to its front', () => {
  const sim = new LanyardSim([0, 2, 0], {}, false)
  sim.flip()
  run(sim, 6)
  expect(sim.yaw).toBeCloseTo(Math.PI, 1)
  sim.flip()
  run(sim, 6)
  expect(sim.yaw).toBeCloseTo(0, 1)
})

test('face shows the back or the front explicitly', () => {
  const sim = new LanyardSim([0, 2, 0], {}, false)
  sim.face(true)
  run(sim, 6)
  expect(sim.yaw).toBeCloseTo(Math.PI, 1)
  sim.face(false)
  run(sim, 6)
  expect(sim.yaw).toBeCloseTo(0, 1)
})
