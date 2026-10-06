// Small runtime helpers for the fx plugin, kept free of three/DOM imports so
// they can be unit-tested.

interface LoopOptions {
  raf?: (cb: (t: number) => void) => number
  cancel?: (id: number) => void
  onError?: (error: unknown) => void
}

/**
 * Runs `step` every animation frame. The next frame is scheduled before the
 * step runs, so one throwing frame (a bad layer callback) can never stop
 * smooth scroll and rendering for good. Returns a stop function.
 */
export function frameLoop(step: (t: number) => void, opts: LoopOptions = {}) {
  const raf = opts.raf ?? ((cb: (t: number) => void) => requestAnimationFrame(cb))
  const cancel = opts.cancel ?? ((id: number) => cancelAnimationFrame(id))
  let id = 0
  let stopped = false
  const tick = (t: number) => {
    if (stopped) return
    id = raf(tick)
    try {
      step(t)
    } catch (error) {
      opts.onError?.(error)
    }
  }
  id = raf(tick)
  return () => {
    stopped = true
    cancel(id)
  }
}

/**
 * Loads the WebGL chunks; if that fails (offline, stale deploy), runs the
 * fallback so the page never stays in a half-enabled fx state.
 */
export async function bootFx<T>(load: () => Promise<T>, fallback: (error: unknown) => void): Promise<T | null> {
  try {
    return await load()
  } catch (error) {
    fallback(error)
    return null
  }
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Animates a value from `from` to `to` over `ms`, calling `onUpdate` each
 * frame. Always finishes (on a timer if frames are paused, e.g. hidden tab),
 * and the last update is exactly `to`.
 */
export function tween(from: number, to: number, ms: number, onUpdate: (v: number) => void, ease = easeOutCubic): Promise<void> {
  const start = performance.now()
  return new Promise((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onUpdate(to)
      resolve()
    }
    const step = () => {
      if (finished) return
      const k = Math.min(1, (performance.now() - start) / ms)
      if (k >= 1) return finish()
      onUpdate(from + (to - from) * ease(k))
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    setTimeout(finish, ms + 200)
  })
}
