type Pt = [number, number];

// The `</>` mark the particle cloud forms first, as polylines in a 200 × 120 box.
const STROKES: Pt[][] = [
  [
    [62, 16],
    [20, 60],
    [62, 104],
  ],
  [
    [118, 10],
    [82, 110],
  ],
  [
    [138, 16],
    [180, 60],
    [138, 104],
  ],
];
const STEP = 6.5;

function sample(stroke: Pt[]) {
  const out: Pt[] = [];
  for (let i = 0; i < stroke.length - 1; i++) {
    const [ax, ay] = stroke[i];
    const [bx, by] = stroke[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / STEP));
    for (let k = i === 0 ? 0 : 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return out;
}

const DOTS = STROKES.flatMap(sample);
const GRID: Pt[] = [];
for (let y = 6; y < 120; y += 12) for (let x = 6; x < 200; x += 12) GRID.push([x, y]);

/** Still stand-in for the hero particle cloud, shown only in the static scene mode. */
export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 200 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-art-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--mint)" />
          <stop offset="0.55" stopColor="var(--lavender)" />
          <stop offset="1" stopColor="var(--peach)" />
        </linearGradient>
      </defs>
      <g className="hero-art-grid">
        {GRID.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" />
        ))}
      </g>
      <g fill="url(#hero-art-grad)">
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.1" />
        ))}
      </g>
    </svg>
  );
}
