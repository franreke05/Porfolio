"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, useCallback } from "react";
import type { ReactNode } from "react";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
};

export function FlipCard({ front, back, className = "" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const onEnter = useCallback(() => setFlipped(true), []);
  const onLeave = useCallback(() => setFlipped(false), []);
  const onTap = useCallback(() => {
    // click-to-toggle only on touch; desktop relies on hover
    if (!window.matchMedia("(pointer: fine)").matches) {
      setFlipped((f) => !f);
    }
  }, []);

  if (shouldReduceMotion) {
    return (
      <div
        className={`relative ${className}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onTap}
      >
        <div
          style={{
            transition: "opacity 0.18s",
            opacity: flipped ? 0 : 1,
            pointerEvents: flipped ? "none" : "auto",
          }}
          aria-hidden={flipped}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{
            transition: "opacity 0.18s",
            opacity: flipped ? 1 : 0,
            pointerEvents: flipped ? "auto" : "none",
          }}
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flip-card relative ${className}`}
      style={{ perspective: "1200px" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 1 }}
      >
        <div
          className="h-full w-full"
          style={{ backfaceVisibility: "hidden" }}
          aria-hidden={flipped}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
