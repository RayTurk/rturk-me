# Codedgar Layout Language Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Codedgar layout language (section labels, ghost numbers, pixel-art icons, centered footer wordmark, colored accent dividers) as an extension on top of the existing visual polish pass, keeping the dark color palette unchanged.

**Architecture:** A new `SectionLabel` shared component holds the `// label` + ghost number pattern; all section headings across 5 pages are updated to use it, replacing the old inline monospace H2 labels with a `SectionLabel` + new `font-display` H2 pair. `IconGlyph` is rewritten in place (same props, pixel-art SVG implementation). `Footer` is restructured to center the wordmark. One `border-ion` accent divider is added per page on its primary content section.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind CSS v4, Vitest + React Testing Library

## Global Constraints

- Dark palette unchanged: `void`, `panel`, `hairline`, `ion` (#ff4200), `drift`, `signal`, `muted`, `faint` — no new colors added.
- `SectionLabel` is a Server Component (no `'use client'`).
- `IconGlyph` keeps its existing API exactly: `variant: 'cross' | 'dots' | 'square' | 'scatter'`, `className?: string`.
- All `<SectionLabel label="..." />` calls use dot-notation slugs (`page.work`, `section.my-story`).
- Ghost numbers are `aria-hidden`, `pointer-events-none`, `select-none` — no interactive or semantic role.
- This plan is an extension on top of `docs/superpowers/specs/2026-06-23-visual-polish-pass-design.md`. Both plans are independent and can be implemented in either order.
- Heading replacement rule: every section that previously used an inline `<h2 className="font-mono text-xs uppercase ...">NN — Title</h2>` (serving double-duty as label + heading) is replaced with `<SectionLabel label="section.slug" number="NN" />` + `<h2 className="mt-2 font-display text-2xl font-semibold">Title</h2>`.
- Test runner: `npx vitest run <path>` for targeted runs; `npx vitest run` for the full suite.

---

### Task 1: SectionLabel component

**Files:**
- Create: `src/components/layout/SectionLabel.tsx`
- Create: `src/components/layout/__tests__/SectionLabel.test.tsx`

**Interfaces:**
- Produces: `export default function SectionLabel({ label, number }: { label: string; number?: string }): JSX.Element`

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/__tests__/SectionLabel.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionLabel from '../SectionLabel';

describe('SectionLabel', () => {
  it('renders the comment-style label text', () => {
    render(<SectionLabel label="section.my-story" />);
    expect(screen.getByText('// section.my-story')).toBeInTheDocument();
  });

  it('renders the ghost number when provided', () => {
    render(<SectionLabel label="section.my-story" number="02" />);
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('omits the ghost number when number is not provided', () => {
    const { container } = render(<SectionLabel label="page.about" />);
    expect(container.querySelector('span[aria-hidden]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run src/components/layout/__tests__/SectionLabel.test.tsx
```

Expected: FAIL — "Cannot find module '../SectionLabel'"

- [ ] **Step 3: Implement SectionLabel**

Create `src/components/layout/SectionLabel.tsx`:

```tsx
interface Props {
  label: string;
  number?: string;
}

export default function SectionLabel({ label, number }: Props) {
  return (
    <div className="relative">
      <p className="font-mono text-xs text-faint">// {label}</p>
      {number && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 select-none font-display text-[8rem] font-black leading-none text-signal/[0.05]"
        >
          {number}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npx vitest run src/components/layout/__tests__/SectionLabel.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/SectionLabel.tsx src/components/layout/__tests__/SectionLabel.test.tsx
git commit -m "feat: SectionLabel component with comment label and ghost number"
```

---

### Task 2: IconGlyph pixel-art upgrade

**Files:**
- Modify: `src/components/icons/IconGlyph.tsx`
- Modify: `src/components/icons/__tests__/IconGlyph.test.tsx`

**Interfaces:**
- Produces: `IconGlyph` still accepts `{ variant: 'cross' | 'dots' | 'square' | 'scatter'; className?: string }`, now renders at `width={24} height={24}` using `<rect>` pixel elements

The current test checks that each variant renders an SVG and that `className` is forwarded. It does NOT assert size or element type. The update adds size and rect assertions.

- [ ] **Step 1: Update the test to assert new size and pixel-art output**

Replace `src/components/icons/__tests__/IconGlyph.test.tsx`:

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

  it.each(['cross', 'dots', 'square', 'scatter'] as const)(
    'renders %s at 24×24',
    (variant) => {
      const { container } = render(<IconGlyph variant={variant} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
    }
  );

  it.each(['cross', 'dots', 'square', 'scatter'] as const)(
    'renders rect pixel elements for %s',
    (variant) => {
      const { container } = render(<IconGlyph variant={variant} />);
      expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    }
  );

  it('applies the className prop to the svg element', () => {
    const { container } = render(<IconGlyph variant="cross" className="text-ion" />);
    expect(container.querySelector('svg')).toHaveClass('text-ion');
  });
});
```

- [ ] **Step 2: Run test to verify new assertions fail**

```
npx vitest run src/components/icons/__tests__/IconGlyph.test.tsx
```

Expected: FAIL — size assertions expect `'24'`, get `'20'`; rect assertions fail (current icons use `<path>` and `<circle>`, not `<rect>`)

- [ ] **Step 3: Rewrite IconGlyph with pixel-art implementation**

Grid math: viewBox `0 0 24 24`. Each pixel is a `4×4` rect. Step between pixels: `5.5` (4px size + 1.5px gap). Grid origin at `x=1, y=1`. Four columns at x: `1, 6.5, 12, 17.5`. Four rows at y: `1, 6.5, 12, 17.5`. All pixels use `fill="currentColor"`.

Replace `src/components/icons/IconGlyph.tsx` entirely:

```tsx
interface IconGlyphProps {
  variant: 'cross' | 'dots' | 'square' | 'scatter';
  className?: string;
}

// 4×4 grid of pixels: 1 = filled, 0 = empty (row-major order).
// Pixel at (col, row): x = 1 + col*5.5, y = 1 + row*5.5, width=4, height=4.
const GLYPHS: Record<IconGlyphProps['variant'], number[][]> = {
  cross: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ],
  dots: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
  ],
  square: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  scatter: [
    [1, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 1],
  ],
};

function renderPixels(grid: number[][]): React.ReactNode {
  const pixels: React.ReactNode[] = [];
  grid.forEach((row, r) =>
    row.forEach((filled, c) => {
      if (filled) {
        pixels.push(
          <rect key={`${c}-${r}`} x={1 + c * 5.5} y={1 + r * 5.5} width={4} height={4} fill="currentColor" />,
        );
      }
    }),
  );
  return pixels;
}

export default function IconGlyph({ variant, className }: IconGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden className={className}>
      {renderPixels(GLYPHS[variant])}
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npx vitest run src/components/icons/__tests__/IconGlyph.test.tsx
```

Expected: PASS — 13 tests (4 SVG render + 4 size + 4 rect + 1 className)

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/IconGlyph.tsx src/components/icons/__tests__/IconGlyph.test.tsx
git commit -m "feat: upgrade IconGlyph to pixel-art dot-matrix icons"
```

---

### Task 3: Footer — centered wordmark, tagline, 3-column nav

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/__tests__/Footer.test.tsx`

**Interfaces:**
- Produces: Footer with centered clamp-sized wordmark, tagline `"full-stack developer · cleveland, oh"`, 3-column nav (sitemap | services | github+linkedin), colophon in bottom bar

The existing Footer test checks for "RAY TURK", sitemap links, services, github, linkedin, and the colophon link. All of these remain in the new layout — github/linkedin move from the bottom bar to nav column 3, but `screen.getByText('github')` still finds them. The only FAILING assertion to add first is the new tagline.

- [ ] **Step 1: Add the tagline test (will fail)**

Replace `src/components/layout/__tests__/Footer.test.tsx`:

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

  it('renders the tagline', () => {
    render(<Footer />);
    expect(screen.getByText('full-stack developer · cleveland, oh')).toBeInTheDocument();
  });

  it('still renders github, linkedin, and colophon links', () => {
    render(<Footer />);
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'colophon' })).toHaveAttribute('href', '/colophon');
  });
});
```

- [ ] **Step 2: Run test to verify the tagline assertion fails**

```
npx vitest run src/components/layout/__tests__/Footer.test.tsx
```

Expected: FAIL — "full-stack developer · cleveland, oh" not found

- [ ] **Step 3: Rewrite Footer**

Replace `src/components/layout/Footer.tsx` entirely:

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
        <div className="text-center">
          <p
            className="font-display font-black leading-none tracking-tighter text-signal"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            RAY TURK
          </p>
          <p className="mt-2 font-mono text-xs text-faint">full-stack developer · cleveland, oh</p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-8 border-t border-hairline pt-8 font-mono text-sm text-muted">
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
          <ul className="space-y-2">
            <li>
              <a href={github} className="hover:text-ion">
                github
              </a>
            </li>
            <li>
              <a href={linkedin} className="hover:text-ion">
                linkedin
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-xs text-faint">
          <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
          <div className="flex gap-4">
            <Link href="/colophon" className="hover:text-ion">
              colophon
            </Link>
            <CookiePrefsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify all 3 tests pass**

```
npx vitest run src/components/layout/__tests__/Footer.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/__tests__/Footer.test.tsx
git commit -m "feat: footer wordmark — centered, clamp-sized, tagline, 3-col nav"
```

---

### Task 4: Apply SectionLabel to HowIHelp and Pipeline

**Files:**
- Modify: `src/components/home/HowIHelp.tsx`
- Modify: `src/components/home/Pipeline.tsx`
- Modify: `src/components/home/__tests__/HowIHelp.test.tsx`

**Interfaces:**
- Consumes: `SectionLabel` from `@/components/layout/SectionLabel` — `(props: { label: string; number?: string }) => JSX.Element`

The current HowIHelp test asserts `screen.getByText('02 — How I Help')`. After the change, that text no longer exists; instead there will be `'// section.how-i-help'` (from SectionLabel) and an H2 `'How I Help'`. Pipeline has no test file.

- [ ] **Step 1: Update the HowIHelp test to assert the new pattern (will fail)**

Replace `src/components/home/__tests__/HowIHelp.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowIHelp from '../HowIHelp';

describe('HowIHelp', () => {
  it('renders the section label and heading', () => {
    render(<HowIHelp />);
    expect(screen.getByText('// section.how-i-help')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I Help', level: 2 })).toBeInTheDocument();
  });

  it('renders all four service titles', () => {
    render(<HowIHelp />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Performance & SEO Audits')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run src/components/home/__tests__/HowIHelp.test.tsx
```

Expected: FAIL — `'// section.how-i-help'` not found; `'How I Help'` heading not found

- [ ] **Step 3: Update HowIHelp.tsx**

Replace `src/components/home/HowIHelp.tsx` entirely:

```tsx
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import IconGlyph from '@/components/icons/IconGlyph';
import SectionLabel from '@/components/layout/SectionLabel';

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
        <SectionLabel label="section.how-i-help" number="02" />
        <h2 className="mt-2 font-display text-2xl font-semibold">How I Help</h2>
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

- [ ] **Step 4: Update Pipeline.tsx**

`Pipeline.tsx` has `'use client'` — `SectionLabel` (a Server Component) can be imported into client components without issue.

Replace `src/components/home/Pipeline.tsx` entirely:

```tsx
'use client';

import { motion } from 'motion/react';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionLabel from '@/components/layout/SectionLabel';

const STAGES = [
  { name: 'WordPress', detail: 'cms.rturk.me' },
  { name: 'WPGraphQL', detail: 'typed queries' },
  { name: 'Next.js 16', detail: 'RSC · ISR' },
  { name: 'Netlify', detail: 'you are here' },
];

export default function Pipeline() {
  const reduced = useReducedMotion();

  const stages = STAGES.map((stage, i) => (
    <div key={stage.name} className="flex items-center gap-3">
      <motion.div
        {...(reduced ? {} : { variants: fadeUpItem })}
        className="rounded-lg border border-hairline bg-panel px-4 py-3"
      >
        <p className="font-display text-sm font-semibold text-signal">{stage.name}</p>
        <p className="font-mono text-[10px] text-faint">{stage.detail}</p>
      </motion.div>
      {i < STAGES.length - 1 && (
        <span aria-hidden className="font-mono text-ion">
          →
        </span>
      )}
    </div>
  ));

  return (
    <section className="border-t border-hairline py-16">
      <SectionLabel label="section.process" number="03" />
      <h2 className="mt-2 font-display text-2xl font-semibold">Under the Hood</h2>
      {reduced ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">{stages}</div>
      ) : (
        <motion.div
          className="mt-6 flex flex-wrap items-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {stages}
        </motion.div>
      )}
      <p className="mt-6 max-w-xl text-sm text-muted">
        WordPress stays the editing experience Ray knows; everything a visitor touches is a
        statically-generated, incrementally-revalidated Next.js app.
        <a
          href="/colophon"
          className="ml-1 text-ion underline underline-offset-2 decoration-ion/50 hover:decoration-ion"
        >
          How this site is built →
        </a>
      </p>
    </section>
  );
}
```

- [ ] **Step 5: Run tests to verify HowIHelp passes**

```
npx vitest run src/components/home/__tests__/HowIHelp.test.tsx
```

Expected: PASS — 2 tests

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HowIHelp.tsx src/components/home/Pipeline.tsx src/components/home/__tests__/HowIHelp.test.tsx
git commit -m "feat: apply SectionLabel to HowIHelp and Pipeline components"
```

---

### Task 5: Homepage — SectionLabel on content sections, border-ion on Selected Work

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SectionLabel` from `@/components/layout/SectionLabel` — `(props: { label: string; number?: string }) => JSX.Element`

`src/app/page.tsx` is an async RSC with API dependencies — there is no dedicated unit test file. Changes are verified by running the full suite (to catch any import/type regressions) and by visual inspection in dev.

- [ ] **Step 1: Update src/app/page.tsx**

Replace `src/app/page.tsx` entirely:

```tsx
import Link from 'next/link';
import { getFeaturedProjects, getRecentPosts } from '@/lib/api';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import Hero from '@/components/interactive/Hero';
import BracketButton from '@/components/interactive/BracketButton';
import TiltCard from '@/components/interactive/TiltCard';
import Pipeline from '@/components/home/Pipeline';
import Stats from '@/components/home/Stats';
import HowIHelp from '@/components/home/HowIHelp';
import SectionLabel from '@/components/layout/SectionLabel';

export const revalidate = 3600;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(), getRecentPosts(3)]);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero />
      <Stats />

      {/* Selected Work — border-ion accent divider */}
      <RevealOnScroll>
        <section className="border-t border-ion py-16">
          <SectionLabel label="section.selected-work" number="01" />
          <h2 className="mt-2 font-display text-2xl font-semibold">Selected Work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
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
          </div>
          <Link href="/work" className="mt-6 inline-block font-mono text-sm text-muted hover:text-ion">
            all work →
          </Link>
        </section>
      </RevealOnScroll>

      <HowIHelp />

      {/* Under the Hood */}
      <Pipeline />

      {/* Writing */}
      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <SectionLabel label="section.writing" number="04" />
          <h2 className="mt-2 font-display text-2xl font-semibold">Writing</h2>
          <ul className="mt-6 divide-y divide-hairline">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="flex items-baseline justify-between gap-4 py-4 hover:text-ion"
                >
                  <span>{post.title}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      {/* Contact CTA */}
      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-muted">
              Full-stack developer at Neon Goldfish, building headless WordPress and Next.js sites.
              <Link href="/about" className="ml-2 text-ion">
                more →
              </Link>
            </p>
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </BracketButton>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite to check for regressions**

```
npx vitest run
```

Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: section labels and border-ion accent on homepage"
```

---

### Task 6: About page — SectionLabel on all sections, border-ion on My Story

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/about/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `SectionLabel` from `@/components/layout/SectionLabel` — `(props: { label: string; number?: string }) => JSX.Element`

The current About test checks for `"02 — My Story"`, `"03 — How I Think About Work"`, and `"04 — Career Commits"` — all three break. It also checks `screen.getByRole('heading', { level: 2, name: "What I Don't Do" })` which stays unchanged.

- [ ] **Step 1: Update the About page test to assert the new label pattern (will fail)**

Replace `src/app/about/__tests__/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

describe('AboutPage', () => {
  it('renders the page label, heading, availability badge, and photo', () => {
    render(<AboutPage />);
    expect(screen.getByText('// page.about')).toBeInTheDocument();
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

  it('renders the My Story section label, heading, and prose', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.my-story')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Story', level: 2 })).toBeInTheDocument();
    expect(
      screen.getByText(/I'm Ray Turk, a full-stack web developer based in Cleveland, Ohio\./)
    ).toBeInTheDocument();
  });

  it('renders the principles section label, heading, and card titles', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.principles')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I Think About Work', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Maintainability over cleverness')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: "What I Don't Do" })).toBeInTheDocument();
    expect(screen.getByText(/Free, unpaid scope creep/)).toBeInTheDocument();
  });

  it('renders the Career Commits section label, heading, and contact CTA', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.career')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Career Commits', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer · Neon Goldfish')).toBeInTheDocument();
    expect(screen.getByText('Have a project or a role in mind? Send a note.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run src/app/about/__tests__/page.test.tsx
```

Expected: FAIL — `'// page.about'`, `'// section.my-story'`, `'// section.principles'`, `'// section.career'` not found; headings like `'My Story'` not found

- [ ] **Step 3: Update src/app/about/page.tsx**

Replace `src/app/about/page.tsx` entirely:

```tsx
import type { Metadata } from 'next';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import GridScatter from '@/components/about/GridScatter';
import IconGlyph from '@/components/icons/IconGlyph';
import TechTicker from '@/components/about/TechTicker';
import CareerTimeline from '@/components/about/CareerTimeline';
import BracketButton from '@/components/interactive/BracketButton';
import SectionLabel from '@/components/layout/SectionLabel';
import { PROFILE_STATS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ray Turk — full-stack web developer in Cleveland, Ohio. Headless WordPress, Next.js, and the occasional shader.',
};

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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <RevealOnScroll>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <SectionLabel label="page.about" />
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

      {/* My Story — border-ion accent divider */}
      <RevealOnScroll>
        <section className="relative overflow-hidden border-t border-ion py-16">
          <GridScatter />
          <SectionLabel label="section.my-story" number="02" />
          <h2 className="mt-2 font-display text-2xl font-semibold">My Story</h2>
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

      <RevealOnScroll>
        <section className="border-t border-hairline py-10">
          <TechTicker items={TECH_TICKER_ITEMS} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <SectionLabel label="section.principles" number="03" />
          <h2 className="mt-2 font-display text-2xl font-semibold">How I Think About Work</h2>
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
          <SectionLabel label="section.career" number="04" />
          <h2 className="mt-2 font-display text-2xl font-semibold">Career Commits</h2>
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
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npx vitest run src/app/about/__tests__/page.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx src/app/about/__tests__/page.test.tsx
git commit -m "feat: section labels and border-ion accent on About page"
```

---

### Task 7: Work, Writing, Contact pages — page header labels and border-ion accent

**Files:**
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/writing/page.tsx`
- Modify: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `SectionLabel` from `@/components/layout/SectionLabel` — `(props: { label: string; number?: string }) => JSX.Element`

No dedicated unit tests exist for these three page files (all are RSCs with API dependencies or external component deps). Changes verified by running the full suite.

- [ ] **Step 1: Update Work page**

Replace `src/app/work/page.tsx` entirely:

```tsx
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/api';
import TiltCard from '@/components/interactive/TiltCard';
import SectionLabel from '@/components/layout/SectionLabel';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Work', description: 'Case studies and selected projects by Ray Turk.' };

export default async function WorkPage() {
  const { projects } = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionLabel label="page.work" />
      <h1 className="mt-2 font-display text-4xl font-semibold">Work</h1>
      <section className="mt-10 border-t border-ion pt-10">
        <div className="grid gap-4 md:grid-cols-2">
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
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Update Writing page**

Replace `src/app/writing/page.tsx` entirely:

```tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';
import SectionLabel from '@/components/layout/SectionLabel';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Writing', description: 'Technical writing by Ray Turk.' };

export default async function WritingPage() {
  const { posts } = await getAllPosts(100);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionLabel label="page.writing" />
      <h1 className="mt-2 font-display text-4xl font-semibold">Writing</h1>
      <section className="mt-10 border-t border-ion pt-10">
        <ul className="divide-y divide-hairline">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="flex items-baseline justify-between gap-4 py-4 hover:text-ion"
              >
                <span>{post.title}</span>
                <span className="shrink-0 font-mono text-xs text-faint">
                  {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Update Contact page**

Replace `src/app/contact/page.tsx` entirely:

```tsx
import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import SectionLabel from '@/components/layout/SectionLabel';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with Ray Turk.' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <SectionLabel label="page.contact" />
      <h1 className="mt-2 font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-muted">Have a project or a role in mind? Send a note.</p>
      <section className="mt-10 border-t border-ion pt-10">
        <ContactForm />
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run the full test suite**

```
npx vitest run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/app/work/page.tsx src/app/writing/page.tsx src/app/contact/page.tsx
git commit -m "feat: page header labels and border-ion accent on Work, Writing, Contact"
```
