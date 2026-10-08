import Image from "next/image";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioProject } from "@/lib/portfolio";
import { CategoryLabel, ProjectCrumbs, StageLadder } from "./project-header";
import { ProjectCta } from "./project-cta";
import { ScopeLedger } from "./scope-ledger";
import { Block, shell } from "./shared";
import { ProofList, StackList } from "./stack-list";
import { StorySections } from "./story-sections";

/** "Ficha de producto": typographic poster + ladder + spec table. */
export function ProductTemplate({ project }: { project: PortfolioProject }) {
  const notOpen = project.cta.intent === "requenadesk";

  const spec: Array<[string, string]> = [
    ["Qué resuelve", project.problem],
    ["Qué hace", project.solution],
    ["Para quién", project.audience],
    ["Plataformas", project.platforms.join(" · ")],
    ["Relación", project.relation],
  ];

  return (
    <article>
      <ProjectCrumbs project={project} />

      <header className={`${shell} pb-12 pt-6 lg:pb-16`}>
        <CategoryLabel project={project} className="text-muted" />
        <h1 className="mt-3 font-display text-[clamp(3.25rem,14.5vw,12rem)] font-semibold leading-[0.86] tracking-[-0.035em] text-foreground">
          {project.name}
        </h1>

        <div className="mt-8 grid gap-x-8 gap-y-8 border-t-2 border-foreground pt-6 lg:mt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label-mono text-muted">{project.descriptor}</p>
            <p className="mt-3 max-w-[30ch] text-balance font-display text-[1.75rem] leading-[1.18] text-foreground sm:text-4xl sm:leading-[1.14]">
              {project.pitch}
            </p>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end lg:text-right">
            <StatusBadge
              status={project.status}
              note={project.statusNote}
              className="!flex-wrap !whitespace-normal"
            />
            {notOpen ? (
              <p className="max-w-[34ch] border-l-2 border-foreground pl-4 text-left text-[0.9375rem] leading-snug text-[color:var(--surface-foreground)]">
                Todavía no está disponible para nuevas altas: hoy solo lo usamos nosotros y nuestros
                clientes.
              </p>
            ) : null}
            {project.cover ? (
              <figure className="w-full max-w-[17rem]">
                <div className="relative aspect-[4/3] border-[1.5px] border-foreground bg-surface">
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    fill
                    sizes="272px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="label-mono mt-2 text-left text-muted">
                  Lámina · ilustración de portada
                </figcaption>
              </figure>
            ) : null}
          </div>
        </div>

        <div className="mt-10 lg:mt-14">
          <StageLadder stage={project.stage} />
        </div>
      </header>

      <div className={`${shell} pb-8`}>
        <Block id="ficha" label="Ficha" title="El producto en cinco líneas">
          <dl>
            {spec.map(([term, value]) => (
              <div
                key={term}
                className="grid gap-x-6 gap-y-1 border-b border-[color:var(--border)] py-4 first:pt-0 sm:grid-cols-[9rem_1fr]"
              >
                <dt className="label-mono pt-1 text-muted">{term}</dt>
                <dd className="max-w-[62ch] text-base leading-relaxed text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <StorySections story={project.story} />

        <div className="mt-6 lg:mt-10">
          <Block id="alcance" label="Libro de alcance" title="Qué está hecho y qué falta">
            <ScopeLedger scope={project.scope} />
          </Block>

          <Block id="pruebas" label="Estado real" title="Lo que hay hoy">
            <ProofList proof={project.proof} />
          </Block>

          <Block id="stack" label="Stack" title="Con qué está construido">
            <StackList stack={project.stack} />
          </Block>

          {notOpen ? (
            <ProjectCta
              project={project}
              title={`${project.name} aún no admite nuevas altas.`}
              note="Hoy no se pueden crear cuentas. Déjanos tu contacto y te avisamos cuando lo abramos a otras empresas."
            />
          ) : (
            <ProjectCta project={project} />
          )}
        </div>
      </div>
    </article>
  );
}
