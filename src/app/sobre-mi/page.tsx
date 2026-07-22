import type { Metadata } from "next";
import Link from "next/link";
import { AboutDossierExperience } from "@/components/about-dossier-experience";
import { JsonLd } from "@/components/json-ld";
import { experienceItems, processSteps, siteProfile, stackGroups } from "@/lib/site-data";
import { SITE_NAME, SITE_URL, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Francisco Requena Sánchez — desarrollador freelance en Almería especializado en apps Android con Kotlin Multiplatform, CRMs a medida y webs con Next.js. Experiencia, stack y forma de trabajar.",
  alternates: { canonical: canonical("/sobre-mi") },
  openGraph: {
    title: `Sobre mí | ${SITE_NAME}`,
    description: "Perfil técnico, experiencia real y proceso de trabajo de Francisco Requena Sánchez.",
    url: `${SITE_URL}/sobre-mi`,
    type: "profile",
  },
  twitter: {
    title: `Sobre mí | ${SITE_NAME}`,
    description: "Perfil técnico, experiencia y stack de un desarrollador freelance en Almería.",
  },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Sobre mí", item: `${SITE_URL}/sobre-mi` },
  ],
};

export default function SobreMiPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumbSchema]} />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <li>
              <Link href="/" className="hover:text-[color:var(--foreground)] transition">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="text-[color:var(--border-hover)]">/</li>
            <li className="text-[color:var(--foreground)]" aria-current="page">Sobre mí</li>
          </ol>
        </nav>

        <header className="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.75fr] lg:items-end lg:gap-14">
          <div>
            <p className="section-eyebrow mb-4">El autor</p>
            <h1 className="max-w-[15ch] text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight text-[color:var(--foreground)] sm:text-5xl xl:text-6xl">
              Código con criterio, no capas de complejidad.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] lg:pb-1">
            Perfil, experiencia, stack y forma de trabajar en un recorrido breve. La base es mobile; el objetivo siempre es entregar una herramienta clara y mantenible.
          </p>
        </header>

        <AboutDossierExperience
          profile={siteProfile}
          experience={experienceItems}
          stack={stackGroups}
          process={processSteps}
          portraitSrc="/images/francisco-requena-portrait.jpeg"
        />
      </div>
    </>
  );
}
