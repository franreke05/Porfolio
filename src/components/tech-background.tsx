"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { backgroundMotion } from "@/lib/motion";

export type TechBackgroundDensity = "auto" | "compact" | "standard" | "rich";

export type TechBackgroundColors = {
  base: string;
  cyan: string;
  gold: string;
  opacity: number;
  glow: number;
};

export type TechBackgroundProps = {
  /**
   * Controls how many traces, nodes and pulses are rendered.
   * `auto` renders the compact set on small screens and the standard set elsewhere.
   */
  density?: TechBackgroundDensity;
  /**
   * Maximum scroll-linked parallax distance in pixels.
   * Mobile automatically receives a smaller multiplier.
   */
  scrollStrength?: number;
  /**
   * Theme overrides. Values are exposed as CSS variables on the root layer.
   */
  colors?: Partial<TechBackgroundColors>;
};

export const TECH_BACKGROUND_DEFAULTS = {
  density: "auto",
  scrollStrength: 72,
  colors: {
    base: "#070a10",
    cyan: "#52d0dc",
    gold: "#c39356",
    opacity: 0.58,
    glow: 0.42,
  },
} satisfies Required<TechBackgroundProps>;

type CircuitTone = "cyan" | "gold";
type CircuitLevel = 0 | 1 | 2;

type CircuitTrace = {
  d: string;
  level: CircuitLevel;
};

type CircuitNode = {
  cx: number;
  cy: number;
  r: number;
  tone: CircuitTone;
  level: CircuitLevel;
};

type CircuitPulse = {
  path: string;
  delay: number;
  duration: number;
  tone: CircuitTone;
  level: CircuitLevel;
};

type CircuitParticle = {
  cx: number;
  cy: number;
  r: number;
  tone: CircuitTone;
  delay: number;
  level: CircuitLevel;
};

const DENSITY_LEVEL: Record<Exclude<TechBackgroundDensity, "auto">, CircuitLevel> = {
  compact: 0,
  standard: 1,
  rich: 2,
};

const CIRCUIT_TRACES = [
  { d: "M 70 170 H 282 V 238 H 438", level: 0 },
  { d: "M 992 118 H 1188 V 214 H 1356", level: 0 },
  { d: "M 150 668 H 374 V 590 H 532", level: 0 },
  { d: "M 856 728 H 1080 V 604 H 1284", level: 0 },
  { d: "M 650 118 V 286 H 822 V 396", level: 1 },
  { d: "M 468 770 V 626 H 646 V 514", level: 1 },
  { d: "M 1118 366 H 964 V 456 H 760", level: 1 },
  { d: "M 238 382 H 424 V 462 H 614", level: 1 },
  { d: "M 72 430 H 196 V 512 H 354", level: 2 },
  { d: "M 782 86 V 206 H 912 V 292 H 1034", level: 2 },
  { d: "M 1144 754 V 684 H 1350", level: 2 },
  { d: "M 552 344 H 704 V 264 H 804", level: 2 },
] as const satisfies readonly CircuitTrace[];

const CIRCUIT_NODES = [
  { cx: 70, cy: 170, r: 3, tone: "cyan", level: 0 },
  { cx: 282, cy: 238, r: 2.6, tone: "gold", level: 0 },
  { cx: 438, cy: 238, r: 3.5, tone: "cyan", level: 0 },
  { cx: 992, cy: 118, r: 3, tone: "gold", level: 0 },
  { cx: 1188, cy: 214, r: 2.6, tone: "cyan", level: 0 },
  { cx: 1356, cy: 214, r: 3.5, tone: "gold", level: 0 },
  { cx: 150, cy: 668, r: 3, tone: "gold", level: 0 },
  { cx: 532, cy: 590, r: 3, tone: "cyan", level: 0 },
  { cx: 856, cy: 728, r: 3.5, tone: "cyan", level: 0 },
  { cx: 1284, cy: 604, r: 3, tone: "gold", level: 0 },
  { cx: 650, cy: 286, r: 2.5, tone: "cyan", level: 1 },
  { cx: 822, cy: 396, r: 3, tone: "gold", level: 1 },
  { cx: 468, cy: 626, r: 3, tone: "gold", level: 1 },
  { cx: 646, cy: 514, r: 2.6, tone: "cyan", level: 1 },
  { cx: 964, cy: 456, r: 2.8, tone: "cyan", level: 1 },
  { cx: 760, cy: 456, r: 3, tone: "gold", level: 1 },
  { cx: 238, cy: 382, r: 2.6, tone: "cyan", level: 1 },
  { cx: 614, cy: 462, r: 3.2, tone: "gold", level: 1 },
  { cx: 196, cy: 512, r: 2.4, tone: "cyan", level: 2 },
  { cx: 354, cy: 512, r: 3, tone: "gold", level: 2 },
  { cx: 782, cy: 206, r: 2.6, tone: "gold", level: 2 },
  { cx: 1034, cy: 292, r: 3, tone: "cyan", level: 2 },
  { cx: 1144, cy: 684, r: 3, tone: "cyan", level: 2 },
  { cx: 1350, cy: 684, r: 2.6, tone: "gold", level: 2 },
  { cx: 704, cy: 264, r: 2.6, tone: "cyan", level: 2 },
  { cx: 804, cy: 264, r: 3, tone: "gold", level: 2 },
] as const satisfies readonly CircuitNode[];

const CIRCUIT_PULSES = [
  { path: "M 70 170 H 282 V 238 H 438", delay: 0, duration: 8.6, tone: "cyan", level: 0 },
  { path: "M 992 118 H 1188 V 214 H 1356", delay: 2.1, duration: 9.4, tone: "gold", level: 0 },
  { path: "M 150 668 H 374 V 590 H 532", delay: 4.2, duration: 10.2, tone: "cyan", level: 0 },
  { path: "M 856 728 H 1080 V 604 H 1284", delay: 1.2, duration: 9.8, tone: "gold", level: 1 },
  { path: "M 650 118 V 286 H 822 V 396", delay: 3.3, duration: 10.8, tone: "cyan", level: 1 },
  { path: "M 1118 366 H 964 V 456 H 760", delay: 5.1, duration: 11.2, tone: "gold", level: 2 },
] as const satisfies readonly CircuitPulse[];

const CIRCUIT_PARTICLES = [
  { cx: 210, cy: 138, r: 1.8, tone: "cyan", delay: 0.2, level: 0 },
  { cx: 1214, cy: 338, r: 2.2, tone: "gold", delay: 1.4, level: 0 },
  { cx: 396, cy: 746, r: 1.7, tone: "cyan", delay: 2.6, level: 0 },
  { cx: 930, cy: 636, r: 2, tone: "cyan", delay: 0.9, level: 1 },
  { cx: 604, cy: 212, r: 1.7, tone: "gold", delay: 3.2, level: 1 },
  { cx: 742, cy: 800, r: 2.1, tone: "cyan", delay: 1.9, level: 1 },
  { cx: 1304, cy: 104, r: 1.7, tone: "gold", delay: 3.8, level: 2 },
  { cx: 104, cy: 520, r: 1.9, tone: "cyan", delay: 2.2, level: 2 },
] as const satisfies readonly CircuitParticle[];

type TechBackgroundStyle = CSSProperties & {
  "--tech-bg-base": string;
  "--tech-bg-cyan": string;
  "--tech-bg-gold": string;
  "--tech-bg-opacity": string;
  "--tech-bg-glow": string;
};

/**
 * Fixed circuit-board background for the whole portfolio.
 *
 * Performance notes:
 * - The circuit geometry is static module data and filtered only when density changes.
 * - Motion drives scroll parallax with transform/opacity; React does not run per frame.
 * - SVG pulse animations are disabled for `prefers-reduced-motion`.
 *
 * Theme knobs:
 * - `colors` maps to `--tech-bg-*` CSS variables.
 * - `density` controls visible traces/nodes/pulses.
 * - `scrollStrength` controls the maximum parallax distance.
 */
export function TechBackground({
  density = TECH_BACKGROUND_DEFAULTS.density,
  scrollStrength = TECH_BACKGROUND_DEFAULTS.scrollStrength,
  colors,
}: TechBackgroundProps) {
  const compactViewport = useCompactViewport();
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll();

  const resolvedDensity =
    density === "auto" ? (compactViewport ? "compact" : "standard") : density;
  const densityLevel = DENSITY_LEVEL[resolvedDensity];
  const mobileMultiplier = resolvedDensity === "compact" ? 0.39 : 1;
  const parallaxDistance = reducedMotion ? 0 : scrollStrength * mobileMultiplier;

  const patternY = useTransform(scrollYProgress, [0, 1], [0, -parallaxDistance]);
  const auraY = useTransform(scrollYProgress, [0, 1], [0, parallaxDistance * 0.55]);
  const patternOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reducedMotion ? [1, 1, 1] : [0.9, 1, 0.86],
  );

  const visibleTraces = useMemo(
    () => CIRCUIT_TRACES.filter((trace) => trace.level <= densityLevel),
    [densityLevel],
  );
  const visibleNodes = useMemo(
    () => CIRCUIT_NODES.filter((node) => node.level <= densityLevel),
    [densityLevel],
  );
  const visiblePulses = useMemo(
    () => CIRCUIT_PULSES.filter((pulse) => pulse.level <= densityLevel),
    [densityLevel],
  );
  const visibleParticles = useMemo(
    () => CIRCUIT_PARTICLES.filter((particle) => particle.level <= densityLevel),
    [densityLevel],
  );

  const mergedColors = { ...TECH_BACKGROUND_DEFAULTS.colors, ...colors };
  const rootStyle: TechBackgroundStyle = {
    "--tech-bg-base": mergedColors.base,
    "--tech-bg-cyan": mergedColors.cyan,
    "--tech-bg-gold": mergedColors.gold,
    "--tech-bg-opacity": String(mergedColors.opacity),
    "--tech-bg-glow": String(mergedColors.glow),
  };

  return (
    <div className="tech-bg-root" style={rootStyle} aria-hidden="true">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="tech-bg-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tech-bg-grain)" />
      </svg>

      <div className="tech-bg-depth" />
      <div className="tech-bg-circuit-grid" />
      <div className="tech-bg-dots" />

      <motion.div className="tech-bg-svg-shell" style={{ y: patternY, opacity: patternOpacity }}>
        <svg
          className="tech-bg-circuit-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="tech-bg-trace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--tech-bg-cyan)" stopOpacity="0.42" />
              <stop offset="55%" stopColor="var(--tech-bg-gold)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--tech-bg-cyan)" stopOpacity="0.1" />
            </linearGradient>
            <filter id="tech-bg-glow-filter" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="tech-bg-trace-layer">
            {visibleTraces.map((trace, index) => (
              <motion.path
                key={trace.d}
                d={trace.d}
                fill="none"
                stroke="url(#tech-bg-trace-gradient)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: 0.18 }
                    : { opacity: [0.11, 0.28, 0.13], pathLength: [0.46, 1, 0.62] }
                }
                transition={{
                  ...backgroundMotion.trace,
                  duration: backgroundMotion.trace.duration + index * 0.55,
                  delay: index * 0.34,
                }}
              />
            ))}
          </g>

          <g className="tech-bg-node-layer" filter="url(#tech-bg-glow-filter)">
            {visibleNodes.map((node, index) => (
              <motion.circle
                key={`${node.cx}-${node.cy}`}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                className={node.tone === "cyan" ? "tech-bg-node-cyan" : "tech-bg-node-gold"}
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: 0.34 }
                    : { opacity: [0.24, 0.86, 0.3], scale: [1, 1.32, 1] }
                }
                transition={{
                  ...backgroundMotion.node,
                  duration: backgroundMotion.node.duration + index * 0.1,
                  delay: index * 0.18,
                }}
              />
            ))}
          </g>

          {!reducedMotion && (
            <g className="tech-bg-pulse-layer" filter="url(#tech-bg-glow-filter)">
              {visiblePulses.map((pulse, index) => (
                <motion.circle
                  key={`${pulse.path}-${index}`}
                  r="2.6"
                  className={pulse.tone === "cyan" ? "tech-bg-node-cyan" : "tech-bg-node-gold"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.86, 0] }}
                  transition={{
                    duration: pulse.duration,
                    delay: pulse.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <animateMotion
                    dur={`${pulse.duration}s`}
                    begin={`${pulse.delay}s`}
                    repeatCount="indefinite"
                    path={pulse.path}
                  />
                </motion.circle>
              ))}
            </g>
          )}

          {!reducedMotion && (
            <g className="tech-bg-particle-layer" filter="url(#tech-bg-glow-filter)">
              {visibleParticles.map((particle, index) => (
                <motion.circle
                  key={`${particle.cx}-${particle.cy}`}
                  cx={particle.cx}
                  cy={particle.cy}
                  r={particle.r}
                  className={particle.tone === "cyan" ? "tech-bg-node-cyan" : "tech-bg-node-gold"}
                  initial={false}
                  animate={{
                    x: [0, 8, -5, 0],
                    y: [0, -18, 0],
                    opacity: [0.16, 0.64, 0.16],
                  }}
                  transition={{
                    ...backgroundMotion.particle,
                    duration: backgroundMotion.particle.duration + index * 0.35,
                    delay: particle.delay,
                  }}
                />
              ))}
            </g>
          )}
        </svg>
      </motion.div>

      <div className="tech-bg-diagonal-circuits" />

      <motion.div className="tech-bg-orb-anchor" style={{ left: "-14%", top: "-10%", y: auraY }}>
        <div className="tech-bg-orb tech-orb-gold-hero" style={{ width: 900, height: 900 }} />
      </motion.div>
      <motion.div className="tech-bg-orb-anchor" style={{ right: "-12%", top: "4%", y: auraY }}>
        <div className="tech-bg-orb tech-orb-cyan-hero" style={{ width: 760, height: 760 }} />
      </motion.div>
      <motion.div className="tech-bg-orb-anchor" style={{ left: "-16%", top: "42%", y: auraY }}>
        <div className="tech-bg-orb tech-orb-gold-mid" style={{ width: 640, height: 640 }} />
      </motion.div>
      <motion.div className="tech-bg-orb-anchor" style={{ right: "-10%", top: "70%", y: auraY }}>
        <div className="tech-bg-orb tech-orb-cyan-low" style={{ width: 580, height: 580 }} />
      </motion.div>

      <div className="tech-bg-scanlines" />
      <div className="tech-bg-vignette" />
    </div>
  );
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateCompact = () => setCompact(mediaQuery.matches);

    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);

    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  return compact;
}
