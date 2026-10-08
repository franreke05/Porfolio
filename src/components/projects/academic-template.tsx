import Image from "next/image";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioProject } from "@/lib/portfolio";
import loginScreen from "../../../capturas-flashfix/01-login.png";
import requestedTrackerScreen from "../../../capturas-flashfix/03-tracker-solicitado.png";
import workshopRequestsScreen from "../../../capturas-flashfix/04-taller-solicitudes-y-chats.png";
import chatScreen from "../../../capturas-flashfix/06-chat.png";
import { CategoryLabel, ProjectCrumbs } from "./project-header";
import { ProjectCta } from "./project-cta";
import { ScopeLedger } from "./scope-ledger";
import { Block, shell } from "./shared";
import { ProofList, StackList } from "./stack-list";
import { StorySections } from "./story-sections";

const screens = [
  {
    image: loginScreen,
    role: "Acceso",
    alt: "Captura real de FlashFix: pantalla de bienvenida con el logotipo y el formulario de inicio de sesión",
  },
  {
    image: requestedTrackerScreen,
    role: "Conductor",
    alt: "Captura real de FlashFix: seguimiento de una solicitud con los pasos Solicitado, Aceptado, En reparación y Completado",
  },
  {
    image: workshopRequestsScreen,
    role: "Taller",
    alt: "Captura real de FlashFix: panel del taller con una solicitud entrante y los botones Aceptar y Rechazar",
  },
  {
    image: chatScreen,
    role: "Conductor · Taller",
    alt: "Captura real de FlashFix: conversación entre conductor y taller dentro de la aplicación",
  },
];

/** Sober academic sheet: the professional mode of the final-degree project. */
export function AcademicTemplate({ project }: { project: PortfolioProject }) {
  return (
    <article>
      <ProjectCrumbs project={project} />

      <header className={`${shell} grid gap-x-8 gap-y-8 pb-10 pt-6 lg:grid-cols-12 lg:pb-14 lg:pt-10`}>
        <div className="lg:col-span-7">
          <CategoryLabel project={project} className="text-muted" />
          <h1 className="mt-3 font-display text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.95] tracking-tight text-foreground">
            {project.name}
          </h1>
          <p className="label-mono mt-4 !text-[0.8125rem] font-semibold text-foreground">
            Proyecto de fin de grado · sin cliente
          </p>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-[color:var(--surface-foreground)]">
            {project.solution}
          </p>
        </div>
        <dl className="self-end border-t-2 border-foreground lg:col-span-5">
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--border)] py-3">
            <dt className="label-mono pt-0.5 text-muted">Estado</dt>
            <dd>
              <StatusBadge status={project.status} label={project.statusNote} />
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--border)] py-3">
            <dt className="label-mono pt-0.5 text-muted">Relación</dt>
            <dd className="text-[0.9375rem] leading-snug text-foreground">{project.relation}</dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--border)] py-3">
            <dt className="label-mono pt-0.5 text-muted">Plataformas</dt>
            <dd className="font-mono text-[0.8125rem] text-foreground">{project.platforms.join(" · ")}</dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-[color:var(--border)] py-3">
            <dt className="label-mono pt-0.5 text-muted">Para quién</dt>
            <dd className="text-[0.9375rem] leading-snug text-foreground">{project.audience}</dd>
          </div>
        </dl>
      </header>

      <div className={`${shell} pb-8`}>
        <section aria-labelledby="capturas" className="ledger-rule pb-10 pt-6 lg:pb-14">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="capturas" className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Capturas reales
            </h2>
            <p className="label-mono text-muted">App Android · mitad superior de cada pantalla</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {screens.map((screen) => (
              <li key={screen.role}>
                <figure>
                  <Image
                    src={screen.image}
                    alt={screen.alt}
                    sizes="(min-width: 768px) 280px, 45vw"
                    className="aspect-[7/10] w-full border-[1.5px] border-foreground object-cover object-top"
                  />
                  <figcaption className="label-mono mt-2 text-muted">{screen.role}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <StorySections story={project.story} />

        <div className="mt-6 lg:mt-10">
          <Block id="alcance" label="Libro de alcance" title="Qué se construyó">
            <ScopeLedger scope={project.scope} />
          </Block>

          <Block id="pruebas" label="Estado real" title="Lo que se puede comprobar">
            <ProofList proof={project.proof} />
          </Block>

          <Block id="stack" label="Stack" title="Con qué está construido">
            <StackList stack={project.stack} />
          </Block>

          <ProjectCta project={project} />
        </div>
      </div>
    </article>
  );
}
