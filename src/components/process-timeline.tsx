"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { dur, ease, viewport } from "@/lib/motion";
import { processSteps } from "@/lib/site-data";

export function ProcessTimeline() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 35%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <div ref={ref} className="relative grid gap-4 lg:grid-cols-4">
      {/* Track line */}
      <div className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-[color:var(--border)] md:block lg:left-0 lg:top-12 lg:h-px lg:w-full" />
      {!reduceMotion && (
        <motion.div
          className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px origin-top bg-[linear-gradient(180deg,var(--accent-cyan),var(--primary))] md:block lg:left-0 lg:top-12 lg:h-px lg:w-full lg:origin-left"
          style={scaleY ? { scaleY, scaleX: scaleY } : undefined}
          aria-hidden="true"
        />
      )}

      {processSteps.map((step, index) => (
        <motion.article
          key={step.title}
          className="card-surface relative p-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: reduceMotion ? 0 : dur.normal, ease: ease.soft, delay: index * 0.08 }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
        >
          {/* Step number badge – technical ring style */}
          <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] font-mono text-sm font-bold text-[color:var(--accent-cyan)]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-base font-semibold text-[color:var(--foreground)]">{step.title}</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
            {step.output}
          </p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{step.text}</p>
        </motion.article>
      ))}
    </div>
  );
}
