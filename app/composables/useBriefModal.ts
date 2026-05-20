/**
 * Global state for the Brief Generator modal.
 * Any component can call open() / close() — single source of truth.
 *
 * Usage:
 *   const { isOpen, open, close } = useBriefModal()
 *   <button @click="open()">…</button>
 */

const isOpen = ref(false)

export function useBriefModal() {
  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
    toggle: () => { isOpen.value = !isOpen.value }
  }
}
