import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Code2,
  DatabaseZap,
  Download,
  Globe2,
  Mail,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SITE_NAME, SITE_URL, faqPageSchema, trimDesc } from "@/lib/seo";

// ── Home page metadata ────────────────────────────────────────────────────────
// Explicit title so the template in layout.tsx doesn't wrap it twice.
export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} | Desarrollo de apps mobile, CRMs y webs para empresas`,
  },
  description: trimDesc(
    "Freelance en Almería especializado en apps Android con Kotlin/KMP, CRMs personalizados con PostgreSQL y webs rápidas con Next.js. Sistemas completos, publicados y mantenidos.",
  ),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title:       `${SITE_NAME} | Apps mobile, CRMs y webs para empresas`,
    description: "Apps Android, CRMs a medida y webs rápidas para empresas que necesitan sistemas digitales reales, no plantillas genéricas.",
    url:          SITE_URL,
    type:         "website",
  },
  twitter: {
    title:       `${SITE_NAME} | Apps mobile, CRMs y webs`,
    description: "Freelance especializado en Kotlin/KMP, CRMs SQL y Next.js. Almería, disponible en remoto.",
  },
};
import { AnimatedCard } from "@/components/animated-card";
import { ContactForm } from "@/components/contact-form";
import { CountUp } from "@/components/count-up";
import { FlipCard } from "@/components/flip-card";
import { HeroSection } from "@/components/hero-section";
import { JsonLd } from "@/components/json-ld";
import { RealArchSection } from "@/components/real-arch-section";
import { MotionSection } from "@/components/motion-section";
import { ProcessTimeline } from "@/components/process-timeline";
import { ProfileCard } from "@/components/profile-card";
import { ProjectScrollTarget } from "@/components/project-scroll-target";
import { ProjectCard } from "@/components/project-card";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SkillChip } from "@/components/skill-chip";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  experienceItems,
  projects,
  services,
  siteProfile,
  stackGroups,
  type Service,
} from "@/lib/site-data";

const homepageFaqs = [
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
    a: "Sí, son proyectos reales o propios. Los de clientes con datos sensibles están anonimizados (nombre y marca cambiados) para proteger la confidencialidad, pero el problema, la solución técnica y el stack descritos son los reales.",
  },
];

export default function Home() {
  const personalProjects = projects.filter((p) => p.type === "personal");
  const clientProjects   = projects.filter((p) => p.type === "client");

  return (
    <div className="page-shell min-h-screen overflow-hidden">
      <JsonLd schemas={[faqPageSchema(homepageFaqs)]} />
      <ScrollProgress />
      <SiteHeader />
      <main className="min-w-0">

        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Definición clara — quién es y qué hace, en una frase autocontenida ── */}
        <p className="mx-auto max-w-3xl px-5 pb-16 text-center text-base leading-7 text-[color:var(--muted)] sm:px-6">
          <strong className="text-[color:var(--surface-foreground)]">Francisco Requena Sánchez</strong> es
          desarrollador freelance en Almería, España, especializado en apps Android con Kotlin
          Multiplatform, CRMs a medida con PostgreSQL y webs con Next.js. Diseña, desarrolla,
          publica y mantiene sistemas digitales completos para pequeñas y medianas empresas, sin
          depender de plantillas genéricas.
        </p>

        {/* ── Sistema ── */}
        <section id="sistema" className="section-band px-5 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-6xl">
            <SectionHeader
              eyebrow="Sistema de trabajo"
              title="Del problema al sistema publicado."
              text="Traduzco una necesidad de negocio en capas concretas: app mobile, CRM interno, web informativa, datos y mejora continua. Sin intermediarios, sin plantillas."
            />

            {/* 3 block cards */}
            <div className="grid gap-4 lg:grid-cols-3">
              <LabBlock
                icon={Smartphone}
                tag="Mobile"
                title="App mobile KMP"
                text="Producto mobile con arquitectura clara, pantallas nativas y lógica lista para crecer."
                backItems={["Kotlin / KMP", "Jetpack Compose", "MVVM Clean", "Firebase", "WorkManager"]}
              />
              <LabBlock
                icon={DatabaseZap}
                tag="CRM"
                title="CRM personalizado"
                text="Panel interno para ordenar clientes, tareas, estados y reporting de operación diaria."
                backItems={["Ktor (Kotlin backend)", "PostgreSQL + Caddy", "Compose Desktop", "VPS → producción"]}
              />
              <LabBlock
                icon={Globe2}
                tag="Web"
                title="Web que convierte"
                text="Presencia digital sobria, rápida y medible para convertir visitas en conversaciones."
                backItems={["Next.js + TypeScript", "Tailwind CSS", "Motion.dev", "Vercel Edge", "SEO técnico"]}
              />
            </div>

            {/* Pipeline strip */}
            <MotionSection as="div" delay={0.1} className="mt-5">
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <p className="mb-3 section-eyebrow">Flujo de entrega</p>
                <div className="grid gap-2 md:grid-cols-5">
                  {(["Problema", "Arquitectura", "Desarrollo", "Publicación", "Mejora"] as const).map(
                    (step, i) => (
                      <div
                        key={step}
                        className="relative flex flex-col gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-3"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--accent-cyan-soft)] font-mono text-[10px] font-bold text-[color:var(--accent-cyan)]">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-[color:var(--surface-foreground)]">
                          {step}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* ── Servicios ── */}
        <Section
          id="servicios"
          eyebrow="Servicios"
          title="Tres líneas principales, una misma idea: construir lo que tu negocio sí necesita."
          band="alt"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </Section>

        {/* ── Arquitectura real ── */}
        <RealArchSection />

        {/* ── Proyectos ── */}
        <ProjectScrollTarget
          id="proyectos"
          className="relative overflow-hidden border-t border-[color:var(--border)] px-5 py-20 sm:px-6 lg:py-28"
        >
          {/* Accent highlight — no background overlay, just subtle blobs
              so the global TechBackground stays as the unified layer */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div
              className="projects-aurora-gold absolute rounded-full"
              style={{
                left: "-8%", top: "4%",
                width: 640, height: 640,
                background: "radial-gradient(circle, rgba(195,147,86,0.07) 0%, transparent 60%)",
              }}
            />
            <div
              className="projects-aurora-cyan absolute rounded-full"
              style={{
                right: "-6%", bottom: "5%",
                width: 560, height: 560,
                background: "radial-gradient(circle, rgba(82,208,220,0.05) 0%, transparent 60%)",
              }}
            />
          </div>

          <div className="relative mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-6xl">
            <MotionSection as="div">
              <div className="mb-12 max-w-3xl">
                <div className="mb-4 flex items-center gap-3">
                  <p className="section-eyebrow">Proyectos</p>
                  <span className="ml-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--muted)]">
                    <CountUp to={projects.length} duration={1} /> casos
                  </span>
                </div>
                <h2 className="text-balance font-display text-heading-lg font-semibold leading-[1.14] text-[color:var(--foreground)]">
                  Casos visuales con problema, solución, stack y resultado desde el primer vistazo.
                </h2>
              </div>
            </MotionSection>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl text-pretty leading-7 text-[color:var(--muted)]">
                Cada caso está escrito como una venta técnica: contexto realista, decisión de
                producto, mockup visual y resultado comercial. Los proyectos anonimizados
                protegen datos sensibles sin perder autoridad ni claridad.
              </p>
              <a
                href={siteProfile.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)] transition hover:underline"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>

            <ProjectGroup title="Laboratorio y sistemas propios" projects={personalProjects} />
            <ProjectGroup
              title="Casos corporativos y anonimizados"
              projects={clientProjects}
              startIndex={personalProjects.length}
              className="mt-12"
            />
          </div>
        </ProjectScrollTarget>

        {/* ── Proceso ── */}
        <Section
          id="proceso"
          eyebrow="Proceso"
          title="Un timeline claro para pasar de idea difusa a producto lanzado."
          band="alt"
        >
          <ProcessTimeline />
        </Section>

        {/* ── Sobre mí ── */}
        <Section
          id="sobre-mi"
          eyebrow="Sobre mí"
          title="Perfil técnico con base mobile y foco en herramientas útiles para negocio."
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr_1.1fr]">
            <MotionSection as="div" className="mx-auto w-full max-w-xs lg:mx-0">
              <ProfileCard
                name={siteProfile.name}
                title={siteProfile.role}
                handle="franreke05"
                status="Disponible"
                contactHref="/#contacto"
                contactText="Contactar"
              />
            </MotionSection>

            <MotionSection as="div">
              <p className="text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]">
                {siteProfile.shortBio}
              </p>
              <blockquote className="mt-5 rounded-xl border border-[color:var(--border)] bg-[color:var(--accent-cyan-soft)] p-4 text-base leading-7 text-[color:var(--foreground)]">
                {siteProfile.authority}
              </blockquote>
              <div className="mt-7 flex flex-wrap gap-3">
                <ExternalLink href={siteProfile.links.cv}       icon={Download}         label="Descargar CV" />
                <ExternalLink href={siteProfile.links.linkedin} icon={BriefcaseBusiness} label="LinkedIn" external />
                <ExternalLink href={siteProfile.links.github}   icon={Code2}            label="GitHub" external />
              </div>
              <div className="mt-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
                  <BriefcaseBusiness className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
                  Experiencia
                </h3>
                <div className="mt-6 space-y-6">
                  {experienceItems.map((item) => (
                    <article key={item.company} className="border-l-2 border-[color:var(--border)] pl-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--primary)]">
                        {item.company}
                      </p>
                      <h4 className="mt-1 font-semibold text-[color:var(--foreground)]">{item.role}</h4>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            </MotionSection>

            {/* Bento-style skill grid — cursor-spotlight + glow-on-hover per tile,
                inspired by reactbits.dev's MagicBento. Built on the existing
                SpotlightCard primitive rather than porting MagicBento's GSAP
                particle/magnetism engine: this project has no GSAP dependency,
                and SpotlightCard already gives the same per-card glow-follows-
                cursor effect used elsewhere on the site (LabBlock, ServiceCard). */}
            <MotionSection as="div" delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-2">
                {stackGroups.map((group) => (
                  <SpotlightCard key={group.title} className="rounded-xl">
                    <div className="h-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 transition hover:border-[color:var(--primary)]/45">
                      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">
                        {group.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item, index) => (
                          <SkillChip key={item} label={item} index={index} />
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </MotionSection>
          </div>
        </Section>

        {/* ── FAQ ── */}
        <Section
          id="faq"
          eyebrow="Preguntas frecuentes"
          title="Lo que suelen preguntarme antes de empezar."
          band="alt"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {homepageFaqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
              >
                <h3 className="font-semibold text-[color:var(--foreground)]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Contacto ── */}
        <section id="contacto" className="section-band-alt px-5 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto grid w-full max-w-[calc(100vw-2.5rem)] gap-12 sm:max-w-6xl lg:grid-cols-[0.85fr_1.15fr]">
            <MotionSection as="div">
              <div>
                <p className="section-eyebrow mb-4">Contacto</p>
                <h2 className="text-balance font-display text-heading-lg font-semibold leading-[1.16] text-[color:var(--foreground)]">
                  Cuéntame qué quieres construir. Si tiene sentido, te propongo un camino claro.
                </h2>
                <p className="mt-5 text-pretty leading-7 text-[color:var(--muted)]">
                  No hay precios cerrados porque cada app, CRM o web depende del alcance real. El
                  primer paso es entender el problema y decidir la ruta más sensata.
                </p>
                <div className="mt-7 grid gap-3">
                  <ContactLink href={siteProfile.links.mail}      icon={Mail}             label={siteProfile.email} />
                  <ContactLink href={siteProfile.links.whatsapp}  icon={MessageCircle}    label={siteProfile.displayPhone} external />
                  <ContactLink href={siteProfile.links.linkedin}  icon={BriefcaseBusiness} label="LinkedIn" external />
                  <ContactLink href={siteProfile.links.github}    icon={Code2}            label="GitHub" external />
                </div>
              </div>
            </MotionSection>
            <MotionSection as="div" delay={0.08}>
              <ContactForm />
            </MotionSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION PRIMITIVES
───────────────────────────────────────────── */

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <MotionSection as="div">
      <div className="mb-12 max-w-3xl">
        <p className="section-eyebrow mb-4">{eyebrow}</p>
        <h2 className="text-balance font-display text-heading-lg font-semibold leading-[1.14] text-[color:var(--foreground)]">
          {title}
        </h2>
        {text && (
          <p className="mt-5 max-w-2xl text-pretty leading-7 text-[color:var(--muted)]">{text}</p>
        )}
      </div>
    </MotionSection>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  band = "default",
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  band?: "default" | "alt";
}) {
  return (
    <section
      id={id}
      className={`px-5 py-20 sm:px-6 lg:py-28 ${
        band === "alt" ? "section-band-alt" : "section-band"
      }`}
    >
      <div className="mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-6xl">
        <SectionHeader eyebrow={eyebrow} title={title} />
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BLOCKS
───────────────────────────────────────────── */

function LabBlock({
  icon: Icon,
  tag,
  title,
  text,
  backItems,
}: {
  icon: LucideIcon;
  tag: string;
  title: string;
  text: string;
  backItems: string[];
}) {
  return (
    <AnimatedCard className="h-full" noHover>
      <FlipCard
        className="h-full"
        front={
          <SpotlightCard className="h-full rounded-xl">
            <div className="flex h-full flex-col rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 transition hover:border-[color:var(--border-hover)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--accent-cyan)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                  {tag}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-[color:var(--foreground)]">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
              <div className="mt-5 flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--muted)] opacity-50">stack</span>
                <span className="block h-1 w-1 rounded-full bg-[color:var(--accent-cyan)] opacity-40" />
                <span className="block h-1 w-1 rounded-full bg-[color:var(--accent-cyan)] opacity-40" />
                <span className="block h-1 w-1 rounded-full bg-[color:var(--accent-cyan)] opacity-40" />
              </div>
            </div>
          </SpotlightCard>
        }
        back={
          <div className="flex h-full flex-col rounded-xl border border-[color:var(--accent-cyan)]/25 bg-[linear-gradient(148deg,var(--surface),var(--background))] p-5">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--accent-cyan)]">
              tech.stack[]
            </p>
            <ul className="flex-1 space-y-2.5">
              {backItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="shrink-0 select-none font-mono text-xs text-[color:var(--primary)]">$</span>
                  <span className="font-mono text-sm text-[color:var(--surface-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </AnimatedCard>
  );
}

const serviceIconMap: Record<Service["icon"], LucideIcon> = {
  mobile:     Smartphone,
  crm:        DatabaseZap,
  web:        Globe2,
  support:    ShieldCheck,
  automation: Zap,
  growth:     BarChart3,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = serviceIconMap[service.icon];

  return (
    <AnimatedCard delay={index * 0.05} className="h-full" noHover>
      <FlipCard
        className="h-full"
        front={
          <SpotlightCard className="h-full rounded-xl">
            <article className="flex h-full flex-col rounded-xl border border-[color:var(--border)] bg-[linear-gradient(148deg,var(--surface-elevated),var(--surface))] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="rounded-md border border-[color:var(--border)] bg-[color:var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--primary)]">
                  {service.highlight}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[color:var(--foreground)]">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--muted)]">{service.summary}</p>
              <div className="mt-5 flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[color:var(--muted)] opacity-50">details</span>
                <span className="block h-1 w-1 rounded-full bg-[color:var(--primary)] opacity-40" />
                <span className="block h-1 w-1 rounded-full bg-[color:var(--primary)] opacity-40" />
                <span className="block h-1 w-1 rounded-full bg-[color:var(--primary)] opacity-40" />
              </div>
            </article>
          </SpotlightCard>
        }
        back={
          <div className="flex h-full flex-col rounded-xl border border-[color:var(--accent-cyan)]/25 bg-[linear-gradient(148deg,var(--surface),var(--background))] p-5">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--accent-cyan)]">
              {`// deliverables`}
            </p>
            <ul className="flex-1 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 select-none font-mono text-xs text-[color:var(--primary)]">→</span>
                  <span className="text-sm leading-6 text-[color:var(--surface-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2.5">
              <p className="font-mono text-[10px] text-[color:var(--muted)]">
                <span className="text-[color:var(--accent-cyan)]">$</span>{" "}
                <span className="text-[color:var(--surface-foreground)]">status</span>
                {" · "}
                <span className="text-[color:var(--primary)]">disponible</span>
              </p>
            </div>
          </div>
        }
      />
    </AnimatedCard>
  );
}

function ProjectGroup({
  title,
  projects: projectList,
  startIndex = 0,
  className,
}: {
  title: string;
  projects: typeof projects;
  startIndex?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-6 bg-[color:var(--border-hover)]" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--muted)]">
          {title}
        </h3>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {projectList.map((project, index) => (
          <AnimatedCard key={project.id} delay={index * 0.05} className="h-full">
            <ProjectCard project={project} index={startIndex + index} />
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}

function ExternalLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--primary)]/70"
    >
      <Icon className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
      {label}
    </a>
  );
}

function ContactLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-sm text-[color:var(--surface-foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--border-hover)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--primary)]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 break-words">{label}</span>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[color:var(--muted)]" aria-hidden="true" />
    </a>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] px-5 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {siteProfile.name}. Portfolio personal.</p>
        <p className="flex items-center gap-2 font-mono text-xs">
          <Rocket className="h-3.5 w-3.5 text-[color:var(--primary)]" aria-hidden="true" />
          Next.js · Vercel · TypeScript
        </p>
      </div>
    </footer>
  );
}
