<script setup lang="ts">
import { watch, onMounted } from 'vue'

const { isOpen, open, close } = useBriefModal()
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
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'sm:max-w-2xl !rounded-3xl',
      body: 'p-0',
      header: 'border-b border-[#f1f5f9] dark:border-neutral-800'
    }"
    :close="{ class: 'rounded-full' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center size-9 rounded-full bg-linear-to-br from-violet-400 to-orange-400 shrink-0">
          <UIcon
            name="i-lucide-sparkles"
            class="size-4 text-white"
          />
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-[#0f172b] dark:text-white leading-tight">
            {{ $t('brief.title') }}
          </h3>
          <p class="text-[11px] uppercase tracking-[1px] text-[#90a1b9] font-bold mt-0.5">
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
