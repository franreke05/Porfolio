"use client";

import { ArrowRight, DatabaseZap, Globe2, Smartphone, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { dur, ease, viewport } from "@/lib/motion";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

type LayerType = "ui" | "state" | "logic" | "api" | "data" | "infra";

type Layer = {
  label: string;
  tech: string;
  type: LayerType;
};

type ArchBlock = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  layers: readonly Layer[];
};

const BLOCKS: readonly ArchBlock[] = [
  {
    id: "mobile",
    icon: Smartphone,
    title: "App Mobile",
    subtitle: "Kotlin / KMP · Android",
    layers: [
      { label: "UI nativa",         tech: "Jetpack Compose",  type: "ui"    },
      { label: "Estado local",      tech: "ViewModel",         type: "state" },
      { label: "Lógica de negocio", tech: "Use Cases",         type: "logic" },
      { label: "API REST",          tech: "Ktor · Retrofit",   type: "api"   },
      { label: "Auth",              tech: "JWT · OAuth",       type: "api"   },
      { label: "Notificaciones",    tech: "Firebase FCM",      type: "infra" },
      { label: "Publicación",       tech: "Play Store",        type: "infra" },
    ],
  },
  {
    id: "crm",
    icon: DatabaseZap,
    title: "CRM personalizado",
    subtitle: "PostgreSQL · Ktor · Compose",
    layers: [
      { label: "Roles y usuarios",  tech: "RBAC",              type: "ui"    },
      { label: "Clientes",          tech: "Entidades",          type: "state" },
      { label: "Estados y flujos",  tech: "Máq. de estados",   type: "logic" },
      { label: "Formularios",       tech: "Validación",         type: "ui"    },
      { label: "Reportes",          tech: "SQL queries",        type: "data"  },
      { label: "Base de datos",     tech: "PostgreSQL",         type: "data"  },
      { label: "Backups",           tech: "Automatizados",      type: "infra" },
    ],
  },
  {
    id: "web",
    icon: Globe2,
    title: "Web comercial",
    subtitle: "Next.js · Vercel · SEO",
    layers: [
      { label: "Mensaje claro",     tech: "Copywriting",        type: "ui"    },
      { label: "SEO técnico",       tech: "Metadata · OG",     type: "logic" },
      { label: "Rendimiento",       tech: "Core Web Vitals",    type: "logic" },
      { label: "Analytics",         tech: "Vercel Analytics",   type: "data"  },
      { label: "Formularios",       tech: "Server Actions",     type: "api"   },
      { label: "Hosting",           tech: "Vercel · CDN",       type: "infra" },
      { label: "Conversión",        tech: "Medición real",      type: "data"  },
    ],
  },
] as const;

// ─────────────────────────────────────────────
// Layer styling helpers
// ─────────────────────────────────────────────

const DOT_COLOR: Record<LayerType, string> = {
  ui:    "bg-[color:var(--primary)]    border-[color:var(--primary)]/40",
  state: "bg-[color:var(--primary)]    border-[color:var(--primary)]/40",
  logic: "bg-[color:var(--primary)]    border-[color:var(--primary)]/40",
  api:   "bg-[color:var(--accent-cyan)] border-[color:var(--accent-cyan)]/40",
  data:  "bg-[color:var(--accent-cyan)] border-[color:var(--accent-cyan)]/40",
  infra: "bg-[color:var(--muted)]       border-[color:var(--muted)]/30",
};

const LABEL_COLOR: Record<LayerType, string> = {
  ui:    "text-[color:var(--foreground)]",
  state: "text-[color:var(--foreground)]",
  logic: "text-[color:var(--foreground)]",
  api:   "text-[color:var(--accent-cyan)]",
  data:  "text-[color:var(--accent-cyan)]",
  infra: "text-[color:var(--muted)]",
};

// ─────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────

function LayerRow({
  layer,
  index,
  isLast,
}: {
  layer: Layer;
  index: number;
  isLast: boolean;
}) {
  const rm = useReducedMotion();

  return (
    <motion.div
      className="group/row relative flex items-center gap-3 py-[7px] pl-7"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{
        duration: rm ? 0 : dur.normal,
        ease: ease.soft,
        delay: rm ? 0 : 0.18 + index * 0.06,
      }}
    >
      {/* Dot */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border ${DOT_COLOR[layer.type]} ring-2 ring-[color:var(--surface)] transition-shadow duration-300 group-hover/arch:ring-[color:var(--surface-elevated)]`}
        aria-hidden="true"
      />

      {/* Connector segment — vertical line piece between this dot and the next */}
      {!isLast && (
        <span
          className="pointer-events-none absolute left-[3.5px] top-[calc(50%+4px)] h-[calc(100%-8px+7px)] w-px bg-[color:var(--border)] opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <span className={`text-sm leading-none font-medium ${LABEL_COLOR[layer.type]}`}>
        {layer.label}
      </span>

      {/* Tech tag — appears on card hover */}
      <span className="ml-auto font-mono text-[10px] text-[color:var(--muted)] opacity-0 transition-opacity duration-200 group-hover/arch:opacity-100 whitespace-nowrap">
        {layer.tech}
      </span>
    </motion.div>
  );
}

function ArchCard({ block, cardIndex }: { block: ArchBlock; cardIndex: number }) {
  const rm = useReducedMotion();
  const Icon = block.icon;

  return (
    <motion.div
      className="group/arch relative flex flex-col rounded-xl border border-[color:var(--border)] bg-[linear-gradient(148deg,var(--surface-elevated),var(--surface))] p-5 transition-colors duration-300 hover:border-[color:var(--border-hover)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{
        duration: rm ? 0 : dur.normal,
        ease: ease.soft,
        delay: rm ? 0 : cardIndex * 0.1,
      }}
    >
      {/* Top shimmer line — subtly highlights on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-0 transition-opacity duration-500 group-hover/arch:opacity-40"
        aria-hidden="true"
      />

      {/* Card header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--primary)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[color:var(--foreground)]">{block.title}</h3>
          <p className="mt-0.5 font-mono text-[10px] text-[color:var(--muted)]">{block.subtitle}</p>
        </div>
        <span className="ml-auto font-mono text-[10px] text-[color:var(--muted)] opacity-60">
          {block.layers.length} capas
        </span>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px w-full bg-[color:var(--border)]" aria-hidden="true" />

      {/* Layer list */}
      <div className="relative flex-1">
        {block.layers.map((layer, i) => (
          <LayerRow
            key={layer.label}
            layer={layer}
            index={i}
            isLast={i === block.layers.length - 1}
          />
        ))}
      </div>

      {/* Bottom badge */}
      <div className="mt-5 flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2">
        <span className="section-eyebrow text-[9px]">Sistema completo</span>
        <span className="font-mono text-[10px] text-[color:var(--accent-cyan)] opacity-0 transition-opacity duration-200 group-hover/arch:opacity-100">
          ver proyectos →
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

export function RealArchSection() {
  const rm = useReducedMotion();

  return (
    <section id="arquitectura" className="section-band px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-6xl">

        {/* Header */}
        <motion.div
          className="mb-12 max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: rm ? 0 : dur.normal, ease: ease.premium }}
        >
          <p className="section-eyebrow mb-4">Arquitectura real</p>
          <h2 className="text-balance text-3xl font-semibold leading-[1.14] text-[color:var(--foreground)] sm:text-4xl">
            No solo pantallas bonitas.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-7 text-[color:var(--muted)]">
            Cada proyecto lo diseño pensando en datos, usuarios, mantenimiento, publicación y
            evolución. Las capas que ves debajo son las que se despliegan en producción.
          </p>
        </motion.div>

        {/* Architecture blocks */}
        <div className="grid gap-5 lg:grid-cols-3">
          {BLOCKS.map((block, i) => (
            <ArchCard key={block.id} block={block} cardIndex={i} />
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: rm ? 0 : dur.normal, ease: ease.premium, delay: rm ? 0 : 0.2 }}
        >
          <div className="relative overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-8 text-center">
            {/* Background radial glow */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(82,208,220,0.07),transparent)]"
              aria-hidden="true"
            />

            <p className="section-eyebrow mb-3 justify-center">Pensar antes de construir</p>
            <p className="mx-auto max-w-xl text-pretty text-lg font-semibold leading-relaxed text-[color:var(--foreground)]">
              &ldquo;Si tu proyecto necesita estructura, no solo diseño, podemos hablar.&rdquo;
            </p>
            <Link
              href="#contacto"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--border-hover)] bg-[color:var(--surface-elevated)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-px hover:border-[color:var(--primary)]/70 hover:text-[color:var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
            >
              Agendar llamada
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
