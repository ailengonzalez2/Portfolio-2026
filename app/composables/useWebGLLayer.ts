import type { FrameCallback, ParticleLayer } from '~/webgl/stage'
import { whenStage } from '~/webgl/runtime'

/**
 * Registers a particle layer over `target` while mounted. `ready` is true only
 * while the layer is live (assets loaded, stage up, context alive), so callers
 * can swap their DOM fallback with it. `refresh()` rebuilds the layer, e.g.
 * after the element resizes.
 */
export function useWebGLLayer(
  target: Ref<HTMLElement | null>,
  createLayer: () => Promise<ParticleLayer | null>,
  onFrame?: FrameCallback
) {
  const active = useState<boolean>('fx-active', () => false)
  const live = ref(false)
  let remove: (() => void) | undefined
  let disposed = false
  let generation = 0

  const mount = async () => {
    if (!active.value || !target.value) return
    const mine = ++generation
    const stage = await whenStage()
    const layer = await createLayer()
    const stale = disposed || mine !== generation || !target.value || !active.value
    if (!layer || stale) {
      if (layer) {
        layer.geometry.dispose()
        layer.material.dispose()
      }
      return
    }
    remove?.()
    remove = stage.add(target.value, layer, onFrame)
    live.value = true
  }

  onMounted(mount)
  onBeforeUnmount(() => {
    disposed = true
    remove?.()
    live.value = false
  })

  return {
    ready: computed(() => live.value && active.value),
    refresh: mount
  }
}
