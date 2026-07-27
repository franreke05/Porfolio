import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PainPointsList } from "@/components/pain-points-list";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Automatización de procesos para pymes | Sistemas digitales a medida",
  description:
    "Automatizo tareas repetitivas para pymes: formularios, notificaciones, reportes y flujos de trabajo. Menos trabajo manual, más tiempo para tu negocio.",
  alternates: {
    canonical: canonical("/servicios/automatizaciones-pymes"),
  },
  openGraph: {
    title: `Automatización de procesos para pymes | ${SITE_NAME}`,
    description:
      "Automatizo formularios, notificaciones, reportes y flujos de trabajo para pymes. Menos trabajo manual, más tiempo útil.",
    url: `${SITE_URL}/servicios/automatizaciones-pymes`,
    type: "website",
  },
  twitter: {
    title: `Automatizaciones para pymes | ${SITE_NAME}`,
    description:
      "Menos tareas repetitivas para tu equipo. Integraciones, formularios y reportes automáticos.",
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
      name: "Automatizaciones para pymes",
      item: `${SITE_URL}/servicios/automatizaciones-pymes`,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Automatización de procesos para pymes",
  description:
    "Integraciones entre herramientas, formularios automáticos, notificaciones y reportes programados para eliminar trabajo repetitivo en pequeñas y medianas empresas.",
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: { "@type": "Country", name: "España" },
  serviceType: "Automatización de procesos de negocio",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE_URL}/servicios/automatizaciones-pymes`,
  },
};

const stack = [
  "Python",
  "SQL",
  "APIs REST",
  "Webhooks",
  "n8n",
  "Ktor",
  "PostgreSQL",
  "Scripts",
  "Cron",
];

const deliverables = [
  "Análisis del proceso actual e identificación de tareas automatizables",
  "Integración entre las herramientas que ya usas tu equipo",
  "Formularios conectados directamente a tu base de datos o CRM",
  "Reportes automáticos periódicos por email o en panel propio",
  "Notificaciones automáticas al equipo o al cliente según el estado",
  "Validación y limpieza de datos en la entrada para evitar errores",
  "Documentación técnica del flujo implementado",
  "Soporte durante el primer mes de operación en producción",
];

const problems = [
  "Tu equipo dedica horas a la semana a copiar datos de un formulario a una hoja de cálculo, de ahí a otro sistema.",
  "Los clientes no reciben confirmaciones automáticas y alguien tiene que escribir el mismo email de bienvenida cada vez.",
  "Los reportes mensuales se hacen a mano: alguien exporta, filtra, suma y formatea durante horas lo que podría generarse solo.",
  "Tienes cuatro herramientas que no se comunican entre sí: el formulario web, el correo, la hoja de cálculo y el sistema de facturación.",
];

const steps = [
  {
    num: "01",
    title: "Análisis del proceso",
    desc: "Mapeamos las tareas repetitivas que realiza tu equipo: con qué frecuencia, cuánto tiempo llevan y qué herramientas intervienen. Identificamos qué tiene más impacto automatizar primero.",
  },
  {
    num: "02",
    title: "Diseño del flujo",
    desc: "Diseñamos juntos el flujo automatizado: de dónde vienen los datos, qué transformaciones necesitan, a dónde van y qué notificaciones se envían en cada paso.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Implemento las integraciones, scripts o flujos con n8n, APIs REST o código a medida según lo que necesite el caso. Sin sobreingeniería, sin complejidad innecesaria.",
  },
  {
    num: "04",
    title: "Pruebas y entrega",
    desc: "Probamos el flujo con datos reales antes de ponerlo en producción. Entrego la documentación y el acceso a los logs para que puedas supervisar su funcionamiento.",
  },
];

const faqs = [
  {
    q: "¿Qué tipo de tareas se pueden automatizar?",
    a: "Las más habituales son: registrar datos de formularios web en una base de datos o CRM, enviar emails de confirmación o notificaciones cuando algo ocurre, generar reportes periódicos con los datos de negocio, sincronizar clientes entre plataformas, crear tareas automáticas en función de condiciones y archivar documentos en la carpeta correcta. Si hay una tarea que tu equipo hace igual todos los días o todas las semanas, probablemente se puede automatizar.",
  },
  {
    q: "¿Necesito cambiar las herramientas que uso ahora?",
    a: "No necesariamente. La mayoría de automatizaciones se construyen alrededor de las herramientas que ya tienes, conectándolas entre sí mediante APIs o webhooks. Si alguna herramienta no permite integraciones, lo evaluamos juntos y buscamos alternativas que no rompan el flujo de trabajo del equipo.",
  },
  {
    q: "¿Cuánto tiempo puede llegar a ahorrar una automatización?",
    a: "Depende de la tarea. Un flujo que elimina la entrada manual de datos puede ahorrar entre 30 minutos y varias horas por semana. Un sistema de reportes automático puede equivaler a un día de trabajo al mes. En el análisis inicial estimamos el impacto real antes de comprometer ningún presupuesto.",
  },
  {
    q: "¿Qué pasa si el flujo automatizado falla?",
    a: "Los flujos incluyen manejo de errores y logs de ejecución. Cuando algo falla, el sistema lo registra y puede enviar una notificación a tu equipo para que intervenga. Durante el primer mes de producción incluyo soporte para resolver cualquier incidencia que aparezca con datos reales.",
  },
  {
    q: "¿Puedo ampliar la automatización después si cambio de herramientas o proceso?",
    a: "Sí, el diseño modular facilita precisamente eso. Si añades una nueva herramienta, cambias de proveedor o el proceso evoluciona, podemos extender el flujo existente sin tener que rehacer todo desde cero. La documentación entregada también ayuda a que otro desarrollador pueda retomar el trabajo si fuera necesario.",
  },
];

export default function AutomatizacionesPymesPage() {
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
              Automatizaciones
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-14">
          <p className="section-eyebrow mb-4">Automatización de procesos</p>
          <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Automatización de procesos para pymes —{" "}
            <span className="text-[color:var(--primary)]">
              menos tareas repetitivas, más tiempo útil
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Identifico las tareas que tu equipo hace igual todos los días y las
            convierto en flujos automáticos. Formularios que se guardan solos,
            notificaciones que se envían solas, reportes que aparecen en tu
            bandeja de entrada sin que nadie tenga que hacerlos.
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
            Estas son las fricciones más comunes que encuentro cuando hablo con
            equipos de pymes sobre cómo gestionan su operación diaria:
          </p>
          <PainPointsList items={problems} />
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
              Las integraciones personalizadas son el núcleo de este trabajo. En
              lugar de adaptar tu proceso a las posibilidades de una herramienta
              de automatización genérica, construyo el conector exacto que
              necesitas: un webhook que escucha eventos de tu plataforma web, un
              script que transforma y valida los datos antes de insertarlos, una
              llamada a la API de tu proveedor de email cuando se cumple una
              condición específica. Cada pieza hace exactamente lo que tiene que
              hacer y nada más.
            </p>
            <p className="leading-7">
              Los pipelines formulario-base de datos-notificación son el tipo de
              automatización con mayor retorno inmediato para la mayoría de
              pymes. Un cliente rellena un formulario de contacto, los datos
              llegan directamente a tu CRM o base de datos, el equipo recibe una
              notificación en Slack o por email, y el cliente recibe una
              confirmación personalizada. Sin que nadie tenga que hacer nada
              manualmente en ningún paso.
            </p>
            <p className="leading-7">
              Los reportes programados eliminan uno de los trabajos más
              repetitivos y menos valiosos que hacen los equipos: recopilar datos
              de distintos sistemas, pegarlos en una hoja de cálculo y darle
              formato. Con un script SQL bien construido y una tarea cron
              configurada, el informe de ventas, de actividad o de clientes sin
              contacto aparece en tu bandeja de entrada cada lunes por la mañana,
              listo para revisarlo.
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
                  Facturación automática en PDF y flujo de tickets con backend propio
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[color:var(--muted)]" />
            </Link>
            <Link
              href="/proyectos/oposicontrol"
              className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-sm font-bold text-[color:var(--primary)]">
                OC
              </div>
              <div>
                <p className="font-semibold text-[color:var(--foreground)]">
                  OposiControl
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  Moderación y gestión de tickets centralizada por roles
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
            ¿Tienes tareas repetitivas que quieres eliminar?
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Cuéntame qué hace tu equipo de forma manual y con qué herramientas.
            En una llamada de 30 minutos identificamos qué se puede automatizar
            y qué impacto tendría.
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
