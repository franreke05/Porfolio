"use client";

import {
  Braces,
  Database,
  Film,
  ImageIcon,
  Layers3,
  Play,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/site-data";

type ProjectCaseExperienceProps = {
  project: Project;
};

const projectTone: Record<Project["image"], { label: string }> = {
  mobile: { label: "Mobile product" },
  dashboard: { label: "CRM system" },
  browser: { label: "Web premium" },
  subscription: { label: "Private area" },
};

const caseFlow = [
  "Brief y objetivo",
  "Mapa de pantallas",
  "Arquitectura y datos",
  "Demo y entrega",
];

export function ProjectCaseExperience({ project }: ProjectCaseExperienceProps) {
  return (
    <>
      <AnimatedHeroMedia project={project} />
      <AnimatedProjectMediaShowcase project={project} />
      <AnimatedProcessBoard />
    </>
  );
}

export function AnimatedHeroMedia({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] p-4"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-60" />
      <motion.div
        className="absolute -left-28 top-16 h-24 w-[150%] rotate-[-10deg] bg-[linear-gradient(90deg,transparent,rgba(243,232,215,0.1),transparent)]"
        animate={reduceMotion ? undefined : { x: ["-18%", "18%"], opacity: [0, 1, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between gap-4 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] px-4 py-3">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className={`h-2.5 w-2.5 rounded-sm ${
                item === 0
                  ? "bg-[color:var(--primary)]"
                  : item === 1
                    ? "bg-[color:var(--secondary)]"
                    : "bg-[color:var(--muted)]/45"
              }`}
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.6, delay: item * 0.18, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="min-w-0 max-w-[11rem] truncate font-mono text-xs text-[color:var(--muted)] sm:max-w-none">
          demo/{project.id}
        </p>
      </div>

      <div className="relative mt-4 grid min-h-[330px] gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          className="min-w-0 rounded-md border border-[color:var(--outline)] bg-[linear-gradient(145deg,rgba(195,147,86,0.18),rgba(8,11,15,0.8))] p-5"
          whileHover={reduceMotion ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <motion.div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-[color:var(--primary)]/40 bg-[rgba(8,11,15,0.7)] text-lg font-semibold text-[color:var(--primary)]"
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {getInitials(project.title)}
          </motion.div>
          <p className="text-sm font-semibold uppercase text-[color:var(--primary)]">{project.projectType}</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight text-[color:var(--foreground)]">
            Identidad del caso
          </h2>
          <p className="mt-10 max-w-[18rem] text-sm leading-6 text-[color:var(--surface-foreground)] sm:max-w-none">
            Marca operativa, contexto y narrativa del producto presentados sin depender de capturas pesadas.
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[320px] min-w-0 overflow-hidden rounded-md border border-[color:var(--outline)] bg-[color:var(--background)]"
          whileHover={reduceMotion ? undefined : { scale: 1.012 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          <div className="absolute inset-4 rounded-md border border-[color:var(--outline)] bg-[rgba(18,24,32,0.88)] p-5">
            <div className="mb-5 flex items-center justify-between">
              <motion.div
                className="h-2 w-24 rounded-sm bg-[color:var(--primary)]"
                animate={reduceMotion ? undefined : { width: ["4rem", "8rem", "4rem"] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <Film className="h-5 w-5 text-[color:var(--primary)]" aria-hidden="true" />
            </div>
            <div className="grid h-[210px] place-items-center rounded-md border border-[color:var(--outline)] bg-[linear-gradient(135deg,rgba(195,147,86,0.08),rgba(8,11,15,0.92))]">
              <motion.div
                className="grid h-16 w-16 place-items-center rounded-full border border-[color:var(--primary)] bg-[rgba(195,147,86,0.12)] text-[color:var(--primary)]"
                animate={reduceMotion ? undefined : { boxShadow: ["0 0 0 0 rgba(195,147,86,0.28)", "0 0 0 18px rgba(195,147,86,0)", "0 0 0 0 rgba(195,147,86,0)"] }}
                transition={{ duration: 2.1, repeat: Infinity }}
              >
                <Play className="h-7 w-7 fill-current" aria-hidden="true" />
              </motion.div>
            </div>
          </div>
          <p className="absolute bottom-5 left-5 right-5 max-w-[18rem] text-sm font-semibold leading-5 text-[color:var(--surface-foreground)] sm:max-w-none">
            Recorrido visual pensado para enseñar flujo, pantallas clave y resultado de negocio.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AnimatedProjectMediaShowcase({ project }: { project: Project }) {
  return (
    <motion.section
      className="w-full min-w-0 max-w-full rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] p-5"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[color:var(--primary)]">Galería del caso</p>
          <h2 className="mt-2 max-w-[18rem] text-balance text-2xl font-semibold text-[color:var(--foreground)] sm:max-w-none">
            Capturas, vídeo y piezas de marca
          </h2>
        </div>
        <p className="text-sm text-[color:var(--muted)]">{projectTone[project.image].label}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MediaCard title="Pantalla principal" icon={Smartphone} index={0} />
        <MediaCard title="Flujo clave" icon={Layers3} index={1} />
        <MediaCard title="Sistema visual" icon={ImageIcon} index={2} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <VideoPanel />
        <ArchitecturePanel />
      </div>
    </motion.section>
  );
}

function MediaCard({
  title,
  icon: Icon,
  index,
}: {
  title: string;
  icon: LucideIcon;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group/media min-w-0 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-4"
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
        <Icon className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
      </div>
      <div className="space-y-2 overflow-hidden rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)] p-3">
        <motion.div
          className="h-2 w-16 rounded-sm bg-[color:var(--primary)]"
          animate={reduceMotion ? undefined : { width: ["4rem", "6rem", "4rem"] }}
          transition={{ duration: 2.7, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-2.5 rounded-sm bg-[color:var(--surface-foreground)]/65" />
        <div className="h-2.5 w-4/5 rounded-sm bg-[color:var(--muted)]/42" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-16 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] transition group-hover/media:border-[color:var(--primary)]/50" />
          <div className="h-16 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] transition group-hover/media:border-[color:var(--primary)]/50" />
        </div>
      </div>
    </motion.div>
  );
}

function VideoPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="min-w-0 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-4"
      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 170, damping: 22 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">Video demo</p>
        <Film className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
      </div>
      <div className="grid aspect-video place-items-center rounded-md border border-[color:var(--outline)] bg-[linear-gradient(135deg,rgba(195,147,86,0.12),rgba(18,24,32,0.5),rgba(8,11,15,0.9))]">
        <motion.div
          className="grid h-14 w-14 place-items-center rounded-full border border-[color:var(--primary)] bg-[rgba(8,11,15,0.72)] text-[color:var(--primary)]"
          animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Play className="h-6 w-6 fill-current" aria-hidden="true" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ArchitecturePanel() {
  return (
    <div className="min-w-0 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-4">
      <p className="mb-4 text-sm font-semibold text-[color:var(--foreground)]">Arquitectura</p>
      <div className="space-y-3">
        <ArchitectureRow icon={Braces} label="Frontend / Mobile" index={0} />
        <ArchitectureRow icon={Database} label="Datos y API" index={1} />
        <ArchitectureRow icon={Layers3} label="Entrega y soporte" index={2} />
      </div>
    </div>
  );
}

function ArchitectureRow({
  icon: Icon,
  label,
  index,
}: {
  icon: LucideIcon;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)] p-3"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
    >
      <Icon className="h-4 w-4 text-[color:var(--primary)]" aria-hidden="true" />
      <span className="text-sm text-[color:var(--surface-foreground)]">{label}</span>
    </motion.div>
  );
}

export function AnimatedProcessBoard() {
  return (
    <motion.section
      className="w-full min-w-0 max-w-full rounded-lg border border-[color:var(--outline)] bg-[color:var(--surface)] p-5"
    >
      <p className="text-sm font-semibold uppercase text-[color:var(--primary)]">Proceso del caso</p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {caseFlow.map((step, index) => (
          <motion.div
            key={step}
            className="rounded-md border border-[color:var(--outline)] bg-[color:var(--background)] p-4"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--primary)] text-sm font-bold text-[color:var(--on-primary)]">
              {index + 1}
            </div>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">{step}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
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
