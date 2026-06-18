<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { t, tm, rt, locale } = useI18n()
const { global } = useAppConfig()

const MAX = 500
const MIN = 20

type Status = 'idle' | 'streaming' | 'done' | 'error'

const description = ref('')
const status = ref<Status>('idle')
const errorMessage = ref('')
const sections = ref<Record<string, string>>({})
const rawBuffer = ref('')

const charCount = computed(() => description.value.length)
const canSubmit = computed(() => charCount.value >= MIN && charCount.value <= MAX && status.value !== 'streaming')

// Rotating placeholders for the empty state.
const placeholders = computed(() => {
  const raw = tm('brief.placeholderRotation') as unknown[]
  return raw.map(r => rt(r as string))
})
const placeholderIdx = ref(0)
let rotationTimer: ReturnType<typeof setInterval> | null = null
const activePlaceholder = computed(() => placeholders.value[placeholderIdx.value] || '')

onMounted(() => {
  rotationTimer = setInterval(() => {
    if (description.value.length === 0) {
      placeholderIdx.value = (placeholderIdx.value + 1) % placeholders.value.length
    }
  }, 4000)
})

onUnmounted(() => {
  if (rotationTimer) clearInterval(rotationTimer)
})

// Section headers we expect (in order) from the system prompt.
const headerRegex = /^## (SERVICE|PRICE_RANGE|TIMELINE|WHAT_I_HEARD|PHASES|STACK|BUILD_FIRST|WHY_FIT)\s*$/m
type SectionKey = 'SERVICE' | 'PRICE_RANGE' | 'TIMELINE' | 'WHAT_I_HEARD' | 'PHASES' | 'STACK' | 'BUILD_FIRST' | 'WHY_FIT'

/**
 * Parse the accumulated stream buffer into structured sections.
 * Tolerates partial output (sections may be incomplete as tokens arrive).
 */
function parseBuffer(buffer: string): Record<string, string> {
  const result: Record<string, string> = {}
  const lines = buffer.split('\n')
  let currentKey: SectionKey | null = null
  let currentLines: string[] = []

  const flush = () => {
    if (currentKey) {
      result[currentKey] = currentLines.join('\n').trim()
    }
  }

  for (const line of lines) {
    const match = line.match(headerRegex)
    if (match) {
      flush()
      currentKey = match[1] as SectionKey
      currentLines = []
    } else if (currentKey) {
      currentLines.push(line)
    }
  }
  flush()
  return result
}

const phasesList = computed(() => {
  const raw = sections.value.PHASES || ''
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('-') || l.startsWith('•'))
    .map(l => l.replace(/^[-•]\s*/, ''))
})

const stackList = computed(() => {
  const raw = sections.value.STACK || ''
  return raw.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
})

const hasFullBrief = computed(() => Boolean(
  sections.value.SERVICE && sections.value.PRICE_RANGE && sections.value.WHAT_I_HEARD
))

async function generate() {
  if (!canSubmit.value) return

  status.value = 'streaming'
  errorMessage.value = ''
  sections.value = {}
  rawBuffer.value = ''
  emailSent.value = false

  try {
    const res = await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description.value })
    })

    if (!res.ok) {
      if (res.status === 429) {
        errorMessage.value = t('brief.errors.rateLimited')
      } else if (res.status === 400) {
        const msg = await res.text().catch(() => '')
        errorMessage.value = msg || t('brief.errors.tooShort')
      } else {
        errorMessage.value = t('brief.errors.generic')
      }
      status.value = 'error'
      return
    }

    if (!res.body) {
      errorMessage.value = t('brief.errors.generic')
      status.value = 'error'
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      rawBuffer.value += decoder.decode(value, { stream: true })
      sections.value = parseBuffer(rawBuffer.value)
    }

    // Final flush after end-of-stream.
    rawBuffer.value += decoder.decode()
    sections.value = parseBuffer(rawBuffer.value)
    status.value = 'done'
  } catch (err) {
    console.error('[brief] generate error', err)
    errorMessage.value = t('brief.errors.generic')
    status.value = 'error'
  }
}

function reset() {
  status.value = 'idle'
  errorMessage.value = ''
  sections.value = {}
  rawBuffer.value = ''
  description.value = ''
  emailSent.value = false
}

function useChip(key: 'defi' | 'ai' | 'brand') {
  description.value = t(`brief.chipPrefills.${key}`)
}

// Email capture state.
const email = ref('')
const emailStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const emailError = ref('')
const emailSent = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

async function submitEmail() {
  if (!emailValid.value) {
    emailError.value = t('brief.email.errorInvalid')
    return
  }
  emailStatus.value = 'sending'
  emailError.value = ''

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        description: description.value,
        brief: rawBuffer.value,
        locale: locale.value
      })
    })
    if (!res.ok) {
      emailStatus.value = 'error'
      emailError.value = t('brief.email.errorGeneric')
      return
    }
    emailStatus.value = 'sent'
    emailSent.value = true
  } catch {
    emailStatus.value = 'error'
    emailError.value = t('brief.email.errorGeneric')
  }
}
</script>

<template>
  <div class="brief-form">
    <!-- Intro -->
    <p class="text-sm sm:text-base text-body dark:text-neutral-400 leading-relaxed mb-5">
      {{ $t('brief.intro') }}
    </p>

    <!-- Input card -->
    <div class="rounded-2xl border border-hairline dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-5">
      <label
        for="brief-description"
        class="sr-only"
      >{{ $t('brief.inputLabel') }}</label>
      <textarea
        id="brief-description"
        v-model="description"
        :placeholder="activePlaceholder"
        :disabled="status === 'streaming'"
        :maxlength="MAX"
        rows="4"
        :aria-label="$t('brief.inputLabel')"
        aria-describedby="brief-footnote"
        class="brief-textarea w-full resize-none bg-transparent border-0 text-heading dark:text-white text-base leading-relaxed placeholder:text-label dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 disabled:opacity-60"
      />

      <!-- Counter -->
      <div class="flex items-center justify-between mt-2 mb-3">
        <p
          id="brief-footnote"
          class="text-[11px] text-label dark:text-neutral-500"
        >
          {{ $t('brief.footnote') }}
        </p>
        <span
          class="text-[11px] font-medium tabular-nums"
          :class="charCount > MAX - 30 ? 'text-orange-500' : 'text-label dark:text-neutral-500'"
        >
          {{ $t('brief.counter', { count: charCount, max: MAX }) }}
        </span>
      </div>

      <!-- Chips + Generate -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="brief-chip"
            :disabled="status === 'streaming'"
            @click="useChip('defi')"
          >
            {{ $t('brief.chips.defi') }}
          </button>
          <button
            type="button"
            class="brief-chip"
            :disabled="status === 'streaming'"
            @click="useChip('ai')"
          >
            {{ $t('brief.chips.ai') }}
          </button>
          <button
            type="button"
            class="brief-chip"
            :disabled="status === 'streaming'"
            @click="useChip('brand')"
          >
            {{ $t('brief.chips.brand') }}
          </button>
        </div>

        <UButton
          size="lg"
          class="btn-gradient text-white font-medium rounded-full px-6 self-end sm:self-auto"
          :disabled="!canSubmit"
          :loading="status === 'streaming'"
          @click="generate"
        >
          <template #leading>
            <UIcon
              v-if="status !== 'streaming'"
              name="i-lucide-sparkles"
              class="size-4"
            />
          </template>
          {{ status === 'streaming' ? $t('brief.thinking') : $t('brief.generate') }}
        </UButton>
      </div>

      <!-- Error -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
      >
        <p
          v-if="status === 'error' && errorMessage"
          role="alert"
          class="mt-3 text-sm text-red-500"
        >
          {{ errorMessage }}
        </p>
      </Transition>
    </div>

    <!-- Streaming / done output -->
    <Transition
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="status === 'streaming' || status === 'done'"
        class="mt-5 rounded-2xl border border-hairline dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6"
      >
        <!-- Summary chip row -->
        <Transition
          enter-active-class="transition-all duration-400"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="sections.SERVICE || sections.PRICE_RANGE || sections.TIMELINE"
            class="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-surface dark:border-neutral-800"
          >
            <span
              v-if="sections.SERVICE"
              class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.5px] bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
            >
              {{ sections.SERVICE }}
            </span>
            <span
              v-if="sections.PRICE_RANGE"
              class="text-[14px] font-semibold text-heading dark:text-white tabular-nums"
            >
              {{ sections.PRICE_RANGE }}
            </span>
            <span
              v-if="sections.TIMELINE"
              class="text-[11px] text-body dark:text-neutral-400 uppercase tracking-wider"
            >
              · {{ sections.TIMELINE }}
            </span>
          </div>
        </Transition>

        <!-- What I heard -->
        <div
          v-if="sections.WHAT_I_HEARD"
          class="mb-5"
        >
          <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-2">
            {{ $t('brief.sections.whatIHeard') }}
          </p>
          <p class="text-[15px] text-heading dark:text-neutral-200 leading-relaxed">
            {{ sections.WHAT_I_HEARD }}
          </p>
        </div>

        <!-- Phases -->
        <div
          v-if="phasesList.length"
          class="mb-5"
        >
          <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
            {{ $t('brief.sections.phases') }}
          </p>
          <ol class="space-y-2.5">
            <li
              v-for="(phase, idx) in phasesList"
              :key="idx"
              class="flex items-start gap-3"
            >
              <span class="flex items-center justify-center size-6 rounded-full bg-surface dark:bg-neutral-800 text-[12px] font-semibold text-heading dark:text-neutral-200 shrink-0 mt-0.5">
                {{ idx + 1 }}
              </span>
              <span class="text-[14px] text-heading dark:text-neutral-200 leading-relaxed">{{ phase }}</span>
            </li>
          </ol>
        </div>

        <!-- Stack -->
        <div
          v-if="stackList.length"
          class="mb-5"
        >
          <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-3">
            {{ $t('brief.sections.stack') }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in stackList"
              :key="tech"
              class="px-2.5 py-1 rounded-full text-[12px] font-medium bg-surface dark:bg-neutral-800 text-heading dark:text-neutral-200"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Build first -->
        <div
          v-if="sections.BUILD_FIRST"
          class="mb-5"
        >
          <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-2">
            {{ $t('brief.sections.buildFirst') }}
          </p>
          <p class="text-[15px] text-heading dark:text-neutral-200 leading-relaxed">
            {{ sections.BUILD_FIRST }}
          </p>
        </div>

        <!-- Why fit -->
        <div v-if="sections.WHY_FIT">
          <p class="text-[11px] uppercase tracking-[1px] text-label font-bold mb-2">
            {{ $t('brief.sections.whyFit') }}
          </p>
          <p class="text-[15px] text-heading dark:text-neutral-200 leading-relaxed">
            {{ sections.WHY_FIT }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Email capture -->
    <Transition
      enter-active-class="transition-all duration-500 delay-200"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="status === 'done' && hasFullBrief"
        class="mt-5 rounded-2xl bg-linear-to-br from-violet-50 to-orange-50 dark:from-violet-950/30 dark:to-orange-950/20 border border-violet-100 dark:border-violet-900/50 p-5 sm:p-6"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="flex items-center justify-center size-9 rounded-full bg-white dark:bg-neutral-900 shrink-0">
            <UIcon
              name="i-lucide-mail"
              class="size-4 text-violet-600 dark:text-violet-400"
            />
          </div>
          <div>
            <h4 class="text-base font-semibold text-heading dark:text-white mb-1">
              {{ $t('brief.email.headline') }}
            </h4>
            <p class="text-sm text-body dark:text-neutral-400 leading-relaxed">
              {{ $t('brief.email.body') }}
            </p>
          </div>
        </div>

        <div v-if="emailStatus !== 'sent'">
          <form
            class="flex flex-col sm:flex-row gap-2"
            @submit.prevent="submitEmail"
          >
            <label
              for="brief-email"
              class="sr-only"
            >{{ $t('brief.email.label') }}</label>
            <input
              id="brief-email"
              v-model="email"
              type="email"
              :placeholder="$t('brief.email.placeholder')"
              :disabled="emailStatus === 'sending'"
              :aria-label="$t('brief.email.label')"
              :aria-invalid="emailStatus === 'error'"
              :aria-describedby="emailError ? 'brief-email-error' : undefined"
              class="grow rounded-full bg-white dark:bg-neutral-900 border border-hairline dark:border-neutral-700 px-4 py-2.5 text-sm text-heading dark:text-white placeholder:text-label dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-60"
            >
            <UButton
              type="submit"
              size="lg"
              class="btn-gradient text-white font-medium rounded-full px-5"
              :disabled="!emailValid || emailStatus === 'sending'"
              :loading="emailStatus === 'sending'"
            >
              {{ emailStatus === 'sending' ? $t('brief.email.sending') : $t('brief.email.submit') }}
            </UButton>
          </form>
          <p
            v-if="emailError"
            id="brief-email-error"
            role="alert"
            class="mt-2 text-xs text-red-500"
          >
            {{ emailError }}
          </p>
        </div>
        <div
          v-else
          class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="size-4"
          />
          {{ $t('brief.email.sent') }}
        </div>
      </div>
    </Transition>

    <!-- Footer actions: book call / generate another -->
    <Transition
      enter-active-class="transition-all duration-500 delay-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="status === 'done' && hasFullBrief"
        class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <UButton
          :to="global.meetingLink"
          target="_blank"
          variant="outline"
          color="neutral"
          size="lg"
          class="rounded-full"
        >
          <template #leading>
            <UIcon
              name="i-lucide-calendar"
              class="size-4"
            />
          </template>
          {{ $t('brief.bookCall') }}
        </UButton>
        <span class="text-label dark:text-neutral-500 uppercase text-[11px] tracking-[1px]">
          {{ $t('brief.or') }}
        </span>
        <button
          type="button"
          class="text-sm text-body dark:text-neutral-400 hover:text-primary transition-colors underline underline-offset-2 cursor-pointer"
          @click="reset"
        >
          {{ $t('brief.another') }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.brief-textarea {
  font-family: inherit;
  min-height: 88px;
}

.brief-textarea::placeholder {
  transition: opacity 0.3s ease;
}

.brief-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(241, 245, 249, 0.8);
  color: #475569;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.brief-chip:hover:not(:disabled) {
  background: rgba(241, 245, 249, 1);
  border-color: #cbd5e1;
}

.brief-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:global(.dark) .brief-chip {
  background: rgba(38, 38, 38, 0.6);
  color: #d4d4d8;
}

:global(.dark) .brief-chip:hover:not(:disabled) {
  background: rgba(64, 64, 64, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
}
</style>
