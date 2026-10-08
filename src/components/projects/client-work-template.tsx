import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioProject } from "@/lib/portfolio";
import { DeliveryTrack } from "./delivery-track";
import { CategoryLabel, ProjectCrumbs } from "./project-header";
import { ProjectCta, RelatedProjects } from "./project-cta";
import styles from "./projects.module.css";
import { RouteMotif } from "./route-motif";
import { ScopeLedger } from "./scope-ledger";
import { Block, shell } from "./shared";
import { ProofList, StackList } from "./stack-list";
import { StorySections } from "./story-sections";

/** "Hoja de obra": ink-inverted job sheet for client work. */
export function ClientWorkTemplate({ project }: { project: PortfolioProject }) {
  const withRoute = project.slug === "caravantruck-way";

  return (
    <article>
      <ProjectCrumbs project={project} />

      <header className="on-ink bg-[color:var(--ink-bg)] text-[color:var(--ink-fg)]">
        <div className={`${shell} pb-12 pt-10 lg:pb-16 lg:pt-14`}>
          <div className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <CategoryLabel project={project} className={styles.inkMuted} />
              <h1 className="mt-4 text-balance font-display text-[clamp(2.75rem,8.5vw,5.75rem)] font-semibold leading-[0.95] tracking-tight">
                {project.name}
              </h1>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-[1.75rem]">
                {project.descriptor}
              </p>
              <p className={`mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed ${styles.inkMuted}`}>
                {project.pitch}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:col-span-5">
              {withRoute ? <RouteMotif className="h-auto w-full max-w-[26rem] lg:ml-auto" /> : null}
              <dl className={`border-t border-[color:var(--ink-rule)] ${withRoute ? "" : "lg:mt-10"}`}>
                <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--ink-rule)] py-3">
                  <dt className={`label-mono pt-0.5 ${styles.inkMuted}`}>Estado</dt>
                  <dd>
                    <StatusBadge
                      status={project.status}
                      note={project.statusNote}
                      className="!flex-wrap !whitespace-normal"
                    />
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--ink-rule)] py-3">
                  <dt className={`label-mono pt-0.5 ${styles.inkMuted}`}>Relación</dt>
                  <dd className="text-[0.9375rem] leading-snug">{project.relation}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--ink-rule)] py-3">
                  <dt className={`label-mono pt-0.5 ${styles.inkMuted}`}>Plataformas</dt>
                  <dd className="font-mono text-[0.8125rem] leading-relaxed">
                    {project.platforms.join(" · ")}
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--ink-rule)] py-3">
                  <dt className={`label-mono pt-0.5 ${styles.inkMuted}`}>Para quién</dt>
                  <dd className="text-[0.9375rem] leading-snug">{project.audience}</dd>
                </div>
              </dl>
            </div>
          </div>

          {project.delivery ? (
            <section aria-labelledby="entrega" className="ledger-rule mt-12 pt-6 lg:mt-16">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 id="entrega" className="font-display text-2xl font-semibold tracking-tight">
                  Seguimiento de entrega
                </h2>
                <p className={`label-mono ${styles.inkMuted}`}>
                  {project.delivery.length} fases · de alcance a entrega
                </p>
              </div>
              <DeliveryTrack phases={project.delivery} tone="ink" />
            </section>
          ) : null}
        </div>
      </header>

      <div className={`${shell} pb-8 pt-12 lg:pt-16`}>
        <StorySections story={project.story} />

        <div className="mt-6 lg:mt-10">
          <Block id="alcance" label="Libro de alcance" title="Qué está hecho y qué falta">
            <ScopeLedger scope={project.scope} />
          </Block>

          <Block id="pruebas" label="Método" title="Cómo lo comprobamos">
            <ProofList proof={project.proof} />
          </Block>

          <Block id="stack" label="Stack" title="Con qué está construido">
            <StackList stack={project.stack} />
          </Block>

          {project.related?.length ? (
            <Block id="relacionado" label="Mismo ecosistema" title="Proyecto relacionado">
              <RelatedProjects project={project} />
            </Block>
          ) : null}

          <ProjectCta project={project} />
        </div>
      </div>
    </article>
  );
}
