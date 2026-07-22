import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ServicesTabletExperience, type ServiceTabletOffering } from "@/components/services-tablet-experience";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";

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
] as const satisfies readonly ServiceTabletOffering[];

const serviciosFaqs = [
  {
    q: "¿Cómo funciona el presupuesto de un proyecto?",
    a: "No hay precios cerrados porque cada app, CRM o web depende del alcance real del proyecto. El primer paso siempre es una llamada para entender el problema y, a partir de ahí, proponer un camino y un presupuesto claros.",
  },
  {
    q: "¿Cuánto tiempo tarda el desarrollo?",
    a: "Depende del alcance de cada proyecto. Todos siguen el mismo proceso de cuatro fases — diagnóstico, prototipo claro, desarrollo iterativo y lanzamiento — y el plazo se confirma después del diagnóstico inicial, no antes.",
  },
  {
    q: "¿Trabajas en remoto o solo en Almería?",
    a: "Trabajo en remoto con empresas y autónomos de toda España, aunque estoy afincado en Almería. La coordinación se hace por llamada, email y WhatsApp durante todo el proyecto.",
  },
  {
    q: "¿Qué tecnologías usas?",
    a: "En mobile, Kotlin Multiplatform (KMP) y Jetpack Compose. En backend y datos, Ktor, PostgreSQL y SQL. En web, Next.js, TypeScript y Tailwind CSS. El stack completo está detallado en la sección Sobre mí.",
  },
  {
    q: "¿Das soporte después del lanzamiento?",
    a: "Sí. Todo lo que publico queda con mantenimiento: corrección de incidencias, mejoras y evolución de funcionalidades. Es uno de los servicios que ofrezco junto al desarrollo inicial.",
  },
  {
    q: "¿Los proyectos que muestras son reales?",
    a: "Sí, con nombre propio y código real — nada anonimizado. EduTrack y FlashFix son MVPs funcionales en producción; OposiControl y OryKai están en desarrollo activo, y lo digo así de claro en cada caso en lugar de aparentar que están más terminados de lo que están.",
  },
];

export default function ServiciosPage() {
  return (
    <>
      <JsonLd schemas={[serviciosIndexSchema, faqPageSchema(serviciosFaqs)]} />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
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
            <li
              className="text-[color:var(--foreground)]"
              aria-current="page"
            >
              Servicios
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.75fr] lg:items-end lg:gap-14">
          <div>
            <p className="section-eyebrow mb-4">Lo que construyo</p>
            <h1 className="max-w-[15ch] font-display text-4xl font-bold leading-[0.98] tracking-tight text-[color:var(--foreground)] sm:text-5xl xl:text-6xl">
              Servicios de desarrollo digital
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] lg:pb-1">
            Trabajo con empresas y autónomos que necesitan sistemas digitales
            reales: apps que funcionan, paneles que se usan y webs que generan
            contactos. Sin intermediarios, sin equipos inflados, sin promesas
            genéricas.
          </p>
        </header>

        {/* Interactive service explorer */}
        <section aria-label="Listado de servicios">
          <ServicesTabletExperience services={services} />
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16" aria-labelledby="servicios-faq-title">
          <div className="self-start lg:sticky lg:top-28">
            <p className="section-eyebrow mb-4">Preguntas frecuentes</p>
            <h2 id="servicios-faq-title" className="max-w-xl text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
              Lo importante, antes de empezar.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-[color:var(--muted)]">
              Alcance, tiempos, propiedad del código y soporte explicados con claridad desde el principio.
            </p>
          </div>

          <div>
            {serviciosFaqs.map((faq, index) => (
              <details key={faq.q} className="group border-t border-[color:var(--foreground)] last:border-b">
                <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-start gap-3 py-5 marker:content-none sm:gap-5 sm:py-6">
                  <span className="pt-1 font-mono text-[10px] font-bold text-[color:var(--primary)]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-lg font-bold leading-snug text-[color:var(--foreground)] sm:text-xl">{faq.q}</h3>
                  <span className="flex h-7 w-7 items-center justify-center border border-[color:var(--foreground)] font-mono text-lg leading-none text-[color:var(--primary)] transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <div className="pb-6 pl-11 pr-10 sm:pl-[3.25rem] sm:pr-14">
                  <p className="max-w-3xl leading-7 text-[color:var(--muted)]">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
