"use client";

// Adapted from reactbits.dev (MIT + Commons Clause) — rewritten to TypeScript.
// sparkColor accepts a CSS var() reference (resolved to its computed hex value
// at draw time, since the Canvas 2D API can't read CSS custom properties directly).
import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

type Spark = { x: number; y: number; angle: number; startTime: number };

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-in-out" | "ease-out";
  extraScale?: number;
  className?: string;
  children: ReactNode;
};

function resolveColor(value: string): string {
  if (typeof window === "undefined" || !value.startsWith("var(")) return value;
  const match = /var\((--[\w-]+)\)/.exec(value);
  if (!match) return value;
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || value;
}

export function ClickSpark({
  sparkColor = "var(--primary)",
  sparkSize = 9,
  sparkRadius = 16,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  className,
  children,
}: ClickSparkProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sparksRef  = useRef<Spark[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);
    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":       return t;
        case "ease-in":      return t * t;
        case "ease-in-out":  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:             return t * (2 - t);
      }
    },
    [easing],
  );

  useEffect(() => {
    if (reduceMotion) return; // no canvas animation loop for reduced-motion users
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resolvedColor = resolveColor(sparkColor);
    let animationId: number;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [reduceMotion, sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      })),
    );
  };

  return (
    <div className={className} style={{ position: "relative" }} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}
