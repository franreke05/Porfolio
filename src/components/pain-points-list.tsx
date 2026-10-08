type PainPointsListProps = {
  items: readonly string[];
};

/** Numbered, hairline-divided list of starting situations. Server-rendered. */
export function PainPointsList({ items }: PainPointsListProps) {
  return (
    <ul className="border-b border-[color:var(--border)]">
      {items.map((item, index) => (
        <li
          key={item}
          className="flex gap-4 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:gap-5"
        >
          <span className="shrink-0 pt-1 font-mono text-xs font-bold text-[color:var(--muted)]" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="leading-7 text-[color:var(--foreground)]">{item}</p>
        </li>
      ))}
    </ul>
  );
}
