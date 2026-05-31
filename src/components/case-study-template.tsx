"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, LockKeyhole } from "lucide-react";
import { dur, ease, viewport } from "@/lib/motion";
import type { CaseStudyData } from "@/lib/case-studies";

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
// CSS Mockups
// ─────────────────────────────────────────────
function MobileMockup({ title }: { title: string }) {
  return (
    <div className="relative mx-auto w-[200px]" aria-hidden="true">
      {/* Phone frame */}
      <div className="rounded-[28px] border-2 border-[color:var(--border-hover)] bg-[color:var(--background)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Notch */}
        <div className="mb-2 flex justify-center">
          <div className="h-2 w-12 rounded-full bg-[color:var(--border-hover)]" />
        </div>
        {/* Screen content */}
        <div className="space-y-2 rounded-[20px] bg-[color:var(--surface)] p-3">
          {/* Status bar */}
          <div className="flex items-center justify-between px-1">
            <div className="h-1.5 w-8 rounded-full bg-[color:var(--muted)]/40" />
            <div className="h-1.5 w-12 rounded-full bg-[color:var(--muted)]/40" />
          </div>
          {/* App header */}
          <div className="rounded-lg bg-[color:var(--surface-elevated)] p-2">
            <div className="h-2 w-20 rounded-full bg-[color:var(--primary)]/60" />
            <div className="mt-1 h-1.5 w-14 rounded-full bg-[color:var(--muted)]/40" />
          </div>
          {/* Content rows */}
          {[80, 65, 90, 55, 75].map((w, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] p-2">
              <div className="h-4 w-4 shrink-0 rounded-md bg-[color:var(--accent-cyan)]/30" />
              <div className="flex-1 space-y-1">
                <div className={`h-1.5 rounded-full bg-[color:var(--surface-foreground)]/50`} style={{ width: `${w}%` }} />
                <div className="h-1 w-10 rounded-full bg-[color:var(--muted)]/30" />
              </div>
              <div className="h-3 w-6 rounded-full bg-[color:var(--primary)]/40 text-[0px]">.</div>
            </div>
          ))}
          {/* Bottom nav */}
          <div className="flex justify-around border-t border-[color:var(--border)] pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-4 w-4 rounded-md ${i === 1 ? "bg-[color:var(--primary)]/60" : "bg-[color:var(--muted)]/20"}`} />
            ))}
          </div>
        </div>
        {/* Home indicator */}
        <div className="mt-2 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-[color:var(--border-hover)]" />
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[color:var(--error)]/60" />
          <div className="h-2 w-2 rounded-full bg-[color:var(--primary)]/60" />
          <div className="h-2 w-2 rounded-full bg-[color:var(--success)]/60" />
        </div>
        <div className="h-2 w-24 rounded-full bg-[color:var(--muted)]/30" />
        <div className="h-5 w-16 rounded-md bg-[color:var(--accent-soft)]" />
      </div>
      <div className="flex h-48 sm:h-56">
        {/* Sidebar */}
        <div className="w-24 shrink-0 space-y-1 border-r border-[color:var(--border)] bg-[color:var(--surface)] p-2">
          {["Clientes", "Tickets", "Reportes", "Usuarios", "Config"].map((label, i) => (
            <div key={label} className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-[color:var(--accent-soft)]" : ""}`}>
              <div className={`h-1.5 rounded-full ${i === 0 ? "bg-[color:var(--primary)]" : "bg-[color:var(--muted)]/40"}`} style={{ width: `${60 + i * 5}%` }} />
            </div>
          ))}
        </div>
        {/* Main content */}
        <div className="flex-1 space-y-2 p-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded-full bg-[color:var(--foreground)]/50" />
            <div className="h-5 w-16 rounded-md bg-[color:var(--accent-cyan)]/20" />
          </div>
          {/* Table rows */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-2 rounded-md bg-[color:var(--surface)] px-3 py-1.5">
              {[70, 50, 80, 40].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-[color:var(--muted)]/30" style={{ width: `${w}%` }} />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-2 rounded-md border border-[color:var(--border)] px-3 py-1.5">
                {[85, 60, 45, 30].map((w, i) => (
                  <div key={i} className={`h-1.5 rounded-full ${i === 2 ? "bg-[color:var(--accent-cyan)]/40" : "bg-[color:var(--surface-foreground)]/30"}`} style={{ width: `${w}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--error)]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--primary)]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--success)]/60" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)]/60" />
          <div className="h-1.5 w-32 rounded-full bg-[color:var(--muted)]/40" />
        </div>
      </div>
      {/* Page content */}
      <div className="space-y-0">
        {/* Hero block */}
        <div className="bg-[color:var(--surface)] px-6 py-5">
          <div className="mb-2 h-4 w-48 rounded-full bg-[color:var(--foreground)]/60" />
          <div className="h-2.5 w-full max-w-xs rounded-full bg-[color:var(--muted)]/40" />
          <div className="mt-1 h-2.5 w-48 rounded-full bg-[color:var(--muted)]/30" />
          <div className="mt-4 h-8 w-28 rounded-lg bg-[color:var(--primary)]/50" />
        </div>
        {/* Service grid */}
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-2">
              <div className="mb-1.5 h-6 w-6 rounded-md bg-[color:var(--accent-cyan)]/20" />
              <div className="h-2 w-full rounded-full bg-[color:var(--foreground)]/40" />
              <div className="mt-1 h-1.5 w-3/4 rounded-full bg-[color:var(--muted)]/30" />
            </div>
          ))}
        </div>
        {/* Contact strip */}
        <div className="flex items-center justify-between bg-[color:var(--surface-elevated)] px-4 py-3">
          <div className="h-2 w-32 rounded-full bg-[color:var(--foreground)]/30" />
          <div className="h-6 w-20 rounded-md bg-[color:var(--primary)]/40" />
        </div>
      </div>
    </div>
  );
}

function SubscriptionMockup() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--error)]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--primary)]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--success)]/60" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]/60" />
          <div className="h-1.5 w-28 rounded-full bg-[color:var(--muted)]/40" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-[color:var(--accent-soft)] px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
          <div className="h-1.5 w-8 rounded-full bg-[color:var(--primary)]/60" />
        </div>
      </div>
      {/* Member area */}
      <div className="space-y-2 p-4">
        {/* Welcome banner */}
        <div className="rounded-lg bg-[color:var(--accent-soft)] px-4 py-3">
          <div className="h-2 w-28 rounded-full bg-[color:var(--primary)]" />
          <div className="mt-1 h-1.5 w-40 rounded-full bg-[color:var(--primary)]/50" />
        </div>
        {/* Benefits grid */}
        <div className="grid grid-cols-2 gap-2">
          {["Selección del mes", "Descuento socio", "Contenido exclusivo", "Próxima entrega"].map((label, i) => (
            <div key={label} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-2.5">
              <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-md bg-[color:var(--accent-cyan)]/20">
                <div className="h-2 w-2 rounded-sm bg-[color:var(--accent-cyan)]/60" />
              </div>
              <div className="h-1.5 rounded-full bg-[color:var(--foreground)]/50" style={{ width: `${60 + i * 8}%` }} />
              <div className="mt-0.5 h-1 w-3/4 rounded-full bg-[color:var(--muted)]/30" />
            </div>
          ))}
        </div>
        {/* Plan badge */}
        <div className="flex items-center justify-between rounded-lg border border-[color:var(--primary)]/30 bg-[color:var(--accent-soft)] px-3 py-2">
          <div className="h-1.5 w-20 rounded-full bg-[color:var(--primary)]/60" />
          <div className="h-5 w-14 rounded-md bg-[color:var(--primary)]/40" />
        </div>
      </div>
    </div>
  );
}

function ProjectMockup({ type, title }: { type: CaseStudyData["mockupType"]; title: string }) {
  if (type === "mobile")       return <MobileMockup title={title} />;
  if (type === "dashboard")    return <DashboardMockup />;
  if (type === "subscription") return <SubscriptionMockup />;
  return <BrowserMockup />;
}

// ─────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="mb-10">
        <h2 className="mb-5 flex items-center gap-3 text-xl font-semibold text-[color:var(--foreground)]">
          <span className="h-px w-6 shrink-0 bg-[color:var(--accent-cyan)]" aria-hidden="true" />
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

// ─────────────────────────────────────────────
// Main template
// ─────────────────────────────────────────────
export function CaseStudyTemplate({ data }: { data: CaseStudyData }) {
  const VisibilityIcon = data.visibility === "anonymous" ? LockKeyhole : BadgeCheck;

  return (
    <main className="page-shell min-h-screen w-full min-w-0 overflow-hidden">
      {/* ── Top nav ── */}
      <div className="sticky top-16 z-30 border-b border-[color:var(--border)] bg-[color:var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <Link
            href="/#proyectos"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:-translate-y-px"
          >
            <ArrowLeft className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
            Proyectos
          </Link>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
              <li><Link href="/" className="hover:text-[color:var(--foreground)] transition">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/#proyectos" className="hover:text-[color:var(--foreground)] transition">Proyectos</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[color:var(--foreground)]" aria-current="page">{data.h1.split("—")[0].trim()}</li>
            </ol>
          </nav>

          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--primary)]/50 px-3 py-2 text-sm font-semibold text-[color:var(--primary)] transition hover:border-[color:var(--primary)] hover:bg-[color:var(--accent-soft)]"
          >
            <span className="hidden sm:inline">Hablar del proyecto</span>
            <span className="sm:hidden">Contacto</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-[calc(100vw-2.5rem)] py-10 sm:max-w-6xl sm:px-6">

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

          {/* Right: mockup */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <ProjectMockup type={data.mockupType} title={data.h1} />
          </motion.div>
        </div>

        {/* ── Two-column content ── */}
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
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

          {/* ── Main content ── */}
          <div className="min-w-0 space-y-2">

            {/* Context */}
            <Section title="Contexto">
              <p className="leading-7 text-[color:var(--surface-foreground)]">{data.context}</p>
            </Section>

            {/* Problem */}
            <Section title="El problema">
              <p className="mb-4 leading-7 text-[color:var(--surface-foreground)]">{data.problem.intro}</p>
              <ul className="space-y-2">
                {data.problem.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--error)]/15 font-mono text-xs font-bold text-[color:var(--error)]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{b}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Objectives */}
            <Section title="Objetivos">
              <ul className="grid gap-2 sm:grid-cols-2">
                {data.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-cyan-soft)] font-mono text-xs font-bold text-[color:var(--accent-cyan)]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{obj}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Solution */}
            <Section title="Solución">
              <div className="space-y-4">
                {data.solution.map((para, i) => (
                  <p key={i} className="leading-7 text-[color:var(--surface-foreground)]">{para}</p>
                ))}
              </div>
            </Section>

            {/* Architecture */}
            <Section title="Arquitectura">
              <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                {data.architecture.map((row, i) => (
                  <div
                    key={row.layer}
                    className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4 ${
                      i < data.architecture.length - 1 ? "border-b border-[color:var(--border)]" : ""
                    } ${i % 2 === 0 ? "bg-[color:var(--surface)]" : "bg-[color:var(--background)]"}`}
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

            {/* Features */}
            <Section title="Funcionalidades">
              <div className="grid gap-3 sm:grid-cols-2">
                {data.features.map((f) => (
                  <div key={f.title} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <h3 className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{f.title}</h3>
                    <p className="text-sm leading-6 text-[color:var(--muted)]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Stack detail */}
            <Section title="Stack y decisiones tecnológicas">
              <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                <div className="grid grid-cols-3 gap-4 bg-[color:var(--surface-elevated)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                  <span>Tecnología</span><span>Categoría</span><span>Para qué</span>
                </div>
                {data.stack.map((s, i) => (
                  <div
                    key={s.name}
                    className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${
                      i < data.stack.length - 1 ? "border-b border-[color:var(--border)]" : ""
                    } ${i % 2 === 0 ? "bg-[color:var(--surface)]" : "bg-[color:var(--background)]"}`}
                  >
                    <span className="font-semibold text-[color:var(--foreground)]">{s.name}</span>
                    <span className="font-mono text-xs text-[color:var(--accent-cyan)]">{s.category}</span>
                    <span className="text-[color:var(--muted)]">{s.purpose}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Decisions */}
            <Section title="Decisiones importantes">
              <div className="grid gap-4 sm:grid-cols-2">
                {data.decisions.map((d) => (
                  <div key={d.title} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="mb-2 text-sm font-bold text-[color:var(--primary)]">{d.title}</p>
                    <p className="text-sm leading-6 text-[color:var(--muted)]">{d.why}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Result */}
            <Section title="Resultado">
              <p className="mb-4 leading-7 text-[color:var(--surface-foreground)]">{data.result.summary}</p>
              <ul className="space-y-2">
                {data.result.points.map((pt, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--success)]" aria-hidden="true" />
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{pt}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Demonstrates */}
            <Section title="Qué demuestra este proyecto">
              <ul className="space-y-2">
                {data.demonstrates.map((d, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-soft)] font-mono text-xs font-bold text-[color:var(--primary)]">→</span>
                    <p className="text-sm leading-6 text-[color:var(--surface-foreground)]">{d}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* CTA */}
            <Reveal>
              <div className="relative mt-4 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-10 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(82,208,220,0.07),transparent)]" aria-hidden="true" />
                <p className="section-eyebrow mb-3 justify-center">¿Necesitas algo similar?</p>
                <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">
                  Cuéntame tu proyecto
                </h2>
                <p className="mx-auto mt-3 max-w-md text-pretty text-[color:var(--muted)]">
                  Si tienes una idea, un problema de gestión o una app en mente, puedo proponerte un camino claro desde el primer mensaje.
                </p>
                <Link
                  href="/#contacto"
                  className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] px-6 text-sm font-semibold text-[color:var(--on-primary)] transition hover:bg-[color:var(--primary-hover)] hover:-translate-y-px"
                >
                  Agendar llamada
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </main>
  );
}
