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
