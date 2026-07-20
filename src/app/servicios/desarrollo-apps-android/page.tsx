import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Desarrollador de apps Android freelance | Kotlin y Jetpack Compose",
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

const stack = [
  "Kotlin",
  "Jetpack Compose",
  "KMP",
  "Firebase Auth",
  "FCM",
  "Ktor",
  "Material 3",
  "WorkManager",
  "Coroutines",
  "Room",
  "Retrofit",
];

const deliverables = [
  "App Android nativa publicada en Google Play Store",
  "Código fuente en repositorio Git de tu propiedad",
  "Arquitectura MVVM con separación clara de capas",
  "Integración con tu backend o APIs existentes",
  "Autenticación con Firebase Auth o sistema propio",
  "Notificaciones push con Firebase Cloud Messaging",
  "Pruebas unitarias e instrumentadas de las funciones principales",
  "Documentación técnica y guía de mantenimiento",
];

const problems = [
  "Agencias que presupuestan apps a meses y cuatro veces tu presupuesto para algo que no necesitas.",
  "Desarrolladores que entregan el código en un ZIP, desaparecen y tú te quedas sin saber cómo continuar.",
  "Apps construidas con plantillas genéricas que no encajan con el proceso real de tu negocio.",
  "Tiempo perdido en reuniones de 'alineación' que no producen nada y retrasan la entrega.",
];

const steps = [
  {
    num: "01",
    title: "Diagnóstico",
    desc: "Entendemos juntos qué necesita la app, quién la va a usar y cuáles son los flujos críticos para tu negocio. Sin plantillas, sin suposiciones.",
  },
  {
    num: "02",
    title: "Arquitectura",
    desc: "Diseño la estructura de datos, las pantallas principales y el flujo de navegación antes de escribir una sola línea de código productivo.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Iteraciones cortas con entregables reales. Tienes acceso al repositorio desde el primer día y puedes ver el avance en tiempo real.",
  },
  {
    num: "04",
    title: "Publicación",
    desc: "Gestiono el proceso de publicación en Google Play Store, incluyendo configuración de firma, acceso de producción y revisión de políticas.",
  },
];

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

export default function DesarrolloAppsAndroidPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumbSchema, serviceSchema, faqPageSchema(faqs)]} />

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
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
            <li>
              <Link
                href="/servicios"
                className="hover:text-[color:var(--foreground)] transition"
              >
                Servicios
              </Link>
            </li>
            <li aria-hidden="true" className="text-[color:var(--border-hover)]">
              /
            </li>
            <li
              className="text-[color:var(--foreground)]"
              aria-current="page"
            >
              Apps Android
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-14">
          <p className="section-eyebrow mb-4">Desarrollo mobile</p>
          <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Desarrollador de apps Android freelance —{" "}
            <span className="text-[color:var(--primary)]">
              Kotlin, Compose y KMP
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Construyo apps Android nativas para empresas que necesitan algo
            específico: un sistema de gestión interno, una herramienta de campo
            para su equipo o una app de producto para sus clientes. No trabajo
            con plantillas ni con generadores de código, sino con arquitectura
            pensada para durar.
          </p>
        </header>

        {/* Problem section */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            El problema habitual
          </h2>
          <p className="mb-4 text-[color:var(--muted)]">
            Muchas empresas que llegan con una idea para una app han pasado por
            alguna de estas situaciones:
          </p>
          <ul className="space-y-3">
            {problems.map((p) => (
              <li
                key={p}
                className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm leading-6 text-[color:var(--muted)]"
              >
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent-cyan)]"
                  aria-hidden="true"
                />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* How I solve it */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Cómo lo resuelvo
          </h2>
          <div className="space-y-4 text-[color:var(--muted)]">
            <p className="leading-7">
              Cada app que construyo parte de una arquitectura MVVM clara: los
              datos viajan desde la fuente hasta la interfaz de forma predecible
              y testeable. Jetpack Compose me permite construir interfaces
              nativas que se adaptan a cualquier tamaño de pantalla sin
              comprometer la fluidez de la animación ni el rendimiento en
              dispositivos de gama media.
            </p>
            <p className="leading-7">
              Cuando el proyecto requiere lógica compartida entre Android e iOS,
              aplico Kotlin Multiplatform para separar la capa de dominio y de
              datos de la interfaz específica de cada plataforma. Esto reduce
              significativamente el tiempo de desarrollo futuro y evita mantener
              dos codebases paralelas que acaban divergiendo.
            </p>
            <p className="leading-7">
              Trabajo con integraciones reales desde el principio: Firebase para
              autenticación y notificaciones push, Ktor para comunicación con
              backends, Room para persistencia local y WorkManager para tareas en
              segundo plano. El resultado es una app que se comporta bien cuando
              hay conexión, pero también cuando no la hay.
            </p>
          </div>
        </section>

        {/* Deliverables */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Qué incluye el servicio
          </h2>
          <ul className="space-y-2">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-6 text-[color:var(--surface-foreground)]"
              >
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--primary)]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Stack técnico
          </h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2.5 py-1.5 font-mono text-xs text-[color:var(--surface-foreground)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Proceso de trabajo
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] font-mono text-sm font-bold text-[color:var(--accent-cyan)]">
                  {step.num}
                </div>
                <h3 className="font-semibold text-[color:var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related projects */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Proyectos relacionados
          </h2>
          <div className="space-y-3">
            <Link
              href="/proyectos/edutrack"
              className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-sm font-bold text-[color:var(--primary)]">
                ET
              </div>
              <div>
                <p className="font-semibold text-[color:var(--foreground)]">
                  EduTrack
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  App Android en beta pública para seguimiento académico con Firebase
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[color:var(--muted)]" />
            </Link>
            <Link
              href="/proyectos/flashfix"
              className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-sm font-bold text-[color:var(--primary)]">
                FF
              </div>
              <div>
                <p className="font-semibold text-[color:var(--foreground)]">
                  FlashFix
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  Marketplace Android con geolocalización, chat y valoraciones
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[color:var(--muted)]" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
            <span
              className="h-px w-6 bg-[color:var(--accent-cyan)]"
              aria-hidden="true"
            />
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
              >
                <h3 className="font-semibold text-[color:var(--foreground)]">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-10 text-center">
          <p className="section-eyebrow mb-3 justify-center">¿Hablamos?</p>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">
            ¿Tienes una idea para una app? Cuéntamela.
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Una llamada de 30 minutos es suficiente para saber si tu proyecto es
            viable, cuánto puede costar y por dónde empezaríamos.
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
