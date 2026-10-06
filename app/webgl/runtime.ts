import type { Stage } from './stage'

// Module-level singleton so components can reach the stage without importing
// three. The fx plugin provides it; null on the fallback path.
let current: Stage | null = null
let waiting: Array<(s: Stage) => void> = []

export function provideStage(stage: Stage | null) {
  current = stage
  if (stage) {
    waiting.forEach(fn => fn(stage))
    waiting = []
  }
}

export const getStage = () => current

export function whenStage(): Promise<Stage> {
  return current ? Promise.resolve(current) : new Promise(resolve => waiting.push(resolve))
}

/** Animate the particle wipe (0 clear → 1 covered); resolves at once without a stage. */
export function wipeTo(target: number, ms: number): Promise<void> {
  const stage = current
  if (!stage) return Promise.resolve()
  const from = stage.wipe
  const start = performance.now()
  return new Promise((resolve) => {
    const step = () => {
      const k = Math.min(1, (performance.now() - start) / ms)
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      stage.setWipe(from + (target - from) * eased)
      if (k < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}
