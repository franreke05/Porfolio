"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  target?: string;
  rel?: string;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const x = useSpring(xValue, { stiffness: 200, damping: 20 });
  const y = useSpring(yValue, { stiffness: 200, damping: 20 });

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    xValue.set((event.clientX - rect.left - rect.width  / 2) * 0.1);
    yValue.set((event.clientY - rect.top  - rect.height / 2) * 0.1);
  };

  const reset = () => { xValue.set(0); yValue.set(0); };

  const variantClass =
    variant === "primary"
      ? "bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-hover)]"
      : "border border-[color:var(--border-hover)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] hover:border-[color:var(--primary)]/70 hover:text-[color:var(--primary)]";

  return (
    <motion.span style={reduceMotion ? undefined : { x, y }} className="inline-flex">
      <Link
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={`group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] ${variantClass} ${className}`}
      >
        {children}
      </Link>
    </motion.span>
  );
}
