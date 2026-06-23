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
