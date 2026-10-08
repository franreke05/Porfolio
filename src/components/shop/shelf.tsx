import type { ReactNode } from "react";
import { projectsByCategory, type ProjectCategory } from "@/lib/portfolio";
import { ComicPoster } from "./comic-poster";
import type { ProjectCoverSize } from "./project-cover";

/** The drawn shelf edge the comics stand on. */
export function ShelfBoard({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-3.5 border-2 border-[color:var(--foreground)] bg-[color:var(--surface-elevated)] shadow-[0_7px_0_var(--foreground)] ${className}`}
    />
  );
}

/** "Estantería 01 — Trabajo para clientes" */
export function ShelfLabel({
  id,
  category,
  compact = false,
}: {
  id: string;
  category: ProjectCategory;
  compact?: boolean;
}) {
  if (compact) {
    // Fixed two-line block so covers on neighbouring shelves share a top edge.
    return (
      <h2 id={id}>
        <span className="label-mono block text-[color:var(--muted)]">
          Estantería {category.ordinal}
          <span className="sr-only">: </span>
        </span>
        <span className="mt-1 block min-h-12 font-comic text-[1.375rem] uppercase leading-6 tracking-[0.03em]">
          {category.label}
        </span>
      </h2>
    );
  }

  return (
    <h2 id={id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="label-mono text-[color:var(--muted)]">
        Estantería {category.ordinal}
        <span className="sr-only">: </span>
      </span>
      <span className="font-comic text-[1.75rem] uppercase leading-none tracking-[0.03em] sm:text-4xl">
        {category.label}
      </span>
    </h2>
  );
}

type ShelfProps = {
  category: ProjectCategory;
  size: ProjectCoverSize;
  /** Compact shelves (home) drop the descriptor and keep labels on one line. */
  compact?: boolean;
  /** Shows each comic's pitch; single-comic shelves put it beside the cover. */
  detailed?: boolean;
  /** Extra shelf slots after the comics (each rendered as a list item). */
  children?: ReactNode;
  className?: string;
};

/**
 * One category as a shelf of comics. Two columns on mobile (one for the large
 * client covers), then one column per comic.
 */
export function Shelf({ category, size, compact = false, detailed = false, children, className = "" }: ShelfProps) {
  const projects = projectsByCategory(category.id);
  const id = `estanteria-${category.id}`;
  const single = detailed && projects.length === 1;

  const columns = single
    ? "grid-cols-1"
    : size === "lg"
      ? "max-w-[52rem] grid-cols-1 sm:grid-cols-2"
      : compact
        ? projects.length > 1
          ? "grid-cols-2"
          : "grid-cols-1"
        : "grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(14rem,17rem))]";

  return (
    <section aria-labelledby={id} className={`flex flex-col ${className}`}>
      <ShelfLabel id={id} category={category} compact={compact} />
      {compact ? null : (
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-6 text-[color:var(--surface-foreground)]">
          {category.descriptor}
        </p>
      )}
      <ul className={`mt-6 grid flex-1 gap-x-5 gap-y-10 sm:gap-x-8 ${columns}`}>
        {projects.map((project) => (
          <li key={project.slug}>
            <ComicPoster
              slug={project.slug}
              size={size}
              layout={single ? "side" : "stack"}
              withPitch={detailed}
            />
          </li>
        ))}
        {children}
      </ul>
      <ShelfBoard className="mt-5" />
    </section>
  );
}
