"use client";

import { ArrowUpRight, BadgeCheck, LockKeyhole, Sparkles } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ProjectVisual } from "@/components/project-visual";
import { SpotlightCard } from "@/components/spotlight-card";
import type { Project } from "@/lib/site-data";
import { spring } from "@/lib/motion";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const projectStatusLabel: Record<Project["status"], string> = {
  "technical-demo": "Demo técnica",
  "documented-case": "Caso documentado",
  "own-system": "Sistema propio",
  "anonymous-project": "Proyecto anonimizado",
  "real-lab": "Laboratorio real",
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, spring.tilt);
  const springY = useSpring(pointerY, spring.tilt);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || window.matchMedia("(max-width: 767px)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <SpotlightCard className="group/project h-full rounded-lg">
      <motion.article
        className="project-card-shell relative flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--border)] bg-[linear-gradient(148deg,var(--surface-elevated),var(--surface))] transition-colors duration-300 group-hover/project:border-[color:var(--primary)]/50"
        style={
          shouldReduceMotion
            ? undefined
            : { rotateX, rotateY, boxShadow: "0 4px 28px rgba(0,0,0,0.3)" }
        }
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -8,
                boxShadow:
                  "0 0 0 1px rgba(195,147,86,0.4), 0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(195,147,86,0.14)",
              }
        }
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Animated gradient top line — draws in on scroll */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-[linear-gradient(90deg,var(--primary),var(--accent-cyan),var(--primary))]"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.85 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
        />

        <Link
          href={`/proyectos/${project.caseStudySlug ?? project.id}`}
          className="flex h-full flex-col p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          aria-label={`Abrir caso de proyecto: ${project.title}`}
        >
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--primary)]/35 bg-[rgba(195,147,86,0.1)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--primary)]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              #{String(index + 1).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-2.5 py-1.5 text-xs text-[color:var(--muted)]">
              {project.visibility === "anonymous" ? (
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {projectStatusLabel[project.status]}
            </span>
          </div>

          <ProjectVisual project={project} />

          <div className="flex flex-1 flex-col pt-5">
            <p className="mb-2 text-xs font-semibold uppercase text-[color:var(--primary)]">
              {project.projectType}
            </p>
            <h4 className="font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)]">
              {project.title}
            </h4>

            {/* Metric chips — stagger in on scroll */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {project.metrics.map((metric, metricIndex) => (
                <motion.span
                  key={metric}
                  className="min-h-9 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-2 py-1.5 text-xs font-semibold text-[color:var(--surface-foreground)] transition group-hover/project:border-[color:var(--primary)]/45"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.3, delay: metricIndex * 0.06 }}
                >
                  {metric}
                </motion.span>
              ))}
            </div>

            {/* Problema / Solución / Resultado */}
            <div className="mt-4 grid gap-3">
              <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)]/62 p-3">
                <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">Problema</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{project.problem}</p>
              </div>
              <div className="rounded-md border border-[color:var(--border)] bg-[rgba(195,147,86,0.06)] p-3">
                <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">Solución</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--surface-foreground)]">{project.solution}</p>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-[color:var(--border)] bg-[rgba(101,214,218,0.06)] p-3">
              <p className="text-xs font-semibold uppercase text-[color:var(--accent-cyan)]">Resultado</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--surface-foreground)]">{project.result}</p>
            </div>

            {/* Stack chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item, stackIndex) => (
                <motion.span
                  key={item}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-2 py-1 text-xs text-[color:var(--surface-foreground)] transition group-hover/project:border-[color:var(--primary)]/40"
                  initial={false}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ duration: 0.16, delay: stackIndex * 0.01 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>

            {/* CTA — goes solid gold on hover */}
            <div className="mt-auto pt-5">
              <div className="flex min-h-11 items-center justify-between rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 text-sm font-semibold text-[color:var(--foreground)] transition-all duration-300 group-hover/project:border-[color:var(--primary)] group-hover/project:bg-[color:var(--primary)] group-hover/project:text-[color:var(--on-primary)]">
                <span>{project.cta}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    </SpotlightCard>
  );
}
