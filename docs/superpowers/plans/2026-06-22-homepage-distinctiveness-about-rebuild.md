# Homepage Distinctiveness + About Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop `Stats` and `HowIHelp` from sharing the same `AnimatedBlobs` background (giving each a distinct treatment), and rebuild the About page to match the reference mockup's richer structure using real content already gathered from the user.

**Architecture:** New small presentational components (`IconGlyph`, `TechTicker`, `GridScatter`, `CareerTimeline`) follow the existing split: server-rendered page shells compose `'use client'` leaf components that handle their own `useReducedMotion()` gating. A new shared `PROFILE_STATS` constant replaces the duplicate stats array so the homepage and About page can't drift.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`) v12, Vitest + Testing Library.

## Global Constraints

- Every new animated component must call `useReducedMotion()` from `@/hooks/useReducedMotion` and render a fully static fallback when it returns `true` — same established pattern as every component built in the prior redesign (`AnimatedBlobs`, `DotGrid`, `BracketButton`, `AnimatedCounter`).
- No new icon image assets — `IconGlyph` is inline SVG markup only.
- `GridScatter` uses a fixed, hand-authored layout (no `Math.random()`) to avoid SSR/client hydration mismatches.
- The headshot photo lives at `public/images/Headshot.jpg` (capital H — already committed; reference this exact path/case since Netlify's Linux deploy is case-sensitive).
- All career/principle/boundary content is copied verbatim from the design spec — do not paraphrase or invent additional items.

---

### Task 1: Shared `PROFILE_STATS` constant + `Stats` divider fix

**Files:**
- Modify: `src/lib/constants.ts` (add `PROFILE_STATS` near the existing `CONTENT SETTINGS` section, after `RECENT_POSTS_COUNT`)
- Modify: `src/components/home/Stats.tsx`

**Interfaces:**
- Produces: `export const PROFILE_STATS: readonly { value: number; suffix: string; label: string }[]` — consumed by `Stats.tsx` now, and by the About page in Task 6.

This task removes the repeated `AnimatedBlobs` glow from `Stats` and replaces it with vertical hairline dividers between the 4 counters. No new test file — the existing `src/components/home/__tests__/Stats.test.tsx` already asserts the 4 labels render and needs no changes; this task is verified by confirming that test still passes.

- [ ] **Step 1: Add the shared stats constant**

In `src/lib/constants.ts`, after the `RECENT_POSTS_COUNT` export (end of the `CONTENT SETTINGS` section), add:

```ts
/**
 * Profile stats shown on the homepage Stats strip and the About page.
 */
export const PROFILE_STATS = [
  { value: 6, suffix: '+', label: 'years' },
  { value: 30, suffix: '+', label: 'sites shipped' },
  { value: 99.9, suffix: '%', label: 'uptime' },
  { value: 95, suffix: '', label: 'avg lighthouse score' },
] as const;
```

- [ ] **Step 2: Update `Stats.tsx` to use the shared constant and drop the blob background**

Replace `src/components/home/Stats.tsx` in full:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import { PROFILE_STATS } from '@/lib/constants';

/** Quick credibility strip directly under the hero — no section number, matching the hero's own unnumbered treatment. */
export default function Stats() {
  return (
    <RevealOnScroll>
      <section className="border-t border-hairline py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {PROFILE_STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
```

- [ ] **Step 3: Run the existing Stats test and the full suite to confirm no regression**

Run: `npx vitest run src/components/home/__tests__/Stats.test.tsx`
Expected: PASS (unchanged test, 1 test)

Run: `npm run test`
Expected: all 38 tests pass

Run: `npm run type-check`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants.ts src/components/home/Stats.tsx
git commit -m "feat: shared PROFILE_STATS constant, replace Stats blobs with dividers"
```

---

### Task 2: `IconGlyph` component + `HowIHelp` distinct treatment

**Files:**
- Create: `src/components/icons/IconGlyph.tsx`
- Test: `src/components/icons/__tests__/IconGlyph.test.tsx`
- Modify: `src/components/home/HowIHelp.tsx`

**Interfaces:**
- Produces: `export default function IconGlyph(props: { variant: 'cross' | 'dots' | 'square' | 'scatter'; className?: string }): JSX.Element` — consumed by `HowIHelp.tsx` now, and by the About page's "How I Think About Work" cards in Task 7.

`IconGlyph` is a pure presentational component (no hooks, no animation, no `'use client'` needed) — four small inline-SVG shapes rendered in `currentColor`, so callers control color via a `text-*` className.

- [ ] **Step 1: Write the failing test**

Create `src/components/icons/__tests__/IconGlyph.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import IconGlyph from '../IconGlyph';

describe('IconGlyph', () => {
  it.each(['cross', 'dots', 'square', 'scatter'] as const)(
    'renders the %s variant as an svg',
    (variant) => {
      const { container } = render(<IconGlyph variant={variant} />);
      expect(container.querySelector('svg')).not.toBeNull();
    }
  );

  it('applies the className prop to the svg element', () => {
    const { container } = render(<IconGlyph variant="cross" className="text-ion" />);
    expect(container.querySelector('svg')).toHaveClass('text-ion');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/icons/__tests__/IconGlyph.test.tsx`
Expected: FAIL — `Cannot find module '../IconGlyph'`

- [ ] **Step 3: Write the component**

Create `src/components/icons/IconGlyph.tsx`:

```tsx
interface IconGlyphProps {
  variant: 'cross' | 'dots' | 'square' | 'scatter';
  className?: string;
}

const GLYPHS: Record<IconGlyphProps['variant'], React.ReactNode> = {
  cross: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  dots: (
    <>
      <circle cx="7" cy="7" r="1.6" fill="currentColor" />
      <circle cx="17" cy="7" r="1.6" fill="currentColor" />
      <circle cx="7" cy="17" r="1.6" fill="currentColor" />
      <circle cx="17" cy="17" r="1.6" fill="currentColor" />
    </>
  ),
  square: <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" />,
  scatter: (
    <>
      <circle cx="6" cy="6" r="1.4" fill="currentColor" />
      <circle cx="15" cy="8" r="1.4" fill="currentColor" />
      <circle cx="18" cy="17" r="1.4" fill="currentColor" />
      <circle cx="8" cy="17" r="1.4" fill="currentColor" />
      <circle cx="16" cy="4" r="1.4" fill="currentColor" />
    </>
  ),
};

/** A small inline-SVG glyph used on service/principle cards. Renders in `currentColor` — set color via className (e.g. `text-ion`). */
export default function IconGlyph({ variant, className }: IconGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className={className}>
      {GLYPHS[variant]}
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/icons/__tests__/IconGlyph.test.tsx`
Expected: PASS (5 tests — 4 variants + className check)

- [ ] **Step 5: Wire it into `HowIHelp`, dropping the blob background**

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
          {SERVICES.map((service) => (
            <div key={service.title} className="rounded-xl border border-hairline bg-panel p-6">
              <IconGlyph variant={service.icon} className="text-ion" />
              <h3 className="mt-2 font-display text-lg font-semibold text-signal">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
```

- [ ] **Step 6: Run the existing HowIHelp test and the full suite**

Run: `npx vitest run src/components/home/__tests__/HowIHelp.test.tsx`
Expected: PASS (unchanged test, still asserts header + 4 titles)

Run: `npm run test && npm run type-check`
Expected: all 43 tests pass (38 baseline + 5 new `IconGlyph` tests), no type errors

- [ ] **Step 7: Commit**

```bash
git add src/components/icons/IconGlyph.tsx src/components/icons/__tests__/IconGlyph.test.tsx src/components/home/HowIHelp.tsx
git commit -m "feat: IconGlyph component, replace HowIHelp blobs with icon glyphs"
```

---

### Task 3: `TechTicker` component

**Files:**
- Create: `src/components/about/TechTicker.tsx`
- Test: `src/components/about/__tests__/TechTicker.test.tsx`

**Interfaces:**
- Produces: `export default function TechTicker(props: { items: string[] }): JSX.Element` — consumed by the About page in Task 7.

`'use client'` — animates an infinite horizontal scroll by duplicating `items` and animating `x` to `-50%` (exactly one set's width, since the content is doubled), which loops seamlessly. Reduced motion renders the list once, wrapped, with no scrolling.

- [ ] **Step 1: Write the failing test**

Create `src/components/about/__tests__/TechTicker.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TechTicker from '../TechTicker';

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

describe('TechTicker', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders each item once under reduced motion', () => {
    mockMatchMedia(true);
    render(<TechTicker items={['Next.js', 'React']} />);
    expect(screen.getAllByText('Next.js')).toHaveLength(1);
    expect(screen.getAllByText('React')).toHaveLength(1);
  });

  it('renders each item twice (duplicated for the seamless loop) when motion is enabled', () => {
    mockMatchMedia(false);
    render(<TechTicker items={['Next.js', 'React']} />);
    expect(screen.getAllByText('Next.js')).toHaveLength(2);
    expect(screen.getAllByText('React')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/about/__tests__/TechTicker.test.tsx`
Expected: FAIL — `Cannot find module '../TechTicker'`

- [ ] **Step 3: Write the component**

Create `src/components/about/TechTicker.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TechTickerProps {
  items: string[];
}

/** Infinite horizontal scroll of tag chips. Renders a static wrapped list under reduced motion. */
export default function TechTicker({ items }: TechTickerProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-3 font-mono text-xs text-faint">
        {items.map((item) => (
          <span key={item} className="rounded border border-hairline px-3 py-1">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3 font-mono text-xs text-faint"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="shrink-0 rounded border border-hairline px-3 py-1">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/about/__tests__/TechTicker.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/about/TechTicker.tsx src/components/about/__tests__/TechTicker.test.tsx
git commit -m "feat: TechTicker infinite-scroll tag component"
```

---

### Task 4: `GridScatter` decorative component

**Files:**
- Create: `src/components/about/GridScatter.tsx`
- Test: `src/components/about/__tests__/GridScatter.test.tsx`

**Interfaces:**
- Produces: `export default function GridScatter(): JSX.Element` — no props, consumed by the About page's "My Story" section in Task 6.

Pure static decorative graphic — no `'use client'`, no animation, no hooks. A fixed, hand-authored scatter of 15 small squares at varying size/opacity, absolutely positioned within an `aria-hidden`, `pointer-events-none` layer.

- [ ] **Step 1: Write the failing test**

Create `src/components/about/__tests__/GridScatter.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import GridScatter from '../GridScatter';

describe('GridScatter', () => {
  it('renders a hidden, non-interactive decorative layer with multiple squares', () => {
    const { container } = render(<GridScatter />);
    const layer = container.querySelector('[aria-hidden="true"]');
    expect(layer).not.toBeNull();
    expect(layer).toHaveClass('pointer-events-none');
    expect(layer?.children.length).toBeGreaterThan(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/about/__tests__/GridScatter.test.tsx`
Expected: FAIL — `Cannot find module '../GridScatter'`

- [ ] **Step 3: Write the component**

Create `src/components/about/GridScatter.tsx`:

```tsx
const SQUARES = [
  { top: '8%', left: '12%', size: 10, opacity: 0.5 },
  { top: '18%', left: '40%', size: 6, opacity: 0.3 },
  { top: '5%', left: '70%', size: 8, opacity: 0.4 },
  { top: '30%', left: '20%', size: 6, opacity: 0.25 },
  { top: '35%', left: '55%', size: 10, opacity: 0.45 },
  { top: '42%', left: '80%', size: 6, opacity: 0.3 },
  { top: '50%', left: '10%', size: 8, opacity: 0.35 },
  { top: '55%', left: '35%', size: 6, opacity: 0.2 },
  { top: '60%', left: '65%', size: 10, opacity: 0.4 },
  { top: '68%', left: '88%', size: 6, opacity: 0.25 },
  { top: '72%', left: '25%', size: 8, opacity: 0.3 },
  { top: '80%', left: '50%', size: 6, opacity: 0.2 },
  { top: '85%', left: '75%', size: 10, opacity: 0.35 },
  { top: '15%', left: '90%', size: 6, opacity: 0.25 },
  { top: '92%', left: '15%', size: 8, opacity: 0.3 },
];

/** Static decorative scatter of squares used behind the About page's "My Story" section. Fixed layout (no randomness) to avoid hydration mismatches. */
export default function GridScatter() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SQUARES.map((square, i) => (
        <span
          key={i}
          className="absolute rounded-sm bg-ion"
          style={{
            top: square.top,
            left: square.left,
            width: square.size,
            height: square.size,
            opacity: square.opacity,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/about/__tests__/GridScatter.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/components/about/GridScatter.tsx src/components/about/__tests__/GridScatter.test.tsx
git commit -m "feat: GridScatter decorative component"
```

---

### Task 5: `CareerTimeline` component

**Files:**
- Create: `src/components/about/CareerTimeline.tsx`
- Test: `src/components/about/__tests__/CareerTimeline.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  export interface CareerEntry {
    role: string;
    company: string;
    location: string;
    dates: string;
    tag: string;
    highlights: string[];
  }
  export default function CareerTimeline(props: { entries: CareerEntry[] }): JSX.Element;
  ```
  — consumed by the About page's "Career Commits" section in Task 8, which supplies the 3 real entries from the spec.

`'use client'` — a vertical connecting line's height is driven by scroll progress through the timeline (`useScroll`/`useTransform`, same pattern as `AnimatedBlobs`'s parallax). Reduced motion renders the line at `height: 100%` immediately, no scroll-tied animation.

- [ ] **Step 1: Write the failing test**

Create `src/components/about/__tests__/CareerTimeline.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CareerTimeline, { type CareerEntry } from '../CareerTimeline';

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

const ENTRIES: CareerEntry[] = [
  {
    role: 'Full-Stack Developer',
    company: 'Neon Goldfish',
    location: 'Toledo, OH',
    dates: 'May 2025–Present',
    tag: 'WordPress',
    highlights: ['Engineered 3-4 custom child themes.'],
  },
];

describe('CareerTimeline', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("renders each entry's role, company, and highlights", () => {
    mockMatchMedia(false);
    render(<CareerTimeline entries={ENTRIES} />);
    expect(screen.getByText('Full-Stack Developer · Neon Goldfish')).toBeInTheDocument();
    expect(screen.getByText('Engineered 3-4 custom child themes.')).toBeInTheDocument();
  });

  it('renders the connecting line at full height under reduced motion', () => {
    mockMatchMedia(true);
    const { container } = render(<CareerTimeline entries={ENTRIES} />);
    const line = container.querySelector('.bg-ion.absolute');
    expect(line).toHaveStyle({ height: '100%' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/about/__tests__/CareerTimeline.test.tsx`
Expected: FAIL — `Cannot find module '../CareerTimeline'`

- [ ] **Step 3: Write the component**

Create `src/components/about/CareerTimeline.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface CareerEntry {
  role: string;
  company: string;
  location: string;
  dates: string;
  tag: string;
  highlights: string[];
}

interface CareerTimelineProps {
  entries: CareerEntry[];
}

/** Git-commit-styled work history. The connecting line's height tracks scroll progress through the timeline; renders fully drawn under reduced motion. */
export default function CareerTimeline({ entries }: CareerTimelineProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative pl-8">
      {reduced ? (
        <div className="absolute left-0 top-0 w-px bg-ion" style={{ height: '100%' }} />
      ) : (
        <motion.div className="absolute left-0 top-0 w-px bg-ion" style={{ height: lineHeight }} />
      )}
      <div className="space-y-10">
        {entries.map((entry) => (
          <RevealOnScroll key={`${entry.company}-${entry.role}`}>
            <article className="relative">
              <span className="absolute -left-8 top-1.5 h-2 w-2 rounded-full bg-ion" />
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-display text-lg font-semibold text-signal">
                  {entry.role} · {entry.company}
                </h3>
                <span className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] text-ion">
                  {entry.tag}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-faint">
                {entry.location} · {entry.dates}
              </p>
              <div className="mt-3 rounded-lg bg-void p-4 font-mono text-xs">
                {entry.highlights.map((highlight) => (
                  <p key={highlight} className="text-muted">
                    <span className="text-ion">+ </span>
                    {highlight}
                  </p>
                ))}
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/about/__tests__/CareerTimeline.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all tests pass (43 from Tasks 1-2 + 2 TechTicker + 1 GridScatter + 2 CareerTimeline = 48 total), no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/about/CareerTimeline.tsx src/components/about/__tests__/CareerTimeline.test.tsx
git commit -m "feat: CareerTimeline component with scroll-linked connecting line"
```

---

### Task 6: About page rebuild, part 1 — header, photo, badge, stats, My Story

**Files:**
- Modify: `src/app/about/page.tsx` (full rewrite)
- Test: `src/app/about/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `PROFILE_STATS` (Task 1), `GridScatter` (Task 4), `AnimatedCounter` (existing), `RevealOnScroll` (existing).
- `AboutPage` remains a plain synchronous server component (no data fetching, no props) — testable with a direct RTL `render(<AboutPage />)`, same as any component.

This task replaces the current plain-prose About page with: a header (mono label, h1, intro line, availability badge, headshot photo), a stats callout reusing the shared `PROFILE_STATS`, and the existing 3 paragraphs of prose (verbatim, unchanged) under a new "My Story" heading with the `GridScatter` decorative graphic. Tasks 7 appends the remaining sections (tech ticker, principles, boundaries, career timeline, CTA) to this same file.

- [ ] **Step 1: Write the failing test**

Create `src/app/about/__tests__/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

describe('AboutPage', () => {
  it('renders the header, availability badge, and photo', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(screen.getByText('Open to new projects')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ray Turk' })).toHaveAttribute('src', '/images/Headshot.jpg');
  });

  it('renders the stats callout with the shared profile stats', () => {
    render(<AboutPage />);
    expect(screen.getByText('years')).toBeInTheDocument();
    expect(screen.getByText('sites shipped')).toBeInTheDocument();
    expect(screen.getByText('uptime')).toBeInTheDocument();
  });

  it('renders the My Story section with the existing prose, unchanged', () => {
    render(<AboutPage />);
    expect(screen.getByText('02 — My Story')).toBeInTheDocument();
    expect(
      screen.getByText(/I'm Ray Turk, a full-stack web developer based in Cleveland, Ohio\./)
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/about/__tests__/page.test.tsx`
Expected: FAIL — current `AboutPage` has no "Open to new projects" text, no `img`, no "02 — My Story" heading

- [ ] **Step 3: Rewrite the page (part 1 of 2 — Task 7 appends the rest)**

Replace `src/app/about/page.tsx` in full:

```tsx
import type { Metadata } from 'next';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import GridScatter from '@/components/about/GridScatter';
import { PROFILE_STATS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ray Turk — full-stack web developer in Cleveland, Ohio. Headless WordPress, Next.js, and the occasional shader.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <RevealOnScroll>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-mono text-xs text-ion">// index.about</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">About</h1>
            <p className="mt-4 text-lg text-muted">
              Full-stack developer in Cleveland, Ohio, building WordPress-powered sites that are
              fast, maintainable, and actually easy for clients to run.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 px-3 py-1 font-mono text-xs text-[#4ade80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
              Open to new projects
            </p>
          </div>
          <img
            src="/images/Headshot.jpg"
            alt="Ray Turk"
            width={160}
            height={160}
            className="rounded-xl border border-hairline object-cover"
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-hairline py-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {PROFILE_STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="relative overflow-hidden border-t border-hairline py-16">
          <GridScatter />
          <h2 className="relative font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — My Story</h2>
          <div className="prose prose-invert relative mt-6">
            <p>
              I&apos;m Ray Turk, a full-stack web developer based in Cleveland, Ohio. I build
              for the web at <a href="https://neongoldfish.com">Neon Goldfish</a>, a Cleveland
              marketing agency, where most of my days are spent in WordPress — custom themes,
              ACF-driven page builders, and the occasional rescue of a site that has seen
              better days.
            </p>
            <p>
              Outside the agency I run <a href="https://codetheland.com">Code The Land</a>, my
              freelance brand, and I keep this site as a place to push past client constraints:
              headless architectures, real-time interfaces, motion, and whatever the platform
              shipped this month. If client work is about reliability, this is where I get to
              be curious.
            </p>
            <h3>What I work with</h3>
            <p>
              Next.js · React · TypeScript · WordPress · WPGraphQL · PHP · Laravel · Tailwind ·
              MySQL. I care about performance budgets, accessible motion, and code that the next
              developer can actually read.
            </p>
            <h3>Beyond the editor</h3>
            <p>
              I&apos;m happiest when a gnarly integration finally clicks — a headless build that
              loads instantly, a CMS that non-technical editors genuinely enjoy, a deploy
              pipeline that just works. If you want to talk shop or have something to build,
              the <a href="/contact">contact page</a> is the fastest way to reach me.
            </p>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/about/__tests__/page.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Run the full suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all 51 tests pass (48 from Tasks 1-5 + 3 new), no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/about/page.tsx src/app/about/__tests__/page.test.tsx
git commit -m "feat: About page header, photo, badge, stats, and My Story section"
```

---

### Task 7: About page rebuild, part 2 — tech ticker, principles, boundaries, career commits, CTA

**Files:**
- Modify: `src/app/about/page.tsx` (append remaining sections)
- Modify: `src/app/about/__tests__/page.test.tsx` (append tests for the new sections)

**Interfaces:**
- Consumes: `TechTicker` (Task 3), `IconGlyph` (Task 2), `CareerTimeline` + `CareerEntry` (Task 5), `BracketButton` (existing).

This task completes the About page by appending the tech-stack ticker, "How I Think About Work" (4 principle cards using `IconGlyph`, same card pattern as `HowIHelp`), "What I Don't Do" (plain bulleted list), "Career Commits" (wires `CareerTimeline` with the 3 real entries from the spec), and a Contact CTA matching the homepage's pattern.

- [ ] **Step 1: Add tests for the new sections**

Append to `src/app/about/__tests__/page.test.tsx` (inside the existing `describe` block, after the last `it`):

```tsx

  it('renders the tech ticker, principles, and boundaries list', () => {
    render(<AboutPage />);
    expect(screen.getByText('WordPress')).toBeInTheDocument();
    expect(screen.getByText('03 — How I Think About Work')).toBeInTheDocument();
    expect(screen.getByText('Maintainability over cleverness')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: "What I Don't Do" })).toBeInTheDocument();
    expect(
      screen.getByText(/Free, unpaid scope creep/)
    ).toBeInTheDocument();
  });

  it('renders the Career Commits timeline and the contact CTA', () => {
    render(<AboutPage />);
    expect(screen.getByText('04 — Career Commits')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer · Neon Goldfish')).toBeInTheDocument();
    expect(screen.getByText('Have a project or a role in mind? Send a note.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/about/__tests__/page.test.tsx`
Expected: FAIL — 2 new tests fail (none of this content exists in the page yet)

- [ ] **Step 3: Append the remaining sections to the page**

In `src/app/about/page.tsx`, add the new imports at the top (alongside the existing ones from Task 6):

```tsx
import IconGlyph from '@/components/icons/IconGlyph';
import TechTicker from '@/components/about/TechTicker';
import CareerTimeline from '@/components/about/CareerTimeline';
import BracketButton from '@/components/interactive/BracketButton';
```

Add these constants above the `AboutPage` function (after the `metadata` export):

```tsx
const TECH_TICKER_ITEMS = [
  'Next.js', 'React', 'TypeScript', 'WordPress', 'WPGraphQL', 'PHP', 'Laravel', 'Tailwind',
  'MySQL', 'Git', 'Docker', 'AWS', 'Node.js', 'Accessibility', 'Performance', 'E-commerce',
];

const PRINCIPLES = [
  {
    icon: 'cross' as const,
    title: 'Maintainability over cleverness',
    description:
      'Code the next developer (including future-me) can actually read and extend, not just code that works today.',
  },
  {
    icon: 'dots' as const,
    title: 'Client empowerment over gatekeeping',
    description:
      'Give non-technical clients real control over their own content (custom shortcodes, flexible layouts) instead of making every change depend on me.',
  },
  {
    icon: 'square' as const,
    title: 'Performance and reliability are features, not afterthoughts',
    description: 'Load times, uptime, and Core Web Vitals are deliverables I measure, not nice-to-haves.',
  },
  {
    icon: 'scatter' as const,
    title: 'Diagnose before you patch',
    description: 'Dig into the actual root cause methodically rather than shotgunning fixes and hoping.',
  },
];

const BOUNDARIES = [
  'Open-ended "make it pop" requests with no clear brief or decision-maker.',
  "Quick patches on a codebase nobody's willing to actually let me fix.",
  'Free, unpaid scope creep — ongoing support belongs in a retainer, not a favor.',
  'Vendor or platform lock-in that leaves a client without real ownership of their own site.',
  'Work where "ship it fast" matters more than "won\'t break in six months."',
];

const CAREER_ENTRIES = [
  {
    role: 'Full-Stack Developer',
    company: 'Neon Goldfish',
    location: 'Toledo, OH',
    dates: 'May 2025–Present',
    tag: 'WordPress',
    highlights: [
      "Engineered 3–4 custom child themes that extended the agency's parent theme, implementing site-specific overrides and ACF flexible content layouts to empower clients with backend control over page composition.",
      'Refactored core logic and overhauled core databases while maintaining existing client workflows, modernizing codebases.',
      'Developed custom plugins for WooCommerce, SUMO Subscriptions, and GravityForms, including a bulk user import tool using Action Scheduler and a progressive pricing calculator for a service-industry manufacturer.',
      'Managed server infrastructure across Linode, WP Engine, and DigitalOcean, optimizing PHP-FPM settings, troubleshooting DOM issues, and configuring Redis/Varnish object caching to enhance performance.',
      'Integrated and debugged third-party payment and marketing APIs such as Stripe, PayPal, and Square, ensuring seamless transaction processes for clients.',
    ],
  },
  {
    role: 'WordPress Developer',
    company: 'Full Spectrum Marketing',
    location: 'Akron, OH',
    dates: 'April 2024–March 2025',
    tag: 'WordPress',
    highlights: [
      'Engineered WordPress performance optimizations that achieved a 60% reduction in page load times and consistently maintained Google PageSpeed scores of 90%+ across client sites.',
      'Designed custom shortcodes that enabled non-technical clients to create complex, dynamic content layouts without coding knowledge.',
      'Developed bespoke WordPress plugins tailored to client specifications, enhancing core CMS functionality and delivering essential features for business needs.',
    ],
  },
  {
    role: 'Web Developer',
    company: 'Company 119',
    location: 'Chardon, OH',
    dates: 'March 2021–February 2024',
    tag: 'WordPress',
    highlights: [
      'Led all WordPress maintenance operations, managing a diverse portfolio of client websites while ensuring 99.9% uptime and rapid issue resolution.',
      'Engineered a comprehensive ticketing system with custom automations that improved workflow efficiency, reducing average response time from 24 hours to under 4 hours.',
      'Developed custom WordPress themes from concept to deployment, delivering unique, responsive designs that aligned with client brand guidelines.',
      'Optimized website performance through caching implementation, database optimization, and image compression, resulting in significant enhancements to page load speeds and user experience.',
    ],
  },
];
```

Then, inside `AboutPage`'s returned JSX, immediately before the closing `</div>` (after the "My Story" `RevealOnScroll` block from Task 6), add:

```tsx
      <RevealOnScroll>
        <section className="border-t border-hairline py-10">
          <TechTicker items={TECH_TICKER_ITEMS} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">03 — How I Think About Work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="rounded-xl border border-hairline bg-panel p-6">
                <IconGlyph variant={principle.icon} className="text-ion" />
                <h3 className="mt-2 font-display text-lg font-semibold text-signal">{principle.title}</h3>
                <p className="mt-2 text-sm text-muted">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-display text-2xl font-semibold">What I Don&apos;t Do</h2>
          <p className="mt-2 text-muted">I like to be upfront about this. It saves both of us time.</p>
          <ul className="mt-6 space-y-3">
            {BOUNDARIES.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <span className="text-ion">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">04 — Career Commits</h2>
          <p className="mt-2 text-muted">A version-controlled history of growth and impact.</p>
          <div className="mt-8">
            <CareerTimeline entries={CAREER_ENTRIES} />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-muted">Have a project or a role in mind? Send a note.</p>
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </BracketButton>
          </div>
        </section>
      </RevealOnScroll>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/about/__tests__/page.test.tsx`
Expected: PASS (5 tests total)

- [ ] **Step 5: Run the full suite, type-check, and lint**

Run: `npm run test && npm run type-check && npm run lint`
Expected: all 53 tests pass (51 from Task 6 + 2 new), no type errors, no lint errors

- [ ] **Step 6: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/about`, confirm the page renders top to bottom without console errors, the headshot photo loads, and the tech ticker scrolls. Toggle OS-level reduced-motion and confirm the ticker stops scrolling and the Career Commits line renders fully drawn.

- [ ] **Step 7: Commit**

```bash
git add src/app/about/page.tsx src/app/about/__tests__/page.test.tsx
git commit -m "feat: About page tech ticker, principles, boundaries, career commits, CTA"
```

---

## Final verification (after all tasks)

- [ ] Run `npm run test` — full suite passes (53 tests)
- [ ] Run `npm run type-check` — no errors
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm run build` — succeeds
- [ ] Run `npm run dev` and manually check `/` (confirm Stats and HowIHelp no longer share the same blob background) and `/about` (confirm the full new page renders), toggling OS-level reduced-motion for both
