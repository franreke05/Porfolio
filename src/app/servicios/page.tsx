import type { Metadata } from "next";
import { FaqDisclosure } from "@/components/faq-disclosure";
import { JsonLd } from "@/components/json-ld";
import { Mostrador, type MostradorIssue } from "@/components/mostrador/mostrador";
import {
  AfterLaunchBand,
  Breadcrumb,
  LedgerSection,
  PrimaryCta,
  pageContainer,
} from "@/components/services-tablet-experience";
import { StatusBadge } from "@/components/ui/status-badge";
import { contactHref, getProject, projectHref } from "@/lib/portfolio";
import { services } from "@/lib/site-data";
import { breadcrumbSchema, buildMetadata, faqPageSchema, servicesIndexSchema } from "@/lib/seo";

const DESCRIPTION =
  "Apps móviles para Android, iOS y coche, software de gestión y backend a medida, y web: tres pilares, cada uno con el proyecto real que lo respalda.";

export const metadata: Metadata = buildMetadata({
  title: "Servicios",
  description: DESCRIPTION,
  path: "/servicios",
});

const faqs = [
  {
    q: "¿Cómo se presupuesta un proyecto?",
    a: "No publicamos precios cerrados, porque cada proyecto depende de su alcance. Empezamos por una conversación para entender el problema y, a partir de ahí, proponemos un alcance y un presupuesto.",
  },
  {
    q: "¿Cuánto tarda el desarrollo?",
    a: "Depende del alcance. Todos los proyectos siguen los mismos cuatro pasos —diagnóstico, prototipo, desarrollo por bloques y entrega— y el plazo se fija después del diagnóstico, no antes.",
  },
  {
    q: "¿Dónde estáis y cómo trabajáis?",
    a: "Estamos en Almería y trabajamos en remoto. Puedes reservar una reunión online, pedir que te llamemos o escribirnos.",
  },
  {
    q: "¿Qué tecnologías usáis?",
    a: "En móvil, Kotlin Multiplatform y Compose Multiplatform. En backend y datos, Ktor y PostgreSQL. En web, Next.js, React y TypeScript.",
  },
  {
    q: "¿Los proyectos que enseñáis son reales?",
    a: "Sí, y cada uno aparece con su estado real: implementado, en desarrollo o previsto. Los proyectos de cliente están hoy en desarrollo y lo contamos así, pieza a pieza.",
  },
];

/** Counter issues: one per pillar, with its proof resolved from the catalogue on the server. */
const issues: MostradorIssue[] = services.map((service) => ({
  id: service.id,
  ordinal: service.ordinal,
  title: service.title,
  tagline: service.highlight,
  summary: service.summary,
  deliverables: service.deliverables,
  href: service.href,
  cta: { label: service.cta.label, href: contactHref(service.cta.intent) },
  style: service.style,
  proof: service.proof
    .map((slug) => getProject(slug))
    .filter((project) => project !== undefined)
    .map((project) => ({
      slug: project.slug,
      name: project.name,
      descriptor: project.descriptor,
      href: projectHref(project.slug),
      badge: <StatusBadge status={project.status} />,
    })),
  proofNote: service.proofNote,
}));

export default function ServiciosPage() {
  return (
    <>
      <JsonLd
        schemas={[
          servicesIndexSchema(DESCRIPTION),
          breadcrumbSchema([{ name: "Servicios", path: "/servicios" }]),
          faqPageSchema(faqs),
        ]}
      />

      <div className={pageContainer}>
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Servicios" }]} />

        <header className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
          <div>
            <p className="label-mono text-[color:var(--muted)]">El mostrador</p>
            <h1 className="mt-4 text-balance font-display text-[2.35rem] font-bold leading-[1.02] tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Servicios: apps móviles, software de gestión y web.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-[color:var(--surface-foreground)]">
            Somos un estudio pequeño: quien diseña y construye tu producto es quien habla contigo. Hacemos tres
            cosas, y cada una se apoya en un proyecto real que puedes ver por dentro.
          </p>
        </header>

        <section aria-labelledby="mostrador-titulo">
          <div className="ledger-rule mb-6 grid gap-3 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
            <h2
              id="mostrador-titulo"
              className="text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[color:var(--foreground)] sm:text-4xl"
            >
              Tres servicios, tres estilos de cómic
            </h2>
            <p className="max-w-xl leading-7 text-[color:var(--muted)]">
              En el mostrador recomendamos por estilos. Cada número es un servicio: ábrelo para ver qué incluye y qué
              proyecto real lo respalda.
            </p>
          </div>
          <Mostrador issues={issues} />
        </section>

        <AfterLaunchBand withCta />

        <section
          aria-labelledby="publica-el-tuyo"
          className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12"
        >
          <div>
            <h2
              id="publica-el-tuyo"
              className="text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[color:var(--foreground)] sm:text-4xl"
            >
              ¿El siguiente número es el tuyo?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[color:var(--surface-foreground)]">
              Cuéntanos qué quieres construir. Si construimos tu producto y estás de acuerdo, también tendrá su cómic
              en la cartelera.
            </p>
          </div>
          <PrimaryCta href={contactHref("general")}>Publica el tuyo</PrimaryCta>
        </section>

        <LedgerSection
          id="servicios-faq"
          label="Preguntas frecuentes"
          title="Lo importante, antes de empezar"
          intro="Presupuesto, plazos, forma de trabajar y estado real de lo que enseñamos."
        >
          {faqs.map((faq, index) => (
            <FaqDisclosure key={faq.q} index={index} question={faq.q} answer={faq.a} />
          ))}
        </LedgerSection>
      </div>
    </>
  );
}
