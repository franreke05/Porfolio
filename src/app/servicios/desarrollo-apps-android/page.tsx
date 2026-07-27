import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { AndroidServiceExperience } from "@/components/android-service-experience";
import { ComicCover } from "@/components/comic-cover";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";
import {
  projects,
  projectStatusAccent,
  projectStatusWord,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Desarrollador de apps Android freelance | Kotlin y Jetpack Compose",
  description:
    "Desarrollo apps Android nativas con Kotlin, Jetpack Compose y KMP. Arquitectura MVVM, Firebase y publicación en Play Store. Freelance disponible para proyectos.",
  alternates: {
    canonical: canonical("/servicios/desarrollo-apps-android"),
  },
  openGraph: {
    title: `Desarrollador de apps Android freelance | ${SITE_NAME}`,
    description:
      "Apps Android nativas con Kotlin, Jetpack Compose y KMP. Arquitectura MVVM, Firebase y publicación en Play Store.",
    url: `${SITE_URL}/servicios/desarrollo-apps-android`,
    type: "website",
  },
  twitter: {
    title: `Apps Android con Kotlin | ${SITE_NAME}`,
    description:
      "Desarrollo apps Android nativas con Kotlin, Compose y KMP. Freelance disponible para proyectos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = {
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Desarrollo de apps Android",
      item: `${SITE_URL}/servicios/desarrollo-apps-android`,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Desarrollo de apps Android con Kotlin",
  description:
    "Apps Android nativas con Jetpack Compose, arquitectura MVVM, integración de APIs y publicación en Google Play Store.",
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: { "@type": "Country", name: "España" },
  serviceType: "Desarrollo de software",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE_URL}/servicios/desarrollo-apps-android`,
  },
};

const comparisons = [
  {
    before: "Presupuesto inflado antes de saber qué necesita la app.",
    after: "MVP acotado, prioridades y decisiones visibles.",
  },
  {
    before: "Un ZIP al final y dependencia del proveedor.",
    after: "Repositorio de tu propiedad desde el primer commit.",
  },
  {
    before: "Una plantilla genérica que fuerza tu operación.",
    after: "Flujos diseñados para las personas que usarán el producto.",
  },
  {
    before: "Reuniones de alineación que no producen nada.",
    after: "Iteraciones cortas, una demo y la siguiente decisión concreta.",
  },
] as const;

const deliverableGroups = [
  {
    number: "01",
    title: "Producto",
    items: [
      "App Android nativa preparada para crecer",
      "Integración con tu backend o APIs existentes",
    ],
  },
  {
    number: "02",
    title: "Propiedad",
    items: [
      "Código fuente en un repositorio Git de tu propiedad",
      "Documentación técnica y guía de mantenimiento",
    ],
  },
  {
    number: "03",
    title: "Integraciones",
    items: [
      "Autenticación con Firebase Auth o sistema propio",
      "Notificaciones push con Firebase Cloud Messaging",
    ],
  },
  {
    number: "04",
    title: "Calidad y lanzamiento",
    items: [
      "Arquitectura MVVM con separación clara de capas",
      "Pruebas unitarias e instrumentadas de las funciones principales",
      "Publicación en Play Store y 30 días de soporte para ajustes menores",
    ],
  },
] as const;

const architectureLayers = [
  {
    number: "01",
    title: "Interfaz",
    description: "Pantallas nativas, accesibles y adaptables.",
    stack: "Jetpack Compose · Material 3",
  },
  {
    number: "02",
    title: "Estado",
    description: "Un flujo de datos predecible y fácil de probar.",
    stack: "MVVM · Coroutines",
  },
  {
    number: "03",
    title: "Dominio",
    description: "Reglas de negocio separadas de cada plataforma.",
    stack: "Kotlin · KMP · Ktor",
  },
  {
    number: "04",
    title: "Datos",
    description: "Trabajo con conexión y también sin ella.",
    stack: "Room · Retrofit · Firebase",
  },
  {
    number: "05",
    title: "Sistema",
    description: "Tareas fiables y comunicación en segundo plano.",
    stack: "WorkManager · FCM",
  },
] as const;

const faqs = [
  {
    q: "¿Cuánto tarda una app Android?",
    a: "Un MVP funcional suele estar listo en 6 a 12 semanas, dependiendo del número de pantallas y la complejidad de las integraciones. Al inicio del proyecto definimos un alcance claro para que los plazos sean realistas, no optimistas.",
  },
  {
    q: "¿El código es mío desde el principio?",
    a: "Sí, siempre. El repositorio lo creas tú y yo trabajo como colaborador. Desde el primer commit el código es tuyo: si en algún momento decides trabajar con otro desarrollador, tienes todo lo necesario para continuar sin fricción.",
  },
  {
    q: "¿Funciona también en iOS?",
    a: "Con Kotlin Multiplatform puedo compartir la lógica de negocio entre Android e iOS, lo que reduce significativamente el trabajo duplicado. La interfaz de usuario en iOS requiere desarrollo en Swift con SwiftUI, que puedo incluir o dejar preparada para que otro equipo la desarrolle.",
  },
  {
    q: "¿Puedo pedir cambios después de la entrega?",
    a: "Los primeros 30 días posteriores a la publicación incluyen soporte para ajustes menores sin coste adicional. Para nuevas funcionalidades o cambios de alcance acordamos un presupuesto independiente antes de empezar.",
  },
  {
    q: "¿Puedo empezar con un MVP pequeño?",
    a: "Sí, y es lo que recomiendo. Construir primero las funciones esenciales permite validar el producto con usuarios reales antes de invertir en más. La arquitectura queda preparada para crecer sin tener que reescribir nada.",
  },
];

const relatedProjects = projects.filter(
  (project) => project.id === "edutrack" || project.id === "flashfix",
);

export default function DesarrolloAppsAndroidPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumbSchema, serviceSchema, faqPageSchema(faqs)]} />

      <div className="pt-24 sm:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto mb-7 max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-24"
        >
          <ol className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[color:var(--primary)]"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/servicios"
                className="transition-colors hover:text-[color:var(--primary)]"
              >
                Servicios
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[color:var(--foreground)]" aria-current="page">
              Apps Android
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <AndroidServiceExperience />
        </div>

        <section
          id="android-blueprint"
          className="section-band mt-20 scroll-mt-24 sm:mt-28"
        >
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-16 2xl:px-24">
            <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:gap-20">
              <header className="xl:sticky xl:top-28 xl:self-start">
                <p className="section-eyebrow">Antes / después</p>
                <h2 className="mt-5 max-w-[12ch] text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl">
                  Menos promesas. Más señales de avance.
                </h2>
                <p className="mt-5 max-w-lg text-pretty leading-7 text-[color:var(--muted)]">
                  El proceso sustituye incertidumbre por decisiones que puedes
                  revisar. Sabes qué se construye, dónde vive el código y qué
                  falta para llegar a producción.
                </p>
              </header>

              <div className="border-y-2 border-[color:var(--foreground)]">
                <div className="hidden grid-cols-[3rem_1fr_2.5rem_1fr] gap-4 border-b border-[color:var(--foreground)] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)] sm:grid sm:px-6">
                  <span>Ref.</span>
                  <span>Lo habitual</span>
                  <span aria-hidden="true" />
                  <span>Cómo trabajo</span>
                </div>
                {comparisons.map((item, index) => (
                  <article
                    key={item.before}
                    className="grid gap-4 border-b border-[color:var(--border)] px-4 py-6 last:border-b-0 sm:grid-cols-[3rem_1fr_2.5rem_1fr] sm:items-center sm:px-6 sm:py-7"
                  >
                    <span className="font-mono text-[10px] font-bold text-[color:var(--primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="mb-1 block font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[color:var(--muted)] sm:hidden">
                        Antes
                      </span>
                      <p className="text-sm leading-6 text-[color:var(--muted)] line-through decoration-[color:var(--primary)]">
                        {item.before}
                      </p>
                    </div>
                    <ArrowRight
                      className="hidden h-4 w-4 text-[color:var(--primary)] sm:block"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="mb-1 block font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[color:var(--primary)] sm:hidden">
                        Cómo trabajo
                      </span>
                      <p className="font-display text-lg font-bold leading-snug text-[color:var(--foreground)]">
                        {item.after}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-band-alt">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-16 2xl:px-24">
            <header className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
              <div>
                <p className="section-eyebrow">Criterio de entrega</p>
                <h2 className="mt-5 max-w-[12ch] text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl">
                  Lo que recibes y lo que lo sostiene.
                </h2>
              </div>
              <div className="max-w-2xl space-y-3 text-pretty leading-7 text-[color:var(--muted)]">
                <p>
                  Cada app parte de una arquitectura MVVM clara: los datos
                  viajan desde la fuente hasta la interfaz de forma predecible y
                  comprobable.
                </p>
                <p>
                  Si el producto necesita Android e iOS, Kotlin Multiplatform
                  permite compartir dominio y datos sin forzar dos bases de
                  código que acaben divergiendo.
                </p>
              </div>
            </header>

            <div className="mt-12 grid border-2 border-[color:var(--foreground)] bg-[color:var(--background)] lg:grid-cols-[0.92fr_1.08fr]">
              <div className="border-b-2 border-[color:var(--foreground)] lg:border-b-0 lg:border-r-2">
                <div className="flex items-center justify-between border-b border-[color:var(--foreground)] px-5 py-4 sm:px-7">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">
                    Entregables / 09
                  </p>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--muted)]">
                    Todo verificable
                  </span>
                </div>
                <div>
                  {deliverableGroups.map((group) => (
                    <article
                      key={group.number}
                      className="grid gap-4 border-b border-[color:var(--border)] px-5 py-6 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:px-7"
                    >
                      <div>
                        <span className="font-mono text-[9px] font-bold text-[color:var(--primary)]">
                          {group.number}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold">
                          {group.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"
                          >
                            <Check
                              className="mt-1 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden bg-[color:var(--surface)]">
                <div className="comic-halftone pointer-events-none absolute inset-0 opacity-[0.13]" aria-hidden="true" />
                <div className="relative flex items-center justify-between border-b border-[color:var(--foreground)] px-5 py-4 sm:px-7">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">
                    Arquitectura / capas
                  </p>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[color:var(--muted)]">
                    UI → sistema
                  </span>
                </div>
                <div className="relative p-5 sm:p-7">
                  {architectureLayers.map((layer, index) => (
                    <article
                      key={layer.number}
                      className={`relative grid gap-3 border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-4 py-4 sm:grid-cols-[3.2rem_0.75fr_1.25fr] sm:items-center sm:px-5 ${
                        index === 0 ? "" : "-mt-[2px]"
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold text-[color:var(--primary)]">
                        {layer.number}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          {layer.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                          {layer.description}
                        </p>
                      </div>
                      <p className="font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.08em] text-[color:var(--surface-foreground)] sm:text-right">
                        {layer.stack}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-band">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-16 2xl:px-24">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow">Código en uso</p>
                <h2 className="mt-5 max-w-[15ch] text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl">
                  Dos apps. Problemas distintos. Base real.
                </h2>
              </div>
              <Link
                href="/proyectos"
                className="inline-flex min-h-11 items-center gap-2 self-start border-b border-[color:var(--foreground)] text-sm font-semibold transition-colors hover:text-[color:var(--primary)] sm:self-auto"
              >
                Ver todos los proyectos
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </header>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {relatedProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/proyectos/${project.caseStudySlug ?? project.id}`}
                  className="group grid min-w-0 grid-cols-[6rem_1fr] gap-5 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] p-4 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-[color:var(--surface-elevated)] hover:shadow-[6px_6px_0_0_var(--primary)] sm:grid-cols-[10rem_1fr] sm:gap-7 sm:p-6"
                >
                  <div
                    className={`self-center transition-transform duration-300 group-hover:rotate-0 ${
                      index === 0 ? "-rotate-2" : "rotate-2"
                    }`}
                  >
                    <ComicCover
                      mode="mini"
                      issueNumber={index + 1}
                      title={project.title}
                      tagline={project.result}
                      techStack={project.stack.slice(0, 2).join(" · ")}
                      statusWord={projectStatusWord[project.status]}
                      statusAccent={projectStatusAccent[project.status]}
                      coverSrc={project.coverSrc}
                      coverAlt={project.coverAlt}
                      coverPosition={project.coverPosition}
                      coverFit={project.coverFit}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col py-1 sm:py-3">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">
                        Caso / {String(index + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--surface-foreground)]">
                      {project.projectType}
                    </p>
                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-[color:var(--muted)]">
                      {project.solution}
                    </p>
                    <span className="mt-auto hidden pt-5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[color:var(--primary)] sm:block">
                      {project.metrics.slice(0, 3).join(" · ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-band">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-16 2xl:px-24">
            <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
              <header>
                <p className="section-eyebrow">Preguntas frecuentes</p>
                <h2 className="mt-5 max-w-[12ch] text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl">
                  Antes de construir, despejamos lo importante.
                </h2>
              </header>

              <div className="border-y-2 border-[color:var(--foreground)]">
                {faqs.map((faq, index) => (
                  <details
                    key={faq.q}
                    name="android-service-faq"
                    className="group border-b border-[color:var(--border)] last:border-b-0"
                    open={index === 0 ? true : undefined}
                  >
                    <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-3 py-5 marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-[9px] font-bold text-[color:var(--primary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-lg font-bold sm:text-xl">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="max-w-3xl px-12 pb-6 text-sm leading-7 text-[color:var(--muted)] sm:px-16">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-band bg-[color:var(--foreground)] text-[color:var(--background)]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-7 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 xl:px-16 2xl:px-24">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">
                Siguiente decisión
              </p>
              <h2 className="mt-3 max-w-[22ch] text-balance font-display text-3xl font-bold leading-tight sm:text-4xl">
                Cuéntame qué debe resolver tu app. En 30 minutos sabremos por dónde empezar.
              </h2>
            </div>
            <Link
              href="/#contacto"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 border-2 border-[color:var(--background)] bg-[color:var(--primary)] px-6 text-sm font-semibold text-[color:var(--on-primary)] transition-colors hover:bg-[color:var(--primary-hover)]"
            >
              Cuéntame tu app
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
