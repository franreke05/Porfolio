import { workStatusLabel, type WorkStatus } from "@/lib/portfolio";

type StatusBadgeProps = {
  status: WorkStatus;
  /** Overrides the default label, e.g. "MVP académico". */
  label?: string;
  /** Short qualifier shown after the label, e.g. "objetivo: diciembre de 2026". */
  note?: string;
  className?: string;
};

export function StatusBadge({ status, label, note, className }: StatusBadgeProps) {
  return (
    <span className={`status ${className ?? ""}`} data-s={status}>
      {label ?? workStatusLabel[status]}
      {note ? <span className="normal-case tracking-normal opacity-80">· {note}</span> : null}
    </span>
  );
}
