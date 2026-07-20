"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { ComicCover } from "@/components/comic-cover";
import { CountUp } from "@/components/count-up";
import { MagneticButton } from "@/components/magnetic-button";
import { MarkerHighlight } from "@/components/marker-highlight";
import { MotionSection } from "@/components/motion-section";
import { PhoneMockup } from "@/components/phone-mockup";
import { ScrollProgress } from "@/components/scroll-progress";
import { dur, ease } from "@/lib/motion";
import { caseStudies } from "@/lib/case-studies";
import {
  projectStatusAccent,
  projectStatusWord,
  projects,
  services,
  siteProfile,
  trustSignals,
} from "@/lib/site-data";

const SUBTITLE =
  "Construyo el sistema completo: app mobile con KMP, CRM a medida, web rápida y automatizaciones que eliminan el trabajo repetitivo. Todo publicado, todo mantenido.";

/** Client-side 4-act homepage body — split out of app/page.tsx so that file
 * can stay a server component and export `metadata`. */
export function HomepageActs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="page-shell min-h-screen">
      <ScrollProgress />
      <main className="min-w-0">
        <div ref={containerRef} className="relative w-full px-5 pt-28 sm:px-8 lg:px-12 lg:pt-36 xl:px-16 2xl:px-24">
          <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
            {/* ── Left: 4 stacked acts ── */}
            <div className="order-2 flex flex-col gap-28 pb-24 lg:order-1 lg:gap-48 lg:pb-40">
              <ActApertura />
              <ActTrabajo />
              <ActServicios />
              <ActAutor />
            </div>

            {/* ── Right: sticky phone through-line — outer cell stretches to
                the row's full height (left column's height) so the inner
                sticky wrapper has room to actually hold in place while
                scrolling, instead of scrolling away with a short cell. ── */}
            <div className="order-1 pb-8 lg:order-2 lg:pb-0">
              <div className="lg:sticky lg:top-28">
                <PhoneMockup progress={scrollYProgress} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Act 1 — Apertura. One confident line, no CTA yet.
───────────────────────────────────────────── */
function ActApertura() {
  const rm = useReducedMotion();
  const d = (base: number) => (rm ? 0 : base);

  return (
    <section aria-label="Apertura">
      <motion.p
        className="mb-6 inline-flex items-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-[color:var(--on-primary)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.06) }}
      >
        {siteProfile.location} · Remoto
      </motion.p>

      <motion.h1
        className="max-w-full text-balance font-display text-display-sm font-semibold leading-[1.04] text-[color:var(--foreground)] sm:text-5xl sm:leading-[1.06] lg:text-display-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(0.64), ease: ease.premium, delay: d(0.16) }}
      >
        Apps mobile y sistemas digitales que ordenan <MarkerHighlight>tu negocio.</MarkerHighlight>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.37) }}
      >
        {SUBTITLE}
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: d(dur.normal), delay: d(0.5) }}
      >
        {trustSignals.map((signal) => (
          <span
            key={signal}
            className="inline-flex items-center gap-1.5 border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 font-mono text-xs text-[color:var(--muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" aria-hidden="true" />
            {signal}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[color:var(--border)] pt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.6) }}
      >
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            <CountUp to={projects.length} duration={1} />
          </p>
          <p className="text-xs text-[color:var(--muted)]">proyectos reales</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            <CountUp to={services.length} duration={1} />
          </p>
          <p className="text-xs text-[color:var(--muted)]">líneas de servicio</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">100%</p>
          <p className="text-xs text-[color:var(--muted)]">código propio, sin plantillas</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 2 — El trabajo. 3 comic-cover previews, single CTA → /proyectos.
───────────────────────────────────────────── */
function ActTrabajo() {
  const preview = projects.slice(0, 3);

  return (
    <section aria-label="El trabajo">
      <p className="section-eyebrow mb-4">El trabajo</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Cuatro proyectos reales, con portada propia y estado honesto.
      </h2>
      <p className="mt-5 max-w-xl text-pretty leading-7 text-[color:var(--muted)]">
        Nada de capturas de marketing: cada caso explica el problema, la
        decisión técnica y en qué punto está hoy — beta pública, MVP o en
        desarrollo activo.
      </p>

      <div className="mt-10 flex flex-wrap items-end gap-4 sm:gap-6">
        {preview.map((project, i) => {
          const study = caseStudies[project.caseStudySlug ?? project.id];
          return (
            <Link
              key={project.id}
              href={`/proyectos/${project.caseStudySlug ?? project.id}`}
              className="w-28 shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:w-32"
              style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
              aria-label={`Ver caso completo: ${project.title}`}
            >
              <ComicCover
                mode="gallery"
                issueNumber={i + 1}
                title={project.title}
                tagline={study?.tagline ?? project.projectType}
                techStack={project.stack.slice(0, 2).join(" · ").toUpperCase()}
                statusWord={projectStatusWord[project.status]}
                statusAccent={projectStatusAccent[project.status]}
                mockupType={project.image}
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <MagneticButton href="/proyectos">
          Ver los 4 proyectos
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 3 — Lo que hace. 4 service lines, single CTA → /servicios.
───────────────────────────────────────────── */
function ActServicios() {
  return (
    <section aria-label="Lo que hace">
      <p className="section-eyebrow mb-4">Lo que hace</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Cuatro líneas, una misma idea: construir lo que tu negocio sí necesita.
      </h2>

      <MotionSection as="div" className="mt-10 divide-y-2 divide-[color:var(--foreground)] border-2 border-[color:var(--foreground)]">
        {services.map((service) => (
          <div key={service.id} className="flex items-start gap-4 p-4 sm:p-5">
            <span className="mt-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--primary)]">
              {service.highlight}
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[color:var(--foreground)]">{service.title}</p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{service.summary}</p>
            </div>
          </div>
        ))}
      </MotionSection>

      <div className="mt-10">
        <MagneticButton href="/servicios">
          Ver todos los servicios
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 4 — El autor. Human line, one-glance process, CTA → contacto / sobre-mí.
───────────────────────────────────────────── */
function ActAutor() {
  return (
    <section aria-label="El autor">
      <p className="section-eyebrow mb-4">El autor</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Un desarrollador, cuatro plataformas, cero intermediarios.
      </h2>
      <p className="mt-5 max-w-xl text-pretty leading-7 text-[color:var(--surface-foreground)]">
        {siteProfile.shortBio}
      </p>
      <blockquote className="mt-5 max-w-xl border-l-4 border-[color:var(--primary)] bg-[color:var(--surface)] p-4 text-base leading-7 text-[color:var(--foreground)]">
        {siteProfile.authority}
      </blockquote>

      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton href="/#contacto">
          Hablemos
        </MagneticButton>
        <MagneticButton href="/sobre-mi" variant="secondary">
          Sobre mí
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}
