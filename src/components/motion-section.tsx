"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { dur, ease, viewport } from "@/lib/motion";

type MotionSectionProps = {
  children: ReactNode;
  as?: "section" | "div";
  delay?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
};

/**
 * Scroll-enter fade-up wrapper.
 * Fix: `initial` must carry the hidden state so whileInView has a real start.
 * Previous `initial={false}` disabled the entry animation entirely.
 */
export function MotionSection({
  as = "section",
  children,
  className,
  delay = 0,
  ...props
}: MotionSectionProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "section" ? motion.section : motion.div;

  // When reduced-motion is active, skip the hidden initial state entirely
  // so elements render visible immediately without any invisible flash.
  if (reduceMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: dur.normal, ease: ease.premium, delay }}
      {...props}
    >
      {children}
    </Component>
  );
}
