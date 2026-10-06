import { afterEach, expect, test } from 'bun:test'
import type { Stage } from '../../app/webgl/stage'
import { provideStage, resetWipe, wipeTo } from '../../app/webgl/runtime'

const fakeStage = () => {
  let level = 0
  const stage = {
    get wipe() {
      return level
    },
    setWipe: (v: number) => {
      level = v
    }
  }
  return stage as unknown as Stage
}

afterEach(() => provideStage(null))

test('wipeTo finishes even when animation frames never fire (hidden tab)', async () => {
  globalThis.requestAnimationFrame = (() => 0) as unknown as typeof requestAnimationFrame
  const stage = fakeStage()
  provideStage(stage)
  await wipeTo(1, 50)
  expect(stage.wipe).toBe(1)
}, 1000)

test('resetWipe clears a wipe left covering the screen (e.g. after an error page)', async () => {
  globalThis.requestAnimationFrame = (() => 0) as unknown as typeof requestAnimationFrame
  const stage = fakeStage()
  provideStage(stage)
  await wipeTo(1, 20)
  expect(stage.wipe).toBe(1)
  await resetWipe()
  expect(stage.wipe).toBe(0)
}, 2000)

test('wipeTo resolves immediately without a stage', async () => {
  await wipeTo(1, 50)
  expect(true).toBe(true)
})
