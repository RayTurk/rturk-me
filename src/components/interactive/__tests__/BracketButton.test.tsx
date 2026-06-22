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
