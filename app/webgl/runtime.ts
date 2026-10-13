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
