---
title: The Figma → Vue handoff I actually use
description: Tokens as CSS variables, components named 1:1, variants that map to props — the small conventions that keep design and code in sync without a process tax.
date: 2026-08-03
category: Frontend
i18nKey: figmaVue
readingTime: 7 min read
---

I sit on both sides of the handoff: I design in Figma and I build in Vue. That vantage point taught me something uncomfortable — most handoff pain isn't a tooling problem, it's a *naming* problem. The design says `Primary/Hover`, the code says `btn-main-alt`, and every conversation about the UI needs a translator.

Nothing below requires a plugin, a design-ops team, or a "design system project". It's a handful of conventions I apply on every project, including solo ones — because the person translating my own Figma file into code three weeks later is me, with no memory of what I meant.

## Tokens live in one place, and that place is CSS

Every value that Figma calls a *variable* — colors, type scale, radii, spacing — becomes a CSS variable in code. With Tailwind v4 this is delightfully direct, because the theme *is* CSS:

```css
/* main.css */
@theme static {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Instrument Serif', serif;

  --color-primary: #a11ee2;
  --color-secondary: #fac789;
  --color-heading: #0f172b;
  --color-body: #45556c;

  --radius-card: 1rem;
}
```

The rule that makes this work: **the Figma variable name and the CSS variable name are the same name.** `color/primary` ↔ `--color-primary`. When the designer (me, or a client's designer) renames or retunes a token, the diff in code is one line, and nobody has to reverse-engineer which of five near-identical purples this button was supposed to use.

The anti-pattern is hex values scattered through templates. The moment a `#a11ee2` appears inline, that element has silently left the design system, and no Figma update will ever reach it again.

## Components map 1:1 — same name, same boundaries

If the Figma file has a component called `ProjectCard`, the repo has `ProjectCard.vue`. Not `WorkItem.vue`, not a `Card.vue` with fifteen conditional slots. Same name, same boundary.

This sounds cosmetic. It isn't. The component boundary is where every conversation about a UI happens — "the testimonial card looks off on mobile" — and when boundaries match, that sentence points at exactly one file and one Figma frame. When they don't, you get archaeology.

The corollary: **variants become props.** A Figma component with variants `size: sm | md` and `tone: default | featured` becomes:

```vue
<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md'
  tone?: 'default' | 'featured'
}>()
</script>
```

Same axis names, same option names. If a variant combination doesn't exist in Figma, it shouldn't be expressible in code — that's what the union types are for. I've come to treat a prop that has no corresponding variant as a smell: either the design is missing a state, or the code grew an option nobody designed.

## Auto layout is a flexbox spec — read it as one

Figma's auto layout panel *is* the flex spec, written in different words. The mapping is mechanical:

| Figma | CSS |
|---|---|
| Direction: horizontal | `flex` (row) |
| Gap: 24 | `gap-6` |
| Padding: 16 / 24 | `px-6 py-4` |
| Hug contents | (natural size — no class) |
| Fill container | `flex-1` / `w-full` |
| Fixed width | a real `w-*` — and a question |

Two habits on top of the table. First, **snap Figma values to the spacing scale** — a gap of 24 is `gap-6`, a gap of 23 is a mistake in the file, not a `gap-[23px]` in the code. Arbitrary values are how a design system dies one pixel at a time. Second, treat *Fixed width* as a prompt to ask "what happens when the content grows?" — fixed sizes in Figma are usually placeholders for a responsive rule the design hasn't stated yet. Better to resolve that at handoff than in a bug report.

## Spec states, not screenshots

The static frame is the least interesting part of a handoff. What the build actually needs, and what I write as a short block of notes next to each component in the Figma file:

- **Hover / focus / active** — even just "darken 5%, ring on focus"
- **Empty, loading, error** — the states everyone designs last and users see first
- **Text overflow** — does the title truncate, wrap, or push the layout?
- **Motion intent** — one line, like "card lifts on hover, fades in on scroll, 300ms"

Five minutes of writing per component. It replaces the entire class of "the design didn't say" bugs, which in my experience outnumber the "the code got it wrong" bugs comfortably.

## The point is fewer translations

None of this is a process. There's no sync meeting, no token pipeline, no plugin subscription. It's one principle applied everywhere: **design and code should use the same words for the same things** — token names, component names, variant names, spacing steps. Every place the vocabularies match is a translation that no longer needs to happen, and every translation you delete is a bug that can't be introduced.

I offer this end to end — same person designing the file and shipping the Nuxt app, so the handoff cost rounds to zero. If that's the kind of help your project needs, [let's talk](/#contact).
