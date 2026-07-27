import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ComicCover } from "@/components/comic-cover";
import { MagneticButton } from "@/components/magnetic-button";
import { caseStudies } from "@/lib/case-studies";
import { projectStatusAccent, projectStatusWord, projects } from "@/lib/site-data";
import { SITE_NAME, SITE_URL, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Los 4 proyectos reales que sostengo como desarrollador: EduTrack, FlashFix, OposiControl y OryKai. Apps Android y sistemas Kotlin Multiplatform, con su estado honesto — beta, MVP o en desarrollo.",
  alternates: { canonical: canonical("/proyectos") },
  openGraph: {
    title: `Proyectos | ${SITE_NAME}`,
    description: "EduTrack, FlashFix, OposiControl y OryKai — 4 proyectos reales, con su estado honesto.",
    url: `${SITE_URL}/proyectos`,
    type: "website",
  },
  twitter: {
    title: `Proyectos | ${SITE_NAME}`,
    description: "4 proyectos reales, con su estado honesto — nada inventado.",
  },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos", item: `${SITE_URL}/proyectos` },
  ],
};

export default function ProyectosPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumbSchema]} />

      <div className="w-full px-5 pb-24 pt-28 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <li>
              <Link href="/" className="hover:text-[color:var(--foreground)] transition">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="text-[color:var(--border-hover)]">/</li>
            <li className="text-[color:var(--foreground)]" aria-current="page">Proyectos</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-16 max-w-2xl">
          <p className="section-eyebrow mb-4">El archivo</p>
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Cuatro proyectos reales. Cuatro sistemas en marcha.
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-[color:var(--muted)]">
            Nada de maquetas ni capturas retocadas: cada número de este
            archivo es una app Android o un sistema Kotlin Multiplatform
            real, con su estado exacto de hoy — beta pública, MVP o en
            desarrollo activo.
          </p>
        </header>

        {/* Comic-cover gallery — the one panel-gutter moment sitewide */}
        <section
          aria-label="Colección de proyectos"
          className="grid gap-8 border-2 border-[color:var(--foreground)] bg-[color:var(--background)] p-4 sm:grid-cols-2 sm:gap-10 sm:p-8 xl:grid-cols-4"
        >
          {projects.map((project, index) => {
            const study = caseStudies[project.caseStudySlug ?? project.id];
            const techStack = project.stack.slice(0, 2).join(" · ").toUpperCase();

            return (
              <Link
                key={project.id}
                href={`/proyectos/${project.caseStudySlug ?? project.id}`}
                className="group block transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--background)]"
                aria-label={`Ver caso completo: ${project.title}`}
              >
                <ComicCover
                  mode="gallery"
                  issueNumber={index + 1}
                  title={project.title}
                  tagline={study?.tagline ?? project.projectType}
                  techStack={techStack}
                  statusWord={projectStatusWord[project.status]}
                  statusAccent={projectStatusAccent[project.status]}
                  coverSrc={project.coverSrc}
                  coverAlt={project.coverAlt}
                  coverPosition={project.coverPosition}
                  coverFit={project.coverFit}
                  className="transition-shadow duration-300 group-hover:shadow-[6px_6px_0_0_var(--foreground)]"
                />
              </Link>
            );
          })}
        </section>

        {/* CTA */}
        <div className="mt-16 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-6 py-10 text-center">
          <p className="section-eyebrow mb-3 justify-center">¿Un proyecto en mente?</p>
          <h2 className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            Hablemos de lo que necesitas construir
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-[color:var(--muted)]">
            Si tienes una idea, un problema de gestión o una app en mente, puedo
            proponerte un camino claro desde el primer mensaje.
          </p>
          <div className="mt-6">
            <MagneticButton href="/#contacto" rounded="none">
              Agendar llamada
            </MagneticButton>
          </div>
        </div>
      </div>
    </>
  );
}
