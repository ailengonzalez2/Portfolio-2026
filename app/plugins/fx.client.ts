import { shouldUseWebGL } from '~/webgl/math'
import { provideStage } from '~/webgl/runtime'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Decides whether the WebGL path runs, then (after mount) lazy-loads three +
// lenis, mounts the fixed canvas and drives one RAF loop for both.
export default defineNuxtPlugin((nuxtApp) => {
  const active = useState<boolean>('fx-active', () => false)

  const capable = shouldUseWebGL({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    webgl: hasWebGL(),
    deviceMemory: (navigator as any).deviceMemory as number | undefined,
    forcedOff: new URLSearchParams(window.location.search).get('fx') === 'off'
  })
  if (!capable) return

  active.value = true
  document.documentElement.classList.add('fx-on')

  nuxtApp.hook('app:mounted', async () => {
    const [{ Stage }, { default: Lenis }] = await Promise.all([
      import('~/webgl/stage'),
      import('lenis')
    ])

    const canvas = document.createElement('canvas')
    canvas.className = 'fx-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)

    const stage = new Stage(canvas)
    const lenis = new Lenis({ autoRaf: false, anchors: true })

    let raf = 0
    const tick = (t: number) => {
      lenis.raf(t)
      stage.render()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => stage.resize()
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const onPointer = (e: PointerEvent) => stage.setPointer(e.clientX, e.clientY)
    const onLeave = () => stage.clearPointer()
    window.addEventListener('resize', onResize)
    if (finePointer) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    nuxtApp.hook('page:finish', () => lenis.resize())

    // GPU reset / too many contexts: drop to the DOM fallback for good.
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      lenis.destroy()
      provideStage(null)
      canvas.remove()
      document.documentElement.classList.remove('fx-on')
      active.value = false
    }, { once: true })

    provideStage(stage)
    if (import.meta.dev) {
      (window as any).__fxStage = stage;
      (window as any).__lenis = lenis
    }
  })
})
