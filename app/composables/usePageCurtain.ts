import { tween } from '~/webgl/loop'

interface CurtainState {
  /** word the particles assemble; null = curtain unmounted */
  label: string | null
  opacity: number
  progress: number
}

// Shared across the single <PageCurtain>: resolved when its particle layer is live.
let resolveReady: (() => void) | null = null

/**
 * Page transition curtain: `cover(label)` fades a paper curtain in while
 * particles assemble the destination's name; `reveal()` disperses them and
 * lifts the curtain. Every step is time-bounded, so navigation never hangs.
 */
export function usePageCurtain() {
  const state = useState<CurtainState>('page-curtain', () => ({ label: null, opacity: 0, progress: 0 }))

  const markReady = () => {
    resolveReady?.()
    resolveReady = null
  }

  const cover = async (label: string) => {
    state.value = { label, opacity: 0, progress: 0 }
    const ready = new Promise<void>((resolve) => {
      resolveReady = resolve
      setTimeout(resolve, 450)
    })
    await Promise.all([
      tween(0, 1, 260, (v) => {
        state.value.opacity = v
      }),
      ready
    ])
    await tween(0, 1, 620, (v) => {
      state.value.progress = v
    })
  }

  const reveal = async () => {
    if (!state.value.label) return
    await new Promise(resolve => setTimeout(resolve, 120))
    await Promise.all([
      tween(1, 0, 560, (v) => {
        state.value.progress = v
      }),
      tween(1, 0, 520, (v) => {
        state.value.opacity = v
      })
    ])
    state.value.label = null
  }

  return { state, cover, reveal, markReady }
}
