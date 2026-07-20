type SpecimenGroup = {
  title: string;
  items: string[];
};

/**
 * A specimen index — monospace category labels, hairline-divided item rows,
 * each row hard-inverting (bg→ink, text→paper) on hover. Replaces the
 * cursor-follow-glow bento grid (a reactbits.dev MagicBento-inspired piece).
 */
export function SpecimenIndex({ groups }: { groups: SpecimenGroup[] }) {
  return (
    <div className="divide-y-2 divide-[color:var(--foreground)] border-2 border-[color:var(--foreground)]">
      {groups.map((group) => (
        <div key={group.title} className="grid sm:grid-cols-[10rem_1fr]">
          <div className="flex items-center border-b-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--muted)] sm:border-b-0 sm:border-r-2">
            {group.title}
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {group.items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
              >
                <span className="font-mono">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
