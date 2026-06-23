const SQUARES = [
  { top: '8%', left: '12%', size: 10, opacity: 0.5 },
  { top: '18%', left: '40%', size: 6, opacity: 0.3 },
  { top: '5%', left: '70%', size: 8, opacity: 0.4 },
  { top: '30%', left: '20%', size: 6, opacity: 0.25 },
  { top: '35%', left: '55%', size: 10, opacity: 0.45 },
  { top: '42%', left: '80%', size: 6, opacity: 0.3 },
  { top: '50%', left: '10%', size: 8, opacity: 0.35 },
  { top: '55%', left: '35%', size: 6, opacity: 0.2 },
  { top: '60%', left: '65%', size: 10, opacity: 0.4 },
  { top: '68%', left: '88%', size: 6, opacity: 0.25 },
  { top: '72%', left: '25%', size: 8, opacity: 0.3 },
  { top: '80%', left: '50%', size: 6, opacity: 0.2 },
  { top: '85%', left: '75%', size: 10, opacity: 0.35 },
  { top: '15%', left: '90%', size: 6, opacity: 0.25 },
  { top: '92%', left: '15%', size: 8, opacity: 0.3 },
];

/** Static decorative scatter of squares used behind the About page's "My Story" section. Fixed layout (no randomness) to avoid hydration mismatches. */
export default function GridScatter() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SQUARES.map((square, i) => (
        <span
          key={i}
          className="absolute rounded-sm bg-ion"
          style={{
            top: square.top,
            left: square.left,
            width: square.size,
            height: square.size,
            opacity: square.opacity,
          }}
        />
      ))}
    </div>
  );
}
