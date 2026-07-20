"use client";

// Adapted from reactbits.dev (MIT + Commons Clause) — rewritten to TypeScript,
// locale switched to es-ES to match the site's language.
import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

type CountUpProps = {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
};

export function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1.4,
  className = "",
  startWhen = true,
  separator = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const formatValue = useCallback(
    (latest: number) => {
      const formatted = Intl.NumberFormat("es-ES", { useGrouping: !!separator }).format(
        Math.round(latest),
      );
      return separator ? formatted.replace(/\./g, separator) : formatted;
    },
    [separator],
  );

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(direction === "down" ? to : from);
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!isInView || !startWhen) return;

    const timeoutId = setTimeout(() => {
      motionValue.set(direction === "down" ? from : to);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [isInView, startWhen, motionValue, direction, from, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
