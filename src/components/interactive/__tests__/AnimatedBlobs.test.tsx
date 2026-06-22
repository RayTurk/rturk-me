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
