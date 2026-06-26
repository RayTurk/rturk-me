# Codedgar layout language: section labels, ghost numbers, pixel icons, footer wordmark

## Context

After the 2026-06-23 visual polish pass spec ([[visual-polish-pass]]), the user reviewed the Codedgar reference site (codedgar.com) and identified a set of layout-language patterns to adopt as an extension on top of the existing plan. The dark color palette (`void` / `panel` / `ion` / `drift` / `signal` / `muted` / `faint`) is kept unchanged. All changes in this spec are additive: the existing polish-pass spec (BracketButton magnetic hover, Stats 2×2 box, HowIHelp card highlight, work card images, DotGrid/GridScatter visibility) stays in scope and ships alongside these.

## Decisions made during brainstorming

- Extension on top of the existing polish pass plan — not a replacement.
- Footer wordmark becomes large, centered, clamp-responsive. Tagline added beneath it.
- Section label format: full Codedgar pattern — `// section.name` comment-style label above every section heading, plus a large ghost number anchored top-right of the section. Applied consistently across all pages.
- `IconGlyph` upgraded from simple line SVGs to pixel-art dot-matrix icons (4×4 grid of filled `<rect>` elements, `currentColor`). No prop changes.
- One `border-ion` colored accent divider per page on the primary content section. All others stay `border-hairline`.

## Part 1 — `SectionLabel` component

**New file:** `src/components/layout/SectionLabel.tsx`

```tsx
interface Props {
  label: string;   // e.g. "section.selected-work"
  number?: string; // e.g. "01" — omit on page headers or unlabeled sections
}
```

Renders two things:
1. `<p className="font-mono text-xs text-faint">// {label}</p>` — the comment-style label
2. When `number` is provided: an absolutely-positioned ghost number inside the same `relative` wrapper. Styling: `pointer-events-none select-none aria-hidden font-display text-[8rem] font-black leading-none text-signal/[0.05] absolute right-0 top-0`

The component's root element is `relative`. The ghost number is positioned at `right-0 top-0` within that wrapper and allowed to overflow the component's height downward — it reads visually as a large watermark in the upper-right of the section without requiring any changes to the parent section's positioning context.

Usage pattern at every section:
```tsx
<section className="border-t border-hairline py-16">
  <SectionLabel label="section.selected-work" number="01" />
  <h2 className="mt-2 font-display text-2xl font-semibold">Selected Work</h2>
  ...
</section>
```

The `mt-2` on `<h2>` preserves the visual gap between the label and the heading title.

### Sections updated (label → number)

**Homepage (`src/app/page.tsx`):**
- Hero: no `SectionLabel` (it's the page intro, not a numbered section)
- Selected Work: `section.selected-work` → `01`
- HowIHelp: label moved inside `HowIHelp.tsx`, `section.how-i-help` → `02`
- Pipeline: label added inside `Pipeline.tsx` if it has a heading, `section.process` → `03`
- Writing: `section.writing` → `04`
- Contact CTA: no `SectionLabel` (it's a CTA block, not a headed section)

**About page (`src/app/about/page.tsx`):**
- Page header: `// page.about` above `<h1>` (no ghost number)
- My Story: `section.my-story` → `02`
- How I Think About Work: `section.principles` → `03`
- What I Don't Do: no `SectionLabel` (subsection under the principles area, uses its own `font-display` heading)
- Career Commits: `section.career` → `04`

**Work page (`src/app/work/page.tsx`):**
- Page header: `// page.work` above `<h1>` (no ghost number)

**Writing page (`src/app/writing/page.tsx`):**
- Page header: `// page.writing` above `<h1>` (no ghost number)

**Contact page (`src/app/contact/page.tsx`):**
- Page header: `// page.contact` above `<h1>` (no ghost number)

### Existing inline labels removed / replaced

All current inline section labels (`font-mono text-xs uppercase tracking-[0.15em] text-faint` strings like `"02 — My Story"` and `"// index.about"`) are replaced by `<SectionLabel />` calls. No other heading or copy changes.

## Part 2 — Footer wordmark

**File:** `src/components/layout/Footer.tsx`

Replace the current left-aligned `text-5xl md:text-7xl` wordmark block with a centered block at the top of the footer:

```tsx
<div className="text-center">
  <p className="font-display font-black leading-none tracking-tighter text-signal"
     style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
    RAY TURK
  </p>
  <p className="mt-2 font-mono text-xs text-faint">
    full-stack developer · cleveland, oh
  </p>
</div>
```

Below this, a `border-t border-hairline mt-10 pt-8` separator, then the nav columns. The nav grid changes from `grid-cols-2 md:grid-cols-3` to `grid-cols-3` (sitemap | services | social links) so it sits symmetrically under the centered wordmark. The bottom bar (copyright, github, linkedin, colophon, cookie prefs) is unchanged.

Nav column 3 (new) contains the external links currently in the bottom bar: `github` and `linkedin` as `<a>` tags. The bottom bar retains copyright + colophon + cookie prefs only.

## Part 3 — `IconGlyph` pixel-art upgrade

**File:** `src/components/icons/IconGlyph.tsx`

ViewBox stays `0 0 24 24`. Each pixel is a `4×4` `<rect>` with a `1.5px` gap. Grid origin at `x=1, y=1`. Column x-positions: `1, 6.5, 12, 17.5`. Row y-positions: `1, 6.5, 12, 17.5`. All pixels use `fill="currentColor"`.

Pixel patterns (1 = filled, 0 = empty, row-major order):

```
cross (plus):            dots (4 corners):
  0 1 1 0                  1 0 0 1
  1 1 1 1                  1 0 0 1
  1 1 1 1                  0 0 0 0
  0 1 1 0                  1 0 0 1

square (hollow):         scatter (asymmetric):
  1 1 1 1                  1 0 1 0
  1 0 0 1                  0 1 0 0
  1 0 0 1                  0 0 1 0
  1 1 1 1                  1 0 0 1
```

Rendered size bumps from `width={20} height={20}` to `width={24} height={24}`. The `variant` and `className` props are unchanged — all 8 call sites (4 in `src/app/about/page.tsx` PRINCIPLES array, 4 in `src/components/home/HowIHelp.tsx` SERVICES array) require no changes.

## Part 4 — Colored accent dividers

One section per page gets `border-ion` instead of `border-hairline` on its top border. All others stay `border-hairline`.

| Page | Section | Change |
|------|---------|--------|
| Homepage | Selected Work | `border-hairline` → `border-ion` |
| About | My Story | `border-hairline` → `border-ion` |
| Work | Projects grid | `border-hairline` → `border-ion` (add `border-t` wrapper if needed) |
| Writing | Posts list | `border-hairline` → `border-ion` (add `border-t` wrapper if needed) |
| Contact | Form section | `border-hairline` → `border-ion` (add `border-t` wrapper if needed) |

Work, Writing, and Contact pages currently have no section-level `border-t` — the `border-ion` will be added as a `border-t border-ion` on the content container div.

## Out of scope

- No color palette changes — `void`, `panel`, `ion`, `drift`, `signal`, `muted`, `faint` are unchanged.
- No new icon variants beyond the 4 existing ones (`cross`, `dots`, `square`, `scatter`).
- No ghost numbers on page headers (only section headings get numbered).
- No full-viewport-width colored rule (accent divider stays within the `max-w-5xl` content column).
- No changes to `BracketButton`, `Stats`, `HowIHelp` card highlight, `DotGrid`/`GridScatter`, or work card images — those are covered by the existing [[visual-polish-pass]] spec.
