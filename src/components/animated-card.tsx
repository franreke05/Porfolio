"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease, viewport } from "@/lib/motion";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  noHover?: boolean;
};

export function AnimatedCard({ children, className = "", delay = 0, noHover = false }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{
        duration: reduceMotion ? 0 : dur.normal,
        ease: ease.soft,
        delay: reduceMotion ? 0 : delay,
      }}
      whileHover={reduceMotion || noHover ? undefined : { y: -4 }}
    >
      {children}
    </motion.div>
  );
}
