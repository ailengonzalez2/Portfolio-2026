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

  trackEvent('brief-generate')
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
    trackEvent('brief-lead-email')
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
    <div class="rounded-md border border-hairline dark:border-neutral-800 bg-paper dark:bg-ink p-4 sm:p-5 focus-within:border-ink dark:focus-within:border-paper transition-colors">
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
        class="brief-textarea w-full resize-none bg-transparent border-0 text-ink dark:text-paper text-base leading-relaxed placeholder:text-label dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 disabled:opacity-60"
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
          :class="charCount > MAX - 30 ? 'text-[#C04BFF]' : 'text-label dark:text-neutral-500'"
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
        class="mt-6 border-t border-hairline dark:border-neutral-800 pt-6"
      >
        <!-- Summary chip row -->
        <Transition
          enter-active-class="transition-all duration-400"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="sections.SERVICE || sections.PRICE_RANGE || sections.TIMELINE"
            class="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-hairline dark:border-neutral-800"
          >
            <span
              v-if="sections.SERVICE"
              class="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.18em] btn-gradient-text"
            >
              {{ sections.SERVICE }}
            </span>
            <span
              v-if="sections.PRICE_RANGE"
              class="font-display text-2xl text-ink dark:text-paper tabular-nums"
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
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-2">
            {{ $t('brief.sections.whatIHeard') }}
          </p>
          <p class="text-[15px] text-ink dark:text-paper leading-relaxed">
            {{ sections.WHAT_I_HEARD }}
          </p>
        </div>

        <!-- Phases -->
        <div
          v-if="phasesList.length"
          class="mb-5"
        >
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-3">
            {{ $t('brief.sections.phases') }}
          </p>
          <ol class="space-y-2.5">
            <li
              v-for="(phase, idx) in phasesList"
              :key="idx"
              class="flex items-start gap-3"
            >
              <span class="w-6 shrink-0 pt-0.5 font-mono text-xs text-label">
                {{ String(idx + 1).padStart(2, '0') }}
              </span>
              <span class="text-[14px] text-ink dark:text-paper leading-relaxed">{{ phase }}</span>
            </li>
          </ol>
        </div>

        <!-- Stack -->
        <div
          v-if="stackList.length"
          class="mb-5"
        >
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-3">
            {{ $t('brief.sections.stack') }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in stackList"
              :key="tech"
              class="px-2 py-0.5 rounded-sm border border-hairline dark:border-neutral-700 text-[12px] text-ink dark:text-paper"
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
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-2">
            {{ $t('brief.sections.buildFirst') }}
          </p>
          <p class="text-[15px] text-ink dark:text-paper leading-relaxed">
            {{ sections.BUILD_FIRST }}
          </p>
        </div>

        <!-- Why fit -->
        <div v-if="sections.WHY_FIT">
          <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-label mb-2">
            {{ $t('brief.sections.whyFit') }}
          </p>
          <p class="text-[15px] text-ink dark:text-paper leading-relaxed">
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
        class="email-box relative mt-6 rounded-md border border-hairline dark:border-neutral-800 p-5 sm:p-6"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="flex items-center justify-center size-9 rounded-full border border-hairline dark:border-neutral-700 shrink-0">
            <UIcon
              name="i-lucide-mail"
              class="size-4 text-ink dark:text-paper"
            />
          </div>
          <div>
            <h4 class="font-display text-xl text-ink dark:text-paper mb-1">
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
              class="grow rounded-full bg-white dark:bg-neutral-900 border border-hairline dark:border-neutral-700 px-4 py-2.5 text-sm text-ink dark:text-paper placeholder:text-label dark:placeholder:text-neutral-500 focus:outline-none focus:border-ink dark:focus:border-paper disabled:opacity-60"
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
          data-umami-event="book-call"
          data-umami-event-location="brief"
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
        <span class="font-mono text-label dark:text-neutral-500 uppercase text-[11px] tracking-[0.18em]">
          {{ $t('brief.or') }}
        </span>
        <button
          type="button"
          class="text-sm text-body dark:text-neutral-400 hover:text-ink dark:hover:text-paper transition-colors underline underline-offset-4 cursor-pointer"
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
  background: transparent;
  color: var(--color-body);
  border: 1px solid var(--color-hairline);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.brief-chip:hover:not(:disabled) {
  border-color: var(--color-ink);
  color: var(--color-ink);
}

.brief-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.brief-chip:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

:global(.dark) .brief-chip {
  color: #d4d4d8;
  border-color: rgba(255, 255, 255, 0.15);
}

:global(.dark) .brief-chip:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}

/* Email step: the brand gradient as a thin rule on top */
.email-box::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(90deg, #2B3BFF, #C04BFF);
}
</style>
