import { shouldUseWebGL } from '~/webgl/math'
import { provideStage, resetWipe } from '~/webgl/runtime'
import { bootFx, frameLoop } from '~/webgl/loop'

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
  if (!capable) {
    document.documentElement.classList.remove('fx-boot')
    return
  }

  active.value = true
  document.documentElement.classList.add('fx-on')

  // Start after the page has loaded and the main thread is idle, so three +
  // particle setup never compete with first paint / LCP.
  const whenIdle = () => new Promise<void>((resolve) => {
    const go = () => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 })
      else setTimeout(resolve, 200)
    }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
  })

  // Drop to the DOM fallback (no layers, normal tracks, native scroll).
  const disableFx = () => {
    document.documentElement.classList.remove('fx-on', 'fx-boot')
    active.value = false
  }

  // A transition whose next page errors never gets its afterEnter: lift the
  // curtain and clear the wipe.
  const curtain = usePageCurtain()
  nuxtApp.hook('app:error', () => {
    resetWipe()
    curtain.reveal()
  })

  nuxtApp.hook('app:mounted', async () => {
    await whenIdle()
    const modules = await bootFx(() => Promise.all([
      import('~/webgl/stage'),
      import('lenis')
    ]), disableFx)
    if (!modules) return
    const [{ Stage }, { default: Lenis }] = modules

    const canvas = document.createElement('canvas')
    canvas.className = 'fx-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)

    const stage = new Stage(canvas)
    const lenis = new Lenis({ autoRaf: false, anchors: true })
    let destroyed = false

    const stopLoop = frameLoop((t) => {
      lenis.raf(t)
      stage.render()
    }, { onError: e => console.error('[fx] frame error', e) })

    const onResize = () => stage.resize()
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const onPointer = (e: PointerEvent) => stage.setPointer(e.clientX, e.clientY)
    const onLeave = () => stage.clearPointer()
    window.addEventListener('resize', onResize)
    if (finePointer) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    nuxtApp.hook('page:finish', () => {
      if (!destroyed) lenis.resize()
    })
    // Lenis keeps its own scroll position; start each new page at the top
    // unless the route targets an anchor.
    nuxtApp.hook('page:transition:finish', () => {
      if (!destroyed && !window.location.hash) lenis.scrollTo(0, { immediate: true })
    })

    // GPU reset / too many contexts: drop to the DOM fallback for good.
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      destroyed = true
      stopLoop()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      lenis.destroy()
      provideStage(null)
      stage.dispose()
      canvas.remove()
      disableFx()
    }, { once: true })

    provideStage(stage)
    if (import.meta.dev) {
      (window as any).__fxStage = stage;
      (window as any).__lenis = lenis
    }
  })
})
