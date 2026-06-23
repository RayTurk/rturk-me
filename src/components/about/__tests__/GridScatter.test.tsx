import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import GridScatter from '../GridScatter';

describe('GridScatter', () => {
  it('renders a hidden, non-interactive decorative layer with multiple squares', () => {
    const { container } = render(<GridScatter />);
    const layer = container.querySelector('[aria-hidden="true"]');
    expect(layer).not.toBeNull();
    expect(layer).toHaveClass('pointer-events-none');
    expect(layer?.children.length).toBeGreaterThan(5);
  });
});
