# Home Page Conversion Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three conversion-focused elements to the home page — Hook CTAs, a data-driven Testimonials section, and a closing Contact CTA — without restructuring existing sections.

**Architecture:** Each change is additive and isolated. Hook gets a button row (edit). Testimonials is a new data-driven component that auto-hides when its data array is empty. ContactCta is a new closing band that takes over the `#contact` anchor from the footer. All new copy is added to both `en` and `es` locale files.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, Nuxt UI 4 (`UButton`, `UIcon`), motion-v via existing `ScrollReveal` wrapper, Tailwind CSS v4, `@nuxtjs/i18n`.

## Global Constraints

- ESLint: **no trailing commas**, 1TBS brace style. Run `bun run lint` — must pass.
- Tailwind v4 class names: use `bg-linear-to-*` (not `bg-gradient-to-*`), `shrink-0` (not `flex-shrink-0`).
- Components use `<script setup lang="ts">`; props via `defineProps<T>()`.
- All user-facing copy goes through i18n with matching keys in BOTH `i18n/locales/en.json` and `i18n/locales/es.json`. No missing-key warnings.
- Prefer Nuxt UI components (`UButton`, `UIcon`) and existing wrappers (`ScrollReveal`, `SectionEyebrow`).
- Components are auto-imported; landing components are referenced as `Landing<Name>` in pages.
- Booking CTA target is `useAppConfig().global.meetingLink` with `target="_blank"`. Email is `global.email`.
- No unit-test harness exists. Each task's verification gate is `bun run lint`, `bun run typecheck`, and a concrete dev-server observation.

---

### Task 1: Add Book a call / View work CTAs to the Hook

**Files:**
- Modify: `app/components/landing/Hook.vue`
- Modify: `i18n/locales/en.json` (`hook` object)
- Modify: `i18n/locales/es.json` (`hook` object)

**Interfaces:**
- Consumes: `useAppConfig().global.meetingLink`, existing `ScrollReveal`, `UButton`, `UIcon`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add i18n keys to `en.json`**

In `i18n/locales/en.json`, replace the `hook` object with:

```json
  "hook": {
    "eyebrow": "What I do",
    "pre": "I design and ship ",
    "highlight": "user-facing AI products",
    "post": " end to end — from the first sketch to production.",
    "bookCall": "Book a call",
    "viewWork": "View work"
  },
```

- [ ] **Step 2: Add i18n keys to `es.json`**

In `i18n/locales/es.json`, replace the `hook` object with:

```json
  "hook": {
    "eyebrow": "Qué hago",
    "pre": "Diseño y desarrollo ",
    "highlight": "productos de IA",
    "post": " de punta a punta — del primer boceto a producción.",
    "bookCall": "Agendar una llamada",
    "viewWork": "Ver trabajo"
  },
```

- [ ] **Step 3: Add the button row to `Hook.vue`**

Replace the entire contents of `app/components/landing/Hook.vue` with:

```vue
<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section class="py-20 sm:py-28 bg-background">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="28"
        :blur="8"
        :duration="0.7"
      >
        <p class="mt-20 sm:mt-32 max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white">
          {{ $t('hook.pre') }}<span class="btn-gradient-text">{{ $t('hook.highlight') }}</span>{{ $t('hook.post') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.25"
        :duration="0.6"
      >
        <div class="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
            class="btn-gradient text-white font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('hook.bookCall') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>

          <UButton
            to="/projects"
            size="lg"
            variant="ghost"
            color="neutral"
            class="font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('hook.viewWork') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4"
              />
            </template>
          </UButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Verify lint + types**

Run: `bun run lint && bun run typecheck`
Expected: both pass with no errors.

- [ ] **Step 5: Verify in the browser**

Run `bun run dev`, open `http://localhost:3000`. Scroll past the hero reveal to the Hook.
Expected: the statement renders, then two buttons fade in just after it — **Book a call** (gradient, opens `meetingLink` in a new tab) and **View work** (ghost, navigates to `/projects`).

- [ ] **Step 6: Commit**

```bash
git add app/components/landing/Hook.vue i18n/locales/en.json i18n/locales/es.json
git commit -m "feat: add Book a call / View work CTAs to the Hook section"
```

---

### Task 2: Testimonials section (data-driven, auto-hides when empty)

**Files:**
- Create: `app/data/testimonials.ts`
- Create: `app/components/landing/Testimonials.vue`
- Modify: `app/pages/index.vue` (insert after `<LandingServices />`)
- Modify: `i18n/locales/en.json` (new `testimonials` object)
- Modify: `i18n/locales/es.json` (new `testimonials` object)

**Interfaces:**
- Consumes: existing `SectionEyebrow` (prop `label: string`), `ScrollReveal`, `useI18n`.
- Produces:
  - `Testimonial` interface — `{ id: string, quote: string, name: string, role: string, company: string }`
  - `testimonials: Testimonial[]` exported from `app/data/testimonials.ts`.
  - `LandingTestimonials` auto-imported component (renders nothing when `testimonials` is empty).

- [ ] **Step 1: Create the data source**

Create `app/data/testimonials.ts`:

```ts
export interface Testimonial {
  id: string
  /** The testimonial body text */
  quote: string
  /** Author full name */
  name: string
  /** Author role, e.g. "Founder" */
  role: string
  /** Author company / context */
  company: string
}

// PLACEHOLDER testimonials — replace with real client quotes before relying on them.
// Emptying this array hides the entire Testimonials section (no fake quotes ship).
export const testimonials: Testimonial[] = [
  {
    id: 'placeholder-1',
    quote: 'Placeholder testimonial — replace with a real client quote. Ailen shipped our AI chat UI faster than we expected and the polish was outstanding.',
    name: 'Sample Client',
    role: 'Founder',
    company: 'Placeholder Co.'
  },
  {
    id: 'placeholder-2',
    quote: 'Placeholder testimonial — replace with a real client quote. Clear communication, pixel-perfect frontend, and real product thinking throughout.',
    name: 'Another Client',
    role: 'Product Lead',
    company: 'Example Studio'
  },
  {
    id: 'placeholder-3',
    quote: 'Placeholder testimonial — replace with a real client quote. The agent workflow she built just works, and the handoff was effortless.',
    name: 'Third Client',
    role: 'CTO',
    company: 'Demo Labs'
  }
]
```

- [ ] **Step 2: Add i18n keys to `en.json`**

In `i18n/locales/en.json`, add a `testimonials` object immediately after the `projects` object's closing brace:

```json
  "testimonials": {
    "eyebrow": "Kind words",
    "heading": "What clients say"
  },
```

- [ ] **Step 3: Add i18n keys to `es.json`**

In `i18n/locales/es.json`, add the matching `testimonials` object after the `projects` object:

```json
  "testimonials": {
    "eyebrow": "Testimonios",
    "heading": "Lo que dicen mis clientes"
  },
```

- [ ] **Step 4: Create the component**

Create `app/components/landing/Testimonials.vue`:

```vue
<script setup lang="ts">
import { testimonials } from '~/data/testimonials'

// Initials from the author name for the avatar (no image asset needed)
const initials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
</script>

<template>
  <section
    v-if="testimonials.length"
    class="py-20 sm:py-28 bg-background"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal
        :y="20"
        :blur="4"
      >
        <SectionEyebrow
          :label="$t('testimonials.eyebrow')"
          class="mb-8"
        />
        <h2 class="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-heading dark:text-white mb-12">
          {{ $t('testimonials.heading') }}
        </h2>
      </ScrollReveal>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <ScrollReveal
          v-for="(t, i) in testimonials"
          :key="t.id"
          :y="20"
          :blur="4"
          :delay="i * 0.08"
        >
          <figure class="h-full flex flex-col bg-white dark:bg-white/5 rounded-2xl ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
            <UIcon
              name="i-lucide-quote"
              class="size-6 text-primary mb-4 shrink-0"
            />
            <blockquote class="flex-1 text-base sm:text-lg leading-relaxed text-heading dark:text-white/90">
              {{ t.quote }}
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-3">
              <span class="flex items-center justify-center size-11 shrink-0 rounded-full btn-gradient text-white font-semibold text-sm">
                {{ initials(t.name) }}
              </span>
              <span class="flex flex-col">
                <span class="font-semibold text-heading dark:text-white">{{ t.name }}</span>
                <span class="text-sm text-muted">{{ t.role }} · {{ t.company }}</span>
              </span>
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 5: Insert into the page**

In `app/pages/index.vue`, add `<LandingTestimonials />` on its own line immediately after `<LandingServices />`:

```vue
    <LandingServices />
    <LandingTestimonials />
    <section class="pt-10 sm:pt-14 pb-24 sm:pb-32 bg-background">
      <TechMarquee />
    </section>
```

- [ ] **Step 6: Verify lint + types**

Run: `bun run lint && bun run typecheck`
Expected: both pass.

- [ ] **Step 7: Verify in the browser**

Run `bun run dev`, open `http://localhost:3000`. Scroll past Services.
Expected: a "Kind words / What clients say" section with three placeholder cards (quote icon, text, initials avatar, name · role · company), revealing with a slight stagger.

- [ ] **Step 8: Verify the auto-hide guardrail**

Temporarily change `testimonials` in `app/data/testimonials.ts` to `[]`. Reload.
Expected: the entire section disappears (no eyebrow, heading, or empty grid).
Then **restore the placeholder array**.

- [ ] **Step 9: Commit**

```bash
git add app/data/testimonials.ts app/components/landing/Testimonials.vue app/pages/index.vue i18n/locales/en.json i18n/locales/es.json
git commit -m "feat: add data-driven Testimonials section that auto-hides when empty"
```

---

### Task 3: Closing Contact CTA section

**Files:**
- Create: `app/components/landing/ContactCta.vue`
- Modify: `app/pages/index.vue` (insert after `<LandingWeb3Quote />`)
- Modify: `app/components/AppFooter.vue` (remove `id="contact"` from the `<section>`)
- Modify: `i18n/locales/en.json` (new `contactCta` object)
- Modify: `i18n/locales/es.json` (new `contactCta` object)

**Interfaces:**
- Consumes: `useAppConfig().global` (`meetingLink`, `email`), `ScrollReveal`, `UButton`, `UIcon`.
- Produces: `LandingContactCta` auto-imported component owning the `id="contact"` anchor.

- [ ] **Step 1: Add i18n keys to `en.json`**

In `i18n/locales/en.json`, add a `contactCta` object after the `testimonials` object:

```json
  "contactCta": {
    "heading": "Let's work together",
    "subtitle": "Have an AI product or frontend in mind? Let's turn it into something people love to use.",
    "bookCall": "Book a call",
    "email": "Email me"
  },
```

- [ ] **Step 2: Add i18n keys to `es.json`**

In `i18n/locales/es.json`, add the matching `contactCta` object after the `testimonials` object:

```json
  "contactCta": {
    "heading": "Trabajemos juntos",
    "subtitle": "¿Tenés un producto de IA o un frontend en mente? Hagámoslo realidad con algo que la gente ame usar.",
    "bookCall": "Agendar una llamada",
    "email": "Escribime"
  },
```

- [ ] **Step 3: Create the component**

Create `app/components/landing/ContactCta.vue`:

```vue
<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <section
    id="contact"
    class="py-24 sm:py-32 bg-background"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ScrollReveal
        :y="24"
        :blur="6"
      >
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-heading dark:text-white">
          {{ $t('contactCta.heading') }}
        </h2>
        <p class="mt-6 max-w-2xl mx-auto text-lg text-muted">
          {{ $t('contactCta.subtitle') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        :y="20"
        :blur="4"
        :delay="0.2"
      >
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <UButton
            :to="global.meetingLink"
            target="_blank"
            size="lg"
            class="btn-gradient text-white font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('contactCta.bookCall') }}
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4"
              />
            </template>
          </UButton>

          <UButton
            :to="`mailto:${global.email}`"
            size="lg"
            variant="ghost"
            color="neutral"
            class="font-semibold rounded-full px-8 py-3 text-base"
          >
            {{ $t('contactCta.email') }}
            <template #trailing>
              <UIcon
                name="i-lucide-mail"
                class="size-4"
              />
            </template>
          </UButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Insert into the page**

In `app/pages/index.vue`, add `<LandingContactCta />` on its own line immediately after `<LandingWeb3Quote />`:

```vue
    <LandingWeb3Quote />
    <LandingContactCta />
  </UPage>
```

- [ ] **Step 5: Move the `#contact` anchor off the footer**

In `app/components/AppFooter.vue`, remove the `id="contact"` line from the `<section>` so the anchor is unique to the new CTA. The block changes from:

```vue
    <section
      id="contact"
      ref="sectionRef"
```

to:

```vue
    <section
      ref="sectionRef"
```

- [ ] **Step 6: Verify lint + types**

Run: `bun run lint && bun run typecheck`
Expected: both pass.

- [ ] **Step 7: Verify in the browser**

Run `bun run dev`, open `http://localhost:3000`.
Expected: after the Web3Quote, a centered "Let's work together" band with **Book a call** (gradient, new tab) and **Email me** (opens mail client to `global.email`), then the footer below it.

- [ ] **Step 8: Verify the nav anchor**

Click the **contact** item in the header nav (it points to `/#contact`).
Expected: the page scrolls to the new ContactCta section (not the footer).

- [ ] **Step 9: Commit**

```bash
git add app/components/landing/ContactCta.vue app/pages/index.vue app/components/AppFooter.vue i18n/locales/en.json i18n/locales/es.json
git commit -m "feat: add closing Contact CTA and move #contact anchor from footer"
```

---

## Self-Review

**Spec coverage:**
- Change 1 (Hook CTAs) → Task 1. ✓
- Change 2 (Testimonials, data-driven, auto-hide) → Task 2 (incl. Step 8 guardrail check). ✓
- Change 3 (ContactCta after Web3Quote, takes over `#contact`, footer loses id) → Task 3. ✓
- Resulting order `… Services → Testimonials → TechMarquee → Web3Quote → ContactCta → Footer` → Task 2 Step 5 + Task 3 Step 4. ✓
- Out of scope (no reorder of existing sections, no real copy, no about teaser, no Rolls/Hero change) — respected. ✓

**Placeholder scan:** Testimonial entries are intentional, clearly-labelled placeholder *content* (not plan placeholders); every code step shows complete code. No TBD/TODO logic. ✓

**Type consistency:** `Testimonial` interface fields (`id`, `quote`, `name`, `role`, `company`) are used identically in `testimonials.ts` and `Testimonials.vue` (`t.id`, `t.quote`, `t.name`, `t.role`, `t.company`, `initials(t.name)`). `global.meetingLink` / `global.email` used consistently. ✓
