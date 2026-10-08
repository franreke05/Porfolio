import { processSteps } from "@/lib/site-data";

/** How we work: four ruled steps. Server-rendered, no motion. */
export function ProcessTimeline() {
  return (
    <ol className="grid gap-x-8 sm:grid-cols-2">
      {processSteps.map((step, index) => (
        <li key={step.title} className="border-t-2 border-[color:var(--foreground)] pb-7 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-display text-3xl font-bold leading-none text-[color:var(--foreground)]" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="label-mono text-right text-[color:var(--muted)]">{step.output}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
