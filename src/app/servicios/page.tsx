import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Servicios de desarrollo digital",
  description:
    "Apps Android con Kotlin, CRMs a medida con PostgreSQL, webs profesionales con Next.js y automatizaciones para pymes. Desarrollo freelance en España.",
  alternates: {
    canonical: canonical("/servicios"),
  },
  openGraph: {
    title: `Servicios de desarrollo digital | ${SITE_NAME}`,
    description:
      "Apps Android, CRMs a medida, webs profesionales y automatizaciones para pymes. Freelance disponible en remoto.",
    url: `${SITE_URL}/servicios`,
    type: "website",
  },
  twitter: {
    title: `Servicios | ${SITE_NAME}`,
    description:
      "Apps Android, CRMs, webs y automatizaciones para pymes. Freelance en España.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const serviciosIndexSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Servicios",
      item: `${SITE_URL}/servicios`,
    },
  ],
};

const services = [
  {
    href: "/servicios/desarrollo-apps-android",
    code: "AP",
    title: "Desarrollo de apps Android",
    tagline: "Kotlin, Jetpack Compose y KMP",
    description:
      "Apps Android nativas con arquitectura MVVM, integración de Firebase y publicación en Google Play Store. Código tuyo desde el primer commit.",
  },
  {
    href: "/servicios/crm-a-medida",
    code: "CR",
    title: "CRM a medida",
    tagline: "PostgreSQL, roles y flujos personalizados",
    description:
      "Sistemas internos diseñados para tu proceso, no para el promedio. Sin licencias mensuales, sin funcionalidades que nunca vas a usar.",
  },
  {
    href: "/servicios/diseno-web-empresas",
    code: "WB",
    title: "Diseño web para empresas",
    tagline: "Next.js, SEO técnico y rendimiento",
    description:
      "Webs profesionales que cargan rápido, posicionan bien y convierten visitas en contactos. Adaptadas a tu negocio, no a una plantilla.",
  },
  {
    href: "/servicios/automatizaciones-pymes",
    code: "AU",
    title: "Automatizaciones para pymes",
    tagline: "Menos tareas repetitivas, más tiempo útil",
    description:
      "Integraciones entre herramientas, formularios automáticos, notificaciones y reportes que se generan solos. Tu equipo enfocado en lo que importa.",
  },
] as const;

export default function ServiciosPage() {
  return (
    <>
      <JsonLd schemas={[serviciosIndexSchema]} />

      <div className="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <li>
              <Link
                href="/"
                className="hover:text-[color:var(--foreground)] transition"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="text-[color:var(--border-hover)]">
              /
            </li>
            <li
              className="text-[color:var(--foreground)]"
              aria-current="page"
            >
              Servicios
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="section-eyebrow mb-4">Lo que construyo</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Servicios de desarrollo digital
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Trabajo con empresas y autónomos que necesitan sistemas digitales
            reales: apps que funcionan, paneles que se usan y webs que generan
            contactos. Sin intermediarios, sin equipos inflados, sin promesas
            genéricas.
          </p>
        </header>

        {/* Service grid */}
        <section aria-label="Listado de servicios">
          <ul className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] font-mono text-sm font-bold text-[color:var(--primary)]">
                      {service.code}
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--muted)] transition group-hover:text-[color:var(--accent-cyan)]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-semibold text-[color:var(--foreground)]">
                      {service.title}
                    </p>
                    <p className="font-mono text-xs text-[color:var(--accent-cyan)]">
                      {service.tagline}
                    </p>
                  </div>
                  <p className="mt-auto text-sm leading-6 text-[color:var(--muted)]">
                    {service.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-10 text-center">
          <p className="section-eyebrow mb-3 justify-center">¿Hablamos?</p>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Cuéntame tu proyecto en una llamada de 30 minutos. Sin compromiso,
            sin presión de venta. Solo escucho y te digo si puedo ayudarte.
          </p>
          <Link
            href="/#contacto"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] px-6 text-sm font-semibold text-[color:var(--on-primary)] transition hover:bg-[color:var(--primary-hover)]"
          >
            Agendar llamada
          </Link>
        </div>
      </div>
    </>
  );
}
