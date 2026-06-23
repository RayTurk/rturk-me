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
