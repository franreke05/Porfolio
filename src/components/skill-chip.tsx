"use client";

import { motion, useReducedMotion } from "motion/react";
import { chipReveal, dur, ease, viewport } from "@/lib/motion";

type SkillChipProps = {
  label: string;
  index?: number;
};

export function SkillChip({ label, index = 0 }: SkillChipProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-2.5 py-1.5 text-sm text-[color:var(--surface-foreground)] transition hover:border-[color:var(--accent-cyan)]/70 hover:text-[color:var(--foreground)]"
      variants={chipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{
        duration: reduceMotion ? 0 : dur.fast,
        ease: ease.soft,
        delay: reduceMotion ? 0 : index * 0.04,
      }}
    >
      {label}
    </motion.span>
  );
}
