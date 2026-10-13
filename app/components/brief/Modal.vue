<script setup lang="ts">
import { watch, onMounted } from 'vue'

const { isOpen, open } = useBriefModal()
const route = useRoute()
const router = useRouter()

/**
 * Auto-open the modal when the URL hash is #brief.
 * Lets existing links like `to="/#brief"` keep working as deep links.
 */
function checkHash() {
  if (typeof window === 'undefined') return
  if (window.location.hash === '#brief') {
    open()
    // Strip the hash so the modal can be closed cleanly without bouncing back.
    router.replace({ hash: '' })
  }
}

onMounted(checkHash)
watch(() => route.fullPath, () => checkHash())

// The WebGL particle layer sits above page content; hide it while the modal
// is open so particles never draw over the form.
watch(isOpen, (value) => {
  if (import.meta.client) document.documentElement.classList.toggle('modal-open', !!value)
}, { immediate: true })
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'sm:max-w-2xl !rounded-lg',
      body: 'p-0',
      header: 'border-b border-hairline dark:border-neutral-800'
    }"
    :close="{ class: 'rounded-full' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center size-9 rounded-full bg-linear-to-br from-[#2B3BFF] to-[#C04BFF] shrink-0">
          <UIcon
            name="i-lucide-sparkles"
            class="size-4 text-white"
          />
        </div>
        <div>
          <h3 class="font-display text-xl sm:text-2xl text-ink dark:text-paper leading-tight">
            {{ $t('brief.title') }}
          </h3>
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mt-1">
            {{ $t('brief.section') }}
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="px-5 sm:px-6 py-5 sm:py-6 max-h-[70vh] overflow-y-auto">
        <BriefForm />
      </div>
    </template>
  </UModal>
</template>
