interface IconGlyphProps {
  variant: 'cross' | 'dots' | 'square' | 'scatter';
  className?: string;
}

// 4×4 grid of pixels: 1 = filled, 0 = empty (row-major order).
// Pixel at (col, row): x = 1 + col*5.5, y = 1 + row*5.5, width=4, height=4.
const GLYPHS: Record<IconGlyphProps['variant'], number[][]> = {
  cross: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ],
  dots: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
  ],
  square: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  scatter: [
    [1, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 1],
  ],
};

function renderPixels(grid: number[][]): React.ReactNode {
  const pixels: React.ReactNode[] = [];
  grid.forEach((row, r) =>
    row.forEach((filled, c) => {
      if (filled) {
        pixels.push(
          <rect key={`${c}-${r}`} x={1 + c * 5.5} y={1 + r * 5.5} width={4} height={4} fill="currentColor" />,
        );
      }
    }),
  );
  return pixels;
}

export default function IconGlyph({ variant, className }: IconGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden className={className}>
      {renderPixels(GLYPHS[variant])}
    </svg>
  );
}
