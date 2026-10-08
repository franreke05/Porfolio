import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioProject } from "@/lib/portfolio";
import { ArchitectureDiagram } from "./architecture-diagram";
import { CategoryLabel, ProjectCrumbs } from "./project-header";
import { ProjectCta, RelatedProjects } from "./project-cta";
import styles from "./projects.module.css";
import { ScopeLedger } from "./scope-ledger";
import { Block, shell } from "./shared";
import { ProofList, StackList } from "./stack-list";
import { StorySections } from "./story-sections";

/** "Plano": dot-grid drawing sheet with a title block and an annotated diagram. */
export function BlueprintTemplate({ project }: { project: PortfolioProject }) {
  return (
    <article>
      <ProjectCrumbs project={project} />

      <div className={`${styles.dotgrid} border-y-2 border-foreground`}>
        <div className={`${shell} py-8 lg:py-12`}>
          {/* Title block ("cajetín") */}
          <header className="grid border-[1.5px] border-foreground bg-background lg:grid-cols-12">
            <div className="p-5 sm:p-7 lg:col-span-8">
              <CategoryLabel project={project} className="text-muted" />
              <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,5rem)] font-semibold leading-[0.95] tracking-tight text-foreground">
                {project.name}
              </h1>
              <p className="mt-3 font-display text-xl leading-snug text-foreground sm:text-2xl">
                {project.descriptor}
              </p>
              <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[color:var(--surface-foreground)]">
                {project.pitch}
              </p>
            </div>
            <dl className="border-t-[1.5px] border-foreground lg:col-span-4 lg:border-l-[1.5px] lg:border-t-0">
              <div className="border-b border-[color:var(--border)] px-5 py-3.5 sm:px-6">
                <dt className="label-mono text-muted">Estado</dt>
                <dd className="mt-1.5">
                  <StatusBadge status={project.status} note={project.statusNote} />
                </dd>
              </div>
              <div className="border-b border-[color:var(--border)] px-5 py-3.5 sm:px-6">
                <dt className="label-mono text-muted">Tipo</dt>
                <dd className="mt-1.5 text-[0.9375rem] font-medium leading-snug text-foreground">
                  Herramienta vertical, hecha para una sola operación. No es un CRM genérico.
                </dd>
              </div>
              <div className="border-b border-[color:var(--border)] px-5 py-3.5 sm:px-6">
                <dt className="label-mono text-muted">Relación</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-snug text-foreground">{project.relation}</dd>
              </div>
              <div className="px-5 py-3.5 sm:px-6">
                <dt className="label-mono text-muted">Plataformas</dt>
                <dd className="mt-1.5 font-mono text-[0.8125rem] text-foreground">
                  {project.platforms.join(" · ")}
                </dd>
              </div>
            </dl>
          </header>

          <div className="mt-10 lg:mt-14">
            <p className="label-mono mb-6 text-foreground">Plano 01 — Quién habla con quién</p>
            <ArchitectureDiagram />
          </div>
        </div>
      </div>

      <div className={`${shell} pb-8 pt-12 lg:pt-16`}>
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

          {project.related?.length ? (
            <Block id="relacionado" label="Mismo ecosistema" title="La app a la que da servicio">
              <RelatedProjects project={project} />
            </Block>
          ) : null}

          <ProjectCta
            project={project}
            title="¿Tu operación necesita su propia herramienta?"
            note="Cuéntanos cómo trabajáis hoy y te decimos con franqueza qué construiríamos y qué no."
          />
        </div>
      </div>
    </article>
  );
}
