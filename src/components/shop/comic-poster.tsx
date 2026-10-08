import Link from "next/link";
import { getProject, projectHref } from "@/lib/portfolio";
import { ProjectCover, type ProjectCoverSize } from "./project-cover";

export const comicHref = (slug: string) => `${projectHref(slug)}/comic`;

type ComicPosterProps = {
  slug: string;
  size: ProjectCoverSize;
  /** "side" puts the text next to the cover from `sm` up (single-comic shelves). */
  layout?: "stack" | "side";
  /** Adds the project's pitch under the descriptor. */
  withPitch?: boolean;
  /** Heading level of the comic's name; shelves use h3. */
  as?: "h2" | "h3";
  priority?: boolean;
};

/**
 * A comic on the shelf: cover, name, descriptor and the two ways in —
 * the scroll comic and the professional sheet. Both are real links.
 */
export function ComicPoster({
  slug,
  size,
  layout = "stack",
  withPitch = false,
  as: Heading = "h3",
  priority,
}: ComicPosterProps) {
  const project = getProject(slug);
  if (!project) return null;

  const side = layout === "side";
  const nameSize = size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl";

  return (
    <article
      className={`group/poster flex h-full flex-col ${side ? "sm:flex-row sm:items-end sm:gap-8" : ""}`}
    >
      <div
        className={`w-full transition-transform duration-200 ease-out motion-safe:group-hover/poster:-translate-y-1.5 motion-safe:group-hover/poster:-rotate-1 ${
          side ? "max-w-[17rem] sm:w-[17rem] sm:flex-none" : ""
        }`}
      >
        <div className="shadow-[6px_6px_0_var(--foreground)]">
          <ProjectCover slug={slug} size={size} priority={priority} className="!max-w-none" />
        </div>
      </div>

      <div className={`flex flex-1 flex-col pt-5 ${side ? "sm:max-w-xl sm:pt-0" : ""}`}>
        <Heading className={`${nameSize} font-bold leading-tight`}>{project.name}</Heading>
        <p className="mt-1 text-sm leading-5 text-[color:var(--surface-foreground)]">{project.descriptor}</p>
        {withPitch ? (
          <p className="mt-3 text-pretty text-[0.9375rem] leading-7 text-[color:var(--surface-foreground)]">
            {project.pitch}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3">
          <Link
            href={comicHref(slug)}
            className="inline-flex min-h-11 items-center border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] px-3 text-sm font-semibold text-[color:var(--background)] transition-colors duration-150 hover:bg-[color:var(--primary)]"
          >
            Leer el cómic<span className="sr-only">: {project.name}</span>
          </Link>
          <Link
            href={projectHref(slug)}
            className="inline-flex min-h-11 items-center text-sm font-semibold underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            Ficha profesional<span className="sr-only">: {project.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
