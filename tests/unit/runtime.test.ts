import { afterEach, expect, test } from 'bun:test'
import type { Stage } from '../../app/webgl/stage'
import { getStage, provideStage, whenStage } from '../../app/webgl/runtime'

const fakeStage = () => ({}) as unknown as Stage

afterEach(() => provideStage(null))

test('whenStage resolves once the stage is provided', async () => {
  const stage = fakeStage()
  const pending = whenStage()
  provideStage(stage)
  expect(await pending).toBe(stage)
  expect(getStage()).toBe(stage)
})

test('whenStage resolves at once when the stage already exists', async () => {
  const stage = fakeStage()
  provideStage(stage)
  expect(await whenStage()).toBe(stage)
})

test('the fallback path has no stage', () => {
  expect(getStage()).toBeNull()
})
