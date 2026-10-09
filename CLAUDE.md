# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Ailen Gonzalez built with Nuxt 4 and Nuxt UI 4.

## Commands

```bash
# Install dependencies
bun install

# Development server (http://localhost:3000)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Linting
bun run lint
bun run lint:fix

# Type checking
bun run typecheck
```

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript
- **UI**: Nuxt UI 4 (Tailwind CSS v4 + Reka UI)
- **Animations**: own lightweight pieces — `<Reveal>` (fade/rise in on first view) and `useScrollProgress()` (scroll progress 0–1 with motion-style offsets); WebGL particles in `app/webgl/`
- **Icons**: Iconify (lucide & simple-icons sets)
- **Images**: @nuxt/image
- **Package Manager**: Bun

## Architecture

### Directory Structure
```
app/
├── components/          # Vue components (auto-imported)
│   └── landing/        # Landing page section components
├── layouts/            # Page layouts (default.vue wraps all pages)
├── pages/              # File-based routing
├── assets/css/         # Global styles (main.css)
├── utils/              # Utility functions (auto-imported)
├── data/               # Static data (projects.ts)
└── app.config.ts       # Runtime configuration (global settings, UI customizations)
```

### Key Files
- `app/app.config.ts` - Site configuration (contact info, footer, UI colors)
- `app/utils/links.ts` - Navigation menu items
- `app/data/projects.ts` - Project entries with typed interface
- `app/assets/css/main.css` - Theme colors, custom CSS classes

### Component Patterns
- Landing sections in `app/components/landing/` (Hero, Projects, Services, AboutMe, etc.)
- Layout components: AppHeader, AppFooter, SocialSidebar
- Default layout provides header/footer wrapper for all pages

## Styling

### Tailwind CSS v4 Syntax
Uses new import syntax in main.css:
```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Instrument Serif', serif;
}
```

### v4 Class Name Changes
- Use `bg-linear-to-*` instead of `bg-gradient-to-*`
- Use `shrink-0` instead of `flex-shrink-0`

### Theme Colors
- Primary: Purple (#A11EE2)
- Secondary: Peach (#FAC789)
- Custom classes: `.btn-gradient`, `.btn-gradient-text`

## Code Conventions

### ESLint Rules
- No trailing commas
- 1TBS brace style
- `@typescript-eslint/no-explicit-any` is disabled

### Vue Components
- Use `<script setup lang="ts">`
- Use `defineProps<T>()` with TypeScript generics
- Prefer Nuxt UI components: UButton, UIcon, UCard, UPage, UPageHero, etc.

### Animations
```vue
<!-- Fade + rise in the first time it scrolls into view -->
<Reveal :y="20" :duration="0.5" :delay="0.1">…</Reveal>
```
```ts
// Scroll progress of an element, 0 → 1 (offsets like motion's useScroll)
const progress = useScrollProgress(el, ['start end', 'end start'])
```

## Configuration

### App Config Access
```ts
const { global, footer } = useAppConfig()
// global.email, global.available, global.meetingLink
```

### Adding Projects
Edit `app/data/projects.ts` - each project has: id, title, description, image, tags, date, links (figma/github/preview)
