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
