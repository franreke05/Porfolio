import styles from "./projects.module.css";

const points: Array<[number, number]> = [
  [18, 214],
  [84, 196],
  [112, 138],
  [186, 150],
  [226, 92],
  [304, 104],
  [336, 52],
  [404, 30],
];

/** Decorative route polyline for CaravanTruck Way. Drawn once; static with reduced motion. */
export function RouteMotif({ className = "" }: { className?: string }) {
  const start = points[0];
  const end = points[points.length - 1];

  return (
    <svg
      viewBox="0 0 422 240"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {[40, 100, 160, 220].map((y) => (
        <line key={y} x1="0" x2="422" y1={y} y2={y} stroke="var(--ink-rule)" strokeWidth="1" />
      ))}
      {[70, 176, 282, 388].map((x) => (
        <line key={x} x1={x} x2={x} y1="0" y2="240" stroke="var(--ink-rule)" strokeWidth="1" />
      ))}
      <polyline
        points={points.map((point) => point.join(",")).join(" ")}
        pathLength={1}
        className={styles.draw}
        stroke="var(--ink-fg)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      {points.slice(1, -1).map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x - 3}
          y={y - 3}
          width="6"
          height="6"
          fill="var(--ink-bg)"
          stroke="var(--ink-fg)"
          strokeWidth="1.5"
        />
      ))}
      <rect x={start[0] - 5} y={start[1] - 5} width="10" height="10" fill="var(--ink-fg)" />
      <rect
        x={end[0] - 7}
        y={end[1] - 7}
        width="14"
        height="14"
        fill="var(--ink-bg)"
        stroke="var(--ink-fg)"
        strokeWidth="2"
      />
      <rect x={end[0] - 2.5} y={end[1] - 2.5} width="5" height="5" fill="var(--ink-fg)" />
    </svg>
  );
}
