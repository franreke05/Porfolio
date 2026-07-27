"use client";

import { motion, useReducedMotion } from "motion/react";

type PainPointsListProps = {
  items: readonly string[];
};

/**
 * "El problema habitual" list, shared by the service detail pages. Replaces
 * a stack of identical flat cream boxes with a numbered, hairline-divided
 * list — the same mono-number + text language already used by the FAQ list
 * and process steps elsewhere on the site, so it reads as one system
 * instead of one more repeated card shape.
 */
export function PainPointsList({ items }: PainPointsListProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
      {items.map((item, index) => (
        <motion.li
          key={item}
          className="flex gap-4 py-4 sm:gap-5"
          initial={reduceMotion ? undefined : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.35) }}
        >
          <span className="shrink-0 pt-0.5 font-mono text-xs font-bold text-[color:var(--primary)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-sm leading-6 text-[color:var(--muted)]">{item}</p>
        </motion.li>
      ))}
    </ul>
  );
}
