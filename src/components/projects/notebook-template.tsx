import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioProject, WorkStatus } from "@/lib/portfolio";
import { CategoryLabel, ProjectCrumbs } from "./project-header";
import { ProjectCta } from "./project-cta";
import { ScopeLedger } from "./scope-ledger";
import { Block, shell } from "./shared";
import { StackList } from "./stack-list";

type MarginNote = { kicker: string; text: string; status?: WorkStatus };

/** Margin notes come only from catalogue facts: platforms/audience, proof, planned scope. */
function marginNotes(project: PortfolioProject): MarginNote[][] {
  const count = project.story.length;
  const notes: MarginNote[][] = project.story.map(() => []);
  if (count === 0) return notes;

  notes[0].push(
    { kicker: "Plataformas", text: project.platforms.join(" · ") },
    { kicker: "Stack", text: project.stack.join(" · ") },
  );

  const middle = count > 2 ? count - 2 : 1;
  project.proof.forEach((text, index) => {
    const target = count > 2 ? 1 + (index % middle) : 0;
    notes[target].push({ kicker: `Prueba ${index + 1}`, text });
  });

  project.scope
    .filter((item) => item.status === "planned")
    .forEach((item) => {
      notes[count - 1].push({ kicker: item.area, text: item.label, status: item.status });
    });

  return notes;
}

/** "Cuaderno": narrow essay measure with a mono margin column. */
export function NotebookTemplate({ project }: { project: PortfolioProject }) {
  const notes = marginNotes(project);
  const method = project.story[1];

  const decisions: Array<{ decision: string; why: string }> = [
    { decision: project.solution, why: project.problem },
    ...(method?.body[1] ? [{ decision: method.body[1], why: project.proof[0] }] : []),
    ...(method?.body[0] ? [{ decision: method.body[0], why: project.proof[1] }] : []),
  ];

  return (
    <article>
      <ProjectCrumbs project={project} />

      <header className={`${shell} grid gap-x-8 gap-y-6 pb-10 pt-6 lg:grid-cols-12 lg:pb-14 lg:pt-10`}>
        <div className="flex flex-col gap-3 lg:col-span-3 lg:pt-3">
          <CategoryLabel project={project} className="text-muted" />
          <StatusBadge status={project.status} note={project.statusNote} />
          <p className="font-mono text-xs leading-relaxed text-muted">{project.relation}</p>
        </div>
        <div className="lg:col-span-7">
          <h1 className="font-display text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-none tracking-tight text-foreground">
            {project.name}
          </h1>
          <p className="mt-3 font-display text-2xl italic leading-snug text-[color:var(--surface-foreground)]">
            {project.descriptor}
          </p>
          <p className="mt-6 text-pretty font-display text-[1.375rem] leading-[1.4] text-foreground sm:text-2xl sm:leading-[1.4]">
            {project.pitch}
          </p>
          <p className="mt-6 border-l-2 border-foreground pl-4 text-base leading-relaxed text-foreground">
            <strong>iOS no está verificado.</strong> El código está escrito, pero no se compiló durante
            la auditoría: figura como pendiente.
          </p>
        </div>
      </header>

      <div className={shell}>
        {project.story.map((section, index) => (
          <section
            key={section.eyebrow}
            className="grid gap-x-8 gap-y-6 border-t border-[color:var(--border)] py-10 first:border-t-2 first:border-foreground lg:grid-cols-12 lg:py-14"
          >
            <div className="lg:col-span-7 lg:col-start-4">
              <p className="label-mono text-muted">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")} — </span>
                {section.eyebrow}
              </p>
              <h2 className="mt-3 text-balance font-display text-[1.75rem] font-semibold leading-[1.14] tracking-tight text-foreground sm:text-[2.25rem]">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-[1.125rem] leading-[1.7] text-[color:var(--surface-foreground)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {notes[index].length > 0 ? (
              <aside
                aria-label={`Notas al margen: ${section.eyebrow}`}
                className="space-y-5 border-l border-foreground pl-4 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-6 lg:pt-1"
              >
                {notes[index].map((note) => (
                  <div key={note.text}>
                    <p className="label-mono text-muted">{note.kicker}</p>
                    <p className="mt-1.5 font-mono text-xs leading-relaxed text-foreground">{note.text}</p>
                    {note.status ? <StatusBadge status={note.status} className="mt-2" /> : null}
                  </div>
                ))}
              </aside>
            ) : null}
          </section>
        ))}
      </div>

      <div className={`${shell} pb-8`}>
        <section
          aria-labelledby="decisiones"
          className="ledger-rule grid gap-x-8 gap-y-6 py-10 lg:grid-cols-12 lg:py-14"
        >
          <div className="lg:col-span-3">
            <p className="label-mono text-muted">Cuaderno</p>
            <h2
              id="decisiones"
              className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
            >
              Decisión → por qué
            </h2>
          </div>
          <ol className="lg:col-span-9">
            {decisions.map((row, index) => (
              <li
                key={row.decision}
                className="grid gap-x-8 gap-y-2 border-b border-[color:var(--border)] py-5 first:pt-0 md:grid-cols-2"
              >
                <div>
                  <p className="label-mono text-muted">Decisión {index + 1}</p>
                  <p className="mt-1.5 text-base font-medium leading-relaxed text-foreground">{row.decision}</p>
                </div>
                <div>
                  <p className="label-mono text-muted">
                    <span aria-hidden="true">→ </span>
                    {index === 0 ? "Por qué" : "Qué dejó"}
                  </p>
                  <p className="mt-1.5 text-base leading-relaxed text-[color:var(--surface-foreground)]">
                    {row.why}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Block id="alcance" label="Libro de alcance" title="Qué está hecho y qué falta">
          <ScopeLedger scope={project.scope} />
        </Block>

        <Block id="stack" label="Stack" title="Con qué está construido">
          <StackList stack={project.stack} />
        </Block>

        <ProjectCta
          project={project}
          title="¿Quieres que tu app pase por el mismo proceso?"
          note="Cuéntanos qué tienes construido y te decimos con franqueza por dónde empezaríamos."
        />
      </div>
    </article>
  );
}
