# Visual redesign: brand refresh + interaction/content pass

## Context

The user wants the site restyled with inspiration from a reference portfolio ("codedgar.com" by Edgar Pérez — screenshots reviewed during brainstorming), specifically: a unique brand accent color (`#ff4200`), an elastic "tug and pull" corner-bracket hover effect on primary buttons, and more animation on stats and backgrounds. The reference site is light-themed and has several content sections (problem-statement cards, stats, services, testimonials, big footer wordmark, a fixed novelty status bar) that this site doesn't have.

Decisions made during brainstorming narrowed this to a **dark-theme-preserving, structurally-inspired** refresh rather than a literal clone:

- Keep the existing dark theme (`void`/`panel`/`signal` tokens); swap the cyan `ion` accent for `#ff4200`. No light-mode switch.
- Add: animated stats counters, a "How I Help" services section, a rebuilt big-wordmark footer, the corner-bracket "tug and pull" button effect, sitewide animated dot-grid background, animated (not static) gradient blobs with scroll parallax.
- Explicitly skip: testimonials (no real quotes provided), a "Problem" pain-point section (pure copywriting the user didn't draft), the reference's fixed bottom novelty status bar (too specific to Edgar's personal brand), any light-theme work.

This site already has real animation infrastructure to build on: `motion/react` (Motion/Framer Motion), a `useReducedMotion` hook gating every animated component, shared spring config (`springSoft`) and scroll-reveal variants (`staggerContainer`/`fadeUpItem`) in `src/lib/animations.ts`, and existing pointer-reactive components (`MagneticButton`, `TiltCard`, `ParticleField`). New work follows these established patterns rather than introducing a second animation paradigm.

## Part 1 — Color tokens & background system

### Color swap

`src/app/globals.css` defines theme colors as CSS custom properties consumed via Tailwind utility classes (`text-ion`, `bg-ion`, `border-ion`, `decoration-ion`) across ~25 files. Changing the **value** of one token cascades everywhere with no per-file edits needed:

```css
--color-ion: #ff4200; /* was #22d3ee */
```

`--color-drift` (`#a78bfa`, purple) stays unchanged as the secondary accent — orange + purple reads as an intentional pairing.

**Contrast check:** `#ff4200` against `--color-void` (`#0a0b0f`) computes to a **5.66:1** contrast ratio (WCAG relative-luminance formula), comfortably passing AA (4.5:1) for normal text in both directions (orange text on dark bg, and dark text on orange bg, e.g. the Header's `bg-ion text-void` contact pill). This matters because the codebase already has dedicated a11y commits (Lighthouse AA color-contrast fixes) — this change must not regress them. Re-run Lighthouse CI (already wired up per `lighthouserc.json`) after the swap to confirm.

### `ParticleField` recolor

`src/components/interactive/ParticleField.tsx` hardcodes particle/line colors as `rgba(34, 211, 238, ...)` (the old cyan, not derived from the CSS variable since it draws on a `<canvas>` via JS, not CSS classes). Update both hardcoded rgba literals to the new accent's RGB equivalent (`255, 66, 0`).

### Sitewide animated dot-grid background

New component (e.g. `src/components/interactive/DotGrid.tsx`), mounted once in `src/app/layout.tsx` behind all page content (`fixed inset-0 -z-10`, `aria-hidden`):

- A repeating dot pattern via CSS `radial-gradient` background-image tile (~24px grid spacing, ~4% opacity white dots on the dark background).
- Under normal motion: the pattern's `background-position` animates very slowly (e.g. a 60s+ linear loop) for a subtle drifting texture.
- Under `useReducedMotion`: renders the static pattern with no position animation.
- Replaces the current hero-only background treatment — same visual language, now present behind every page.

### Animated, parallaxing gradient blobs

`src/components/interactive/Hero.tsx` currently renders two **static** radial-gradient blobs (ion-tinted top-right, drift-tinted bottom-left). Changes:

- Each blob's position/scale animates on an infinite yoyo loop (Motion `animate` prop), independently timed so they don't move in lockstep.
- Both gain scroll-tied parallax: `useScroll` + `useTransform` shifts each blob's `y` position as the page scrolls, so they drift relative to content rather than scrolling 1:1 with it.
- The same blob-pair pattern (smaller scale, lower opacity) is reused as a background accent behind the new Stats and How I Help sections (Part 3), so animated background motion isn't concentrated only at the top of the page.
- All of the above gated by `useReducedMotion` exactly like existing components — reduced-motion users get the static original blobs with no animation.

## Part 2 — Interaction primitives

### `BracketButton` — the "tug and pull" effect

New component, `src/components/interactive/BracketButton.tsx`, structured like `MagneticButton`/`TiltCard` (Motion + `useReducedMotion` fallback to a plain styled `Link`):

- Renders its children inside a button/link, with four small "L"-shaped corner marks (absolutely positioned divs with two `border` edges each, `ion`-colored) just outside the content's padding box.
- **Idle state:** corners sit close to the button (small offset, e.g. 4px outside each edge).
- **Hover:** each corner springs outward to a larger offset (e.g. 12px) via a snappy Motion spring (a new, snappier config than `springSoft` — e.g. `{ stiffness: 300, damping: 20 }` — since this should feel like a quick elastic "pull," not a slow ease) — visibly stretching the frame open around the button.
- **Pointer leave:** corners spring back to the idle offset — the "snap back."
- One corner carries a small accent dot that gently pulses (opacity loop, independent of hover state) for a "live/focused" feel, matching the small dot details visible on the reference's primary buttons and cards.
- **Usage scope:** reserved for primary, high-emphasis CTAs only — the homepage "Get in touch" button (replacing its current `MagneticButton` usage) and the contact page's submit button. Not applied to secondary links, card links, or nav items — those keep their current plain hover treatment (color change / underline), matching how sparingly the reference itself uses this effect.
- Reduced motion: renders as a plain bordered button/link with no corner elements and no animation.

### `AnimatedCounter` — stat count-up

New component, `src/components/animations/AnimatedCounter.tsx`:

- Props: `value: number`, `suffix?: string` (e.g. `'+'`, `'%'`), `label: string`.
- Uses Motion's `useInView` (or `whileInView`) to trigger only once, when scrolled into view, then animates a motion value from `0` to `value` over ~1.2s with an ease-out curve, rendering the rounded integer as text each frame.
- Reduced motion: renders the final `value` immediately, no count animation, no `useInView` dependency.

## Part 3 — Content sections & page wiring

### Stats strip (homepage, after Hero)

Four `AnimatedCounter`s in a horizontal row (wrapping to 2x2 on mobile), with the small ion-tinted blob-pair background accent from Part 1:

| Value | Suffix | Label |
|---|---|---|
| 6 | + | years |
| 30 | + | sites shipped |
| 99.9 | % | uptime |
| 95 | (none) | avg Lighthouse score |

### "How I Help" section (homepage, after Selected Work, before Pipeline)

Follows the site's existing numbered-section convention (`// 04 — How I Help`, continuing from the current `01 —`/`02 —` headers) rather than introducing custom icon graphics. Four cards in a responsive grid, each with a `[0N]` mono label, a bold title, and a description. **Draft copy — user to review/edit before this ships:**

1. **Web Development** — "Custom websites and web apps — headless WordPress + Next.js, or whatever stack actually fits the job."
2. **Hosting & Maintenance** — "A monthly retainer covering hosting, updates, backups, and the small fixes that keep a site healthy long after launch."
3. **Performance & SEO Audits** — "A clear-eyed look at load times, Core Web Vitals, and search visibility, with a prioritized list of what to fix first."
4. **Consulting** — "A second opinion on an architecture decision or a stuck project — hourly or project-based."

### Updated homepage section order

Hero → Stats → Selected Work → How I Help → Under the Hood (Pipeline) → Writing → Contact CTA. Existing section number headers (`01 —`, `02 —`, `03 —`) renumber to account for the two insertions.

### Footer rebuild

`src/components/layout/Footer.tsx` replaces its current single-line (`© year · github · linkedin · colophon`) layout with:

- A large wordmark (`RAY TURK`, styled like the reference's oversized footer logotype — big `font-display`, full-bleed within the footer's max-width container).
- Sitemap-style link columns: **Work** (`/work`), **Writing** (`/writing`), **About** (`/about`), **Contact** (`/contact`) in one column; a **Services** column listing the four "How I Help" offerings (plain text or linking to `/contact` with a query param — implementation detail for the plan, not the design).
- GitHub/LinkedIn/colophon/cookie-prefs links retained, repositioned into this layout (e.g. a slim row below the columns) rather than removed.
- Copyright line retained at the bottom.

### Work page card touch-up

`src/app/work/page.tsx` cards gain tag chips sourced from `project.technologiesUsed?.nodes` when present (rendered via `.map`, nothing rendered if the array is empty/absent) — this is additive and optional-chained, so it works whether or not the ACF data-layer spec from the prior conversation (`2026-06-21-acf-project-fields-cleanup-design.md`) has been implemented yet. No other structural change to the work list page in this pass.

## Out of scope (explicitly confirmed during brainstorming)

- No light-theme switch — dark theme stays.
- No testimonials section (no real client quotes supplied).
- No "Problem" pain-point framing section (pure copywriting, not provided).
- No fixed bottom novelty status bar (mode label / fake now-playing / clock gimmick).
- No new icon asset design — section numbering reused instead.
- Work page case-study detail page (`work/[slug]`) layout is untouched in this pass beyond whatever falls out of the ACF spec; no new "year/role" badge UI designed here since that depends on fields not yet implemented.
