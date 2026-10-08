import { LedgerSection, TextLink } from "@/components/services-tablet-experience";
import { SpecimenIndex } from "@/components/specimen-index";
import { StatusBadge } from "@/components/ui/status-badge";
import { projectCategories, projectHref, projectsByCategory } from "@/lib/portfolio";
import { experienceItems, services, siteProfile, stackGroups } from "@/lib/site-data";

/**
 * The studio page body (/sobre-mi): who we are, what we build with and the
 * proof order from the catalogue. Server-rendered, no tabs. The founder and
 * the four-step method live in the profile block above it
 * (src/app/sobre-mi/founder-profile.tsx).
 */
export function AboutDossierExperience() {
  return (
    <>
      <LedgerSection id="quienes-somos" label="El estudio" title="Quiénes somos">
        <div>
          <div className="max-w-2xl space-y-4 leading-7 text-[color:var(--surface-foreground)]">
            <p className="text-lg leading-relaxed text-[color:var(--foreground)]">{siteProfile.shortBio}</p>
            <p>
              Ser pocos es una decisión: quien define el alcance contigo es quien diseña y escribe el código. No hay
              intermediarios entre lo que necesitas y lo que se construye.
            </p>
            <p>{siteProfile.authority}</p>
            <p>
              Trabajamos en tres frentes:{" "}
              {services.map((service, index) => (
                <span key={service.id}>
                  <TextLink href={service.href}>{service.title.toLowerCase()}</TextLink>
                  {index < services.length - 2 ? ", " : index === services.length - 2 ? " y " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </LedgerSection>

      <LedgerSection
        id="con-que-construimos"
        label="Stack"
        title="Con qué construimos"
        intro="Solo lo que aparece en los proyectos que enseñamos o en este mismo sitio."
      >
        <SpecimenIndex groups={stackGroups} />
      </LedgerSection>

      <LedgerSection
        id="que-puedes-ver"
        label="Prueba"
        title="Qué puedes ver"
        intro="En este orden: primero el trabajo para clientes, al final lo académico. Cada proyecto con su estado real."
      >
        <ol className="border-b border-[color:var(--border)]">
          {projectCategories.map((category) => (
            <li
              key={category.id}
              className="grid gap-x-8 gap-y-3 border-t border-[color:var(--border)] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
            >
              <div>
                <h3 className="font-semibold text-[color:var(--foreground)]">
                  <span className="mr-2 font-mono text-xs font-bold text-[color:var(--muted)]" aria-hidden="true">
                    {category.ordinal}
                  </span>
                  {category.label}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{category.descriptor}</p>
              </div>
              <ul className="space-y-3">
                {projectsByCategory(category.id).map((project) => (
                  <li key={project.slug} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <TextLink href={projectHref(project.slug)}>{project.name}</TextLink>
                    <StatusBadge status={project.status} label={project.category === "academic" ? project.statusNote : undefined} />
                    <span className="basis-full text-sm text-[color:var(--muted)]">{project.descriptor}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </LedgerSection>

      <LedgerSection
        id="trayectoria"
        label="Antes del estudio"
        title="De dónde viene quien lo dirige"
        intro="Trayectoria personal de Francisco Requena. No es historial del estudio."
      >
        <ul className="border-b border-[color:var(--border)]">
          {experienceItems.map((item) => (
            <li
              key={item.company}
              className="grid gap-x-8 gap-y-1 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
            >
              <p className="label-mono pt-1 text-[color:var(--muted)]">{item.company}</p>
              <div>
                <h3 className="font-semibold text-[color:var(--foreground)]">{item.role}</h3>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-[color:var(--muted)]">
          <a
            href={siteProfile.links.cv}
            className="underline decoration-[color:var(--border-hover)] underline-offset-4 transition-colors hover:text-[color:var(--foreground)]"
          >
            Currículum de Francisco Requena (PDF)
          </a>
        </p>
      </LedgerSection>
    </>
  );
}
