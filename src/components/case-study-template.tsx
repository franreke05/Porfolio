"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, ChevronDown, LockKeyhole } from "lucide-react";
import { ComicCover } from "@/components/comic-cover";
import { MagneticButton } from "@/components/magnetic-button";
import { dur, ease, viewport } from "@/lib/motion";
import type { CaseStudyData } from "@/lib/case-studies";
import { projectStatusAccent, projectStatusWord, projects } from "@/lib/site-data";

// ─────────────────────────────────────────────
// Motion helpers
// ─────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0  },
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ duration: dur.normal, ease: ease.soft, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Section wrapper (used inside the collapsible technical detail)
// ─────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 last:mb-0">
      <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-[color:var(--foreground)]">
        <span className="h-px w-6 shrink-0 bg-[color:var(--accent-cyan)]" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────
// Comic panel — the narrative beat (Problema/Solución/Resultado).
// Diagonal clip-path is confined to a fixed-height header band so real
// paragraph text below is never at risk of being clipped.
// ─────────────────────────────────────────────
function ComicPanel({
  number,
  eyebrow,
  title,
  accent,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  accent: "cyan" | "gold";
  children: React.ReactNode;
}) {
  const isLive = accent === "cyan";
  return (
    <Reveal>
      <section
        className={`relative mb-8 overflow-hidden rounded-xl ${
          isLive ? "comic-ink-outline-cyan" : "comic-ink-outline"
        } bg-[color:var(--surface)]`}
      >
        <div
          className={`comic-diagonal relative flex items-center gap-4 overflow-hidden px-6 py-6 sm:px-8 ${
            isLive ? "comic-halftone" : "comic-halftone-gold"
          }`}
        >
          <span className="comic-numeral relative z-10 shrink-0" aria-hidden="true">{number}</span>
          <div className="relative z-10 min-w-0">
            <p className={`comic-action-word text-xs ${isLive ? "comic-status-live" : "comic-status-progress"}`}>
              {eyebrow}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[color:var(--foreground)] sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </section>
    </Reveal>
  );
}

// ─────────────────────────────────────────────
// Main template
// ─────────────────────────────────────────────
export function CaseStudyTemplate({ data }: { data: CaseStudyData }) {
  const VisibilityIcon = data.visibility === "anonymous" ? LockKeyhole : BadgeCheck;

  const projectIndex = projects.findIndex((p) => (p.caseStudySlug ?? p.id) === data.slug);
  const project = projects[projectIndex];
  const issueNumber = projectIndex >= 0 ? projectIndex + 1 : 1;
  const techStack = data.stack.slice(0, 2).map((s) => s.name).join(" · ").toUpperCase();

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

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
              <li><Link href="/" className="hover:text-[color:var(--foreground)] transition">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/proyectos" className="hover:text-[color:var(--foreground)] transition">Proyectos</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[color:var(--foreground)]" aria-current="page">{data.h1.split("—")[0].trim()}</li>
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
          {/* Left: copy */}
          <div>
            {/* Badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">{data.projectType}</span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2.5 py-1 text-xs text-[color:var(--muted)]">
                <VisibilityIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {data.statusLabel}
              </span>
            </div>

            {/* H1 */}
            <motion.h1
              className="text-3xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {data.h1}
            </motion.h1>

            {/* Summary */}
            <motion.p
              className="mt-5 max-w-xl text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            >
              {data.summary}
            </motion.p>

            {/* Metrics */}
            <motion.div
              className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              {data.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">{m.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">{m.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: comic cover — literal Marvel-style cover, the one loud
              visual moment on this page */}
          <motion.div
            className={`flex items-center justify-center ${data.slug === "flashfix" ? "lg:mt-8" : ""}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <ComicCover
              mode="header"
              issueNumber={issueNumber}
              title={data.h1.split("—")[0].trim()}
              tagline={data.tagline}
              techStack={techStack}
              statusWord={project ? projectStatusWord[project.status] : data.statusLabel.toUpperCase()}
              statusAccent={project ? projectStatusAccent[project.status] : "progress"}
              coverSrc={project?.coverSrc ?? data.coverSrc}
              coverAlt={project?.coverAlt ?? data.coverAlt}
              coverPosition={project?.coverPosition}
              coverFit={project?.coverFit ?? data.coverFit}
            />
          </motion.div>
        </div>

        {/* ── Two-column content ── */}
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Stack */}
            <Reveal>
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">Stack técnico</h2>
                <div className="space-y-2">
                  {data.stack.map((s) => (
                    <div key={s.name} className="flex items-start gap-2.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[color:var(--foreground)]">{s.name}</p>
                        <p className="font-mono text-[10px] text-[color:var(--muted)]">{s.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Related services */}
            {data.relatedServices.length > 0 && (
              <Reveal>
                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">Servicios relacionados</h2>
                  <div className="space-y-2">
                    {data.relatedServices.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
                      >
                        <span className="flex-1">{s.label}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--muted)]" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Related projects */}
            {data.relatedProjects.length > 0 && (
              <Reveal>
                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">Proyectos relacionados</h2>
                  <div className="space-y-2">
                    {data.relatedProjects.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/proyectos/${p.slug}`}
                        className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-3 transition hover:border-[color:var(--border-hover)] hover:bg-[color:var(--surface-elevated)]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[color:var(--foreground)]">{p.title}</p>
                          <p className="text-xs text-[color:var(--muted)]">{p.desc}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--muted)]" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </aside>

          {/* ── Main content — comic-panel narrative ── */}
          <div className="min-w-0">

            {/* Panel 1 — El problema */}
            <ComicPanel number="01" eyebrow="El conflicto" title="El problema" accent="gold">
              <p className="mb-4 leading-7 text-[color:var(--surface-foreground)]">{data.problem.intro}</p>
              <ul className="space-y-3">
                {data.problem.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--error)]/15 font-mono text-xs font-bold text-[color:var(--error)]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{b}</p>
                  </li>
                ))}
              </ul>
            </ComicPanel>

            {/* Panel 2 — La solución */}
            <ComicPanel number="02" eyebrow="La jugada" title="La solución" accent="cyan">
              <div className="space-y-4">
                {data.solution.map((para, i) => (
                  <p key={i} className="leading-7 text-[color:var(--surface-foreground)]">{para}</p>
                ))}
              </div>
            </ComicPanel>

            {/* Panel 3 — El resultado / estado actual */}
            <ComicPanel number="03" eyebrow="El desenlace" title={data.statusLabel === "Demo técnica" ? "Estado actual" : "El resultado"} accent="gold">
              <p className="mb-4 leading-7 text-[color:var(--surface-foreground)]">{data.result.summary}</p>
              <ul className="space-y-3">
                {data.result.points.map((pt, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--success)]" aria-hidden="true" />
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{pt}</p>
                  </li>
                ))}
              </ul>
            </ComicPanel>

            {/* Collapsible technical detail — real SSR'd HTML via <details>,
                crawlable without JS, expandable for technical readers without
                slowing down the business-facing comic narrative above. */}
            <Reveal>
              <details className="group mb-8 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-5 text-left transition hover:bg-[color:var(--surface-elevated)] sm:px-8">
                  <div>
                    <p className="section-eyebrow">Para perfiles técnicos</p>
                    <h2 className="mt-1 font-display text-xl font-bold text-[color:var(--foreground)] sm:text-2xl">
                      Detalle técnico
                    </h2>
                  </div>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-[color:var(--muted)] transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="border-t border-[color:var(--border)] px-6 py-6 sm:px-8">
                  <Section title="Contexto">
                    <p className="leading-7 text-[color:var(--surface-foreground)]">{data.context}</p>
                  </Section>

                  <Section title="Objetivos">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {data.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-cyan-soft)] font-mono text-xs font-bold text-[color:var(--accent-cyan)]">
                            {i + 1}
                          </span>
                          <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{obj}</p>
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Arquitectura">
                    <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                      {data.architecture.map((row, i) => (
                        <div
                          key={row.layer}
                          className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4 ${
                            i < data.architecture.length - 1 ? "border-b border-[color:var(--border)]" : ""
                          } ${i % 2 === 0 ? "bg-[color:var(--background)]" : "bg-[color:var(--surface-elevated)]"}`}
                        >
                          <div className="w-28 shrink-0">
                            <span className="font-mono text-xs font-bold text-[color:var(--accent-cyan)]">{row.layer}</span>
                          </div>
                          <div className="w-44 shrink-0">
                            <span className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--surface-foreground)]">
                              {row.tech}
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-[color:var(--muted)]">{row.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Funcionalidades">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data.features.map((f) => (
                        <div key={f.title} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
                          <h4 className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{f.title}</h4>
                          <p className="text-sm leading-6 text-[color:var(--muted)]">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Stack y para qué se usa">
                    <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                      <div className="grid grid-cols-3 gap-4 bg-[color:var(--surface-elevated)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                        <span>Tecnología</span><span>Categoría</span><span>Para qué</span>
                      </div>
                      {data.stack.map((s, i) => (
                        <div
                          key={s.name}
                          className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${
                            i < data.stack.length - 1 ? "border-b border-[color:var(--border)]" : ""
                          } ${i % 2 === 0 ? "bg-[color:var(--background)]" : "bg-[color:var(--surface-elevated)]"}`}
                        >
                          <span className="font-semibold text-[color:var(--foreground)]">{s.name}</span>
                          <span className="font-mono text-xs text-[color:var(--accent-cyan)]">{s.category}</span>
                          <span className="text-[color:var(--muted)]">{s.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Decisiones importantes">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {data.decisions.map((d) => (
                        <div key={d.title} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-5">
                          <p className="mb-2 text-sm font-bold text-[color:var(--primary)]">{d.title}</p>
                          <p className="text-sm leading-6 text-[color:var(--muted)]">{d.why}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Qué demuestra este proyecto">
                    <ul className="space-y-2">
                      {data.demonstrates.map((d, i) => (
                        <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-soft)] font-mono text-xs font-bold text-[color:var(--primary)]">→</span>
                          <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{d}</p>
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              </details>
            </Reveal>

            {/* CTA */}
            <Reveal>
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
            </Reveal>

          </div>
        </div>
      </div>
    </main>
  );
}
