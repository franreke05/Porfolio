"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MarkerHighlightProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A single accent underline stroke draws in under the wrapped text on
 * scroll-into-view via SVG pathLength. Contrast comes from the underline
 * plus an italic weight shift on the text itself — not a color-fill
 * gradient. Replaces the old GradientText (a reactbits.dev adaptation).
 */
export function MarkerHighlight({ children, className = "" }: MarkerHighlightProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={`relative inline-block whitespace-nowrap font-display italic ${className}`}>
      {children}
      <svg
        className="pointer-events-none absolute -bottom-1 left-0 h-[0.3em] w-full overflow-visible"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M1 8.5 C 25 3, 75 10, 99 5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}
