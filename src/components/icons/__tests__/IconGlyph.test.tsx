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
