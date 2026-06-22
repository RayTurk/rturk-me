# Visual Redesign: Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap the site's accent color to `#ff4200`, add the elastic "tug and pull" corner-bracket button effect, animate backgrounds and stat counters, and add a "How I Help" services section and a rebuilt big-wordmark footer — all on top of the existing dark theme.

**Architecture:** New decorative/interactive pieces follow the codebase's existing split: a server-rendered shell (`Hero`, `Stats`, `HowIHelp`, `Footer`) composes small `'use client'` leaf components (`AnimatedBlobs`, `DotGrid`, `BracketButton`, `AnimatedCounter`) that each call `useReducedMotion()` directly and fall back to a static, non-animated render. No new state management or data flow — this is presentation-layer only.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (`@theme` tokens in `globals.css`), Motion (`motion/react`) v12, Vitest + Testing Library for tests.

## Global Constraints

- Keep the existing dark theme (`void`/`panel`/`signal`/`hairline`/`muted`/`faint` tokens) — no light-mode switch.
- `--color-ion` changes from `#22d3ee` to `#ff4200`. `--color-drift` (`#a78bfa`) stays unchanged.
- Contrast of `#ff4200` against `#0a0b0f` (`void`) is 5.66:1 — passes WCAG AA (4.5:1) for normal text in both directions. Do not introduce any new color combination without checking contrast similarly.
- Every new animated component must call `useReducedMotion()` from `@/hooks/useReducedMotion` and render a fully static fallback when it returns `true` — this is the established pattern in every existing interactive component (`MagneticButton`, `TiltCard`, `ParticleField`, `RevealOnScroll`, `Pipeline`) and must not be skipped.
- No testimonials section, no "Problem" pain-point section, no fixed bottom status-bar gimmick, no new icon image assets, no changes to `work/[slug]` beyond what's explicitly listed below.
- Section header numbering on the homepage is renumbered sequentially for the final order (Hero → Stats[unnumbered] → `01` Selected Work → `02` How I Help → `03` Under the Hood → `04` Writing → Contact CTA[unnumbered]).

---

### Task 1: Brand color swap + `ParticleField` recolor

**Files:**
- Modify: `src/app/globals.css:9`
- Modify: `src/components/interactive/ParticleField.tsx:76,88`
- Modify: `src/app/opengraph-image.tsx:21,35`
- Modify: `src/app/work/[slug]/opengraph-image.tsx:26,33`
- Modify: `src/app/writing/[slug]/opengraph-image.tsx:26,33`

**Interfaces:** None — value-only changes, no new exports or signatures.

This task has no new testable logic (a CSS custom property value and two color literals), so it's verified by running the existing suite and a `grep` check rather than a new test.

- [ ] **Step 1: Change the CSS variable**

In `src/app/globals.css`, change line 9:

```css
  --color-ion: #ff4200;
```

(was `--color-ion: #22d3ee;`)

- [ ] **Step 2: Recolor the canvas particle field**

In `src/components/interactive/ParticleField.tsx`, line 76:

```ts
        context.fillStyle = 'rgba(255, 66, 0, 0.7)';
```

(was `'rgba(34, 211, 238, 0.7)'`)

And line 88:

```ts
            context.strokeStyle = `rgba(255, 66, 0, ${alpha})`;
```

(was `` `rgba(34, 211, 238, ${alpha})` ``)

- [ ] **Step 2b: Recolor the three Open Graph image generators**

These use `next/og`'s `ImageResponse` (Satori), which renders inline styles and cannot reference CSS custom properties — each hardcodes the old cyan as a plain hex literal `#22d3ee`, independently of `globals.css`.

In `src/app/opengraph-image.tsx`, line 21, change `color: '#22d3ee'` to `color: '#ff4200'`; line 35, change `background: '#22d3ee'` to `background: '#ff4200'`.

In `src/app/work/[slug]/opengraph-image.tsx`, line 26, change `color: '#22d3ee'` to `color: '#ff4200'`; line 33, change `background: '#22d3ee'` to `background: '#ff4200'`.

In `src/app/writing/[slug]/opengraph-image.tsx`, line 26, change `color: '#22d3ee'` to `color: '#ff4200'`; line 33, change `background: '#22d3ee'` to `background: '#ff4200'`.

- [ ] **Step 3: Verify no old color literal remains and the suite still passes**

Run: `grep -rn "22d3ee\|34, 211, 238" src`
Expected: no output (no matches)

Run: `npm run test`
Expected: all existing tests still pass (this task changes no logic, only colors)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/interactive/ParticleField.tsx
git commit -m "feat: swap brand accent to #ff4200"
```

---

### Task 2: `AnimatedBlobs` component + `Hero` integration

**Files:**
- Create: `src/components/interactive/AnimatedBlobs.tsx`
- Test: `src/components/interactive/__tests__/AnimatedBlobs.test.tsx`
- Modify: `src/components/interactive/Hero.tsx`

**Interfaces:**
- Produces: `export default function AnimatedBlobs({ compact?: boolean }): JSX.Element` — a decorative `aria-hidden` absolutely-positioned layer meant to be the only child of a `relative overflow-hidden` ancestor. No other component reads its output; it's purely visual.

This replaces `Hero`'s two static inline gradient divs with a reusable, animated, scroll-parallaxing version, and recolors them from the old cyan to the new `#ff4200` accent (`rgba(255, 66, 0, ...)`) at the same time — these blobs hardcode their color as inline `style`, so they aren't covered by Task 1's CSS-variable swap.

- [ ] **Step 1: Write the failing test**

Create `src/components/interactive/__tests__/AnimatedBlobs.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import AnimatedBlobs from '../AnimatedBlobs';

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

describe('AnimatedBlobs', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders two decorative blob layers when motion is enabled', () => {
    mockMatchMedia(false);
    const { container } = render(<AnimatedBlobs />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('renders static blobs under reduced motion', () => {
    mockMatchMedia(true);
    const { container } = render(<AnimatedBlobs />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/interactive/__tests__/AnimatedBlobs.test.tsx`
Expected: FAIL — `Cannot find module '../AnimatedBlobs'`

- [ ] **Step 3: Write the component**

Create `src/components/interactive/AnimatedBlobs.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedBlobsProps {
  /** Smaller, dimmer pair for reuse as a background accent below the hero. */
  compact?: boolean;
}

/**
 * Two drifting, scroll-parallaxing gradient blobs used as a decorative
 * background layer. Must be the child of a `relative overflow-hidden`
 * container. Renders static, non-parallaxing blobs under reduced motion.
 */
export default function AnimatedBlobs({ compact = false }: AnimatedBlobsProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxA = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const parallaxB = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const sizeA = compact ? 'h-48 w-48' : 'h-72 w-72';
  const sizeB = compact ? 'h-40 w-40' : 'h-64 w-64';
  const opacityA = compact ? 'opacity-30' : 'opacity-60';
  const opacityB = compact ? 'opacity-20' : 'opacity-40';

  if (reduced) {
    return (
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-20 right-0 rounded-full ${sizeA} ${opacityA}`}
          style={{ background: 'radial-gradient(circle, rgba(255,66,0,0.15), transparent 65%)' }}
        />
        <div
          className={`absolute bottom-0 left-1/3 rounded-full ${sizeB} ${opacityB}`}
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)' }}
        />
      </div>
    );
  }

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute -top-20 right-0 rounded-full ${sizeA} ${opacityA}`}
        style={{ background: 'radial-gradient(circle, rgba(255,66,0,0.15), transparent 65%)', y: parallaxA }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-0 left-1/3 rounded-full ${sizeB} ${opacityB}`}
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)', y: parallaxB }}
        animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/interactive/__tests__/AnimatedBlobs.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Wire it into `Hero`**

In `src/components/interactive/Hero.tsx`, replace the two static blob `<div>`s (current lines 14–23) and add the import. Full updated file:

```tsx
import ParticleField from './ParticleField';
import AnimatedBlobs from './AnimatedBlobs';

/**
 * Homepage hero. Static gradient + text render server-side (SSG); the canvas
 * and blobs hydrate and animate client-side only. Status line uses build-time
 * metadata from Netlify's COMMIT_REF (falls back to "dev").
 */
export default function Hero() {
  const commit = (process.env.COMMIT_REF || 'dev').slice(0, 7);
  const context = process.env.CONTEXT || 'local';

  return (
    <section className="relative overflow-hidden py-24">
      <AnimatedBlobs />
      <ParticleField />

      <div className="relative">
        <p className="font-mono text-sm text-ion">~/cleveland-oh · full-stack developer</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          Ray Turk builds fast, headless, animated web.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          WordPress as the engine, Next.js as the face — with the engineering on display.
        </p>
        <p className="mt-6 font-mono text-xs text-faint">
          <span className="text-[#4ade80]">●</span> main@{commit} · next 16 · deploy: {context}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/components/interactive/AnimatedBlobs.tsx src/components/interactive/__tests__/AnimatedBlobs.test.tsx src/components/interactive/Hero.tsx
git commit -m "feat: animated, parallaxing hero background blobs"
```

---

### Task 3: `DotGrid` sitewide background

**Files:**
- Create: `src/components/interactive/DotGrid.tsx`
- Test: `src/components/interactive/__tests__/DotGrid.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `export default function DotGrid(): JSX.Element` — a fixed, full-viewport, `aria-hidden`, `pointer-events-none` background layer. No props.

- [ ] **Step 1: Write the failing test**

Create `src/components/interactive/__tests__/DotGrid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DotGrid from '../DotGrid';

describe('DotGrid', () => {
  it('renders a hidden, non-interactive background layer', () => {
    const { container } = render(<DotGrid />);
    const layer = container.querySelector('[aria-hidden="true"]');
    expect(layer).not.toBeNull();
    expect(layer).toHaveClass('pointer-events-none');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/interactive/__tests__/DotGrid.test.tsx`
Expected: FAIL — `Cannot find module '../DotGrid'`

- [ ] **Step 3: Write the component**

Create `src/components/interactive/DotGrid.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DOT_GRID_STYLE = {
  backgroundImage: 'radial-gradient(circle, rgba(240,242,248,0.06) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

/**
 * Sitewide faint dot-grid texture, fixed behind all page content. Drifts
 * very slowly under normal motion; renders as a static pattern under
 * reduced motion.
 */
export default function DotGrid() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={DOT_GRID_STYLE} />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={DOT_GRID_STYLE}
      animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/interactive/__tests__/DotGrid.test.tsx`
Expected: PASS

- [ ] **Step 5: Mount it in the root layout**

In `src/app/layout.tsx`, add the import and mount `<DotGrid />` as the first child of `<body>`:

```tsx
import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommandPaletteLoader from '@/components/interactive/CommandPaletteLoader';
import DotGrid from '@/components/interactive/DotGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/schema';
import ConsentBanner from '@/components/consent/ConsentBanner';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
const clash = localFont({
  src: [
    { path: '../../public/fonts/clash-display-600.woff2', weight: '600' },
    { path: '../../public/fonts/clash-display-700.woff2', weight: '700' },
  ],
  variable: '--font-clash',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rturk.me'),
  title: { default: 'Ray Turk — Full-Stack Developer', template: '%s · Ray Turk' },
  description:
    'Cleveland-based full-stack developer building fast, headless, animated web experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable} ${clash.variable}`}>
      <body className="font-sans antialiased">
        <DotGrid />
        <JsonLd data={[generatePersonSchema(), generateWebSiteSchema()]} />
        <CommandPaletteLoader />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/components/interactive/DotGrid.tsx src/components/interactive/__tests__/DotGrid.test.tsx src/app/layout.tsx
git commit -m "feat: sitewide animated dot-grid background"
```

---

### Task 4: `BracketButton` ("tug and pull" effect) + swap onto primary CTAs

**Files:**
- Create: `src/components/interactive/BracketButton.tsx`
- Test: `src/components/interactive/__tests__/BracketButton.test.tsx`
- Modify: `src/app/page.tsx` (Contact CTA button)
- Modify: `src/components/contact/ContactForm.tsx` (submit button)
- Delete: `src/components/interactive/MagneticButton.tsx` (becomes unused once both call sites above are migrated — confirmed via `grep -rn "MagneticButton" src` showing only these two files)

**Interfaces:**
- Produces: `export default function BracketButton(props: BracketButtonProps): JSX.Element` where
  ```ts
  interface BracketButtonProps {
    children: React.ReactNode;
    className?: string;
    href?: string;            // renders as a Next.js Link when provided
    type?: 'button' | 'submit'; // renders as a <button> when href is not provided
    onClick?: () => void;
    disabled?: boolean;
  }
  ```

- [ ] **Step 1: Write the failing test**

Create `src/components/interactive/__tests__/BracketButton.test.tsx`:

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
    // 4 corner brackets + 1 pulse dot
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/interactive/__tests__/BracketButton.test.tsx`
Expected: FAIL — `Cannot find module '../BracketButton'`

- [ ] **Step 3: Write the component**

Create `src/components/interactive/BracketButton.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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

/**
 * A button/link framed by corner brackets that spring outward on hover and
 * snap back on leave — the "tug and pull" effect. Reserved for primary CTAs.
 * Falls back to a plain styled element under reduced motion.
 */
export default function BracketButton({ children, className, href, type, onClick, disabled }: BracketButtonProps) {
  const reduced = useReducedMotion();
  const offset = useMotionValue(4);
  const springOffset = useSpring(offset, cornerSpring);
  const negOffset = useTransform(springOffset, (o) => -o);

  const baseClass = `relative inline-flex items-center justify-center ${className ?? ''}`;

  if (reduced) {
    if (href) {
      return (
        <Link href={href} className={baseClass}>
          {children}
        </Link>
      );
    }
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={baseClass}>
        {children}
      </button>
    );
  }

  const handlers = {
    onPointerEnter: () => offset.set(12),
    onPointerLeave: () => offset.set(4),
  };

  const content = (
    <>
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.key}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 border-ion ${corner.border}`}
          style={{
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
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass} {...handlers}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClass} {...handlers}>
      {content}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/interactive/__tests__/BracketButton.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Swap the homepage "Get in touch" CTA**

In `src/app/page.tsx`, replace the `MagneticButton` import and usage. Change:

```tsx
import MagneticButton from '@/components/interactive/MagneticButton';
```

to:

```tsx
import BracketButton from '@/components/interactive/BracketButton';
```

And change the Contact CTA block:

```tsx
            <MagneticButton href="/contact" className="inline-block rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </MagneticButton>
```

to:

```tsx
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </BracketButton>
```

- [ ] **Step 6: Swap the contact form's submit button**

In `src/components/contact/ContactForm.tsx`, add the import:

```tsx
import BracketButton from '@/components/interactive/BracketButton';
```

Replace the submit button block (current lines 276–282):

```tsx
      <button
        type="submit"
        disabled={formState.status === 'loading'}
        className="bg-ion text-void font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
```

with:

```tsx
      <BracketButton
        type="submit"
        disabled={formState.status === 'loading'}
        className="bg-ion text-void font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
      </BracketButton>
```

- [ ] **Step 7: Delete the now-unused `MagneticButton`**

Run: `grep -rn "MagneticButton" src`
Expected: no output (no remaining references)

Delete `src/components/interactive/MagneticButton.tsx`.

- [ ] **Step 8: Run full test suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all tests pass, no type errors

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: corner-bracket tug-pull button, replacing MagneticButton"
```

---

### Task 5: `AnimatedCounter` stat count-up component

**Files:**
- Create: `src/components/animations/AnimatedCounter.tsx`
- Test: `src/components/animations/__tests__/AnimatedCounter.test.tsx`

**Interfaces:**
- Produces: `export default function AnimatedCounter(props: AnimatedCounterProps): JSX.Element` where
  ```ts
  interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    label: string;
  }
  ```
- Consumed by: Task 6's `Stats` component.

- [ ] **Step 1: Write the failing test**

Create `src/components/animations/__tests__/AnimatedCounter.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '../AnimatedCounter';

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

describe('AnimatedCounter', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('renders the final value immediately under reduced motion', () => {
    mockMatchMedia(true);
    render(<AnimatedCounter value={6} suffix="+" label="years" />);
    expect(screen.getByText('6+')).toBeInTheDocument();
    expect(screen.getByText('years')).toBeInTheDocument();
  });

  it('renders a decimal value correctly under reduced motion', () => {
    mockMatchMedia(true);
    render(<AnimatedCounter value={99.9} suffix="%" label="uptime" />);
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('starts from zero before scrolling into view when motion is enabled', () => {
    mockMatchMedia(false);
    render(<AnimatedCounter value={30} suffix="+" label="sites shipped" />);
    expect(screen.getByText('0+')).toBeInTheDocument();
    expect(screen.getByText('sites shipped')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/animations/__tests__/AnimatedCounter.test.tsx`
Expected: FAIL — `Cannot find module '../AnimatedCounter'`

- [ ] **Step 3: Write the component**

Create `src/components/animations/AnimatedCounter.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * Counts up from 0 to `value` once scrolled into view. Renders the final
 * value immediately under reduced motion, with no count animation.
 */
export default function AnimatedCounter({ value, suffix = '', label }: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const decimals = value % 1 !== 0 ? 1 : 0;
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Number(latest.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals]);

  return (
    <div className="text-center">
      <span ref={ref} className="font-display text-4xl font-semibold text-signal">
        {display.toFixed(decimals)}{suffix}
      </span>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-faint">{label}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/animations/__tests__/AnimatedCounter.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/animations/AnimatedCounter.tsx src/components/animations/__tests__/AnimatedCounter.test.tsx
git commit -m "feat: animated stat counter component"
```

---

### Task 6: `Stats` homepage section

**Files:**
- Create: `src/components/home/Stats.tsx`
- Test: `src/components/home/__tests__/Stats.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `AnimatedCounter` (Task 5), `AnimatedBlobs` (Task 2), `RevealOnScroll` (existing).
- Produces: `export default function Stats(): JSX.Element` — no props, rendered once on the homepage.

- [ ] **Step 1: Write the failing test**

Create `src/components/home/__tests__/Stats.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

describe('Stats', () => {
  it('renders all four stat labels', () => {
    render(<Stats />);
    expect(screen.getByText('years')).toBeInTheDocument();
    expect(screen.getByText('sites shipped')).toBeInTheDocument();
    expect(screen.getByText('uptime')).toBeInTheDocument();
    expect(screen.getByText('avg lighthouse score')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/__tests__/Stats.test.tsx`
Expected: FAIL — `Cannot find module '../Stats'`

- [ ] **Step 3: Write the component**

Create `src/components/home/Stats.tsx`:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import AnimatedBlobs from '@/components/interactive/AnimatedBlobs';

const STATS = [
  { value: 6, suffix: '+', label: 'years' },
  { value: 30, suffix: '+', label: 'sites shipped' },
  { value: 99.9, suffix: '%', label: 'uptime' },
  { value: 95, suffix: '', label: 'avg lighthouse score' },
];

/** Quick credibility strip directly under the hero — no section number, matching the hero's own unnumbered treatment. */
export default function Stats() {
  return (
    <RevealOnScroll>
      <section className="relative overflow-hidden border-t border-hairline py-12">
        <AnimatedBlobs compact />
        <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/__tests__/Stats.test.tsx`
Expected: PASS

- [ ] **Step 5: Wire it into the homepage, after the Hero**

In `src/app/page.tsx`, add the import:

```tsx
import Stats from '@/components/home/Stats';
```

And insert `<Stats />` directly after `<Hero />`:

```tsx
      <Hero />
      <Stats />
```

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/components/home/Stats.tsx src/components/home/__tests__/Stats.test.tsx src/app/page.tsx
git commit -m "feat: animated stats strip on homepage"
```

---

### Task 7: `HowIHelp` services section + homepage renumbering

**Files:**
- Create: `src/components/home/HowIHelp.tsx`
- Test: `src/components/home/__tests__/HowIHelp.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/Pipeline.tsx:40`

**Interfaces:**
- Consumes: `AnimatedBlobs` (Task 2), `RevealOnScroll` (existing).
- Produces: `export default function HowIHelp(): JSX.Element` — no props.

This task also resolves the homepage's section numbering now that a section is being inserted between "Selected Work" (`01`) and "Under the Hood" (currently `02`): How I Help becomes `02`, Under the Hood becomes `03`, and Writing becomes `04`.

- [ ] **Step 1: Write the failing test**

Create `src/components/home/__tests__/HowIHelp.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowIHelp from '../HowIHelp';

describe('HowIHelp', () => {
  it('renders the section header and all four service titles', () => {
    render(<HowIHelp />);
    expect(screen.getByText('02 — How I Help')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Performance & SEO Audits')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/home/__tests__/HowIHelp.test.tsx`
Expected: FAIL — `Cannot find module '../HowIHelp'`

- [ ] **Step 3: Write the component**

Create `src/components/home/HowIHelp.tsx`:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedBlobs from '@/components/interactive/AnimatedBlobs';

const SERVICES = [
  {
    label: '01',
    title: 'Web Development',
    description:
      'Custom websites and web apps — headless WordPress + Next.js, or whatever stack actually fits the job.',
  },
  {
    label: '02',
    title: 'Hosting & Maintenance',
    description:
      'A monthly retainer covering hosting, updates, backups, and the small fixes that keep a site healthy long after launch.',
  },
  {
    label: '03',
    title: 'Performance & SEO Audits',
    description:
      'A clear-eyed look at load times, Core Web Vitals, and search visibility, with a prioritized list of what to fix first.',
  },
  {
    label: '04',
    title: 'Consulting',
    description: 'A second opinion on an architecture decision or a stuck project — hourly or project-based.',
  },
];

export default function HowIHelp() {
  return (
    <RevealOnScroll>
      <section className="relative overflow-hidden border-t border-hairline py-16">
        <AnimatedBlobs compact />
        <h2 className="relative font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — How I Help</h2>
        <div className="relative mt-6 grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.label} className="rounded-xl border border-hairline bg-panel p-6">
              <p className="font-mono text-xs text-ion">[{service.label}]</p>
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/home/__tests__/HowIHelp.test.tsx`
Expected: PASS

- [ ] **Step 5: Wire it into the homepage, after Selected Work**

In `src/app/page.tsx`, add the import:

```tsx
import HowIHelp from '@/components/home/HowIHelp';
```

Insert `<HowIHelp />` between the Selected Work section's closing `</RevealOnScroll>` and the `{/* Under the Hood */}` comment:

```tsx
          <Link href="/work" className="mt-6 inline-block font-mono text-sm text-muted hover:text-ion">
            all work →
          </Link>
        </section>
      </RevealOnScroll>

      <HowIHelp />

      {/* Under the Hood */}
      <Pipeline />
```

- [ ] **Step 6: Renumber "Under the Hood"**

In `src/components/home/Pipeline.tsx`, line 40, change:

```tsx
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">03 — Under the Hood</h2>
```

(was `02 — Under the Hood`)

- [ ] **Step 7: Renumber "Writing"**

In `src/app/page.tsx`, change the Writing section header from:

```tsx
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">03 — Writing</h2>
```

to:

```tsx
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">04 — Writing</h2>
```

- [ ] **Step 8: Run full test suite**

Run: `npm run test`
Expected: all tests pass

- [ ] **Step 9: Commit**

```bash
git add src/components/home/HowIHelp.tsx src/components/home/__tests__/HowIHelp.test.tsx src/app/page.tsx src/components/home/Pipeline.tsx
git commit -m "feat: How I Help services section, renumber homepage sections"
```

---

### Task 8: Footer rebuild — big wordmark + sitemap columns

**Files:**
- Modify: `src/components/layout/Footer.tsx` (full rewrite)
- Test: `src/components/layout/__tests__/Footer.test.tsx`

**Interfaces:** None new — `Footer` keeps its existing no-props default export, consumed only by `src/app/layout.tsx` (unchanged call site).

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/__tests__/Footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the wordmark, sitemap links, and services list', () => {
    render(<Footer />);
    expect(screen.getByText('RAY TURK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'work' })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: 'writing' })).toHaveAttribute('href', '/writing');
    expect(screen.getByRole('link', { name: 'about' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
  });

  it('still renders github, linkedin, and colophon links', () => {
    render(<Footer />);
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'colophon' })).toHaveAttribute('href', '/colophon');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/__tests__/Footer.test.tsx`
Expected: FAIL — missing text/roles (current footer has none of this content)

- [ ] **Step 3: Rewrite the component**

Replace `src/components/layout/Footer.tsx` in full:

```tsx
import Link from 'next/link';
import CookiePrefsLink from '@/components/consent/CookiePrefsLink';

const github = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/RayTurk';
const linkedin =
  process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/raymond-turk-625097137';

const SITEMAP = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

const SERVICES = ['Web Development', 'Hosting & Maintenance', 'Performance & SEO Audits', 'Consulting'];

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-display text-5xl font-semibold tracking-tight text-signal md:text-7xl">
          RAY TURK
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 font-mono text-sm text-muted md:grid-cols-3">
          <ul className="space-y-2">
            {SITEMAP.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ion">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-xs text-faint">
          <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
          <div className="flex gap-4">
            <a href={github} className="hover:text-ion">github</a>
            <a href={linkedin} className="hover:text-ion">linkedin</a>
            <Link href="/colophon" className="hover:text-ion">colophon</Link>
            <CookiePrefsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/layout/__tests__/Footer.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Run full test suite**

Run: `npm run test`
Expected: all tests pass (check the Playwright e2e smoke suite's footer assumptions too — `e2e/` tests link text/roles; re-run `npm run test:e2e` if time permits, since this is the one component every page renders)

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/__tests__/Footer.test.tsx
git commit -m "feat: rebuild footer with wordmark and sitemap columns"
```

---

### Task 9: Work page card tag chips

**Files:**
- Modify: `src/app/work/page.tsx`

**Interfaces:**
- Consumes: `Project.techStacks?.nodes` (existing field on the current `Project` type in `src/types/wordpress.ts` — note this field is expected to be renamed to `technologiesUsed` if/when the separate ACF data-layer plan is implemented; this task intentionally uses today's actual field name so it works against the current codebase regardless of which plan lands first).

No new component, so no new isolated unit test — verified via the full suite (no test currently exists for this page) plus a manual check.

- [ ] **Step 1: Add tag chips to each project card**

In `src/app/work/page.tsx`, update the card body to render tag chips when `techStacks` data is present:

```tsx
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/api';
import TiltCard from '@/components/interactive/TiltCard';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Work', description: 'Case studies and selected projects by Ray Turk.' };

export default async function WorkPage() {
  const { projects } = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Work</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <TiltCard
            key={project.slug}
            href={`/work/${project.slug}`}
            className="block rounded-xl border border-hairline bg-panel p-6 transition-colors hover:border-ion/40"
          >
            <p className="font-mono text-xs text-ion">case-study/{project.slug}</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{project.title}</h2>
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
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run full test suite and type-check**

Run: `npm run test && npm run type-check`
Expected: all pass, no type errors

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/work`, confirm cards render tag chips for the static fallback projects (each of the 6 `STATIC_PROJECTS` entries has `techStacks.nodes` populated, e.g. Summit HVAC shows "Next.js", "React", "TypeScript", etc.)

- [ ] **Step 4: Commit**

```bash
git add src/app/work/page.tsx
git commit -m "feat: tech-stack tag chips on work page cards"
```

---

## Final verification (after all tasks)

- [ ] Run `npm run test` — full suite passes
- [ ] Run `npm run type-check` — no errors
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm run dev` and manually click through `/`, `/work`, `/contact`, toggling OS-level reduced-motion to confirm every new animated piece (dot grid, hero blobs, stats counters, bracket buttons) has a working static fallback
- [ ] Run `npm run lhci` (Lighthouse CI) if time permits, to confirm the color swap didn't regress the existing AA color-contrast checks
