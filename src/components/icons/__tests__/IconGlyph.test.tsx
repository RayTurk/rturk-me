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

  it('applies the className prop to the svg element', () => {
    const { container } = render(<IconGlyph variant="cross" className="text-ion" />);
    expect(container.querySelector('svg')).toHaveClass('text-ion');
  });
});
