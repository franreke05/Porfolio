import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Code2, Download } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { MastheadBio } from "@/components/masthead-bio";
import { MotionSection } from "@/components/motion-section";
import { ProcessTimeline } from "@/components/process-timeline";
import { SpecimenIndex } from "@/components/specimen-index";
import { experienceItems, siteProfile, stackGroups } from "@/lib/site-data";
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
            <li className="text-[color:var(--foreground)]" aria-current="page">Sobre mí</li>
          </ol>
        </nav>

        {/* ── Masthead + bio ── */}
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <MotionSection as="div" className="mx-auto w-full max-w-xs lg:mx-0">
            <MastheadBio
              name={siteProfile.name}
              role={siteProfile.role}
              location={siteProfile.location}
              status="Disponible"
              contactHref="/#contacto"
            />
          </MotionSection>

          <MotionSection as="div" delay={0.06} className="max-w-3xl">
            <p className="section-eyebrow mb-4">Sobre mí</p>
            <h1 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
              Perfil técnico con base mobile y foco en herramientas que sí se usan.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]">
              {siteProfile.shortBio}
            </p>
            <blockquote className="mt-5 border-l-4 border-[color:var(--primary)] bg-[color:var(--surface)] p-4 text-base leading-7 text-[color:var(--foreground)]">
              {siteProfile.authority}
            </blockquote>

            <div className="mt-7 flex flex-wrap gap-3">
              <ExternalLink href={siteProfile.links.cv} icon={Download} label="Descargar CV" />
              <ExternalLink href={siteProfile.links.linkedin} icon={BriefcaseBusiness} label="LinkedIn" external />
              <ExternalLink href={siteProfile.links.github} icon={Code2} label="GitHub" external />
            </div>

            {/* Experience — hairline-divided rows, no card-in-card nesting */}
            <div className="mt-10 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]">
              <h2 className="border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--muted)]">
                Experiencia
              </h2>
              <div className="divide-y divide-[color:var(--border)]">
                {experienceItems.map((item) => (
                  <article key={item.company} className="px-5 py-5">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--primary)]">
                      {item.company}
                    </p>
                    <h3 className="mt-1 font-display font-semibold text-[color:var(--foreground)]">{item.role}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </MotionSection>
        </div>

        {/* ── Stack — specimen index ── */}
        <section className="mt-20">
          <p className="section-eyebrow mb-4">Stack</p>
          <h2 className="mb-8 max-w-2xl text-balance font-display text-2xl font-bold leading-tight text-[color:var(--foreground)] sm:text-3xl">
            Herramientas que uso en producción, no una lista de aspiraciones.
          </h2>
          <MotionSection as="div">
            <SpecimenIndex groups={stackGroups} />
          </MotionSection>
        </section>

        {/* ── Cómo trabajo — process timeline ── */}
        <section className="mt-20">
          <p className="section-eyebrow mb-4">Cómo trabajo</p>
          <h2 className="mb-8 max-w-2xl text-balance font-display text-2xl font-bold leading-tight text-[color:var(--foreground)] sm:text-3xl">
            De la idea difusa al sistema publicado, en cuatro fases claras.
          </h2>
          <ProcessTimeline />
        </section>

        {/* CTA */}
        <div className="mt-20 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-6 py-10 text-center">
          <p className="section-eyebrow mb-3 justify-center">¿Hablamos?</p>
          <h2 className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            Cuéntame tu proyecto
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-[color:var(--muted)]">
            Sin precios cerrados ni presión de venta — solo una conversación para entender qué necesitas.
          </p>
          <Link
            href="/#contacto"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-6 text-sm font-semibold text-[color:var(--on-primary)] transition-colors hover:bg-[color:var(--primary-hover)]"
          >
            Agendar llamada
          </Link>
        </div>
      </div>
    </>
  );
}

function ExternalLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: typeof Download;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
