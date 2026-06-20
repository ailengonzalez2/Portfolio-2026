# Home Page Conversion Improvements — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)

## Goal

Increase the home page's ability to convert visitors into clients by adding three
conversion-focused elements without restructuring existing sections. All changes are
additive and isolated.

## Background

Current home page order (`app/pages/index.vue`):

`Rolls → Hero → Hook → Projects → Services → TechMarquee → Web3Quote → (Footer)`

Gaps identified:

1. No visible primary call-to-action above/near the fold. The hero `<h1>` is `sr-only`
   and the value prop only lives in i18n. The first actionable moment is far down the page.
2. No social proof anywhere in the codebase (no testimonials).
3. The page ends on a personal musing (`Web3Quote`) with the only booking CTA buried in
   the footer.

## Decisions (from brainstorming)

- Keep the cinematic Rolls/Hero reveal untouched; surface the headline CTA **after** it.
- Add the CTAs **into the existing Hook** section (Hook statement already is the value prop).
- Testimonials: **build now, data-driven, scaffolded with placeholders**, and auto-hide
  when empty so fake quotes cannot ship by accident.
- Closing contact CTA goes **after** `Web3Quote` (quote stays where it is).

## Resulting Order

`Rolls → Hero → Hook (+CTAs) → Projects → Services → Testimonials → TechMarquee → Web3Quote → ContactCta → (Footer)`

---

## Change 1 — Hook value-prop CTAs

**File:** `app/components/landing/Hook.vue` (edit)

Keep the animated statement exactly as-is. Add a button row beneath the `<p>`:

- **Book a call** — primary gradient button → `global.meetingLink` (target `_blank`).
- **View work** — secondary/ghost button → `/projects`.

Behaviour:

- Buttons wrapped in their own `ScrollReveal` with a delay so they appear just after the
  text, preserving the reveal moment.
- Use `UButton` (matches the rest of the site / footer CTA).
- New i18n keys: `hook.bookCall`, `hook.viewWork` in `en.json` and `es.json`.
  (`hero.bookCall` text may be reused for the value, but Hook gets its own keys for clarity.)

**Depends on:** `useAppConfig().global.meetingLink`, existing `ScrollReveal`, `UButton`.

---

## Change 2 — Testimonials section

**Files:**
- `app/data/testimonials.ts` (new) — typed data source.
- `app/components/landing/Testimonials.vue` (new).
- `app/pages/index.vue` (edit) — insert after `<LandingServices />`.
- `en.json` / `es.json` — eyebrow + heading keys only.

**Data interface:**

```ts
export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string      // e.g. "Founder"
  company: string   // e.g. "Acme"
}

export const testimonials: Testimonial[] = [ /* placeholder entries, clearly marked */ ]
```

**Component behaviour:**

- If `testimonials.length === 0`, render nothing (`v-if`) — section auto-hides. This is
  the trust guardrail: an empty array means no fake quotes ship.
- `SectionEyebrow` + heading (i18n), then a responsive grid (1 col mobile, 2–3 cols ≥ md).
- Each card: quote text, then author row = initials avatar (initials derived from `name`,
  no image asset) + name + `role`, `company`. Styling matches `ProjectCard`
  (`bg-background`, `ring-1 ring-black/5`, `rounded-2xl`).
- `ScrollReveal` on entry, consistent with neighbouring sections.
- Quotes live in the data file, NOT i18n (placeholder content, single-locale is fine for
  now; only the eyebrow/heading are translated).

**Placeholder content:** 3 entries with clearly-fictional names/companies so it is obvious
they are placeholders until real quotes replace them.

**Depends on:** existing `SectionEyebrow`, `ScrollReveal`, `useI18n`.

---

## Change 3 — Closing contact CTA

**Files:**
- `app/components/landing/ContactCta.vue` (new).
- `app/pages/index.vue` (edit) — insert after `<LandingWeb3Quote />`.
- `app/components/AppFooter.vue` (edit) — remove `id="contact"` from the footer.
- `en.json` / `es.json` — heading/subtitle/button keys.

**Component behaviour:**

- Full-width band with `id="contact"` so nav `/#contact` lands here (moved from footer).
- Large "Let's work together" headline + one supporting line.
- Primary **Book a call** button → `global.meetingLink` (target `_blank`).
- Secondary button → `mailto:` `global.email`.
- `ScrollReveal` on entry; styling consistent with the site (gradient accent allowed).

**Nav impact:** `app/utils/links.ts` already points `contact` → `/#contact`; moving the
`id` to this section makes that link resolve here. Footer keeps its own Book-a-call button
but loses the anchor id.

**Depends on:** `useAppConfig().global` (`meetingLink`, `email`), `UButton`, `ScrollReveal`.

---

## Out of Scope

- Restructuring or reordering existing sections (Projects/Services order unchanged).
- Real testimonial copy (user supplies later).
- About-me teaser on home (deferred).
- Any change to the Rolls/Hero animation.

## Testing / Verification

- `bun run lint` and `bun run typecheck` pass.
- `bun run dev`: Hook shows two working buttons; Testimonials renders 3 placeholder cards
  and disappears when the array is emptied; ContactCta appears before the footer and
  `/#contact` scrolls to it.
- Both `en` and `es` locales render all new copy with no missing-key warnings.
