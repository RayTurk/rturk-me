import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RevealOnScroll from '../RevealOnScroll';

describe('RevealOnScroll', () => {
  it('renders its children', () => {
    render(<RevealOnScroll><p>hello world</p></RevealOnScroll>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
