import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL, canonical, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Diseño web para empresas en Granada y Almería | Next.js y SEO técnico",
  description:
    "Webs profesionales para empresas en Granada, Almería y toda España. Next.js, SEO técnico, rendimiento optimizado y diseño adaptado a tu negocio.",
  alternates: {
    canonical: canonical("/servicios/diseno-web-empresas"),
  },
  openGraph: {
    title: `Diseño web para empresas en Granada y Almería | ${SITE_NAME}`,
    description:
      "Webs profesionales con Next.js, SEO técnico y rendimiento optimizado. Para empresas en Granada, Almería y toda España.",
    url: `${SITE_URL}/servicios/diseno-web-empresas`,
    type: "website",
  },
  twitter: {
    title: `Diseño web empresas | ${SITE_NAME}`,
    description:
      "Webs con Next.js, SEO técnico y Core Web Vitals. Granada, Almería y remoto.",
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
      name: "Diseño web para empresas",
      item: `${SITE_URL}/servicios/diseno-web-empresas`,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Diseño web profesional para empresas",
  description:
    "Webs profesionales con Next.js, SEO técnico, Core Web Vitals optimizados y diseño adaptado al negocio. Para empresas en Granada, Almería y toda España.",
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: [
    { "@type": "City", name: "Granada" },
    { "@type": "City", name: "Almería" },
    { "@type": "Country", name: "España" },
  ],
  serviceType: "Diseño y desarrollo web",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE_URL}/servicios/diseno-web-empresas`,
  },
};

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Vercel",
  "WordPress",
  "SEO técnico",
  "Analytics",
  "Core Web Vitals",
];

const deliverables = [
  "Diseño responsive adaptado a móvil, tablet y escritorio",
  "SEO técnico: metaetiquetas, sitemap, robots.txt, datos estructurados",
  "Configuración de Google Analytics o equivalente con eventos clave",
  "Formularios de contacto con validación y notificaciones",
  "Despliegue en Vercel con dominio y HTTPS configurados",
  "Optimización de Core Web Vitals (LCP, CLS, INP)",
  "Open Graph y Twitter Card para compartir bien en redes sociales",
  "Documentación de uso y mantenimiento básico para el cliente",
];

const problems = [
  "La web es lenta, anticuada y no refleja lo que hace la empresa, pero cambiarla lleva meses en el to-do.",
  "La web recibe visitas pero no genera contactos: no hay un mensaje claro ni una llamada a la acción que funcione.",
  "WordPress instalado hace años que nadie mantiene, con plugins caducados y un rendimiento que Google penaliza.",
  "La empresa no aparece en Google para las búsquedas que importan porque la web no tiene trabajo de SEO técnico.",
];

const steps = [
  {
    num: "01",
    title: "Diagnóstico y estructura",
    desc: "Analizamos juntos qué necesita comunicar la web, quién es el visitante ideal y qué acción queremos que tome. Definimos la arquitectura de contenido antes de diseñar.",
  },
  {
    num: "02",
    title: "Diseño y prototipo",
    desc: "Diseño las pantallas principales en base a la identidad de marca existente. Revisamos juntos antes de escribir el código definitivo.",
  },
  {
    num: "03",
    title: "Desarrollo y optimización",
    desc: "Desarrollo en Next.js con foco en velocidad, accesibilidad y SEO técnico desde el primer día. No son añadidos de última hora.",
  },
  {
    num: "04",
    title: "Publicación y entrega",
    desc: "Despliegue en Vercel, configuración del dominio, Analytics y revisión final de Core Web Vitals. Entrega con documentación incluida.",
  },
];

const faqs = [
  {
    q: "¿WordPress o Next.js? ¿Cuál necesito?",
    a: "Depende. Si tu equipo va a actualizar contenido con frecuencia y no tiene perfil técnico, WordPress con un sistema de gestión de contenidos bien configurado es una opción razonable. Si la web es principalmente informativa o comercial y el rendimiento y el SEO son prioritarios, Next.js ofrece ventajas claras en velocidad y control. Te ayudo a decidir según tu caso concreto.",
  },
  {
    q: "¿Cuánto tarda una web?",
    a: "Una web informativa de entre 5 y 10 páginas suele estar lista en 2 a 4 semanas. Un proyecto más complejo con tienda, área privada o integraciones externas puede requerir de 4 a 8 semanas. Los tiempos dependen en gran parte de cuánto tarda el cliente en aprobar los textos y el diseño.",
  },
  {
    q: "¿El hosting está incluido?",
    a: "Vercel tiene un plan gratuito que cubre perfectamente la mayoría de webs informativas y comerciales. Para proyectos con alto tráfico o funcionalidades avanzadas puede ser necesario un plan de pago, pero es bajo coste. El dominio va por tu cuenta: suele costar entre 10 y 15 euros al año en cualquier registrador.",
  },
  {
    q: "¿Y el mantenimiento después de entregar?",
    a: "El mantenimiento no está incluido por defecto, pero puedes contratarlo de forma opcional: por horas sueltas para cambios puntuales, o como servicio mensual que incluye actualizaciones, monitoreo de rendimiento y pequeños ajustes. Lo configuramos según tus necesidades.",
  },
  {
    q: "¿Una web bien hecha puede posicionar en Google?",
    a: "El SEO técnico que incluyo en cada proyecto es la base necesaria para que Google pueda rastrear, entender y posicionar tu web correctamente. Eso incluye estructura semántica, velocidad, metadatos y datos estructurados. Lo que no puedo garantizar son posiciones concretas en buscadores, porque el posicionamiento depende también de factores externos como la competencia y la calidad del contenido.",
  },
];

export default function DisenoWebEmpresasPage() {
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
              Diseño web
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-14">
          <p className="section-eyebrow mb-4">Desarrollo web</p>
          <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Diseño web profesional para empresas —{" "}
            <span className="text-[color:var(--primary)]">
              Granada, Almería y toda España
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
            Webs que cargan rápido, se muestran bien en cualquier dispositivo y
            están construidas para aparecer en Google. No son plantillas con tu
            logo: son proyectos pensados para el proceso y los objetivos
            específicos de tu empresa.
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
            Estas son las situaciones más comunes que encuentro cuando una
            empresa decide renovar su presencia online:
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
              El rendimiento no es un añadido de última hora, es la base de la
              arquitectura. Usando Next.js con renderizado en servidor, las
              páginas se sirven pre-generadas al visitante, lo que se traduce en
              tiempos de carga por debajo de un segundo incluso en conexiones
              móviles. Los Core Web Vitals son uno de los factores de
              posicionamiento de Google y los optimizo en cada proyecto como
              parte del proceso estándar.
            </p>
            <p className="leading-7">
              El SEO técnico está integrado en el desarrollo desde el principio:
              estructura de headings correcta, metaetiquetas únicas por página,
              datos estructurados con schema.org para que Google entienda qué
              ofreces y dónde estás, sitemap XML actualizado y robots.txt
              correctamente configurado. Es lo que hace la diferencia entre una
              web que existe y una web que posiciona.
            </p>
            <p className="leading-7">
              La estructura de contenido está diseñada para convertir: un mensaje
              claro en los primeros segundos, propuesta de valor sin ambigüedad,
              llamadas a la acción en los momentos en que el visitante está listo
              para contactar. No es solo diseño bonito, es diseño orientado a que
              alguien acabe enviando un formulario o llamando por teléfono.
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
                  Backoffice multiplataforma con Kotlin Multiplatform y Clean Architecture
                </p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[color:var(--muted)]" />
            </Link>
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
                  Panel multiplataforma de administración y cliente con Ktor y PostgreSQL
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
            ¿Tu web no genera contactos?
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            Cuéntame cómo es tu web actual y qué esperas de la nueva. En 30
            minutos te digo qué haría diferente y por dónde empezaríamos.
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
