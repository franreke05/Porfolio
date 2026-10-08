import Link from "next/link";
import type { ReactNode } from "react";
import { FaqDisclosure } from "@/components/faq-disclosure";
import { PainPointsList } from "@/components/pain-points-list";
import { ProcessTimeline } from "@/components/process-timeline";
import { StatusBadge } from "@/components/ui/status-badge";
import { contactHref, getProject, projectHref } from "@/lib/portfolio";
import { afterLaunch, services, type Service } from "@/lib/site-data";

/**
 * Server-rendered building blocks shared by /servicios, the service pages and
 * /sobre-mi. No client JS: everything here is in the HTML on first paint.
 */

export const pageContainer =
  "mx-auto w-full max-w-[77.5rem] px-5 pb-20 pt-28 sm:px-8 lg:px-12";

const textLinkClass =
  "font-semibold text-[color:var(--foreground)] underline decoration-[color:var(--primary)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--primary)]";

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={textLinkClass}>
      {children}
    </Link>
  );
}

/** The single primary action of a page. Hard shadow is reserved for this. */
export function PrimaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-[color:var(--on-primary)] shadow-[var(--shadow-hard)] transition-[transform,box-shadow,background-color] duration-150 hover:bg-[color:var(--primary-hover)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--foreground)] motion-reduce:transition-none"
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function SecondaryCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center gap-2 border-2 border-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition-colors duration-150 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] motion-reduce:transition-none"
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8">
      <ol className="label-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--muted)]">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="py-1 transition-colors hover:text-[color:var(--foreground)]">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[color:var(--foreground)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Ruled section: mono label + h2 on the left, content on the right. */
export function LedgerSection({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="ledger-rule mt-16 grid gap-8 pt-6 lg:mt-20 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)] lg:gap-14"
    >
      <div>
        <p className="label-mono text-[color:var(--muted)]">{label}</p>
        <h2
          id={id}
          className="mt-3 text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[color:var(--foreground)] sm:text-4xl"
        >
          {title}
        </h2>
        {intro ? <p className="mt-4 max-w-md leading-7 text-[color:var(--muted)]">{intro}</p> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

/** One row per real project, read from the catalogue. Never restates facts by hand. */
export function ProjectProofRows({ slugs, headingLevel = "h3" }: { slugs: string[]; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const rows = slugs.map((slug) => getProject(slug)).filter((project) => project !== undefined);

  return (
    <ul className="border-b border-[color:var(--border)]">
      {rows.map((project) => (
        <li
          key={project.slug}
          className="grid gap-x-8 gap-y-2 border-t border-[color:var(--border)] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div>
            <Heading className="font-display text-2xl font-bold leading-tight text-[color:var(--foreground)]">
              <Link
                href={projectHref(project.slug)}
                className="underline decoration-[color:var(--border-hover)] decoration-1 underline-offset-4 transition-colors hover:decoration-[color:var(--primary)]"
              >
                {project.name}
              </Link>
            </Heading>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{project.descriptor}</p>
            <StatusBadge status={project.status} className="mt-3" />
          </div>
          <div className="text-sm leading-6 text-[color:var(--surface-foreground)]">
            <p>{project.relation}</p>
            {project.proof[0] ? <p className="mt-2 text-[color:var(--muted)]">{project.proof[0]}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PillarProof({ service }: { service: Service }) {
  const backed = service.proof.map((slug) => getProject(slug)).filter((project) => project !== undefined);

  return (
    <div>
      <p className="label-mono text-[color:var(--muted)]">Lo respalda</p>
      {backed.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {backed.map((project) => (
            <li key={project.slug} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <TextLink href={projectHref(project.slug)}>{project.name}</TextLink>
              <StatusBadge status={project.status} />
              <span className="basis-full text-sm text-[color:var(--muted)]">{project.descriptor}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {service.proofNote ? (
        <p className="mt-3 text-sm leading-6 text-[color:var(--surface-foreground)]">{service.proofNote}</p>
      ) : null}
    </div>
  );
}

/** /servicios: every pillar in the HTML, each with a link to its page and its proof. */
export function ServicePillars() {
  return (
    <div>
      {services.map((service) => (
        <article
          key={service.id}
          aria-labelledby={`pilar-${service.id}`}
          className="ledger-rule grid gap-x-10 gap-y-6 py-8 lg:grid-cols-[4rem_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-10"
        >
          <p className="font-display text-4xl font-bold leading-none text-[color:var(--primary)]" aria-hidden="true">
            {service.ordinal}
          </p>

          <div>
            <p className="label-mono text-[color:var(--muted)]">{service.highlight}</p>
            <h2
              id={`pilar-${service.id}`}
              className="mt-2 text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[color:var(--foreground)] sm:text-4xl"
            >
              {service.title}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[color:var(--surface-foreground)]">{service.summary}</p>
            <p className="mt-6">
              <TextLink href={service.href}>
                Ver {service.title.toLowerCase() === "web" ? "el servicio web" : service.title.toLowerCase()}
                <span aria-hidden="true"> →</span>
              </TextLink>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="label-mono text-[color:var(--muted)]">Qué incluye</p>
              <ul className="mt-3 border-b border-[color:var(--border)] text-sm text-[color:var(--foreground)]">
                {service.deliverables.map((item) => (
                  <li key={item} className="border-t border-[color:var(--border)] py-2.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <PillarProof service={service} />
          </div>
        </article>
      ))}
    </div>
  );
}

/** Transversal line of the offer. `withCta` renders the secondary button (only on /servicios). */
export function AfterLaunchBand({ withCta = false }: { withCta?: boolean }) {
  return (
    <aside
      aria-labelledby="despues-del-lanzamiento"
      className="on-ink mt-16 grid gap-6 bg-[color:var(--ink-bg)] px-6 py-8 text-[color:var(--ink-fg)] sm:px-10 sm:py-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12"
    >
      <div>
        <p className="label-mono opacity-70">En todos los pilares · Estilo: {afterLaunch.style.name.toLowerCase()}</p>
        <h2
          id="despues-del-lanzamiento"
          className="mt-3 text-balance font-display text-[1.75rem] font-bold leading-[1.08] tracking-tight sm:text-4xl"
        >
          {afterLaunch.title}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 opacity-85">{afterLaunch.text}</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 opacity-70">{afterLaunch.style.why}</p>
      </div>
      {withCta ? (
        <Link
          href={contactHref(afterLaunch.cta.intent)}
          className="inline-flex min-h-12 items-center gap-2 justify-self-start border-2 border-[color:var(--ink-fg)] px-5 py-3 text-sm font-semibold transition-colors duration-150 hover:bg-[color:var(--ink-fg)] hover:text-[color:var(--ink-bg)] motion-reduce:transition-none"
        >
          {afterLaunch.cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <Link
          href={contactHref(afterLaunch.cta.intent)}
          className="justify-self-start font-semibold underline decoration-[color:var(--primary)] decoration-2 underline-offset-4"
        >
          {afterLaunch.cta.label}
          <span aria-hidden="true"> →</span>
        </Link>
      )}
    </aside>
  );
}

export type ServicePageContent = {
  /** Pillar in `services` that owns this page: gives the CTA and the proof. */
  serviceId: Service["id"];
  crumb: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  situations: readonly string[];
  scopeTitle: string;
  scope: ReadonlyArray<{ title: string; text: ReactNode }>;
  proofTitle: string;
  proofIntro: string;
  /** Rendered instead of catalogue rows when the pillar has no catalogue project. */
  proofExtra?: ReactNode;
  stack: readonly string[];
  faqs: ReadonlyArray<{ q: string; a: string }>;
  related: ReadonlyArray<{ href: string; label: string; text: string }>;
};

/** Template shared by the four service pages. */
export function ServicePage({ content }: { content: ServicePageContent }) {
  const service = services.find((item) => item.id === content.serviceId) ?? services[0];
  const ctaHref = contactHref(service.cta.intent);

  return (
    <div className={pageContainer}>
      <Breadcrumb
        items={[{ label: "Inicio", href: "/" }, { label: "Servicios", href: "/servicios" }, { label: content.crumb }]}
      />

      <header className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
        <div>
          <p className="label-mono text-[color:var(--muted)]">{content.eyebrow}</p>
          <h1 className="mt-4 text-balance font-display text-[2.35rem] font-bold leading-[1.02] tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
        </div>
        <div>
          <p className="max-w-xl text-lg leading-relaxed text-[color:var(--surface-foreground)]">{content.lead}</p>
          <div className="mt-7">
            <PrimaryCta href={ctaHref}>{service.cta.label}</PrimaryCta>
          </div>
        </div>
      </header>

      <LedgerSection id="cuando-encaja" label="Punto de partida" title="Cuándo encaja">
        <PainPointsList items={content.situations} />
      </LedgerSection>

      <LedgerSection id="que-hacemos" label="Alcance" title={content.scopeTitle}>
        <dl className="border-b border-[color:var(--border)]">
          {content.scope.map((item) => (
            <div
              key={item.title}
              className="grid gap-x-8 gap-y-1 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
            >
              <dt className="font-semibold text-[color:var(--foreground)]">{item.title}</dt>
              <dd className="leading-7 text-[color:var(--muted)]">{item.text}</dd>
            </div>
          ))}
        </dl>
      </LedgerSection>

      <LedgerSection id="proyectos" label="Prueba" title={content.proofTitle} intro={content.proofIntro}>
        {service.proof.length > 0 ? <ProjectProofRows slugs={service.proof} /> : null}
        {content.proofExtra}
        <p className="mt-6">
          <TextLink href="/proyectos">
            Ver todos los proyectos<span aria-hidden="true"> →</span>
          </TextLink>
        </p>
      </LedgerSection>

      <LedgerSection
        id="como-trabajamos"
        label="Método"
        title="Cómo trabajamos"
        intro="Cuatro pasos, los mismos en todos los proyectos. El plazo se fija cuando el alcance está definido, no antes."
      >
        <ProcessTimeline />
        <p className="label-mono mt-8 text-[color:var(--muted)]">Con qué lo construimos</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-[color:var(--foreground)]">
          {content.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </LedgerSection>

      {content.faqs.length > 0 ? (
        <LedgerSection id="preguntas" label="Preguntas frecuentes" title="Antes de empezar">
          {content.faqs.map((faq, index) => (
            <FaqDisclosure key={faq.q} index={index} question={faq.q} answer={faq.a} />
          ))}
        </LedgerSection>
      ) : null}

      <LedgerSection id="relacionados" label="Otros servicios" title="Suele ir acompañado de">
        <ul className="border-b border-[color:var(--border)]">
          {content.related.map((item) => (
            <li
              key={item.href}
              className="grid gap-x-8 gap-y-1 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
            >
              <TextLink href={item.href}>{item.label}</TextLink>
              <span className="leading-7 text-[color:var(--muted)]">{item.text}</span>
            </li>
          ))}
        </ul>
      </LedgerSection>

      <AfterLaunchBand />

      <p className="mt-12 font-display text-2xl font-bold leading-tight text-[color:var(--foreground)] sm:text-3xl">
        <Link
          href={ctaHref}
          className="underline decoration-[color:var(--primary)] decoration-[3px] underline-offset-[6px] transition-colors hover:text-[color:var(--primary)]"
        >
          {service.cta.label}
          <span aria-hidden="true"> →</span>
        </Link>
      </p>
    </div>
  );
}
