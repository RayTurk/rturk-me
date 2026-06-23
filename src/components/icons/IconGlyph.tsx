interface IconGlyphProps {
  variant: 'cross' | 'dots' | 'square' | 'scatter';
  className?: string;
}

const GLYPHS: Record<IconGlyphProps['variant'], React.ReactNode> = {
  cross: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  dots: (
    <>
      <circle cx="7" cy="7" r="1.6" fill="currentColor" />
      <circle cx="17" cy="7" r="1.6" fill="currentColor" />
      <circle cx="7" cy="17" r="1.6" fill="currentColor" />
      <circle cx="17" cy="17" r="1.6" fill="currentColor" />
    </>
  ),
  square: <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" />,
  scatter: (
    <>
      <circle cx="6" cy="6" r="1.4" fill="currentColor" />
      <circle cx="15" cy="8" r="1.4" fill="currentColor" />
      <circle cx="18" cy="17" r="1.4" fill="currentColor" />
      <circle cx="8" cy="17" r="1.4" fill="currentColor" />
      <circle cx="16" cy="4" r="1.4" fill="currentColor" />
    </>
  ),
};

/** A small inline-SVG glyph used on service/principle cards. Renders in `currentColor` — set color via className (e.g. `text-ion`). */
export default function IconGlyph({ variant, className }: IconGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className={className}>
      {GLYPHS[variant]}
    </svg>
  );
}
