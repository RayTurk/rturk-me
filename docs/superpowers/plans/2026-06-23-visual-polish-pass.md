# Visual Polish Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gap between the current site and the reference site (https://codedgar.com) by fixing 5 specific, evidence-based visual issues: button hover behavior, stats layout, a highlighted service card, work-card content, and background decoration visibility.

**Architecture:** Each task modifies an existing, already-tested component or page in place — no new components are introduced. `BracketButton` gains the original `MagneticButton` pointer-following behavior merged with a hover-triggered color/bracket reveal. Everything else is a markup/value change to already-working code.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`) v12, Vitest + Testing Library.

## Global Constraints

- Every animated component must continue to call `useReducedMotion()` and render a fully static fallback when it returns `true` — this plan modifies `BracketButton`, which already follows this pattern; preserve it exactly.
- `BracketButton`'s base styling (`rounded-lg px-5 py-2.5 font-semibold`, idle `bg-ion`/`text-void`, hover `bg-transparent`/`text-ion`) moves into the component itself — callers pass `className` only for genuinely additional/unique classes.
- No project screenshot images are fabricated. They already exist at `public/images/projects/{summit-hvac,luminary-aesthetics,ember-oak,revive-detailing,clover-garden,beacon}.jpg` (confirmed present) — Task 4 only needs to render them if present, with no broken-image fallback needed.
- `Stats`'s underlying data stays `PROFILE_STATS` from `src/lib/constants.ts` — only the surrounding markup/layout changes, on both the homepage (`Stats.tsx`) and the About page's separate inline usage of the same constant.

---

### Task 1: `BracketButton` — hover-reveal brackets + magnetic pull

**Files:**
- Modify: `src/components/interactive/BracketButton.tsx` (full rewrite)
- Test: `src/components/interactive/__tests__/BracketButton.test.tsx` (full rewrite)
- Modify: `src/app/page.tsx:75`
- Modify: `src/app/about/page.tsx:219`
- Modify: `src/components/contact/ContactForm.tsx:277-281`

**Interfaces:**
- `BracketButton`'s props are unchanged: `{ children, className?, href?, type?, onClick?, disabled? }`. Only its internal behavior and default styling change — no caller-visible API change beyond what classes callers now need to pass (fewer).

- [ ] **Step 1: Write the failing tests**

Replace `src/components/interactive/__tests__/BracketButton.test.tsx` in full:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BracketButton from '../BracketButton';

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

describe('BracketButton', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders corner brackets and a pulse dot when motion is enabled', () => {
    mockMatchMedia(false);
    const { container } = render(<BracketButton href="/contact">Get in touch</BracketButton>);
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(5);
  });

  it('renders a plain link with no decoration under reduced motion', () => {
    mockMatchMedia(true);
    const { container } = render(<BracketButton href="/contact">Get in touch</BracketButton>);
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });

  it('renders as a button when href is omitted', () => {
    mockMatchMedia(false);
    const onClick = vi.fn();
    render(
      <BracketButton type="submit" onClick={onClick} disabled={false}>
        Send Message
      </BracketButton>
    );
    const button = screen.getByRole('button', { name: 'Send Message' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders the idle solid-fill colors by default', () => {
    mockMatchMedia(false);
    render(<BracketButton href="/contact">Get in touch</BracketButton>);
    const link = screen.getByRole('link', { name: 'Get in touch' });
    expect(link.className).toContain('bg-ion');
    expect(link.className).toContain('text-void');
  });

  it('includes hover classes that invert to a ghost outline', () => {
    mockMatchMedia(false);
    render(<BracketButton href="/contact">Get in touch</BracketButton>);
    const link = screen.getByRole('link', { name: 'Get in touch' });
    expect(link.className).toContain('hover:bg-transparent');
    expect(link.className).toContain('hover:text-ion');
  });

  it('does not throw when the pointer moves over the button (magnetic tracking)', () => {
    mockMatchMedia(false);
    render(<BracketButton href="/contact">Get in touch</BracketButton>);
    const link = screen.getByRole('link', { name: 'Get in touch' });
    expect(() => {
      link.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 100, height: 40, right: 100, bottom: 40, x: 0, y: 0, toJSON: () => {} }) as DOMRect;
      link.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      link.dispatchEvent(new PointerEvent('pointermove', { clientX: 60, clientY: 25, bubbles: true }));
      link.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    }).not.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx vitest run src/components/interactive/__tests__/BracketButton.test.tsx`
Expected: the first 3 tests PASS (unchanged behavior); the 3 new tests (idle colors, hover classes, pointer-move smoke test) FAIL because the current component doesn't have `bg-ion`/`text-void`/`hover:bg-transparent`/`hover:text-ion` in its base class and doesn't yet handle `onPointerMove`.

- [ ] **Step 3: Rewrite the component**

Replace `src/components/interactive/BracketButton.tsx` in full:

```tsx
'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { springSoft } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BracketButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Renders as a Next.js Link when provided. */
  href?: string;
  /** Renders as a <button> when href is not provided. */
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const cornerSpring = { type: 'spring' as const, stiffness: 300, damping: 20 };

const CORNERS: Array<{ key: string; border: string; sides: Array<'top' | 'bottom' | 'left' | 'right'> }> = [
  { key: 'tl', border: 'border-l-2 border-t-2', sides: ['top', 'left'] },
  { key: 'tr', border: 'border-r-2 border-t-2', sides: ['top', 'right'] },
  { key: 'bl', border: 'border-l-2 border-b-2', sides: ['bottom', 'left'] },
  { key: 'br', border: 'border-r-2 border-b-2', sides: ['bottom', 'right'] },
];

const BASE_CLASS =
  'relative inline-flex items-center justify-center rounded-lg border border-ion bg-ion px-5 py-2.5 font-semibold text-void transition-colors hover:bg-transparent hover:text-ion';

const MotionLink = motion.create(Link);

/**
 * A button/link with a solid fill at rest. On hover it inverts to a ghost
 * outline, corner brackets and a pulse dot fade in while springing outward
 * ("tug and pull"), and the whole button eases toward the pointer (the
 * original magnetic-button behavior). Falls back to a plain styled element
 * with no motion under reduced motion.
 */
export default function BracketButton({ children, className, href, type, onClick, disabled }: BracketButtonProps) {
  const reduced = useReducedMotion();
  const offset = useMotionValue(4);
  const springOffset = useSpring(offset, cornerSpring);
  const negOffset = useTransform(springOffset, (o) => -o);
  const cornerOpacity = useMotionValue(0);
  const springOpacity = useSpring(cornerOpacity, cornerSpring);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springSoft);
  const springY = useSpring(y, springSoft);

  const combinedClass = `${BASE_CLASS} ${className ?? ''}`;

  if (reduced) {
    if (href) {
      return (
        <Link href={href} className={combinedClass}>
          {children}
        </Link>
      );
    }
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={combinedClass}>
        {children}
      </button>
    );
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  }

  function onPointerEnter() {
    offset.set(12);
    cornerOpacity.set(1);
  }

  function onPointerLeave() {
    offset.set(4);
    cornerOpacity.set(0);
    x.set(0);
    y.set(0);
  }

  const handlers = { onPointerEnter, onPointerMove, onPointerLeave };

  const content = (
    <>
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.key}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 border-ion ${corner.border}`}
          style={{
            opacity: springOpacity,
            top: corner.sides.includes('top') ? negOffset : undefined,
            bottom: corner.sides.includes('bottom') ? negOffset : undefined,
            left: corner.sides.includes('left') ? negOffset : undefined,
            right: corner.sides.includes('right') ? negOffset : undefined,
          }}
        />
      ))}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-ion"
        style={{ opacity: springOpacity }}
      />
      {children}
    </>
  );

  if (href) {
    return (
      <MotionLink href={href} className={combinedClass} style={{ x: springX, y: springY }} {...handlers}>
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
      style={{ x: springX, y: springY }}
      {...handlers}
    >
      {content}
    </motion.button>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/interactive/__tests__/BracketButton.test.tsx`
Expected: PASS (6 tests)

- [ ] **Step 5: Update the 3 call sites to drop now-redundant classes**

In `src/app/page.tsx`, line 75, change:
```tsx
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
```
to:
```tsx
            <BracketButton href="/contact">
```

In `src/app/about/page.tsx`, line 219, change:
```tsx
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
```
to:
```tsx
            <BracketButton href="/contact">
```

In `src/components/contact/ContactForm.tsx`, lines 277-281, change:
```tsx
      <BracketButton
        type="submit"
        disabled={formState.status === 'loading'}
        className="bg-ion text-void font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
```
to:
```tsx
      <BracketButton
        type="submit"
        disabled={formState.status === 'loading'}
        className="disabled:opacity-50"
      >
```

- [ ] **Step 6: Run the full suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all tests pass, no type errors

- [ ] **Step 7: Commit**

```bash
git add src/components/interactive/BracketButton.tsx src/components/interactive/__tests__/BracketButton.test.tsx src/app/page.tsx src/app/about/page.tsx src/components/contact/ContactForm.tsx
git commit -m "feat: BracketButton hover-reveal brackets + magnetic pointer-following"
```

---

### Task 2: `Stats` — compact bordered 2×2 box, bigger numbers

**Files:**
- Modify: `src/components/home/Stats.tsx`
- Modify: `src/app/about/page.tsx:125-131` (the About page's separate inline usage of `PROFILE_STATS` — it does not reuse the `Stats` component, so both spots need the same layout change)
- Modify: `src/components/animations/AnimatedCounter.tsx:36`

No new tests — the existing `src/components/home/__tests__/Stats.test.tsx` (asserts the 4 labels render) and `src/app/about/__tests__/page.test.tsx` (asserts `'years'`, `'sites shipped'`, `'uptime'` render) are unaffected by this markup/className-only change; this task is verified by confirming both still pass.

- [ ] **Step 1: Rewrite `Stats.tsx`'s layout**

Replace `src/components/home/Stats.tsx` in full:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import { PROFILE_STATS } from '@/lib/constants';

const CELL_BORDER = ['border-r border-b', 'border-b', 'border-r', ''];

/** Quick credibility strip directly under the hero — no section number, matching the hero's own unnumbered treatment. */
export default function Stats() {
  return (
    <RevealOnScroll>
      <section className="border-t border-hairline py-12">
        <div className="mx-auto grid max-w-md grid-cols-2 rounded-xl border border-hairline bg-panel p-8">
          {PROFILE_STATS.map((stat, i) => (
            <div key={stat.label} className={`border-hairline p-4 ${CELL_BORDER[i]}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
```

- [ ] **Step 2: Apply the same box layout to the About page's stats block**

In `src/app/about/page.tsx`, replace lines 125-131:

```tsx
      <RevealOnScroll>
        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-hairline py-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {PROFILE_STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </RevealOnScroll>
```

with:

```tsx
      <RevealOnScroll>
        <div className="mt-10 border-t border-hairline py-8">
          <div className="mx-auto grid max-w-md grid-cols-2 rounded-xl border border-hairline bg-panel p-8">
            {PROFILE_STATS.map((stat, i) => (
              <div key={stat.label} className={`border-hairline p-4 ${ABOUT_CELL_BORDER[i]}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
```

And add this constant near the top of `src/app/about/page.tsx`, alongside the other module-level constants (e.g. right after the `TECH_TICKER_ITEMS` array):

```tsx
const ABOUT_CELL_BORDER = ['border-r border-b', 'border-b', 'border-r', ''];
```

(Named `ABOUT_CELL_BORDER` rather than `CELL_BORDER` to avoid any confusion with the identically-shaped constant in `Stats.tsx` — they're independent, duplicated by design since the two files don't share a layout component.)

- [ ] **Step 3: Bump the stat number size**

In `src/components/animations/AnimatedCounter.tsx`, line 36, change:
```tsx
      <span ref={ref} className="font-display text-4xl font-semibold text-signal">
```
to:
```tsx
      <span ref={ref} className="font-display text-5xl font-semibold text-signal">
```

- [ ] **Step 4: Run the full suite and type-check**

Run: `npx vitest run src/components/home/__tests__/Stats.test.tsx src/app/about/__tests__/page.test.tsx`
Expected: PASS (all existing tests in both files, unchanged)

Run: `npm run test && npm run type-check`
Expected: all tests pass, no type errors

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Stats.tsx src/app/about/page.tsx src/components/animations/AnimatedCounter.tsx
git commit -m "feat: compact bordered 2x2 stats box with bigger numbers"
```

---

### Task 3: `HowIHelp` — tighter cards, "Web Development" highlighted

**Files:**
- Modify: `src/components/home/HowIHelp.tsx`
- Modify: `src/components/home/__tests__/HowIHelp.test.tsx`

**Interfaces:** None new — `HowIHelp` keeps its no-props default export.

- [ ] **Step 1: Add the failing test**

Append to `src/components/home/__tests__/HowIHelp.test.tsx` (inside the existing `describe` block, after the existing `it`):

```tsx

  it('highlights only the Web Development card', () => {
    render(<HowIHelp />);
    const webDevTitle = screen.getByText('Web Development');
    const webDevCard = webDevTitle.closest('div');
    expect(webDevCard?.className).toContain('bg-ion/10');
    expect(webDevTitle.className).toContain('text-ion');

    const consultingTitle = screen.getByText('Consulting');
    const consultingCard = consultingTitle.closest('div');
    expect(consultingCard?.className).not.toContain('bg-ion/10');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/__tests__/HowIHelp.test.tsx`
Expected: the existing test PASSES; the new test FAILS (no card currently has `bg-ion/10` or a `text-ion` title)

- [ ] **Step 3: Rewrite the component**

Replace `src/components/home/HowIHelp.tsx` in full:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import IconGlyph from '@/components/icons/IconGlyph';

const SERVICES = [
  {
    icon: 'cross' as const,
    title: 'Web Development',
    description:
      'Custom websites and web apps — headless WordPress + Next.js, or whatever stack actually fits the job.',
  },
  {
    icon: 'dots' as const,
    title: 'Hosting & Maintenance',
    description:
      'A monthly retainer covering hosting, updates, backups, and the small fixes that keep a site healthy long after launch.',
  },
  {
    icon: 'square' as const,
    title: 'Performance & SEO Audits',
    description:
      'A clear-eyed look at load times, Core Web Vitals, and search visibility, with a prioritized list of what to fix first.',
  },
  {
    icon: 'scatter' as const,
    title: 'Consulting',
    description: 'A second opinion on an architecture decision or a stuck project — hourly or project-based.',
  },
];

export default function HowIHelp() {
  return (
    <RevealOnScroll>
      <section className="border-t border-hairline py-16">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — How I Help</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => {
            const highlighted = service.title === 'Web Development';
            return (
              <div
                key={service.title}
                className={`rounded-xl border p-5 ${highlighted ? 'border-ion/40 bg-ion/10' : 'border-hairline bg-panel'}`}
              >
                <IconGlyph variant={service.icon} className="text-ion" />
                <h3 className={`mt-2 font-display text-lg font-semibold ${highlighted ? 'text-ion' : 'text-signal'}`}>
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{service.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </RevealOnScroll>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/__tests__/HowIHelp.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all tests pass, no type errors

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HowIHelp.tsx src/components/home/__tests__/HowIHelp.test.tsx
git commit -m "feat: tighter HowIHelp cards, highlight Web Development"
```

---

### Task 4: Homepage "Selected Work" cards — image slot, accent title, tag pills

**Files:**
- Modify: `src/app/page.tsx:26-35`

**Interfaces:**
- Consumes: `project.featuredImage?.node?.sourceUrl` and `project.techStacks?.nodes` — both already selected by `PROJECT_FRAGMENT_MINIMAL` (used by `GET_FEATURED_PROJECTS`) and already typed on `Project` in `src/types/wordpress.ts`. This is a rendering-only change — no query or type changes needed.

No new test file — there's no existing test file for the homepage (`src/app/page.tsx`), consistent with this codebase's existing convention of not testing page-composition files directly (only the components they render). Verified via type-check and a manual check.

- [ ] **Step 1: Update the card markup**

In `src/app/page.tsx`, replace lines 26-35:

```tsx
            {projects.map((project) => (
              <TiltCard
                key={project.slug}
                href={`/work/${project.slug}`}
                className="block rounded-xl border border-hairline bg-panel p-6 transition-colors hover:border-ion/40"
              >
                <p className="font-mono text-xs text-ion">case-study/{project.slug}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{project.title}</h3>
              </TiltCard>
            ))}
```

with:

```tsx
            {projects.map((project) => (
              <TiltCard
                key={project.slug}
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
            ))}
```

- [ ] **Step 2: Run the full suite, type-check, and lint**

Run: `npm run test && npm run type-check && npm run lint`
Expected: all pass, no errors

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/`, confirm the "Selected Work" cards now show the project screenshot images (already present at `public/images/projects/*.jpg`) at the top, an `ion`-colored title, and tech tag chips below.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: homepage Selected Work cards get images, accent titles, tag pills"
```

---

### Task 5: `DotGrid` and `GridScatter` — visibility bump

**Files:**
- Modify: `src/components/interactive/DotGrid.tsx:7`
- Modify: `src/components/about/GridScatter.tsx:1-17`

No test changes — existing tests (`DotGrid.test.tsx` checks for `aria-hidden`/`pointer-events-none`; `GridScatter.test.tsx` checks for a decorative layer with `> 5` children) assert structure, not exact opacity/size values, so both remain valid unchanged.

- [ ] **Step 1: Bump `DotGrid`'s opacity**

In `src/components/interactive/DotGrid.tsx`, line 7, change:
```tsx
  backgroundImage: 'radial-gradient(circle, rgba(240,242,248,0.06) 1px, transparent 1px)',
```
to:
```tsx
  backgroundImage: 'radial-gradient(circle, rgba(240,242,248,0.14) 1px, transparent 1px)',
```

- [ ] **Step 2: Bump `GridScatter`'s square sizes and opacities**

Replace `src/components/about/GridScatter.tsx` lines 1-17 (the `SQUARES` array) with:

```tsx
const SQUARES = [
  { top: '8%', left: '12%', size: 15, opacity: 0.65 },
  { top: '18%', left: '40%', size: 9, opacity: 0.45 },
  { top: '5%', left: '70%', size: 12, opacity: 0.55 },
  { top: '30%', left: '20%', size: 9, opacity: 0.4 },
  { top: '35%', left: '55%', size: 15, opacity: 0.6 },
  { top: '42%', left: '80%', size: 9, opacity: 0.45 },
  { top: '50%', left: '10%', size: 12, opacity: 0.5 },
  { top: '55%', left: '35%', size: 9, opacity: 0.35 },
  { top: '60%', left: '65%', size: 15, opacity: 0.55 },
  { top: '68%', left: '88%', size: 9, opacity: 0.4 },
  { top: '72%', left: '25%', size: 12, opacity: 0.45 },
  { top: '80%', left: '50%', size: 9, opacity: 0.35 },
  { top: '85%', left: '75%', size: 15, opacity: 0.5 },
  { top: '15%', left: '90%', size: 9, opacity: 0.4 },
  { top: '92%', left: '15%', size: 12, opacity: 0.45 },
];
```

(The rest of the file — the `GridScatter` function body — is unchanged.)

- [ ] **Step 3: Run the full suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all tests pass, no type errors

- [ ] **Step 4: Commit**

```bash
git add src/components/interactive/DotGrid.tsx src/components/about/GridScatter.tsx
git commit -m "feat: boost DotGrid and GridScatter visibility against dark background"
```

---

## Final verification (after all tasks)

- [ ] Run `npm run test` — full suite passes
- [ ] Run `npm run type-check` — no errors
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm run build` — succeeds
- [ ] Run `npm run dev` and manually check `/`, `/about`, and `/contact`: confirm `BracketButton`'s idle-fill/hover-ghost/magnetic-pull behavior on the CTA and submit buttons, the compact 2×2 stats box on both `/` and `/about`, the highlighted "Web Development" card, the Selected Work cards' images/tags, and that the dot-grid/scatter textures are now visibly present — compare side-by-side against the reference screenshots taken during brainstorming
- [ ] Toggle OS-level reduced-motion and confirm `BracketButton` still renders a plain styled element with no brackets/magnetic motion
