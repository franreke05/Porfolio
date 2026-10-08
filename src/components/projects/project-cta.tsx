import Link from "next/link";
import { contactHref, getProject, projectHref, type PortfolioProject } from "@/lib/portfolio";
import { ArrowLink } from "./shared";

export const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 border-2 border-foreground bg-primary px-6 py-3 text-base font-semibold text-[color:var(--on-primary)] shadow-[var(--shadow-hard)] transition-[transform,box-shadow,background-color] duration-150 hover:bg-[color:var(--primary-hover)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--foreground)] motion-reduce:transition-none";

/** The single primary action of a project page. */
export function ProjectCta({
  project,
  title = "¿Tienes algo parecido entre manos?",
  note = "Cuéntanos qué quieres construir y te decimos con franqueza cómo lo abordaríamos.",
}: {
  project: PortfolioProject;
  title?: string;
  note?: string;
}) {
  return (
    <section
      aria-labelledby="cta-proyecto"
      className="ledger-rule grid gap-x-8 gap-y-6 py-12 lg:grid-cols-12 lg:items-end lg:py-16"
    >
      <div className="lg:col-span-7">
        <p className="label-mono text-muted">Siguiente paso</p>
        <h2
          id="cta-proyecto"
          className="mt-2 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[color:var(--surface-foreground)]">
          {note}
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
        <Link href={contactHref(project.cta.intent)} className={primaryButton}>
          {project.cta.label}
        </Link>
        <ArrowLink href="/proyectos" className="text-sm text-muted hover:text-foreground">
          Ver todos los proyectos
        </ArrowLink>
      </div>
    </section>
  );
}

/** Link row to the related project(s), e.g. OposiBot ↔ OposiControl. */
export function RelatedProjects({ project }: { project: PortfolioProject }) {
  const related = (project.related ?? [])
    .map((slug) => getProject(slug))
    .filter((item): item is PortfolioProject => Boolean(item));

  if (related.length === 0) return null;

  return (
    <ul>
      {related.map((item) => (
        <li key={item.slug}>
          <Link
            href={projectHref(item.slug)}
            className="group flex min-h-11 flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[color:var(--border)] py-4 first:pt-0"
          >
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline">
              {item.name}
            </span>
            <span className="text-[0.9375rem] text-[color:var(--surface-foreground)]">
              {item.descriptor} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
