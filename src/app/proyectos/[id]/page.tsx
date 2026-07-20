import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  LockKeyhole,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatedHeroMedia,
  AnimatedProcessBoard,
  AnimatedProjectMediaShowcase,
} from "@/components/project-case-experience";
import { projects, type Project } from "@/lib/site-data";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const projectTone: Record<Project["image"], { label: string; domain: string; outcome: string }> = {
  mobile: {
    label: "Mobile product",
    domain: "App multiplataforma",
    outcome: "Flujo mobile, lógica de producto y decisiones de UI listas para validación real.",
  },
  dashboard: {
    label: "CRM system",
    domain: "Sistema interno",
    outcome: "Modelo de datos, panel operativo y seguimiento comercial.",
  },
  browser: {
    label: "Web premium",
    domain: "Captación digital",
    outcome: "Narrativa comercial, rendimiento y conversión a contacto.",
  },
  subscription: {
    label: "Private area",
    domain: "Sistema de negocio",
    outcome: "Suscripciones, control de acceso y lógica comercial para operación recurrente.",
  },
};

const projectStatusLabel: Record<Project["status"], string> = {
  "technical-demo": "Demo técnica",
  "documented-case": "Caso documentado",
  "own-system": "Sistema propio",
  "anonymous-project": "Proyecto anonimizado",
  "real-lab": "Laboratorio real",
};

// Projects that already have a dedicated, richer static case-study page
// (src/app/proyectos/{slug}/page.tsx, driven by lib/case-studies.ts) — every
// canonical id and legacy alias for those projects redirects there instead of
// rendering the generic template below, so there is exactly one indexable,
// citable URL per project.
const caseStudyRedirects: Record<string, string> = {
  "edutrack-mobile-academica": "edutrack",
  "edutrack-mobile-kmp": "edutrack",
  "personal-mobile-product": "edutrack",
  "requenadesk-crm-interno": "requenadesk",
  "requenadesk-crm": "requenadesk",
  "personal-crm-lab": "requenadesk",
  "solsconfort-web-premium": "solsconfort",
  "personal-web-experiment": "solsconfort",
  "vinotico-area-privada": "vinotico",
  "client-business-app": "vinotico",
  "oposicontrol-study-app": "oposicontrol",
  "client-internal-system": "oposicontrol",
};

// Only prerender projects that don't already have a dedicated static page —
// this is a fallback template for future projects, not the 5 above.
export function generateStaticParams() {
  return projects
    .filter((project) => !(project.id in caseStudyRedirects))
    .map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const redirectTarget = caseStudyRedirects[id];
  if (redirectTarget) redirect(`/proyectos/${redirectTarget}`);

  const project = getProject(id);

  if (!project) return {};

  const canonicalPath = `/proyectos/${project.id}`;
  const description   = trimDesc(`${project.problem} ${project.solution}`);

  return {
    title:       project.title,           // wrapped by layout template
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title:       `${project.title} | ${SITE_NAME}`,
      description: trimDesc(project.solution),
      url:          canonicalPath,
      type:         "article",
    },
    twitter: {
      title:       `${project.title} | ${SITE_NAME}`,
      description: trimDesc(project.solution, 120),
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const redirectTarget = caseStudyRedirects[id];
  if (redirectTarget) redirect(`/proyectos/${redirectTarget}`);

  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const tone = projectTone[project.image];
  const statusLabel = projectStatusLabel[project.status];

  const ldSchemas = [
    projectBreadcrumb(project.title, project.id),
    projectSchema({
      id:          project.id,
      title:       project.title,
      description: project.solution,
      type:        project.image,
    }),
  ];

  return (
    <main className="page-shell min-h-screen w-full min-w-0 overflow-hidden px-5 py-8 sm:px-6 lg:py-10">
      <JsonLd schemas={ldSchemas} />
      <div className="mx-auto w-full min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-6xl">
        <nav className="mb-8 grid gap-3 sm:flex sm:items-center sm:justify-between">
          <Link
            href="/#proyectos"
            className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] px-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)]"
          >
            <ArrowLeft className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
            Volver
          </Link>
          <Link
            href="/#contacto"
            className="inline-flex min-h-10 w-fit max-w-full items-center gap-2 rounded-lg border border-[color:var(--primary)]/55 px-3 text-sm font-semibold text-[color:var(--primary)] transition hover:bg-[rgba(195,147,86,0.09)]"
          >
            <span className="truncate">Comentar proyecto</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="w-full min-w-0 max-w-full rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] p-5 sm:p-7">
            <div className="mb-7 grid min-w-0 gap-2 sm:flex sm:flex-wrap">
              <Badge text={tone.domain} icon={Sparkles} />
              <Badge
                text={statusLabel}
                icon={project.visibility === "anonymous" ? LockKeyhole : BadgeCheck}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[color:var(--primary)]/45 bg-[rgba(195,147,86,0.12)] text-xl font-semibold text-[color:var(--primary)]">
                {getInitials(project.title)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase text-[color:var(--primary)]">
                  {project.projectType}
                </p>
                <h1 className="mt-2 max-w-full text-balance font-display text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl">
                  {project.title}
                </h1>
              </div>
            </div>

            <p className="mt-7 max-w-[18rem] text-pretty text-lg leading-8 text-[color:var(--surface-foreground)] sm:max-w-none">
              {tone.outcome}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Metric label="Estado" value={statusLabel} />
              <Metric label="Tipo" value={project.type === "client" ? "Cliente / B2B" : "Sistema propio"} />
              <Metric label="Entrega" value={project.metrics[0]} />
            </div>
          </div>

          <AnimatedHeroMedia project={project} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="min-w-0 space-y-6">
            <Panel title="Brief">
              <InfoBlock title="Problema" text={project.problem} />
              <InfoBlock title="Solución" text={project.solution} />
              <InfoBlock title="Resultado" text={project.result} />
            </Panel>

            <Panel title="Stack">
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] px-2.5 py-1.5 text-sm text-[color:var(--surface-foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Métricas visuales">
              <div className="grid grid-cols-2 gap-2">
                {project.metrics.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] px-2.5 py-2 text-sm font-semibold text-[color:var(--surface-foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
          </aside>

          <div className="min-w-0 space-y-6">
            <AnimatedProjectMediaShowcase project={project} />
            <AnimatedProcessBoard />
          </div>
        </section>
      </div>
    </main>
  );
}

function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Badge({
  text,
  icon: Icon,
}: {
  text: string;
  icon: LucideIcon;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] px-3 py-2 text-sm font-semibold text-[color:var(--surface-foreground)]">
      <Icon className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
      {text}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-3">
      <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="w-full min-w-0 max-w-full rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] p-5">
      <h2 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">{title}</h2>
      {children}
    </section>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-4 last:mb-0">
      <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">{title}</p>
      <p className="mt-2 max-w-[18rem] text-sm leading-6 text-[color:var(--muted)] sm:max-w-none">{text}</p>
    </div>
  );
}
