"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import { ComicCover } from "@/components/comic-cover";
import { FlashFixComicReader } from "@/components/flashfix-comic-reader";
import { MagneticButton } from "@/components/magnetic-button";
import { flashfix } from "@/lib/case-studies";
import { projectStatusAccent, projectStatusWord, projects } from "@/lib/site-data";

/**
 * FlashFix's own case-study page — the comic reader IS the case study,
 * not a bolted-on section inside the shared editorial template. The
 * other 3 case studies keep using CaseStudyTemplate.
 */
export function FlashFixCaseStudy() {
  const projectIndex = projects.findIndex((p) => (p.caseStudySlug ?? p.id) === flashfix.slug);
  const project = projects[projectIndex];
  const issueNumber = projectIndex >= 0 ? projectIndex + 1 : 1;
  const techStack = flashfix.stack.slice(0, 2).map((s) => s.name).join(" · ").toUpperCase();

  return (
    <main className="page-shell min-h-screen w-full min-w-0 overflow-hidden">
      {/* ── Top nav ── */}
      <div className="sticky top-16 z-30 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)]">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
          >
            <ArrowLeft className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
            Proyectos
          </Link>

          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
              <li><Link href="/" className="hover:text-[color:var(--foreground)] transition">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/proyectos" className="hover:text-[color:var(--foreground)] transition">Proyectos</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[color:var(--foreground)]" aria-current="page">FlashFix</li>
            </ol>
          </nav>

          <MagneticButton href="/#contacto" rounded="none" size="sm">
            <span className="hidden sm:inline">Hablar del proyecto</span>
            <span className="sm:hidden">Contacto</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>

      <div className="w-full min-w-0 px-5 py-10 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">

        {/* ── Hero ── */}
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">{flashfix.projectType}</span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2.5 py-1 text-xs text-[color:var(--muted)]">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {flashfix.statusLabel}
              </span>
            </div>

            <motion.h1
              className="text-3xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {flashfix.h1}
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            >
              {flashfix.summary}
            </motion.p>

            <motion.div
              className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              {flashfix.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">{m.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">{m.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center lg:mt-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <ComicCover
              mode="header"
              issueNumber={issueNumber}
              title="FlashFix"
              tagline={flashfix.tagline}
              techStack={techStack}
              statusWord={project ? projectStatusWord[project.status] : flashfix.statusLabel.toUpperCase()}
              statusAccent={project ? projectStatusAccent[project.status] : "progress"}
              coverSrc={project?.coverSrc ?? flashfix.coverSrc}
              coverAlt={project?.coverAlt ?? flashfix.coverAlt}
              coverPosition={project?.coverPosition}
              coverFit={project?.coverFit ?? flashfix.coverFit}
            />
          </motion.div>
        </div>

        {/* ── The comic — this IS the case study ── */}
        <FlashFixComicReader />

        {/* ── Related ── */}
        {(flashfix.relatedServices.length > 0 || flashfix.relatedProjects.length > 0) && (
          <div className="mb-12 flex flex-wrap gap-3">
            {flashfix.relatedServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
              >
                {s.label}
                <ArrowUpRight className="h-4 w-4 text-[color:var(--muted)]" aria-hidden="true" />
              </Link>
            ))}
            {flashfix.relatedProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/proyectos/${p.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
              >
                {p.title}
                <ArrowUpRight className="h-4 w-4 text-[color:var(--muted)]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-6 py-10 text-center">
          <p className="section-eyebrow mb-3 justify-center">¿Necesitas algo similar?</p>
          <h2 className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            Cuéntame tu proyecto
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-[color:var(--muted)]">
            Si tienes una idea, un problema de gestión o una app en mente, puedo proponerte un camino claro desde el primer mensaje.
          </p>
          <div className="mt-6">
            <MagneticButton href="/#contacto" rounded="none">
              Agendar llamada
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </main>
  );
}
