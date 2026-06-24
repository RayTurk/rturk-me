# Visual polish pass: closing the gap with the reference site

## Context

After shipping the 2026-06-22 homepage-distinctiveness/About-rebuild work ([[homepage-distinctiveness-about-rebuild]]), the user reported the live result still didn't match the reference mockups closely enough — "that was the entire point." Screenshotting the actual rendered site (not just relying on passing tests) confirmed the gap: several effects built in the prior pass (`BracketButton`'s corner brackets, `GridScatter`, the tech ticker) render but are too visually subtle to register, and the stats/service-card/work-card layouts don't match the reference's actual proportions and emphasis.

This spec is grounded in directly screenshotting the live reference site (https://codedgar.com) rather than working from memory — including a close-up capture of its primary button's idle vs. hover state, which revealed a button behavior (solid fill → ghost outline) that hadn't been previously identified. It also incorporates the user's explicit decision to merge this fix with the *original* magnetic pointer-following behavior that existed on `MagneticButton` before it was replaced by `BracketButton` in the prior pass.

## Decisions made during brainstorming

- No project card images are added yet (none exist in `public/`) — the user will drop screenshots at `public/images/projects/{summit-hvac,luminary-aesthetics,ember-oak,revive-detailing,clover-garden,beacon}.jpg` (paths the static fallback data already expects) whenever ready; the card markup renders them if present and renders nothing if absent, so this isn't a blocker.
- "Web Development" is the one `HowIHelp` card that gets the reference's "highlighted/primary" tinted-card treatment; the other 3 stay as plain cards.
- `Stats` switches from a full-width 4-column strip to a compact, bordered 2×2 box with bigger numbers, used identically (same shared `PROFILE_STATS`) on both the homepage and the About page. It stays its own centered section rather than being inlined beside paragraph text (a larger structural change than this pass covers).
- `BracketButton` gets two combined changes: (1) idle/hover color inversion (solid fill at rest → ghost outline + visible brackets on hover, instead of always-faintly-visible brackets), and (2) the original `MagneticButton` pointer-following motion, reapplied to the whole button (so the brackets move with it as one unit).

## Part 1 — `BracketButton`: hover-reveal brackets + magnetic pull

**File:** `src/components/interactive/BracketButton.tsx` (rewrite)

Current behavior: corner brackets and a pulse dot are always rendered, springing from a 4px to 12px offset on hover — too subtle to notice, and there's no fill/color change at all between idle and hover.

New behavior:
- **Idle:** solid fill (`bg-ion`, `text-void`, `border border-ion` — border is the same color as the fill so it's invisible until the fill drops away). No visible corner brackets, no visible pulse dot (`opacity: 0`).
- **Hover:** fill becomes transparent (`bg-transparent`), text and border become `ion`-colored (a ghost/outline button) via a plain Tailwind `transition-colors hover:bg-transparent hover:text-ion`. Simultaneously, the 4 corner brackets and the pulse dot fade in (`opacity` motion value 0 → 1) while springing outward (4px → 12px offset, the existing "tug and pull"). **And** the whole button eases toward the pointer's position within its own bounds — the original `MagneticButton` behavior (relative offset from center × 0.3, spring-eased via the existing `springSoft` config from `src/lib/animations.ts`), applied to the same outer element so the brackets move together with the button as one visual unit, not detached from it.
- **Leave:** everything springs back — brackets to 4px offset and `opacity: 0`, magnetic position back to `(0, 0)`.
- **Color ownership:** the component now owns its base styling (`rounded-lg px-5 py-2.5 font-semibold` plus the idle/hover colors) rather than each call site repeating it. `className` is still accepted for additive/unique classes only. Exact before/after for all 3 call sites:
  - `src/app/page.tsx:75` — from `<BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">` to `<BracketButton href="/contact">` (no `className` needed at all — everything it specified is now the component's default).
  - `src/app/about/page.tsx:219` — identical change, same reasoning: `<BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">` becomes `<BracketButton href="/contact">`.
  - `src/components/contact/ContactForm.tsx:277-281` — from `className="bg-ion text-void font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"` to `className="disabled:opacity-50"` (the only thing this call site needs that isn't already a component default).
- **Reduced motion:** unchanged pattern — renders a plain link/button with the idle solid-fill colors and no brackets, no magnetic motion, no transitions beyond what reduced-motion users get elsewhere in this codebase.

## Part 2 — `Stats`: compact bordered 2×2 box

**File:** `src/components/home/Stats.tsx` (the same component used by both the homepage and the About page via `PROFILE_STATS`)

Replace the current `grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-hairline` full-width layout with a centered, bordered box: `max-w-md mx-auto rounded-xl border border-hairline bg-panel p-8`, containing a `grid grid-cols-2` of the 4 stats with internal divider lines forming a real 2×2 grid (top-left cell gets a right + bottom border, top-right gets a bottom border, bottom-left gets a right border, bottom-right gets no border — all `border-hairline`). The section wrapper (`<section>`) stays as-is structurally; only the inner grid markup changes.

**File:** `src/components/animations/AnimatedCounter.tsx`

Bump the rendered number from `text-4xl` to `text-5xl` for stronger size contrast against the label, matching the reference's much bigger/bolder stat numbers. No prop or logic changes — purely the className on the existing `<span>`.

## Part 3 — `HowIHelp`: tighter cards, "Web Development" highlighted

**File:** `src/components/home/HowIHelp.tsx`

- Card padding drops from `p-6` to `p-5` for a tighter, denser feel closer to the reference.
- The "Web Development" card (and only that one) gets: `bg-ion/10` background tint, `border-ion/40` border (replacing the default `border-hairline`), and its `<h3>` rendered in `text-ion` instead of `text-signal`. Implemented as a per-card conditional className/text-color based on `service.title === 'Web Development'` — no new field needed on the `SERVICES` array since there's only one such card.
- The other 3 cards (Hosting & Maintenance, Performance & SEO Audits, Consulting) are visually unchanged apart from the padding decrease.

## Part 4 — Homepage "Selected Work" cards: image slot, accent title, tag pills

**File:** `src/app/page.tsx`

The `PROJECT_FRAGMENT_MINIMAL` GraphQL fragment (already used by `GET_FEATURED_PROJECTS`) already selects `featuredImage.node.sourceUrl` and `techStacks.nodes { name slug }` — this is a frontend-rendering-only change, no query changes needed.

Updated card markup:
```tsx
<TiltCard
  href={`/work/${project.slug}`}
  className="block overflow-hidden rounded-xl border border-hairline bg-panel transition-colors hover:border-ion/40"
>
  {project.featuredImage?.node?.sourceUrl ? (
    <img
      src={project.featuredImage.node.sourceUrl}
      alt=""
      className="aspect-video w-full object-cover"
    />
  ) : null}
  <div className="p-6">
    <p className="font-mono text-xs text-faint">case-study/{project.slug}</p>
    <h3 className="mt-2 font-display text-xl font-semibold text-ion">{project.title}</h3>
    {project.techStacks?.nodes?.length ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {project.techStacks.nodes.map((tech) => (
          <span
            key={tech.slug}
            className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] text-faint"
          >
            {tech.name}
          </span>
        ))}
      </div>
    ) : null}
  </div>
</TiltCard>
```

Two changes from today's card: the `case-study/{slug}` label drops from `text-ion` to `text-faint`, and the title moves from plain `text-signal`-ish default to `text-ion` — so there's exactly one accent-colored element per card (the title), matching the reference's pattern of "muted label, accent-colored title." The image renders only when `featuredImage.node.sourceUrl` is present (true today for none of the 6 `STATIC_PROJECTS` fallback entries until the user drops files at the paths already referenced in `src/lib/data/projects.ts`, true for any live CMS project that has a featured image set) — absence renders nothing, no broken-image icon, no layout shift since there's no reserved empty space when the `<img>` is conditionally omitted entirely.

## Part 5 — `DotGrid` and `GridScatter`: visibility bump

**File:** `src/components/interactive/DotGrid.tsx`

`DOT_GRID_STYLE`'s `radial-gradient` opacity goes from `0.06` to `0.14` — still subtle, but registers against the dark background.

**File:** `src/components/about/GridScatter.tsx`

Each entry in `SQUARES` gets its `size` increased by roughly 50% (e.g. 6→9, 8→12, 10→15) and `opacity` values raised into a `0.3`–`0.7` range (from the current `0.2`–`0.5`), keeping the same fixed/deterministic positions — only the visual weight changes, not the layout or the no-animation/no-hooks architecture.

## Out of scope (explicitly confirmed during brainstorming)

- No project screenshot images are fabricated — only wired up to render if/when the user supplies real files at the already-expected paths.
- No structural change inlining `Stats` beside body text on either page — it stays its own centered section.
- No highlight treatment added to any card besides "Web Development" in `HowIHelp`.
- No changes to `IconGlyph`, `TechTicker`, `CareerTimeline`, or the About page's "How I Think About Work" cards (no analogous "highlight" concept applies there — principles aren't ranked).
