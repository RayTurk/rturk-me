# Homepage section distinctiveness + About page rebuild

## Context

After shipping the 2026-06-21 visual-redesign-brand-refresh ([[visual-redesign-brand-refresh]]), the user reported the result didn't match the reference mockup closely enough: every homepage section that had a background used the same `<AnimatedBlobs compact />` glow, reading as repetitive rather than distinct per section (see memory `feedback_section_visual_distinctiveness`). The user also wants the About page rebuilt to much more closely match a second reference mockup (a full "About" page from the same reference site), which has substantially more structure than the current plain-prose About page: a photo+stats header, an expanded "My Story" with a decorative graphic, a tech-stack ticker, a "How I Think About Work" principles section, a "What I Don't Do" boundaries list, and a "Career Commits" git-commit-styled work history timeline with a scroll-animated connecting line.

This was scoped down significantly during brainstorming:
- Homepage: only fix the two sections that currently duplicate the same background (`Stats`, `HowIHelp`) — don't add decoration to every section, matching how the reference itself mixes plain and decorated sections.
- About: keep the existing 3 paragraphs of prose verbatim as "My Story" (no rewrite), skip the mockup's "Recognition" section (no real achievements to list), and build the rest with real content gathered from the user (resume screenshots, explicit answers) rather than fabricated placeholder copy.

## Part 1 — Homepage section-distinctiveness fixes

### `src/components/home/Stats.tsx`

Remove the `<AnimatedBlobs compact />` import and usage. Add `divide-x divide-hairline` to the stats grid container so the 4 counters are separated by vertical hairlines — a "data readout" look, distinct from the blob glow, requiring no new component.

### `src/components/home/HowIHelp.tsx`

Remove the `<AnimatedBlobs compact />` import and usage. Replace each card's `[01]`/`[02]`/`[03]`/`[04]` mono-text label with an `IconGlyph` (see Part 3), one variant per card:
- Web Development → `cross`
- Hosting & Maintenance → `dots`
- Performance & SEO Audits → `square`
- Consulting → `scatter`

### `src/components/interactive/Hero.tsx`

No change — `AnimatedBlobs` (full size) stays here. After this change it's the only place blobs appear on the homepage, which is the point: distinctiveness through non-repetition, not deletion.

## Part 2 — About page structure

`src/app/about/page.tsx` is rebuilt with this section order (replacing the current single prose block):

1. **Header** — `// index.about` mono label (matching the site's existing section-label convention), `About` h1, a one-line intro hook (draft below), the availability badge ("Open to new projects"), and the headshot photo (`/images/Headshot.jpg`) beside the text — mirroring the homepage Hero's layout pattern (text block + image, not a new pattern).

   Draft intro hook (user-approved as draft, edit freely): *"Full-stack developer in Cleveland, Ohio, building WordPress-powered sites that are fast, maintainable, and actually easy for clients to run."*

2. **Stats callout** — same 4 stats as the homepage `Stats` component, sourced from one shared array (see Part 3) so the two pages can't drift out of sync. No section number (matches the unnumbered header treatment used by Hero/Stats on the homepage).

3. **`02 — My Story`** — the existing 3 paragraphs from today's About page, verbatim, no rewrite:
   - The Neon Goldfish / Code The Land intro paragraph
   - "What I work with" (tech list paragraph)
   - "Beyond the editor" (closing paragraph)

   A `GridScatter` decorative graphic (Part 3) sits alongside the text. The section header uses the same small mono label style already established (`font-mono text-xs uppercase tracking-[0.15em] text-faint`, e.g. `02 — My Story`) — there's no large background numeral anywhere in this codebase today, so this introduces none.

4. **Tech stack ticker** — a `TechTicker` (Part 3) listing: Next.js, React, TypeScript, WordPress, WPGraphQL, PHP, Laravel, Tailwind, MySQL, Git, Docker, AWS, Node.js, Accessibility, Performance, E-commerce.

5. **`03 — How I Think About Work`** — 4 cards, each with an `IconGlyph` + title + description, same card shape as `HowIHelp`:

   1. **Maintainability over cleverness** (`cross`) — "Code the next developer (including future-me) can actually read and extend, not just code that works today."
   2. **Client empowerment over gatekeeping** (`dots`) — "Give non-technical clients real control over their own content (custom shortcodes, flexible layouts) instead of making every change depend on me."
   3. **Performance and reliability are features, not afterthoughts** (`square`) — "Load times, uptime, and Core Web Vitals are deliverables I measure, not nice-to-haves."
   4. **Diagnose before you patch** (`scatter`) — "Dig into the actual root cause methodically rather than shotgunning fixes and hoping."

6. **What I Don't Do** — plain header + intro line + a dash-bulleted list, no card styling:
   - "Open-ended 'make it pop' requests with no clear brief or decision-maker."
   - "Quick patches on a codebase nobody's willing to actually let me fix."
   - "Free, unpaid scope creep — ongoing support belongs in a retainer, not a favor."
   - "Vendor or platform lock-in that leaves a client without real ownership of their own site."
   - "Work where 'ship it fast' matters more than 'won't break in six months.'"

7. **`04 — Career Commits`** — a `CareerTimeline` (Part 3) with exactly 3 entries, most recent first, content verbatim from the user's resume:

   **Full-Stack Developer · Neon Goldfish** — Toledo, OH · May 2025–Present
   - Engineered 3–4 custom child themes that extended the agency's parent theme, implementing site-specific overrides and ACF flexible content layouts to empower clients with backend control over page composition.
   - Refactored core logic and overhauled core databases while maintaining existing client workflows, modernizing codebases.
   - Developed custom plugins for WooCommerce, SUMO Subscriptions, and GravityForms, including a bulk user import tool using Action Scheduler and a progressive pricing calculator for a service-industry manufacturer.
   - Managed server infrastructure across Linode, WP Engine, and DigitalOcean, optimizing PHP-FPM settings, troubleshooting DOM issues, and configuring Redis/Varnish object caching to enhance performance.
   - Integrated and debugged third-party payment and marketing APIs such as Stripe, PayPal, and Square, ensuring seamless transaction processes for clients.

   **WordPress Developer · Full Spectrum Marketing (FSM)** — Akron, OH · April 2024–March 2025
   - Engineered WordPress performance optimizations that achieved a 60% reduction in page load times and consistently maintained Google PageSpeed scores of 90%+ across client sites.
   - Designed custom shortcodes that enabled non-technical clients to create complex, dynamic content layouts without coding knowledge.
   - Developed bespoke WordPress plugins tailored to client specifications, enhancing core CMS functionality and delivering essential features for business needs.

   **Web Developer · Company 119** — Chardon, OH · March 2021–February 2024
   - Led all WordPress maintenance operations, managing a diverse portfolio of client websites while ensuring 99.9% uptime and rapid issue resolution.
   - Engineered a comprehensive ticketing system with custom automations that improved workflow efficiency, reducing average response time from 24 hours to under 4 hours.
   - Developed custom WordPress themes from concept to deployment, delivering unique, responsive designs that aligned with client brand guidelines.
   - Optimized website performance through caching implementation, database optimization, and image compression, resulting in significant enhancements to page load speeds and user experience.

8. **Contact CTA** — same visual pattern as the homepage's existing Contact CTA section (intro line + `BracketButton` to `/contact`), with copy specific to this page (not a duplicate of the homepage's "more →" link back to `/about`, since that would be circular here): *"Have a project or a role in mind? Send a note."* (matching the `/contact` page's own existing intro line) paired with a "Get in touch" `BracketButton`.

Two earlier resume roles (Classic BMW Service Coordinator, Edge Networks Help Desk) are intentionally excluded — no dev-relevant accomplishment bullets exist for them, so they don't fit the commit-log framing.

## Part 3 — New components

### `IconGlyph` — `src/components/icons/IconGlyph.tsx`

```ts
interface IconGlyphProps {
  variant: 'cross' | 'dots' | 'square' | 'scatter';
  className?: string;
}
```

Renders one small inline-SVG shape (viewBox ~24×24) in the current text color (`currentColor`, so callers control color via `text-ion` etc.) — no image assets, no icon library. Four variants: a plus/cross, a 2×2 dot grid, a single outlined square, and a small scattered-dots cluster. Pure presentational, no state, no animation.

### Shared stats data — `src/lib/constants.ts`

Add:

```ts
export const PROFILE_STATS = [
  { value: 6, suffix: '+', label: 'years' },
  { value: 30, suffix: '+', label: 'sites shipped' },
  { value: 99.9, suffix: '%', label: 'uptime' },
  { value: 95, suffix: '', label: 'avg lighthouse score' },
] as const;
```

`src/components/home/Stats.tsx` imports this instead of declaring its own local `STATS` array; the About page's stats callout imports the same constant.

### `TechTicker` — `src/components/about/TechTicker.tsx`

```ts
interface TechTickerProps {
  items: string[];
}
```

Renders `items` twice back-to-back inside an `overflow-hidden` track (`'use client'`, since it animates). Under normal motion: `motion.div` with `animate={{ x: ['0%', '-50%'] }}`, `transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}` — since the content is duplicated, animating exactly to `-50%` and looping is seamless. Under `useReducedMotion()`: renders `items` once, wrapped (`flex flex-wrap gap-3`), no scrolling, no duplication.

### `GridScatter` — `src/components/about/GridScatter.tsx`

A static decorative graphic: a fixed (hand-authored, not `Math.random()`-generated, to avoid SSR/client hydration mismatches) arrangement of ~15–20 small squares at varying fixed opacities, positioned via inline `style` percentages within an `absolute inset-0` container. No client JS, no `'use client'` directive, no animation — pure visual texture, fades in only via the existing `RevealOnScroll` wrapper around its parent section (no bespoke animation logic of its own).

### `CareerTimeline` — `src/components/about/CareerTimeline.tsx`

```ts
interface CareerEntry {
  role: string;
  company: string;
  location: string;
  dates: string;
  tag: string; // short colored label, e.g. "WordPress"
  description?: string;
  highlights: string[];
}
interface CareerTimelineProps {
  entries: CareerEntry[];
}
```

`'use client'`. Each entry renders as a card: role/company/dates header, a small colored tag pill, an optional description line, and a dark (`bg-void`) monospace box listing `highlights` with a `+` prefix in `text-ion`, mimicking a git-diff "added lines" block. A vertical line (`absolute left-0 w-px bg-ion`) runs down the left edge connecting entries; its height is driven by scroll progress through the whole timeline container via `useScroll({ target: ref, offset: ['start center', 'end center'] })` → `useTransform(scrollYProgress, [0, 1], ['0%', '100%'])` bound to the line's `height` style — same `useScroll`/`useTransform` pattern already established in `AnimatedBlobs`. Each entry's node marker (`scaleIn`-style, reusing the existing `fadeUpItem`/stagger primitives from `src/lib/animations.ts`) fades in via the existing `RevealOnScroll` stagger pattern, not bespoke logic.

Under `useReducedMotion()`: the connecting line renders at `height: '100%'` immediately (no scroll-tied transform) — consistent with every other animated component in this codebase.

## Out of scope (explicitly confirmed during brainstorming)

- No "Recognition" achievements section (no real content to put there).
- No rewrite of the existing "My Story" prose — used verbatim.
- No Career Commits entries for Classic BMW or Edge Networks (no dev-relevant bullets).
- No availability badge on the homepage Hero — About page header only, unless the user says otherwise during implementation.
- No new icon image assets (PNG/SVG files) — `IconGlyph` is inline vector markup only.
