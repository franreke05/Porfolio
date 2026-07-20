"use client";

import { motion, useReducedMotion } from "motion/react";

type CountUpProps = {
  to: number;
  duration?: number;
  className?: string;
  separator?: string;
};

/**
 * A mechanical-odometer numeral reveal — each digit flips into place
 * (translateY + rotateX) on scroll-into-view, staggered left to right, like
 * the wheels of a physical counter settling. Replaces the old spring-tween
 * CountUp (a reactbits.dev adaptation) with a genuinely bespoke effect.
 */
export function CountUp({ to, duration = 1, className = "", separator = "" }: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const formatted = separator
    ? Intl.NumberFormat("es-ES", { useGrouping: true }).format(to).replace(/\./g, separator)
    : String(to);
  const chars = formatted.split("");
  const stagger = Math.max(duration / Math.max(chars.length, 1), 0.05);

  return (
    <span className={`inline-flex overflow-hidden ${className}`} aria-label={formatted}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          aria-hidden="true"
          initial={reduceMotion ? undefined : { y: "60%", opacity: 0, rotateX: -60 }}
          whileInView={{ y: "0%", opacity: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: reduceMotion ? 0 : i * stagger,
          }}
          style={{ transformOrigin: "50% 100%" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
