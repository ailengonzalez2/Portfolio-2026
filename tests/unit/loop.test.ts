import { expect, test } from 'bun:test'
import { bootFx, frameLoop, tween } from '../../app/webgl/loop'

test('frameLoop keeps scheduling frames after a step throws', () => {
  const queue: Array<(t: number) => void> = []
  const raf = (cb: (t: number) => void) => {
    queue.push(cb)
    return queue.length
  }
  let calls = 0
  const errors: unknown[] = []
  frameLoop(() => {
    calls++
    if (calls === 1) throw new Error('bad layer')
  }, { raf, onError: e => errors.push(e) })

  queue.shift()!(16)
  queue.shift()!(32)
  expect(calls).toBe(2)
  expect(errors.length).toBe(1)
  expect(queue.length).toBe(1)
})

test('frameLoop stops when cancelled', () => {
  const queue: Array<(t: number) => void> = []
  const raf = (cb: (t: number) => void) => {
    queue.push(cb)
    return queue.length
  }
  let calls = 0
  const stop = frameLoop(() => {
    calls++
  }, { raf, cancel: () => {} })
  queue.shift()!(16)
  stop()
  queue.shift()?.(32)
  expect(calls).toBe(1)
})

test('bootFx runs the fallback when loading the WebGL chunks fails', async () => {
  let fellBack: unknown = null
  const result = await bootFx(() => Promise.reject(new Error('chunk load failed')), (e) => {
    fellBack = e
  })
  expect(result).toBeNull()
  expect(fellBack).toBeInstanceOf(Error)
})

test('bootFx returns the loaded modules on success', async () => {
  const result = await bootFx(() => Promise.resolve(42), () => {})
  expect(result).toBe(42)
})

test('tween ends exactly at the target even when frames never fire', async () => {
  globalThis.requestAnimationFrame = (() => 0) as unknown as typeof requestAnimationFrame
  const seen: number[] = []
  await tween(0, 1, 30, v => seen.push(v))
  expect(seen.at(-1)).toBe(1)
}, 1000)
