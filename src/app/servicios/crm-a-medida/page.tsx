import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "CRM a medida para empresas | PostgreSQL, paneles y flujos personalizados",
  description:
    "Desarrollo CRMs personalizados con PostgreSQL, roles, flujos y reportes adaptados a tu negocio. Sin licencias genéricas, sin funcionalidades que no usas.",
  alternates: {
    canonical: canonical("/servicios/crm-a-medida"),
  },
  openGraph: {
    title: `CRM a medida para empresas | ${SITE_NAME}`,
    description:
      "CRMs personalizados con PostgreSQL, roles, flujos y reportes. Sin licencias genéricas, sin funcionalidades que no usas.",
    url: `${SITE_URL}/servicios/crm-a-medida`,
    type: "website",
  },
  twitter: {
    title: `CRM a medida | ${SITE_NAME}`,
    description:
      "CRMs con PostgreSQL, roles y flujos adaptados a tu negocio. Sin licencias mensuales.",
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
      name: "CRM a medida",
      item: `${SITE_URL}/servicios/crm-a-medida`,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "CRM a medida para empresas",
  description:
    "Sistemas CRM personalizados con PostgreSQL, panel de administración, gestión de roles, flujos de trabajo y reportes adaptados al proceso de cada empresa.",
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: { "@type": "Country", name: "España" },
  serviceType: "Desarrollo de software",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE_URL}/servicios/crm-a-medida`,
  },
};

const stack = [
  "PostgreSQL",
  "Ktor",
  "Kotlin",
  "Compose Desktop",
  "Next.js",
  "SQL",
  "VPS",
  "REST API",
  "JWT",
];

const deliverables = [
  "Panel de administración con dashboard de actividad y métricas clave",
  "Módulo de clientes con historial completo de interacciones",
  "Estados y etapas personalizadas para tu proceso de ventas o gestión",
  "Sistema de roles y permisos por usuario y sección",
  "Módulo de tareas y seguimiento con asignaciones y fechas límite",
  "Formularios de entrada de datos adaptados a tus campos específicos",
  "Reportes exportables en PDF o CSV con los datos que necesitas",
  "Backups automáticos de la base de datos SQL",
  "Despliegue en VPS con dominio propio y configuración de producción",
];

const problems = [
  "El equipo gestiona clientes entre Excel, WhatsApp y el correo electrónico, y nadie sabe cuál es la versión actualizada.",
  "Estás pagando por HubSpot, Salesforce o cualquier otro SaaS del que solo usas el 15% de las funcionalidades.",
  "No hay trazabilidad de qué pasó con un cliente, quién le llamó o por qué no se cerró una venta.",
  "Probaste un CRM genérico, pero tu proceso no encaja con ninguna de sus plantillas y lo acabasteis abandonando.",
];

const steps = [
  {
    num: "01",
    title: "Diagnóstico del proceso",
    desc: "Mapeamos juntos cómo funciona tu operación actual: quién hace qué, qué datos necesitas registrar y cuáles son los cuellos de botella que quieres eliminar.",
  },
  {
    num: "02",
    title: "Diseño del modelo de datos",
    desc: "Diseño el esquema de base de datos PostgreSQL adaptado a tu proceso, con las relaciones correctas para que los reportes sean útiles desde el primer día.",
  },
  {
    num: "03",
    title: "Desarrollo del panel",
    desc: "Construyo el panel con las vistas, formularios y flujos que tu equipo necesita. Sin funcionalidades que nadie va a usar, sin complejidad innecesaria.",
  },
  {
    num: "04",
    title: "Despliegue y formación",
    desc: "Configuro el servidor, migro los datos existentes y formo a tu equipo para que pueda operar el sistema de forma autónoma desde el primer día.",
  },
];

const faqs = [
  {
    q: "¿Por qué no usar HubSpot, Notion o un CRM estándar?",
    a: "Las herramientas genéricas están diseñadas para el promedio de empresas, no para la tuya. Si tu proceso de venta, gestión de clientes o seguimiento de proyectos tiene particularidades propias, ningún CRM estándar va a encajar bien. Acabas doblando el proceso para adaptarlo a la herramienta, en lugar de al revés.",
  },
  {
    q: "¿Cuánto tiempo tarda el desarrollo?",
    a: "Un CRM básico con las funcionalidades esenciales suele estar listo en 8 semanas. Para sistemas más complejos con múltiples módulos, reportes avanzados o integraciones con herramientas externas, el plazo habitual es de 12 a 16 semanas. Al inicio del proyecto definimos exactamente el alcance para que los tiempos sean precisos.",
  },
  {
    q: "¿Puedo migrar mis datos de Excel o de otro sistema?",
    a: "Sí. El proceso de migración de datos está incluido como parte del proyecto. Analizamos la estructura actual, limpiamos y normalizamos los datos si es necesario, y los importamos al nuevo sistema para que no pierdas nada del historial que ya tienes.",
  },
  {
    q: "¿Qué pasa si mi equipo crece y necesito más usuarios o funcionalidades?",
    a: "La arquitectura está diseñada para escalar desde el principio. Añadir usuarios, nuevos roles o módulos adicionales es una extensión natural del sistema, no una reescritura. El código está organizado para que cualquier desarrollador pueda retomar el proyecto si en algún momento decides trabajar con otro equipo.",
  },
  {
    q: "¿Necesito un servidor propio?",
    a: "Recomiendo un VPS dedicado para tener control total sobre los datos y los tiempos de respuesta. No es caro: un servidor adecuado para la mayoría de CRMs de empresa pequeña cuesta entre 10 y 30 euros al mes. Te ayudo con la contratación y configuración inicial.",
  },
];

export default function CrmAMedidaPage() {
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
              CRM a medida
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-14">
          <p className="section-eyebrow mb-4">Sistemas internos</p>
          <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            CRM a medida para tu empresa —{" "}
            <span className="text-[color:var(--primary)]">
              sin licencias, sin plantillas genéricas
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Un CRM que se adapta a tu proceso de negocio, no al revés. Diseñado
            específicamente para cómo trabaja tu equipo, con los campos, flujos
            y reportes que necesitas, sin pagar por funcionalidades que nunca
            vas a usar.
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
            Estas son las situaciones más frecuentes que me cuentan las empresas
            antes de decidirse por un CRM a medida:
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
              El punto de partida es el diseño de la base de datos PostgreSQL.
              Antes de escribir una sola pantalla, modelamos juntos las
              entidades de tu negocio: clientes, oportunidades, tareas,
              contratos, o lo que aplique en tu caso. Un esquema SQL bien
              diseñado desde el principio es lo que hace que los reportes sean
              útiles y que el sistema pueda crecer sin deuda técnica.
            </p>
            <p className="leading-7">
              El acceso al sistema se gestiona mediante roles y permisos
              granulares. El comercial ve sus clientes y sus oportunidades. El
              gerente ve el panel global y puede exportar reportes. El técnico
              accede solo a las fichas de servicio. Cada usuario trabaja con la
              información que necesita, sin ruido y sin riesgo de modificar lo
              que no debería.
            </p>
            <p className="leading-7">
              Los reportes son la parte que más agradecen los equipos una vez
              que llevan unas semanas usando el sistema. Volumen de ventas por
              comercial, tasa de cierre por fuente de lead, clientes sin
              actividad en los últimos 30 días, facturas pendientes de cobro.
              Datos que antes requerían horas de trabajo manual en Excel,
              disponibles al instante con los filtros que tú defines.
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
              href="/proyectos/orykai"
              className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-sm font-bold text-[color:var(--primary)]">
                OK
              </div>
              <div>
                <p className="font-semibold text-[color:var(--foreground)]">
                  OryKai
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  CRM multiplataforma propio con Ktor, PostgreSQL y facturación en PDF
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
            ¿Gestionas clientes con Excel o WhatsApp?
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Cuéntame cómo funciona tu proceso ahora mismo. En una llamada de 30
            minutos te digo si un CRM a medida tiene sentido para tu situación
            y qué costaría.
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
