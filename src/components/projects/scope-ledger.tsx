import { StatusBadge } from "@/components/ui/status-badge";
import type { ScopeItem, WorkStatus } from "@/lib/portfolio";

const order: WorkStatus[] = ["implemented", "in-development", "planned"];

/** Every scope item of a project, grouped in three blocks by status. */
export function ScopeLedger({ scope }: { scope: ScopeItem[] }) {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
      {order.map((status) => {
        const items = scope.filter((item) => item.status === status);
        // An empty state adds nothing for the reader: only show the blocks that have scope.
        if (items.length === 0) return null;
        return (
          <div key={status}>
            <h3 className="flex min-h-10 items-center justify-between gap-3 border-b-2 border-foreground pb-2">
              <StatusBadge status={status} />
              <span className="label-mono text-muted" aria-hidden="true">
                {String(items.length).padStart(2, "0")}
              </span>
            </h3>
            {items.length === 0 ? (
              <p className="border-b border-[color:var(--border)] py-3.5 text-sm text-muted">
                Ningún elemento en este estado.
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.label} className="border-b border-[color:var(--border)] py-3.5">
                    <p className="text-[0.9375rem] leading-snug text-foreground">{item.label}</p>
                    <p className="label-mono mt-1.5 text-muted">{item.area}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
