"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { LetterpressStamp } from "@/components/letterpress-stamp";
import { spring } from "@/lib/motion";

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
  const x = useSpring(xValue, spring.magnetic);
  const y = useSpring(yValue, spring.magnetic);

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    xValue.set((event.clientX - rect.left - rect.width  / 2) * 0.1);
    yValue.set((event.clientY - rect.top  - rect.height / 2) * 0.1);
  };

  const reset = () => { xValue.set(0); yValue.set(0); };

  const variantClass =
    variant === "primary"
      ? "border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-hover)]"
      : "border-2 border-[color:var(--foreground)] bg-[color:var(--background)] text-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]";

  return (
    <motion.span style={reduceMotion ? undefined : { x, y }} className="inline-flex">
      <LetterpressStamp className="rounded-lg">
        <Link
          href={href}
          target={target}
          rel={rel}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          className={`group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] ${variantClass} ${className}`}
        >
          {children}
        </Link>
      </LetterpressStamp>
    </motion.span>
  );
}
