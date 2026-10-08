import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/projects/breadcrumb";
import { primaryButton } from "@/components/projects/project-cta";
import { shell } from "@/components/projects/shared";
import { PUBLISH_OFFER, PublishSlot } from "@/components/shop/publish-slot";
import { Shelf } from "@/components/shop/shelf";
import { contactHref, portfolioProjects, projectCategories } from "@/lib/portfolio";
import { PROJECTS_DESCRIPTION, buildMetadata, projectsIndexJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Proyectos",
  description: PROJECTS_DESCRIPTION,
  path: "/proyectos",
});

/** "La cartelera": every project as a comic, on five shelves in the fixed order. */
export default function ProyectosPage() {
  return (
    <>
      <JsonLd schemas={projectsIndexJsonLd} />
      <div className={`${shell} pb-10 pt-24 lg:pb-14`}>
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Proyectos" }]} />
        <header className="mt-6 grid gap-x-8 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label-mono text-muted">Proyectos del estudio</p>
            <h1 className="mt-3 font-display text-[clamp(3rem,9vw,6rem)] font-semibold leading-[0.92] tracking-tight text-foreground">
              La cartelera
            </h1>
          </div>
          <p className="max-w-[48ch] text-lg leading-relaxed text-[color:var(--surface-foreground)] lg:col-span-5">
            {portfolioProjects.length} proyectos en cinco estanterías: primero el trabajo para clientes, al
            final lo académico. Cada uno se puede leer como cómic o consultar como ficha profesional,
            con su estado real: implementado, en desarrollo o previsto.
          </p>
        </header>
      </div>

      <div className={`${shell} grid gap-y-16 pb-16 lg:gap-y-20 lg:pb-24`}>
        {projectCategories.map((category) => (
          <Shelf
            key={category.id}
            category={category}
            size={category.id === "client-work" ? "lg" : "md"}
            detailed
          />
        ))}
      </div>

      <section
        aria-labelledby="cta-proyectos"
        className="border-t-2 border-foreground bg-[color:var(--surface)]"
      >
        <div
          className={`${shell} grid items-center gap-x-12 gap-y-8 py-14 sm:grid-cols-[11rem_minmax(0,1fr)] lg:py-20`}
        >
          <PublishSlot className="mx-auto max-w-[11rem] rotate-2" />
          <div>
            <h2
              id="cta-proyectos"
              className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
            >
              ¿Publicamos el tuyo?
            </h2>
            <p className="mt-3 max-w-[48ch] text-lg font-semibold leading-relaxed">{PUBLISH_OFFER}</p>
            <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-[color:var(--surface-foreground)]">
              Cuéntanos qué quieres construir y te decimos con franqueza cómo lo abordaríamos.
            </p>
            <Link href={contactHref("general")} className={`${primaryButton} mt-6`}>
              Encarga tu cómic
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
