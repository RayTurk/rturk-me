import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RevealOnScroll from '../RevealOnScroll';

describe('RevealOnScroll', () => {
  it('renders its children', () => {
    render(<RevealOnScroll><p>hello world</p></RevealOnScroll>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('renders children immediately, without animation, when immediate is set', () => {
    const { container } = render(
      <RevealOnScroll immediate><p>above the fold</p></RevealOnScroll>
    );
    expect(screen.getByText('above the fold')).toBeInTheDocument();
    expect(container.querySelector('[style*="opacity"]')).toBeNull();
  });
});
