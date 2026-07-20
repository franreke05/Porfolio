"use client";

// Adapted from reactbits.dev (MIT + Commons Clause) — rewritten to TypeScript,
// defaults switched to the site's gold/cyan brand tokens. CSS lives in
// globals.css under "GRADIENT TEXT" instead of a separate stylesheet, matching
// how the rest of this codebase's one-off visual utilities are organized.
import { useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
};

export function GradientText({
  children,
  className = "",
  colors = ["var(--primary)", "var(--accent-cyan)", "var(--primary)"],
  animationSpeed = 6,
  showBorder = false,
  direction = "horizontal",
}: GradientTextProps) {
  const reduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (reduceMotion || isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;

    const fullCycle = animationDuration * 2;
    const cycleTime = elapsedRef.current % fullCycle;
    progress.set(
      cycleTime < animationDuration
        ? (cycleTime / animationDuration) * 100
        : 100 - ((cycleTime - animationDuration) / animationDuration) * 100,
    );
  });

  const backgroundPosition = useTransform(progress, (p) =>
    direction === "vertical" ? `50% ${p}%` : `${p}% 50%`,
  );

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const gradientAngle =
    direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right";
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === "horizontal" ? "300% 100%" : direction === "vertical" ? "100% 300%" : "300% 300%",
    backgroundRepeat: "repeat",
    backgroundPosition: reduceMotion ? "50% 50%" : backgroundPosition,
  };

  return (
    <motion.span
      className={`gradient-text ${showBorder ? "gradient-text-border" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && <motion.span className="gradient-text-overlay" style={gradientStyle} />}
      <motion.span className="gradient-text-content" style={gradientStyle}>
        {children}
      </motion.span>
    </motion.span>
  );
}
