"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type LetterpressStampProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A hard, solid offset "stamp" sits behind the button at rest — a print
 * shadow, not a blur. On press, the offset collapses to zero and the button
 * itself shifts into it, like a physical letterpress stamp hitting paper.
 * Replaces the old canvas-particle ClickSpark (a dark-tech glow effect).
 */
export function LetterpressStamp({ children, className }: LetterpressStampProps) {
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();

  const release = () => setPressed(false);

  return (
    <div className={`relative inline-flex ${className ?? ""}`}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] bg-[color:var(--foreground)]"
        animate={reduceMotion ? undefined : { x: pressed ? 0 : 4, y: pressed ? 0 : 4 }}
        transition={{ type: "spring", stiffness: 620, damping: 32 }}
      />
      <motion.div
        className="relative"
        animate={reduceMotion ? undefined : { x: pressed ? 0 : -1, y: pressed ? 0 : -1 }}
        transition={{ type: "spring", stiffness: 620, damping: 32 }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={release}
        onPointerLeave={release}
      >
        {children}
      </motion.div>
    </div>
  );
}
