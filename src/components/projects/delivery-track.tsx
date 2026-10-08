import { workStatusLabel, type DeliveryPhase, type WorkStatus } from "@/lib/portfolio";

type Tone = "ink" | "paper";

const toneColor: Record<Tone, Record<WorkStatus, string>> = {
  ink: { implemented: "#8fc19b", "in-development": "#e0b469", planned: "#a89d8b" },
  paper: {
    implemented: "var(--status-done)",
    "in-development": "var(--status-dev)",
    planned: "var(--status-plan)",
  },
};

const columns: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
};

/** Node glyph: the shape carries the state (filled / half / dashed), not only the colour. */
function Node({ status, color, size = 16 }: { status: WorkStatus; color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className="flex-none"
    >
      {status === "implemented" ? <rect x="1" y="1" width="14" height="14" fill={color} /> : null}
      {status === "in-development" ? <rect x="1" y="1" width="7" height="14" fill={color} /> : null}
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={status === "planned" ? "3 2" : undefined}
      />
    </svg>
  );
}

/** Full delivery track: horizontal from md up, vertical on mobile. */
export function DeliveryTrack({ phases, tone = "ink" }: { phases: DeliveryPhase[]; tone?: Tone }) {
  const colors = toneColor[tone];
  const rule = tone === "ink" ? "var(--ink-fg)" : "var(--foreground)";

  return (
    <ol className={`grid ${columns[phases.length] ?? "md:grid-cols-6"}`}>
      {phases.map((phase, index) => {
        const last = index === phases.length - 1;
        return (
          <li key={phase.label} className="flex gap-4 md:block">
            <div className="flex flex-col items-center md:flex-row">
              <Node status={phase.status} color={colors[phase.status]} />
              {last ? null : (
                <span
                  aria-hidden="true"
                  className="min-h-8 flex-1 border-l md:min-h-0 md:border-l-0 md:border-t"
                  style={{
                    borderColor: rule,
                    borderStyle: phase.status === "implemented" ? "solid" : "dashed",
                    opacity: phase.status === "implemented" ? 0.9 : 0.45,
                  }}
                />
              )}
            </div>
            <div className="pb-6 md:pb-0 md:pr-4 md:pt-4">
              <p className="label-mono opacity-60">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-[0.9375rem] font-medium leading-snug">{phase.label}</p>
              <p className="label-mono mt-1.5" style={{ color: colors[phase.status] }}>
                {workStatusLabel[phase.status]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Compact track for index rows: glyph strip + the phases that are open right now. */
export function DeliveryTrackCompact({
  phases,
  tone = "ink",
}: {
  phases: DeliveryPhase[];
  tone?: Tone;
}) {
  const colors = toneColor[tone];
  const rule = tone === "ink" ? "var(--ink-fg)" : "var(--foreground)";
  const current = phases.filter((phase) => phase.status === "in-development");

  return (
    <div>
      <ol className="flex items-center" aria-label="Fases de entrega">
        {phases.map((phase, index) => (
          <li key={phase.label} className={`flex items-center ${index === phases.length - 1 ? "" : "flex-1"}`}>
            <Node status={phase.status} color={colors[phase.status]} size={14} />
            <span className="sr-only">
              {phase.label}: {workStatusLabel[phase.status]}
            </span>
            {index === phases.length - 1 ? null : (
              <span
                aria-hidden="true"
                className="flex-1 border-t"
                style={{
                  borderColor: rule,
                  borderStyle: phase.status === "implemented" ? "solid" : "dashed",
                  opacity: phase.status === "implemented" ? 0.9 : 0.45,
                }}
              />
            )}
          </li>
        ))}
      </ol>
      {current.length > 0 ? (
        <p className="label-mono mt-3 leading-relaxed">
          <span className="opacity-60">Ahora · </span>
          {current.map((phase) => phase.label).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
